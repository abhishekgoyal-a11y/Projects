import json

from langchain_core.messages import (
    SystemMessage,
    HumanMessage,
)

from models.state import State

from models.schemas import (
    Plan,
)

from prompts.orchestrator_prompt import (
    ORCHESTRATOR_SYSTEM
)

from utils.config import (
    llm,
)


def orchestrator_node(
    state: State
) -> dict:
    """
    Advanced narrative-aware blog planner.
    """

    evidence = state.get(
        "evidence",
        []
    )

    # ---------------------------------------------------
    # Compact Evidence
    # ---------------------------------------------------
    compact_evidence = []

    for item in evidence[:5]:

        if isinstance(item, dict):

            compact_evidence.append(
                {
                    "title":
                        item.get(
                            "title",
                            ""
                        ),

                    "snippet":
                        item.get(
                            "snippet",
                            ""
                        )[:200],
                }
            )

    # ---------------------------------------------------
    # Planner LLM
    # ---------------------------------------------------
    planner_llm = llm.bind(
        max_tokens=2200,
        temperature=0.9,
    )

    # ---------------------------------------------------
    # Generate Plan
    # ---------------------------------------------------
    response = planner_llm.invoke(
        [
            SystemMessage(
                content=(
                    ORCHESTRATOR_SYSTEM
                )
            ),

            HumanMessage(
                content=(
                    f"TOPIC:\n"
                    f"{state['topic']}\n\n"

                    f"TONE:\n"
                    f"{state['tone']}\n\n"

                    f"MODE:\n"
                    f"{state['mode']}\n\n"

                    f"AVAILABLE EVIDENCE:\n"
                    f"{compact_evidence}\n\n"

                    f"""
IMPORTANT:

Generate a HIGHLY ENGAGING BLOG PLAN.

The section titles MUST:
- be specific to the topic
- avoid generic wording
- adapt to the selected tone
- feel human-written
- feel modern and engaging

DO NOT generate generic titles like:
- Introduction
- Benefits
- Applications
- Final Thoughts

Instead:
- create topic-specific titles
- create emotionally engaging headings
- make titles feel clickable and human

The article structure should:
- maintain curiosity
- create narrative progression
- feel like a professional blog
- support strong reader retention

VERY IMPORTANT:
Every blog MUST have unique section titles.
"""
                )
            ),
        ]
    )

    raw_text = (
        response.content
        .replace("```json", "")
        .replace("```", "")
        .strip()
    )

    # ---------------------------------------------------
    # Parse JSON
    # ---------------------------------------------------
    try:

        data = json.loads(
            raw_text
        )

    except Exception:

        data = {}

    # ---------------------------------------------------
    # Ensure Dict
    # ---------------------------------------------------
    if not isinstance(
        data,
        dict
    ):

        data = {}

    topic = state["topic"]

    tone = state["tone"].lower()

    # ---------------------------------------------------
    # Required Fields
    # ---------------------------------------------------
    if not data.get(
        "blog_title"
    ):

        if tone in [
            "storytelling",
            "casual",
            "conversational",
        ]:

            data["blog_title"] = (
                f"The Hidden Side of {topic}"
            )

        elif tone in [
            "technical",
            "academic",
        ]:

            data["blog_title"] = (
                f"A Deep Dive Into {topic}"
            )

        else:

            data["blog_title"] = (
                f"Understanding {topic}"
            )

    if not data.get(
        "audience"
    ):

        data["audience"] = (
            "General Readers"
        )

    if not data.get(
        "tone"
    ):

        data["tone"] = (
            state["tone"]
        )

    if not data.get(
        "blog_kind"
    ):

        data["blog_kind"] = (
            "explainer"
        )

    if not data.get(
        "constraints"
    ):

        data["constraints"] = []

    # ---------------------------------------------------
    # Tasks
    # ---------------------------------------------------
    tasks = data.get(
        "tasks",
        []
    )

    # ---------------------------------------------------
    # Dynamic Adaptive Fallback Tasks
    # ---------------------------------------------------
    if (
        not isinstance(tasks, list)
        or len(tasks) < 3
    ):

        # ---------------------------------------------------
        # Storytelling / Conversational
        # ---------------------------------------------------
        if tone in [
            "storytelling",
            "casual",
            "conversational",
        ]:

            tasks = [
                {
                    "id": 1,

                    "title":
                        f"The Real Story Behind {topic}",

                    "goal":
                        "Hook reader emotionally.",

                    "bullets": [
                        "Why people care",
                        "Unexpected angle",
                        "Current relevance",
                    ],

                    "target_words":
                        250,

                    "section_purpose":
                        "hook",

                    "engagement_style":
                        "high",
                },

                {
                    "id": 2,

                    "title":
                        f"What Makes {topic} So Interesting",

                    "goal":
                        "Build understanding naturally.",

                    "bullets": [
                        "Core ideas",
                        "Important context",
                        "Misconceptions",
                    ],

                    "target_words":
                        260,

                    "section_purpose":
                        "educate",
                },

                {
                    "id": 3,

                    "title":
                        f"How {topic} Shows Up in Real Life",

                    "goal":
                        "Connect ideas to reality.",

                    "bullets": [
                        "Examples",
                        "Real-world relevance",
                        "Human impact",
                    ],

                    "target_words":
                        280,

                    "section_purpose":
                        "practical",
                },

                {
                    "id": 4,

                    "title":
                        f"Where {topic} Could Be Heading Next",

                    "goal":
                        "Explore future implications.",

                    "bullets": [
                        "Future trends",
                        "Emerging shifts",
                        "Long-term changes",
                    ],

                    "target_words":
                        260,

                    "section_purpose":
                        "deepen",
                },

                {
                    "id": 5,

                    "title":
                        f"What {topic} Really Means Going Forward",

                    "goal":
                        "Conclude emotionally.",

                    "bullets": [
                        "Reflection",
                        "Insights",
                        "Final perspective",
                    ],

                    "target_words":
                        250,

                    "section_purpose":
                        "emotional",
                },
            ]

        # ---------------------------------------------------
        # Technical / Academic
        # ---------------------------------------------------
        elif tone in [
            "technical",
            "academic",
        ]:

            tasks = [
                {
                    "id": 1,

                    "title":
                        f"The Foundations of {topic}",

                    "goal":
                        "Introduce technical foundations.",

                    "bullets": [
                        "Core principles",
                        "Architecture",
                        "Background",
                    ],

                    "target_words":
                        250,

                    "section_purpose":
                        "educate",
                },

                {
                    "id": 2,

                    "title":
                        f"Breaking Down How {topic} Works",

                    "goal":
                        "Explain technical mechanisms.",

                    "bullets": [
                        "System flow",
                        "Internal logic",
                        "Components",
                    ],

                    "target_words":
                        300,

                    "section_purpose":
                        "deepen",

                    "narrative_depth":
                        "deep",
                },

                {
                    "id": 3,

                    "title":
                        f"Real-World Applications of {topic}",

                    "goal":
                        "Show implementation.",

                    "bullets": [
                        "Industry usage",
                        "Applications",
                        "Engineering examples",
                    ],

                    "target_words":
                        300,

                    "section_purpose":
                        "practical",
                },

                {
                    "id": 4,

                    "title":
                        f"Challenges and Future Directions in {topic}",

                    "goal":
                        "Explore deeper implications.",

                    "bullets": [
                        "Limitations",
                        "Scalability",
                        "Future innovation",
                    ],

                    "target_words":
                        280,

                    "section_purpose":
                        "deepen",
                },

                {
                    "id": 5,

                    "title":
                        f"Key Insights From {topic}",

                    "goal":
                        "Conclude thoughtfully.",

                    "bullets": [
                        "Key lessons",
                        "Future outlook",
                        "Final analysis",
                    ],

                    "target_words":
                        250,
                },
            ]

        # ---------------------------------------------------
        # Default
        # ---------------------------------------------------
        else:

            tasks = [
                {
                    "id": 1,

                    "title":
                        f"Why Everyone Is Talking About {topic}",

                    "goal":
                        "Introduce topic naturally.",

                    "bullets": [
                        "Current relevance",
                        "Growing interest",
                        "Context",
                    ],

                    "target_words":
                        250,
                },

                {
                    "id": 2,

                    "title":
                        f"Understanding the Core Ideas Behind {topic}",

                    "goal":
                        "Explain core concepts.",

                    "bullets": [
                        "Key ideas",
                        "Terminology",
                        "Examples",
                    ],

                    "target_words":
                        280,
                },

                {
                    "id": 3,

                    "title":
                        f"How {topic} Is Changing the Real World",

                    "goal":
                        "Show practical impact.",

                    "bullets": [
                        "Applications",
                        "Benefits",
                        "Use cases",
                    ],

                    "target_words":
                        280,
                },

                {
                    "id": 4,

                    "title":
                        f"The Bigger Questions Around {topic}",

                    "goal":
                        "Explore implications.",

                    "bullets": [
                        "Ethics",
                        "Future",
                        "Challenges",
                    ],

                    "target_words":
                        260,
                },

                {
                    "id": 5,

                    "title":
                        f"What Happens Next With {topic}",

                    "goal":
                        "End naturally.",

                    "bullets": [
                        "Future outlook",
                        "Reflection",
                        "Final insight",
                    ],

                    "target_words":
                        250,
                },
            ]

    # ---------------------------------------------------
    # Normalize Tasks
    # ---------------------------------------------------
    normalized_tasks = []

    for idx, task in enumerate(tasks[:8]):

        if not isinstance(
            task,
            dict
        ):

            continue

        normalized_tasks.append(
            {
                "id":
                    task.get(
                        "id",
                        idx + 1
                    ),

                "title":
                    task.get(
                        "title",
                        f"{topic} Section {idx + 1}"
                    ),

                "goal":
                    task.get(
                        "goal",
                        "Explain the topic."
                    ),

                "bullets":
                    task.get(
                        "bullets",
                        [
                            "Overview",
                            "Examples",
                            "Insights",
                        ]
                    )[:6],

                "target_words":
                    min(
                        max(
                            int(
                                task.get(
                                    "target_words",
                                    500
                                )
                            ),
                            450,
                        ),
                        350,
                    ),

                "section_purpose":
                    task.get(
                        "section_purpose",
                        "inform"
                    ),

                "transition_goal":
                    task.get(
                        "transition_goal",
                        ""
                    ),

                "engagement_style":
                    task.get(
                        "engagement_style",
                        "balanced"
                    ),

                "narrative_depth":
                    task.get(
                        "narrative_depth",
                        "medium"
                    ),

                "emotional_tone":
                    task.get(
                        "emotional_tone",
                        ""
                    ),

                "tags":
                    task.get(
                        "tags",
                        []
                    ),

                "requires_research":
                    task.get(
                        "requires_research",
                        False
                    ),

                "requires_citations":
                    task.get(
                        "requires_citations",
                        False
                    ),

                "requires_code":
                    task.get(
                        "requires_code",
                        False
                    ),
            }
        )

    data["tasks"] = (
        normalized_tasks
    )

    # ---------------------------------------------------
    # Build Plan
    # ---------------------------------------------------
    plan = Plan(
        **data
    )

    return {
        "plan":
            plan
    }