import os
import requests
import xml.etree.ElementTree as ET
from datetime import datetime, timezone

NEWS_API_KEY = os.getenv("NEWS_API_KEY")
NEWS_API_URL = "https://newsapi.org/v2/top-headlines"

# RSS feed sources per domain (BBC, Reuters)
RSS_FEEDS = {
    "tech": [
        "http://feeds.bbci.co.uk/news/technology/rss.xml",
        "https://feeds.reuters.com/reuters/technologyNews",
    ],
    "finance": [
        "http://feeds.bbci.co.uk/news/business/rss.xml",
        "https://feeds.reuters.com/reuters/businessNews",
    ],
    "sports": [
        "http://feeds.bbci.co.uk/sport/rss.xml",
        "https://feeds.reuters.com/reuters/sportsNews",
    ],
}

NEWSAPI_CATEGORIES = {
    "tech":    "technology",
    "finance": "business",
    "sports":  "sports",
}


def fetch_articles(domain: str, page_size: int = 8) -> list[dict]:
    articles = []
    articles.extend(_fetch_rss(domain))
    articles.extend(_fetch_newsapi(domain, page_size))
    # deduplicate by title at ingestion level
    seen, unique = set(), []
    for a in articles:
        key = a["title"].lower().strip()
        if key not in seen:
            seen.add(key)
            unique.append(a)
    return unique


def _fetch_newsapi(domain: str, page_size: int) -> list[dict]:
    if not NEWS_API_KEY:
        return []
    try:
        params = {
            "apiKey":   NEWS_API_KEY,
            "language": "en",
            "pageSize": page_size,
            "category": NEWSAPI_CATEGORIES[domain],
        }
        resp = requests.get(NEWS_API_URL, params=params, timeout=10)
        resp.raise_for_status()
        raw_list = resp.json().get("articles", [])
        return [
            _normalize(
                title=a["title"],
                content=a.get("description") or a.get("content", ""),
                source=a.get("source", {}).get("name", "NewsAPI"),
                published_at=a.get("publishedAt", _now()),
                category_hint=domain,
            )
            for a in raw_list
            if a.get("title") and a.get("description")
        ]
    except Exception:
        return []


def _fetch_rss(domain: str) -> list[dict]:
    articles = []
    for url in RSS_FEEDS[domain]:
        try:
            resp = requests.get(url, timeout=10, headers={"User-Agent": "Mozilla/5.0"})
            resp.raise_for_status()
            root = ET.fromstring(resp.content)
            for item in root.findall(".//item")[:8]:
                title   = item.findtext("title", "").strip()
                content = item.findtext("description", "").strip()
                source  = item.findtext("source", url.split("/")[2])
                pub     = item.findtext("pubDate", _now())
                if title and content:
                    articles.append(_normalize(title, content, source, pub, domain))
        except Exception:
            continue
    return articles


def _normalize(title: str, content: str, source: str, published_at: str, category_hint: str) -> dict:
    return {
        "title":         title,
        "content":       content,
        "source":        source,
        "published_at":  published_at,
        "category_hint": category_hint,
    }


def _now() -> str:
    return datetime.now(timezone.utc).isoformat()
