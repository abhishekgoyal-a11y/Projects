# =========================================================
# FRONTEND.PY
# PREMIUM AI BLOG WRITER UI
# =========================================================

from __future__ import annotations

import os
import re

from datetime import (
    date,
    datetime,
)

import markdown

import streamlit as st
import streamlit.components.v1 as components

from workflow.blog_workflow import app


# =========================================================
# PAGE CONFIG
# =========================================================
st.set_page_config(
    page_title="AI Blog Writer",
    layout="wide",
    initial_sidebar_state="expanded",
)


# =========================================================
# SESSION STATE
# =========================================================
if "blog_history" not in st.session_state:

    st.session_state.blog_history = []

if "current_blog_index" not in st.session_state:

    st.session_state.current_blog_index = None


# =========================================================
# THEME COLORS
# =========================================================
BG = "#020617"

SIDEBAR = "#0f172a"

TEXT = "#f8fafc"

SECONDARY = "#94a3b8"

CARD = "#111827"

BORDER = "rgba(255,255,255,0.08)"


# =========================================================
# GLOBAL CSS
# =========================================================
st.markdown(
    f"""
<style>

/* =========================================================
GLOBAL
========================================================= */

html, body, [class*="css"] {{
    font-family: Inter, sans-serif;
}}

body {{
    background:{BG};
    color:{TEXT};
}}

.main .block-container {{
    padding-top:1rem;
    padding-left:2rem;
    padding-right:2rem;
    padding-bottom:2rem;
    max-width:100%;
}}

/* =========================================================
SIDEBAR
========================================================= */

section[data-testid="stSidebar"] {{
    background:{SIDEBAR};
    border-right:1px solid {BORDER};
}}

section[data-testid="stSidebar"] * {{
    color:{TEXT} !important;
}}

.sidebar-title {{
    font-size:34px;
    font-weight:800;
    margin-bottom:30px;
}}

/* =========================================================
INPUTS
========================================================= */

.stTextArea textarea {{
    background:{BG} !important;
    color:{TEXT} !important;
    border-radius:16px !important;
    border:1px solid {BORDER} !important;
    font-size:18px !important;
}}

.stSelectbox div[data-baseweb="select"] {{
    background:{BG} !important;
    border-radius:16px !important;
}}

.stDateInput input {{
    background:{BG} !important;
    color:{TEXT} !important;
    border-radius:16px !important;
}}

/* =========================================================
BUTTONS
========================================================= */

.stButton button {{
    width:100%;
    background:#ff4b4b !important;
    color:white !important;
    border:none !important;
    border-radius:16px !important;
    padding:14px 20px !important;
    font-size:18px !important;
    font-weight:700 !important;
}}

/* =========================================================
RADIO
========================================================= */

.stRadio label {{
    font-size:16px !important;
}}

/* =========================================================
EXPANDERS
========================================================= */

.streamlit-expanderHeader {{
    font-size:18px !important;
    font-weight:700 !important;
}}

</style>
""",
    unsafe_allow_html=True,
)


# =========================================================
# HELPERS
# =========================================================
def safe_slug(text: str):

    text = text.lower()

    text = re.sub(
        r"[^a-z0-9\s-]",
        "",
        text
    )

    text = re.sub(
        r"\s+",
        "-",
        text
    )

    return text


def extract_headings(markdown_text):

    return re.findall(
        r"^##\s+(.*)",
        markdown_text,
        re.MULTILINE
    )


# =========================================================
# SIDEBAR
# =========================================================
with st.sidebar:

    st.markdown(
        '<div class="sidebar-title">Generate Blog</div>',
        unsafe_allow_html=True
    )

    topic = st.text_area(
        "Topic",
        placeholder="Enter topic...",
        height=120,
    )

    tone = st.selectbox(
        "Writing Tone",
        [
            "Professional",
            "Academic",
            "Technical",
            "Conversational",
            "Casual",
            "Storytelling",
            "Marketing",
            "SEO Optimized",
        ]
    )

    as_of = st.date_input(
        "As-of Date",
        value=date.today()
    )

    generate_btn = st.button(
        "Generate Blog"
    )

    st.markdown("<br>", unsafe_allow_html=True)

    st.markdown("---")

    st.markdown(
        "## Generated Blogs"
    )

    history = st.session_state.blog_history

    if history:

        labels = []

        for idx, item in enumerate(history):

            labels.append(
                f"{idx+1}. {item['title']}"
            )

        selected = st.radio(
            "",
            labels,
            index=len(labels)-1,
        )

        selected_index = labels.index(
            selected
        )

        if st.button(
            "Load Blog"
        ):

            st.session_state.current_blog_index = (
                selected_index
            )

            st.rerun()


