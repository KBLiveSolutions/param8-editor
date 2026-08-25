let selectedDevice = null;
let currentCategory = "audio_effects";

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      document.querySelectorAll(".tab").forEach((t) => t.classList.remove("active"));
      document.querySelectorAll(".tab-content").forEach((c) => c.classList.remove("active"));
      tab.classList.add("active");
      document.getElementById("tab-" + tab.dataset.tab).classList.add("active");
    });
  });

  loadMappings().then(() => {
    renderDeviceList();
  });

  document.querySelectorAll(".cat-tab").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".cat-tab").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      currentCategory = btn.dataset.category;
      renderDeviceList();
    });
  });

  document.getElementById("device-search").addEventListener("input", () => renderDeviceList());

  document.getElementById("save-mappings").addEventListener("click", saveMappings);

  document.getElementById("reset-device").addEventListener("click", () => {
    const name = document.getElementById("device-editor").dataset.device;
    if (name) {
      resetDevice(name);
      renderDeviceList();
    }
  });

  document.getElementById("midi-connect").addEventListener("click", connectSerial);

  document.querySelectorAll(".layout-tab").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".layout-tab").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      sendLayoutChange(parseInt(btn.dataset.layout));
    });
  });

  initControllerUI();

  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("sw.js");
  }
});

function renderDeviceList() {
  const search = document.getElementById("device-search").value.toLowerCase();
  const list = document.getElementById("device-list");
  list.innerHTML = "";

  const allDevices = new Set([
    ...Object.keys(defaultsData),
    ...Object.keys(mappingsData).filter((k) => !k.startsWith("_")),
  ]);

  const filtered = [...allDevices]
    .filter((name) => deviceCategory(name) === currentCategory)
    .filter((name) => {
      if (!search) return true;
      return deviceDisplayName(name).toLowerCase().includes(search) || name.toLowerCase().includes(search);
    })
    .sort((a, b) => deviceDisplayName(a).localeCompare(deviceDisplayName(b)));

  for (const className of filtered) {
    const li = document.createElement("li");
    const isCustom = !!mappingsData[className] && !!defaultsData[className] &&
      JSON.stringify(mappingsData[className]) !== JSON.stringify(defaultsData[className]);

    li.textContent = deviceDisplayName(className);
    if (isCustom) li.textContent += " *";
    li.dataset.device = className;
    if (className === selectedDevice) li.classList.add("selected");

    li.addEventListener("click", () => {
      selectedDevice = className;
      list.querySelectorAll("li").forEach((l) => l.classList.remove("selected"));
      li.classList.add("selected");
      selectDevice(className);
    });

    list.appendChild(li);
  }
}

function selectDevice(className) {
  document.getElementById("no-device-selected").classList.add("hidden");
  document.getElementById("device-editor").classList.remove("hidden");
  document.getElementById("device-editor").dataset.device = className;
  document.getElementById("device-name").textContent = deviceDisplayName(className);
  renderDevice(className);
}
