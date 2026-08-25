let serialPort = null;
let serialWriter = null;
let currentPreset = 0;
let presetData = [];

const NOTE_NAMES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

function midiToNote(midi) {
  return NOTE_NAMES[midi % 12];
}
function midiToOctave(midi) {
  return Math.floor(midi / 12) - 2;
}
function noteToMidi(name, octave) {
  return NOTE_NAMES.indexOf(name) + (octave + 2) * 12;
}

function numInputHtml(ctrl, idx, value) {
  return `<div class="ctrl-num-wrap">` +
    `<input type="number" min="0" max="127" value="${value}" data-ctrl="${ctrl}" data-idx="${idx}" data-field="number">` +
    `<div class="ctrl-num-chevrons">` +
    `<button type="button" data-ctrl="${ctrl}" data-idx="${idx}" data-dir="1">&#9650;</button>` +
    `<button type="button" data-ctrl="${ctrl}" data-idx="${idx}" data-dir="-1">&#9660;</button>` +
    `</div></div>`;
}

function channelSelectHtml(ctrl, idx, channel) {
  let opts = "";
  for (let ch = 0; ch < 16; ch++) {
    opts += `<option value="${ch}" ${ch === channel ? "selected" : ""}>${ch + 1}</option>`;
  }
  return `<select data-ctrl="${ctrl}" data-idx="${idx}" data-field="channel" class="ctrl-ch">${opts}</select>`;
}

function noteSelectHtml(midi, idx) {
  const noteName = midiToNote(midi);
  const octave = midiToOctave(midi);
  let noteOpts = NOTE_NAMES.map(n =>
    `<option value="${n}" ${n === noteName ? "selected" : ""}>${n}</option>`
  ).join("");
  let octOpts = "";
  for (let o = -2; o <= 8; o++) {
    octOpts += `<option value="${o}" ${o === octave ? "selected" : ""}>${o}</option>`;
  }
  return `<select data-ctrl="btn" data-idx="${idx}" data-field="note-name" class="ctrl-note">${noteOpts}</select>` +
         `<select data-ctrl="btn" data-idx="${idx}" data-field="note-oct" class="ctrl-oct">${octOpts}</select>`;
}

for (let p = 0; p < 6; p++) {
  presetData[p] = { encoders: [], buttons: [] };
  for (let i = 0; i < 8; i++) {
    presetData[p].encoders[i] = { type: 0, number: 0, channel: 0, name: "" };
    presetData[p].buttons[i] = { type: 0, number: 0, channel: 0, toggle: false, name: "" };
  }
}

async function connectSerial() {
  const stateEl = document.getElementById("midi-state");
  try {
    serialPort = await navigator.serial.requestPort();
    await serialPort.open({ baudRate: 115200 });
    serialWriter = serialPort.writable.getWriter();
    stateEl.textContent = "Connected (Serial)";
    stateEl.style.color = "#4caf50";
    document.getElementById("controller-config").classList.remove("hidden");
    document.getElementById("midi-connected-options").classList.remove("hidden");
    readSerialLoop();
    requestPreset(currentPreset);
  } catch (e) {
    stateEl.textContent = "Serial error: " + e.message;
    stateEl.style.color = "#f44";
  }
}

async function readSerialLoop() {
  const reader = serialPort.readable.getReader();
  let buf = [];
  let inSysEx = false;
  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      for (const b of value) {
        if (b === 0xF0) {
          inSysEx = true;
          buf = [b];
        } else if (inSysEx) {
          buf.push(b);
          if (b === 0xF7) {
            inSysEx = false;
            onMessage(new Uint8Array(buf));
          }
        }
      }
    }
  } catch (e) {
    console.error("Serial read error", e);
    const stateEl = document.getElementById("midi-state");
    stateEl.textContent = "Disconnected";
    stateEl.style.color = "#f44";
    document.getElementById("controller-config").classList.add("hidden");
    document.getElementById("midi-connected-options").classList.add("hidden");
  }
}

async function serialSend(bytes) {
  if (!serialWriter) return;
  await serialWriter.write(new Uint8Array(bytes));
}

function requestPreset(preset) {
  serialSend([0xf0, 0x6f, 0x07, preset, 0xf7]);
}

