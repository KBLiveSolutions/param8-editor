const BUTTON_FUNCTION_TABLE = [
  { id: 1,  label: 'Play',               group: 'Transport' },
  { id: 2,  label: 'Stop',               group: 'Transport' },
  { id: 3,  label: 'Loop Toggle',        group: 'Transport' },
  { id: 4,  label: 'Continue',           group: 'Transport' },
  { id: 5,  label: 'Arr. Record',        group: 'Transport' },
  { id: 6,  label: 'Undo',              group: 'Transport' },
  { id: 7,  label: 'Redo',              group: 'Transport' },
  { id: 8,  label: 'Tempo +1',          group: 'Transport' },
  { id: 9,  label: 'Tempo -1',          group: 'Transport' },
  { id: 26, label: 'Restart',           group: 'Transport' },
  { id: 27, label: 'Capture MIDI',      group: 'Transport' },
  { id: 28, label: 'Re-enable Auto.',   group: 'Transport' },
  { id: 31, label: 'Metronome',         group: 'Transport' },
  { id: 32, label: 'Back to Arr.',      group: 'Transport' },
  { id: 33, label: 'Skip Forward',      group: 'Transport' },
  { id: 34, label: 'Skip Backward',     group: 'Transport' },
  { id: 14, label: 'Launch Scene',      group: 'Session' },
  { id: 15, label: 'Prev Scene',        group: 'Session' },
  { id: 16, label: 'Next Scene',        group: 'Session' },
  { id: 17, label: 'Session Record',    group: 'Session' },
  { id: 40, label: 'Stop All Clips',    group: 'Session' },
  { id: 43, label: 'Prev Track',        group: 'Session' },
  { id: 44, label: 'Next Track',        group: 'Session' },
  { id: 18, label: 'Prev Marker',       group: 'Arrangement' },
  { id: 19, label: 'Next Marker',       group: 'Arrangement' },
  { id: 48, label: 'Prev Device',       group: 'Device' },
  { id: 49, label: 'Next Device',       group: 'Device' },
  { id: 50, label: 'Prev Variation',    group: 'Device' },
  { id: 51, label: 'Next Variation',    group: 'Device' },
  { id: 52, label: 'Launch Variation',  group: 'Device' },
  { id: 53, label: 'Store Variation',   group: 'Device' },
  { id: 54, label: 'Randomize',        group: 'Device' },
];

const ENCODER_FUNCTION_TABLE = [
  { id: 73,  label: 'Last Selected Param', group: 'Global' },
  { id: 37,  label: 'Global Groove',       group: 'Global' },
  { id: 89,  label: 'Master Volume',       group: 'Global' },
  { id: 90,  label: 'Cue Volume',          group: 'Global' },
  { id: 87,  label: 'BPM',               group: 'Global' },
  { id: 112, label: 'Track Select',        group: 'Global' },
  { id: 91,  label: 'Track Volume',        group: 'Selected Track' },
  { id: 96,  label: 'Track Pan',           group: 'Selected Track' },
  { id: 59,  label: 'Send A',              group: 'Selected Track' },
  { id: 60,  label: 'Send B',              group: 'Selected Track' },
  { id: 86,  label: 'Scroll Scenes',       group: 'Session' },
  { id: 83,  label: 'Skip Fwd/Bwd',        group: 'Arrangement' },
  { id: 84,  label: 'Loop Position',       group: 'Arrangement' },
  { id: 85,  label: 'Loop Length',         group: 'Arrangement' },
  { id: 88,  label: 'Jump Marker',         group: 'Arrangement' },
  { id: 99,  label: 'Horizontal Zoom',     group: 'Arrangement' },
];

let serialPort = null;
let serialWriter = null;
let serialReader = null;

const FW_REPO = "kblivesolutions/param8-firmware";
const FW_BRANCH = "main";
const FW_MANIFEST_URL = `https://raw.githubusercontent.com/${FW_REPO}/${FW_BRANCH}/manifest.json`;

