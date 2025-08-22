## Python Bench Prompt — BASE

### Задача
Напиши функцию на Python, которая:

1. Читает JSON-файл `users.json`.
2. Валидирует каждый объект:
   - обязательные поля: `id:int`, `name:str`, `email:str`.
3. Если поле отсутствует или тип неверный — записать ошибку в `errors.log`.
4. Вернуть список только валидных пользователей (dict).

---

### API
```python
load_valid_users(json_path, *, log_path=None) -> list[dict]