from dataclasses import dataclass

from app.injuries import blocked_exercise_names
from app.models import Equipment, Goal, Injury, Level


@dataclass(frozen=True)
class ExerciseTemplate:
    name: str
    muscles: tuple[str, ...]
    equipment: frozenset[Equipment]
    goals: frozenset[Goal]


EXERCISE_DB: list[ExerciseTemplate] = [
    ExerciseTemplate("Bench Press", ("chest", "triceps"), frozenset({Equipment.GYM, Equipment.BENCH, Equipment.DUMBBELLS}), frozenset(Goal)),
    ExerciseTemplate("Dumbbell Fly", ("chest",), frozenset({Equipment.DUMBBELLS, Equipment.BENCH}), frozenset(Goal)),
    ExerciseTemplate("Push-ups", ("chest", "triceps"), frozenset({Equipment.BODYWEIGHT, Equipment.GYM}), frozenset(Goal)),
    ExerciseTemplate("Incline Dumbbell Press", ("chest",), frozenset({Equipment.DUMBBELLS, Equipment.BENCH}), frozenset({Goal.MUSCLE_GAIN, Goal.STRENGTH})),
    ExerciseTemplate("Triceps Dips", ("triceps",), frozenset({Equipment.BODYWEIGHT, Equipment.GYM, Equipment.BENCH}), frozenset(Goal)),
    ExerciseTemplate("Overhead Triceps Extension", ("triceps",), frozenset({Equipment.DUMBBELLS, Equipment.GYM}), frozenset(Goal)),
    ExerciseTemplate("Dumbbell Rows", ("back", "biceps"), frozenset({Equipment.DUMBBELLS, Equipment.GYM}), frozenset(Goal)),
    ExerciseTemplate("Pull-ups", ("back", "biceps"), frozenset({Equipment.GYM, Equipment.BODYWEIGHT}), frozenset(Goal)),
    ExerciseTemplate("Lat Pulldown", ("back",), frozenset({Equipment.GYM}), frozenset(Goal)),
    ExerciseTemplate("Bicep Curls", ("biceps",), frozenset({Equipment.DUMBBELLS, Equipment.GYM, Equipment.RESISTANCE_BANDS}), frozenset(Goal)),
    ExerciseTemplate("Hammer Curls", ("biceps",), frozenset({Equipment.DUMBBELLS, Equipment.GYM}), frozenset(Goal)),
    ExerciseTemplate("Face Pulls", ("rear delts", "upper back"), frozenset({Equipment.GYM, Equipment.RESISTANCE_BANDS}), frozenset(Goal)),
    ExerciseTemplate("Squats", ("quads", "glutes"), frozenset({Equipment.GYM, Equipment.DUMBBELLS, Equipment.BODYWEIGHT}), frozenset(Goal)),
    ExerciseTemplate("Goblet Squat", ("quads", "glutes"), frozenset({Equipment.DUMBBELLS, Equipment.BODYWEIGHT}), frozenset(Goal)),
    ExerciseTemplate("Lunges", ("quads", "glutes"), frozenset({Equipment.DUMBBELLS, Equipment.BODYWEIGHT, Equipment.GYM}), frozenset(Goal)),
    ExerciseTemplate("Romanian Deadlift", ("hamstrings", "glutes"), frozenset({Equipment.GYM, Equipment.DUMBBELLS}), frozenset(Goal)),
    ExerciseTemplate("Leg Press", ("quads",), frozenset({Equipment.GYM}), frozenset(Goal)),
    ExerciseTemplate("Calf Raises", ("calves",), frozenset({Equipment.GYM, Equipment.DUMBBELLS, Equipment.BODYWEIGHT}), frozenset(Goal)),
    ExerciseTemplate("Deadlift", ("back", "hamstrings", "glutes"), frozenset({Equipment.GYM, Equipment.DUMBBELLS}), frozenset({Goal.MUSCLE_GAIN, Goal.STRENGTH})),
    ExerciseTemplate("Shoulder Press", ("shoulders",), frozenset({Equipment.DUMBBELLS, Equipment.GYM}), frozenset(Goal)),
    ExerciseTemplate("Lateral Raises", ("shoulders",), frozenset({Equipment.DUMBBELLS, Equipment.GYM, Equipment.RESISTANCE_BANDS}), frozenset(Goal)),
    ExerciseTemplate("Front Raises", ("shoulders",), frozenset({Equipment.DUMBBELLS, Equipment.RESISTANCE_BANDS}), frozenset(Goal)),
    ExerciseTemplate("Arnold Press", ("shoulders",), frozenset({Equipment.DUMBBELLS}), frozenset({Goal.MUSCLE_GAIN, Goal.STRENGTH})),
    ExerciseTemplate("Plank", ("core",), frozenset({Equipment.BODYWEIGHT}), frozenset(Goal)),
    ExerciseTemplate("Russian Twists", ("core",), frozenset({Equipment.BODYWEIGHT, Equipment.DUMBBELLS}), frozenset(Goal)),
    ExerciseTemplate("Burpees", ("full body",), frozenset({Equipment.BODYWEIGHT}), frozenset({Goal.FAT_LOSS, Goal.FITNESS})),
    ExerciseTemplate("Mountain Climbers", ("core", "cardio"), frozenset({Equipment.BODYWEIGHT}), frozenset({Goal.FAT_LOSS, Goal.FITNESS})),
    ExerciseTemplate("Jumping Jacks", ("cardio",), frozenset({Equipment.BODYWEIGHT}), frozenset({Goal.FAT_LOSS, Goal.FITNESS})),
    ExerciseTemplate("Band Pull-aparts", ("upper back",), frozenset({Equipment.RESISTANCE_BANDS}), frozenset(Goal)),
    ExerciseTemplate("Band Squats", ("quads", "glutes"), frozenset({Equipment.RESISTANCE_BANDS}), frozenset(Goal)),
    ExerciseTemplate("Band Rows", ("back",), frozenset({Equipment.RESISTANCE_BANDS}), frozenset(Goal)),
    ExerciseTemplate("Hip Thrust", ("glutes",), frozenset({Equipment.GYM, Equipment.BENCH, Equipment.DUMBBELLS}), frozenset({Goal.MUSCLE_GAIN, Goal.STRENGTH})),
    ExerciseTemplate("Leg Curl", ("hamstrings",), frozenset({Equipment.GYM}), frozenset(Goal)),
    ExerciseTemplate("Chest Supported Row", ("back",), frozenset({Equipment.GYM, Equipment.BENCH, Equipment.DUMBBELLS}), frozenset(Goal)),
]


