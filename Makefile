# Makefile — удобные команды для работы с README и лицензией

PY ?= python3

.PHONY: help readme.dryrun readme.replace readme.nosymlink

help:
	@echo "Targets:"
	@echo "  make readme.dryrun    - пробный запуск замены README (ничего не меняет)"
	@echo "  make readme.replace   - заменить README на public/tech и LICENSE"
	@echo "  make readme.nosymlink - как replace, но без симлинка (создаёт копию README.md)"

readme.dryrun:
	$(PY) replace_readme.py --dry-run

readme.replace:
	$(PY) replace_readme.py

readme.nosymlink:
	$(PY) replace_readme.py --no-symlink