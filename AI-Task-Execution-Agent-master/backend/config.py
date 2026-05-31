import os
from dotenv import load_dotenv

load_dotenv()

GROQ_API_KEY   = os.getenv("GROQ_API_KEY", "")
SERPAPI_KEY    = os.getenv("SERPAPI_KEY", "")
SMTP_HOST      = os.getenv("SMTP_HOST", "smtp.gmail.com")
SMTP_PORT      = int(os.getenv("SMTP_PORT", "587"))
SMTP_USER      = os.getenv("SMTP_USER", "")
SMTP_PASS      = os.getenv("SMTP_PASS", "")
SMTP_FROM      = os.getenv("SMTP_FROM", SMTP_USER)
