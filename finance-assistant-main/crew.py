from crewai import Task, Crew
from agents.categorizer import categorizer_agent
from agents.advisor import budget_agent
from agents.educator import educator_agent

def create_finance_crew(raw_data_string: str):
    """Assembles the agents and defines their tasks based on the input data."""
    
    categorize_task = Task(
        description=f"Review the following raw transaction data and categorize each item into a logical spending bucket (Food, Transport, Bills, etc.). Return a clean summary of total spent per category.\n\nData:\n{raw_data_string}",
        expected_output="A structured summary showing total spending broken down by category.",
        agent=categorizer_agent
    )

    budget_task = Task(
        description="Review the categorized spending summary provided by the Categorizer. Identify the highest spending areas, flag any high discretionary spending, and provide 3 concrete tips on how to save money next month.",
        expected_output="A budget analysis report with specific savings recommendations.",
        agent=budget_agent
    )

    education_task = Task(
        description="Based on the savings recommendations from the Budget Advisor, explain one investment strategy (like a SIP or high-yield savings account) that the user could use with their saved money. Keep it beginner-friendly.",
        expected_output="A short educational summary on an investment concept.",
        agent=educator_agent
    )

    return Crew(
        agents=[categorizer_agent, budget_agent, educator_agent],
        tasks=[categorize_task, budget_task, education_task],
        verbose=True
    )