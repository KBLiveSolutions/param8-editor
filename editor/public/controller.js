const BUTTON_FUNCTION_TABLE = [
  // Global
  { id: 52, label: 'Play',              group: 'Global' },
  { id:  2, label: 'Stop',              group: 'Global' },
  { id:  3, label: 'Undo',              group: 'Global' },
  { id:  4, label: 'Redo',              group: 'Global' },
  { id:  5, label: 'Tempo +1',          group: 'Global' },
  { id:  6, label: 'Tempo -1',          group: 'Global' },
  { id:  7, label: 'Session Record',      group: 'Session' },
  { id:  8, label: 'Re-enable Auto.',   group: 'Global' },
  { id: 50, label: 'Metronome',         group: 'Global' },
  { id: 57, label: 'Return to Default', group: 'Global' },
  { id: 29, label: 'Capture',            group: 'Global' },
  // Arrangement (113-119: moved from 11-17 to avoid conflict with device mode encoder CCs)
  { id:  56, label: 'Arr. Loop',         group: 'Arrangement' },
  { id: 116, label: 'Arr. Record',       group: 'Arrangement' },
  { id: 113, label: 'Continue',          group: 'Arrangement' },
  // { id: 114, label: 'Restart',           group: 'Arrangement' },
  { id: 118, label: 'Marker +',          group: 'Arrangement' },
  { id: 117, label: 'Marker -',          group: 'Arrangement' },
  { id: 119, label: 'Skip Forward',      group: 'Arrangement' },
  { id:  18, label: 'Skip Backward',     group: 'Arrangement' },
  { id: 115, label: 'Back to Arr.',      group: 'Arrangement' },
  // Session
  { id: 48, label: 'Scene +',           group: 'Session' },
  { id: 49, label: 'Scene -',           group: 'Session' },
  { id: 53, label: 'Launch Scene',      group: 'Session' },
  { id: 28, label: 'Stop All Clips',    group: 'Session' },
  // Track
  { id: 21, label: 'Track +',           group: 'Selected Track' },
  { id: 20, label: 'Track -',           group: 'Selected Track' },
  { id: 54, label: 'Mute',              group: 'Selected Track' },
  { id: 55, label: 'Solo',              group: 'Selected Track' },
  { id: 51, label: 'Arm',               group: 'Selected Track' },
  // Device
  { id: 25, label: 'Device +',          group: 'Device' },
  { id: 24, label: 'Device -',          group: 'Device' },
  { id: 27, label: 'Bank +',            group: 'Device' },
  { id: 26, label: 'Bank -',            group: 'Device' },
  { id: 23, label: 'Compare A/B',       group: 'Device' },
  { id: 22, label: 'Device On',       group: 'Device' },
  // { id: 36, label: 'Prev Variation',    group: 'Device' },
  // { id: 37, label: 'Next Variation',    group: 'Device' },
  // { id: 38, label: 'Launch Variation',  group: 'Device' },
  // { id: 39, label: 'Store Variation',   group: 'Device' },
  // { id: 40, label: 'Randomize',         group: 'Device' },
  // Navigation (fnIds match CCs expected by component layers)
  { id: 31, label: 'Preset +',          group: 'Navigation' },
  { id: 30, label: 'Preset -',          group: 'Navigation' },
  // Go to Preset 1-24 (fnIds 120-143)
  ...Array.from({ length: 24 }, (_, i) => ({ id: 120 + i, label: `Preset ${i + 1}`, group: 'Navigation', subgroup: 'Go to Preset' })),
];

const ENCODER_FUNCTION_TABLE = [
  // Mixer / Global (ids = CCs expected by MixerComponent layer)
  { id: 40, label: 'Master Volume',     group: 'Global' },
  { id: 41, label: 'Cue Volume',        group: 'Global' },
  { id: 42, label: 'BPM',               group: 'Global' },
  { id: 63, label: 'Groove',            group: 'Global' },
  { id: 43, label: 'Scene Select',     group: 'Global' },
  { id: 47, label: 'Selected Param',    group: 'Global' },
  // Selected Track (ids = CCs expected by MixerComponent layer)
  { id: 44, label: 'Track Volume',      group: 'Selected Track' },
  { id: 45, label: 'Track Pan',         group: 'Selected Track' },
  { id: 76, label: 'Track Select',      group: 'Selected Track' },
  // Arrangement (ids = CCs expected by ArrangementComponent layer)
  { id: 46, label: 'Song Position',     group: 'Arrangement' },
  { id: 59, label: 'Loop Position',     group: 'Arrangement' },
  { id: 60, label: 'Loop Length',       group: 'Arrangement' },
  { id: 62, label: 'Jump Marker',       group: 'Arrangement' },
  { id: 61, label: 'Hor. Zoom',           group: 'Arrangement' },
  // Sends A-L (subgroup under Selected Track)
  { id: 64, label: 'Send A',            group: 'Selected Track', subgroup: 'Sends' },
  { id: 65, label: 'Send B',            group: 'Selected Track', subgroup: 'Sends' },
  { id: 66, label: 'Send C',            group: 'Selected Track', subgroup: 'Sends' },
  { id: 67, label: 'Send D',            group: 'Selected Track', subgroup: 'Sends' },
  { id: 68, label: 'Send E',            group: 'Selected Track', subgroup: 'Sends' },
  { id: 69, label: 'Send F',            group: 'Selected Track', subgroup: 'Sends' },
  { id: 70, label: 'Send G',            group: 'Selected Track', subgroup: 'Sends' },
  { id: 71, label: 'Send H',            group: 'Selected Track', subgroup: 'Sends' },
  { id: 72, label: 'Send I',            group: 'Selected Track', subgroup: 'Sends' },
  { id: 73, label: 'Send J',            group: 'Selected Track', subgroup: 'Sends' },
  { id: 74, label: 'Send K',            group: 'Selected Track', subgroup: 'Sends' },
  { id: 75, label: 'Send L',            group: 'Selected Track', subgroup: 'Sends' },
  // Device Params 1-16
  ...Array.from({ length: 16 }, (_, i) => ({ id: 80 + i, label: `Param ${i + 1}`, group: 'Device' })),
  // Navigation
  { id: 58, label: 'Select Preset',     group: 'Navigation' },
];