MUSCLE_POOLS: dict[str, list[str]] = {
    "chest": ["Bench Press", "Dumbbell Fly", "Push-ups", "Incline Dumbbell Press"],
    "triceps": ["Triceps Dips", "Overhead Triceps Extension", "Push-ups"],
    "back": ["Dumbbell Rows", "Pull-ups", "Lat Pulldown", "Band Rows", "Chest Supported Row"],
    "biceps": ["Bicep Curls", "Hammer Curls"],
    "quads": ["Squats", "Goblet Squat", "Lunges", "Leg Press", "Band Squats"],
    "hamstrings": ["Romanian Deadlift", "Leg Curl", "Deadlift"],
    "glutes": ["Hip Thrust", "Lunges", "Romanian Deadlift"],
    "calves": ["Calf Raises"],
    "shoulders": ["Shoulder Press", "Lateral Raises", "Front Raises", "Arnold Press"],
    "core": ["Plank", "Russian Twists", "Mountain Climbers"],
    "cardio": ["Burpees", "Jumping Jacks", "Mountain Climbers"],
    "full_body": ["Burpees", "Deadlift", "Squats"],
}


def exercise_by_name(name: str) -> ExerciseTemplate | None:
    for ex in EXERCISE_DB:
        if ex.name == name:
            return ex
    return None


def available_for_user(
    name: str,
    equipment: set[Equipment],
    goal: Goal,
    injuries: list[Injury] | None = None,
) -> bool:
    if name in blocked_exercise_names(injuries or []):
        return False
    template = exercise_by_name(name)
    if template is None:
        return False
    if goal not in template.goals:
        return False
    return bool(template.equipment & equipment)


def pick_exercises(
    muscle_keys: list[str],
    equipment: set[Equipment],
    goal: Goal,
    count: int = 4,
    injuries: list[Injury] | None = None,
) -> list[str]:
    chosen: list[str] = []
    for muscle in muscle_keys:
        for candidate in MUSCLE_POOLS.get(muscle, []):
            if candidate in chosen:
                continue
            if available_for_user(candidate, equipment, goal, injuries):
                chosen.append(candidate)
            if len(chosen) >= count:
                return chosen
    return chosen


def list_available_exercises(
    equipment: set[Equipment],
    goal: Goal,
    injuries: list[Injury] | None = None,
) -> list[ExerciseTemplate]:
    equipment = set(equipment)
    equipment.add(Equipment.BODYWEIGHT)
    blocked = blocked_exercise_names(injuries or [])
    return sorted(
        [
            ex
            for ex in EXERCISE_DB
            if ex.name not in blocked
            and goal in ex.goals
            and bool(ex.equipment & equipment)
        ],
        key=lambda ex: ex.name,
    )
