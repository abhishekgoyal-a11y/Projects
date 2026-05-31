from datetime import datetime
from typing import Dict, Any

_store: Dict[str, Any] = {}

class TaskStore:
    @staticmethod
    def create(task_id: str, input_text: str, email: str):
        _store[task_id] = {
            "id": task_id,
            "input": input_text,
            "email": email,
            "status": "pending",
            "steps": [],
            "report_url": None,
            "created_at": datetime.utcnow().isoformat(),
        }

    @staticmethod
    def get(task_id: str):
        return _store.get(task_id)

    @staticmethod
    def update(task_id: str, **kwargs):
        if task_id in _store:
            _store[task_id].update(kwargs)

    @staticmethod
    def add_step(task_id: str, step: str, status: str = "done"):
        if task_id in _store:
            _store[task_id]["steps"].append({"step": step, "status": status})

    @staticmethod
    def all():
        return list(_store.values())
