import requests
from backend.config import SERPAPI_KEY

def web_search(query: str, num_results: int = 8) -> str:
    if not SERPAPI_KEY or SERPAPI_KEY.startswith("your-"):
        return f"[Mock] Web search results for: {query}\n- Result 1: Sample data\n- Result 2: More sample data"

    params = {
        "q": query,
        "api_key": SERPAPI_KEY,
        "num": num_results,
        "engine": "google",
    }
    response = requests.get("https://serpapi.com/search", params=params, timeout=15)
    response.raise_for_status()
    data = response.json()

    results = []
    for item in data.get("organic_results", []):
        title = item.get("title", "")
        snippet = item.get("snippet", "")
        link = item.get("link", "")
        results.append(f"Title: {title}\nSnippet: {snippet}\nURL: {link}")

    return "\n\n".join(results) if results else "No results found."
