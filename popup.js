// Load saved settings
document.addEventListener("DOMContentLoaded", () => {
  browser.storage.local.get(["userId"], (data) => {
    document.getElementById("userId").value = data.userId || "";
  });
});

// Save settings
document.getElementById("save").addEventListener("click", () => {
  const userId = document.getElementById("userId").value.trim();

  browser.storage.local.set({userId}, () => {
    const status = document.getElementById("status");
    status.textContent = "Settings saved!";
    setTimeout(() => (status.textContent = ""), 2000);
  });
});
