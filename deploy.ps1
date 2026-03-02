# ============================================================
# deploy.ps1 — Static Export Deploy to IIS
# Usage: Run this script after `npm run build`
# ============================================================
# Copies the out/ folder (excluding uploads/) to the IIS web root.
# Uploads are NOT copied — they are already on the server.
# ============================================================

$ErrorActionPreference = "Stop"

$SRC  = "$PSScriptRoot\out"
$DEST = "C:\Inetpub\vhosts\ashokmahajan.in\httpdocs"

Write-Host "=== Static Export Deploy ===" -ForegroundColor Cyan
Write-Host "Source : $SRC"
Write-Host "Dest   : $DEST"
Write-Host ""

# Verify out/ exists
if (-not (Test-Path $SRC)) {
    Write-Error "out/ folder not found. Run 'npm run build' first."
    exit 1
}

# Ensure destination exists
New-Item -ItemType Directory -Force -Path $DEST | Out-Null

Write-Host "Copying files (excluding uploads/)..." -ForegroundColor Cyan
robocopy $SRC $DEST /E /NFL /NDL /NJH /NJS /XD "uploads"

Write-Host ""
Write-Host "=== Done ===" -ForegroundColor Green
Write-Host "Site files updated at $DEST"
Write-Host "Remember: uploads/ on server are preserved (not overwritten)."
