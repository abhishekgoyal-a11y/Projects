from __future__ import annotations
import sys
from dataclasses import dataclass, field
from datetime import datetime


@dataclass
class SearchResult:
    url: str
    title: str
    snippet: str
    source: str = "web"
    published: str | None = None


def search_duckduckgo(query: str, max_results: int = 20) -> list[SearchResult]:
    try:
        from ddgs import DDGS
    except ImportError:
        try:
            from duckduckgo_search import DDGS
        except ImportError:
            print("ddgs not installed. Run: pip install ddgs", file=sys.stderr)
            return []

    results = []
    try:
        with DDGS() as ddgs:
            for r in ddgs.text(query, max_results=max_results):
                results.append(SearchResult(
                    url=r.get("href", ""),
                    title=r.get("title", ""),
                    snippet=r.get("body", ""),
                    source="web",
                ))
    except Exception as e:
        print(f"DuckDuckGo search failed: {e}", file=sys.stderr)
        print("Tip: try again in a few seconds — DuckDuckGo rate-limits requests.", file=sys.stderr)
    return results


def search_arxiv(query: str, max_results: int = 10) -> list[SearchResult]:
    try:
        import arxiv
    except ImportError:
        print("arxiv not installed. Run: pip install 'webresearchh[arxiv]'", file=sys.stderr)
        return []

    client = arxiv.Client()
    search = arxiv.Search(query=query, max_results=max_results, sort_by=arxiv.SortCriterion.Relevance)
    results = []
    for paper in client.results(search):
        results.append(SearchResult(
            url=paper.entry_id,
            title=paper.title,
            snippet=paper.summary[:300],
            source="arxiv",
            published=paper.published.isoformat() if paper.published else None,
        ))
    return results


def search(
    query: str,
    max_results: int = 20,
    sources: list[str] | None = None,
    since: int | None = None,
) -> list[SearchResult]:
    if sources is None:
        sources = ["web"]

    all_results: list[SearchResult] = []

    if "web" in sources:
        all_results.extend(search_duckduckgo(query, max_results))

    if "arxiv" in sources:
        all_results.extend(search_arxiv(query, max_results=10))

    if since:
        filtered = []
        for r in all_results:
            if r.published:
                try:
                    year = int(r.published[:4])
                    if year >= since:
                        filtered.append(r)
                except ValueError:
                    filtered.append(r)
            else:
                filtered.append(r)
        all_results = filtered

    seen_urls: set[str] = set()
    deduped = []
    for r in all_results:
        if r.url and r.url not in seen_urls:
            seen_urls.add(r.url)
            deduped.append(r)

    return deduped
