# Fix GitHub CLI PATH Issue
# This script adds GitHub CLI to your PATH environment variable
# 
# IMPORTANT: After running this script, CLOSE ALL PowerShell windows
# and reopen a new one for the permanent PATH change to take effect!

Write-Host "`n🔧 Fixing GitHub CLI PATH..." -ForegroundColor Yellow

# Common GitHub CLI installation locations
$ghPaths = @(
    "C:\Program Files\GitHub CLI\gh.exe",
    "C:\Program Files (x86)\GitHub CLI\gh.exe",
    "$env:LOCALAPPDATA\Programs\GitHub CLI\gh.exe",
    "$env:ProgramFiles\GitHub CLI\gh.exe"
)

$ghDir = $null
$found = $false

# Check common locations
foreach ($path in $ghPaths) {
    if (Test-Path $path) {
        $ghDir = Split-Path $path -Parent
        Write-Host "`n✅ Found GitHub CLI at: $path" -ForegroundColor Green
        $found = $true
        break
    }
}

# If not found, search for it
if (-not $found) {
    Write-Host "`n🔍 Searching for GitHub CLI..." -ForegroundColor Yellow
    $search = Get-ChildItem -Path "C:\Program Files" -Filter "gh.exe" -Recurse -ErrorAction SilentlyContinue | Select-Object -First 1
    if ($search) {
        $ghDir = $search.DirectoryName
        Write-Host "`n✅ Found at: $($search.FullName)" -ForegroundColor Green
        $found = $true
    }
}

if (-not $found) {
    Write-Host "`n❌ GitHub CLI not found!" -ForegroundColor Red
    Write-Host "`nPlease install GitHub CLI from: https://cli.github.com/" -ForegroundColor Cyan
    Write-Host "`nAfter installing, run this script again." -ForegroundColor Yellow
    exit 1
}

# Add to user PATH
Write-Host "`n📝 Adding to user PATH..." -ForegroundColor Cyan
$currentPath = [Environment]::GetEnvironmentVariable("Path", "User")

if ($currentPath -notlike "*$ghDir*") {
    [Environment]::SetEnvironmentVariable("Path", "$currentPath;$ghDir", "User")
    Write-Host "`n✅ Added to PATH permanently!" -ForegroundColor Green
} else {
    Write-Host "`n✅ Already in PATH!" -ForegroundColor Green
}

# Add to current session
Write-Host "`n📝 Adding to current session..." -ForegroundColor Cyan
$env:Path += ";$ghDir"
Write-Host "`n✅ Added to current session!" -ForegroundColor Green

# Test the command
Write-Host "`n🧪 Testing gh command..." -ForegroundColor Yellow
try {
    gh --version
    Write-Host "`n✅ GitHub CLI is now working!" -ForegroundColor Green
    Write-Host "`n⚠️  IMPORTANT: Close and reopen PowerShell for permanent changes to take effect in new sessions." -ForegroundColor Yellow
} catch {
    Write-Host "`n❌ Error: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "`nTry closing and reopening PowerShell." -ForegroundColor Yellow
}