let serialPort = null;
let serialWriter = null;
let serialReader = null;

let serialLogBuf = "";
const SERIAL_LOG_MAX = 500;

function appendLogLine(text, color) {
  const el = document.getElementById("serial-log-output");
  if (!el) return;
  const div = document.createElement("div");
  if (color) div.style.color = color;
  div.textContent = text;
  el.appendChild(div);
  while (el.children.length > SERIAL_LOG_MAX) el.removeChild(el.firstChild);
  el.scrollTop = el.scrollHeight;
}

function logSerialByte(b) {
  if (b === 0x0A) {
    const line = serialLogBuf.replace(/\r$/, "");
    serialLogBuf = "";
    if (line.length === 0) return;
    appendLogLine(line, "#4c4");
  } else if (b !== 0x0D) {
    serialLogBuf += String.fromCharCode(b);
  }
}

function hexStr(bytes) {
  return Array.from(bytes).map(b => b.toString(16).padStart(2, "0").toUpperCase()).join(" ");
}

const FW_REPO = "kblivesolutions/param8-firmware";
const FW_BRANCH = "main";
const FW_MANIFEST_URL = `https://raw.githubusercontent.com/${FW_REPO}/${FW_BRANCH}/manifest.json`;

let currentFirmwareVersion = null;
let currentScriptVersion = null;
let latestFirmwareInfo = null;
let currentPreset = 0;
let presetDirty = false;
let globalDirty = false;
let presetData = [];
let _dragSrc = -1;
let _dragType = null;
let _dragGhost = null;
let _dragOverCard = null;
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
  for (const f of table) {
    if (!groups[f.group]) groups[f.group] = { direct: [], sub: {} };
    if (f.subgroup) {
      if (!groups[f.group].sub[f.subgroup]) groups[f.group].sub[f.subgroup] = [];
      groups[f.group].sub[f.subgroup].push(f);
    } else {
      groups[f.group].direct.push(f);
    }
  }
  let inner = '';
  for (const [g, { direct, sub }] of Object.entries(groups)) {
    let subContent = direct.map(f =>
      `<div class="fnm-item" data-value="${f.id}">${f.label}</div>`
    ).join('');
    for (const [sg, sgItems] of Object.entries(sub)) {
      subContent += `<div class="fnm-group fnm-nested">
        <div class="fnm-group-hdr">${sg}<span class="fnm-arr">▸</span></div>
        <div class="fnm-sub">${sgItems.map(f =>
          `<div class="fnm-item" data-value="${f.id}">${f.label}</div>`
        ).join('')}</div>
      </div>`;
    }
    inner += `<div class="fnm-group">
      <div class="fnm-group-hdr">${g}<span class="fnm-arr">▸</span></div>
      <div class="fnm-sub">${subContent}</div>
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
        const tr = e.currentTarget.getBoundingClientRect();
        dropdown.style.position = 'fixed';
        dropdown.style.top = '-9999px'; dropdown.style.left = '-9999px';
        dropdown.style.display = 'block';
        const dw = dropdown.offsetWidth, dh = dropdown.offsetHeight;
        const vw = window.innerWidth, vh = window.innerHeight;
        dropdown.style.top  = (tr.bottom + 2 + dh <= vh ? tr.bottom + 2 : Math.max(4, tr.top - dh - 2)) + 'px';
        dropdown.style.left = Math.max(4, Math.min(tr.left, vw - dw - 4)) + 'px';
      }
    });
    menu.querySelectorAll('.fnm-group').forEach(group => {
      const sub = group.querySelector('.fnm-sub');
      group.addEventListener('mouseenter', () => {
        const hdr = group.querySelector('.fnm-group-hdr').getBoundingClientRect();
        sub.style.top = '-9999px'; sub.style.left = '-9999px';
        sub.style.display = 'block';
        const sw = sub.offsetWidth, sh = sub.offsetHeight;
        const vw = window.innerWidth, vh = window.innerHeight;
        sub.style.left = (hdr.right + sw <= vw ? hdr.right : Math.max(4, hdr.left - sw)) + 'px';
        sub.style.top  = Math.max(4, Math.min(hdr.top, vh - sh - 4)) + 'px';
      });
      group.addEventListener('mouseleave', () => { sub.style.display = 'none'; });
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
  presetData[p] = { encoders: [], buttons: [], presetName: "", labels: [0, 0, 0, 0] };
  for (let i = 0; i < 8; i++) {
    presetData[p].encoders[i] = { type: 0, number: 0, channel: 0, min: 0, max: 127, name: "", isFunction: false, fnId: 55};
    presetData[p].buttons[i]  = { type: 0, number: 0, channel: 0, pressMode: 0, min: 0, max: 127, name: "", isFunction: false, fnId: 1 };
  }
}

let globalData = {
  encoders: Array.from({ length: 8 }, (_, i) => ({ fnId: 40 + i })),
  buttons:  Array.from({ length: 8 }, (_, i) => ({ fnId: 50 + i })),
  labels: [0, 0, 0, 0],
};

function updateSendButton() {
  const connected = !!serialWriter;
  const btn = document.getElementById("ctrl-send");
  if (btn) { btn.disabled = !connected; btn.classList.toggle("primary", connected && presetDirty); }
  const gbtn = document.getElementById("global-send");
  if (gbtn) { gbtn.disabled = !connected; gbtn.classList.toggle("primary", connected && globalDirty); }
}

function markDirty() { presetDirty = true; updateSendButton(); }
function markClean() { presetDirty = false; updateSendButton(); }
function markGlobalDirty() { globalDirty = true; updateSendButton(); }
function markGlobalClean() { globalDirty = false; updateSendButton(); }

function setDisconnectedUI() {
  const stateEl = document.getElementById("midi-state");
  stateEl.textContent = "param8 not connected";
  stateEl.style.color = "#888";
  const fwVer = document.getElementById("fw-version"); if (fwVer) fwVer.classList.add("hidden");
  document.getElementById("settings-connected").classList.add("hidden");
  document.getElementById("settings-disconnected").classList.remove("hidden");
  document.getElementById("midi-connect").classList.remove("hidden");
  document.getElementById("midi-disconnect").classList.add("hidden");
  currentScriptVersion = null;
  currentFirmwareVersion = null;
  updateScriptVersionUI();
  applyFirmwareCapabilities();
  document.getElementById("serial-log-panel").classList.add("hidden");
  updateSendButton();
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
    updateSendButton();
    document.getElementById("settings-connected").classList.remove("hidden");
    document.getElementById("settings-disconnected").classList.add("hidden");
    document.getElementById("midi-connect").classList.add("hidden");
    document.getElementById("midi-disconnect").classList.remove("hidden");
    readSerialLoop();
    await new Promise((r) => setTimeout(r, 500));
    requestPreset(currentPreset);
    requestGlobal();
    requestVersion();
    requestSmooth();
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
            appendLogLine(`← ${hexStr(buf)}`, "#48f");
            onMessage(new Uint8Array(buf));
          }
        } else {
          logSerialByte(b);
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
  appendLogLine(`→ ${hexStr(bytes)}`, "#fa0");
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

function fwAtLeast(major, minor) {
  if (!currentFirmwareVersion) return true;
  const [ma, mi] = currentFirmwareVersion.split('.').map(Number);
  return ma > major || (ma === major && mi >= minor);
}

function applyFirmwareCapabilities() {
  const v11 = fwAtLeast(1, 1);
  document.body.classList.toggle('fw-v11', v11);
  if (!v11) {
    const activeTab = document.querySelector('.main-tab.active');
    if (activeTab && activeTab.dataset.tab === 'global') {
      document.querySelector('.main-tab[data-tab="user"]').click();
    }
  }
}

function updateFirmwareVersionUI() {
  const banner = document.getElementById("fw-update-banner");
  const textEl = document.getElementById("fw-update-text");
  const downloadLink = document.getElementById("fw-update-download");
  if (!banner || !textEl || !downloadLink) return;

  applyFirmwareCapabilities();
  if (currentFirmwareVersion) {
    const settingsVer = document.getElementById("fw-version-settings");
    if (settingsVer) settingsVer.textContent = `v${currentFirmwareVersion}`;
    const sep = document.getElementById("settings-ver-sep");
    if (sep) sep.classList.remove("hidden");
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

function updateScriptVersionUI() {
  const banner = document.getElementById("script-update-banner");
  if (!banner) return;
  if (currentFirmwareVersion && currentScriptVersion &&
      compareVersions(currentFirmwareVersion, currentScriptVersion) > 0) {
    banner.classList.remove("hidden");
  } else {
    banner.classList.add("hidden");
  }
}

function onMessage(d) {
  if (d[0] !== 0xf0 || d[1] !== 0x6f) return;
  const status = d[2];
  console.log("SysEx received:", Array.from(d).map(b => b.toString(16)).join(" "));

  if (status === 0x04) {
    const preset = d[3];
    if (preset < 24) {
      currentPreset = preset;
      const presetSelect = document.getElementById("preset-select");
      if (presetSelect) presetSelect.value = String(preset);
      const nameInput = document.getElementById("preset-name-input");
      if (nameInput) {
        nameInput.value = presetData[preset].presetName || "";
        nameInput.placeholder = "Preset " + (preset + 1);
      }
      requestPreset(preset);
      renderControls();
    }
    return;
  }

  if (status === 0x14) {
    currentFirmwareVersion = `${d[3]}.${d[4]}.${d[5]}`;
    updateFirmwareVersionUI();
    updateScriptVersionUI();
    return;
  }

  if (status === 0x23) {
    currentScriptVersion = `${d[3]}.${d[4]}.${d[5]}`;
    updateScriptVersionUI();
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

  if (status === 0x29) {
    const select = document.getElementById("leds-select");
    if (select) select.value = String(d[3] & 0x01);
    return;
  }

  if (status === 0x24) {
    updateSmoothUI('latch', d[3] & 0x7f, d[4] & 0x7f, d[5] & 0x7f);
    return;
  }

  if (status === 0x25) {
    updateSmoothUI('revert', d[3] & 0x7f, d[4] & 0x7f, d[5] & 0x7f);
    return;
  }

  if (status === 0x1c) {
    const idx = d[3];
    if (idx >= 8) return;
    globalData.encoders[idx].fnId = d[4];
    renderGlobalControls();
    markGlobalClean();
    return;
  }

  if (status === 0x1d) {
    const idx = d[3];
    if (idx >= 8) return;
    globalData.buttons[idx].fnId = d[4];
    renderGlobalControls();
    markGlobalClean();
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

  if (status === 0x28) {
    const lPreset = d[3];
    if (d.length < 9) return;
    const labs = [d[4] & 0x07, d[5] & 0x07, d[6] & 0x07, d[7] & 0x07];
    if (lPreset === 24) {
      globalData.labels = labs;
      renderGlobalControls();
      markGlobalClean();
    } else if (lPreset < 24) {
      presetData[lPreset].labels = labs;
      if (lPreset === currentPreset) { renderControls(); markClean(); }
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
      fnId:       d.length > 12 ? d[12] : 55,
    };
  } else if (status === 0x0d) {
    presetData[preset].buttons[idx] = {
      type: d[5],
      number: d[6],
      channel: d[7],
      pressMode: d[8] < 3 ? d[8] : 0,
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
    markClean();
  }
}

function sendLabelConfig(preset, labels) {
  const l = labels || [0, 0, 0, 0];
  serialSend([0xF0, 0x6F, 0x28, preset & 0x7F,
    (l[0] ?? 0) & 0x07, (l[1] ?? 0) & 0x07,
    (l[2] ?? 0) & 0x07, (l[3] ?? 0) & 0x07, 0xF7]);
}

function sendFullGlobal() {
  for (let i = 0; i < 8; i++) {
    sendGlobalEncoder(i);
    sendGlobalButton(i);
  }
  sendLabelConfig(24, globalData.labels);
  serialSend([0xF0, 0x6F, 0x27, 0x00, 0xF7]);
}

async function saveGlobalToFile() {
  const data = { encoders: globalData.encoders, buttons: globalData.buttons, labels: globalData.labels };
  const jsonStr = JSON.stringify(data, null, 2);
  const filename = "param8-global.json";
  let saved = false;
  if (window.showSaveFilePicker) {
    try {
      const handle = await window.showSaveFilePicker({
        suggestedName: filename,
        types: [{ description: "JSON", accept: { "application/json": [".json"] } }],
      });
      const writable = await handle.createWritable();
      await writable.write(jsonStr);
      await writable.close();
      saved = true;
    } catch (e) {
      if (e.name === "AbortError") return;
      if (e.name !== "SecurityError") console.error("Save failed", e);
    }
  }
  if (!saved) {
    const url = URL.createObjectURL(new Blob([jsonStr], { type: "application/json" }));
    const a = document.createElement("a");
    a.href = url; a.download = filename; a.click();
    URL.revokeObjectURL(url);
  }
}

function applyGlobalText(text) {
  try {
    const data = JSON.parse(text);
    if (!data.encoders || !data.buttons) return;
    for (let i = 0; i < 8; i++) {
      if (data.encoders[i]) globalData.encoders[i] = { ...globalData.encoders[i], ...data.encoders[i] };
      if (data.buttons[i])  globalData.buttons[i]  = { ...globalData.buttons[i],  ...data.buttons[i] };
    }
    if (Array.isArray(data.labels)) globalData.labels = data.labels.slice(0, 4);
    markGlobalDirty();
    renderGlobalControls();
  } catch (err) {
    console.error("Invalid global file", err);
  }
}

async function loadGlobalFromPicker() {
  if (window.showOpenFilePicker) {
    try {
      const [handle] = await window.showOpenFilePicker({
        types: [{ description: "JSON", accept: { "application/json": [".json"] } }],
      });
      applyGlobalText(await (await handle.getFile()).text());
      return;
    } catch (e) {
      if (e.name === "AbortError") return;
      if (e.name !== "SecurityError") console.error("Load failed", e);
    }
  }
  document.getElementById("global-load-input").click();
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
  sendLabelConfig(preset, pd.labels);
  serialSend([0xF0, 0x6F, 0x27, 0x00, 0xF7]);
}

const LABEL_OPTIONS = [
  [0, "Off"],
  [1, "Track Name"],
  [2, "Device Name"],
  [3, "Bank Name"],
  [4, "Preset Name"],
  [5, "Preset Number"],
];

function makeLabelBand(labelsArr, idxA, idxB, onChange) {
  const band = document.createElement("div");
  band.className = "label-band";
  [idxA, idxB].forEach(idx => {
    const sel = document.createElement("select");
    sel.className = "label-select";
    LABEL_OPTIONS.forEach(([v, t]) => {
      const opt = document.createElement("option");
      opt.value = v; opt.textContent = t;
      if (v === (labelsArr[idx] ?? 0)) opt.selected = true;
      sel.appendChild(opt);
    });
    sel.addEventListener("change", () => { labelsArr[idx] = parseInt(sel.value); onChange(); });
    band.appendChild(sel);
  });
  return band;
}

function cleanupDrag() {
  if (_dragGhost) { _dragGhost.remove(); _dragGhost = null; }
  document.querySelectorAll(".ctrl-card").forEach(c => c.classList.remove("drag-over", "dragging"));
  _dragOverCard = null;
  _dragSrc = -1; _dragType = null;
  document.removeEventListener("pointermove", onPointerMove);
  document.removeEventListener("pointerup",   onPointerUp);
}
function onPointerDown(e) {
  if (e.button !== 0) return;
  e.preventDefault();
  const handle = e.currentTarget;
  _dragSrc  = parseInt(handle.dataset.slot);
  _dragType = handle.dataset.dtype;
  handle.closest(".ctrl-card").classList.add("dragging");
  _dragGhost = document.createElement("div");
  _dragGhost.className = "drag-ghost";
  _dragGhost.textContent = (_dragType === "card" ? "Card " : "Button ") + (_dragSrc + 1);
  _dragGhost.style.left = (e.clientX + 12) + "px";
  _dragGhost.style.top  = (e.clientY - 10) + "px";
  document.body.appendChild(_dragGhost);
  document.addEventListener("pointermove", onPointerMove);
  document.addEventListener("pointerup",   onPointerUp);
}
function onPointerMove(e) {
  if (_dragGhost) {
    _dragGhost.style.left = (e.clientX + 12) + "px";
    _dragGhost.style.top  = (e.clientY - 10) + "px";
    _dragGhost.style.visibility = "hidden";
  }
  const el = document.elementFromPoint(e.clientX, e.clientY);
  if (_dragGhost) _dragGhost.style.visibility = "";
  const card = el?.closest?.(".ctrl-card");
  if (_dragOverCard !== card) {
    if (_dragOverCard) _dragOverCard.classList.remove("drag-over");
    _dragOverCard = card || null;
    if (_dragOverCard) _dragOverCard.classList.add("drag-over");
  }
}
function onPointerUp(e) {
  if (_dragGhost) _dragGhost.style.visibility = "hidden";
  const el = document.elementFromPoint(e.clientX, e.clientY);
  if (_dragGhost) _dragGhost.style.visibility = "";
  const card = el?.closest?.(".ctrl-card");
  if (card && _dragSrc >= 0) {
    const dst = parseInt(card.dataset.slot);
    if (_dragSrc !== dst) {
      if (card.dataset.context === "global") {
        if (_dragType === "card") {
          const tEnc = { ...globalData.encoders[_dragSrc] };
          globalData.encoders[_dragSrc] = { ...globalData.encoders[dst] };
          globalData.encoders[dst] = tEnc;
        }
        const tBtn = { ...globalData.buttons[_dragSrc] };
        globalData.buttons[_dragSrc] = { ...globalData.buttons[dst] };
        globalData.buttons[dst] = tBtn;
        markGlobalDirty();
        renderGlobalControls();
      } else {
        const pd = presetData[currentPreset];
        if (_dragType === "card") {
          const tEnc = { ...pd.encoders[_dragSrc] };
          pd.encoders[_dragSrc] = { ...pd.encoders[dst] };
          pd.encoders[dst] = tEnc;
        }
        const tBtn = { ...pd.buttons[_dragSrc] };
        pd.buttons[_dragSrc] = { ...pd.buttons[dst] };
        pd.buttons[dst] = tBtn;
        markDirty();
        renderControls();
      }
    }
  }
  cleanupDrag();
}

function renderControls() {
  const grid = document.getElementById("controls-grid");
  const modeUser = document.getElementById("mode-user");
  modeUser.querySelectorAll(".label-band").forEach(b => b.remove());
  grid.innerHTML = "";
  const pd = presetData[currentPreset];
  if (!pd.labels) pd.labels = [0, 0, 0, 0];
  modeUser.insertBefore(makeLabelBand(pd.labels, 0, 1, markDirty), grid);

  for (let i = 0; i < 8; i++) {
    const enc = pd.encoders[i];
    const btn = pd.buttons[i];

    const card = document.createElement("div");
    card.className = "ctrl-card";
    card.dataset.slot = i;
    card.dataset.context = "user";

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
           <button class="ctrl-assign-all" data-ctrl="enc" data-idx="${i}">Assign to all Presets</button>
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

    const btnHandle = `<span class="drag-handle btn-drag-handle" data-slot="${i}" data-dtype="btn">⠿</span>`;
    const buttonBlock = btn.isFunction
      ? `<div class="ctrl-section ctrl-section-push">
           <div class="ctrl-section-label">${btnHandle}PUSH</div>
           ${fnTabs("btn", i, true)}
           <div class="ctrl-fields">${fnMenuHtml("btn", i, BUTTON_FUNCTION_TABLE, btn.fnId)}</div>
           <button class="ctrl-assign-all" data-ctrl="btn" data-idx="${i}">Assign to all Presets</button>
         </div>`
      : `<div class="ctrl-section ctrl-section-push">
           <div class="ctrl-section-label">${btnHandle}PUSH</div>
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
           </div>
           <div class="ctrl-fields ctrl-range">
             <select data-ctrl="btn" data-idx="${i}" data-field="pressMode"
                     class="pm-sel" ${btn.type === 2 ? 'disabled' : ''}>
               <option value="1" ${btn.pressMode === 1 ? 'selected' : ''}>Tog.</option>
               <option value="0" ${btn.pressMode === 0 ? 'selected' : ''}>Mom.</option>
               <option value="2" ${btn.pressMode === 2 ? 'selected' : ''}>Trig.</option>
             </select>
             <span class="ctrl-range-label">Min</span>
             <input type="number" min="0" max="127" value="${btn.min}"
                    data-ctrl="btn" data-idx="${i}" data-field="min" class="ctrl-range-input"
                    ${(btn.type === 2 || btn.pressMode === 2) ? 'disabled' : ''}>
             <span class="ctrl-range-label">Max</span>
             <input type="number" min="0" max="127" value="${btn.max}"
                    data-ctrl="btn" data-idx="${i}" data-field="max" class="ctrl-range-input"
                    ${btn.type === 2 ? 'disabled' : ''}>
           </div>
         </div>`;

    card.innerHTML = `
      <div class="ctrl-number"><span class="drag-handle card-drag-handle" data-slot="${i}" data-dtype="card">⠿</span>${i + 1}</div>
      <hr class="ctrl-separator">
      ${buttonBlock}
      ${encoderBlock}
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
      markDirty();
      renderControls();
    });
  });

  attachFnmListeners(grid, (ctrl, idx, fnId) => {
    const pd = presetData[currentPreset];
    if (ctrl === 'enc') { pd.encoders[idx].fnId = fnId; pd.encoders[idx].name = ''; }
    else                { pd.buttons[idx].fnId  = fnId; pd.buttons[idx].name  = ''; }
    markDirty();
    renderControls();
  });

  const pmAbbr  = { 0: 'Mom.', 1: 'Tog.', 2: 'Trig.' };
  const pmFull  = { 0: 'Momentary', 1: 'Toggle', 2: 'Trigger' };
  grid.querySelectorAll(".pm-sel").forEach(sel => {
    sel.addEventListener("mousedown", () => {
      [...sel.options].forEach(o => { o.text = pmFull[o.value]; });
    });
    sel.addEventListener("blur", () => {
      [...sel.options].forEach(o => { o.text = pmAbbr[o.value]; });
    });
  });

  grid.querySelectorAll(".ctrl-assign-all").forEach(assignBtn => {
    assignBtn.addEventListener("click", () => {
      const ctrl     = assignBtn.dataset.ctrl;
      const idx      = parseInt(assignBtn.dataset.idx);
      const isButton = ctrl === 'btn' ? 1 : 0;
      const src      = isButton ? presetData[currentPreset].buttons[idx] : presetData[currentPreset].encoders[idx];
      const label     = getFnLabel(isButton === 1, src.fnId) || '';
      const nameBytes = Array.from(label).map(c => c.charCodeAt(0) & 0x7F);
      for (let p = 0; p < 24; p++) {
        const target = isButton ? presetData[p].buttons[idx] : presetData[p].encoders[idx];
        target.isFunction = true;
        target.fnId  = src.fnId;
        target.name  = label;
      }
      serialSend([0xF0, 0x6F, 0x20, isButton, idx, src.fnId, ...nameBytes, 0xF7]);
    });
  });
  grid.querySelectorAll(".drag-handle").forEach(h => {
    h.addEventListener("pointerdown", onPointerDown);
  });
  modeUser.appendChild(makeLabelBand(pd.labels, 2, 3, markDirty));
}

