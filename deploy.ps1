$ErrorActionPreference = "Stop"

$LOCAL = "\\tsclient\E\websites\ashok\ashok-nextjs"
$DEST  = "C:\Inetpub\vhosts\ashokmahajan.in\httpdocs"

Write-Host "=== Step 1: Install PM2 globally ===" -ForegroundColor Cyan
npm install -g pm2
npm install -g pm2-windows-startup

Write-Host "=== Step 2: Copy standalone build ===" -ForegroundColor Cyan
New-Item -ItemType Directory -Force -Path $DEST | Out-Null
robocopy "$LOCAL\.next\standalone" "$DEST" /E /NFL /NDL /NJH /NJS

Write-Host "=== Step 3: Copy static assets ===" -ForegroundColor Cyan
New-Item -ItemType Directory -Force -Path "$DEST\.next\static" | Out-Null
robocopy "$LOCAL\.next\static" "$DEST\.next\static" /E /NFL /NDL /NJH /NJS

Write-Host "=== Step 4: Copy public folder ===" -ForegroundColor Cyan
robocopy "$LOCAL\public" "$DEST\public" /E /NFL /NDL /NJH /NJS

Write-Host "=== Step 5: Copy database ===" -ForegroundColor Cyan
New-Item -ItemType Directory -Force -Path "$DEST\prisma" | Out-Null
Copy-Item -Force "$LOCAL\prisma\dev.db" "$DEST\prisma\dev.db"

Write-Host "=== Step 6: Copy config files ===" -ForegroundColor Cyan
Copy-Item -Force "$LOCAL\web.config" "$DEST\web.config"
Copy-Item -Force "$LOCAL\ecosystem.config.js" "$DEST\ecosystem.config.js"

Write-Host "=== Step 7: Start PM2 ===" -ForegroundColor Cyan
Set-Location $DEST
$pm2list = pm2 list 2>&1
if ($pm2list -match "ashokmahajan") {
    pm2 restart ashokmahajan
} else {
    pm2 start ecosystem.config.js
}

Write-Host "=== Step 8: Save and enable auto-start on reboot ===" -ForegroundColor Cyan
pm2 save
pm2-startup install

Write-Host "=== Step 9: Verify ===" -ForegroundColor Cyan
pm2 list
Start-Sleep -Seconds 3
$r = Invoke-WebRequest -Uri "http://localhost:3000" -UseBasicParsing -TimeoutSec 10
Write-Host "OK - HTTP $($r.StatusCode)" -ForegroundColor Green
Write-Host "Site is live at https://www.ashokmahajan.in" -ForegroundColor Green
