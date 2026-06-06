from __future__ import annotations

import json
import os
from typing import Any

from dotenv import load_dotenv

from backend.analyzer import ContentInsights

load_dotenv()

GROQ_BASE_URL = "https://api.groq.com/openai/v1"


def groq_enabled() -> bool:
    return bool(os.getenv("GROQ_API_KEY"))


SYSTEM_PROMPT = """\
You are an expert content strategist and copywriter specializing in transforming long-form content into high-performing platform-specific assets.

Your task: Read the full article text provided and produce 4 distinct content pieces.

Return ONLY a strict JSON object with exactly these 4 keys:
  linkedin_post, twitter_thread, youtube_script, email_newsletter

Each value must be a plain string with NO nested objects, NO arrays, NO markdown code fences.

RULES PER PLATFORM:

linkedin_post:
- Open with a bold single-sentence hook (no emojis at start)
- 150-300 words
- Short paragraphs (1-2 sentences each)
- 3-5 bullet points with concrete insights from the article
- End with a thought-provoking question to drive comments
- Tone: professional yet conversational
- Use line breaks generously

twitter_thread:
- Tweet 1: Irresistible hook ending with "🧵 Thread:"
- Tweets 2-8: Each tweet is ONE standalone insight from the article, max 240 chars
- Number each tweet: "1/", "2/" etc.
- Final tweet: Punchy summary + "RT if this was useful"
- Each tweet separated by a blank line

youtube_script:
- [HOOK 0-10s]: A shocking stat or question from the article to grab attention immediately
- [PROBLEM]: The core pain point the article addresses (2-3 sentences)
- [MAIN CONTENT]: Walk through 4-6 key ideas from the article conversationally, as if talking to camera. Use transitions like "Here's the thing...", "But wait...", "Now here's where it gets interesting..."
- [EXAMPLE]: A concrete example or story pulled from the article
- [SUMMARY]: Recap the 3 most important takeaways
- [CTA]: Ask viewers to like, comment with their biggest takeaway, and subscribe
- Total length: 400-600 words, conversational tone

email_newsletter:
- Subject: (compelling subject line that creates curiosity, under 50 chars)
- Preview: (preheader text, 80-100 chars)
- Greeting: "Hey [First Name],"
- Opening: 1-2 sentence hook referencing a relatable pain point
- Main insight: The core idea from the article in 2-3 paragraphs
- Key Takeaways: 3-5 bullet points with actionable advice
- Closing thought: Personal, warm, 1-2 sentences
- CTA: One clear call-to-action (reply, click, try something)
- Sign-off: "Until next time," and a name
"""


def _build_user_message(insights: ContentInsights, tone: str, audience: str) -> str:
    data = {
        "tone": tone,
        "target_audience": audience,
        "article_title": insights.title,
        "article_topic": insights.topic,
        "detected_tone": insights.tone,
        "hook": insights.hook,
        "key_points": insights.key_points,
        "examples": insights.examples,
        "quotes": insights.quotes,
        "conclusion": insights.conclusion,
        "full_article_text": insights.source_text,
    }
    return json.dumps(data, ensure_ascii=False)


def generate_with_groq(insights: ContentInsights, tone: str, audience: str) -> dict[str, str] | None:
    if not groq_enabled():
        return None

    try:
        from openai import OpenAI

        client = OpenAI(api_key=os.getenv("GROQ_API_KEY"), base_url=GROQ_BASE_URL)
        model = os.getenv("GROQ_MODEL", "llama-3.1-8b-instant")

        response = client.chat.completions.create(
            model=model,
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": _build_user_message(insights, tone, audience)},
            ],
            response_format={"type": "json_object"},
            temperature=0.75,
            max_tokens=4096,
        )
        text = response.choices[0].message.content or "{}"
        data = json.loads(text)
        required = {"linkedin_post", "twitter_thread", "youtube_script", "email_newsletter"}
        if required.issubset(data):
            return {key: _clean(data[key]) for key in required}
    except Exception:
        return None
    return None


def _clean(value: Any) -> str:
    if isinstance(value, str):
        return value.strip()
    if isinstance(value, list):
        return "\n\n".join(str(item).strip() for item in value)
    if isinstance(value, dict):
        return "\n\n".join(f"{k.replace('_', ' ').title()}: {_clean(v)}" for k, v in value.items())
    return str(value).strip()
