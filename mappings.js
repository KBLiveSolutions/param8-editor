let mappingsData = {};
let defaultsData = {};

async function loadMappings() {
  const [mappingsRes, defaultsRes] = await Promise.all([
    fetch("/api/mappings"),
    fetch("/api/defaults"),
  ]);
  mappingsData = await mappingsRes.json();
  defaultsData = await defaultsRes.json();
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
  const res = await fetch("/api/mappings", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(toSave),
  });
  const result = await res.json();
  const status = document.getElementById("save-status");
  if (result.ok) {
    status.textContent = "Saved!";
    status.style.color = "#4caf50";
    setTimeout(() => (status.textContent = ""), 4000);
  } else {
    status.textContent = "Error: " + (result.error || "unknown");
    status.style.color = "#f44";
  }
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