# =========================================================
# GENERATE BLOG
# =========================================================
if generate_btn:

    with st.spinner(
        "Generating premium editorial blog..."
    ):

        result = app.invoke(
            {
                "topic": topic,
                "tone": tone,
                "as_of": str(as_of),
            }
        )

        final_blog = result.get(
            "final",
            ""
        )

        plan = result.get(
            "plan"
        )

        title = (
            plan.blog_title
            if plan
            else topic
        )

        # =====================================================
        # STORE IN SESSION
        # =====================================================
        st.session_state.blog_history.append(
            {
                "title": title,
                "final": final_blog,
                "plan": plan,
                "timestamp": str(
                    datetime.now()
                ),
                "raw_result": result,
            }
        )

        # =====================================================
        # SAVE BLOG TO generated_blogs/
        # =====================================================
        os.makedirs(
            "generated_blogs",
            exist_ok=True
        )

        safe_filename = re.sub(
            r"[^a-zA-Z0-9_-]",
            "_",
            title
        )

        blog_path = (
            f"generated_blogs/"
            f"{safe_filename}.md"
        )

        with open(
            blog_path,
            "w",
            encoding="utf-8"
        ) as f:

            f.write(final_blog)

        print(
            f"[Saved Blog] {blog_path}"
        )

        # =====================================================
        # LOAD CURRENT BLOG
        # =====================================================
        st.session_state.current_blog_index = (
            len(
                st.session_state.blog_history
            ) - 1
        )

        st.rerun()


# =========================================================
# CURRENT BLOG
# =========================================================
current_blog = None

if (
    st.session_state.blog_history
    and st.session_state.current_blog_index
    is not None
):

    current_blog = (
        st.session_state.blog_history[
            st.session_state.current_blog_index
        ]
    )


# =========================================================
# EMPTY STATE
# =========================================================
if not current_blog:

    col1, col2 = st.columns(
        [1.2, 2]
    )

    with col2:

        st.markdown(
            f"""
<div style="
padding-top:120px;
padding-bottom:120px;
">

<h1 style="
font-size:72px;
font-weight:800;
line-height:1.05;
margin-bottom:30px;
color:{TEXT};
">
AI Blog Writing Agent
</h1>

<p style="
font-size:28px;
line-height:1.8;
max-width:850px;
color:{SECONDARY};
">
Generate premium long-form editorial blogs
with advanced AI orchestration,
research,
humanized writing,
and modern publication-quality layouts.
</p>

</div>
""",
            unsafe_allow_html=True
        )

    st.stop()


# =========================================================
# BLOG DATA
# =========================================================
final_md = current_blog["final"]

title = current_blog["title"]

headings = extract_headings(
    final_md
)

word_count = len(
    final_md.split()
)

read_time = max(
    1,
    word_count // 220
)


# =========================================================
# ADD IDS TO HEADINGS
# =========================================================
for heading in headings:

    slug = safe_slug(heading)

    final_md = final_md.replace(
        f"## {heading}",
        f'<h2 id="{slug}">{heading}</h2>'
    )


# =========================================================
# MARKDOWN -> HTML
# =========================================================
article_html = markdown.markdown(
    final_md,
    extensions=[
        "tables",
        "fenced_code",
    ]
)


# =========================================================
# TOC
# =========================================================
toc_html = ""

for heading in headings:

    slug = safe_slug(heading)

    toc_html += f"""
<div
class="toc-item"
onclick="
document.getElementById('{slug}')
.scrollIntoView({{
behavior:'smooth'
}});
"
>
{heading}
</div>
"""


