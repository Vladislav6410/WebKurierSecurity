<# 
.SYNOPSIS
  Полная замена README в WebKurierSecurity (Windows, без симлинков).
  Создаёт/обновляет: README_public.md, README_tech.md, LICENSE.txt.
  README.md перезаписывается КОПИЕЙ README_public.md.

.PARAMETER DryRun
  Если указан, только показывает план действий без записи.

.EXAMPLES
  pwsh -File .\replace_readme.ps1
  pwsh -File .\replace_readme.ps1 -DryRun
#>

param(
  [switch]$DryRun
)

$ErrorActionPreference = "Stop"

function Write-Info([string]$msg) { Write-Host $msg -ForegroundColor Cyan }
function Write-Step([string]$msg) { Write-Host $msg -ForegroundColor Magenta }

function Backup-File([string]$Path) {
  if (Test-Path $Path) {
    $stamp = Get-Date -Format "yyyyMMdd_HHmmss"
    $backup = "$Path.$stamp.backup"
    if ($DryRun) { Write-Info "[DRY-RUN] Backup: $Path → $backup" }
    else { Copy-Item -LiteralPath $Path -Destination $backup -Force; Write-Info "Backup: $Path → $backup" }
  }
}

function Ensure-Dir([string]$DirPath) {
  if (-not (Test-Path $DirPath)) {
    if ($DryRun) { Write-Info "[DRY-RUN] Mkdir: $DirPath" }
    else { New-Item -ItemType Directory -Path $DirPath -Force | Out-Null }
  }
}

function Write-FileUtf8([string]$Path, [string]$Content) {
  Ensure-Dir (Split-Path -Parent $Path)
  if ($DryRun) { Write-Info "[DRY-RUN] Write: $Path" }
  else { $Content | Out-File -FilePath $Path -Encoding utf8 -Force }
}

# ── Контекст репозитория ───────────────────────────────────────────────────────
$RepoRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $RepoRoot
Write-Step "Running replace_readme.ps1 in $RepoRoot"

# ── Содержимое файлов ─────────────────────────────────────────────────────────
$README_PUBLIC = @"
# 🛡 WebKurierSecurity  
**Security Module for WebKurierCore**  
*Threat detection • File scanning • Token protection • Quarantine • Reports*

---

## Features
- Real-time threat detection
- File and directory scanning
- Protection of tokens, keys, and sensitive data
- Quarantine for suspicious objects
- Security reports (PDF/JSON)
- Integration with Dropbox, GitHub, and local system

---

## Project Structure
WebKurierSecurity/
├── engine/
│   └── agents/security/
│       ├── security-agent.js
│       ├── scanner.js
│       ├── quarantine.js
│       └── reports.js
├── config/
│   └── settings.json
├── .github/workflows/tests.yml
├── bench/
│   ├── users_validator.py
│   ├── bench_score.py
│   └── tests/test_users_validator.py
├── README_public.md   ← You’re reading it!
├── README_tech.md     ← Technical version
└── LICENSE.txt        ← Proprietary license

---

## Installation

```bash
git clone https://github.com/Vladislav6410/WebKurierSecurity.git
cd WebKurierSecurity
npm install

Launch

node engine/agents/security/security-agent.js
# or directly:
node security-agent.js

Integration with WebKurierCore
	1.	Copy the security/ folder into engine/agents/ of WebKurierCore.
	2.	Add the module to config/settings.json.
	3.	Run in WebKurierCore terminal: /security scan

⸻

License

Proprietary License — © 2025 Vladyslav Hushchyn (Владислав Гущин)
All rights reserved.
Use, modification, or distribution is prohibited without written permission from the author.
For permissions: @WebKurierBot
“@

$README_TECH = @”
WebKurierSecurity — Security Module for WebKurierCore

Description
Module provides security features for WebKurierCore: real-time threat detection, file scanning, token/key protection,
quarantine, and report generation.

Features
	•	Real-time threat detection
	•	File and directory scanning
	•	Protection of tokens, keys, and confidential data
	•	Quarantine of suspicious objects
	•	Security report generation (PDF/JSON)
	•	Integration with Dropbox, GitHub, and local filesystem

Project Structure
WebKurierSecurity/
├── engine/agents/security/
│   ├── security-agent.js    (entry point for agent)
│   ├── scanner.js           (scanning logic)
│   ├── quarantine.js        (isolation of threats)
│   └── reports.js           (report generator)
├── config/settings.json     (module configuration)
├── .github/workflows/tests.yml  (CI/CD pipeline)
├── bench/
│   ├── users_validator.py
│   ├── bench_score.py
│   └── tests/test_users_validator.py
├── README_public.md         (public documentation)
├── README_tech.md           (this technical file)
└── LICENSE.txt              (proprietary license)

Installation
git clone https://github.com/Vladislav6410/WebKurierSecurity.git
cd WebKurierSecurity
npm install

Launch
node engine/agents/security/security-agent.js

or

node security-agent.js

Integration with WebKurierCore
	1.	Copy the security/ folder to engine/agents/ in WebKurierCore.
	2.	Register the module in config/settings.json.
	3.	Execute in WebKurierCore terminal: /security scan

License
Proprietary License — © 2025 Vladyslav Hushchyn (Владислав Гущин)
All rights reserved. Use, copying, modification, or distribution of this code is prohibited
without prior written permission from the author.
Contact for permissions: Telegram @WebKurierBot — https://t.me/WebKurierBot
“@

$LICENSE_TXT = @”
Proprietary License — © 2025 Vladyslav Hushchyn (Владислав Гущин)
All rights reserved.
Use, modification, or distribution of this software is prohibited without the author’s prior written permission.

Проприетарная лицензия — © 2025 Владислав Гущин (Vladyslav Hushchyn)
Все права защищены.
Использование, копирование, изменение или распространение кода запрещено без письменного разрешения автора.

For permission inquiries:
@WebKurierBot — https://t.me/WebKurierBot
“@

── Пути ───────────────────────────────────────────────────────────────────────

$PublicPath  = Join-Path $RepoRoot “README_public.md”
$TechPath    = Join-Path $RepoRoot “README_tech.md”
$LicensePath = Join-Path $RepoRoot “LICENSE.txt”
$ReadmePath  = Join-Path $RepoRoot “README.md”

── Бэкапы ─────────────────────────────────────────────────────────────────────

Backup-File $ReadmePath
Backup-File $PublicPath
Backup-File $TechPath
Backup-File $LicensePath

── Запись новых файлов ───────────────────────────────────────────────────────

Write-FileUtf8 $PublicPath  ($README_PUBLIC.Trim()  + “n") Write-FileUtf8 $TechPath    ($README_TECH.Trim()    + "n”)
Write-FileUtf8 $LicensePath ($LICENSE_TXT.Trim()    + “`n”)

── README.md ← README_public.md (КОПИЯ) ──────────────────────────────────────

if ($DryRun) {
Write-Info “[DRY-RUN] README.md will be copied from README_public.md”
} else {
if (Test-Path $ReadmePath) { Remove-Item $ReadmePath -Force }
Copy-Item -LiteralPath $PublicPath -Destination $ReadmePath -Force
Write-Info “README.md ← README_public.md”
}

Write-Step “`nDone. README and LICENSE are updated.”
if ($DryRun) { Write-Info “Dry-run completed. Run without -DryRun to apply changes.” }

быстрый старт:
- пробный запуск: `pwsh -File .\replace_readme.ps1 -DryRun`  
- применить: `pwsh -File .\replace_readme.ps1`

