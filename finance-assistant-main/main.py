import os
from tools.csv_loader import load_csv
from crew import create_finance_crew

# Prevent CrewAI OpenAI validation errors
os.environ["OPENAI_API_KEY"] = "NA"

if __name__ == "__main__":
    print("🤖 Local AI Finance Assistant Initialized!")
    print("Loading data/expenses.csv...\n")
    
    # Load and clean the data
    df = load_csv("data/expenses.csv")
    
    # Create and run the Crew
    finance_crew = create_finance_crew(df.to_string())
    result = finance_crew.kickoff()
    
    print("\n=== Final Financial Report ===")
    print(result)
    print("==============================\n")