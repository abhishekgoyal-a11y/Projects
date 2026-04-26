import asyncio
from duckduckgo_search import DDGS
from app.utils.logger import get_logger
import os

logger = get_logger(__name__)

MAX_RESULTS = int(os.getenv("MAX_SEARCH_RESULTS", "5"))


class WebSearcher:
    def __init__(self):
        self.max_results = MAX_RESULTS

    def search(self, query: str, max_results: int | None = None) -> list[dict]:
        limit = max_results or self.max_results
        try:
            with DDGS() as ddgs:
                raw = list(ddgs.text(query, max_results=limit))

            results = []
            for item in raw:
                url = item.get("href", "")
                title = item.get("title", "")
                snippet = item.get("body", "")
                if url:
                    results.append({"url": url, "title": title, "snippet": snippet})

            logger.info(f"DuckDuckGo returned {len(results)} results for: {query[:60]}")
            return results

        except Exception as e:
            logger.error(f"DuckDuckGo search failed: {e}")
            return []

    async def search_async(self, query: str, max_results: int | None = None) -> list[dict]:
        loop = asyncio.get_event_loop()
        return await loop.run_in_executor(None, self.search, query, max_results)
