from __future__ import annotations

import re
from collections import Counter
from dataclasses import dataclass, asdict
from typing import Literal

import httpx
from bs4 import BeautifulSoup


InputType = Literal["blog", "url", "markdown"]


STOP_WORDS = {
    "about", "after", "again", "also", "because", "before", "being", "between",
    "could", "every", "from", "have", "into", "more", "most", "only", "other",
    "over", "some", "such", "than", "that", "their", "there", "these", "they",
    "this", "through", "under", "very", "were", "what", "when", "where", "which",
    "while", "with", "would", "your", "you", "and", "the", "for", "are", "but",
    "not", "can", "our", "how", "why", "who", "was", "has", "had", "its",
}


@dataclass
class ContentInsights:
    title: str
    topic: str
    main_idea: str
    tone: str
    audience: str
    hook: str
    key_points: list[str]
    examples: list[str]
    quotes: list[str]
    conclusion: str
    source_text: str

    def to_dict(self) -> dict:
        return asdict(self)


def load_content(source_text: str, input_type: InputType) -> str:
    text = source_text.strip()
    if not text:
        raise ValueError("Please provide a blog, URL, or markdown document.")

    # Auto-detect URLs even when input_type is "blog"
    if input_type == "url" or re.match(r"^https?://\S+$", text, re.I):
        return fetch_article_text(text)
    if input_type == "markdown":
        return clean_markdown(text)
    return normalize_whitespace(text)


def fetch_article_text(url: str) -> str:
    if not re.match(r"^https?://", url, re.I):
        raise ValueError("URL input must start with http:// or https://.")

    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.5",
    }
    response = httpx.get(url, headers=headers, follow_redirects=True, timeout=20)
    response.raise_for_status()

    soup = BeautifulSoup(response.content, "html.parser")
    for tag in soup(["script", "style", "nav", "footer", "aside", "form", "header", "noscript"]):
        tag.decompose()

    article = soup.find("article") or soup.find("main") or soup.body or soup
    lines: list[str] = []
    for block in article.find_all(["h1", "h2", "h3", "p", "li"]):
        line = block.get_text(" ", strip=True)
        # Skip very short fragments and navigation noise
        if len(line) < 20:
            continue
        # Skip lines that are just single letters (social share icons etc.)
        if re.match(r"^[A-Z]$", line):
            continue
        lines.append(line)

    text = "\n".join(lines)
    # Remove garbled unicode replacement characters
    text = re.sub(r"[\u0080-\u009f\ufffd]", "", text)
    text = re.sub(r"[\u4e00-\u9fff\u3000-\u303f]", "", text)  # strip stray CJK chars from encoding errors
    if len(text) < 200:
        raise ValueError("Could not extract enough text from that URL. The page may require JavaScript.")
    return normalize_whitespace(text)


def clean_markdown(text: str) -> str:
    text = re.sub(r"```[\s\S]*?```", " ", text)
    text = re.sub(r"`([^`]*)`", r"\1", text)
    text = re.sub(r"!\[[^\]]*\]\([^)]+\)", " ", text)
    text = re.sub(r"\[([^\]]+)\]\([^)]+\)", r"\1", text)
    text = re.sub(r"^#{1,6}\s*", "", text, flags=re.M)
    text = re.sub(r"^\s*[-*+]\s+", "", text, flags=re.M)
    text = re.sub(r"^\s*\d+\.\s+", "", text, flags=re.M)
    text = re.sub(r"[*_>~]", "", text)
    return normalize_whitespace(text)


def normalize_whitespace(text: str) -> str:
    text = re.sub(r"\r\n?", "\n", text)
    text = re.sub(r"[ \t]+", " ", text)
    text = re.sub(r"\n{3,}", "\n\n", text)
    return text.strip()


def analyze_content(text: str, audience_hint: str = "general") -> ContentInsights:
    sentences = split_sentences(text)
    words = important_words(text)
    title = extract_title(text, words)
    key_points = extract_key_points(sentences)
    quotes = extract_quotes(text)
    examples = extract_examples(sentences)
    tone = detect_tone(text)
    audience = infer_audience(text, audience_hint)
    main_idea = key_points[0] if key_points else summarize_first_sentence(sentences)
    topic = " ".join(words[:4]).title() if words else title
    hook = build_hook(topic or title, main_idea)
    conclusion = sentences[-1] if sentences else main_idea

    return ContentInsights(
        title=title,
        topic=topic or "Untitled Topic",
        main_idea=main_idea,
        tone=tone,
        audience=audience,
        hook=hook,
        key_points=key_points[:7],
        examples=examples[:3],
        quotes=quotes[:3],
        conclusion=conclusion,
        source_text=text,
    )


