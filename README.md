# 🛡 WebKurierSecurity

**WebKurierSecurity** — модуль защиты для [WebKurierCore](https://github.com/Vladislav6410/WebKurierCore).

## 📌 Основные функции
- 🔍 Обнаружение угроз в реальном времени
- 🗂 Сканирование файлов и каталогов
- 🔑 Защита токенов, ключей и конфиденциальных данных
- 🛑 Карантин подозрительных объектов
- 📄 Генерация отчётов о проверках
- 🔐 Интеграция с Dropbox, GitHub и локальной системой

---

## 📂 Структура проектаengine/
├── agents/
│    └── security/      # Модуль защиты
│         ├── security-agent.js
│         ├── scanner.js
│         ├── quarantine.js
│         └── reports.js
├── config/
│    └── settings.json  # Конфигурация
└── README.md---

## 🚀 Установка
```bash
git clone https://github.com/Vladislav6410/WebKurierSecurity.git
cd WebKurierSecurity
npm install▶ Запускnode engine/agents/security/security-agent.js🧩 Интеграция с WebKurierCore
	1.	Скопируйте папку security/ в engine/agents/ WebKurierCore.
	2.	Добавьте модуль в конфигурацию config/settings.json.
	3.	Запустите через терминал WebKurierCore командой:/security scan📜 Лицензия

MIT License — свободное использование с сохранением авторства.
