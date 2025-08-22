# bench/users_validator.py
from __future__ import annotations

import json
import logging
from pathlib import Path
from typing import Any, Dict, List, Tuple


_LOGGER_NAME = "bench.users_validator"


def _make_logger(log_path: Path) -> logging.Logger:
    """
    Создаёт локальный логгер, пишущий только в указанный файл,
    не меняя глобальную конфигурацию logging.
    """
    logger = logging.getLogger(_LOGGER_NAME)
    logger.handlers.clear()
    logger.setLevel(logging.INFO)
    logger.propagate = False

    log_path.parent.mkdir(parents=True, exist_ok=True)
    fh = logging.FileHandler(log_path, mode="a", encoding="utf-8")
    fh.setFormatter(logging.Formatter("%(message)s"))
    logger.addHandler(fh)
    return logger


def _typename(value: Any) -> str:
    return type(value).__name__


def _validate_user(obj: Dict[str, Any], idx: int) -> Tuple[bool, List[str]]:
    """
    Проверяет, что объект пользователя содержит поля:
    id:int, name:str, email:str.

    Возвращает (is_valid, errors[])
    """
    errors: List[str] = []
    required: Dict[str, type] = {"id": int, "name": str, "email": str}

    for field, typ in required.items():
        if field not in obj:
            errors.append(f"[{idx}] missing field '{field}'")
        else:
            if not isinstance(obj[field], typ):
                errors.append(
                    f"[{idx}] field '{field}' has wrong type: {_typename(obj[field])}, expected {typ.__name__}"
                )
    return (len(errors) == 0, errors)


def load_valid_users(
    json_path: str | Path, *, log_path: str | Path | None = None
) -> List[Dict[str, Any]]:
    """
    Читает JSON с массивом пользователей и возвращает список валидных записей.
    Ошибки валидации/парсинга пишет в файл лога.

    Сообщения лога (строго):
      - invalid json
      - root json must be a list
      - [<idx>] item must be an object, got <TypeName>
      - [<idx>] missing field '<field>'
      - [<idx>] field '<field>' has wrong type: <GotType>, expected <ExpectedType>
    """
    json_path = Path(json_path)
    if log_path is None:
        log_path = json_path.with_name("errors.log")

    logger = _make_logger(Path(log_path))

    # Чтение/парсинг JSON
    try:
        raw = json.loads(json_path.read_text(encoding="utf-8"))
    except (FileNotFoundError, OSError, json.JSONDecodeError):
        logger.error("invalid json")
        return []

    # Корень должен быть списком
    if not isinstance(raw, list):
        logger.error("root json must be a list")
        return []

    valid: List[Dict[str, Any]] = []
    for idx, item in enumerate(raw):
        if not isinstance(item, dict):
            logger.error(f"[{idx}] item must be an object, got {_typename(item)}")
            continue

        ok, errs = _validate_user(item, idx)
        if ok:
            valid.append(item)
        else:
            for e in errs:
                logger.error(e)

    return valid