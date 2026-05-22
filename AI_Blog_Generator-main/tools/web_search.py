from typing import List, Dict

from tavily import TavilyClient

from utils.config import TAVILY_API_KEY


client = TavilyClient(api_key=TAVILY_API_KEY)


def tavily_search(
    query: str,
    max_results: int = 5
) -> List[Dict]:
    """
    Search web using Tavily.
    Returns cleaned search results.
    """

    try:
        response = client.search(
            query=query,
            max_results=max_results,
        )

        results = response.get("results", [])

        cleaned_results = []

        for r in results:
            cleaned_results.append(
                {
                    "title": r.get("title", ""),
                    "url": r.get("url", ""),
                    "snippet": r.get("content", ""),
                    "published_at": r.get("published_date"),
                    "source": r.get("source"),
                }
            )

        return cleaned_results

    except Exception as e:
        print(f"[Tavily Error] {e}")
        return []