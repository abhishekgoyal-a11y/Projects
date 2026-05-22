import re

from langchain_core.messages import (
    SystemMessage,
    HumanMessage,
)

from prompts.writer_prompt import (
    WRITER_SYSTEM
)

from utils.config import (
    writer_llm,
)


# ---------------------------------------------------
# FINAL OUTPUT SANITIZER
# ---------------------------------------------------
def sanitize_output(
    text: str
) -> str:

    if not text:
        return ""

    # ---------------------------------------------------
    # Remove markdown code fences
    # ---------------------------------------------------
    text = (
        text
        .replace("```markdown", "")
        .replace("```", "")
        .strip()
    )

    # ---------------------------------------------------
    # Hard banned phrases
    # ---------------------------------------------------
    banned_patterns = [

        r"changes made:?",
        r"improved readability.*",
        r"enhanced transitions.*",
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

    lines = text.split("\n")

    cleaned_lines = []

    started = False

    for line in lines:

        clean = line.strip()

        lower = clean.lower()

        # ---------------------------------------------------
        # Remove banned phrases
        # ---------------------------------------------------
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

        # ---------------------------------------------------
        # Start ONLY from real markdown heading
        # ---------------------------------------------------
        if not started:

            if clean.startswith("##"):
                started = True
                cleaned_lines.append(line)

            continue

        # ---------------------------------------------------
        # Remove stray bullets from meta leakage
        # ---------------------------------------------------
        if clean.startswith("-"):

            if any(
                bad in lower
                for bad in [
                    "improved",
                    "enhanced",
                    "preserved",
                    "maintained",
                ]
            ):
                continue

        cleaned_lines.append(line)

    text = "\n".join(
        cleaned_lines
    ).strip()

    # ---------------------------------------------------
    # Emergency fallback
    # ---------------------------------------------------
    if not text.startswith("##"):

        return ""

    return text


def writer_node(state) -> dict:
    """
    Advanced tone-aware blog writer.
    """

    plan = state["plan"]

    evidence = state.get(
        "evidence",
        []
    )

    sections = []

    # ---------------------------------------------------
    # Running Context Memory
    # ---------------------------------------------------
    running_context = ""

    # ---------------------------------------------------
    # Opening Diversity Memory
    # ---------------------------------------------------
    used_openings = []

    # ---------------------------------------------------
    # Tone Handling
    # ---------------------------------------------------
    tone = (
        plan.tone.lower()
        if hasattr(plan, "tone")
        else "professional"
    )

    # ---------------------------------------------------
    # Tone Style Engines
    # ---------------------------------------------------
    technical_tones = [
        "technical",
        "professional",
        "academic",
    ]

    marketing_tones = [
        "marketing",
        "seo",
        "business",
    ]

    storytelling_tones = [
        "storytelling",
    ]

    casual_tones = [
        "casual",
        "informal",
        "conversational",
    ]

    # ---------------------------------------------------
    # Sequential Writing
    # ---------------------------------------------------
    for index, task in enumerate(plan.tasks):

        # ---------------------------------------------------
        # Concepts Formatting
        # ---------------------------------------------------
        bullets_text = "\n".join(
            f"- {bullet}"
            for bullet in task.bullets
        )

        # ---------------------------------------------------
        # Compact Evidence
        # ---------------------------------------------------
        compact_evidence = []

        for item in evidence[:3]:

            if not isinstance(item, dict):
                continue

            compact_evidence.append(
                (
                    f"- {item.get('title', '')}\n"
                    f"  {item.get('snippet', '')[:140]}"
                )
            )

        evidence_text = "\n".join(
            compact_evidence
        )

        # ---------------------------------------------------
        # Opening Diversity
        # ---------------------------------------------------
        recent_openings = "\n".join(
            used_openings[-8:]
        )

        # ---------------------------------------------------
        # Previous Context
        # ---------------------------------------------------
        previous_context = ""

        if running_context.strip():

            previous_context = (
                "Previously Written Content:\n\n"
                + running_context[-5000:]
            )

        # ---------------------------------------------------
        # Dynamic Style Rules
        # ---------------------------------------------------
        if tone in technical_tones:

            style_rules = """
STYLE REFERENCE:
Write like DataCamp or professional Medium technical blogs.

WRITING STYLE:
- Prioritize clarity and structure
- Explain concepts directly
- Use concise educational writing
- Use practical examples frequently
- Sound professional and knowledgeable
- Avoid emotional storytelling
- Avoid dramatic hooks
- Avoid philosophical writing
- Avoid reflective monologues
- Prefer educational depth over narrative immersion

HEADINGS:
- Use direct professional headings
- Make headings descriptive and practical

FORMATTING:
- Use short readable paragraphs
- Use occasional bullet points only when useful
- Keep content highly scannable
- Use clean markdown hierarchy

SECTIONS:
- Every section MUST contain at least 2 substantial paragraphs
- Important sections may contain 3 paragraphs
- Never end a section after a single paragraph
- Sections should feel rich, developed, and visually substantial

PARAGRAPH STRUCTURE RULES:
- Each paragraph should contain:
  - 4-7 sentences on average

- Use paragraph variety naturally
- Some paragraphs can be shorter for readability
- Important explanations should be longer

SECTION DEPTH:
- Most sections should be between 300-600 words
- Important sections may be longer
- Avoid shallow summaries
- Avoid rushed explanations
- Expand concepts naturally before moving forward

FLOW RULES:
- First paragraph:
  introduce the concept clearly

- Second paragraph:
  deepen the discussion with explanations, examples, or insights

- Third paragraph (when relevant):
  discuss implications, practical applications, workflows, or broader observations

WRITING STYLE:
- Write like a professional long-form blog author
- Maintain depth without sounding repetitive
- Develop ideas progressively across paragraphs
- Avoid compressed AI-summary style writing

EXAMPLES:
- Prefer practical real-world examples
- Mention tools, workflows, systems, or use-cases naturally
- Use observations and implications to enrich sections
"""

        elif tone in marketing_tones:

            style_rules = """
STYLE REFERENCE:
Write like Hostinger marketing blogs.

WRITING STYLE:
- SEO-friendly
- Engaging but professional
- Reader-focused
- Action-oriented
- Practical and tactical
- Use actionable advice
- Maintain high readability

HEADINGS:
- Use benefit-oriented headings
- Make headings clickable but professional

FORMATTING:
- Highly scannable
- Use numbered lists occasionally
- Use bullet points sparingly
- Optimize readability
"""

        elif tone in storytelling_tones:

            style_rules = """
STYLE REFERENCE:
Write like Acumen storytelling blogs.

WRITING STYLE:
- Human-centered narrative
- Emotional but grounded
- Character-driven
- Reflective but controlled
- Immersive without becoming dramatic

HEADINGS:
- Narrative-oriented
- Emotionally meaningful

PARAGRAPHS:
- Varied rhythm
- Natural pacing
- Human storytelling flow
"""

        elif tone in casual_tones:

            style_rules = """
STYLE REFERENCE:
Write like Pepper Content casual blogs.

WRITING STYLE:
- Conversational
- Relaxed
- Simple language
- Approachable
- Friendly and engaging

HEADINGS:
- Curiosity-driven
- Natural internet-blog style

PARAGRAPHS:
- Short
- Highly skimmable
- Fast readable pacing
"""

        else:

            style_rules = """
WRITING STYLE:
Write like a modern professional blog.
"""

        # ---------------------------------------------------
        # Generate Section
        # ---------------------------------------------------
        try:

            response = writer_llm.invoke(
                [
                    SystemMessage(
                        content=WRITER_SYSTEM
                    ),

                    HumanMessage(
                        content=(
                            f"Blog Title:\n"
                            f"{plan.blog_title}\n\n"

                            f"Audience:\n"
                            f"{plan.audience}\n\n"

                            f"Tone:\n"
                            f"{plan.tone}\n\n"

                            f"Blog Type:\n"
                            f"{plan.blog_kind}\n\n"

                            f"{previous_context}\n\n"

                            f"Section Heading:\n"
                            f"## {task.title}\n\n"

                            f"Current Section Goal:\n"
                            f"{task.goal}\n\n"

                            f"Target Words:\n"
                            f"{task.target_words}\n\n"

                            f"Concepts To Naturally Cover:\n"
                            f"{bullets_text}\n\n"

                            f"Available Evidence:\n"
                            f"{evidence_text}\n\n"

                            f"{style_rules}\n\n"

                            f"""
IMPORTANT WRITING RULES:
- Avoid repetitive transitions
- Avoid repetitive paragraph openings
- Avoid robotic AI phrasing
- Avoid overexplaining obvious ideas
- Avoid bullet points
- Avoid generic filler content
- Avoid textbook-style transitions

OPENING VARIETY:
Recent openings already used:
{recent_openings}

DO NOT repeat similar openings.

FORBIDDEN AI OPENINGS:
NEVER repeatedly begin paragraphs with:
- So
- As we
- As we look
- As technology evolves
- In today's world
- Imagine
- For example
- For instance
- To understand
- It is important to
- In conclusion
- Furthermore
- Moreover
- On the other hand
- In addition
- Another important aspect
- One key factor
- This highlights
- This demonstrates
- This means
- This is because

VARIATION RULES:
- Every paragraph should begin differently
- Alternate between:
  - direct insight
  - short observation
  - fact
  - example
  - contrast
  - technical statement
  - rhetorical transition

- Avoid repeating sentence rhythm
- Avoid repetitive educational phrasing
- Avoid textbook-style explanation flow

DEPTH RULES:
- Do not conclude ideas too quickly
- Expand concepts naturally before moving to next heading
- Use layered explanation instead of short summaries
- Develop ideas across multiple paragraphs

LIST USAGE RULES:
- Never overuse bullet points
- Prefer narrative prose
- Most sections should contain zero lists
- Only use lists when readability improves significantly

QUOTE RULES:
- Occasionally include meaningful quotes
- Keep quotes relevant and natural
- Never overuse quotes

TITLE DIVERSITY RULES:
- Do NOT repeat the full topic name in every heading
- Use semantic variation
- Use shorter natural headings
- Avoid keyword stuffing

MARKDOWN HIERARCHY RULES:
- EVERY section MUST begin with:
## Section Heading
- Optional subtopics inside section MUST use:
### Subheading
- NEVER write plain text titles
- NEVER write bold headings instead of markdown headings
- NEVER skip markdown hierarchy
- NEVER place paragraphs before the ## heading

VALID FORMAT:
## Main Heading

Paragraph...

### Subheading

Paragraph...

### Another Subheading

Paragraph...

- The VERY FIRST line of output MUST start with ##
- Maintain proper spacing between headings and paragraphs

CRITICAL OUTPUT RULES:
- NEVER explain edits
- NEVER describe improvements
- NEVER behave like an editor
- NEVER output commentary
- NEVER output meta explanations
- NEVER mention instructions
- NEVER act as an editor
- NEVER say "I made the following changes"

FORBIDDEN PHRASES:
- "I made the following changes"
- "Improved readability"
- "Enhanced transitions"
- "Here's the revised version"
- "Below is the article"

ONLY output actual blog content.
"""
                        )
                    ),
                ]
            )

            # ---------------------------------------------------
            # SANITIZE OUTPUT
            # ---------------------------------------------------
            section_markdown = sanitize_output(
                response.content
            )

            # ---------------------------------------------------
            # Empty Recovery
            # ---------------------------------------------------
            if not section_markdown.strip():

                section_markdown = (
                    f"## {task.title}\n\n"
                    f"Content unavailable."
                )

            # ---------------------------------------------------
            # Track Openings
            # ---------------------------------------------------
            try:

                first_lines = (
                    section_markdown
                    .split("\n")
                )

                opening = ""

                for line in first_lines:

                    clean = line.strip()

                    if (
                        clean
                        and not clean.startswith("#")
                    ):

                        opening = clean[:120]
                        break

                if opening:

                    used_openings.append(
                        opening
                    )

            except Exception:

                pass

        except Exception as e:

            print(
                f"[Writer Error] {e}"
            )

            section_markdown = (
                f"## {task.title}\n\n"
                f"{task.goal}\n\n"
                f"{bullets_text}"
            )

        # ---------------------------------------------------
        # SANITIZE BEFORE SAVING
        # ---------------------------------------------------
        clean_section = sanitize_output(
            section_markdown
        )

        # ---------------------------------------------------
        # Store Section
        # ---------------------------------------------------
        sections.append(
            (
                task.id,
                clean_section
            )
        )

        # ---------------------------------------------------
        # SANITIZE BEFORE CONTEXT MEMORY
        # ---------------------------------------------------
        safe_context = sanitize_output(
            section_markdown
        )

        # ---------------------------------------------------
        # Update Context Memory
        # ---------------------------------------------------
        running_context += (
            "\n\n"
            + safe_context[:3000]
        )

    return {
        "sections": sections
    }