let currentFirmwareVersion = null;
let latestFirmwareInfo = null;
let currentPreset = 0;
let presetData = [];
let retryRequestTimeout = null;

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

function noteSelectHtml(midi, idx, ctrl = "btn") {
  const noteName = midiToNote(midi);
  const octave = midiToOctave(midi);
  let noteOpts = NOTE_NAMES.map(n =>
    `<option value="${n}" ${n === noteName ? "selected" : ""}>${n}</option>`
  ).join("");
  let octOpts = "";
  for (let o = -2; o <= 8; o++) {
    octOpts += `<option value="${o}" ${o === octave ? "selected" : ""}>${o}</option>`;
  }
  return `<select data-ctrl="${ctrl}" data-idx="${idx}" data-field="note-name" class="ctrl-note">${noteOpts}</select>` +
         `<select data-ctrl="${ctrl}" data-idx="${idx}" data-field="note-oct" class="ctrl-oct">${octOpts}</select>`;
}

function fnMenuHtml(ctrl, idx, table, currentFnId) {
  const entry = table.find(f => f.id === currentFnId);
  const label = entry ? entry.label : '—';
  const groups = {};
  for (const f of table) (groups[f.group] = groups[f.group] || []).push(f);
  let inner = '';
  for (const [g, items] of Object.entries(groups)) {
    inner += `<div class="fnm-group">
      <div class="fnm-group-hdr">${g}<span class="fnm-arr">▸</span></div>
      <div class="fnm-sub">${items.map(f =>
        `<div class="fnm-item" data-value="${f.id}">${f.label}</div>`
      ).join('')}</div>
    </div>`;
  }
  return `<div class="fnm" data-ctrl="${ctrl}" data-idx="${idx}">
    <button class="fnm-trigger" type="button">${label} <span class="fnm-caret">▾</span></button>
    <div class="fnm-dropdown" style="display:none">${inner}</div>
  </div>`;
}

function attachFnmListeners(container, onItemSelect) {
  container.querySelectorAll('.fnm').forEach(menu => {
    const dropdown = menu.querySelector('.fnm-dropdown');
    menu.querySelector('.fnm-trigger').addEventListener('click', e => {
      e.stopPropagation();
      const wasOpen = dropdown.style.display === 'block';
      document.querySelectorAll('.fnm-dropdown').forEach(d => { d.style.display = 'none'; });
      if (!wasOpen) {
        const rect = e.currentTarget.getBoundingClientRect();
        dropdown.style.position = 'fixed';
        dropdown.style.top  = (rect.bottom + 2) + 'px';
        dropdown.style.left = rect.left + 'px';
        dropdown.style.display = 'block';
      }
    });
    menu.querySelectorAll('.fnm-item').forEach(item => {
      item.addEventListener('click', e => {
        e.stopPropagation();
        dropdown.style.display = 'none';
        onItemSelect(menu.dataset.ctrl, parseInt(menu.dataset.idx), parseInt(item.dataset.value));
      });
    });
  });
}

for (let p = 0; p < 24; p++) {
  presetData[p] = { encoders: [], buttons: [], presetName: "" };
  for (let i = 0; i < 8; i++) {
    presetData[p].encoders[i] = { type: 0, number: 0, channel: 0, min: 0, max: 127, name: "", isFunction: false, fnId: 73 };
    presetData[p].buttons[i]  = { type: 0, number: 0, channel: 0, toggle: false, min: 0, max: 127, name: "", isFunction: false, fnId: 1 };
  }
}

let globalData = {
  encoders: Array.from({ length: 8 }, () => ({ fnId: 73 })),
  buttons:  Array.from({ length: 8 }, () => ({ fnId: 1 })),
};

function setDisconnectedUI() {
  const stateEl = document.getElementById("midi-state");
  stateEl.textContent = "Disconnected";
  stateEl.style.color = "#f44";
  document.getElementById("midi-connected-options").classList.add("hidden");
  document.getElementById("midi-connect").classList.remove("hidden");
  document.getElementById("midi-disconnect").classList.add("hidden");
}

