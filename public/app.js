document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("midi-connect").addEventListener("click", () => connectSerial());
  document.getElementById("midi-disconnect").addEventListener("click", () => disconnectSerial());

  document.querySelectorAll(".layout-tab").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".layout-tab").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      sendLayoutChange(parseInt(btn.dataset.layout));
    });
  });

  let changelogLoaded = false;
  document.getElementById("changelog-toggle").addEventListener("click", (e) => {
    e.preventDefault();
    document.getElementById("changelog-panel").classList.remove("hidden");
    if (!changelogLoaded) {
      fetch("https://raw.githubusercontent.com/KBLiveSolutions/param8-firmware/main/releases/Changelog.txt", { cache: "no-store" })
        .then(r => r.text())
        .then(text => {
          document.getElementById("changelog-text").textContent = text;
          changelogLoaded = true;
        })
        .catch(() => {
          document.getElementById("changelog-text").textContent = "Could not load changelog.";
        });
    }
  });
  document.getElementById("changelog-close").addEventListener("click", () => {
    document.getElementById("changelog-panel").classList.add("hidden");
  });

  initControllerUI();
  autoConnect();
  fetchLatestFirmwareInfo();

  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("sw.js");
  }
});
