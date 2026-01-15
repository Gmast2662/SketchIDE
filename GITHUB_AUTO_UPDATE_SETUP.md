# GitHub Auto-Update Setup Guide

This guide will help you set up automatic update notifications using GitHub Releases.

## Step 1: Create a GitHub Repository

1. Go to [GitHub](https://github.com) and create a new repository (or use an existing one)
2. Note your username and repository name (e.g., `username/sketchide`)

## Step 2: Update the Code

### Update `src/App.tsx`

Find the line that says:
```typescript
const GITHUB_REPO = 'YOUR_USERNAME/YOUR_REPO'; // TODO: Update this
```

Replace `YOUR_USERNAME/YOUR_REPO` with your actual GitHub username and repository name:

```typescript
const GITHUB_REPO = 'bethg/sketchide'; // Example - use your actual repo
```

You need to update it in **two places**:
1. In the `checkForUpdates` function (around line 86)
2. In the `onUpdate` handler (around line 647)

Example:
```typescript
// In checkForUpdates function
const GITHUB_REPO = 'yourusername/sketchide';

// In onUpdate handler
const GITHUB_REPO = 'yourusername/sketchide';
```

## Step 3: Create a GitHub Release

1. Go to your GitHub repository
2. Click on "Releases" → "Create a new release"
3. Fill in:
   - **Tag version**: `v1.0.1` (must start with 'v' followed by version number)
   - **Release title**: `Version 1.0.1` (optional)
   - **Description**: Add release notes (optional)
4. Upload your installer file (`SketchIDE Setup 1.0.1.exe`)
5. Click "Publish release"

## Step 4: Test the Update Notification

1. Make sure your app version in `package.json` is `1.0.1` (or lower than the release)
2. Create a new GitHub release with version `v1.0.2`
3. Run your app
4. The update notification should appear automatically

## How It Works

- The app checks GitHub Releases API every 24 hours
- It compares the latest release tag with the current app version
- If a newer version is found, it shows a notification
- Users can click "Download Update" to go to the releases page

## Version Format

- **GitHub Release Tag**: Must be in format `v1.0.1`, `v1.0.2`, etc. (with 'v' prefix)
- **App Version**: Must match `package.json` version (e.g., `1.0.1`, `1.0.2`)
- The app automatically removes the 'v' prefix when comparing

## Testing Without GitHub

If you want to test before setting up GitHub:

1. Open browser console (F12)
2. Run: `localStorage.setItem('latestVersion', '1.0.2')`
3. Refresh the app
4. The notification should appear

## Troubleshooting

**Notification doesn't show:**
- Check that the GitHub repo name is correct
- Make sure the release tag starts with 'v' (e.g., `v1.0.1`)
- Check browser console for errors (F12)

**API rate limiting:**
- GitHub allows 60 requests per hour for unauthenticated requests
- This is usually enough for update checks (once per 24 hours)
- If you need more, you can add a GitHub token (advanced)

## Advanced: Adding Authentication (Optional)

For higher rate limits, you can add a GitHub token:

```typescript
const response = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/releases/latest`, {
  headers: {
    'Accept': 'application/vnd.github.v3+json',
    'Authorization': `token YOUR_GITHUB_TOKEN`, // Optional
  },
});
```

However, this is not necessary for basic update checking.