function onMessage(d) {
  if (d[0] !== 0xf0 || d[1] !== 0x6f) return;
  const status = d[2];

  if (status === 0x0e) {
    const layout = d[3];
    document.querySelectorAll(".layout-tab").forEach((btn) => {
      btn.classList.toggle("active", parseInt(btn.dataset.layout) === layout);
    });
    return;
  }

  if (status === 0x10) {
    const seconds = ((d[3] & 0x7F) << 7) | (d[4] & 0x7F);
    const select = document.getElementById("screensaver-select");
    if (select) select.value = String(seconds);
    return;
  }

  const preset = d[3];
  const idx = d[4];
  if (preset >= 6 || idx >= 8) return;

  if (status === 0x0c) {
    presetData[preset].encoders[idx] = {
      type: d[5],
      number: d[6],
      channel: d[7],
      name: presetData[preset].encoders[idx].name || "",
    };
  } else if (status === 0x0d) {
    presetData[preset].buttons[idx] = {
      type: d[5],
      number: d[6],
      channel: d[7],
      toggle: d[8] === 1,
      name: presetData[preset].buttons[idx].name || "",
    };
  } else if (status === 0x0f) {
    const isButton = d[5];
    let name = "";
    for (let j = 6; j < d.length - 1; j++) {
      name += String.fromCharCode(d[j]);
    }
    if (isButton) {
      presetData[preset].buttons[idx].name = name;
    } else {
      presetData[preset].encoders[idx].name = name;
    }
  }

  if (preset === currentPreset) {
    renderControls();
  }
}

function sendFullPreset(preset) {
  const pd = presetData[preset];
  for (let i = 0; i < 8; i++) {
    sendEncoder(preset, i);
    sendButton(preset, i);
    if (pd.encoders[i].name) sendControlName(preset, i, 0, pd.encoders[i].name);
    if (pd.buttons[i].name) sendControlName(preset, i, 1, pd.buttons[i].name);
  }
}

function renderControls() {
  const grid = document.getElementById("controls-grid");
  grid.innerHTML = "";
  const pd = presetData[currentPreset];

  for (let i = 0; i < 8; i++) {
    const enc = pd.encoders[i];
    const btn = pd.buttons[i];

    const card = document.createElement("div");
    card.className = "ctrl-card";
    card.innerHTML = `
      <div class="ctrl-number">${i + 1}</div>
      <div class="ctrl-row">
        <span class="ctrl-label">Button</span>
        <input type="text" maxlength="11" value="${btn.name}" placeholder="Name"
               data-ctrl="btn" data-idx="${i}" data-field="name" class="ctrl-name">
      </div>
      <div class="ctrl-row">
        <select data-ctrl="btn" data-idx="${i}" data-field="type" class="ctrl-type">
          <option value="0" ${btn.type === 0 ? "selected" : ""}>CC</option>
          <option value="1" ${btn.type === 1 ? "selected" : ""}>Note</option>
        </select>
        ${btn.type === 1
          ? noteSelectHtml(btn.number, i)
          : numInputHtml("btn", i, btn.number)}
        <span class="ctrl-ch-label">Ch</span>
        ${channelSelectHtml("btn", i, btn.channel)}
        <label class="toggle-label ${btn.type === 0 ? '' : 'hidden'}" data-toggle-for="${i}">
          <input type="checkbox" ${btn.toggle ? "checked" : ""}
                 data-ctrl="btn" data-idx="${i}" data-field="toggle">
          Toggle
        </label>
      </div>
      <hr>
      <div class="ctrl-row">
        <span class="ctrl-label">Encoder</span>
        <input type="text" maxlength="11" value="${enc.name}" placeholder="Name"
               data-ctrl="enc" data-idx="${i}" data-field="name" class="ctrl-name">
      </div>
      <div class="ctrl-row">
        <span class="ctrl-type-fixed">CC</span>
        ${numInputHtml("enc", i, enc.number)}
        <span class="ctrl-ch-label">Ch</span>
        ${channelSelectHtml("enc", i, enc.channel)}
      </div>
    `;
    grid.appendChild(card);
  }

  grid.querySelectorAll("select, input").forEach((el) => {
    el.addEventListener("change", onControlChange);
  });

  grid.querySelectorAll(".ctrl-num-chevrons button").forEach((btn) => {
    btn.addEventListener("click", () => {
      const wrap = btn.closest(".ctrl-num-wrap");
      const input = wrap.querySelector("input");
      const dir = parseInt(btn.dataset.dir);
      let val = Math.min(127, Math.max(0, parseInt(input.value) + dir));
      input.value = val;
      input.dispatchEvent(new Event("change", { bubbles: true }));
    });
  });
}

