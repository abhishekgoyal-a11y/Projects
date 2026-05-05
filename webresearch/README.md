# webresearch

Type `/webresearch "topic"` in your AI coding assistant and it autonomously researches any topic — searches the web, reads pages, extracts key facts, detects contradictions, and generates a structured report.

## Demo

https://github.com/user-attachments/assets/screen-capture.webm

> See it in action: `/webresearch "python async programming"` — 20 pages fetched, 4 subagents running in parallel, full report in ~3 minutes.

Works in **Claude Code, Codex, OpenCode, GitHub Copilot, Aider, OpenClaw, Factory Droid, Trae, Hermes, Kiro, and Google Antigravity.**

```
/webresearch "transformer attention mechanisms"
```

That's it. You get three files:

```
research-out/
├── report.html          open in any browser — interactive source graph
├── RESEARCH_REPORT.md   key findings, contradictions, citations, suggested questions
└── sources.json         all extracted data — query it anytime
```

---

## Install

**Requires Python 3.10+**

```bash
pip install webresearchh && webresearch install
# or: uv tool install webresearchh && webresearch install
# or: pipx install webresearchh && webresearch install
```

> **Official package:** The PyPI package is `webresearchh` (double-h). The CLI command and skill trigger are both `webresearch` (single h).

> **`webresearch: command not found`?** Use `uv tool install webresearchh` or `pipx install webresearchh` — both put the CLI on PATH automatically. With plain `pip`, add `~/.local/bin` (Linux) or `~/Library/Python/3.x/bin` (Mac) to your PATH.

### Pick your platform

| Platform | Install command |
|----------|----------------|
| Claude Code (Linux/Mac) | `webresearch install` |
| Codex | `webresearch install --platform codex` |
| OpenCode | `webresearch install --platform opencode` |
| GitHub Copilot CLI | `webresearch install --platform copilot` |
| Aider | `webresearch install --platform aider` |
| OpenClaw | `webresearch install --platform claw` |
| Factory Droid | `webresearch install --platform droid` |
| Trae | `webresearch install --platform trae` |
| Trae CN | `webresearch install --platform trae-cn` |
| Hermes | `webresearch install --platform hermes` |
| Kiro | `webresearch install --platform kiro` |
| Google Antigravity | `webresearch install --platform antigravity` |

> **Codex users:** also add `multi_agent = true` under `[features]` in `~/.codex/config.toml`. Codex uses `$webresearch` instead of `/webresearch`.

---

## How it works

```
/webresearch "LLM fine tuning techniques"
              ↓
Step 1: Search DuckDuckGo / arXiv → 20 URLs
Step 2: Fetch all pages in parallel (async)
Step 3: Dispatch Claude subagents in parallel
        (each reads 5 pages, extracts facts as JSON)
Step 4: Merge → synthesize → detect contradictions
Step 5: Generate report + interactive graph
              ↓
research-out/
├── RESEARCH_REPORT.md
├── sources.json
└── report.html
```

No API keys needed — your AI assistant does the reading and extraction itself.

---

## Usage in your AI assistant

```
/webresearch "topic"                        # full research pipeline
/webresearch "topic" --sources web,arxiv   # include academic papers
/webresearch "topic" --max 30              # fetch more results
/webresearch "topic" --since 2024          # filter by year
/webresearch "topic" --no-viz              # skip HTML, just report + JSON
/webresearch query "what do sources say about X?"
/webresearch add https://example.com/article
```

---

## All CLI commands

### Research

```bash
webresearch "topic"                        # full pipeline
webresearch "topic" --sources web,arxiv   # web + academic papers
webresearch "topic" --sources arxiv       # academic papers only
webresearch "topic" --max 30              # max results per source (default: 20)
webresearch "topic" --since 2024          # filter by year
webresearch "topic" --no-viz              # skip HTML visualization
webresearch "topic" --update              # re-fetch only changed sources
```

### Query existing research

```bash
webresearch query "what do sources say about X?"
```

### Add a specific URL

```bash
webresearch add https://arxiv.org/abs/1706.03762
webresearch add https://example.com/article
```

### Skill management

