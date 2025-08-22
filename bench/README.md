# 🧪 Bench — тестовый модуль WebKurier

## 📌 Назначение

Папка **`bench/`** используется для:
- тестирования и бенчмарков агентов WebKurier;
- проверки качества кода (lint, typecheck, tests);
- запуска автоматических тестов CI/CD;
- хранения шаблонов промптов для валидатора.

---

## 📂 Структураbench/
├── .gitignore              ← игнорируем временные файлы и окружение
├── LICENSE                 ← локальная лицензия (MIT)
├── README.md               ← этот файл
├── prompt.md               ← основной промпт
├── prompt_strict.md        ← строгий промпт
├── users_validator.py      ← валидатор пользователей
├── bench_score.py          ← парсер результатов pytest
├── requirements.txt        ← список зависимостей
├── pyproject.toml          ← конфигурация Python-проекта
├── mypy.ini                ← настройки typecheck
├── Makefile                ← сценарии запуска (test, lint, ci)
├── runs/                   ← результаты прогонов
│   └── .gitkeep
└── tests/                  ← unit-тесты
└── test_users_validator.py---

## ⚙️ Установка

```bash
# Создать виртуальное окружение
make venv

# Установить зависимости
. .venv/bin/activate && pip install -r requirements.txt▶️ Использование

Запуск всех проверок:make ciЗапуск тестов:make testЗапуск бенчмарков:make bench📜 Лицензия

MIT © 2025 WebKurier---

Хочешь, я следующим дам **`requirements.txt`** (библиотеки), чтобы можно было сразу запускать тесты?