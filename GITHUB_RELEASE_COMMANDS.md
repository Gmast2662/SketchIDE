# GitHub CLI Release Commands

## Upload to an Existing Release

If a release already exists and you want to add or update files:

```bash
# Upload a single file (replaces if it exists)
gh release upload v1.0.2 "release/SketchIDE Setup 1.0.2.exe" --clobber

# Upload multiple files
gh release upload v1.0.2 "release/SketchIDE Setup 1.0.2.exe" "release/other-file.zip" --clobber

# Upload all files from a directory
gh release upload v1.0.2 release/*.exe --clobber
```

**Flags:**
- `--clobber` - Replace existing files with the same name (required if file already exists)
- `v1.0.2` - The release tag (must match exactly)

## Create a New Release

If the release doesn't exist yet:

```bash
# Create release with a single file
gh release create v1.0.2 "release/SketchIDE Setup 1.0.2.exe" \
  --title "Version 1.0.2" \
  --notes "Release notes here"

# Create release with multiple files
gh release create v1.0.2 \
  "release/SketchIDE Setup 1.0.2.exe" \
  "release/portable.zip" \
  --title "Version 1.0.2" \
  --notes "## What's New
- Feature 1
- Feature 2
- Bug fixes"
```

## Update Release Notes

To update just the release notes without uploading files:

```bash
gh release edit v1.0.2 --notes "Updated release notes here"
```

## View Release Info

```bash
# List all releases
gh release list

# View a specific release
gh release view v1.0.2
```

## Delete a Release

```bash
# Delete a release (and all its assets)
gh release delete v1.0.2 --yes
```

## Common Workflow

1. **Build your app:**
   ```bash
   npm run electron:build:win
   ```

2. **Upload to existing release:**
   ```bash
   gh release upload v1.0.2 "release/SketchIDE Setup 1.0.2.exe" --clobber
   ```

3. **Or create a new release:**
   ```bash
   gh release create v1.0.2 "release/SketchIDE Setup 1.0.2.exe" \
     --title "Version 1.0.2" \
     --notes "Release notes"
   ```

## Notes

- Tag must start with `v` (e.g., `v1.0.2`)
- Version in package.json should NOT have `v` (e.g., `1.0.2`)
- Use `--clobber` to replace existing files
- Files must exist before uploading (build first!)
- GitHub CLI handles files up to 2GB
