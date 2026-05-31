import json
from groq import Groq
from backend.config import GROQ_API_KEY

client = Groq(api_key=GROQ_API_KEY)

SYSTEM_PROMPT = """You are a task planning agent. Break the user's task into clear, ordered sub-steps.
Return ONLY a JSON array of step strings. Example:
["Search for X", "Summarize findings", "Generate report", "Send email"]"""

def plan_task(task: str) -> list[str]:
    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": task},
        ],
        temperature=0.3,
    )
    raw = response.choices[0].message.content.strip()
    if raw.startswith("```"):
        raw = raw.split("```")[1]
        if raw.startswith("json"):
            raw = raw[4:]
    return json.loads(raw.strip())
