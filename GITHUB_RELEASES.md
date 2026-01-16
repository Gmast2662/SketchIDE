# GitHub Releases Guide

This guide explains how to create and manage releases for SketchIDE using GitHub CLI.

## Prerequisites

1. **Install GitHub CLI**: Download from https://cli.github.com/
2. **Authenticate**: Run `gh auth login` in PowerShell
3. **Fix PATH (if needed)**: If `gh` command is not recognized, run `FIX_GITHUB_CLI_PATH.ps1` or manually add GitHub CLI to your PATH

## Creating a New Release

### Basic Release

```bash
# Create a release with a single file
gh release create v1.0.2 "release/SketchIDE Setup 1.0.2.exe" \
  --title "Version 1.0.2" \
  --notes "Release notes here"
```

### Release with Multiple Files

```bash
# Create a release with multiple files
gh release create v1.0.2 \
  "release/SketchIDE Setup 1.0.2.exe" \
  "release/other-file.zip" \
  --title "Version 1.0.2" \
  --notes "Release notes here"
```

### Release with Notes from File

```bash
# Create a release with notes from a file
gh release create v1.0.2 "release/SketchIDE Setup 1.0.2.exe" \
  --title "Version 1.0.2" \
  --notes-file CHANGELOG.md
```

## Uploading to an Existing Release

If a release already exists and you want to add or update files:

```bash
# Upload a single file (replaces if exists)
gh release upload v1.0.2 "release/SketchIDE Setup 1.0.2.exe" --clobber

# Upload multiple files
gh release upload v1.0.2 \
  "release/SketchIDE Setup 1.0.2.exe" \
  "release/other-file.zip" \
  --clobber

# Upload all files from a directory
gh release upload v1.0.2 release/*.exe --clobber
```

**Important Flags:**
- `--clobber` - Replace existing files with the same name (required if file already exists)
- `v1.0.2` - The release tag (must match exactly, including the 'v' prefix)

## Large File Uploads

If your installer file is too large (>100MB) for direct GitHub upload:

1. **Use GitHub CLI** (recommended):
   ```bash
   gh release upload v1.0.2 "release/SketchIDE Setup 1.0.2.exe" --clobber
   ```
   GitHub CLI can handle larger files than the web interface.

2. **Alternative**: Use Git LFS (Large File Storage) for very large files

## Common Commands

### List Releases
```bash
gh release list
```

### View Release Details
```bash
gh release view v1.0.2
```

### Delete a Release
```bash
gh release delete v1.0.2 --yes
```

### Edit Release Notes
```bash
gh release edit v1.0.2 --notes "Updated release notes"
```

## Workflow Example

1. **Build the app:**
   ```bash
   npm run electron:build:win
   ```

2. **Find the installer:**
   - Location: `release/SketchIDE Setup 1.0.2.exe`

3. **Create or update release:**
   ```bash
   # If release doesn't exist
   gh release create v1.0.2 "release/SketchIDE Setup 1.0.2.exe" \
     --title "SketchIDE v1.0.2" \
     --notes "Bug fixes and improvements"
   
   # If release exists, upload to it
   gh release upload v1.0.2 "release/SketchIDE Setup 1.0.2.exe" --clobber
   ```

## Troubleshooting

### "gh: command not found"
- Run `FIX_GITHUB_CLI_PATH.ps1` script
- Or manually add GitHub CLI to your PATH
- Restart PowerShell after adding to PATH

### "File too large" error
- Use `gh release upload` instead of web interface
- GitHub CLI can handle larger files

### "Release already exists"
- Use `gh release upload` with `--clobber` flag
- Or delete the existing release first: `gh release delete v1.0.2 --yes`

### Authentication Issues
- Run `gh auth login` to re-authenticate
- Check your GitHub token: `gh auth status`

## Tips

- Always use semantic versioning (e.g., `v1.0.2`)
- Include release notes describing changes
- Tag releases immediately after building
- Test the installer before uploading
- Keep release notes in a `CHANGELOG.md` file for consistency