function clamp127(el) {
  const v = Math.max(0, Math.min(127, parseInt(el.value) || 0));
  el.value = v;
  return v;
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
      markDirty();
      renderControls();
      return;
    }
    if (field === "number") pd.encoders[idx].number = clamp127(el);
    if (field === "channel") pd.encoders[idx].channel = parseInt(el.value);
    if (field === "min") pd.encoders[idx].min = Math.min(clamp127(el), pd.encoders[idx].max - 1);
    if (field === "max") pd.encoders[idx].max = Math.max(clamp127(el), pd.encoders[idx].min + 1);
    if (field === "name") {
      pd.encoders[idx].name = el.value;
      markDirty();
      return;
    }
    markDirty();
  } else if (ctrl === "btn") {
    if (field === "type") {
      pd.buttons[idx].type = parseInt(el.value);
      markDirty();
      renderControls();
      return;
    }
    if (field === "number") pd.buttons[idx].number = clamp127(el);
    if (field === "note-name" || field === "note-oct") {
      const card = el.closest(".ctrl-card");
      const nameEl = card.querySelector('[data-field="note-name"]');
      const octEl = card.querySelector('[data-field="note-oct"]');
      pd.buttons[idx].number = noteToMidi(nameEl.value, parseInt(octEl.value));
    }
    if (field === "channel") pd.buttons[idx].channel = parseInt(el.value);
    if (field === "pressMode") { pd.buttons[idx].pressMode = parseInt(el.value); markDirty(); renderControls(); return; }
    if (field === "min") pd.buttons[idx].min = Math.min(clamp127(el), pd.buttons[idx].max);
    if (field === "max") pd.buttons[idx].max = Math.max(clamp127(el), pd.buttons[idx].min);
    if (field === "name") {
      pd.buttons[idx].name = el.value;
      markDirty();
      return;
    }
    markDirty();
  }
}

