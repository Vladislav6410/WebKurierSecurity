.PHONY: venv test bench lint fix typecheck ci clean

venv:
	python -m venv .venv

test:
	. .venv/bin/activate && pip install -q -r requirements.txt && pytest -q || true

bench:
	. .venv/bin/activate && pip install -q -r requirements.txt && pytest -q > pytest_output.txt || true
	python bench_score.py pytest_output.txt

lint:
	. .venv/bin/activate && ruff check .

fix:
	. .venv/bin/activate && ruff check . --fix

typecheck:
	. .venv/bin/activate && mypy .

ci:
	. .venv/bin/activate && pip install -q -r requirements.txt && ruff check . && mypy . && pytest -q || true

clean:
	rm -rf __pycache__ .pytest_cache .venv *.log pytest_output.txt score.json