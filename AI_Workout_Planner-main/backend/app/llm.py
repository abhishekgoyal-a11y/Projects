"""LLM client — Groq (default) or OpenAI via OpenAI-compatible API."""

from dotenv import load_dotenv
load_dotenv()

import os
print("ENV FILE CHECK")
print("GROQ =", os.getenv("GROQ_API_KEY"))
print("PROVIDER =", os.getenv("AI_PROVIDER"))

from openai import OpenAI

GROQ_BASE_URL = "https://api.groq.com/openai/v1"
DEFAULT_GROQ_MODEL = "llama-3.3-70b-versatile"
DEFAULT_OPENAI_MODEL = "gpt-4o-mini"


def get_provider() -> str | None:
    """Return 'groq', 'openai', or None if no key is configured."""
    preference = os.getenv("AI_PROVIDER", "auto").lower().strip()

    if preference == "groq":
        return "groq" if os.getenv("GROQ_API_KEY", "").strip() else None
    if preference == "openai":
        return "openai" if os.getenv("OPENAI_API_KEY") else None

    # auto: prefer Groq when both keys exist
    if os.getenv("GROQ_API_KEY"):
        return "groq"
    if os.getenv("OPENAI_API_KEY"):
        return "openai"
    return None


def ai_available() -> bool:
    return get_provider() is not None


def get_model() -> str:
    provider = get_provider()
    if provider == "groq":
        return os.getenv("GROQ_MODEL", DEFAULT_GROQ_MODEL)
    return os.getenv("OPENAI_MODEL", DEFAULT_OPENAI_MODEL)


def get_client() -> OpenAI:
    provider = get_provider()
    if provider == "groq":
        api_key = os.getenv("GROQ_API_KEY")
        if not api_key:
            raise RuntimeError("GROQ_API_KEY is not set")
        return OpenAI(api_key=api_key, base_url=GROQ_BASE_URL)
    if provider == "openai":
        api_key = os.getenv("OPENAI_API_KEY")
        if not api_key:
            raise RuntimeError("OPENAI_API_KEY is not set")
        return OpenAI(api_key=api_key)
    raise RuntimeError(
        "No AI provider configured. Set GROQ_API_KEY (recommended) or OPENAI_API_KEY."
    )
