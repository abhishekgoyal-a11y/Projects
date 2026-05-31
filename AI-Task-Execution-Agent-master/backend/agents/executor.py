from backend.agents.planner import plan_task
from backend.agents.summarizer import summarize
from backend.tools.web_search import web_search
from backend.tools.report_generator import generate_report
from backend.tools.email_sender import send_email
from backend.models.task import TaskStore

def execute_plan(task_id: str, task: str, email: str):
    try:
        TaskStore.update(task_id, status="planning")
        steps = plan_task(task)
        TaskStore.add_step(task_id, "Planning complete")
        TaskStore.update(task_id, status="searching")

        # Web search
        search_query = task
        raw_results = web_search(search_query)
        TaskStore.add_step(task_id, "Web search complete")
        TaskStore.update(task_id, status="summarizing")

        # Summarize
        summary = summarize(task, raw_results)
        TaskStore.add_step(task_id, "Summarization complete")
        TaskStore.update(task_id, status="generating_report")

        # Generate report
        pdf_path = generate_report(task, steps, summary)
        TaskStore.add_step(task_id, "Report generated")
        TaskStore.update(task_id, status="sending_email", report_url=pdf_path)

        # Send email (skipped if SMTP not configured)
        from backend.config import SMTP_USER
        if SMTP_USER and email and not SMTP_USER.startswith("your-"):
            send_email(email, task, summary, pdf_path)
            TaskStore.add_step(task_id, "Email sent")
        else:
            TaskStore.add_step(task_id, "Email skipped (SMTP not configured)")
        TaskStore.update(task_id, status="completed")

    except Exception as e:
        TaskStore.update(task_id, status="failed", error=str(e))
