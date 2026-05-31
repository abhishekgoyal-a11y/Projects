import json
from typing import Any

from app.llm import ai_available, get_client, get_model
from app.models import UserProfile, WorkoutPlan
from app.plan_generator import generate_plan


def generate_plan_with_ai(profile: UserProfile) -> WorkoutPlan:
    fallback = generate_plan(profile)
    if not ai_available():
        return fallback

    equipment = ", ".join(e.value.replace("_", " ") for e in profile.equipment)
    injuries = ", ".join(i.value for i in profile.injuries) or "none"
    prompt = f"""Create a {profile.days}-day {profile.goal.value.replace('_', ' ')} workout plan for a {profile.level.value}.
Equipment available: {equipment}.
Avoid exercises that aggravate these injuries: {injuries}.

Return ONLY valid JSON matching this schema:
{{
  "goal": "string",
  "days_per_week": {profile.days},
  "level": "{profile.level.value}",
  "split_type": "string",
  "weekly_plan": [
    {{
      "day": 1,
      "label": "Day 1: ...",
      "focus": "muscle groups",
      "rest_guidance": "60-90 seconds",
      "exercises": [
        {{ "name": "Exercise", "sets": 3, "reps": "10-12", "rest_seconds": 60 }}
      ]
    }}
  ]
}}

Use realistic exercises for the equipment. Include {profile.days} days."""

    try:
        response = get_client().chat.completions.create(
            model=get_model(),
            messages=[
                {
                    "role": "system",
                    "content": "You are an expert strength coach. Output strict JSON only.",
                },
                {"role": "user", "content": prompt},
            ],
            temperature=0.4,
            response_format={"type": "json_object"},
        )
        raw = response.choices[0].message.content or "{}"
        data: dict[str, Any] = json.loads(raw)
        plan = WorkoutPlan.model_validate({**data, "source": "ai"})
        return plan
    except Exception:
        return fallback
