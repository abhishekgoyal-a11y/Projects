from app.models import ExerciseDetail, WorkoutPlan


def adapt_plan(plan: WorkoutPlan, sessions_completed: int) -> WorkoutPlan:
    if sessions_completed < 3:
        return plan

    weekly = []
    for day in plan.weekly_plan:
        exercises: list[ExerciseDetail] = []
        for ex in day.exercises:
            new_sets = ex.sets
            new_reps = ex.reps
            new_rest = ex.rest_seconds

            if sessions_completed >= 6:
                new_sets = min(ex.sets + 1, 5)
            elif sessions_completed >= 3:
                if ex.reps.isdigit():
                    new_reps = str(min(int(ex.reps) + 2, 15))
                elif "-" in ex.reps:
                    parts = ex.reps.split("-")
                    if len(parts) == 2 and parts[0].isdigit() and parts[1].isdigit():
                        lo, hi = int(parts[0]), int(parts[1])
                        new_reps = f"{lo + 1}-{hi + 1}"

            if sessions_completed >= 9:
                new_rest = max(ex.rest_seconds - 10, 30)

            exercises.append(
                ExerciseDetail(
                    name=ex.name,
                    sets=new_sets,
                    reps=new_reps,
                    rest_seconds=new_rest,
                )
            )

        weekly.append(
            day.model_copy(
                update={
                    "exercises": exercises,
                    "rest_guidance": day.rest_guidance.replace(
                        "seconds",
                        "seconds (adapted — you've been consistent!)",
                    )
                    if "adapted" not in day.rest_guidance
                    else day.rest_guidance,
                }
            )
        )

    return plan.model_copy(
        update={
            "weekly_plan": weekly,
            "split_type": f"{plan.split_type} (adapted)",
        }
    )
