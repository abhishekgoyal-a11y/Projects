import os
import re
from datetime import datetime
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import cm
from reportlab.lib import colors
from reportlab.platypus import (SimpleDocTemplate, Paragraph, Spacer, Table,
                                 TableStyle, HRFlowable, PageBreak, KeepTogether)
from reportlab.platypus.flowables import Flowable
from reportlab.lib.enums import TA_CENTER, TA_JUSTIFY  # noqa

REPORTS_DIR = "reports"
os.makedirs(REPORTS_DIR, exist_ok=True)

PAGE_W, PAGE_H = A4
L_MARGIN = 2 * cm
R_MARGIN = 2 * cm
CONTENT_W = PAGE_W - L_MARGIN - R_MARGIN

PRIMARY   = colors.HexColor("#1a73e8")
SECONDARY = colors.HexColor("#0d47a1")
DARK      = colors.HexColor("#1a1a2e")
CARD_BG   = colors.HexColor("#0d1b3e")
LIGHT_ROW = colors.HexColor("#f0f4ff")
MID_GREY  = colors.HexColor("#5f6368")
BORDER    = colors.HexColor("#dadce0")
WHITE     = colors.white


# ── Styles (created once) ───────────────────────────────────────
def _make_styles():
    base = getSampleStyleSheet()
    def ps(name, **kw):
        return ParagraphStyle(name, parent=base["Normal"], **kw)
    return {
        "h2":      ps("rh2",  fontSize=13, textColor=SECONDARY,
                       fontName="Helvetica-Bold", spaceBefore=10, spaceAfter=2),
        "body":    ps("rbody", fontSize=9.5, textColor=DARK, leading=15,
                       alignment=TA_JUSTIFY, spaceAfter=4),
        "bullet":  ps("rbul",  fontSize=9.5, textColor=DARK, leading=14,
                       leftIndent=14, firstLineIndent=-10, spaceAfter=3),
        "step":    ps("rstep", fontSize=9.5, textColor=DARK, leading=14,
                       leftIndent=18, firstLineIndent=-14, spaceAfter=4),
        "caption": ps("rcap",  fontSize=8,   textColor=MID_GREY,
                       alignment=TA_CENTER, spaceAfter=6),
        # table cell styles
        "th":      ps("rth",   fontSize=9,   textColor=WHITE,
                       fontName="Helvetica-Bold", leading=12),
        "td":      ps("rtd",   fontSize=8.5, textColor=DARK, leading=12),
    }


# ── Workflow diagram ────────────────────────────────────────────
class WorkflowDiagram(Flowable):
    BOX_H = 22
    GAP   = 14

    def __init__(self, steps: list):
        super().__init__()
        self.steps  = steps[:8]
        self.width  = CONTENT_W
        n           = len(self.steps)
        self.height = n * self.BOX_H + (n - 1) * self.GAP + 4

    def draw(self):
        c = self.canv
        y = self.height - self.BOX_H

        for i, step in enumerate(self.steps):
            fill = PRIMARY if i % 2 == 0 else SECONDARY
            c.setFillColor(fill)
            c.roundRect(0, y, self.width, self.BOX_H, 5, fill=1, stroke=0)

            c.setFillColor(WHITE)
            c.setFont("Helvetica-Bold", 8)
            label = f"Step {i + 1}:  {step}"
            if len(label) > 100:
                label = label[:97] + "..."
            c.drawString(10, y + self.BOX_H / 2 - 4, label)

            if i < len(self.steps) - 1:
                ax = self.width / 2
                bot = y
                c.setStrokeColor(MID_GREY)
                c.setFillColor(MID_GREY)
                c.setLineWidth(1)
                c.line(ax, bot, ax, bot - self.GAP + 5)
                p = c.beginPath()
                p.moveTo(ax - 4, bot - self.GAP + 7)
                p.lineTo(ax + 4, bot - self.GAP + 7)
                p.lineTo(ax,     bot - self.GAP + 1)
                p.close()
                c.drawPath(p, fill=1, stroke=0)

            y -= (self.BOX_H + self.GAP)


