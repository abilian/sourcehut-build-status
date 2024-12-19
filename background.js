const CHECK_INTERVAL = 5; // Interval in minutes
let monitoredURL = ""; // Default RSS feed URL
let lastChecked = 0; // Last time the feed was checked

// Function to fetch RSS feed and check for build errors
async function checkRSSFeed() {
  if (!monitoredURL) return;

  console.log("Checking RSS feed...");
  try {
    const response = await fetch(monitoredURL);
    const text = await response.text();

    console.log("Fetched RSS feed:");

    // Parse the RSS feed as text
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(text, "application/xml");

    // Extract all item titles and descriptions
    const items = xmlDoc.querySelectorAll("item");
    for (const item of items) {
      const dateString = item.querySelector("pubDate")?.textContent || "";
      const pubDate = Date.parse(dateString);

      if (lastChecked && pubDate <= lastChecked) {
        continue;
      }

      const title = item.querySelector("title")?.textContent || "";
      const guid = item.querySelector("guid")?.textContent || "";
      const author = item.querySelector("author")?.textContent || "";
      const link = item.querySelector("link")?.textContent || "";

      if (title.endsWith("(failed)")) {
        console.log("Found failed build at:", link);
        const description = `Author: ${author}\nLink: ${link}`;
        showNotification(title, description);
        // markBuildAsRead(guid);
        break;
      }
    }
  } catch (error) {
    console.error("Error fetching RSS feed:", error);
  }
  lastChecked = Date.now();
}

// Display a notification
function showNotification(title, description) {
  console.log("Showing notification:", title, description);
  // new Notification(title, {body: description});
  browser.notifications.create({
    type: "basic",
    iconUrl: "icon-48px.png",
    title: "Build error on Sourcehut",
    message: `${title}\n${description}`
  });
}

// // Mark a build as read
// function markBuildAsRead(guid) {
//   // Save the GUID to storage
//   browser.storage.local.get(["readBuilds"], (data) => {
//     const readBuilds = data.readBuilds || {};
//     readBuilds[guid] = true;
//
//     browser.storage.local.set({readBuilds});
//     console.log("Duilds marked as read:", readBuilds);
//   });
// }

// Load settings from storage
function loadSettings() {
  console.log("Loading settings...");
  browser.storage.local.get(["userId"], (data) => {
    if (data.userId) {
      // Example: https://builds.sr.ht/~sfermigier/rss.xml
      monitoredURL = `https://builds.sr.ht/~${data.userId}/rss.xml`;
    } else {
      monitoredURL = "";
    }
  });
  checkRSSFeed().then(
    () => console.log("Initial RSS feed check complete"),
    (error) => console.error("Error checking RSS feed:", error)
  )
}

// // Media Query Listener for viewport size changes
// function setupViewportListener() {
//   const mediaQuery = window.matchMedia("(max-width: 600px)");
//
//   function handleViewportChange(event) {
//     if (event.matches) {
//       console.log("Viewport is 600px or smaller");
//     } else {
//       console.log("Viewport is larger than 600px");
//     }
//   }
//
//   if (mediaQuery.addEventListener) {
//     // Modern browsers
//     mediaQuery.addEventListener("change", handleViewportChange);
//   }
// }

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

// setupViewportListener();
