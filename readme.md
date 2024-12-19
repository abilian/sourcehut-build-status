# Sourcehut Build Notifications

This browser extension provides real-time (for a loose definition of "real-time") notifications for failed builds on Sourcehut. By monitoring your account's build status, it ensures you are promptly (same remark) informed of any issues, minimizing impact on your collaborators and improving response time to build failures.

## Installation and Usage

1. **Load the extension**:
   - Go to `about:debugging` in Firefox.
   - Click **This Firefox** → **Load Temporary Add-on**.
   - Select your `manifest.json`.

2. **Configure the popup**:
   - Click the extension icon.
   - Enter an account name on Sourcehut.

3. **Trigger notifications**:
   - If a build is already failed, shoud should see a notification right away.
   - Otherwise, you should see a notification at most 5 minutes after a failed build.
