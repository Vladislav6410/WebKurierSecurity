Вот готовый файл bench/prompt_strict.md — полностью, от начала до конца:

## Python Bench Prompt — STRICT

### Задача
Реализовать функцию:

```python
load_valid_users(json_path, *, log_path=None) -> list[dict]


⸻

Требования
	1.	Обработка ошибок
	•	Некорректный JSON → лог "invalid json", вернуть [].
	•	Корневой объект не список → лог "root json must be a list", вернуть [].
	•	Элемент не объект → лог вида:

[<idx>] item must be an object, got <TypeName>


	•	Отсутствует поле → лог:

[<idx>] missing field '<field>'


	•	Поле неверного типа → лог:

[<idx>] field '<field>' has wrong type: <GotType>, expected <ExpectedType>


	2.	Код
	•	Использовать аннотации типов (typing).
	•	Добавить docstring к функции.
	•	Валидацию вынести в отдельную функцию (например _validate_user).
	•	Не ломать глобальный logging — использовать локальный логгер.
	•	Разделять I/O и логику валидации.
	3.	Результат
	•	В лог записывать все ошибки.
	•	Возвращать только список валидных пользователей.

⸻

Формат ответа модели

Один файл users_validator.py, без пояснений.

📌 Просто скопируй этот текст и вставь в файл **`bench/prompt_strict.md`**.