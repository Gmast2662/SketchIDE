# Sketchbook Folder Feature

## Overview

When you save a project in the Electron app, it now automatically saves to a **sketchbook folder** on your computer. This makes it easy to:
- Find all your sketches in one place
- Share sketches with others
- Back up your work
- Access sketches from file explorer

## Location

The sketchbook folder is created automatically at:
- **Windows**: `%APPDATA%\SketchIDE\sketchbook\`
  - Example: `C:\Users\YourName\AppData\Roaming\SketchIDE\sketchbook\`
- **macOS**: `~/Library/Application Support/SketchIDE/sketchbook/`
- **Linux**: `~/.config/SketchIDE/sketchbook/`

## How It Works

1. **Save a Project**: When you save a project (Ctrl+S or File → Save), it:
   - Saves to localStorage (for quick access in the app)
   - **Also saves to the sketchbook folder** as a `.art` file

2. **File Format**: Each sketch is saved as `[ProjectName].art` in the sketchbook folder

3. **Automatic Creation**: The sketchbook folder is created automatically the first time you save a project

## Features

- ✅ **Automatic saving** - Every project save goes to the sketchbook
- ✅ **Easy access** - Open the folder from Windows Explorer
- ✅ **Portable** - Copy the entire sketchbook folder to backup or share
- ✅ **Web compatible** - Still works in web version (uses localStorage only)

## Accessing Your Sketches

### Method 1: File Explorer
1. Press `Win + R` (Windows) or open Finder (Mac)
2. Type/paste the sketchbook path (see Location above)
3. Press Enter

### Method 2: From the App
The sketchbook path is available programmatically, and future versions may include a "Open Sketchbook Folder" button.

## Notes

- **Web Version**: The sketchbook feature only works in the Electron app (the .exe). In the web version, projects are saved to browser localStorage only.
- **File Names**: Project names are sanitized to be valid file names (special characters are removed/replaced)
- **Backup**: To backup all your sketches, just copy the entire `sketchbook` folder!

## Troubleshooting

**Q: Where is my sketchbook folder?**
A: Check the location section above. On Windows, you can also:
1. Press `Win + R`
2. Type `%APPDATA%\SketchIDE\sketchbook`
3. Press Enter

**Q: Can I change the sketchbook location?**
A: Currently, it uses the default app data folder. This ensures the folder persists even if you move the app.

**Q: What if I delete a file from the sketchbook folder?**
A: The file will be removed, but the project will still exist in the app's localStorage until you delete it from the app.
