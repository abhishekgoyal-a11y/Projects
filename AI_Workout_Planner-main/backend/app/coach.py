from app.llm import ai_available, get_client, get_model, get_provider
from app.models import CoachMessage, CoachRequest, CoachResponse, UserProfile

FALLBACK_TIPS = [
    "Aim for 7–9 hours of sleep — recovery drives results.",
    "Hit your protein target daily, spread across 3–4 meals.",
    "If you're sore 48h+ after a session, consider an extra rest day.",
    "Progressive overload: add a rep or a little weight when form stays solid.",
    "Warm up 5–10 minutes before lifting; cool down with light stretching.",
]


def _profile_context(profile: UserProfile | None) -> str:
    if not profile:
        return ""
    injuries = ", ".join(i.value for i in profile.injuries) or "none"
    equipment = ", ".join(e.value for e in profile.equipment)
    return (
        f"\nUser profile: goal={profile.goal.value}, days={profile.days}, "
        f"level={profile.level.value}, equipment={equipment}, injuries={injuries}."
    )


def chat_coach(request: CoachRequest) -> CoachResponse:
    if not ai_available():
        last = request.messages[-1].content if request.messages else ""
        reply = (
            "AI coach needs GROQ_API_KEY (or OPENAI_API_KEY) on the backend. "
            f"Meanwhile: {FALLBACK_TIPS[len(last) % len(FALLBACK_TIPS)]}"
        )
        return CoachResponse(reply=reply, source="fallback")

    system = (
        "You are a friendly, concise fitness coach. Give practical workout and "
        "recovery advice. Never diagnose injuries or replace medical professionals. "
        "Keep answers under 120 words unless asked for detail."
        + _profile_context(request.profile)
    )

    messages = [{"role": "system", "content": system}]
    for msg in request.messages:
        messages.append({"role": msg.role, "content": msg.content})

    response = get_client().chat.completions.create(
        model=get_model(),
        messages=messages,
        temperature=0.6,
        max_tokens=300,
    )
    reply = response.choices[0].message.content or "I'm here to help — ask me anything!"
    provider = get_provider() or "ai"
    return CoachResponse(reply=reply, source=provider)
