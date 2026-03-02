# ============================================================
# build-and-deploy.ps1
# Run this whenever content changes (new posts, speeches, etc.)
# ============================================================
# Step 1: Rebuilds all HTML from the database (takes ~2 minutes)
# Step 2: Copies new files to IIS, skipping the uploads/ folder
# ============================================================

$ErrorActionPreference = "Stop"
$start = Get-Date

Set-Location $PSScriptRoot

$DEST = "C:\Inetpub\vhosts\ashokmahajan.in\httpdocs"

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Build + Deploy — Ashok Mahajan site" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# ── Step 1: Build ───────────────────────────────────────────
Write-Host "Step 1/2 — Building static export..." -ForegroundColor Yellow
npm run build
if ($LASTEXITCODE -ne 0) { Write-Error "Build failed. Deploy aborted."; exit 1 }

Write-Host ""
Write-Host "Step 2/2 — Deploying to $DEST ..." -ForegroundColor Yellow

# Verify out/ was generated
if (-not (Test-Path "out")) {
    Write-Error "out/ folder missing after build. Deploy aborted."
    exit 1
}

# Ensure destination exists
New-Item -ItemType Directory -Force -Path $DEST | Out-Null

# Copy everything except uploads/ (already on server)
robocopy out $DEST /E /NFL /NDL /NJH /NJS /XD uploads

$elapsed = [math]::Round(((Get-Date) - $start).TotalSeconds)
Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  Done in ${elapsed}s" -ForegroundColor Green
Write-Host "  Site live at https://www.ashokmahajan.in" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