```bash
webresearch install                        # register skill (default: Claude Code)
webresearch install --platform codex       # register for Codex
webresearch install --platform copilot     # register for GitHub Copilot
webresearch install --platform aider       # register for Aider
webresearch install --platform opencode    # register for OpenCode
webresearch install --platform claw        # register for OpenClaw
webresearch install --platform droid       # register for Factory Droid
webresearch install --platform trae        # register for Trae
webresearch install --platform trae-cn     # register for Trae CN
webresearch install --platform hermes      # register for Hermes
webresearch install --platform kiro        # register for Kiro
webresearch install --platform antigravity # register for Google Antigravity
webresearch uninstall                      # remove from Claude Code
webresearch uninstall --platform codex     # remove from specific platform
```

---

## What's in the report

- **Key Findings** — top facts with source citations and confidence tags
- **Contradictions** — conflicting claims from different sources, shown side by side
- **Consensus** — points that multiple sources agree on
- **Source Quality** — credibility rating per source (domain authority)
- **Suggested Follow-up Questions** — what to research next

---

## Confidence tags

Every extracted fact is tagged:

| Tag | Meaning |
|-----|---------|
| `DIRECT` | Stated explicitly in the source |
| `INFERRED` | Reasonable inference from context |
| `AMBIGUOUS` | Uncertain — included but flagged |

---

## Output files

| File | Description |
|------|-------------|
| `RESEARCH_REPORT.md` | Human-readable report with findings, contradictions, citations |
| `sources.json` | All sources, extracted facts, entities, claims |
| `report.html` | Interactive D3.js graph — open in any browser |
| `cache/` | SHA256 cache per URL — re-runs skip already-fetched pages |

---

## Sources supported

| Source | Flag | Notes |
|--------|------|-------|
| Web (DuckDuckGo) | default | Free, no API key |
| arXiv | `--sources arxiv` | Requires `pip install 'webresearchh[arxiv]'` |
| Web + arXiv | `--sources web,arxiv` | Both combined |
| Specific URL | `webresearch add <url>` | Any public page, PDF, or arXiv link |

### Optional extras

```bash
pip install 'webresearchh[arxiv]'   # arXiv academic search
pip install 'webresearchh[pdf]'     # PDF parsing
pip install 'webresearchh[all]'     # everything
```

---

## Caching

Every fetched page and extraction is cached by SHA256 hash of the URL.

- Re-runs on the same topic skip already-processed pages instantly
- Use `--update` to re-fetch only changed sources
- Cache lives in `research-out/cache/`
- Commit `research-out/` to git so teammates share the cache

---

## Team usage

```bash
git add research-out/RESEARCH_REPORT.md research-out/sources.json
git commit -m "research: transformer attention mechanisms"
```

Teammates pull and query the existing research without re-fetching:

```
/webresearch query "what do sources say about attention?"
```

---

## Privacy

- **Web fetching** — pages downloaded to your local machine only
- **Extraction** — done by your AI assistant (no external LLM API calls)
- **No telemetry** — no usage tracking, no analytics

---

## Troubleshooting

**`webresearch: command not found`**
```bash
uv tool install webresearchh   # recommended
# or
pipx install webresearchh
```

**Search returns no results**
DuckDuckGo rate-limits requests. Wait a few seconds and try again.

**Pages fail to fetch**
Some sites block automated requests. The tool skips failed pages and continues.

**Skill not recognized in your AI assistant**
Run `webresearch install` (with the right `--platform` flag) and restart your assistant.

---

## Project structure

```
webresearch/
├── pyproject.toml
├── README.md
└── webresearch/
    ├── __init__.py
    ├── __main__.py         CLI entry point — all commands
    ├── skill.md            Claude Code skill
    ├── skill-codex.md      Codex skill
    ├── skill-opencode.md   OpenCode skill
    ├── skill-copilot.md    GitHub Copilot skill
    ├── skill-aider.md      Aider skill
    ├── search.py           DuckDuckGo + arXiv search
    ├── fetch.py            Async parallel page fetcher
    ├── extract.py          Extraction data structures
    ├── synthesize.py       Dedup, contradiction detection
    ├── report.py           RESEARCH_REPORT.md generator
    ├── export.py           sources.json + D3.js HTML
    ├── cache.py            SHA256 per-URL cache
    └── install.py          Platform skill registration
```

---

## Contributing

Pull requests welcome. Please open an issue first for large changes.

---

## License

MIT
