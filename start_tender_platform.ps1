# Requires: Windows, WSL
$ErrorActionPreference = 'Stop'
$projectRoot = "D:\InnovaTende007"
$uiDirWin = Join-Path $projectRoot 'vars\app\ui'
$apiDirWsl = '/mnt/d/InnovaTende007/vars/app/node'
$uiPort = 5174

Write-Host 'Starting Tender Platform...'

# Start API in WSL on port 3000 (foreground in new window for visibility)
try {
  $apiCmd = "cd $apiDirWsl && ./use-env.sh env.example && PORT=3000 node server.js"
  Start-Process wsl.exe -ArgumentList @('bash','-lc', $apiCmd) -WindowStyle Normal
  Write-Host 'API starting at http://localhost:3000'
} catch {
  Write-Warning "Failed to start API in WSL: $($_.Exception.Message)"
}

function Start-UiWindowsViaNode {
  Push-Location $uiDirWin
  try {
    if (!(Test-Path node_modules)) { npm install | Out-Null }
    $viteBin = Join-Path $uiDirWin 'node_modules\\vite\\bin\\vite.js'
    if (!(Test-Path $viteBin)) { npm install vite --save-dev | Out-Null }
    Start-Process -FilePath node -ArgumentList @($viteBin,'preview','--port',"$uiPort",'--host','127.0.0.1') -WorkingDirectory $uiDirWin | Out-Null
    Write-Host "UI starting (Windows node bin) at http://localhost:$uiPort"
  } finally { Pop-Location }
}

Start-UiWindowsViaNode

# Wait up to ~10s for UI port and open browser
$max = 10
for ($i=0; $i -lt $max; $i++) {
  Start-Sleep -Seconds 1
  try {
    $test = Test-NetConnection -ComputerName 'localhost' -Port $uiPort -WarningAction SilentlyContinue
    if ($test.TcpTestSucceeded) { Start-Process "http://localhost:$uiPort"; break }
  } catch {}
  if ($i -eq ($max-1)) { Write-Warning "UI port $uiPort is not reachable. To run manually: cd $uiDirWin; npm install; node node_modules/vite/bin/vite.js preview --port $uiPort --host 127.0.0.1" }
}

Write-Host 'Done.'
