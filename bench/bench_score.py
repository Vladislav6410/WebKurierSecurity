# bench/bench_score.py
"""
Подсчёт итогового балла бенча по выводу pytest.

Использование:
    python bench_score.py [pytest_output.txt] [code_quality] [io_reliability]

По умолчанию:
    pytest_output.txt, code_quality=3, io_reliability=2

Метрики (сумма = 10):
- correctness (0–5): число пройденных тестов (1 тест = 1 балл, максимум 5)
- code_quality (0–3): выставляется вручную (структура кода, типы, docstring, локальный logging)
- io_reliability (0–2): точность сообщений ошибок и форматов логов
"""

from __future__ import annotations

import json
import re
import sys
from pathlib import Path

TOTAL_TESTS = 5  # ожидаемое кол-во тестов в наборе


def parse_pytest_output(text: str) -> int:
    """
    Возвращает число пройденных тестов по строке вида:
    '5 passed', '3 passed, 2 failed' и т.п.
    """
    m = re.search(r"(\d+)\s+passed", text)
    return int(m.group(1)) if m else 0


def main(pytest_output_path: str = "pytest_output.txt", code_quality: int = 3, io_reliability: int = 2) -> None:
    p = Path(pytest_output_path)
    text = p.read_text(encoding="utf-8") if p.exists() else ""

    passed = parse_pytest_output(text)
    correctness = max(0, min(TOTAL_TESTS, passed))  # 1 тест = 1 балл, максимум 5

    # Ограничим ручные метрики допустимыми диапазонами
    code_quality = max(0, min(3, code_quality))
    io_reliability = max(0, min(2, io_reliability))

    total = correctness + code_quality + io_reliability

    result = {
        "correctness": correctness,
        "code_quality": code_quality,
        "io_reliability": io_reliability,
        "total": total,
    }

    Path("score.json").write_text(json.dumps(result, indent=2, ensure_ascii=False), encoding="utf-8")
    print(json.dumps(result, ensure_ascii=False))


if __name__ == "__main__":
    args = sys.argv[1:]
    pytest_output = args[0] if len(args) >= 1 else "pytest_output.txt"
    cq = int(args[1]) if len(args) >= 2 else 3
    io = int(args[2]) if len(args) >= 3 else 2
    main(pytest_output, cq, io)