async function disconnectSerial() {
  if (serialReader) {
    await serialReader.cancel();
    serialReader = null;
  }
  if (serialWriter) {
    serialWriter.releaseLock();
    serialWriter = null;
  }
  if (serialPort) {
    await serialPort.close();
    serialPort = null;
  }
  setDisconnectedUI();
}

async function connectSerial(port) {
  const stateEl = document.getElementById("midi-state");
  if (!("serial" in navigator)) {
    stateEl.textContent = "Web Serial not supported — use Chrome or Edge.";
    stateEl.style.color = "#f44";
    return;
  }
  try {
    if (!port) port = await navigator.serial.requestPort();
    serialPort = port;
    await serialPort.open({ baudRate: 115200, bufferSize: 4096 });
    serialWriter = serialPort.writable.getWriter();
    stateEl.textContent = "Connected (Serial)";
    stateEl.style.color = "#4caf50";
    document.getElementById("controller-config").classList.remove("hidden");
    document.getElementById("midi-connected-options").classList.remove("hidden");
    document.getElementById("midi-connect").classList.add("hidden");
    document.getElementById("midi-disconnect").classList.remove("hidden");
    readSerialLoop();
    await new Promise((r) => setTimeout(r, 500));
    requestPreset(currentPreset);
    requestGlobal();
    requestVersion();
    retryRequestTimeout = setTimeout(() => {
      if (presetData[currentPreset].encoders[0].number === 0 &&
          presetData[currentPreset].encoders[0].name === "") {
        requestPreset(currentPreset);
      }
    }, 2000);
  } catch (e) {
    stateEl.textContent = "Serial error: " + e.message;
    stateEl.style.color = "#f44";
  }
}

async function autoConnect() {
  if (!("serial" in navigator)) return;
  const ports = await navigator.serial.getPorts();
  if (ports.length > 0) {
    connectSerial(ports[0]);
  }
}

