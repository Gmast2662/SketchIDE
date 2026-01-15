# Auto-Update System Setup

## How Auto-Update Works

The SketchIDE app has a built-in update notification system that:
1. Checks for new versions on startup and every 24 hours
2. Compares the current version with the latest available version
3. Shows a notification when a new version is available
4. Provides a button to download the update

## Current Implementation

The app checks for updates by:
- Reading `localStorage.getItem('latestVersion')` (for testing)
- Comparing it with the current app version

## Setting Up Real Auto-Update

### Option 1: GitHub Releases (Recommended)

1. Create a GitHub repository for your app
2. Create releases for each version (e.g., v1.0.1, v1.0.2)
3. Update the update check code to fetch from GitHub API:

```typescript
// In src/App.tsx - update check function
const checkForUpdates = async () => {
  try {
    const response = await fetch('https://api.github.com/repos/YOUR_USERNAME/YOUR_REPO/releases/latest');
    const data = await response.json();
    const latestVersion = data.tag_name.replace('v', ''); // Remove 'v' from 'v1.0.1'
    
    if (latestVersion !== currentVersion) {
      setLatestVersion(latestVersion);
      setShowUpdateNotification(true);
    }
  } catch (error) {
    console.error('Error checking for updates:', error);
  }
};
```

4. Update the download link in `UpdateNotification` component:
```typescript
onUpdate={() => {
  window.open('https://github.com/YOUR_USERNAME/YOUR_REPO/releases/latest', '_blank');
}}
```

### Option 2: Custom API Endpoint

1. Create a simple API endpoint that returns the latest version:
```json
{
  "version": "1.0.1",
  "downloadUrl": "https://yoursite.com/downloads/sketchide-1.0.1.exe"
}
```

2. Update the check function:
```typescript
const checkForUpdates = async () => {
  try {
    const response = await fetch('https://yoursite.com/api/latest-version');
    const data = await response.json();
    
    if (data.version !== currentVersion) {
      setLatestVersion(data.version);
      setLatestDownloadUrl(data.downloadUrl);
    }
  } catch (error) {
    console.error('Error checking for updates:', error);
  }
};
```

### Option 3: Manual Updates (Current)

Users download and install new versions manually:
1. You release a new version
2. Users see the notification
3. Users click "Download Update" 
4. Users download and run the new installer
5. The new version replaces the old one

## Testing Update Notifications

To test the update notification:

1. Open browser console (F12)
2. Run: `localStorage.setItem('latestVersion', '1.0.2')`
3. Refresh the app
4. The notification should appear

## Production Deployment

For production:
1. Set up a GitHub repository or API endpoint
2. Update the version checking code (see examples above)
3. Make sure each release has:
   - A version tag (v1.0.1)
   - Release notes
   - Installer/download link
4. The app will automatically notify users when new versions are available

## Automatic Installation (Advanced)

For true auto-update (install without user interaction), you would need:
- **electron-updater** package
- Code signing certificates
- Server hosting update files

This is more complex and requires additional setup. The current notification system is a good middle ground that works without additional dependencies.
