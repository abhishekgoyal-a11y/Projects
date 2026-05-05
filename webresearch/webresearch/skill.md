---
name: webresearch
description: "Research any topic by autonomously gathering, extracting, and synthesizing information from multiple web sources. Use when the user asks to research a topic, investigate a subject, or gather information from the web."
trigger: /webresearch
---

# /webresearch

Autonomously research any topic: search the web, fetch pages, extract key facts (you do this yourself — no API key needed), and generate a structured research report.

## Usage

```
/webresearch "topic"                        # full research pipeline
/webresearch "topic" --sources web,arxiv   # choose sources (web, arxiv)
/webresearch "topic" --max 30              # max results per source
/webresearch "topic" --since 2024          # filter by year
/webresearch "topic" --no-viz              # skip HTML graph
/webresearch add <url>                     # add a specific URL
/webresearch query "<question>"            # query existing research
```

## What You Must Do When Invoked

If no topic was given, ask the user: "What topic would you like me to research?"

Follow these steps in order. Do not skip steps.

### Step 1 — Ensure webresearch is installed

```bash
PYTHON=""
WR_BIN=$(which webresearch 2>/dev/null)
if [ -z "$PYTHON" ] && command -v uv >/dev/null 2>&1; then
    _UV_PY=$(uv tool run webresearchh python -c "import sys; print(sys.executable)" 2>/dev/null)
    if [ -n "$_UV_PY" ]; then PYTHON="$_UV_PY"; fi
fi
if [ -z "$PYTHON" ] && [ -n "$WR_BIN" ]; then
    _SHEBANG=$(head -1 "$WR_BIN" | tr -d '#!')
    case "$_SHEBANG" in
        *[!a-zA-Z0-9/_.-]*) ;;
        *) "$_SHEBANG" -c "import webresearch" 2>/dev/null && PYTHON="$_SHEBANG" ;;
    esac
fi
if [ -z "$PYTHON" ]; then PYTHON="python3"; fi
"$PYTHON" -c "import webresearch" 2>/dev/null || "$PYTHON" -m pip install webresearchh -q
mkdir -p research-out
"$PYTHON" -c "import sys; open('research-out/.webresearch_python', 'w').write(sys.executable)"
```

In every subsequent bash block, replace `python3` with `$(cat research-out/.webresearch_python)`.

### Step 2 — Search web sources

```bash
$(cat research-out/.webresearch_python) -c "
import json
from pathlib import Path
from webresearch.search import search

results = search('TOPIC', max_results=MAX_RESULTS, sources=SOURCES, since=SINCE)
Path('research-out/.wr_search.json').write_text(json.dumps([r.__dict__ for r in results], indent=2))
print(f'Found {len(results)} URLs')
for r in results[:5]:
    print(f'  - {r.title[:70]}')
"
```

Replace TOPIC, MAX_RESULTS (default 20), SOURCES (default ["web"]), SINCE (default None).
Print a summary: "Found N URLs"

### Step 3 — Fetch and parse pages

```bash
$(cat research-out/.webresearch_python) -c "
import json
from pathlib import Path
from webresearch.search import SearchResult
from webresearch.fetch import fetch_pages

results = [SearchResult(**r) for r in json.loads(Path('research-out/.wr_search.json').read_text())]
pages = fetch_pages(results)
Path('research-out/.wr_pages.json').write_text(json.dumps([p.__dict__ for p in pages], indent=2))
print(f'Fetched {len(pages)} pages')
"
```

### Step 4 — Extract facts (YOU do this — no API key needed)

**MANDATORY: You MUST use the Agent tool here. You are already a language model — read the fetched pages yourself and extract structured facts. No external API call needed.**

Load the fetched pages:

```bash
$(cat research-out/.webresearch_python) -c "
import json
from pathlib import Path
pages = json.loads(Path('research-out/.wr_pages.json').read_text())
print(f'Pages to extract: {len(pages)}')
for i, p in enumerate(pages):
    print(f'  {i}: {p[\"title\"][:60]} ({len(p[\"content_markdown\"])} chars)')
"
```

Split pages into batches of 5. Dispatch ALL subagents in a single message — one per batch.

Each subagent receives this prompt (substitute PAGE_LIST and CHUNK_NUM):

