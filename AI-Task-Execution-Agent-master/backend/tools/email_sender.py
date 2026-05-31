import smtplib
import os
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.base import MIMEBase
from email import encoders
from backend.config import SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM

def send_email(to: str, task: str, summary: str, pdf_path: str):
    msg = MIMEMultipart()
    msg["From"] = SMTP_FROM
    msg["To"] = to
    msg["Subject"] = f"AI Report: {task[:60]}"

    body = f"""Hello,

Your AI research report is ready.

Task: {task}

--- Summary ---
{summary[:1000]}{'...' if len(summary) > 1000 else ''}

Full report is attached as PDF.

— AI Task Execution Agent
"""
    msg.attach(MIMEText(body, "plain"))

    # Attach PDF
    if pdf_path and os.path.exists(pdf_path):
        with open(pdf_path, "rb") as f:
            part = MIMEBase("application", "octet-stream")
            part.set_payload(f.read())
        encoders.encode_base64(part)
        part.add_header("Content-Disposition", f"attachment; filename={os.path.basename(pdf_path)}")
        msg.attach(part)

    with smtplib.SMTP(SMTP_HOST, SMTP_PORT) as server:
        server.starttls()
        server.login(SMTP_USER, SMTP_PASS)
        server.sendmail(SMTP_FROM, to, msg.as_string())
