# 🛡 WebKurierSecurity

**WebKurierSecurity** — модуль защиты для **WebKurierCore**.  

---

## 📌 Основные функции
- 🔍 Обнаружение угроз в реальном времени  
- 🗂 Сканирование файлов и каталогов  
- 🔑 Защита токенов, ключей и конфиденциальных данных  
- 🛑 Карантин подозрительных объектов  
- 📄 Генерация отчётов о проверках  
- 🔐 Интеграция с **Dropbox**, **GitHub** и локальной системой  

---

#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
replace_readme.py

Полная замена README.md в репозитории WebKurierSecurity
на финальные версии: README_public.md и README_tech.md + LICENSE.txt.

Использование:
    python replace_readme.py [--dry-run] [--no-symlink]
"""

import shutil
import argparse
from datetime import datetime
from pathlib import Path

# === КОНФИГУРАЦИЯ ===
REPO_ROOT = Path(__file__).parent.resolve()  # Корень репозитория

README_PUBLIC = """# 🛡 WebKurierSecurity  
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
“””

README_TECH = “”“WebKurierSecurity — Security Module for WebKurierCore

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
“””

LICENSE_TXT = “”“Proprietary License — © 2025 Vladyslav Hushchyn (Владислав Гущин)
All rights reserved.
Use, modification, or distribution of this software is prohibited without the author’s prior written permission.

Проприетарная лицензия — © 2025 Владислав Гущин (Vladyslav Hushchyn)
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
description=“Замена README на финальные версии (public + tech) и LICENSE.”
)
parser.add_argument(
“–dry-run”,
action=“store_true”,
help=“Только показать, что будет сделано.”
)
parser.add_argument(
“–no-symlink”,
action=“store_true”,
help=“Не делать симлинк README.md → README_public.md (создать копию).”
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

# README.md → public
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

**Быстрый запуск:**
```bash
# пробный прогон
python replace_readme.py --dry-run

# реальная замена
python replace_readme.py

# если симлинки запрещены (Windows/права)
python replace_readme.py --no-symlink