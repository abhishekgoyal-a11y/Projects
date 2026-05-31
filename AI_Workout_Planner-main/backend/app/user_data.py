import json
from datetime import datetime

from pydantic import BaseModel, EmailStr, Field
from sqlalchemy.orm import Session

from app.auth_utils import create_access_token, hash_password, verify_password
from app.db_models import SavedPlanRow, UserRow, WorkoutLogRow


class RegisterRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=6, max_length=128)


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class AuthResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    email: str


class UserResponse(BaseModel):
    id: str
    email: str


class SavedPlanPayload(BaseModel):
    name: str
    profile: dict
    plan: dict


class SavedPlanResponse(BaseModel):
    id: str
    name: str
    saved_at: str
    profile: dict
    plan: dict


class WorkoutLogPayload(BaseModel):
    day: int
    day_label: str
    plan_name: str | None = None


class WorkoutLogResponse(BaseModel):
    id: str
    completed_at: str
    day: int
    day_label: str
    plan_name: str | None = None


def register_user(db: Session, request: RegisterRequest) -> AuthResponse:
    existing = db.query(UserRow).filter(UserRow.email == request.email.lower()).first()
    if existing:
        raise ValueError("Email already registered")

    user = UserRow(
        email=request.email.lower(),
        hashed_password=hash_password(request.password),
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    token = create_access_token(user.id)
    return AuthResponse(access_token=token, email=user.email)


def login_user(db: Session, request: LoginRequest) -> AuthResponse:
    user = db.query(UserRow).filter(UserRow.email == request.email.lower()).first()
    if not user or not verify_password(request.password, user.hashed_password):
        raise ValueError("Invalid email or password")
    return AuthResponse(access_token=create_access_token(user.id), email=user.email)


def list_saved_plans(db: Session, user: UserRow) -> list[SavedPlanResponse]:
    rows = (
        db.query(SavedPlanRow)
        .filter(SavedPlanRow.user_id == user.id)
        .order_by(SavedPlanRow.saved_at.desc())
        .limit(20)
        .all()
    )
    return [_plan_to_response(row) for row in rows]


def create_saved_plan(
    db: Session, user: UserRow, payload: SavedPlanPayload
) -> SavedPlanResponse:
    row = SavedPlanRow(
        user_id=user.id,
        name=payload.name,
        profile_json=json.dumps(payload.profile),
        plan_json=json.dumps(payload.plan),
    )
    db.add(row)
    db.commit()
    db.refresh(row)
    return _plan_to_response(row)


def delete_saved_plan(db: Session, user: UserRow, plan_id: str) -> None:
    row = (
        db.query(SavedPlanRow)
        .filter(SavedPlanRow.id == plan_id, SavedPlanRow.user_id == user.id)
        .first()
    )
    if not row:
        raise ValueError("Plan not found")
    db.delete(row)
    db.commit()


def list_workout_logs(db: Session, user: UserRow) -> list[WorkoutLogResponse]:
    rows = (
        db.query(WorkoutLogRow)
        .filter(WorkoutLogRow.user_id == user.id)
        .order_by(WorkoutLogRow.completed_at.desc())
        .limit(100)
        .all()
    )
    return [_log_to_response(row) for row in rows]


def create_workout_log(
    db: Session, user: UserRow, payload: WorkoutLogPayload
) -> WorkoutLogResponse:
    row = WorkoutLogRow(
        user_id=user.id,
        day=payload.day,
        day_label=payload.day_label,
        plan_name=payload.plan_name,
    )
    db.add(row)
    db.commit()
    db.refresh(row)
    return _log_to_response(row)


def clear_workout_logs(db: Session, user: UserRow) -> None:
    db.query(WorkoutLogRow).filter(WorkoutLogRow.user_id == user.id).delete()
    db.commit()


def _plan_to_response(row: SavedPlanRow) -> SavedPlanResponse:
    return SavedPlanResponse(
        id=row.id,
        name=row.name,
        saved_at=row.saved_at.isoformat(),
        profile=json.loads(row.profile_json),
        plan=json.loads(row.plan_json),
    )


def _log_to_response(row: WorkoutLogRow) -> WorkoutLogResponse:
    return WorkoutLogResponse(
        id=row.id,
        completed_at=row.completed_at.isoformat(),
        day=row.day,
        day_label=row.day_label,
        plan_name=row.plan_name,
    )
