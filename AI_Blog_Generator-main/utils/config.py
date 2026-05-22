import os

from dotenv import load_dotenv
from langchain_groq import ChatGroq


# ---------------------------------------------------
# Load Environment Variables
# ---------------------------------------------------
load_dotenv()


# ---------------------------------------------------
# API Keys
# ---------------------------------------------------
GROQ_API_KEY = os.getenv(
    "GROQ_API_KEY"
)

TAVILY_API_KEY = os.getenv(
    "TAVILY_API_KEY"
)


# ---------------------------------------------------
# Main LLM
# Optimized for Groq Free Tier
# ---------------------------------------------------
llm = ChatGroq(
    model="llama-3.1-8b-instant",

    temperature=0.6,

    max_tokens=800,

    max_retries=3,
)
writer_llm = ChatGroq(
    model="llama-3.3-70b-versatile",

    temperature=0.7,

    max_tokens=2200,

    max_retries=3,
)


# ---------------------------------------------------
# Debug
# ---------------------------------------------------
print(
    "Loaded Groq model: "
    "llama-3.1-8b-instant"
)