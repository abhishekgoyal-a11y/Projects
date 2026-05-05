from __future__ import annotations
from datetime import datetime, timezone
from .synthesize import SynthesisResult
from .extract import Extraction


def generate(
    query: str,
    extractions: list[Extraction],
    synthesis: SynthesisResult,
    input_tokens: int,
    output_tokens: int,
) -> str:
    now = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M UTC")
    source_count = len(extractions)

    lines = [
        f"# Research Report: {query}",
        f"",
        f"Generated: {now} · Sources: {source_count} · Tokens: {input_tokens:,} in / {output_tokens:,} out",
        f"",
        f"---",
        f"",
    ]

    # Key Findings
    lines += ["## Key Findings", ""]
    direct = [f for f in synthesis.findings if f.get("confidence") == "DIRECT"]
    inferred = [f for f in synthesis.findings if f.get("confidence") == "INFERRED"]
    shown = (direct + inferred)[:10]
    if shown:
        for i, fact in enumerate(shown, 1):
            source_title = fact.get("source_title", fact.get("source_url", "unknown"))[:60]
            conf = fact.get("confidence", "")
            tag = f" `{conf}`" if conf != "DIRECT" else ""
            lines.append(f"{i}. {fact['claim']}{tag}")
            lines.append(f"   — *{source_title}*")
            lines.append("")
    else:
        lines += ["*No findings extracted.*", ""]

    # Consensus
    if synthesis.consensus:
        lines += ["## Consensus (mentioned by multiple sources)", ""]
        for item in synthesis.consensus:
            lines.append(f"- {item}")
        lines.append("")

    # Contradictions
    if synthesis.contradictions:
        lines += ["## Contradictions", ""]
        for c in synthesis.contradictions[:5]:
            lines.append(f"- **{c['claim_a']}** ← *{c['source_a'][:50]}*")
            lines.append(f"  vs **{c['claim_b']}** ← *{c['source_b'][:50]}*")
            lines.append("")

    # Key Entities
    if synthesis.key_entities:
        lines += ["## Key Entities", ""]
        lines.append(", ".join(synthesis.key_entities[:20]))
        lines.append("")

    # Sources
    lines += ["## Sources", ""]
    for ext in extractions:
        score = synthesis.source_scores.get(ext.url, 0.5)
        stars = "★" * round(score * 5)
        lines.append(f"- [{ext.title or ext.url}]({ext.url}) {stars}")
    lines.append("")

    # Suggested questions
    lines += ["## Suggested Follow-up Questions", ""]
    entities = synthesis.key_entities[:3]
    lines.append(f"1. What is the relationship between {entities[0] if entities else 'the main concepts'}?")
    lines.append(f"2. What are the latest developments in {query}?")
    lines.append(f"3. What do critics say about {entities[1] if len(entities) > 1 else query}?")
    lines.append(f"4. How does {entities[2] if len(entities) > 2 else query} compare to alternatives?")
    lines.append("")

    return "\n".join(lines)
