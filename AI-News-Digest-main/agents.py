import os
from groq import Groq

client = Groq(api_key=os.getenv("GROQ_API_KEY"))
MODEL = "llama-3.3-70b-versatile"
CHUNK_SIZE = 6  # articles per LLM chunk

# ── Agent prompts (strict, domain-specific) ──────────────────────────────────

AGENT_PROMPTS = {
    "tech": """You are a Tech News Analyst specializing in AI, startups, software, and big tech.

Your tasks:
1. Filter: Only process technology-related articles. Ignore anything unrelated.
2. Summarize: Extract key insights, trends, and impact signals (e.g. "AI regulation increasing").
3. Deduplicate: If multiple articles cover the same story, merge into one bullet.
4. Output: Return ONLY 3–5 bullet points starting with "-". No headers, no extra text.

Focus on: AI breakthroughs, startup funding, product launches, big tech moves, software updates.""",

    "finance": """You are a Finance News Analyst specializing in markets, stocks, crypto, and macroeconomics.

Your tasks:
1. Filter: Only process finance/economy-related articles. Ignore unrelated content.
2. Summarize: Capture market movements, key financial events, earnings reports.
3. Detect signals: Flag inflation indicators, interest rate changes, recession signals.
4. Deduplicate: Merge duplicate stories into one bullet.
5. Output: Return ONLY 3–5 bullet points starting with "-". No headers, no extra text.

Focus on: Stock market moves, crypto prices, central bank decisions, major earnings, economic data.""",

    "sports": """You are a Sports News Analyst covering matches, players, and tournaments.

Your tasks:
1. Filter: Only process sports-related articles. Ignore unrelated content.
2. Summarize: Extract match results, scores, player highlights, and upcoming fixtures.
3. Deduplicate: Merge duplicate stories into one bullet.
4. Output: Return ONLY 3–5 bullet points starting with "-". No headers, no extra text.

Focus on: Match results with scores, standout player performances, tournament standings, upcoming fixtures.""",
}


# ── Module 1: Filter ──────────────────────────────────────────────────────────

DOMAIN_KEYWORDS = {
    "tech":    ["tech", "ai", "software", "startup", "app", "cyber", "robot", "chip", "google", "apple", "microsoft", "meta", "openai", "data", "cloud", "code", "digital", "algorithm", "machine learning", "neural"],
    "finance": ["market", "stock", "crypto", "bitcoin", "economy", "inflation", "rate", "bank", "invest", "fund", "gdp", "trade", "finance", "earnings", "revenue", "nasdaq", "dow", "s&p", "fed", "currency", "bond"],
    "sports":  ["sport", "game", "match", "player", "team", "score", "league", "tournament", "championship", "goal", "win", "loss", "coach", "athlete", "nfl", "nba", "fifa", "tennis", "cricket", "football", "basketball"],
}

def _filter(articles: list[dict], domain: str) -> list[dict]:
    keywords = DOMAIN_KEYWORDS[domain]
    filtered = []
    for a in articles:
        text = (a["title"] + " " + a["content"]).lower()
        if any(kw in text for kw in keywords):
            filtered.append(a)
    # fallback: if nothing passes filter, use all (category_hint already correct)
    return filtered if filtered else articles


# ── Module 2: Chunker ─────────────────────────────────────────────────────────

def _chunk(articles: list[dict], size: int = CHUNK_SIZE) -> list[list[dict]]:
    return [articles[i:i + size] for i in range(0, len(articles), size)]


# ── Module 3: Summarizer (LLM) ────────────────────────────────────────────────

def _summarize_chunk(chunk: list[dict], domain: str) -> str:
    text = "\n".join(
        f"- [{a['source']}] {a['title']}: {a['content']}" for a in chunk
    )
    resp = client.chat.completions.create(
        model=MODEL,
        messages=[
            {"role": "system", "content": AGENT_PROMPTS[domain]},
            {"role": "user",   "content": f"Analyze these articles:\n\n{text}"},
        ],
        temperature=0.3,
    )
    return resp.choices[0].message.content.strip()


# ── Module 4: Deduplicator ────────────────────────────────────────────────────

def _deduplicate(bullets: list[str]) -> list[str]:
    seen, unique = set(), []
    for b in bullets:
        key = b.lower()[:60]
        if key not in seen:
            seen.add(key)
            unique.append(b)
    return unique


# ── Module 5: Structured output builder ──────────────────────────────────────

def _build_output(domain: str, bullets: list[str]) -> dict:
    return {
        "domain":   domain,
        "bullets":  bullets,
        "summary":  "\n".join(f"- {b}" for b in bullets),
        "count":    len(bullets),
    }


# ── Main agent runner ─────────────────────────────────────────────────────────

def run_agent(domain: str, articles: list[dict]) -> dict:
    if not articles:
        return _build_output(domain, ["No articles available."])

    # 1. Filter
    filtered = _filter(articles, domain)

    # 2. Chunk
    chunks = _chunk(filtered)

    # 3. Summarize each chunk
    raw_summaries = [_summarize_chunk(chunk, domain) for chunk in chunks]

    # 4. Extract bullets from all chunk summaries
    all_bullets = []
    for summary in raw_summaries:
        for line in summary.splitlines():
            line = line.strip()
            if line.startswith("-"):
                all_bullets.append(line.lstrip("- ").strip())

    # If chunks produced prose instead of bullets, re-summarize combined
    if not all_bullets:
        combined_text = "\n".join(raw_summaries)
        final = _summarize_chunk(
            [{"source": "summary", "title": "Combined", "content": combined_text}],
            domain
        )
        for line in final.splitlines():
            line = line.strip()
            if line.startswith("-"):
                all_bullets.append(line.lstrip("- ").strip())

    # 4. Deduplicate
    bullets = _deduplicate(all_bullets)[:5]

    # 5. Structured output
    return _build_output(domain, bullets)