async function readSerialLoop() {
  serialReader = serialPort.readable.getReader();
  let buf = [];
  let inSysEx = false;
  try {
    while (true) {
      const { value, done } = await serialReader.read();
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
    if (serialPort !== null) console.error("Serial read error", e);
  } finally {
    serialReader = null;
    setDisconnectedUI();
  }
}

async function serialSend(bytes) {
  if (!serialWriter) return;
  await serialWriter.write(new Uint8Array(bytes));
}

function requestPreset(preset) {
  serialSend([0xf0, 0x6f, 0x07, preset, 0xf7]);
}

function requestVersion() {
  serialSend([0xf0, 0x6f, 0x13, 0x00, 0xf7]);
}

function compareVersions(a, b) {
  const pa = a.split(".").map((n) => parseInt(n, 10) || 0);
  const pb = b.split(".").map((n) => parseInt(n, 10) || 0);
  for (let i = 0; i < 3; i++) {
    if (pa[i] !== pb[i]) return pa[i] - pb[i];
  }
  return 0;
}

async function fetchLatestFirmwareInfo() {
  try {
    const res = await fetch(FW_MANIFEST_URL, { cache: "no-store" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    latestFirmwareInfo = await res.json();
  } catch (e) {
    console.error("Firmware manifest fetch failed:", e);
    latestFirmwareInfo = null;
  }
  updateFirmwareVersionUI();
}

function updateFirmwareVersionUI() {
  const versionEl = document.getElementById("fw-version");
  const banner = document.getElementById("fw-update-banner");
  const textEl = document.getElementById("fw-update-text");
  const downloadLink = document.getElementById("fw-update-download");
  if (!versionEl || !banner || !textEl || !downloadLink) return;

  if (currentFirmwareVersion) {
    versionEl.textContent = `Firmware v${currentFirmwareVersion}`;
    versionEl.classList.remove("hidden");
  }

  if (currentFirmwareVersion && latestFirmwareInfo && latestFirmwareInfo.version) {
    if (compareVersions(latestFirmwareInfo.version, currentFirmwareVersion) > 0) {
      textEl.textContent = `Update available: v${latestFirmwareInfo.version}`;
      downloadLink.href = `https://github.com/${FW_REPO}/releases/download/v${latestFirmwareInfo.version}/${latestFirmwareInfo.file}`;
      downloadLink.setAttribute("download", latestFirmwareInfo.file);
      banner.classList.remove("hidden");
      return;
    }
  }
  banner.classList.add("hidden");
}

function onMessage(d) {
  if (d[0] !== 0xf0 || d[1] !== 0x6f) return;
  const status = d[2];
  console.log("SysEx received:", Array.from(d).map(b => b.toString(16)).join(" "));

  if (status === 0x14) {
    currentFirmwareVersion = `${d[3]}.${d[4]}.${d[5]}`;
    updateFirmwareVersionUI();
    return;
  }

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

  if (status === 0x1B) {
    const brightness = d[3] & 0x7F;
    const select = document.getElementById("brightness-select");
    if (select) select.value = String(brightness);
    return;
  }

  if (status === 0x1c) {
    const idx = d[3];
    if (idx >= 8) return;
    globalData.encoders[idx].fnId = d[4];
    renderGlobalControls();
    return;
  }

  if (status === 0x1d) {
    const idx = d[3];
    if (idx >= 8) return;
    globalData.buttons[idx].fnId = d[4];
    renderGlobalControls();
    return;
  }

  if (status === 0x11) {
    const preset = d[3];
    if (preset >= 24) return;
    let name = "";
    for (let j = 4; j < d.length - 1; j++) {
      name += String.fromCharCode(d[j]);
    }
    presetData[preset].presetName = name;
    if (preset === currentPreset) {
      const input = document.getElementById("preset-name-input");
      if (input) input.value = name;
    }
    return;
  }

  const preset = d[3];
  const idx = d[4];
  if (preset >= 24 || idx >= 8) return;

  if (status === 0x0c) {
    // firmware sends: d[5]=ControlMidiType (0=CC,3=AT,4=PB), d[8]=hiRes
    // convert to editor type: 0=CC, 1=CC14bit, 2=AT, 3=PB
    const fwType = d[5], hiRes = d[8] === 1;
    const encType = (fwType === 3) ? 2 : (fwType === 4) ? 3 : (hiRes ? 1 : 0);
    presetData[preset].encoders[idx] = {
      type: encType,
      number: d[6],
      channel: d[7],
      min: d.length > 9  ? d[9]  : 0,
      max: d.length > 10 ? d[10] : 127,
      name: presetData[preset].encoders[idx].name || "",
      isFunction: d.length > 11 ? d[11] === 1 : false,
      fnId:       d.length > 12 ? d[12] : 73,
    };
  } else if (status === 0x0d) {
    presetData[preset].buttons[idx] = {
      type: d[5],
      number: d[6],
      channel: d[7],
      toggle: d[8] === 1,
      min: d.length > 9  ? d[9]  : 0,
      max: d.length > 10 ? d[10] : 127,
      name: presetData[preset].buttons[idx].name || "",
      isFunction: d.length > 11 ? d[11] === 1 : false,
      fnId:       d.length > 12 ? d[12] : 1,
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
  if (pd.presetName) sendPresetName(preset, pd.presetName);
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

    const fnTabs = (ctrl, idx, isFunc) =>
      `<div class="ctrl-fn-tabs">
        <button class="ctrl-fn-tab ctrl-fn-tab-user${!isFunc ? ' active' : ''}" data-ctrl="${ctrl}" data-idx="${idx}" data-val="false">User</button>
        <button class="ctrl-fn-tab ctrl-fn-tab-daw${isFunc  ? ' active' : ''}" data-ctrl="${ctrl}" data-idx="${idx}" data-val="true">DAW</button>
      </div>`;

    const encoderBlock = enc.isFunction
      ? `<div class="ctrl-section">
           <div class="ctrl-section-label">TURN</div>
           ${fnTabs("enc", i, true)}
           <div class="ctrl-fields">${fnMenuHtml("enc", i, ENCODER_FUNCTION_TABLE, enc.fnId)}</div>
         </div>`
      : `<div class="ctrl-section">
           <div class="ctrl-section-label">TURN</div>
           ${fnTabs("enc", i, false)}
           <input type="text" maxlength="11" value="${enc.name}" placeholder="Name"
                  data-ctrl="enc" data-idx="${i}" data-field="name" class="ctrl-name">
           <div class="ctrl-fields">
             <select data-ctrl="enc" data-idx="${i}" data-field="type" class="ctrl-type">
               <option value="0" ${enc.type === 0 ? "selected" : ""}>CC</option>
               <option value="1" ${enc.type === 1 ? "selected" : ""}>CC 14bit</option>
               <option value="2" ${enc.type === 2 ? "selected" : ""}>AT</option>
               <option value="3" ${enc.type === 3 ? "selected" : ""}>PB</option>
             </select>
             ${(enc.type === 0 || enc.type === 1) ? numInputHtml("enc", i, enc.number) : ''}
             <span class="ctrl-ch-label">Ch</span>
             ${channelSelectHtml("enc", i, enc.channel)}
           </div>
           <div class="ctrl-fields ctrl-range">
             <span class="ctrl-range-label">Min</span>
             <input type="number" min="0" max="127" value="${enc.min}"
                    data-ctrl="enc" data-idx="${i}" data-field="min" class="ctrl-range-input">
             <span class="ctrl-range-label">Max</span>
             <input type="number" min="0" max="127" value="${enc.max}"
                    data-ctrl="enc" data-idx="${i}" data-field="max" class="ctrl-range-input">
           </div>
         </div>`;

    const buttonBlock = btn.isFunction
      ? `<div class="ctrl-section ctrl-section-push">
           <div class="ctrl-section-label">PUSH</div>
           ${fnTabs("btn", i, true)}
           <div class="ctrl-fields">${fnMenuHtml("btn", i, BUTTON_FUNCTION_TABLE, btn.fnId)}</div>
         </div>`
      : `<div class="ctrl-section ctrl-section-push">
           <div class="ctrl-section-label">PUSH</div>
           ${fnTabs("btn", i, false)}
           <input type="text" maxlength="11" value="${btn.name}" placeholder="Name"
                  data-ctrl="btn" data-idx="${i}" data-field="name" class="ctrl-name">
           <div class="ctrl-fields">
             <select data-ctrl="btn" data-idx="${i}" data-field="type" class="ctrl-type">
               <option value="0" ${btn.type === 0 ? "selected" : ""}>CC</option>
               <option value="1" ${btn.type === 1 ? "selected" : ""}>Note</option>
               <option value="2" ${btn.type === 2 ? "selected" : ""}>PC</option>
             </select>
             ${btn.type === 1 ? noteSelectHtml(btn.number, i) : numInputHtml("btn", i, btn.number)}
             <span class="ctrl-ch-label">Ch</span>
             ${channelSelectHtml("btn", i, btn.channel)}
             <label class="toggle-label ${btn.type === 0 ? '' : 'hidden'}" data-toggle-for="${i}">
               <input type="checkbox" ${btn.toggle ? "checked" : ""}
                      data-ctrl="btn" data-idx="${i}" data-field="toggle">
               Tgl
             </label>
           </div>
           <div class="ctrl-fields ctrl-range">
             <span class="ctrl-range-label">Min</span>
             <input type="number" min="0" max="127" value="${btn.min}"
                    data-ctrl="btn" data-idx="${i}" data-field="min" class="ctrl-range-input">
             <span class="ctrl-range-label">Max</span>
             <input type="number" min="0" max="127" value="${btn.max}"
                    data-ctrl="btn" data-idx="${i}" data-field="max" class="ctrl-range-input">
           </div>
         </div>`;

    card.innerHTML = `
      <div class="ctrl-number">${i + 1}</div>
      <hr class="ctrl-separator">
      ${encoderBlock}
      ${buttonBlock}
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

  grid.querySelectorAll(".ctrl-fn-tab").forEach(tab => {
    tab.addEventListener("click", () => {
      const pd = presetData[currentPreset];
      const ctrl = tab.dataset.ctrl;
      const idx  = parseInt(tab.dataset.idx);
      const isFunction = tab.dataset.val === "true";
      if (ctrl === "enc") pd.encoders[idx].isFunction = isFunction;
      else                pd.buttons[idx].isFunction  = isFunction;
      if (ctrl === "enc") sendEncoder(currentPreset, idx);
      else                sendButton(currentPreset, idx);
      renderControls();
    });
  });

  attachFnmListeners(grid, (ctrl, idx, fnId) => {
    const pd = presetData[currentPreset];
    if (ctrl === 'enc') pd.encoders[idx].fnId = fnId;
    else                pd.buttons[idx].fnId  = fnId;
    if (ctrl === 'enc') sendEncoder(currentPreset, idx);
    else                sendButton(currentPreset, idx);
    renderControls();
  });
}

function onControlChange(e) {
  const el = e.target;
  const ctrl = el.dataset.ctrl;
  const idx = parseInt(el.dataset.idx);
  const field = el.dataset.field;
  const pd = presetData[currentPreset];

  if (ctrl === "enc") {
    if (field === "type") {
      pd.encoders[idx].type = parseInt(el.value);
      sendEncoder(currentPreset, idx);
      renderControls();
      return;
    }
    if (field === "number") pd.encoders[idx].number = parseInt(el.value);
    if (field === "channel") pd.encoders[idx].channel = parseInt(el.value);
    if (field === "min") pd.encoders[idx].min = Math.min(parseInt(el.value), pd.encoders[idx].max - 1);
    if (field === "max") pd.encoders[idx].max = Math.max(parseInt(el.value), pd.encoders[idx].min + 1);
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
    if (field === "min") pd.buttons[idx].min = Math.min(parseInt(el.value), pd.buttons[idx].max);
    if (field === "max") pd.buttons[idx].max = Math.max(parseInt(el.value), pd.buttons[idx].min);
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
  serialSend([0xf0, 0x6f, 0x0d, preset, idx, enc.type, enc.number ?? 0, enc.channel,
              enc.type === 1 ? 1 : 0, enc.min ?? 0, enc.max ?? 127,
              enc.isFunction ? 1 : 0, enc.isFunction ? enc.fnId : 0,
              0xf7]);
}

function sendButton(preset, idx) {
  const btn = presetData[preset].buttons[idx];
  serialSend([0xf0, 0x6f, 0x0c, preset, idx, btn.type, btn.number, btn.channel,
              btn.toggle ? 1 : 0, btn.min ?? 0, btn.max ?? 127,
              btn.isFunction ? 1 : 0, btn.isFunction ? btn.fnId : 0,
              0xf7]);
}

function sendPresetName(preset, name) {
  const bytes = [0xf0, 0x6f, 0x11, preset];
  for (let i = 0; i < name.length && i < 19; i++) {
    bytes.push(name.charCodeAt(i));
  }
  bytes.push(0xf7);
  serialSend(bytes);
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
  const data = { preset: currentPreset + 1, presetName: pd.presetName, encoders: pd.encoders, buttons: pd.buttons };
  const json = JSON.stringify(data, null, 2);
  const filename = `param8-preset-${currentPreset + 1}.json`;
  if (window.showSaveFilePicker) {
    try {
      const handle = await window.showSaveFilePicker({
        suggestedName: filename,
        types: [{ description: "JSON", accept: { "application/json": [".json"] } }],
      });
      const writable = await handle.createWritable();
      await writable.write(json);
      await writable.close();
    } catch (e) {
      if (e.name !== "AbortError") console.error("Save failed", e);
    }
  } else {
    const url = URL.createObjectURL(new Blob([json], { type: "application/json" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
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
      if (data.presetName !== undefined) {
        presetData[currentPreset].presetName = data.presetName;
        document.getElementById("preset-name-input").value = data.presetName || "";
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
  // Mode tabs (User / Global)
  document.querySelectorAll(".preset-tab").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".preset-tab").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      document.querySelectorAll(".mode-section").forEach((s) => s.classList.add("hidden"));
      document.getElementById("mode-" + btn.dataset.mode).classList.remove("hidden");
      if (btn.dataset.mode === "global") renderGlobalControls();
    });
  });

  renderGlobalControls();

  // Preset selector (1–24)
  const presetSelect = document.getElementById("preset-select");
  for (let i = 1; i <= 24; i++) {
    const opt = document.createElement("option");
    opt.value = i - 1;
    opt.textContent = "Preset " + i;
    presetSelect.appendChild(opt);
  }
  presetSelect.addEventListener("change", () => {
    currentPreset = parseInt(presetSelect.value);
    const nameInput = document.getElementById("preset-name-input");
    nameInput.value = presetData[currentPreset].presetName || "";
    nameInput.placeholder = "Preset " + (currentPreset + 1);
    requestPreset(currentPreset);
  });

  const presetNameInput = document.getElementById("preset-name-input");
  presetNameInput.addEventListener("change", () => {
    presetData[currentPreset].presetName = presetNameInput.value;
    sendPresetName(currentPreset, presetNameInput.value);
  });

  document.getElementById("ctrl-save").addEventListener("click", savePresetToFile);

  document.getElementById("screensaver-select").addEventListener("change", (e) => {
    sendScreensaverTimeout(parseInt(e.target.value));
  });

  document.getElementById("brightness-select").addEventListener("change", (e) => {
    sendBrightness(parseInt(e.target.value));
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

function sendBrightness(value) {
  serialSend([0xf0, 0x6f, 0x1b, value & 0x7f, 0xf7]);
}

function requestGlobal() {
  serialSend([0xf0, 0x6f, 0x1e, 0xf7]);
}

function sendGlobalEncoder(idx) {
  serialSend([0xf0, 0x6f, 0x1c, idx, globalData.encoders[idx].fnId, 0xf7]);
}

function sendGlobalButton(idx) {
  serialSend([0xf0, 0x6f, 0x1d, idx, globalData.buttons[idx].fnId, 0xf7]);
}

function renderGlobalControls() {
  const container = document.getElementById("mode-global");
  container.innerHTML = "";

  const grid = document.createElement("div");
  grid.className = "controls-grid";
  grid.style.marginTop = "12px";

  for (let i = 0; i < 8; i++) {
    const card = document.createElement("div");
    card.className = "ctrl-card";
    card.innerHTML = `
      <div class="ctrl-number">${i + 1}</div>
      <hr class="ctrl-separator">
      <div class="ctrl-section">
        <div class="ctrl-section-label">TURN</div>
        <div class="ctrl-fields">
          ${fnMenuHtml("genc", i, ENCODER_FUNCTION_TABLE, globalData.encoders[i].fnId)}
        </div>
      </div>
      <div class="ctrl-section ctrl-section-push">
        <div class="ctrl-section-label">PUSH</div>
        <div class="ctrl-fields">
          ${fnMenuHtml("gbtn", i, BUTTON_FUNCTION_TABLE, globalData.buttons[i].fnId)}
        </div>
      </div>
    `;
    grid.appendChild(card);
  }

  container.appendChild(grid);

  attachFnmListeners(grid, (ctrl, idx, fnId) => {
    if (ctrl === 'genc') {
      globalData.encoders[idx].fnId = fnId;
      sendGlobalEncoder(idx);
    } else {
      globalData.buttons[idx].fnId = fnId;
      sendGlobalButton(idx);
    }
    renderGlobalControls();
  });
}

document.addEventListener('click', () => {
  document.querySelectorAll('.fnm-dropdown').forEach(d => { d.style.display = 'none'; });
});
