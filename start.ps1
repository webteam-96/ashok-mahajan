$ErrorActionPreference = "Stop"
Set-Location "C:\Inetpub\vhosts\ashokmahajan.in\httpdocs"

Write-Host "=== Installing PM2 ===" -ForegroundColor Cyan
npm install -g pm2
npm install -g pm2-windows-startup

Write-Host "=== Starting app ===" -ForegroundColor Cyan
$pm2list = pm2 list 2>&1
if ($pm2list -match "ashokmahajan") {
    pm2 restart ashokmahajan
} else {
    pm2 start ecosystem.config.js
}

pm2 save
pm2-startup install

pm2 list
Start-Sleep -Seconds 3
$r = Invoke-WebRequest -Uri "http://localhost:3000" -UseBasicParsing -TimeoutSec 10
Write-Host "OK - HTTP $($r.StatusCode)" -ForegroundColor Green
Write-Host "Live at https://www.ashokmahajan.in" -ForegroundColor Green