# ── Cover page ──────────────────────────────────────────────────
def _draw_cover(canv, task: str):
    # Full dark background
    canv.setFillColor(DARK)
    canv.rect(0, 0, PAGE_W, PAGE_H, fill=1, stroke=0)

    # Top bar
    canv.setFillColor(PRIMARY)
    canv.rect(0, PAGE_H - 1.4 * cm, PAGE_W, 1.4 * cm, fill=1, stroke=0)

    # Bottom bar
    canv.setFillColor(SECONDARY)
    canv.rect(0, 0, PAGE_W, 1.0 * cm, fill=1, stroke=0)

    # Centre card — fixed absolute coordinates
    card_x = 1.5 * cm
    card_w = PAGE_W - 3.0 * cm
    card_y = PAGE_H * 0.25
    card_h = PAGE_H * 0.50
    canv.setFillColor(CARD_BG)
    canv.roundRect(card_x, card_y, card_w, card_h, 10, fill=1, stroke=0)

    # Blue top accent line on card
    canv.setStrokeColor(PRIMARY)
    canv.setLineWidth(2.5)
    line_y = card_y + card_h - 1.0 * cm
    canv.line(card_x + 1 * cm, line_y, card_x + card_w - 1 * cm, line_y)

    # ── Title ── placed 1.8 cm below top of card
    title_y = card_y + card_h - 2.4 * cm
    canv.setFillColor(WHITE)
    canv.setFont("Helvetica-Bold", 28)
    canv.drawCentredString(PAGE_W / 2, title_y, "AI RESEARCH REPORT")

    # ── Divider ── 0.8 cm below title
    div_y = title_y - 0.9 * cm
    canv.setStrokeColor(PRIMARY)
    canv.setLineWidth(1.5)
    canv.line(PAGE_W / 2 - 4 * cm, div_y, PAGE_W / 2 + 4 * cm, div_y)

    # ── Task subtitle ── word-wrap, starting 0.7 cm below divider
    canv.setFillColor(colors.HexColor("#90caf9"))
    canv.setFont("Helvetica", 11)
    words, lines_out, cur = task.split(), [], ""
    for word in words:
        test = (cur + " " + word).strip()
        if len(test) <= 58:
            cur = test
        else:
            if cur:
                lines_out.append(cur)
            cur = word
    if cur:
        lines_out.append(cur)
    lines_out = lines_out[:4]

    sub_y = div_y - 0.9 * cm
    for ln in lines_out:
        canv.drawCentredString(PAGE_W / 2, sub_y, ln)
        sub_y -= 0.6 * cm

    # ── Date ── pinned 1.0 cm above bottom of card
    date_y = card_y + 1.0 * cm
    canv.setFillColor(colors.HexColor("#5c8fd6"))
    canv.setFont("Helvetica", 10)
    canv.drawCentredString(
        PAGE_W / 2, date_y,
        f"Generated on {datetime.now().strftime('%B %d, %Y  at  %H:%M')}"
    )

    # Footer label
    canv.setFillColor(colors.HexColor("#3a3a5c"))
    canv.setFont("Helvetica", 8)
    canv.drawCentredString(PAGE_W / 2, 0.3 * cm, "Powered by AI Task Execution Agent")


# ── Page callbacks ──────────────────────────────────────────────
def _make_page_cb(task: str, is_cover: bool = False):
    def cb(canv, doc):
        if is_cover:
            _draw_cover(canv, task)
            return
        # Header bar
        canv.setFillColor(PRIMARY)
        canv.rect(0, PAGE_H - 0.7 * cm, PAGE_W, 0.7 * cm, fill=1, stroke=0)
        canv.setFillColor(WHITE)
        canv.setFont("Helvetica-Bold", 7.5)
        canv.drawString(L_MARGIN, PAGE_H - 0.48 * cm, "AI RESEARCH REPORT")
        canv.setFont("Helvetica", 7.5)
        canv.drawRightString(PAGE_W - R_MARGIN, PAGE_H - 0.48 * cm,
                             datetime.now().strftime("%B %d, %Y"))
        # Footer
        canv.setStrokeColor(BORDER)
        canv.setLineWidth(0.5)
        canv.line(L_MARGIN, 1.4 * cm, PAGE_W - R_MARGIN, 1.4 * cm)
        canv.setFillColor(MID_GREY)
        canv.setFont("Helvetica", 7)
        short = task[:70] + ("..." if len(task) > 70 else "")
        canv.drawString(L_MARGIN, 0.8 * cm, short)
        canv.drawRightString(PAGE_W - R_MARGIN, 0.8 * cm, f"Page {doc.page}")
    return cb


# ── Helpers ─────────────────────────────────────────────────────
def _section_heading(story, text: str, st: dict):
    story.append(Spacer(1, 8))
    story.append(Paragraph(text.upper(), st["h2"]))
    story.append(HRFlowable(width="100%", thickness=1.5,
                             color=PRIMARY, spaceAfter=5))


def _clean(text: str) -> str:
    """Escape XML special chars then convert **bold** to <b>."""
    text = text.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")
    text = re.sub(r"\*\*(.+?)\*\*", r"<b>\1</b>", text)
    return text


# ── Table helpers ───────────────────────────────────────────────
def _col_widths(rows: list) -> list:
    """Proportional widths based on max content length per column."""
    n = len(rows[0])
    maxl = [0] * n
    for row in rows:
        for j, cell in enumerate(row[:n]):
            maxl[j] = max(maxl[j], len(str(cell)))
    total = sum(maxl) or 1
    min_w = 1.8 * cm
    spare = CONTENT_W - min_w * n
    if spare < 0:          # too many columns — equal split
        return [CONTENT_W / n] * n
    return [min_w + spare * (l / total) for l in maxl]


