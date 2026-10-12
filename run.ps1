<#
.SYNOPSIS
  Runs the Whisker Boom game from the repo root.

.PARAMETER Mode
  dev   (default) Server on :3001 and client on http://localhost:5173 with hot reload.
  prod  Builds the client, then serves everything from http://localhost:3001.

.PARAMETER Install
  Force `pnpm install` even if node_modules already exists.

.EXAMPLE
  .\run.ps1
  .\run.ps1 -Mode prod
#>
param(
  [ValidateSet('dev', 'prod')]
  [string]$Mode = 'dev',
  [switch]$Install
)

$ErrorActionPreference = 'Stop'
$workspace = Join-Path $PSScriptRoot 'working-artifacts\src'

if (-not (Get-Command node -ErrorAction SilentlyContinue)) { throw 'Node.js 22+ is required.' }
if (-not (Get-Command pnpm -ErrorAction SilentlyContinue)) { throw 'pnpm is required (npm i -g pnpm, or enable corepack).' }

Push-Location $workspace
try {
  if ($Install -or -not (Test-Path 'node_modules')) {
    pnpm install
    if ($LASTEXITCODE -ne 0) { throw 'pnpm install failed.' }
  }

  if ($Mode -eq 'prod') {
    pnpm build
    if ($LASTEXITCODE -ne 0) { throw 'pnpm build failed.' }
    $env:STATIC_DIR = Join-Path $workspace 'apps\client\dist'
    Write-Host 'Open http://localhost:3001' -ForegroundColor Green
    pnpm start
  }
  else {
    Write-Host 'Open http://localhost:5173' -ForegroundColor Green
    pnpm dev
  }
}
finally {
  Pop-Location
}
