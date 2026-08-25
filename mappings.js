let mappingsData = {};
let defaultsData = {};

const STORAGE_KEY = "param8-mappings";

async function loadMappings() {
  const res = await fetch("defaults.json");
  defaultsData = await res.json();

  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      mappingsData = JSON.parse(stored);
    } catch (e) {
      mappingsData = {};
    }
  }
}

async function saveMappings() {
  const toSave = {};
  for (const [key, val] of Object.entries(mappingsData)) {
    if (key.startsWith("_")) {
      toSave[key] = val;
      continue;
    }
    const def = defaultsData[key];
    if (!def || JSON.stringify(val.banks) !== JSON.stringify(def.banks)) {
      toSave[key] = val;
    }
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  const status = document.getElementById("save-status");
  status.textContent = "Saved!";
  status.style.color = "#4caf50";
  setTimeout(() => (status.textContent = ""), 4000);
}

function exportMappings() {
  const data = localStorage.getItem(STORAGE_KEY) || "{}";
  const blob = new Blob([data], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "param8-mappings.json";
  a.click();
  URL.revokeObjectURL(url);
}

function importMappings(file) {
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const data = JSON.parse(e.target.result);
      mappingsData = data;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      renderDeviceList();
      const status = document.getElementById("save-status");
      status.textContent = "Imported!";
      status.style.color = "#4caf50";
      setTimeout(() => (status.textContent = ""), 4000);
    } catch (err) {
      console.error("Invalid mappings file", err);
    }
  };
  reader.readAsText(file);
}

function getEffectiveBanks(deviceName) {
  if (mappingsData[deviceName] && mappingsData[deviceName].banks) return mappingsData[deviceName];
  if (defaultsData[deviceName]) return JSON.parse(JSON.stringify(defaultsData[deviceName]));
  return { banks: [{ name: "Bank 1", parameters: [null, null, null, null, null, null, null, null] }] };
}

function renderDevice(deviceName) {
  const container = document.getElementById("banks-container");
  if (!deviceName) return;

  const effective = getEffectiveBanks(deviceName);
  if (!mappingsData[deviceName] || !mappingsData[deviceName].banks) {
    mappingsData[deviceName] = JSON.parse(JSON.stringify(effective));
  }

  container.innerHTML = "";
  (effective.banks || []).forEach((bank, bankIdx) => {
    container.appendChild(createBankElement(deviceName, bank, bankIdx));
  });
}

function createBankElement(deviceName, bank, bankIdx) {
  const div = document.createElement("div");
  div.className = "bank";
  div.innerHTML = `
    <div class="bank-header">
      <input type="text" value="${bank.name || "Bank " + (bankIdx + 1)}"
             data-device="${deviceName}" data-bank="${bankIdx}" class="bank-name-input">
    </div>
    <div class="param-grid">
      ${bank.parameters
        .map(
          (p, i) => `
        <div class="param-slot">
          <label>${i + 1}</label>
          <input type="text" value="${p || ""}" placeholder="(empty)"
                 draggable="true"
                 data-device="${deviceName}" data-bank="${bankIdx}" data-param="${i}"
                 class="param-input" readonly>
        </div>`
        )
        .join("")}
    </div>
  `;

  div.querySelector(".bank-name-input").addEventListener("change", (e) => {
    mappingsData[deviceName].banks[bankIdx].name = e.target.value;
  });

  div.querySelectorAll(".param-input").forEach((input) => {
    input.addEventListener("dragstart", (e) => {
      e.dataTransfer.setData(
        "text/plain",
        JSON.stringify({
          device: e.target.dataset.device,
          bank: e.target.dataset.bank,
          param: e.target.dataset.param,
        })
      );
      e.target.classList.add("dragging");
    });

    input.addEventListener("dragend", (e) => {
      e.target.classList.remove("dragging");
    });

    input.addEventListener("dragover", (e) => {
      e.preventDefault();
      e.target.classList.add("drag-over");
    });

    input.addEventListener("dragleave", (e) => {
      e.target.classList.remove("drag-over");
    });

    input.addEventListener("drop", (e) => {
      e.preventDefault();
      e.target.classList.remove("drag-over");
      const src = JSON.parse(e.dataTransfer.getData("text/plain"));
      const dstBank = parseInt(e.target.dataset.bank);
      const dstParam = parseInt(e.target.dataset.param);
      const srcBank = parseInt(src.bank);
      const srcParam = parseInt(src.param);
      const device = mappingsData[deviceName];
      const tmp = device.banks[dstBank].parameters[dstParam];
      device.banks[dstBank].parameters[dstParam] =
        device.banks[srcBank].parameters[srcParam];
      device.banks[srcBank].parameters[srcParam] = tmp;
      renderDevice(deviceName);
    });
  });

  return div;
}

function resetDevice(name) {
  if (!defaultsData[name]) return;
  delete mappingsData[name];
  renderDevice(name);
}
