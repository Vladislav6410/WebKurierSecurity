## Репозитории экосистемы WebKurier (10 слотов)
<p align="center">
  <img src="docs/security-banner.svg" width="100%" alt="WebKurierSecurity — Security module for WebKurierCore">
</p>
| #  | Репозиторий           | Роль                       | Живут здесь                                           |
|----|-----------------------|----------------------------|-------------------------------------------------------|
| 1  | WebKurierHybrid       | Оркестратор + Инфраструктура | Docker, Ansible, VM, CI/CD, submodules               |
| 2  | WebKurierCore         | Веб-ядро + Агенты + Боты   | UI, AdminBot, Telegram/WhatsApp, агенты              |
| 3  | WebKurierDroneHybrid  | Все дроны в одном          | Геодезия, автопилот, рой, голограммы, питание        |
| 4  | WebKurierChain        | Блокчейн + Бухгалтерия     | Хранение, API, `accountant/`                         |
| 5  | WebKurierSecurity     | Security + Legal           | `engine/agents/security/`, скан, карантин, юрист, GDPR |
| 6  | WebKurierPhoneCore    | Бэкенд мобильного переводчика | Звонки, курсы A1–C1, отчёты                       |
| 7  | WebKurierPhone-iOS    | iOS-приложение             | SwiftUI, звонки, уроки, статистика                   |
| 8  | WebKurierPhone-Android| Android-приложение         | Jetpack Compose, тот же функционал                   |
| 9  | WebKurierSite         | Лендинг + Доки             | GitHub Pages, демо, QR, инструкции                   |
| 10 | (Резерв)              | Будущий спецпроект         | Holo-Show, AI-Cluster, etc.                          |


⸻

2. Обновлённые тексты README_public / README_tech / LICENSE

Ниже — готовый replace_readme.py, уже обновлённый под:
	•	новый проект WebKurierSecurity;
	•	роль репозитория №5 в общей схеме;
	•	указание «Made in Germany»;
	•	корректное имя: Vladyslav Hushchyn / Владислав Гущин;
	•	без упоминаний WebKurier-терминала (только обычный терминал Ubuntu 22.04).

Просто сохрани это как replace_readme.py в корне WebKurierSecurity и запусти в Ubuntu 22.04.

#!/usr/bin/env python3
"""
replace_readme.py — установка финальных README и LICENSE для WebKurierSecurity.

Использование (в терминале Ubuntu 22.04):

    # пробный прогон
    python3 replace_readme.py --dry-run

    # реальная замена
    python3 replace_readme.py

    # если симлинки запрещены (Windows/права)
    python3 replace_readme.py --no-symlink
"""

from pathlib import Path
from datetime import datetime
import argparse
import shutil

# Корень репозитория
REPO_ROOT = Path(__file__).parent.resolve()

