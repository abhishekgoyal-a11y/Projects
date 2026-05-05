# webresearch

**Autonomous web research for Claude Code.**

Type `/webresearch "your topic"` in Claude Code and get a structured research report — key findings, contradictions, citations, and an interactive visualization — in about 3 minutes.

No API keys. No configuration. Just install and go.

---

## What is this?

`webresearch` is a CLI tool that plugs into Claude Code as a skill. When you type `/webresearch "topic"`, Claude automatically:

1. **Searches** DuckDuckGo (and optionally arXiv) for your topic
2. **Fetches** the top pages and converts them to readable text
3. **Reads and extracts** key facts, entities, and claims from each page (Claude does this itself — no external API needed)
4. **Synthesizes** findings — deduplicates, detects contradictions, ranks by source credibility
5. **Generates** a structured report with citations and an interactive graph

Everything lands in a `research-out/` folder in your current directory.

---

## How it works

```
You: /webresearch "LLM fine tuning techniques"
              ↓
Claude reads skill instructions
              ↓
  Step 1: Check webresearch is installed
  Step 2: Search DuckDuckGo/arXiv → 20 URLs
  Step 3: Fetch all 20 pages in parallel (async)
  Step 4: Dispatch 4 Claude subagents in parallel
          (each reads 5 pages, extracts facts as JSON)
  Step 5: Merge → synthesize → generate report
              ↓
research-out/
├── RESEARCH_REPORT.md   key findings, contradictions, citations
├── sources.json         all extracted data (queryable)
└── report.html          interactive graph (open in browser)
```

Claude does the reading and extraction itself — no Anthropic API key required beyond what Claude Code already uses.

---

## Install

**Requirements:** Python 3.10+, Claude Code

```bash
pip3 install webresearchh     # double-h on PyPI (webresearch was already taken)
webresearch install          # single-h CLI command — registers the skill
```

That's it. The `install` command registers the `/webresearch` skill in Claude Code automatically.

> **Note:** The PyPI package is `webresearchh` (double h). The CLI command and Claude Code skill are both `webresearch` (single h).

### Install with optional extras

```bash
# Academic paper search (arXiv)
pip3 install 'webresearchh[arxiv]'

# PDF parsing
pip3 install 'webresearchh[pdf]'

# Everything
pip3 install 'webresearchh[all]'
```

### Alternative install methods

```bash
# Using uv (recommended)
uv tool install webresearchh

# Using pipx
pipx install webresearchh
```

After installing, always run:

```bash
webresearch install
```

---

## Usage in Claude Code

Open Claude Code in any project folder and type:

```
/webresearch "your topic"
```

### Examples

```
/webresearch "transformer attention mechanisms"
/webresearch "React vs Vue 2024"
/webresearch "climate change carbon capture solutions"
/webresearch "kubernetes vs docker swarm" --sources web,arxiv
/webresearch "protein folding" --sources arxiv --since 2023
/webresearch "AI coding tools" --max 30
/webresearch "LLM benchmarks" --since 2024 --no-viz
```

### Query existing research

```
/webresearch query "what do sources say about fine tuning?"
/webresearch query "which frameworks are mentioned most?"
```

### Add a specific URL

```
/webresearch add https://arxiv.org/abs/1706.03762
/webresearch add https://somesite.com/article
```

---

## All CLI Commands

All commands work from the terminal too (without Claude Code):

### Research

```bash
# Full research pipeline
webresearch "topic"

# Choose sources: web (default), arxiv, or both
webresearch "topic" --sources web,arxiv

# Limit number of results per source (default: 20)
webresearch "topic" --max 30

# Filter results by year
webresearch "topic" --since 2024

# Skip HTML visualization (faster)
webresearch "topic" --no-viz

# Re-fetch only changed/new sources
webresearch "topic" --update
```

### Query

```bash
# Search within existing research-out/sources.json
webresearch query "what do sources say about X?"
```

### Add URL

```bash
# Add a specific page to the corpus
webresearch add https://example.com/article
```

### Skill management

```bash
# Register skill in Claude Code
webresearch install

# Remove skill from Claude Code
webresearch uninstall
```

