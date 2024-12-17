const CHECK_INTERVAL = 5; // Interval in minutes
let monitoredURL = ""; // Default RSS feed URL
let keywords = []; // List of words to monitor

// Function to fetch RSS feed and check for keywords
async function checkRSSFeed() {
  if (!monitoredURL || keywords.length === 0) return;

  try {
    const response = await fetch(monitoredURL);
    const text = await response.text();

    // Parse the RSS feed as text
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(text, "application/xml");

    // Extract all item titles and descriptions
    const items = xmlDoc.querySelectorAll("item");
    for (const item of items) {
      const title = item.querySelector("title")?.textContent || "";
      const description = item.querySelector("description")?.textContent || "";
      const content = `${title} ${description}`.toLowerCase();

      // Check for monitored keywords
      for (const word of keywords) {
        if (content.includes(word.toLowerCase())) {
          showNotification(title, description);
          return; // Notify once per check
        }
      }
    }
  } catch (error) {
    console.error("Error fetching RSS feed:", error);
  }
}

// Display a notification
function showNotification(title, description) {
  browser.notifications.create({
    "type": "basic",
    "iconUrl": "icon.png",
    "title": "Keyword Alert!",
    "message": `${title}\n${description}`
  });
}

// Load settings from storage
function loadSettings() {
  browser.storage.local.get(["rssURL", "keywords"], (data) => {
    monitoredURL = data.rssURL || "";
    keywords = data.keywords || [];
  });
}

// Set up periodic alarms
browser.alarms.create("checkFeed", {periodInMinutes: CHECK_INTERVAL});
browser.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === "checkFeed") {
    checkRSSFeed();
  }
});

// Listen for storage changes
browser.storage.onChanged.addListener(loadSettings);

// Initial load
loadSettings();
