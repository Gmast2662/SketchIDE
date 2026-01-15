# Version Management & Update Notifications

## How to Change the Version

To change the app version and trigger update notifications:

### Step 1: Update Version in package.json

Edit `package.json` and change the `version` field:

```json
{
  "version": "1.0.1",  // Change this number
  ...
}
```

### Step 2: Update Version in Code

Edit `src/App.tsx` and update the `currentVersion` constant:

```typescript
const currentVersion = '1.0.1';  // Match the version in package.json
```

Also update `src/components/layout/MenuBar.tsx`:

```typescript
<div className="text-xs text-ide-textDim px-3">
  v1.0.1  // Update this display version
</div>
```

### Step 3: Rebuild the App

After changing the version, rebuild:

```bash
npm run electron:build:win
```

## Testing Update Notifications

To test the update notification system:

1. Set a newer version in localStorage:
   ```javascript
   localStorage.setItem('latestVersion', '1.0.1');
   ```
2. Refresh the app (or restart)
3. The update notification should appear

## How It Works

- The app checks for updates on startup and every 24 hours
- It compares `currentVersion` (in code) with `latestVersion` (in localStorage or from remote API)
- If a newer version is detected, a notification appears
- Users can click "Download Update" to open the releases page

## For Production

In a real app, you would:
1. Store the latest version on a server or GitHub releases API
2. Check that version periodically
3. Show notification when a new version is available
4. Provide a download link or auto-update functionality

Example remote check:
```typescript
const checkForUpdates = async () => {
  try {
    const response = await fetch('https://api.github.com/repos/yourusername/sketchide/releases/latest');
    const data = await response.json();
    const latestVersion = data.tag_name.replace('v', '');
    if (latestVersion !== currentVersion) {
      setLatestVersion(latestVersion);
    }
  } catch (error) {
    // Silent fail
  }
};
```
