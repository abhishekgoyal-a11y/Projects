from enum import Enum
from typing import Literal

from pydantic import BaseModel, Field


class Goal(str, Enum):
    FAT_LOSS = "fat_loss"
    MUSCLE_GAIN = "muscle_gain"
    STRENGTH = "strength"
    FITNESS = "fitness"


class Level(str, Enum):
    BEGINNER = "beginner"
    INTERMEDIATE = "intermediate"
    ADVANCED = "advanced"


class Equipment(str, Enum):
    GYM = "gym"
    DUMBBELLS = "dumbbells"
    BODYWEIGHT = "bodyweight"
    RESISTANCE_BANDS = "resistance_bands"
    BENCH = "bench"


class Injury(str, Enum):
    KNEE = "knee"
    LOWER_BACK = "lower_back"
    SHOULDER = "shoulder"
    WRIST = "wrist"
    ELBOW = "elbow"


class UserProfile(BaseModel):
    goal: Goal
    days: int = Field(ge=3, le=6)
    equipment: list[Equipment] = Field(min_length=1)
    level: Level = Level.BEGINNER
    use_ai: bool = False
    injuries: list[Injury] = Field(default_factory=list)
    weight_kg: float | None = Field(default=None, ge=30, le=250)


class ExerciseDetail(BaseModel):
    name: str
    sets: int
    reps: str
    rest_seconds: int


class WorkoutDay(BaseModel):
    day: int
    label: str
    focus: str
    exercises: list[ExerciseDetail]
    rest_guidance: str


class WorkoutPlan(BaseModel):
    goal: str
    days_per_week: int
    level: str
    split_type: str
    weekly_plan: list[WorkoutDay]
    source: Literal["rules", "ai"] = "rules"


class GeneratePlanRequest(UserProfile):
    pass


class HealthResponse(BaseModel):
    status: str
    ai_available: bool
    ai_provider: str | None = None
    ai_model: str | None = None


class ExerciseOption(BaseModel):
    name: str
    muscles: list[str]
    equipment: list[str]


class NutritionAdvice(BaseModel):
    daily_calories: int
    protein_grams: int
    carbs_grams: int
    fats_grams: int
    water_liters: float
    note: str


class AdaptPlanRequest(BaseModel):
    plan: WorkoutPlan
    sessions_completed: int = Field(ge=0, le=100)


class CoachMessage(BaseModel):
    role: str
    content: str


class CoachRequest(BaseModel):
    messages: list[CoachMessage]
    profile: UserProfile | None = None


class CoachResponse(BaseModel):
    reply: str
    source: Literal["ai", "fallback", "groq", "openai"]
