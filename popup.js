// Load saved settings
document.addEventListener("DOMContentLoaded", () => {
  browser.storage.local.get(["rssURL", "keywords"], (data) => {
    document.getElementById("rssURL").value = data.rssURL || "";
    document.getElementById("keywords").value = (data.keywords || []).join(", ");
  });
});

// Save settings
document.getElementById("save").addEventListener("click", () => {
  const rssURL = document.getElementById("rssURL").value.trim();
  const keywords = document.getElementById("keywords").value
    .split(",")
    .map((k) => k.trim())
    .filter((k) => k.length > 0);

  browser.storage.local.set({rssURL, keywords}, () => {
    const status = document.getElementById("status");
    status.textContent = "Settings saved!";
    setTimeout(() => (status.textContent = ""), 2000);
  });
});