function onControlChange(e) {
  const el = e.target;
  const ctrl = el.dataset.ctrl;
  const idx = parseInt(el.dataset.idx);
  const field = el.dataset.field;
  const pd = presetData[currentPreset];

  if (ctrl === "enc") {
    if (field === "number") pd.encoders[idx].number = parseInt(el.value);
    if (field === "channel") pd.encoders[idx].channel = parseInt(el.value);
    if (field === "name") {
      pd.encoders[idx].name = el.value;
      sendControlName(currentPreset, idx, 0, el.value);
      return;
    }
    sendEncoder(currentPreset, idx);
  } else if (ctrl === "btn") {
    if (field === "type") {
      pd.buttons[idx].type = parseInt(el.value);
      sendButton(currentPreset, idx);
      renderControls();
      return;
    }
    if (field === "number") pd.buttons[idx].number = parseInt(el.value);
    if (field === "note-name" || field === "note-oct") {
      const card = el.closest(".ctrl-card");
      const nameEl = card.querySelector('[data-field="note-name"]');
      const octEl = card.querySelector('[data-field="note-oct"]');
      pd.buttons[idx].number = noteToMidi(nameEl.value, parseInt(octEl.value));
    }
    if (field === "channel") pd.buttons[idx].channel = parseInt(el.value);
    if (field === "toggle") pd.buttons[idx].toggle = el.checked;
    if (field === "name") {
      pd.buttons[idx].name = el.value;
      sendControlName(currentPreset, idx, 1, el.value);
      return;
    }
    sendButton(currentPreset, idx);
  }
}

function sendEncoder(preset, idx) {
  const enc = presetData[preset].encoders[idx];
  serialSend([0xf0, 0x6f, 0x0d, preset, idx, enc.type, enc.number, enc.channel, 0xf7]);
}

function sendButton(preset, idx) {
  const btn = presetData[preset].buttons[idx];
  serialSend([0xf0, 0x6f, 0x0c, preset, idx, btn.type, btn.number, btn.channel, btn.toggle ? 1 : 0, 0xf7]);
}

function sendControlName(preset, idx, isButton, name) {
  const bytes = [0xf0, 0x6f, 0x0f, preset, idx, isButton];
  for (let i = 0; i < name.length && i < 11; i++) {
    bytes.push(name.charCodeAt(i));
  }
  bytes.push(0xf7);
  serialSend(bytes);
}

async function savePresetToFile() {
  const pd = presetData[currentPreset];
  const data = { preset: currentPreset + 1, encoders: pd.encoders, buttons: pd.buttons };
  const json = JSON.stringify(data, null, 2);
  try {
    const handle = await window.showSaveFilePicker({
      suggestedName: `param8-preset-${currentPreset + 1}.json`,
      types: [{ description: "JSON", accept: { "application/json": [".json"] } }],
    });
    const writable = await handle.createWritable();
    await writable.write(json);
    await writable.close();
  } catch (e) {
    if (e.name !== "AbortError") console.error("Save failed", e);
  }
}

function loadPresetFromFile(file) {
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const data = JSON.parse(e.target.result);
      if (!data.encoders || !data.buttons) return;
      for (let i = 0; i < 8; i++) {
        if (data.encoders[i]) presetData[currentPreset].encoders[i] = data.encoders[i];
        if (data.buttons[i]) presetData[currentPreset].buttons[i] = data.buttons[i];
      }
      sendFullPreset(currentPreset);
      renderControls();
    } catch (err) {
      console.error("Invalid preset file", err);
    }
  };
  reader.readAsText(file);
}

function initControllerUI() {
  document.querySelectorAll(".preset-tab").forEach((btn) => {
    btn.addEventListener("click", () => {
      currentPreset = parseInt(btn.dataset.preset);
      document.querySelectorAll(".preset-tab").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      requestPreset(currentPreset);
    });
  });

  document.getElementById("ctrl-save").addEventListener("click", savePresetToFile);

  document.getElementById("screensaver-select").addEventListener("change", (e) => {
    sendScreensaverTimeout(parseInt(e.target.value));
  });

  const loadInput = document.getElementById("ctrl-load-input");
  document.getElementById("ctrl-load").addEventListener("click", () => loadInput.click());
  loadInput.addEventListener("change", (e) => {
    if (e.target.files[0]) {
      loadPresetFromFile(e.target.files[0]);
      e.target.value = "";
    }
  });

  renderControls();
}

function sendLayoutChange(layoutValue) {
  serialSend([0xf0, 0x6f, 0x0e, layoutValue, 0xf7]);
}

function sendScreensaverTimeout(seconds) {
  serialSend([0xf0, 0x6f, 0x10, (seconds >> 7) & 0x7f, seconds & 0x7f, 0xf7]);
}