```
You are a webresearch extraction subagent. Read the pages below and extract structured facts.
Output ONLY valid JSON — no markdown fences, no explanation, no preamble.

Pages (chunk CHUNK_NUM of TOTAL_CHUNKS):
PAGE_LIST

For each page extract:
- facts: explicit claims or findings stated in the content
- entities: named people, orgs, tools, concepts mentioned
- claims: opinions or stances taken by the source

Confidence:
- DIRECT: stated explicitly in the content
- INFERRED: reasonable inference from context
- AMBIGUOUS: uncertain — include but flag it

Output exactly this JSON (one object per page, in an array):
[
  {
    "url": "page url",
    "title": "page title",
    "facts": [{"claim": "...", "confidence": "DIRECT|INFERRED|AMBIGUOUS", "quote": "exact quote or null"}],
    "entities": ["list", "of", "named", "entities"],
    "claims": [{"claim": "...", "stance": "positive|negative|neutral", "confidence": "DIRECT|INFERRED|AMBIGUOUS"}],
    "input_tokens": 0,
    "output_tokens": 0
  }
]

Rules:
- Extract 3-8 facts per page
- Up to 15 entities per page
- Focus on substance — ignore nav, ads, cookie notices
- If page content is empty or irrelevant, return empty arrays
```

After all subagents complete, each writes its result to disk:

```bash
# Subagent N writes its result (subagent does this itself):
$(cat research-out/.webresearch_python) -c "
import json
from pathlib import Path
result = SUBAGENT_RESULT_JSON
Path('research-out/.wr_chunk_NNN.json').write_text(json.dumps(result, indent=2))
print(f'Chunk NNN saved: {len(result)} extractions')
"
```

Merge all chunks:

```bash
$(cat research-out/.webresearch_python) -c "
import json, glob
from pathlib import Path

chunks = sorted(glob.glob('research-out/.wr_chunk_*.json'))
all_extractions = []
for c in chunks:
    data = json.loads(Path(c).read_text())
    if isinstance(data, list):
        all_extractions.extend(data)
    else:
        all_extractions.append(data)

Path('research-out/.wr_extractions.json').write_text(json.dumps(all_extractions, indent=2))
print(f'Merged {len(chunks)} chunks → {len(all_extractions)} extractions')
"
```

### Step 5 — Synthesize and generate report

```bash
$(cat research-out/.webresearch_python) -c "
import json
from pathlib import Path
from webresearch.extract import Extraction
from webresearch.synthesize import synthesize
from webresearch.report import generate
from webresearch.export import to_json, to_html

data = json.loads(Path('research-out/.wr_extractions.json').read_text())
extractions = [Extraction(**e) for e in data]

synthesis = synthesize(extractions)

report = generate('TOPIC', extractions, synthesis, 0, 0)
Path('research-out/RESEARCH_REPORT.md').write_text(report)

to_json('TOPIC', extractions, synthesis)
to_html('TOPIC', extractions, synthesis)

print(f'Findings: {len(synthesis.findings)}')
print(f'Contradictions: {len(synthesis.contradictions)}')
print(f'Key entities: {synthesis.key_entities[:8]}')
"
```

Clean up temp files:
```bash
rm -f research-out/.wr_search.json research-out/.wr_pages.json research-out/.wr_extractions.json research-out/.wr_chunk_*.json
```

### Step 6 — Report to user

Tell the user:
```
Research complete. Outputs in research-out/

  RESEARCH_REPORT.md  — key findings, contradictions, citations
  sources.json        — raw data (queryable)
  report.html         — open in browser (interactive graph)
```

Then paste these sections from RESEARCH_REPORT.md directly into chat:
- Key Findings (top 5)
- Contradictions (if any)
- Suggested Follow-up Questions

Then ask: "Want me to dig deeper into any of these findings?"

---

## For /webresearch query

Read research-out/sources.json and answer the question using only what the data contains.
Do not hallucinate. Quote source titles when citing specific facts.

---

## For /webresearch add <url>

```bash
$(cat research-out/.webresearch_python) -m webresearch add URL
```

After saving, offer to re-run extraction on the new page and update the report.

---

## Honesty Rules

- Never invent facts. If unsure, mark AMBIGUOUS.
- Never skip the corpus check warning for large corpora.
- Always show how many sources were found vs fetched.
- If a page failed to fetch, say so — do not silently skip.
- Never hide contradictions from the user.
