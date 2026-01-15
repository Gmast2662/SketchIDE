# Fix GitHub CLI "gh not recognized" Error in PowerShell

If you installed GitHub CLI but PowerShell doesn't recognize the `gh` command, follow these steps:

## 🚀 Quick Fix Script

**Easiest method:** Run the automated fix script:

1. Open PowerShell (as Administrator for best results)
2. Navigate to your project folder
3. Run: `.\FIX_GITHUB_CLI_PATH.ps1`

This script will automatically find GitHub CLI and add it to your PATH.

---

## Manual Solutions

If the script doesn't work or you prefer manual steps:

## Solution 1: Restart PowerShell (Quick Fix)

1. **Close your current PowerShell window**
2. **Open a new PowerShell window**
3. Try `gh --version` again

The PATH environment variable is usually updated when you open a new terminal session.

## Solution 2: Manually Add to PATH (If Solution 1 doesn't work)

### Step 1: Find GitHub CLI Installation Path

GitHub CLI is typically installed to one of these locations:
- `C:\Program Files\GitHub CLI\`
- `C:\Users\YourUsername\AppData\Local\Programs\GitHub CLI\`

### Step 2: Add to PATH in PowerShell (Temporary - Current Session Only)

```powershell
# Replace with your actual path
$env:Path += ";C:\Program Files\GitHub CLI"
```

### Step 3: Add to PATH Permanently (Recommended)

**Option A: Using PowerShell (Run as Administrator)**

```powershell
# Run PowerShell as Administrator, then:
[Environment]::SetEnvironmentVariable(
    "Path",
    $env:Path + ";C:\Program Files\GitHub CLI",
    [EnvironmentVariableTarget]::User
)
```

**Option B: Using Windows Settings**

1. Press `Win + X` and select **System**
2. Click **Advanced system settings**
3. Click **Environment Variables**
4. Under **User variables**, find and select **Path**, then click **Edit**
5. Click **New** and add: `C:\Program Files\GitHub CLI`
6. Click **OK** on all dialogs
7. **Restart PowerShell**

### Step 4: Verify Installation

```powershell
gh --version
```

You should see the GitHub CLI version number.

## Solution 3: Reinstall GitHub CLI

If the above doesn't work, reinstall GitHub CLI:

1. Download from: https://cli.github.com/
2. Run the installer
3. **Make sure "Add to PATH" is checked** during installation
4. Restart PowerShell after installation

## Quick Test

After fixing the PATH:

```powershell
# Check version
gh --version

# Authenticate (first time only)
gh auth login

# Create a release (example)
gh release create v1.0.2 "release/SketchIDE Setup 1.0.2.exe" --title "Version 1.0.2"
```

## Common Issues

- **"Execution Policy" error**: Run `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser` in PowerShell (as Administrator)
- **Still not found after restart**: Make sure you closed ALL PowerShell windows and reopened them
- **Path has spaces**: Wrap the path in quotes when adding to PATH
