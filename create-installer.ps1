# Simple installer script for SketchIDE
# This creates an installer from the portable version

param(
    [string]$InstallPath = "$env:ProgramFiles\SketchIDE"
)

Write-Host "SketchIDE Installer" -ForegroundColor Cyan
Write-Host "====================================" -ForegroundColor Cyan

# Check if portable version exists
$portablePath = "release\win-unpacked"
if (-not (Test-Path "$portablePath\SketchIDE.exe")) {
    Write-Host "ERROR: Portable version not found. Please build the app first." -ForegroundColor Red
    Write-Host "Run: npm run electron:build:win" -ForegroundColor Yellow
    exit 1
}

Write-Host "`nInstalling to: $InstallPath" -ForegroundColor Green

# Create installation directory
New-Item -ItemType Directory -Force -Path $InstallPath | Out-Null

# Copy files
Write-Host "Copying files..." -ForegroundColor Yellow
Copy-Item -Path "$portablePath\*" -Destination $InstallPath -Recurse -Force

# Create desktop shortcut
$desktop = [Environment]::GetFolderPath("Desktop")
$shortcut = "$desktop\SketchIDE.lnk"
$shell = New-Object -ComObject WScript.Shell
$link = $shell.CreateShortcut($shortcut)
$link.TargetPath = "$InstallPath\SketchIDE.exe"
$link.WorkingDirectory = $InstallPath
$link.IconLocation = "$InstallPath\SketchIDE.exe,0"
$link.Description = "SketchIDE"
$link.Save()
Write-Host "Created desktop shortcut" -ForegroundColor Green

# Create Start Menu shortcut
$startMenu = "$env:AppData\Microsoft\Windows\Start Menu\Programs"
$startMenuShortcut = "$startMenu\SketchIDE.lnk"
$link2 = $shell.CreateShortcut($startMenuShortcut)
$link2.TargetPath = "$InstallPath\SketchIDE.exe"
$link2.WorkingDirectory = $InstallPath
$link2.IconLocation = "$InstallPath\SketchIDE.exe,0"
$link2.Description = "SketchIDE"
$link2.Save()
Write-Host "Created Start Menu shortcut" -ForegroundColor Green

Write-Host "`nInstallation complete!" -ForegroundColor Green
Write-Host "You can now launch the app from the desktop shortcut or Start Menu." -ForegroundColor Cyan
