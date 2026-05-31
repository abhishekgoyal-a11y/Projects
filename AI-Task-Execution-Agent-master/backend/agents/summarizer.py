from groq import Groq
from backend.config import GROQ_API_KEY

client = Groq(api_key=GROQ_API_KEY)

SYSTEM_PROMPT = """You are a senior research analyst producing a professional, publication-quality report.
Given a task and research data, write a COMPREHENSIVE and DETAILED report.

STRICT FORMATTING RULES:
- Use ### for section headings (no ## or #)
- Use - for bullet points
- Use plain markdown tables with | pipes for ALL tabular data
- Do NOT use ** anywhere — no bold markers at all
- Write full, detailed paragraphs — minimum 4-5 sentences per section
- Every claim must be explained with context and reasoning

REQUIRED SECTIONS (all mandatory, all detailed):

### Executive Summary
Write 4-5 sentences giving a high-level overview of the topic, why it matters, and what this report covers.

### Background and Context
Write 5-6 sentences explaining the history, origin, and current state of the topic. Include relevant dates, versions, or milestones.

### Key Findings
Write at least 8 detailed bullet points. Each bullet must be 2-3 sentences long explaining the finding in depth.

### Detailed Analysis
Write 6-8 sentences of deep analysis. Discuss trends, patterns, strengths, weaknesses, and opportunities.

### Comparison Table
A detailed markdown table comparing all relevant items across at least 5 attributes. Always include this.

### Step-by-Step Workflow
Numbered list of steps (at least 6 steps) describing the process or workflow related to the topic. Each step should have a 1-2 sentence explanation.

### Insights and Recommendations
Write 5-6 sentences of actionable insights and specific recommendations based on the findings.

### Conclusion
Write 4-5 sentences summarizing the overall findings, their significance, and future outlook.

Be thorough. This report will be read by professionals. Do not skip any section."""


def summarize(task: str, raw_data: str) -> str:
    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": f"Task: {task}\n\nResearch Data:\n{raw_data}"},
        ],
        temperature=0.5,
        max_tokens=4000,
    )
    return response.choices[0].message.content.strip()