function sendEncoder(preset, idx) {
  const enc = presetData[preset].encoders[idx];
  serialSend([0xf0, 0x6f, 0x0d, preset, idx, enc.type, enc.number ?? 0, enc.channel,
              enc.type === 1 ? 1 : 0, enc.min ?? 0, enc.max ?? 127,
              enc.isFunction ? 1 : 0, enc.isFunction ? enc.fnId : 0,
              0xf7]);
  if (enc.isFunction && !enc.name) {
    const label = getFnLabel(false, enc.fnId);
    if (label) sendControlName(preset, idx, 0, label);
  }
}

function sendButton(preset, idx) {
  const btn = presetData[preset].buttons[idx];
  serialSend([0xf0, 0x6f, 0x0c, preset, idx, btn.type, btn.number, btn.channel,
              btn.pressMode ?? 0, btn.min ?? 0, btn.max ?? 127,
              btn.isFunction ? 1 : 0, btn.isFunction ? btn.fnId : 0,
              0xf7]);
  if (btn.isFunction && !btn.name) {
    const label = getFnLabel(true, btn.fnId);
    if (label) sendControlName(preset, idx, 1, label);
  }
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
  const data = { preset: currentPreset + 1, presetName: pd.presetName, encoders: pd.encoders, buttons: pd.buttons, labels: pd.labels };
  const json = JSON.stringify(data, null, 2);
  const filename = `param8-preset-${currentPreset + 1}.json`;
  let saved = false;
  if (window.showSaveFilePicker) {
    try {
      const handle = await window.showSaveFilePicker({
        suggestedName: filename,
        types: [{ description: "JSON", accept: { "application/json": [".json"] } }],
      });
      const writable = await handle.createWritable();
      await writable.write(json);
      await writable.close();
      saved = true;
    } catch (e) {
      if (e.name === "AbortError") return;
      // SecurityError in cross-origin iframes — fall through to blob download
      if (e.name !== "SecurityError") console.error("Save failed", e);
    }
  }
  if (!saved) {
    const url = URL.createObjectURL(new Blob([json], { type: "application/json" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }
}

function applyPresetText(text) {
  try {
    const data = JSON.parse(text);
    if (!data.encoders || !data.buttons) return;
    for (let i = 0; i < 8; i++) {
      if (data.encoders[i]) presetData[currentPreset].encoders[i] = data.encoders[i];
      if (data.buttons[i]) presetData[currentPreset].buttons[i] = data.buttons[i];
    }
    if (data.presetName !== undefined) {
      presetData[currentPreset].presetName = data.presetName;
      document.getElementById("preset-name-input").value = data.presetName || "";
    }
    if (Array.isArray(data.labels)) presetData[currentPreset].labels = data.labels.slice(0, 4);
    markDirty();
    renderControls();
  } catch (err) {
    console.error("Invalid preset file", err);
  }
}

function loadPresetFromFile(file) {
  const reader = new FileReader();
  reader.onload = (e) => applyPresetText(e.target.result);
  reader.readAsText(file);
}

async function loadPresetFromPicker() {
  if (window.showOpenFilePicker) {
    try {
      const [handle] = await window.showOpenFilePicker({
        types: [{ description: "JSON", accept: { "application/json": [".json"] } }],
      });
      const file = await handle.getFile();
      applyPresetText(await file.text());
      return;
    } catch (e) {
      if (e.name === "AbortError") return;
      if (e.name !== "SecurityError") console.error("Load failed", e);
    }
  }
  document.getElementById("ctrl-load-input").click();
}

function initControllerUI() {
  // Main tab switching: User / Global / Settings
  document.querySelectorAll(".main-tab").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".main-tab").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      document.querySelectorAll(".main-tab-panel").forEach((p) => p.classList.add("hidden"));
      document.getElementById("panel-" + btn.dataset.tab).classList.remove("hidden");
      if (btn.dataset.tab === "global") {
        requestGlobal();
        renderGlobalControls();
      }
      if (btn.dataset.tab === "settings") {
        updateFirmwareVersionUI();
      }
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
    markDirty();
  });

  document.getElementById("serial-log-close").addEventListener("click", () => {
    document.getElementById("serial-log-panel").classList.add("hidden");
  });
  document.getElementById("serial-log-clear").addEventListener("click", () => {
    const el = document.getElementById("serial-log-output");
    if (el) el.innerHTML = "";
    serialLogBuf = "";
  });

  document.getElementById("ctrl-send").addEventListener("click", () => {
    sendFullPreset(currentPreset);
    markClean();
  });

  document.getElementById("global-send").addEventListener("click", () => {
    sendFullGlobal();
    markGlobalClean();
  });
  document.getElementById("global-save").addEventListener("click", saveGlobalToFile);
  const globalLoadInput = document.getElementById("global-load-input");
  document.getElementById("global-load").addEventListener("click", () => loadGlobalFromPicker());
  globalLoadInput.addEventListener("change", (e) => {
    if (e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (ev) => applyGlobalText(ev.target.result);
      reader.readAsText(e.target.files[0]);
      e.target.value = "";
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "u" && (e.metaKey || e.ctrlKey) && serialWriter) {
      e.preventDefault();
      const activeTab = document.querySelector(".main-tab.active");
      if (activeTab && activeTab.dataset.tab === "global") {
        sendFullGlobal();
        markGlobalClean();
      } else {
        sendFullPreset(currentPreset);
        markClean();
      }
    }
  });

  document.getElementById("ctrl-save").addEventListener("click", savePresetToFile);

  document.getElementById("screensaver-select").addEventListener("change", (e) => {
    sendScreensaverTimeout(parseInt(e.target.value));
  });

  document.getElementById("brightness-select").addEventListener("change", (e) => {
    sendBrightness(parseInt(e.target.value));
  });

  document.getElementById("leds-select").addEventListener("change", (e) => {
    serialSend([0xf0, 0x6f, 0x29, parseInt(e.target.value), 0xf7]);
  });

  for (const type of ['latch', 'revert']) {
    document.getElementById(`${type}-smooth-mode`).addEventListener("click", () => {
      const btn = document.getElementById(`${type}-smooth-mode`);
      const syncMode = btn.textContent !== 'Sync';
      const level = parseInt(document.getElementById(`${type}-smooth-level`).value);
      const syncStep = parseInt(document.getElementById(`${type}-smooth-step`).value);
      updateSmoothUI(type, level, syncMode ? 1 : 0, syncStep);
      type === 'latch' ? sendLatchSmooth(level, syncMode, syncStep) : sendRevertSmooth(level, syncMode, syncStep);
    });

    document.getElementById(`${type}-smooth-level`).addEventListener("input", (e) => {
      document.getElementById(`${type}-smooth-val`).textContent = formatSmoothTime(parseInt(e.target.value));
    });

    document.getElementById(`${type}-smooth-level`).addEventListener("change", (e) => {
      const level = parseInt(e.target.value);
      const syncStep = parseInt(document.getElementById(`${type}-smooth-step`).value);
      type === 'latch' ? sendLatchSmooth(level, false, syncStep) : sendRevertSmooth(level, false, syncStep);
    });

    document.getElementById(`${type}-smooth-step`).addEventListener("change", (e) => {
      const level = parseInt(document.getElementById(`${type}-smooth-level`).value);
      type === 'latch' ? sendLatchSmooth(level, true, parseInt(e.target.value)) : sendRevertSmooth(level, true, parseInt(e.target.value));
    });
  }

  const loadInput = document.getElementById("ctrl-load-input");
  document.getElementById("ctrl-load").addEventListener("click", () => loadPresetFromPicker());
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
  serialSend([0xf0, 0x6f, 0x1e, 0x00, 0xf7]);
}

