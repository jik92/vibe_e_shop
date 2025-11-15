from __future__ import annotations

import json
from pathlib import Path
from typing import Dict

_LOCALE_CACHE: Dict[str, dict] | None = None


def _load_locales() -> Dict[str, dict]:
  global _LOCALE_CACHE
  if _LOCALE_CACHE is None:
    base_path = Path(__file__).resolve()
    translations = {}
    for locale_file in base_path.parent.glob('*.json'):
      with locale_file.open('r', encoding='utf-8') as f:
        translations[locale_file.stem] = json.load(f)
    _LOCALE_CACHE = translations
  return _LOCALE_CACHE


def translate(key: str, lang: str = 'en') -> str:
  locales = _load_locales()
  lang_key = lang if lang in locales else 'en'
  current = locales.get(lang_key, {})
  parts = key.split('.')
  value = current
  for part in parts:
    if isinstance(value, dict):
      value = value.get(part)
    else:
      value = None
    if value is None:
      break
  return value if isinstance(value, str) else key
