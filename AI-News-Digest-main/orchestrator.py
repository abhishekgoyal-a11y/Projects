import time
from concurrent.futures import ThreadPoolExecutor, as_completed
from ingestion import fetch_articles
from agents import run_agent

DOMAINS  = ["tech", "finance", "sports"]
MAX_RETRIES = 2


def run_pipeline() -> list[dict]:
    with ThreadPoolExecutor(max_workers=len(DOMAINS)) as executor:
        futures = {
            executor.submit(_fetch_and_run_with_retry, domain): domain
            for domain in DOMAINS
        }
        results = {}
        for future in as_completed(futures):
            domain = futures[future]
            try:
                results[domain] = future.result()
            except Exception as e:
                results[domain] = {
                    "domain":  domain,
                    "bullets": [f"Pipeline error: {e}"],
                    "summary": f"- Pipeline error: {e}",
                    "count":   0,
                }

    # return in consistent order
    return [results[d] for d in DOMAINS]


def _fetch_and_run_with_retry(domain: str) -> dict:
    last_error = None
    for attempt in range(1, MAX_RETRIES + 1):
        try:
            articles = fetch_articles(domain)
            return run_agent(domain, articles)
        except Exception as e:
            last_error = e
            if attempt < MAX_RETRIES:
                time.sleep(2 ** attempt)  # exponential backoff
    raise last_error
