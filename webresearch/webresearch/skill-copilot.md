---
name: webresearch
description: "Research any topic by autonomously gathering, extracting, and synthesizing information from multiple web sources."
trigger: /webresearch
---

# /webresearch

Autonomously research any topic: search the web, fetch pages, extract key facts, and generate a structured research report.

## Usage

```
/webresearch "topic"
/webresearch "topic" --sources web,arxiv
/webresearch "topic" --max 30
/webresearch "topic" --since 2024
/webresearch "topic" --no-viz
/webresearch add <url>
/webresearch query "<question>"
```

## What You Must Do When Invoked

If no topic was given, ask the user: "What topic would you like me to research?"

Follow these steps in order. Do not skip steps.

### Step 1 — Ensure webresearch is installed

```bash
PYTHON=""
WR_BIN=$(which webresearch 2>/dev/null)
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

### Step 2 — Search

```bash
$(cat research-out/.webresearch_python) -c "
import json; from pathlib import Path; from webresearch.search import search
results = search('TOPIC', max_results=MAX_RESULTS, sources=SOURCES, since=SINCE)
Path('research-out/.wr_search.json').write_text(json.dumps([r.__dict__ for r in results], indent=2))
print(f'Found {len(results)} URLs')
"
```

### Step 3 — Fetch pages

```bash
$(cat research-out/.webresearch_python) -c "
import json; from pathlib import Path
from webresearch.search import SearchResult; from webresearch.fetch import fetch_pages
results = [SearchResult(**r) for r in json.loads(Path('research-out/.wr_search.json').read_text())]
pages = fetch_pages(results)
Path('research-out/.wr_pages.json').write_text(json.dumps([p.__dict__ for p in pages], indent=2))
print(f'Fetched {len(pages)} pages')
"
```

### Step 4 — Extract facts (parallel subagents)

Split pages into batches of 5. Dispatch ALL subagents in one message.

Subagent prompt:
```
Extract facts from these pages. Output ONLY valid JSON:
[{"url":"...","title":"...","facts":[{"claim":"...","confidence":"DIRECT|INFERRED|AMBIGUOUS","quote":null}],"entities":["..."],"claims":[],"input_tokens":0,"output_tokens":0}]
Pages: PAGE_LIST
```

Each subagent writes its chunk: `Path('research-out/.wr_chunk_NNN.json').write_text(json.dumps(result, indent=2))`

Merge:
```bash
$(cat research-out/.webresearch_python) -c "
import json, glob; from pathlib import Path
all_ex = []
for c in sorted(glob.glob('research-out/.wr_chunk_*.json')):
    d = json.loads(Path(c).read_text())
    all_ex.extend(d if isinstance(d, list) else [d])
Path('research-out/.wr_extractions.json').write_text(json.dumps(all_ex, indent=2))
print(f'Merged → {len(all_ex)} extractions')
"
```

### Step 5 — Synthesize and report

```bash
$(cat research-out/.webresearch_python) -c "
import json; from pathlib import Path
from webresearch.extract import Extraction; from webresearch.synthesize import synthesize
from webresearch.report import generate; from webresearch.export import to_json, to_html
extractions = [Extraction(**e) for e in json.loads(Path('research-out/.wr_extractions.json').read_text())]
synthesis = synthesize(extractions)
Path('research-out/RESEARCH_REPORT.md').write_text(generate('TOPIC', extractions, synthesis, 0, 0))
to_json('TOPIC', extractions, synthesis); to_html('TOPIC', extractions, synthesis)
print(f'Done — {len(synthesis.findings)} findings')
"
rm -f research-out/.wr_search.json research-out/.wr_pages.json research-out/.wr_extractions.json research-out/.wr_chunk_*.json
```

### Step 6 — Report to user

Paste Key Findings + Contradictions + Suggested Questions from RESEARCH_REPORT.md.

## Honesty Rules
- Never invent facts. Mark uncertain items AMBIGUOUS.
- Never hide contradictions.
