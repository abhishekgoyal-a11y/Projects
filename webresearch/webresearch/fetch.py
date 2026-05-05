from __future__ import annotations
import asyncio
import sys
from datetime import datetime, timezone
from dataclasses import dataclass

import httpx

from .cache import get_cached_page, save_cached_page
from .search import SearchResult


@dataclass
class FetchedPage:
    url: str
    title: str
    content_markdown: str
    fetched_at: str
    source: str = "web"
    error: str | None = None


def _html_to_markdown(html: str) -> str:
    try:
        import html2text
        h = html2text.HTML2Text()
        h.ignore_links = False
        h.ignore_images = True
        h.body_width = 0
        return h.handle(html)
    except ImportError:
        return html


def _extract_title(html: str, url: str) -> str:
    import re
    match = re.search(r"<title[^>]*>(.*?)</title>", html, re.IGNORECASE | re.DOTALL)
    if match:
        return match.group(1).strip()
    return url


async def _fetch_one(client: httpx.AsyncClient, result: SearchResult) -> FetchedPage:
    cached = get_cached_page(result.url)
    if cached:
        return FetchedPage(**cached)

    fetched_at = datetime.now(timezone.utc).isoformat()
    try:
        resp = await client.get(result.url, follow_redirects=True, timeout=15)
        resp.raise_for_status()
        content_type = resp.headers.get("content-type", "")

        if "pdf" in content_type:
            content_markdown = _parse_pdf_bytes(resp.content)
            title = result.title or result.url
        else:
            html = resp.text
            title = _extract_title(html, result.url) or result.title
            content_markdown = _html_to_markdown(html)

        page = FetchedPage(
            url=result.url,
            title=title,
            content_markdown=content_markdown[:50_000],
            fetched_at=fetched_at,
            source=result.source,
        )
        save_cached_page(result.url, page.__dict__)
        return page

    except Exception as exc:
        return FetchedPage(
            url=result.url,
            title=result.title,
            content_markdown="",
            fetched_at=fetched_at,
            source=result.source,
            error=str(exc),
        )


def _parse_pdf_bytes(data: bytes) -> str:
    try:
        import pypdf, io
        reader = pypdf.PdfReader(io.BytesIO(data))
        return "\n\n".join(page.extract_text() or "" for page in reader.pages)
    except ImportError:
        return "[PDF — install pypdf: pip install 'webresearchh[pdf]']"
    except Exception as e:
        return f"[PDF parse error: {e}]"


async def _fetch_all_async(results: list[SearchResult]) -> list[FetchedPage]:
    headers = {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    }
    async with httpx.AsyncClient(headers=headers, verify=False) as client:
        tasks = [_fetch_one(client, r) for r in results]
        return await asyncio.gather(*tasks)


def fetch_pages(results: list[SearchResult]) -> list[FetchedPage]:
    pages = asyncio.run(_fetch_all_async(results))
    ok = [p for p in pages if not p.error]
    failed = [p for p in pages if p.error]
    if failed:
        print(f"  {len(failed)} page(s) failed to fetch (skipped)", file=sys.stderr)
    return ok
