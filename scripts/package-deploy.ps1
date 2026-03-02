# =============================================================
# package-deploy.ps1
# Run this from the project root to rebuild + repackage deploy/
# Usage: powershell -ExecutionPolicy Bypass -File scripts\package-deploy.ps1
# =============================================================

$projectRoot = Split-Path $PSScriptRoot -Parent
$deployDir   = Join-Path (Split-Path $projectRoot -Parent) "deploy"

Write-Host "Building Next.js..." -ForegroundColor Cyan
Set-Location $projectRoot
npm run build
if ($LASTEXITCODE -ne 0) { Write-Host "Build failed." -ForegroundColor Red; exit 1 }

Write-Host "Packaging to $deployDir ..." -ForegroundColor Cyan

# Back up the database and uploads before wiping deploy folder
$dbBackup      = Join-Path $deployDir "dev.db"
$uploadsBackup = Join-Path $env:TEMP "uploads_backup"
if (Test-Path $dbBackup) {
    Copy-Item $dbBackup (Join-Path $env:TEMP "dev.db.bak") -Force
    Write-Host "  Backed up dev.db to TEMP" -ForegroundColor Gray
}
if (Test-Path (Join-Path $deployDir "public\uploads")) {
    if (Test-Path $uploadsBackup) { Remove-Item $uploadsBackup -Recurse -Force }
    Copy-Item (Join-Path $deployDir "public\uploads") $uploadsBackup -Recurse -Force
    Write-Host "  Backed up public/uploads to TEMP" -ForegroundColor Gray
}

# Clean and recreate deploy folder
if (Test-Path $deployDir) { Remove-Item $deployDir -Recurse -Force }
New-Item -ItemType Directory -Path $deployDir | Out-Null

# Copy standalone build
Copy-Item (Join-Path $projectRoot ".next\standalone\*") $deployDir -Recurse -Force

# Copy static assets
$staticDest = Join-Path $deployDir ".next\static"
New-Item -ItemType Directory -Path $staticDest -Force | Out-Null
Copy-Item (Join-Path $projectRoot ".next\static\*") $staticDest -Recurse -Force

# Copy public (excluding uploads)
$publicDest = Join-Path $deployDir "public"
New-Item -ItemType Directory -Path $publicDest -Force | Out-Null
Get-ChildItem (Join-Path $projectRoot "public") |
    Where-Object { $_.Name -ne "uploads" } |
    ForEach-Object { Copy-Item $_.FullName $publicDest -Recurse -Force }

# Restore uploads backup
$uploadsDir = Join-Path $deployDir "public\uploads"
if (Test-Path $uploadsBackup) {
    Copy-Item $uploadsBackup $uploadsDir -Recurse -Force
    Write-Host "  Restored public/uploads from backup" -ForegroundColor Gray
} else {
    New-Item -ItemType Directory -Path $uploadsDir -Force | Out-Null
}

# Restore database
if (Test-Path (Join-Path $env:TEMP "dev.db.bak")) {
    Copy-Item (Join-Path $env:TEMP "dev.db.bak") (Join-Path $deployDir "dev.db") -Force
    Write-Host "  Restored dev.db from backup" -ForegroundColor Gray
} elseif (Test-Path (Join-Path $projectRoot "prisma\dev.db")) {
    Copy-Item (Join-Path $projectRoot "prisma\dev.db") (Join-Path $deployDir "dev.db") -Force
}

# Copy config files
Copy-Item (Join-Path $projectRoot "prisma\schema.prisma") (Join-Path $deployDir "prisma\schema.prisma") -Force

# Add deployment config files (don't overwrite existing .env on server)
if (-not (Test-Path (Join-Path $deployDir ".env"))) {
    if (Test-Path (Join-Path $deployDir ".env.production")) {
        Write-Host "  Note: rename .env.production to .env and fill in secrets" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "Done! Deploy folder: $deployDir" -ForegroundColor Green
Write-Host "Files in deploy root:"
Get-ChildItem $deployDir | Select-Object Name | Format-Table -HideTableHeaders
