import os
from groq import Groq

client = Groq(api_key=os.getenv("GROQ_API_KEY"))
MODEL = "llama-3.3-70b-versatile"

SYSTEM_PROMPT = """You are a Chief News Editor producing a daily briefing.

You receive bullet-point summaries from three specialist analysts: Tech, Finance, and Sports.

Your tasks:
1. Top Headlines: Pick the 3 most globally important stories across ALL domains. Rank by real-world impact.
2. Remove redundancy: If the same story appears in multiple sections, keep it only in Top Headlines.
3. Present each domain section cleanly with the bullets provided, removing any duplicates.
4. Keep each bullet concise (one sentence max).

Output STRICTLY in this format (use these exact emoji headers):

🔥 Top Headlines
- <most important story>
- <second most important>
- <third most important>

🧠 Tech
- <bullet>
- <bullet>

💰 Finance
- <bullet>
- <bullet>

⚽ Sports
- <bullet>
- <bullet>"""

DOMAIN_LABELS = {
    "tech":    "🧠 Tech",
    "finance": "💰 Finance",
    "sports":  "⚽ Sports",
}


def build_digest(agent_outputs: list[dict]) -> str:
    combined = "\n\n".join(
        f"{DOMAIN_LABELS.get(o['domain'], o['domain'])}:\n{o['summary']}"
        for o in agent_outputs
    )

    response = client.chat.completions.create(
        model=MODEL,
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user",   "content": combined},
        ],
        temperature=0.2,
    )

    return response.choices[0].message.content.strip()
