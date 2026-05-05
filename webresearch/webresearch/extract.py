from __future__ import annotations
import json
from dataclasses import dataclass, field
from pathlib import Path


@dataclass
class Extraction:
    url: str
    title: str
    facts: list[dict] = field(default_factory=list)
    entities: list[str] = field(default_factory=list)
    claims: list[dict] = field(default_factory=list)
    input_tokens: int = 0
    output_tokens: int = 0


def load_extractions(chunk_dir: str = "research-out") -> list[Extraction]:
    """Load extraction chunk files written by Claude during skill execution."""
    chunks = sorted(Path(chunk_dir).glob(".wr_chunk_*.json"))
    extractions = []
    for chunk in chunks:
        try:
            data = json.loads(chunk.read_text())
            for item in data if isinstance(data, list) else [data]:
                extractions.append(Extraction(**item))
        except Exception:
            continue
    return extractions


def save_chunk(index: int, extractions: list[dict], out_dir: str = "research-out") -> None:
    """Save a chunk of extractions written by Claude subagents."""
    path = Path(out_dir) / f".wr_chunk_{index:03d}.json"
    path.write_text(json.dumps(extractions, indent=2))
