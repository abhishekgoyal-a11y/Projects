from fastapi import FastAPI, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from pydantic import BaseModel
from backend.agents.executor import execute_plan
from backend.models.task import TaskStore
import uuid

app = FastAPI(title="AI Task Execution Agent")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class TaskRequest(BaseModel):
    task: str
    email: str

@app.post("/api/run-task")
async def run_task(req: TaskRequest, background_tasks: BackgroundTasks):
    task_id = str(uuid.uuid4())
    TaskStore.create(task_id, req.task, req.email)
    background_tasks.add_task(execute_plan, task_id, req.task, req.email)
    return {"task_id": task_id, "status": "started"}

@app.get("/api/task/{task_id}")
def get_task(task_id: str):
    task = TaskStore.get(task_id)
    if not task:
        return {"error": "Task not found"}
    return task

@app.get("/api/tasks")
def list_tasks():
    return TaskStore.all()

@app.get("/api/download/{file_path:path}")
def download_report(file_path: str):
    import os
    # Normalize slashes for Windows
    file_path = file_path.replace("/", os.sep)
    if not os.path.exists(file_path):
        return {"error": f"File not found: {file_path}"}
    return FileResponse(file_path, media_type="application/pdf",
                        filename=os.path.basename(file_path))
