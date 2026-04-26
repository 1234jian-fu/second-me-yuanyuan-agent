param(
  [Parameter(ValueFromRemainingArguments = $true)]
  [string[]]$Args
)

$pythonCandidates = @(
  "$env:LOCALAPPDATA\Programs\Python\Python314\python.exe",
  "$env:LOCALAPPDATA\Programs\Python\Python313\python.exe",
  "$env:LOCALAPPDATA\Programs\Python\Python312\python.exe",
  "$env:LOCALAPPDATA\Programs\Python\Python311\python.exe"
)

$pythonPath = $pythonCandidates | Where-Object { Test-Path $_ } | Select-Object -First 1

if (-not $pythonPath) {
  $pythonCommand = Get-Command python -ErrorAction SilentlyContinue
  if ($pythonCommand -and $pythonCommand.Source -notlike "*WindowsApps*") {
    $pythonPath = $pythonCommand.Source
  }
}

if (-not $pythonPath) {
  throw "No usable Python runtime found. Disable the Windows App Execution Alias for python.exe or install Python into LocalAppData\\Programs\\Python."
}

$skillScript = Join-Path $PSScriptRoot "..\.codex\skills\ui-ux-pro-max\scripts\search.py"

if (-not (Test-Path $skillScript)) {
  throw "ui-ux-pro-max search.py not found. Run 'uipro init --ai codex' first."
}

& $pythonPath $skillScript @Args
exit $LASTEXITCODE