# =========================================================
# HTML PAGE
# =========================================================
full_html = f"""
<!DOCTYPE html>

<html>

<head>

<meta charset="UTF-8">

<style>

/* =========================================================
GLOBAL
========================================================= */

html {{
    scroll-behavior:smooth;
}}

body {{
    margin:0;
    background:{BG};
    color:{TEXT};
    font-family:Inter,sans-serif;
}}

/* =========================================================
LAYOUT
========================================================= */

.layout {{
    display:grid;
    grid-template-columns:260px minmax(700px, 900px);
    gap:80px;
    max-width:1400px;
    margin:auto;
    padding:60px 40px;
}}

/* =========================================================
TOC
========================================================= */

.toc {{
    position:sticky;
    top:40px;
    height:max-content;
}}

.toc-title {{
    font-size:14px;
    font-weight:800;
    letter-spacing:2px;
    margin-bottom:30px;
}}

.toc-item {{
    display:block;
    cursor:pointer;
    color:{SECONDARY};
    margin-bottom:22px;
    line-height:1.8;
    font-size:18px;
    transition:0.2s;
}}

.toc-item:hover {{
    color:{TEXT};
}}

/* =========================================================
ARTICLE
========================================================= */

.hero-title {{
    font-size:64px;
    line-height:1.05;
    font-weight:800;
    margin-bottom:30px;
    color:{TEXT};
}}

.hero-description {{
    font-size:28px;
    line-height:1.7;
    color:{SECONDARY};
    margin-bottom:30px;
}}

.meta {{
    font-size:18px;
    color:{SECONDARY};
    margin-bottom:70px;
}}

.article h1 {{
    font-size:64px;
}}

.article h2 {{
    font-size:48px;
    line-height:1.2;
    margin-top:90px;
    margin-bottom:30px;
    color:{TEXT};
}}

.article h3 {{
    font-size:32px;
    margin-top:50px;
    margin-bottom:20px;
}}

.article p {{
    font-size:22px;
    line-height:2;
    color:{TEXT};
    margin-bottom:34px;
}}

.article li {{
    font-size:20px;
    line-height:1.9;
}}

.article img {{
    width:100%;
    border-radius:20px;
    margin-top:40px;
    margin-bottom:40px;
}}

.article pre {{
    background:{CARD};
    padding:22px;
    border-radius:18px;
    overflow-x:auto;
}}

.article code {{
    font-size:16px;
}}

/* =========================================================
RESPONSIVE
========================================================= */

@media(max-width:1200px) {{

.layout {{
    grid-template-columns:1fr;
}}

.toc {{
    display:none;
}}

.hero-title {{
    font-size:48px;
}}

.article h2 {{
    font-size:38px;
}}

.article p {{
    font-size:20px;
}}

}}

</style>

</head>

<body>

<div class="layout">

<div class="toc">

<div class="toc-title">
CONTENTS
</div>

{toc_html}

</div>

<div class="article">

<div class="hero-title">
{title}
</div>

<div class="hero-description">
Learn about {title.lower()},
understand practical implications,
modern insights,
and real-world perspectives.
</div>

<div class="meta">
May 2026 • {read_time} min read
</div>

{article_html}

</div>

</div>

<script>

document.querySelectorAll(".toc-item")
.forEach(item => {{

    item.addEventListener(
        "click",
        function() {{

            const target = this.innerText
                .toLowerCase()
                .replace(/[^a-z0-9 ]/g, "")
                .replace(/\\s+/g, "-");

            const el =
                document.getElementById(target);

            if(el){{
                el.scrollIntoView({{
                    behavior:"smooth"
                }});
            }}

        }}
    );

}});

</script>

</body>

</html>
"""


# =========================================================
# RENDER BLOG
# =========================================================
estimated_height = max(
    1800,
    len(final_md) // 2
)

components.html(
    full_html,
    height=estimated_height,
    scrolling=True
)


# =========================================================
# ADVANCED FEATURES
# =========================================================
st.markdown("---")

with st.expander(
    "Execution Plan"
):

    st.json(
        current_blog["raw_result"].get(
            "plan",
            {}
        )
    )

with st.expander(
    "Research Evidence"
):

    st.write(
        current_blog["raw_result"].get(
            "evidence",
            []
        )
    )

with st.expander(
    "System Logs"
):

    st.json(
        {
            "sections_generated":
                len(headings),

            "word_count":
                word_count,

            "estimated_read_time":
                read_time,
        }
    )