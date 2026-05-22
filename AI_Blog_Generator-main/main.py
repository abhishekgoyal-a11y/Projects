from workflow.blog_workflow import app

inputs = {
    "topic": "Best AI tools for students",

    "tone": "Beginner Friendly",

    "as_of": "2026-05-21",

    "mode": "",
    "needs_research": False,
    "queries": [],
    "recency_days": 30,

    "evidence": [],

    "plan": None,

    "sections": [],

    "merged_md": "",

    "final": "",
}

result = app.invoke(inputs)

print(result["final"])