def split_sentences(text: str) -> list[str]:
    parts = re.split(r"(?<=[.!?])\s+", text.replace("\n", " "))
    return [part.strip() for part in parts if len(part.strip()) > 20]


def important_words(text: str) -> list[str]:
    tokens = re.findall(r"[A-Za-z][A-Za-z-]{3,}", text.lower())
    filtered = [token for token in tokens if token not in STOP_WORDS]
    return [word for word, _ in Counter(filtered).most_common(12)]


def extract_title(text: str, words: list[str]) -> str:
    first_line = next((line.strip() for line in text.splitlines() if line.strip()), "")
    if 8 <= len(first_line) <= 90 and not first_line.endswith((".", "!", "?")):
        return first_line
    if words:
        return " ".join(words[:5]).title()
    return "Repurposed Content"


def extract_key_points(sentences: list[str]) -> list[str]:
    if not sentences:
        return []

    scored: list[tuple[int, str]] = []
    signal_terms = (
        "important", "because", "means", "helps", "creates", "improves", "reduces",
        "increases", "strategy", "result", "benefit", "challenge", "solution",
        "key", "critical", "essential", "powerful", "transform", "enable", "allows",
        "requires", "need", "must", "should", "will", "can", "shows", "reveals",
    )
    for index, sentence in enumerate(sentences):
        score = min(len(sentence), 200)
        score += 40 if any(term in sentence.lower() for term in signal_terms) else 0
        score += 25 if index < 5 else 0
        score -= 10 if len(sentence) < 40 else 0
        scored.append((score, sentence))

    selected = [sentence for _, sentence in sorted(scored, reverse=True)[:7]]
    selected.sort(key=lambda sentence: sentences.index(sentence))
    return [trim_sentence(sentence, 220) for sentence in selected]


def extract_quotes(text: str) -> list[str]:
    quoted = re.findall(r'"([^"]{20,180})"', text)
    if quoted:
        return [quote.strip() for quote in quoted]
    sentences = split_sentences(text)
    return [sentence for sentence in sentences if any(term in sentence.lower() for term in ("remember", "lesson", "truth", "principle"))][:3]


def extract_examples(sentences: list[str]) -> list[str]:
    markers = ("for example", "for instance", "such as", "case study", "imagine", "consider")
    return [trim_sentence(sentence, 180) for sentence in sentences if any(marker in sentence.lower() for marker in markers)]


def detect_tone(text: str) -> str:
    lower = text.lower()
    casual = sum(lower.count(term) for term in ("you", "let's", "simple", "easy", "quick"))
    formal = sum(lower.count(term) for term in ("therefore", "however", "analysis", "framework", "process"))
    if casual > formal + 3:
        return "casual"
    if formal > casual:
        return "formal"
    return "educational"


def infer_audience(text: str, audience_hint: str) -> str:
    if audience_hint and audience_hint != "general":
        return audience_hint
    lower = text.lower()
    if any(term in lower for term in ("founder", "revenue", "customers", "market", "saas")):
        return "entrepreneurs"
    if any(term in lower for term in ("beginner", "intro", "basics", "getting started")):
        return "beginners"
    if any(term in lower for term in ("architecture", "advanced", "technical", "model", "system")):
        return "experts"
    return "creators and marketers"


def build_hook(topic: str, main_idea: str) -> str:
    topic = topic or "this idea"
    idea = trim_sentence(main_idea, 140)
    return f"Most people overlook the real power of {topic.lower()}. Here's what changes when you get it right: {idea}"


def summarize_first_sentence(sentences: list[str]) -> str:
    return trim_sentence(sentences[0], 180) if sentences else "This piece shares a practical idea worth repurposing."


def trim_sentence(sentence: str, limit: int) -> str:
    sentence = re.sub(r"\s+", " ", sentence).strip()
    if len(sentence) <= limit:
        return sentence
    return sentence[: limit - 1].rsplit(" ", 1)[0] + "..."

