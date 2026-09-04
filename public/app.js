document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("midi-connect").addEventListener("click", () => connectSerial());

  document.querySelectorAll(".layout-tab").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".layout-tab").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      sendLayoutChange(parseInt(btn.dataset.layout));
    });
  });

  initControllerUI();
  autoConnect();

  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("sw.js");
  }
});
