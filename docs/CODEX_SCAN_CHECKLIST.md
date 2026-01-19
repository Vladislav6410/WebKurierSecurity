# Codex Scan Checklist (Allowed / Forbidden)

Использовать перед включением/изменением Codex workflow.

---

## A) Идентификация запуска
- [ ] Уточнён репозиторий запуска (owner/repo)
- [ ] Уточнён ветка/commit SHA
- [ ] Понятна цель (analyze / docs / fix / test)

---

## B) Разрешено сканировать (Repo-Local)
**Только внутри текущего репозитория (workspace).**

- [ ] Корневые файлы репозитория (README, docs, config)
- [ ] Папки проекта (engine/, backend/, app/, scripts/, etc.)
- [ ] Только локальные команды: ls/find/cat/rg/grep (без сетевых запросов)

---

## C) Запрещено сканировать (всегда)
- [ ] Другие репозитории организации/пользователя (Core/Chain/Security/PhoneCore и т.д.) без отдельной процедуры
- [ ] Любые секреты: tokens, keys, secrets.json, .env (с выводом в логи)
- [ ] Логи, содержащие токены/куки/сессии
- [ ] Файлы вне workspace (`/home`, `/etc`, `/var`, родительские директории)
- [ ] Любые URL/внешние ресурсы без разрешения Security

---

## D) GitHub Actions permissions (обязательные ограничения)
- [ ] `permissions: contents: read` (минимум)
- [ ] Нет `actions: write`, `packages: write`, `id-token: write` без необходимости
- [ ] Нет PAT с org-wide доступом
- [ ] Нет `GITHUB_TOKEN` расширенного scope через настройки репозитория

---

## E) Checkout правила
- [ ] Ровно один `actions/checkout` на текущий репозиторий
- [ ] Нет второго checkout другого репозитория
- [ ] Нет submodules без подтверждённого allowlist
- [ ] Нет monorepo “агрегации” доменных реп без Security review

---

## F) Выходные артефакты
- [ ] Отчёт / документация хранится в `docs/` и не содержит секретов
- [ ] При необходимости — сохраняется job summary
- [ ] Любые предложения изменений оформляются отдельно (без автоприменения, если режим read-only)

---

## G) Multi-Repo анализ (если понадобится)
Разрешено только если:
- [ ] Есть allowlist репозиториев
- [ ] Есть orchestrator workflow (обычно WebKurierHybrid)
- [ ] Есть Security gate + audit логирование (Chain/Security)
- [ ] Токены минимальные по правам

Если хотя бы один пункт не выполнен — multi-repo анализ запрещён.