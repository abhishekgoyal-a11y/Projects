from crewai import Agent, LLM

local_llm = LLM(model="ollama/gpt-oss:120b-cloud", base_url="http://localhost:11434", temperature=0.1)

educator_agent = Agent(
    role="Investment Educator",
    goal="Teach users about saving and investing based on their specific financial habits",
    backstory="Financial educator focused on giving beginner-friendly advice, like explaining SIPs or mutual funds. You do not give legal financial directives.",
    llm=local_llm,
    verbose=True
)