function requestSmooth() {
  serialSend([0xf0, 0x6f, 0x26, 0x00, 0xf7]);
}

function formatSmoothTime(level) {
  if (level === 0) return 'Off';
  const ms = Math.round(100 * Math.pow(590, (level - 1) / 126));
  if (ms < 1000) return ms + 'ms';
  return (ms / 1000).toFixed(1) + 's';
}

function updateSmoothUI(type, level, syncMode, syncStep) {
  const btn      = document.getElementById(`${type}-smooth-mode`);
  const timePart = document.getElementById(`${type}-smooth-time-part`);
  const stepSel  = document.getElementById(`${type}-smooth-step`);
  const levelIn  = document.getElementById(`${type}-smooth-level`);
  const valSpan  = document.getElementById(`${type}-smooth-val`);
  const isSync   = syncMode !== 0;
  btn.textContent = isSync ? 'Sync' : 'Time';
  btn.classList.toggle('active', isSync);
  timePart.classList.toggle('hidden', isSync);
  stepSel.classList.toggle('hidden', !isSync);
  levelIn.value = String(level);
  valSpan.textContent = formatSmoothTime(level);
  stepSel.value = String(syncStep);
}

function sendLatchSmooth(level, syncMode, syncStep) {
  serialSend([0xf0, 0x6f, 0x24, level & 0x7f, syncMode ? 1 : 0, syncStep & 0x7f, 0xf7]);
}

