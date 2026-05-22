from crewai import Agent, LLM

local_llm = LLM(model="ollama/gpt-oss:120b-cloud", base_url="http://localhost:11434", temperature=0.1)

categorizer_agent = Agent(
    role="Expense Categorizer",
    goal="Classify raw expenses into meaningful categories (e.g., Food, Transport, Shopping, Bills, Entertainment)",
    backstory="Expert in financial classification and structured data organization.",
    llm=local_llm,
    verbose=True
)