---

## Output files

All outputs are created in `research-out/` inside your current working directory.


| File                 | Description                                                                                                           |
| -------------------- | --------------------------------------------------------------------------------------------------------------------- |
| `RESEARCH_REPORT.md` | Human-readable report: key findings, contradictions, consensus, source quality ratings, suggested follow-up questions |
| `sources.json`       | Machine-readable: all sources, extracted facts, entities, claims, synthesis results                                   |
| `report.html`        | Interactive D3.js graph: sources as nodes, shared entities as edges. Open in any browser.                             |
| `cache/`             | SHA256-based cache of fetched pages and extractions — re-runs skip already-processed URLs                             |


### What's in RESEARCH_REPORT.md

- **Key Findings** — top facts with source citations and confidence levels (`DIRECT` / `INFERRED` / `AMBIGUOUS`)
- **Contradictions** — conflicting claims from different sources, shown side by side
- **Consensus** — points that multiple sources agree on
- **Source Quality** — credibility rating per source (based on domain authority)
- **Suggested Follow-up Questions** — what to research next

---

## Confidence levels

Every extracted fact is tagged with one of three confidence levels:


| Tag         | Meaning                           |
| ----------- | --------------------------------- |
| `DIRECT`    | Stated explicitly in the source   |
| `INFERRED`  | Reasonable inference from context |
| `AMBIGUOUS` | Uncertain — included but flagged  |


---

## Sources supported


| Source           | Flag                    | Notes                                                         |
| ---------------- | ----------------------- | ------------------------------------------------------------- |
| Web (DuckDuckGo) | default                 | Free, no API key                                              |
| arXiv            | `--sources arxiv`       | Academic papers, requires `pip install 'webresearchh[arxiv]'` |
| Web + arXiv      | `--sources web,arxiv`   | Both combined                                                 |
| Specific URL     | `webresearch add <url>` | Any public webpage, PDF, or arXiv paper                       |


---

## Caching

`webresearch` caches every fetched page and extraction by SHA256 hash of the URL.

- **Re-runs on the same topic are instant** for already-fetched pages
- Use `--update` to re-fetch only pages that have changed
- Cache lives in `research-out/cache/`
- Safe to commit `research-out/` to git so teammates share the cache

---

## Team usage

Commit `research-out/` to git:

```bash
git add research-out/RESEARCH_REPORT.md research-out/sources.json
git commit -m "add research: transformer attention mechanisms"
```

Teammates can then query the existing research without re-fetching:

```
/webresearch query "what do sources say about attention?"
```

---

## Privacy

- **Web fetching** — pages are downloaded to your local machine only
- **Extraction** — done by Claude Code itself (the model you're already running)
- **No telemetry** — no usage tracking, no analytics, no external services beyond the web pages you choose to fetch

---

## Troubleshooting

`**webresearch: command not found`**

```bash
# Use uv or pipx which put CLI on PATH automatically:
uv tool install webresearchh
# or
pipx install webresearchh
```

**Search returns no results**
DuckDuckGo rate-limits requests. Wait a few seconds and try again.

**Pages fail to fetch**
Some sites block automated requests. The tool skips failed pages and continues with the rest.

**Skill not recognized in Claude Code**
Make sure you ran `webresearch install` and restarted Claude Code.

---

## Project structure

```
webresearch/
├── pyproject.toml
├── README.md
└── webresearch/
    ├── __init__.py
    ├── __main__.py      CLI entry point — all commands
    ├── skill.md         Claude Code skill definition
    ├── search.py        DuckDuckGo + arXiv search
    ├── fetch.py         Async parallel page fetcher (HTML → Markdown)
    ├── extract.py       Extraction data structures + chunk file I/O
    ├── synthesize.py    Dedup, contradiction detection, entity ranking
    ├── report.py        RESEARCH_REPORT.md generator
    ├── export.py        sources.json + interactive D3.js HTML
    ├── cache.py         SHA256 per-URL cache
    └── install.py       Claude Code skill registration
```

---

## Contributing

Pull requests welcome. Please open an issue first for large changes.

---

## License

MIT