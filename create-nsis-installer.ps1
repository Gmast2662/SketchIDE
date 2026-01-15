# Create NSIS installer from portable version
# This script creates a proper installer using NSIS (if available) or a simple batch installer

param(
    [string]$InstallPath = "$env:ProgramFiles\SketchIDE"
)

$ErrorActionPreference = "Stop"

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "SketchIDE - Installer Creator" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

# Check if portable version exists
$portablePath = "release\win-unpacked"
if (-not (Test-Path "$portablePath\SketchIDE.exe")) {
    Write-Host "ERROR: Portable version not found!" -ForegroundColor Red
    Write-Host "Please build the app first: npm run electron:build:win" -ForegroundColor Yellow
    exit 1
}

Write-Host "✓ Portable version found" -ForegroundColor Green

# Create installer directory
$installerDir = "release\installer"
New-Item -ItemType Directory -Force -Path $installerDir | Out-Null

# Create a simple batch installer
$installerScript = @"
@echo off
echo ========================================
echo SketchIDE - Installer
echo ========================================
echo.

set INSTALL_DIR=%ProgramFiles%\SketchIDE

echo Installing to: %INSTALL_DIR%
echo.

REM Create directory
mkdir "%INSTALL_DIR%" 2>nul

REM Copy files
echo Copying files...
xcopy /E /I /Y "%~dp0win-unpacked\*" "%INSTALL_DIR%\" >nul

REM Create desktop shortcut
echo Creating shortcuts...
set SCRIPT="%TEMP%\CreateShortcut.vbs"
echo Set oWS = WScript.CreateObject("WScript.Shell") > %SCRIPT%
echo sLinkFile = "%USERPROFILE%\Desktop\SketchIDE.lnk" >> %SCRIPT%
echo Set oLink = oWS.CreateShortcut(sLinkFile) >> %SCRIPT%
echo oLink.TargetPath = "%INSTALL_DIR%\SketchIDE.exe" >> %SCRIPT%
echo oLink.WorkingDirectory = "%INSTALL_DIR%" >> %SCRIPT%
echo oLink.Save >> %SCRIPT%
cscript /nologo %SCRIPT% >nul
del %SCRIPT%

echo.
echo Installation complete!
echo.
echo The app has been installed to: %INSTALL_DIR%
echo A desktop shortcut has been created.
echo.
pause
"@

$installerScript | Out-File -FilePath "$installerDir\install.bat" -Encoding ASCII

# Also create a zip file for easy distribution
Write-Host "Creating installer package..." -ForegroundColor Yellow

# Copy portable version to installer directory
Copy-Item -Path "$portablePath" -Destination "$installerDir\win-unpacked" -Recurse -Force

Write-Host "✓ Installer created!" -ForegroundColor Green
Write-Host "`nInstaller location: $installerDir" -ForegroundColor Cyan
Write-Host "  - install.bat (Run this to install)" -ForegroundColor White
Write-Host "  - win-unpacked\ (Portable version)" -ForegroundColor White
Write-Host "`nTo create a zip installer:" -ForegroundColor Yellow
Write-Host "  Compress the '$installerDir' folder and share it!" -ForegroundColor White
