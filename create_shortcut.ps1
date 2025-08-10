$ErrorActionPreference = 'Stop'
$desktop = [Environment]::GetFolderPath('Desktop')
$lnk = Join-Path $desktop 'Tender Platform.lnk'
$ws = New-Object -ComObject WScript.Shell
$sc = $ws.CreateShortcut($lnk)
$sc.TargetPath = 'powershell.exe'
$sc.Arguments = '-NoProfile -ExecutionPolicy Bypass -File "D:\InnovaTende007\start_tender_platform.ps1"'
$sc.WorkingDirectory = 'D:\InnovaTende007'
# Use a better built-in icon (Internet/Globe)
$sc.IconLocation = "$env:SystemRoot\System32\imageres.dll,109"
$sc.Save()
Write-Host "Created/Updated: $lnk"
