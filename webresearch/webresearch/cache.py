import hashlib
import json
from pathlib import Path
from datetime import datetime, timezone


CACHE_DIR = Path("research-out/cache")


def _url_key(url: str) -> str:
    return hashlib.sha256(url.encode()).hexdigest()


def get_cached_page(url: str) -> dict | None:
    path = CACHE_DIR / "pages" / (_url_key(url) + ".json")
    if path.exists():
        return json.loads(path.read_text())
    return None


def save_cached_page(url: str, data: dict) -> None:
    d = CACHE_DIR / "pages"
    d.mkdir(parents=True, exist_ok=True)
    (d / (_url_key(url) + ".json")).write_text(json.dumps(data, indent=2))


def get_cached_extraction(url: str) -> dict | None:
    path = CACHE_DIR / "extractions" / (_url_key(url) + ".json")
    if path.exists():
        return json.loads(path.read_text())
    return None


def save_cached_extraction(url: str, data: dict) -> None:
    d = CACHE_DIR / "extractions"
    d.mkdir(parents=True, exist_ok=True)
    (d / (_url_key(url) + ".json")).write_text(json.dumps(data, indent=2))


def cache_stats() -> dict:
    pages = list((CACHE_DIR / "pages").glob("*.json")) if (CACHE_DIR / "pages").exists() else []
    extractions = list((CACHE_DIR / "extractions").glob("*.json")) if (CACHE_DIR / "extractions").exists() else []
    return {"cached_pages": len(pages), "cached_extractions": len(extractions)}
