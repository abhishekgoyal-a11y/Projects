import uuid
from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


def _uuid() -> str:
    return str(uuid.uuid4())


class UserRow(Base):
    __tablename__ = "users"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=_uuid)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True)
    hashed_password: Mapped[str] = mapped_column(String(255))
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    saved_plans: Mapped[list["SavedPlanRow"]] = relationship(back_populates="user")
    workout_logs: Mapped[list["WorkoutLogRow"]] = relationship(back_populates="user")


class SavedPlanRow(Base):
    __tablename__ = "saved_plans"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=_uuid)
    user_id: Mapped[str] = mapped_column(String(36), ForeignKey("users.id"), index=True)
    name: Mapped[str] = mapped_column(String(255))
    profile_json: Mapped[str] = mapped_column(Text)
    plan_json: Mapped[str] = mapped_column(Text)
    saved_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    user: Mapped[UserRow] = relationship(back_populates="saved_plans")


class WorkoutLogRow(Base):
    __tablename__ = "workout_logs"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=_uuid)
    user_id: Mapped[str] = mapped_column(String(36), ForeignKey("users.id"), index=True)
    day: Mapped[int] = mapped_column()
    day_label: Mapped[str] = mapped_column(String(255))
    plan_name: Mapped[str | None] = mapped_column(String(255), nullable=True)
    completed_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    user: Mapped[UserRow] = relationship(back_populates="workout_logs")
