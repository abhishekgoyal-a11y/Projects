from app.models import Injury

INJURY_BLOCKED_EXERCISES: dict[Injury, frozenset[str]] = {
    Injury.KNEE: frozenset(
        {
            "Lunges",
            "Squats",
            "Leg Press",
            "Band Squats",
            "Goblet Squat",
            "Jumping Jacks",
            "Burpees",
            "Mountain Climbers",
        }
    ),
    Injury.LOWER_BACK: frozenset(
        {"Deadlift", "Romanian Deadlift", "Hip Thrust", "Burpees"}
    ),
    Injury.SHOULDER: frozenset(
        {
            "Shoulder Press",
            "Arnold Press",
            "Lateral Raises",
            "Front Raises",
            "Bench Press",
            "Incline Dumbbell Press",
        }
    ),
    Injury.WRIST: frozenset(
        {"Push-ups", "Triceps Dips", "Bench Press", "Dumbbell Fly"}
    ),
    Injury.ELBOW: frozenset(
        {
            "Triceps Dips",
            "Bicep Curls",
            "Hammer Curls",
            "Overhead Triceps Extension",
        }
    ),
}


def blocked_exercise_names(injuries: list[Injury]) -> frozenset[str]:
    blocked: set[str] = set()
    for injury in injuries:
        blocked.update(INJURY_BLOCKED_EXERCISES.get(injury, frozenset()))
    return frozenset(blocked)
