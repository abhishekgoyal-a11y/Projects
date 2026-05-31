from app.models import Goal, Level, NutritionAdvice, UserProfile


def _activity_multiplier(days: int, level: Level) -> float:
    base = 1.45 + min(days, 6) * 0.03
    if level == Level.ADVANCED:
        base += 0.05
    elif level == Level.INTERMEDIATE:
        base += 0.02
    return base


def calculate_nutrition(profile: UserProfile) -> NutritionAdvice:
    weight = profile.weight_kg or 70.0
    tdee = weight * 24 * _activity_multiplier(profile.days, profile.level)

    if profile.goal == Goal.FAT_LOSS:
        calories = int(tdee - 500)
        protein_per_kg = 2.0
        note = "Moderate calorie deficit to support fat loss while keeping muscle."
    elif profile.goal == Goal.MUSCLE_GAIN:
        calories = int(tdee + 300)
        protein_per_kg = 2.0
        note = "Slight surplus with high protein to fuel muscle growth."
    elif profile.goal == Goal.STRENGTH:
        calories = int(tdee + 200)
        protein_per_kg = 1.8
        note = "Enough energy for heavy training with solid recovery nutrition."
    else:
        calories = int(tdee)
        protein_per_kg = 1.6
        note = "Balanced intake for general fitness and recovery."

    protein_g = int(weight * protein_per_kg)
    carbs_g = int((calories - protein_g * 4) * 0.45 / 4)
    fats_g = int((calories - protein_g * 4 - carbs_g * 4) / 9)

    return NutritionAdvice(
        daily_calories=calories,
        protein_grams=protein_g,
        carbs_grams=max(carbs_g, 0),
        fats_grams=max(fats_g, 0),
        water_liters=round(weight * 0.035, 1),
        note=note,
    )
