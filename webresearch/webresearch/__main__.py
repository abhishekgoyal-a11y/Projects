from __future__ import annotations
import sys
from pathlib import Path


def _usage() -> None:
    print("""webresearch — research any topic from multiple web sources

Usage:
  webresearch install                      register skill in Claude Code
  webresearch uninstall                    remove skill from Claude Code

  webresearch "topic"                      full research pipeline
  webresearch "topic" --sources web,arxiv  choose sources (default: web)
  webresearch "topic" --max 30             max results per source (default: 20)
  webresearch "topic" --since 2024         filter results by year
  webresearch "topic" --no-viz             skip HTML visualization
  webresearch "topic" --update             re-fetch only changed sources

  webresearch add <url>                    add a specific URL to research-out/
  webresearch query "<question>"           query existing sources.json
""")


def _run_research(query: str, args: list[str]) -> None:
    from .search import search
    from .fetch import fetch_pages
    from .extract import Extraction, load_extractions
    from .synthesize import synthesize
    from .report import generate
    from .export import to_json, to_html

    sources = ["web"]
    max_results = 20
    since = None
    no_viz = False

    i = 0
    while i < len(args):
        if args[i] == "--sources" and i + 1 < len(args):
            sources = args[i + 1].split(",")
            i += 2
        elif args[i] == "--max" and i + 1 < len(args):
            max_results = int(args[i + 1])
            i += 2
        elif args[i] == "--since" and i + 1 < len(args):
            since = int(args[i + 1])
            i += 2
        elif args[i] == "--no-viz":
            no_viz = True
            i += 1
        else:
            i += 1

    Path("research-out").mkdir(exist_ok=True)

    print(f"\nResearching: {query!r}")
    print(f"Sources: {sources} · max: {max_results}" + (f" · since: {since}" if since else ""))

    print("\nStep 1/3  Searching...")
    results = search(query, max_results=max_results, sources=sources, since=since)
    print(f"  Found {len(results)} URLs")

    if not results:
        print("No results found. Try different search terms.")
        sys.exit(1)

    # Save search results for skill to use
    import json
    Path("research-out/.wr_search.json").write_text(json.dumps([r.__dict__ for r in results], indent=2))

    print("\nStep 2/3  Fetching pages...")
    pages = fetch_pages(results)
    print(f"  Fetched {len(pages)} pages")
    Path("research-out/.wr_pages.json").write_text(json.dumps([p.__dict__ for p in pages], indent=2))

    print("\nStep 3/3  Note: Fact extraction is done by Claude Code (via /webresearch skill).")
    print("          If running headlessly, load chunk files from research-out/.wr_chunk_*.json")

    # If chunk files exist (written by Claude subagents), synthesize them
    extractions = load_extractions("research-out")
    if not extractions:
        print("\nNo extraction chunks found yet.")
        print("Run /webresearch in Claude Code to let Claude extract facts from the fetched pages.")
        return

    synthesis = synthesize(extractions)
    report_md = generate(query, extractions, synthesis, 0, 0)
    Path("research-out/RESEARCH_REPORT.md").write_text(report_md)

    to_json(query, extractions, synthesis)
    if not no_viz:
        to_html(query, extractions, synthesis)

    print(f"\nDone! Outputs in research-out/")
    print(f"  RESEARCH_REPORT.md  — key findings & citations")
    print(f"  sources.json        — raw data (queryable)")
    if not no_viz:
        print(f"  report.html         — open in browser")

    print("\n--- Key Findings ---")
    for f in synthesis.findings[:5]:
        print(f"• {f['claim']} [{f.get('confidence','?')}]")
    if synthesis.contradictions:
        print(f"\n⚠ {len(synthesis.contradictions)} contradiction(s) found — see RESEARCH_REPORT.md")


def _run_add(url: str) -> None:
    import httpx, html2text
    from .cache import save_cached_page
    from datetime import datetime, timezone
    print(f"Fetching {url} ...")
    try:
        resp = httpx.get(url, follow_redirects=True, timeout=15,
                         headers={"User-Agent": "webresearch/0.1"})
        h = html2text.HTML2Text()
        h.ignore_links = False
        h.ignore_images = True
        content = h.handle(resp.text)
        save_cached_page(url, {
            "url": url, "title": url, "content_markdown": content[:50_000],
            "fetched_at": datetime.now(timezone.utc).isoformat(), "source": "manual",
        })
        print(f"Saved to cache. Run: webresearch --update to merge into research-out/")
    except Exception as e:
        print(f"Error: {e}", file=sys.stderr)
        sys.exit(1)


def _run_query(question: str) -> None:
    import json
    sources_path = Path("research-out/sources.json")
    if not sources_path.exists():
        print("No research-out/sources.json found. Run a research first.", file=sys.stderr)
        sys.exit(1)
    data = json.loads(sources_path.read_text())
    question_lower = question.lower()
    print(f"\nSearching existing research for: {question!r}\n")
    hits = []
    for finding in data.get("findings", []):
        claim = finding.get("claim", "")
        if any(word in claim.lower() for word in question_lower.split()):
            hits.append(finding)
    if hits:
        for h in hits[:10]:
            print(f"• {h['claim']} [{h.get('confidence','?')}]")
            print(f"  — {h.get('source_title', h.get('source_url',''))[:60]}")
    else:
        print("No matching findings. Try rephrasing or run a new research.")


def main() -> None:
    args = sys.argv[1:]

    if not args or args[0] in ("-h", "--help"):
        _usage()
        return

    cmd = args[0]

    if cmd == "install":
        from .install import install
        install()
    elif cmd == "uninstall":
        from .install import uninstall
        uninstall()
    elif cmd == "add" and len(args) >= 2:
        _run_add(args[1])
    elif cmd == "query" and len(args) >= 2:
        _run_query(args[1])
    else:
        _run_research(cmd, args[1:])


if __name__ == "__main__":
    main()
