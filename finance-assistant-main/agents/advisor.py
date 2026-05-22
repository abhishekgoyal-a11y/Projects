from crewai import Agent, LLM

local_llm = LLM(model="ollama/gpt-oss:120b-cloud", base_url="http://localhost:11434", temperature=0.1)

budget_agent = Agent(
    role="Budget Advisor",
    goal="Analyze categorized spending patterns, detect unusual spikes, and suggest savings improvements",
    backstory="Financial analyst specializing in personal finance optimization and finding budget imbalances.",
    llm=local_llm,
    verbose=True
)