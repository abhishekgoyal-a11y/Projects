from app.exercises import pick_exercises
from app.models import Equipment, ExerciseDetail, Goal, Level, UserProfile, WorkoutDay, WorkoutPlan
from app.split_engine import get_split

GOAL_LABELS = {
    Goal.FAT_LOSS: "Fat Loss",
    Goal.MUSCLE_GAIN: "Muscle Gain",
    Goal.STRENGTH: "Strength",
    Goal.FITNESS: "General Fitness",
}


def _prescription(goal: Goal, level: Level) -> tuple[int, str, int, str]:
    if goal == Goal.STRENGTH:
        sets = 4 if level == Level.ADVANCED else 3
        reps = "4-6" if level != Level.BEGINNER else "6-8"
        rest = 120
    elif goal == Goal.FAT_LOSS:
        sets = 3
        reps = "12-15" if level != Level.BEGINNER else "10-12"
        rest = 45
    elif goal == Goal.MUSCLE_GAIN:
        sets = 4 if level == Level.ADVANCED else 3
        reps = "8-12" if level != Level.BEGINNER else "10-12"
        rest = 75
    else:
        sets = 3
        reps = "10-15"
        rest = 60

    if level == Level.BEGINNER:
        sets = min(sets, 3)
        rest = min(rest, 90)

    rest_guidance = f"{rest - 15}–{rest + 15} seconds between sets"
    return sets, reps, rest, rest_guidance


def generate_plan(profile: UserProfile) -> WorkoutPlan:
    split_name, days = get_split(profile.days)
    equipment = set(profile.equipment)
    equipment.add(Equipment.BODYWEIGHT)

    sets, reps, rest_seconds, rest_guidance = _prescription(profile.goal, profile.level)
    weekly: list[WorkoutDay] = []

    for index, day_split in enumerate(days, start=1):
        exercise_count = 5 if profile.goal == Goal.FAT_LOSS else 4
        names = pick_exercises(
            list(day_split.muscles),
            equipment,
            profile.goal,
            count=exercise_count,
            injuries=profile.injuries,
        )
        if len(names) < 3:
            names = pick_exercises(
                ["full_body", "core", "cardio", "chest", "back"],
                equipment,
                profile.goal,
                count=exercise_count,
                injuries=profile.injuries,
            )

        exercises = [
            ExerciseDetail(
                name=name,
                sets=sets,
                reps="max reps" if name == "Push-ups" and profile.goal == Goal.MUSCLE_GAIN else reps,
                rest_seconds=rest_seconds,
            )
            for name in names
        ]

        weekly.append(
            WorkoutDay(
                day=index,
                label=f"Day {index}: {day_split.label}",
                focus=day_split.focus,
                exercises=exercises,
                rest_guidance=rest_guidance,
            )
        )

    return WorkoutPlan(
        goal=GOAL_LABELS[profile.goal],
        days_per_week=profile.days,
        level=profile.level.value,
        split_type=split_name,
        weekly_plan=weekly,
        source="rules",
    )