README_PUBLIC = """# 🛡 WebKurierSecurity

Security & Compliance module for the **WebKurier** ecosystem (WebKurierCore, WebKurierHybrid, WebKurierChain, Dropbox, GitHub).

Made in Germany — 2025

## Overview

WebKurierSecurity is responsible for threat detection, file scanning, token & key protection, quarantine of suspicious objects, 
and generation of security reports for the whole WebKurier stack.

## Role in WebKurier ecosystem

This repository is **slot #5** in the global WebKurier layout:

- Repository: `WebKurierSecurity`
- Role: `Security + Legal`
- Lives: `engine/agents/security/` (security-agent, scanner, quarantine, reports, legal/GDPR checks)

## Features

- Real-time threat detection
- File and directory scanning
- Protection of tokens, keys, and sensitive data
- Quarantine for suspicious objects
- Security reports (PDF/JSON)
- Integration with Dropbox, GitHub, and local filesystem
- Hooks for legal/GDPR checks and audit

## Project Structure

```text
WebKurierSecurity/
├── engine/agents/security/
│   ├── security-agent.js       # main security agent entry point
│   ├── scanner.js              # scanning logic
│   ├── quarantine.js           # isolation of threats
│   └── reports.js              # report generator
├── config/
│   └── settings.json           # module configuration
├── .github/workflows/
│   └── tests.yml               # CI pipeline (lint/tests)
├── bench/
│   ├── users_validator.py
│   ├── bench_score.py
│   └── tests/
│       └── test_users_validator.py
├── README_public.md            # this public documentation (you are here)
├── README_tech.md              # technical details for developers
└── LICENSE.txt                 # proprietary license

Installation (Ubuntu 22.04 LTS)

Requirements:
	•	Node.js 18+ or 20+
	•	Git
	•	Python 3 (for tools in bench/, optional)

git clone https://github.com/Vladislav6410/WebKurierSecurity.git
cd WebKurierSecurity
npm install

Usage

Run the security agent from your system terminal (Ubuntu 22.04):

cd WebKurierSecurity
node engine/agents/security/security-agent.js
# or:
node security-agent.js

The agent can be integrated as:
	•	a background service (systemd unit),
	•	a CLI tool for on-demand scans,
	•	an internal module called by WebKurierCore / WebKurierHybrid.

Integration examples
	•	WebKurierCore: call the scanner via internal HTTP/CLI from backend or scheduled jobs.
	•	WebKurierHybrid: register WebKurierSecurity as a security service in the orchestrator.
	•	WebKurierChain: send hashes, logs and incident reports to the blockchain for immutable storage.

License

Proprietary License — © 2025 Vladyslav Hushchyn (Владислав Гущин) — Made in Germany
All rights reserved.
Use, modification, or distribution is prohibited without written permission from the author.

For permissions and commercial licensing:
	•	Telegram: @WebKurierBot
“””

README_TECH = “””# WebKurierSecurity — Technical Documentation

Description

WebKurierSecurity provides security and compliance features for the WebKurier ecosystem:
	•	real-time threat detection,
	•	file and directory scanning,
	•	protection of tokens, keys, and confidential data,
	•	quarantine of suspicious objects,
	•	security report generation (PDF/JSON),
	•	integration with Dropbox, GitHub and local filesystem,
	•	hooks for legal / GDPR checks and audit.

This document is intended for developers and integrators.

Architecture

Main components:
	•	security-agent.js — high-level orchestration and public interface;
	•	scanner.js — core scanning logic (file system, patterns, signatures, rules);
	•	quarantine.js — isolation of suspicious/malicious objects;
	•	reports.js — generation of security reports (JSON, PDF via external tools if configured);
	•	config/settings.json — configuration of paths, rules, integration switches.

Project Structure

WebKurierSecurity/
├── engine/agents/security/
│   ├── security-agent.js       # entry point for security agent
│   ├── scanner.js              # scanning logic
│   ├── quarantine.js           # quarantine and restore
│   └── reports.js              # report generator
├── config/
│   └── settings.json           # module configuration
├── .github/workflows/
│   └── tests.yml               # CI/CD pipeline (lint/tests)
├── bench/
│   ├── users_validator.py      # example validation benchmark
│   ├── bench_score.py          # scoring utilities
│   └── tests/
│       └── test_users_validator.py
├── README_public.md            # public documentation
├── README_tech.md              # this technical file
└── LICENSE.txt                 # proprietary license

Installation

git clone https://github.com/Vladislav6410/WebKurierSecurity.git
cd WebKurierSecurity
npm install

Node.js 18+ (preferably 20+) is recommended.

Running the agent

From a system terminal (Ubuntu 22.04 or compatible):

cd WebKurierSecurity
node engine/agents/security/security-agent.js
# or
node security-agent.js

The wrapper security-agent.js can expose:
	•	CLI commands (e.g. scan, report, quarantine, restore),
	•	HTTP API (optional, via Express/Fastify),
	•	hooks for other WebKurier services.

Integration with WebKurierCore

Typical integration steps:
	1.	Add WebKurierSecurity configuration block to WebKurierCore/config/settings.json (endpoints, paths, API keys if any).
	2.	Configure backend service in WebKurierCore to call WebKurierSecurity for:
	•	pre-deploy scans,
	•	on-demand scans of uploaded files,
	•	scheduled full scans.
	3.	Optionally, propagate incidents and report metadata to WebKurierChain.

Logging & Reports
	•	Scanner and quarantine modules should log all actions to a dedicated log file (e.g. logs/security.log).
	•	Reports can be generated as JSON; PDF generation can be added via external tools and configured in config/settings.json.

Bench module

bench/ contains example utilities and tests for validators and scoring logic.
They are optional and can be used as a template for further security-related benchmarks.

License

Proprietary License — © 2025 Vladyslav Hushchyn (Владислав Гущин) — Made in Germany

All rights reserved. Use, copying, modification or distribution of this code is prohibited
without prior written permission from the author.

Contact for permissions:
	•	Telegram: @WebKurierBot
“””

LICENSE_TXT = “”“Proprietary License — © 2025 Vladyslav Hushchyn (Владислав Гущин)
Made in Germany — 2025
All rights reserved.
Use, modification, or distribution of this software is prohibited without the author’s prior written permission.

Проприетарная лицензия — © 2025 Владислав Гущин (Vladyslav Hushchyn)
Разработка: Германия, 2025.
Все права защищены.
Использование, копирование, изменение или распространение кода запрещено без письменного разрешения автора.

For permission inquiries:
@WebKurierBot — https://t.me/WebKurierBot
“””

def write_file(path: Path, content: str, dry_run: bool = False) -> None:
“”“Записывает файл, создавая папки при необходимости.”””
if dry_run:
print(f”[DRY-RUN] Создание: {path}”)
return
path.parent.mkdir(parents=True, exist_ok=True)
path.write_text(content, encoding=“utf-8”, newline=”\n”)
print(f”Создан: {path}”)

def backup_file(path: Path, dry_run: bool = False) -> None:
“”“Создаёт резервную копию, если файл существует.”””
if path.exists():
stamp = datetime.now().strftime(”%Y%m%d_%H%M%S”)
backup = path.with_suffix(path.suffix + f”.{stamp}.backup”)
if dry_run:
print(f”[DRY-RUN] Резерв: {path} → {backup}”)
else:
shutil.copy2(path, backup)
print(f”Резерв: {path} → {backup}”)

def main() -> None:
parser = argparse.ArgumentParser(
description=“Замена README (public + tech) и LICENSE на финальные версии для WebKurierSecurity.”
)
parser.add_argument(
“–dry-run”,
action=“store_true”,
help=“Только показать, что будет сделано.”,
)
parser.add_argument(
“–no-symlink”,
action=“store_true”,
help=“Не делать симлинк README.md → README_public.md (создать копию).”,
)
args = parser.parse_args()

print("Запуск замены README-файлов в WebKurierSecurity")

public_path = REPO_ROOT / "README_public.md"
tech_path = REPO_ROOT / "README_tech.md"
license_path = REPO_ROOT / "LICENSE.txt"
old_readme = REPO_ROOT / "README.md"

# Бэкапы
backup_file(old_readme, args.dry_run)
backup_file(public_path, args.dry_run)
backup_file(tech_path, args.dry_run)
backup_file(license_path, args.dry_run)

# Запись новых файлов
write_file(public_path, README_PUBLIC.strip() + "\n", args.dry_run)
write_file(tech_path, README_TECH.strip() + "\n", args.dry_run)
write_file(license_path, LICENSE_TXT.strip() + "\n", args.dry_run)

# Удаление старого README.md
if old_readme.exists():
    if args.dry_run:
        print(f"[DRY-RUN] Удаление: {old_readme}")
    else:
        old_readme.unlink()
        print(f"Удалён: {old_readme}")

# README.md → README_public.md
symlink_target = REPO_ROOT / "README.md"
if symlink_target.exists() and not args.dry_run:
    symlink_target.unlink()

if args.dry_run:
    print(f"[DRY-RUN] README.md будет указывать на {public_path.name}")
else:
    if args.no_symlink:
        shutil.copy2(public_path, symlink_target)
        print(f"Копия: README.md ← {public_path.name}")
    else:
        try:
            symlink_target.symlink_to(public_path.name)
            print(f"Симлинк: README.md → {public_path.name}")
        except OSError:
            shutil.copy2(public_path, symlink_target)
            print(f"Симлинк недоступен, сделана копия: README.md ← {public_path.name}")

print("\nГотово! Финальные README и LICENSE установлены.")
if args.dry_run:
    print("Это был пробный запуск. Запусти без --dry-run для применения.")

if name == “main”:
main()

---

Если хочешь, могу отдельно вытащить «чистые» версии:

- `README_public.md`
- `README_tech.md`
- `LICENSE.txt`

чтобы ты мог просто вставить их напрямую в GitHub без скрипта.
