# ============================================================
# server-deploy.ps1  —  Run this ON THE SERVER via RDP
# ============================================================
# It reads the deploy/ folder from your local PC (via tsclient)
# and copies it to the IIS web root on the server.
# ============================================================
# HOW TO USE:
#   1. Build locally first:  npm run build   (on your PC)
#   2. RDP into the server
#   3. Open PowerShell as Administrator on the server
#   4. Run:  \\tsclient\E\websites\ashok\ashok-nextjs\server-deploy.ps1
# ============================================================

$ErrorActionPreference = "Stop"

$SRC  = "\\tsclient\E\websites\ashok\ashok-nextjs\deploy"
$DEST = "C:\Inetpub\vhosts\ashokmahajan.in\httpdocs"

Write-Host ""
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "  Server Deploy — Ashok Mahajan (Static)" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "Source : $SRC"
Write-Host "Dest   : $DEST"
Write-Host ""

# Verify source is accessible
if (-not (Test-Path $SRC)) {
    Write-Error "Cannot reach $SRC — is RDP drive sharing enabled? (Local Resources → Drives)"
    exit 1
}

# ── Stop PM2 (old Node.js app) ──────────────────────────────
Write-Host "Step 1/3 — Stopping old Node.js app (PM2)..." -ForegroundColor Yellow
try {
    $pm2list = pm2 list 2>&1
    if ($pm2list -match "ashokmahajan") {
        pm2 delete ashokmahajan
        Write-Host "  PM2 app stopped and deleted." -ForegroundColor Gray
    } else {
        Write-Host "  PM2 app not running — nothing to stop." -ForegroundColor Gray
    }
} catch {
    Write-Host "  PM2 not found or already stopped — continuing." -ForegroundColor Gray
}

# ── Copy static files to IIS root ───────────────────────────
Write-Host ""
Write-Host "Step 2/3 — Copying static files to IIS..." -ForegroundColor Yellow
New-Item -ItemType Directory -Force -Path $DEST | Out-Null
robocopy $SRC $DEST /E /NFL /NDL /NJH /NJS /XD uploads
Write-Host "  Files copied." -ForegroundColor Gray

# ── Verify uploads folder ────────────────────────────────────
Write-Host ""
Write-Host "Step 3/3 — Checking uploads folder..." -ForegroundColor Yellow
$uploadsPath = "$DEST\uploads"
if (Test-Path $uploadsPath) {
    $count = (Get-ChildItem $uploadsPath -Recurse -File).Count
    Write-Host "  uploads/ exists — $count files found. Good." -ForegroundColor Gray
} else {
    Write-Host ""
    Write-Host "  WARNING: $uploadsPath does not exist!" -ForegroundColor Red
    Write-Host "  Media images on the site will be broken." -ForegroundColor Red
    Write-Host "  You need to copy the uploads/ folder to the server once." -ForegroundColor Red
    Write-Host "  See UPLOAD MEDIA section in the guide." -ForegroundColor Red
}

Write-Host ""
Write-Host "==========================================" -ForegroundColor Green
Write-Host "  Done! Test: https://www.ashokmahajan.in" -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Green
