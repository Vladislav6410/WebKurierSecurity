# 🧪 Bench — тестовый модуль WebKurier

## 📌 Назначение
Папка **`bench/`** используется для:
- тестирования и бенчмарков агентов WebKurier;
- проверки качества кода (lint, typecheck, tests);
- запуска автоматических тестов CI/CD;
- хранения шаблонов промптов для валидатора.

---

## 📂 Структура

bench/
├── .gitignore
├── LICENSE
├── README.md
├── prompt.md
├── prompt_strict.md
├── users_validator.py
├── bench_score.py
├── requirements.txt
├── pyproject.toml
├── mypy.ini
├── Makefile
├── runs/
│   └── .gitkeep
└── tests/
└── test_users_validator.py

---

## ⚙️ Установка

```bash
make venv
. .venv/bin/activate && pip install -r requirements.txt


⸻

▶️ Использование

make ci     # все проверки
make test   # только тесты
make bench  # pytest + score.json


⸻

📜 Лицензия

MIT © 2025 WebKurier

