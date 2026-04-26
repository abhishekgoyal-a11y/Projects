import asyncio
import aiohttp
import requests
from bs4 import BeautifulSoup
from app.utils.logger import get_logger

logger = get_logger(__name__)

HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/120.0.0.0 Safari/537.36"
    ),
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.5",
}
REQUEST_TIMEOUT = 10


def _extract_text(html: str) -> str:
    soup = BeautifulSoup(html, "lxml")

    for tag in soup(["script", "style", "nav", "footer", "header", "aside", "form", "noscript"]):
        tag.decompose()

    main = soup.find("main") or soup.find("article") or soup.find(id="content") or soup.body
    if main is None:
        return ""

    lines = [line.strip() for line in main.get_text(separator="\n").splitlines()]
    cleaned = "\n".join(line for line in lines if len(line) > 30)
    return cleaned[:8000]


def scrape_url(url: str) -> str:
    try:
        resp = requests.get(url, headers=HEADERS, timeout=REQUEST_TIMEOUT, allow_redirects=True)
        resp.raise_for_status()
        content_type = resp.headers.get("Content-Type", "")
        if "text/html" not in content_type:
            logger.debug(f"Skipping non-HTML content at {url}")
            return ""
        text = _extract_text(resp.text)
        logger.debug(f"Scraped {len(text)} chars from {url}")
        return text
    except Exception as e:
        logger.warning(f"Failed to scrape {url}: {e}")
        return ""


async def scrape_url_async(url: str) -> str:
    try:
        async with aiohttp.ClientSession(headers=HEADERS) as session:
            async with session.get(url, timeout=aiohttp.ClientTimeout(total=REQUEST_TIMEOUT)) as resp:
                if resp.status != 200:
                    return ""
                content_type = resp.headers.get("Content-Type", "")
                if "text/html" not in content_type:
                    return ""
                html = await resp.text(errors="replace")
                text = _extract_text(html)
                logger.debug(f"Async scraped {len(text)} chars from {url}")
                return text
    except Exception as e:
        logger.warning(f"Async scrape failed for {url}: {e}")
        return ""


async def scrape_urls_async(urls: list[str]) -> list[tuple[str, str]]:
    tasks = [scrape_url_async(url) for url in urls]
    results = await asyncio.gather(*tasks, return_exceptions=True)
    pairs = []
    for url, result in zip(urls, results):
        if isinstance(result, Exception):
            logger.warning(f"Exception scraping {url}: {result}")
            pairs.append((url, ""))
        else:
            pairs.append((url, result or ""))
    return pairs
