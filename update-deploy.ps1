$src    = "E:\websites\ashok\ashok-nextjs\.next\standalone"
$dst    = "E:\websites\ashok\ashok-nextjs\deploy"
$static = "E:\websites\ashok\ashok-nextjs\.next\static"

Write-Host "Copying standalone -> deploy..." -ForegroundColor Cyan
Copy-Item -Path "$src\*" -Destination $dst -Recurse -Force

Write-Host "Copying static assets..." -ForegroundColor Cyan
$staticDst = "$dst\.next\static"
New-Item -ItemType Directory -Force -Path $staticDst | Out-Null
Copy-Item -Path "$static\*" -Destination $staticDst -Recurse -Force

Write-Host "Copying database..." -ForegroundColor Cyan
Copy-Item -Path "E:\websites\ashok\ashok-nextjs\dev.db" -Destination "$dst\dev.db" -Force

Write-Host "Done. BUILD_ID:" -ForegroundColor Green
Get-Content "$dst\.next\BUILD_ID"
