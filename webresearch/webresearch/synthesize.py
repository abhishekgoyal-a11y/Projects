from __future__ import annotations
from dataclasses import dataclass, field
from urllib.parse import urlparse

from rapidfuzz import fuzz

from .extract import Extraction, load_extractions


@dataclass
class SynthesisResult:
    findings: list[dict] = field(default_factory=list)
    contradictions: list[dict] = field(default_factory=list)
    consensus: list[str] = field(default_factory=list)
    key_entities: list[str] = field(default_factory=list)
    source_scores: dict[str, float] = field(default_factory=dict)


_TRUSTED_DOMAINS = {
    "arxiv.org", "nature.com", "science.org", "acm.org", "ieee.org",
    "github.com", "openai.com", "anthropic.com", "deepmind.com",
    "wikipedia.org", "stackoverflow.com", "medium.com",
}


def _domain_score(url: str) -> float:
    try:
        domain = urlparse(url).netloc.lower().lstrip("www.")
        return 0.9 if any(t in domain for t in _TRUSTED_DOMAINS) else 0.6
    except Exception:
        return 0.5


def _are_similar(a: str, b: str, threshold: int = 80) -> bool:
    return fuzz.token_sort_ratio(a.lower(), b.lower()) >= threshold


def _dedup_facts(all_facts: list[dict]) -> list[dict]:
    deduped = []
    for fact in all_facts:
        claim = fact.get("claim", "")
        if not any(_are_similar(claim, d["claim"]) for d in deduped):
            deduped.append(fact)
    return deduped


def _detect_contradictions(facts: list[dict]) -> list[dict]:
    contradictions = []
    for i, a in enumerate(facts):
        for b in facts[i + 1:]:
            if a.get("source_url") == b.get("source_url"):
                continue
            if _are_similar(a["claim"], b["claim"], threshold=60):
                if a.get("stance") and b.get("stance") and a["stance"] != b["stance"]:
                    contradictions.append({
                        "claim_a": a["claim"],
                        "source_a": a.get("source_url", ""),
                        "claim_b": b["claim"],
                        "source_b": b.get("source_url", ""),
                    })
    return contradictions


def _top_entities(extractions: list[Extraction], top_n: int = 20) -> list[str]:
    counts: dict[str, int] = {}
    for ext in extractions:
        for e in ext.entities:
            counts[e] = counts.get(e, 0) + 1
    return [e for e, _ in sorted(counts.items(), key=lambda x: -x[1])[:top_n]]


def synthesize(extractions: list[Extraction]) -> SynthesisResult:
    all_facts = []
    for ext in extractions:
        score = _domain_score(ext.url)
        for fact in ext.facts:
            all_facts.append({**fact, "source_url": ext.url, "source_title": ext.title, "source_score": score})
        for claim in ext.claims:
            all_facts.append({**claim, "source_url": ext.url, "source_title": ext.title, "source_score": score})

    deduped = _dedup_facts(all_facts)
    deduped.sort(key=lambda f: (-f.get("source_score", 0), f.get("confidence", "AMBIGUOUS")))

    contradictions = _detect_contradictions(deduped)

    claim_texts = [f["claim"] for f in deduped]
    consensus = [c for c in claim_texts if sum(_are_similar(c, other) for other in claim_texts) > 1]
    consensus = list(dict.fromkeys(consensus))[:5]

    source_scores = {ext.url: _domain_score(ext.url) for ext in extractions}

    return SynthesisResult(
        findings=deduped[:30],
        contradictions=contradictions[:10],
        consensus=consensus,
        key_entities=_top_entities(extractions),
        source_scores=source_scores,
    )