function sendRevertSmooth(level, syncMode, syncStep) {
  serialSend([0xf0, 0x6f, 0x25, level & 0x7f, syncMode ? 1 : 0, syncStep & 0x7f, 0xf7]);
}

function getFnLabel(isButton, fnId) {
  const table = isButton ? BUTTON_FUNCTION_TABLE : ENCODER_FUNCTION_TABLE;
  const entry = table.find(e => e.id === fnId);
  return entry ? entry.label : '';
}

function sendGlobalEncoder(idx) {
  const fnId = globalData.encoders[idx].fnId;
  serialSend([0xf0, 0x6f, 0x1c, idx, fnId, 0xf7]);
  const label = getFnLabel(false, fnId);
  if (label) sendControlName(24, idx, 0, label);
}

function sendGlobalButton(idx) {
  const fnId = globalData.buttons[idx].fnId;
  serialSend([0xf0, 0x6f, 0x1d, idx, fnId, 0xf7]);
  const label = getFnLabel(true, fnId);
  if (label) sendControlName(24, idx, 1, label);
}

function renderGlobalControls() {
  const container = document.getElementById("mode-global");
  container.innerHTML = "";
  if (!globalData.labels) globalData.labels = [0, 0, 0, 0];
  container.appendChild(makeLabelBand(globalData.labels, 0, 1, markGlobalDirty));

  const grid = document.createElement("div");
  grid.className = "controls-grid global-controls-grid";

  for (let i = 0; i < 8; i++) {
    const card = document.createElement("div");
    card.className = "ctrl-card";
    card.dataset.slot = i;
    card.dataset.context = "global";
    card.innerHTML = `
      <div class="ctrl-number"><span class="drag-handle card-drag-handle" data-slot="${i}" data-dtype="card">⠿</span>${i + 1}</div>
      <hr class="ctrl-separator">
      <div class="ctrl-section ctrl-section-push">
        <div class="ctrl-section-label"><span class="drag-handle btn-drag-handle" data-slot="${i}" data-dtype="btn">⠿</span>PUSH</div>
        <div class="ctrl-fields">
          ${fnMenuHtml("gbtn", i, BUTTON_FUNCTION_TABLE, globalData.buttons[i].fnId)}
        </div>
      </div>
      <div class="ctrl-section">
        <div class="ctrl-section-label">TURN</div>
        <div class="ctrl-fields">
          ${fnMenuHtml("genc", i, ENCODER_FUNCTION_TABLE, globalData.encoders[i].fnId)}
        </div>
      </div>
    `;
    grid.appendChild(card);
  }

  container.appendChild(grid);

  attachFnmListeners(grid, (ctrl, idx, fnId) => {
    if (ctrl === 'genc') globalData.encoders[idx].fnId = fnId;
    else                 globalData.buttons[idx].fnId  = fnId;
    markGlobalDirty();
    renderGlobalControls();
  });
  grid.querySelectorAll(".drag-handle").forEach(h => {
    h.addEventListener("pointerdown", onPointerDown);
  });
  container.appendChild(makeLabelBand(globalData.labels, 2, 3, markGlobalDirty));
}

document.addEventListener('click', () => {
  document.querySelectorAll('.fnm-dropdown').forEach(d => { d.style.display = 'none'; });
});
