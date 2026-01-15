# Uploading Large Installer Files to GitHub

GitHub has a **100MB limit** for files uploaded via the browser. If your installer exceeds this, use one of these methods:

## Option 1: GitHub CLI (Easiest - Up to 2GB)

GitHub CLI allows uploading files up to 2GB.

### Installation

1. Download GitHub CLI: https://cli.github.com/
2. Install it
3. Authenticate: `gh auth login`

### Upload Release

```bash
# Create a release and upload the installer
gh release create v1.0.1 "release/SketchIDE Setup 1.0.1.exe" \
  --title "Version 1.0.1" \
  --notes "Release notes here"
```

Or if the release already exists:
```bash
# Upload to existing release
gh release upload v1.0.1 "release/SketchIDE Setup 1.0.1.exe" --clobber
```

## Option 2: Use Git LFS (For Repository)

If you want to commit the installer to git (not recommended):

1. Install Git LFS: https://git-lfs.github.com/
2. Initialize:
   ```bash
   git lfs install
   git lfs track "*.exe"
   git add .gitattributes
   ```
3. Commit normally - large files are handled by LFS

**Note:** Git LFS has free tier limits. For releases, use Option 1.

## Option 3: External File Hosting

1. Upload installer to:
   - Google Drive
   - Dropbox
   - OneDrive
   - Any file hosting service
2. Get a direct download link
3. Create GitHub release with the download link in description
4. Update update notification to use the direct link

### Update App Code

In `src/App.tsx`, update the `onUpdate` handler:

```typescript
onUpdate={() => {
  // Use direct download link instead of GitHub releases page
  window.open('https://your-file-host.com/sketchide-1.0.1.exe', '_blank');
}}
```

## Option 4: Reduce Installer Size

- Compress assets before building
- Use NSIS compression options
- Remove unnecessary files from the installer
- Consider using a web-based installer that downloads components on-demand

## Recommended: Use GitHub CLI

For most users, **Option 1 (GitHub CLI)** is the best solution:
- Free
- Supports files up to 2GB
- Integrates with GitHub releases
- Works with the auto-update system

## Testing Without Upload

To test the auto-update system without uploading:

```javascript
// In browser console (F12)
localStorage.setItem('latestVersion', '1.0.2');
// Refresh app
```