def _render_table(story, rows: list, st: dict):
    """Render a markdown table. Cells are Paragraph objects so they wrap."""
    if not rows or len(rows) < 2:
        return

    widths = _col_widths(rows)

    pdf_rows = []
    for r_idx, row in enumerate(rows):
        style = st["th"] if r_idx == 0 else st["td"]
        pdf_rows.append([
            Paragraph(_clean(str(cell)), style)
            for cell in row[:len(widths)]
        ])

    t = Table(pdf_rows, colWidths=widths, repeatRows=1,
              hAlign="LEFT", splitByRow=True)
    t.setStyle(TableStyle([
        ("BACKGROUND",    (0, 0), (-1, 0),  PRIMARY),
        ("ROWBACKGROUNDS",(0, 1), (-1, -1), [WHITE, LIGHT_ROW]),
        ("TOPPADDING",    (0, 0), (-1, -1), 6),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
        ("LEFTPADDING",   (0, 0), (-1, -1), 7),
        ("RIGHTPADDING",  (0, 0), (-1, -1), 7),
        ("GRID",          (0, 0), (-1, -1), 0.4, BORDER),
        ("BOX",           (0, 0), (-1, -1), 1.2, PRIMARY),
        ("VALIGN",        (0, 0), (-1, -1), "TOP"),
    ]))
    story.append(KeepTogether([t, Spacer(1, 10)]))


# ── Markdown table extractor ────────────────────────────────────
def _extract_tables(text: str) -> list:
    tables, current = [], []
    for line in text.split("\n"):
        s = line.strip()
        if re.match(r"^\|.+\|$", s):
            if re.match(r"^\|[-| :]+\|$", s):
                continue
            cells = [c.strip() for c in s.strip("|").split("|")]
            current.append(cells)
        else:
            if len(current) >= 2:
                tables.append(current)
            current = []
    if len(current) >= 2:
        tables.append(current)
    return tables


# ── Summary parser ──────────────────────────────────────────────
def _parse_summary(story, summary: str, steps: list, st: dict):
    tables   = _extract_tables(summary)
    t_idx    = 0
    in_table = False
    numbered = re.compile(r"^(\d+)\.\s+(.+)")

    for line in summary.split("\n"):
        raw = line.strip()

        if not raw:
            in_table = False
            story.append(Spacer(1, 4))
            continue

        if raw.startswith("### ") or raw.startswith("## "):
            heading = re.sub(r"\*\*(.+?)\*\*", r"\1", raw.lstrip("#").strip())
            _section_heading(story, heading, st)
            in_table = False
            continue

        if re.match(r"^\|.+\|$", raw):
            if not in_table and t_idx < len(tables):
                _render_table(story, tables[t_idx], st)
                t_idx += 1
                in_table = True
            continue
        else:
            in_table = False

        m = numbered.match(raw)
        if m:
            story.append(Paragraph(
                f"<b>{m.group(1)}.</b>  {_clean(m.group(2))}", st["step"]))
            continue

        if raw.startswith("- ") or raw.startswith("* "):
            story.append(Paragraph(f"&#8226;  {_clean(raw[2:])}", st["bullet"]))
            continue

        story.append(Paragraph(_clean(raw), st["body"]))

    # Workflow diagram
    if steps:
        _section_heading(story, "Execution Workflow Diagram", st)
        story.append(Paragraph(
            "The diagram below illustrates the step-by-step execution flow for this task.",
            st["body"]))
        story.append(Spacer(1, 8))
        diag = WorkflowDiagram(steps)
        story.append(KeepTogether([
            diag,
            Spacer(1, 6),
            Paragraph("Figure 1: Task Execution Workflow", st["caption"]),
        ]))


# ── Entry point ─────────────────────────────────────────────────
def generate_report(task: str, steps: list, summary: str) -> str:
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    filename  = f"{REPORTS_DIR}/report_{timestamp}.pdf"

    doc = SimpleDocTemplate(
        filename, pagesize=A4,
        leftMargin=L_MARGIN, rightMargin=R_MARGIN,
        topMargin=1.4 * cm,   # header bar is 0.7 cm; 1.4 cm gives clear gap
        bottomMargin=2.2 * cm,
    )

    st    = _make_styles()
    story = []

    # Page 1 = cover (pure canvas, no flowables)
    story.append(PageBreak())

    # Execution plan
    _section_heading(story, "Execution Plan", st)
    for i, s in enumerate(steps, 1):
        story.append(Paragraph(f"<b>{i}.</b>  {_clean(s)}", st["step"]))
    story.append(Spacer(1, 10))

    _parse_summary(story, summary, steps, st)

    doc.build(
        story,
        onFirstPage=_make_page_cb(task, is_cover=True),
        onLaterPages=_make_page_cb(task, is_cover=False),
    )
    return filename
