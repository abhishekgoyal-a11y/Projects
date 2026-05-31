from dotenv import load_dotenv
load_dotenv()
import os
from contextlib import asynccontextmanager

from dotenv import load_dotenv
from fastapi import Depends, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from app.adaptive import adapt_plan
from app.ai_generator import generate_plan_with_ai
import app.llm as llm
from app.auth_utils import get_current_user
from app.coach import chat_coach
from app.database import get_db, init_db
from app.db_models import UserRow
from app.exercises import list_available_exercises
from app.models import (
    AdaptPlanRequest,
    CoachRequest,
    CoachResponse,
    Equipment,
    ExerciseOption,
    GeneratePlanRequest,
    Goal,
    HealthResponse,
    Injury,
    NutritionAdvice,
    UserProfile,
    WorkoutPlan,
)
from app.nutrition import calculate_nutrition
from app.plan_generator import generate_plan
from app.user_data import (
    AuthResponse,
    LoginRequest,
    RegisterRequest,
    SavedPlanPayload,
    SavedPlanResponse,
    UserResponse,
    WorkoutLogPayload,
    WorkoutLogResponse,
    clear_workout_logs,
    create_saved_plan,
    create_workout_log,
    delete_saved_plan,
    list_saved_plans,
    list_workout_logs,
    login_user,
    register_user,
)

load_dotenv()


@asynccontextmanager
async def lifespan(_: FastAPI):
    init_db()
    yield


app = FastAPI(
    title="AI Workout Planner API",
    description="Generate personalized weekly workout plans",
    version="4.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=os.getenv("CORS_ORIGINS", "http://localhost:5173").split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health", response_model=HealthResponse)
def health() -> HealthResponse:
    available = llm.ai_available()
    provider = llm.get_provider() if available else None
    model = llm.get_model() if available else None
    return HealthResponse(
        status="ok",
        ai_available=available,
        ai_provider=provider,
        ai_model=model,
    )


@app.get("/api/exercises", response_model=list[ExerciseOption])
def get_exercises(
    goal: Goal,
    equipment: str,
    injuries: str = "",
) -> list[ExerciseOption]:
    items = equipment.split(",") if equipment else []
    equipment_set = {Equipment(e.strip()) for e in items if e.strip()}
    if not equipment_set:
        raise HTTPException(status_code=400, detail="At least one equipment type is required.")
    injury_list = [Injury(i.strip()) for i in injuries.split(",") if i.strip()]
    return [
        ExerciseOption(
            name=ex.name,
            muscles=list(ex.muscles),
            equipment=[e.value for e in ex.equipment],
        )
        for ex in list_available_exercises(equipment_set, goal, injury_list)
    ]


@app.post("/api/nutrition", response_model=NutritionAdvice)
def get_nutrition(profile: UserProfile) -> NutritionAdvice:
    return calculate_nutrition(profile)


@app.post("/api/plan/adapt", response_model=WorkoutPlan)
def adapt_workout_plan(request: AdaptPlanRequest) -> WorkoutPlan:
    return adapt_plan(request.plan, request.sessions_completed)


@app.post("/api/coach/chat", response_model=CoachResponse)
def coach_chat(request: CoachRequest) -> CoachResponse:
    try:
        return chat_coach(request)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc


@app.post("/api/auth/register", response_model=AuthResponse)
def auth_register(request: RegisterRequest, db: Session = Depends(get_db)) -> AuthResponse:
    try:
        return register_user(db, request)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@app.post("/api/auth/login", response_model=AuthResponse)
def auth_login(request: LoginRequest, db: Session = Depends(get_db)) -> AuthResponse:
    try:
        return login_user(db, request)
    except ValueError as exc:
        raise HTTPException(status_code=401, detail=str(exc)) from exc


@app.get("/api/auth/me", response_model=UserResponse)
def auth_me(user: UserRow = Depends(get_current_user)) -> UserResponse:
    return UserResponse(id=user.id, email=user.email)


@app.get("/api/user/plans", response_model=list[SavedPlanResponse])
def user_list_plans(
    user: UserRow = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> list[SavedPlanResponse]:
    return list_saved_plans(db, user)


@app.post("/api/user/plans", response_model=SavedPlanResponse)
def user_save_plan(
    payload: SavedPlanPayload,
    user: UserRow = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> SavedPlanResponse:
    return create_saved_plan(db, user, payload)


@app.delete("/api/user/plans/{plan_id}", status_code=204)
def user_delete_plan(
    plan_id: str,
    user: UserRow = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> None:
    try:
        delete_saved_plan(db, user, plan_id)
    except ValueError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc


@app.get("/api/user/history", response_model=list[WorkoutLogResponse])
def user_list_history(
    user: UserRow = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> list[WorkoutLogResponse]:
    return list_workout_logs(db, user)


@app.post("/api/user/history", response_model=WorkoutLogResponse)
def user_log_workout(
    payload: WorkoutLogPayload,
    user: UserRow = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> WorkoutLogResponse:
    return create_workout_log(db, user, payload)


@app.delete("/api/user/history", status_code=204)
def user_clear_history(
    user: UserRow = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> None:
    clear_workout_logs(db, user)


@app.post("/api/plan/generate", response_model=WorkoutPlan)
def create_plan(request: GeneratePlanRequest) -> WorkoutPlan:
    try:
        if request.use_ai:
            if not llm.ai_available():
                raise HTTPException(
                    status_code=400,
                    detail="AI mode requested but no API key is set (GROQ_API_KEY or OPENAI_API_KEY).",
                )
            return generate_plan_with_ai(request)
        return generate_plan(request)
    except HTTPException:
        raise
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc
