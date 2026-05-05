from __future__ import annotations
import json
from pathlib import Path
from .extract import Extraction
from .synthesize import SynthesisResult


def to_json(
    query: str,
    extractions: list[Extraction],
    synthesis: SynthesisResult,
    out_path: str = "research-out/sources.json",
) -> None:
    data = {
        "query": query,
        "sources": [e.__dict__ for e in extractions],
        "findings": synthesis.findings,
        "contradictions": synthesis.contradictions,
        "consensus": synthesis.consensus,
        "key_entities": synthesis.key_entities,
        "source_scores": synthesis.source_scores,
    }
    Path(out_path).parent.mkdir(parents=True, exist_ok=True)
    Path(out_path).write_text(json.dumps(data, indent=2))


def to_html(
    query: str,
    extractions: list[Extraction],
    synthesis: SynthesisResult,
    out_path: str = "research-out/report.html",
) -> None:
    nodes = []
    links = []

    query_id = "query_node"
    nodes.append({"id": query_id, "label": query, "type": "query", "size": 20})

    entity_ids: dict[str, str] = {}
    for i, entity in enumerate(synthesis.key_entities[:15]):
        eid = f"entity_{i}"
        entity_ids[entity] = eid
        nodes.append({"id": eid, "label": entity, "type": "entity", "size": 8})
        links.append({"source": query_id, "target": eid, "value": 1})

    for i, ext in enumerate(extractions[:20]):
        sid = f"source_{i}"
        score = synthesis.source_scores.get(ext.url, 0.5)
        nodes.append({"id": sid, "label": (ext.title or ext.url)[:40], "type": "source",
                       "url": ext.url, "size": int(score * 10) + 4})
        links.append({"source": query_id, "target": sid, "value": 2})
        for entity in ext.entities[:5]:
            if entity in entity_ids:
                links.append({"source": sid, "target": entity_ids[entity], "value": 1})

    graph_data = json.dumps({"nodes": nodes, "links": links})

    html = f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Research: {query}</title>
<style>
  body {{ margin: 0; font-family: sans-serif; background: #0f1117; color: #e0e0e0; }}
  #title {{ padding: 16px 24px; font-size: 18px; font-weight: bold; background: #1a1d27; border-bottom: 1px solid #2a2d3a; }}
  #graph {{ width: 100vw; height: calc(100vh - 56px); }}
  .node-query {{ fill: #7c3aed; }}
  .node-source {{ fill: #2563eb; }}
  .node-entity {{ fill: #059669; }}
  .tooltip {{ position: absolute; background: #1a1d27; border: 1px solid #3a3d4a; padding: 8px 12px;
               border-radius: 6px; font-size: 12px; pointer-events: none; max-width: 280px; }}
  .legend {{ position: absolute; bottom: 20px; left: 20px; background: #1a1d27cc;
             padding: 10px 16px; border-radius: 8px; font-size: 12px; }}
  .legend-dot {{ display: inline-block; width: 10px; height: 10px; border-radius: 50%; margin-right: 6px; }}
</style>
</head>
<body>
<div id="title">Research Graph — {query}</div>
<svg id="graph"></svg>
<div class="legend">
  <span class="legend-dot" style="background:#7c3aed"></span>Query&nbsp;&nbsp;
  <span class="legend-dot" style="background:#2563eb"></span>Source&nbsp;&nbsp;
  <span class="legend-dot" style="background:#059669"></span>Entity
</div>
<div class="tooltip" id="tooltip" style="display:none"></div>
<script src="https://d3js.org/d3.v7.min.js"></script>
<script>
const data = {graph_data};
const svg = d3.select("#graph");
const width = window.innerWidth, height = window.innerHeight - 56;
svg.attr("width", width).attr("height", height);

const sim = d3.forceSimulation(data.nodes)
  .force("link", d3.forceLink(data.links).id(d => d.id).distance(120))
  .force("charge", d3.forceManyBody().strength(-300))
  .force("center", d3.forceCenter(width / 2, height / 2));

const link = svg.append("g").selectAll("line")
  .data(data.links).join("line")
  .attr("stroke", "#3a3d4a").attr("stroke-width", 1.5).attr("stroke-opacity", 0.6);

const node = svg.append("g").selectAll("circle")
  .data(data.nodes).join("circle")
  .attr("r", d => d.size || 8)
  .attr("class", d => "node-" + d.type)
  .attr("stroke", "#fff").attr("stroke-width", 0.5)
  .call(d3.drag()
    .on("start", (e, d) => {{ if (!e.active) sim.alphaTarget(0.3).restart(); d.fx=d.x; d.fy=d.y; }})
    .on("drag",  (e, d) => {{ d.fx=e.x; d.fy=e.y; }})
    .on("end",   (e, d) => {{ if (!e.active) sim.alphaTarget(0); d.fx=null; d.fy=null; }}))
  .on("mouseover", (e, d) => {{
    const tip = document.getElementById("tooltip");
    tip.style.display = "block";
    tip.style.left = (e.pageX + 12) + "px";
    tip.style.top  = (e.pageY - 20) + "px";
    tip.innerHTML = `<b>${{d.label}}</b><br><span style="color:#888">${{d.type}}</span>` +
      (d.url ? `<br><a href="${{d.url}}" target="_blank" style="color:#60a5fa;font-size:11px">open ↗</a>` : "");
  }})
  .on("mouseout", () => {{ document.getElementById("tooltip").style.display="none"; }})
  .on("click", (e, d) => {{ if (d.url) window.open(d.url, "_blank"); }});

const label = svg.append("g").selectAll("text")
  .data(data.nodes).join("text")
  .text(d => d.label)
  .attr("font-size", 11).attr("fill", "#ccc").attr("dx", d => (d.size||8) + 4).attr("dy", 4);

sim.on("tick", () => {{
  link.attr("x1", d => d.source.x).attr("y1", d => d.source.y)
      .attr("x2", d => d.target.x).attr("y2", d => d.target.y);
  node.attr("cx", d => d.x).attr("cy", d => d.y);
  label.attr("x", d => d.x).attr("y", d => d.y);
}});
</script>
</body>
</html>"""

    Path(out_path).parent.mkdir(parents=True, exist_ok=True)
    Path(out_path).write_text(html)
