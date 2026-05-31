from dataclasses import dataclass


@dataclass(frozen=True)
class DaySplit:
    label: str
    focus: str
    muscles: tuple[str, ...]


SPLIT_STRATEGIES: dict[int, tuple[str, list[DaySplit]]] = {
    3: (
        "Full Body (A/B/C)",
        [
            DaySplit("Full Body A", "Full body strength", ("chest", "back", "quads", "core")),
            DaySplit("Full Body B", "Full body hypertrophy", ("shoulders", "hamstrings", "glutes", "biceps")),
            DaySplit("Full Body C", "Full body conditioning", ("full_body", "cardio", "core", "calves")),
        ],
    ),
    4: (
        "Upper / Lower",
        [
            DaySplit("Upper A", "Chest, back, arms", ("chest", "back", "triceps", "biceps")),
            DaySplit("Lower A", "Quads & glutes", ("quads", "glutes", "calves", "core")),
            DaySplit("Upper B", "Shoulders & pull", ("shoulders", "back", "biceps", "chest")),
            DaySplit("Lower B", "Posterior chain", ("hamstrings", "glutes", "quads", "core")),
        ],
    ),
    5: (
        "Push / Pull / Legs + focus",
        [
            DaySplit("Push", "Chest, shoulders, triceps", ("chest", "shoulders", "triceps")),
            DaySplit("Pull", "Back & biceps", ("back", "biceps", "core")),
            DaySplit("Legs", "Lower body", ("quads", "hamstrings", "glutes", "calves")),
            DaySplit("Upper focus", "Chest & back", ("chest", "back", "shoulders")),
            DaySplit("Athletic / full", "Full body & conditioning", ("full_body", "core", "cardio")),
        ],
    ),
    6: (
        "Push / Pull / Legs (x2)",
        [
            DaySplit("Push A", "Chest, shoulders, triceps", ("chest", "shoulders", "triceps")),
            DaySplit("Pull A", "Back & biceps", ("back", "biceps")),
            DaySplit("Legs A", "Lower body", ("quads", "hamstrings", "glutes", "calves")),
            DaySplit("Push B", "Chest & shoulders", ("chest", "shoulders", "triceps")),
            DaySplit("Pull B", "Back & arms", ("back", "biceps", "core")),
            DaySplit("Legs B", "Legs & core", ("quads", "glutes", "hamstrings", "core")),
        ],
    ),
}


def get_split(days: int) -> tuple[str, list[DaySplit]]:
    return SPLIT_STRATEGIES[days]
