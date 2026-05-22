from typing import (
    List,
    Optional,
    Literal,
)

from pydantic import (
    BaseModel,
    Field,
)


# ---------------------------------------------------
# Task Schema
# ---------------------------------------------------
class Task(BaseModel):

    id: int

    title: str

    goal: str = Field(
        ...,
        description=(
            "Main purpose of this section."
        )
    )

    bullets: List[str] = Field(
        ...,
        min_length=2,
        max_length=6
    )

    # ---------------------------------------------------
    # UPDATED FOR LONGER SECTIONS
    # ---------------------------------------------------
    target_words: int = Field(
        default=550,
        ge=350,
        le=1000,
        description=(
            "Recommended section length."
        )
    )

    # ---------------------------------------------------
    # ADVANCED SECTION FIELDS
    # ---------------------------------------------------
    section_purpose: str = Field(
        default="inform"
    )

    transition_goal: str = Field(
        default=""
    )

    engagement_style: str = Field(
        default="balanced"
    )

    narrative_depth: Literal[
        "light",
        "medium",
        "deep",
    ] = "deep"

    emotional_tone: str = Field(
        default=""
    )

    # ---------------------------------------------------
    # Metadata
    # ---------------------------------------------------
    tags: List[str] = Field(
        default_factory=list
    )

    requires_research: bool = False

    requires_citations: bool = False

    requires_code: bool = False


# ---------------------------------------------------
# Blog Plan Schema
# ---------------------------------------------------
class Plan(BaseModel):

    blog_title: str

    audience: str

    tone: str = Field(
        ...,
        description=(
            "Writing tone selected by user."
        )
    )

    blog_kind: Literal[
        "explainer",
        "tutorial",
        "news_roundup",
        "comparison",
        "how_to",
        "guide",
        "storytelling",
        "listicle",
        "case_study",
        "opinion",
        "review",
        "educational",
    ] = "explainer"

    # ---------------------------------------------------
    # BLOG-LEVEL WRITING STYLE
    # ---------------------------------------------------
    narrative_style: str = Field(
        default="engaging"
    )

    reader_journey: str = Field(
        default="curiosity_to_understanding"
    )

    pacing_style: Literal[
        "slow",
        "balanced",
        "fast",
    ] = "balanced"

    engagement_priority: Literal[
        "high",
        "medium",
        "low",
    ] = "high"

    storytelling_level: Literal[
        "minimal",
        "moderate",
        "strong",
    ] = "strong"

    # ---------------------------------------------------
    # Constraints
    # ---------------------------------------------------
    constraints: List[str] = Field(
        default_factory=list
    )

    # ---------------------------------------------------
    # UPDATED TASK COUNT
    # ---------------------------------------------------
    # OLD:
    # min_length=5,
    # max_length=8
    #
    # NEW:
    # Fewer but deeper sections
    # ---------------------------------------------------
    tasks: List[Task] = Field(
        ...,
        min_length=4,
        max_length=6
    )


# ---------------------------------------------------
# Research Evidence
# ---------------------------------------------------
class EvidenceItem(BaseModel):

    title: str

    url: str

    published_at: Optional[str] = None

    snippet: Optional[str] = None

    source: Optional[str] = None


# ---------------------------------------------------
# Router Decision
# ---------------------------------------------------
class RouterDecision(BaseModel):

    needs_research: bool

    mode: Literal[
        "closed_book",
        "hybrid",
        "open_book"
    ]

    reason: str

    queries: List[str] = Field(
        default_factory=list
    )

    max_results_per_query: int = Field(
        default=3,
        ge=1,
        le=5
    )


# ---------------------------------------------------
# Evidence Pack
# ---------------------------------------------------
class EvidencePack(BaseModel):

    evidence: List[EvidenceItem] = Field(
        default_factory=list
    )