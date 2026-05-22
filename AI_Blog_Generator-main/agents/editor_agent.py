import re
from langchain_core.messages import (
    SystemMessage,
    HumanMessage,
)

from prompts.editor_prompt import (
    EDITOR_SYSTEM
)

from utils.config import (
    llm,
)

# ---------------------------------------------------
# FINAL SANITIZER
# ---------------------------------------------------
def sanitize_output(
    text: str
) -> str:

    if not text:
        return ""

    text = (
        text
        .replace("```markdown", "")
        .replace("```", "")
        .strip()
    )

    banned_patterns = [

        r"changes made:?",
        r"improved readability.*",
        r"enhanced transitions.*",
        r"improved flow.*",
        r"improved human feel.*",
        r"preserved markdown.*",
        r"maintained depth.*",
        r"seo-style blogs.*",
        r"here'?s the revised version.*",
        r"below is the revised article.*",
        r"i made the following changes.*",
        r"editor notes.*",
        r"rewritten article.*",
        r"optimization changes.*",

    ]

    cleaned_lines = []

    started = False

    for line in text.split("\n"):

        clean = line.strip()

        lower = clean.lower()

        skip = False

        for pattern in banned_patterns:

            if re.search(
                pattern,
                lower
            ):
                skip = True
                break

        if skip:
            continue

        if not started:

            if clean.startswith("#"):
                started = True
                cleaned_lines.append(line)

            continue

        cleaned_lines.append(line)

    cleaned = "\n".join(
        cleaned_lines
    ).strip()

    return cleaned

def editor_node(state) -> dict:
    """
    Intelligent blog editor.

    Responsibilities:
    - improve human feel
    - smooth transitions
    - improve readability
    - preserve article depth
    - prevent truncation
    - maintain markdown structure

    IMPORTANT:
    Never aggressively rewrite long blogs.
    """

    merged_markdown = state.get(
        "merged_md",
        ""
    )

    # ---------------------------------------------------
    # Empty Fallback
    # ---------------------------------------------------
    if not merged_markdown.strip():

        return {
            "final":
                "Blog generation failed."
        }

    # ---------------------------------------------------
    # IMPORTANT:
    # Skip editing for extremely large blogs
    # to prevent truncation.
    # ---------------------------------------------------
    if len(merged_markdown) > 18000:

        return {
            "final":
                merged_markdown
        }

    # ---------------------------------------------------
    # Medium Blog Handling
    # ---------------------------------------------------
    try:

        # ---------------------------------------------------
        # Safer editor token budget
        # ---------------------------------------------------
        editor_llm = llm.bind(
            max_tokens=2500,
            temperature=0.4,
        )
        merged_markdown = sanitize_output(merged_markdown)
        response = editor_llm.invoke(
            [
                SystemMessage(
                    content=EDITOR_SYSTEM
                ),

                HumanMessage(
                    content=(
                        f"TOPIC:\n"
                        f"{state['topic']}\n\n"

                        f"TONE:\n"
                        f"{state['tone']}\n\n"

                        f"""
IMPORTANT:

This is already a completed blog.

Your task is ONLY to:
- normalize markdown formatting
- improve markdown hierarchy
- improve spacing
- improve paragraph readability
- reduce repetitive sentence openings
- preserve article structure
- preserve article meaning

DO NOT:
- explain edits
- mention improvements
- summarize changes
- output commentary
- output editor notes
- rewrite the article
- shorten the article heavily
- describe formatting changes

Preserve:
- ALL headings
- ALL markdown
- ALL sections
- ALL explanations
- ALL article flow

CRITICAL OUTPUT RULES:
- Output ONLY final markdown
- Each section should have 1-2 paragraphs max
- Do not use bullet points in blogs
- NEVER say "Changes made"
- NEVER explain improvements
- NEVER output bullet summaries
- NEVER output editor commentary
- NEVER describe modifications
- NEVER behave like an editor

BLOG MARKDOWN:

{merged_markdown}
"""
                    )
                ),
            ]
        )

        final_markdown = sanitize_output(response.content)

        # ---------------------------------------------------
        # Truncation Protection
        # ---------------------------------------------------
        original_length = len(
            merged_markdown
        )

        edited_length = len(
            final_markdown
        )

        # If editor shrinks content too much,
        # editor likely truncated output.
        if (
            edited_length
            < original_length * 0.75
        ):

            final_markdown = (
                merged_markdown
            )

        # ---------------------------------------------------
        # Empty Protection
        # ---------------------------------------------------
        if not final_markdown.strip():

            final_markdown = (
                merged_markdown
            )

    except Exception as e:

        print(
            f"[Editor Error] {e}"
        )

        # ---------------------------------------------------
        # Safe fallback
        # ---------------------------------------------------
        final_markdown = (
            merged_markdown
        )

    # ---------------------------------------------------
    # Final Cleanup
    # ---------------------------------------------------
    final_markdown = sanitize_output(
    final_markdown
    )

    return {
        "final":
            final_markdown
    }