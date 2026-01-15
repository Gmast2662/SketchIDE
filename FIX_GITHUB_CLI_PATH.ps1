# Fix GitHub CLI PATH Issue
# Run this script as Administrator or for current user

Write-Host "================================================" -ForegroundColor Cyan
Write-Host "GitHub CLI PATH Fix Script" -ForegroundColor Cyan
Write-Host "================================================`n" -ForegroundColor Cyan

# Common installation paths
$possiblePaths = @(
    "C:\Program Files\GitHub CLI",
    "C:\Program Files (x86)\GitHub CLI",
    "$env:LOCALAPPDATA\Programs\GitHub CLI",
    "$env:ProgramFiles\GitHub CLI"
)

$ghPath = $null

# Search for gh.exe
Write-Host "Searching for GitHub CLI installation...`n" -ForegroundColor Yellow

foreach ($path in $possiblePaths) {
    if (Test-Path "$path\gh.exe") {
        $ghPath = $path
        Write-Host "✓ Found GitHub CLI at: $ghPath" -ForegroundColor Green
        break
    }
}

# If not found in common paths, search Program Files
if (-not $ghPath) {
    Write-Host "Searching entire Program Files directory..." -ForegroundColor Yellow
    $found = Get-ChildItem -Path "C:\Program Files" -Filter "gh.exe" -Recurse -ErrorAction SilentlyContinue | Select-Object -First 1
    
    if ($found) {
        $ghPath = Split-Path $found.FullName -Parent
        Write-Host "✓ Found GitHub CLI at: $ghPath" -ForegroundColor Green
    }
}

# If still not found, check if already in PATH
if (-not $ghPath) {
    $ghCommand = Get-Command gh -ErrorAction SilentlyContinue
    if ($ghCommand) {
        $ghPath = Split-Path $ghCommand.Source -Parent
        Write-Host "✓ GitHub CLI already in PATH at: $ghPath" -ForegroundColor Green
        Write-Host "`nGitHub CLI should work. Try restarting PowerShell." -ForegroundColor Cyan
        exit 0
    }
}

# If not found at all, suggest installation
if (-not $ghPath) {
    Write-Host "`n✗ GitHub CLI not found!" -ForegroundColor Red
    Write-Host "`nPlease install GitHub CLI from:" -ForegroundColor Yellow
    Write-Host "https://cli.github.com/" -ForegroundColor Cyan
    Write-Host "`nMake sure to check 'Add to PATH' during installation.`n" -ForegroundColor Yellow
    exit 1
}

# Check if already in PATH
$currentPath = [Environment]::GetEnvironmentVariable("Path", "User")
if ($currentPath -like "*$ghPath*") {
    Write-Host "`n✓ GitHub CLI directory already in PATH" -ForegroundColor Green
    Write-Host "`nTry restarting PowerShell or run:" -ForegroundColor Yellow
    Write-Host "`$env:Path += ';$ghPath'" -ForegroundColor White
    exit 0
}

# Add to PATH
Write-Host "`nAdding GitHub CLI to PATH..." -ForegroundColor Yellow

try {
    $newPath = $currentPath + ";$ghPath"
    [Environment]::SetEnvironmentVariable("Path", $newPath, "User")
    
    # Also add to current session
    $env:Path += ";$ghPath"
    
    Write-Host "✓ Successfully added to PATH!" -ForegroundColor Green
    Write-Host "`nTesting GitHub CLI..." -ForegroundColor Yellow
    
    Start-Sleep -Seconds 1
    $test = & "$ghPath\gh.exe" --version 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ GitHub CLI is working!" -ForegroundColor Green
        Write-Host $test -ForegroundColor White
        Write-Host "`n✓ All done! You can now use 'gh' command." -ForegroundColor Green
        Write-Host "`nNote: You may need to restart PowerShell for the PATH change to take full effect." -ForegroundColor Yellow
    } else {
        Write-Host "✗ GitHub CLI test failed. Try restarting PowerShell." -ForegroundColor Red
    }
} catch {
    Write-Host "✗ Error adding to PATH: $_" -ForegroundColor Red
    Write-Host "`nTry running PowerShell as Administrator, or manually add:" -ForegroundColor Yellow
    Write-Host $ghPath -ForegroundColor White
    Write-Host "`nto your PATH environment variable." -ForegroundColor Yellow
}
