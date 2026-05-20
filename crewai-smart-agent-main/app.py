import os
import json
import re
import requests
from dotenv import load_dotenv
from crewai import Agent, Task, Crew, LLM
from crewai.tools import tool

# Load environment variables (for WEATHER_API_KEY)
load_dotenv()

# Prevent CrewAI from throwing validation errors for OpenAI
os.environ["OPENAI_API_KEY"] = "NA"

# Using your specific 120B model via LangChain's ChatOllama
# ==========================================
# 1. Configure Local LLM via Ollama
# ==========================================

local_llm = LLM(
    model="ollama/gpt-oss:120b-cloud", 
    base_url="http://localhost:11434",
    temperature=0
)

# ==========================================
# 2. Define Tools
# ==========================================

@tool("Calculator Tool")
def calculate(expression: str) -> str:
    """Useful for performing mathematical calculations. Input should be a math expression."""
    try:
        return str(eval(expression))
    except Exception as e:
        return f"Error calculating: {e}"

@tool("Weather API Tool")
def get_weather(city: str) -> str:
    """Fetches current weather information for a given city using Open-Meteo."""
    
    # Step 1: Convert the city name to latitude and longitude
    geocode_url = f"https://geocoding-api.open-meteo.com/v1/search?name={city}&count=1&language=en&format=json"
    geo_response = requests.get(geocode_url)
    
    if geo_response.status_code != 200 or not geo_response.json().get("results"):
        return f"Error: Could not find coordinates for the city '{city}'."
        
    location = geo_response.json()["results"][0]
    lat = location["latitude"]
    lon = location["longitude"]
    resolved_city = location["name"]
    
    # Step 2: Fetch the actual weather data using those coordinates
    weather_url = f"https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}&current=temperature_2m,wind_speed_10m"
    weather_response = requests.get(weather_url)
    
    if weather_response.status_code == 200:
        data = weather_response.json()
        temp = data["current"]["temperature_2m"]
        wind = data["current"]["wind_speed_10m"]
        return f"The current temperature in {resolved_city} is {temp}°C with a wind speed of {wind} km/h."
    else:
        return f"Error: Could not fetch weather details for {resolved_city}."
# ==========================================
# 3. Define CrewAI Agents
# ==========================================

classifier_agent = Agent(
    role="Router & Intent Classifier",
    goal="Analyze user queries and assign confidence scores for different execution domains.",
    backstory="You are a strict, analytical routing engine. You only output JSON. You analyze prompts and determine if they require mathematical calculation, weather APIs, or general knowledge.",
    llm=local_llm,
    verbose=False # Keep the router quiet in the terminal output
)

math_agent = Agent(
    role="Math Specialist",
    goal="Solve mathematical problems accurately",
    backstory="Expert in arithmetic and numerical reasoning",
    tools=[calculate],
    llm=local_llm,
    verbose=True
)

weather_agent = Agent(
    role="Weather Expert",
    goal="Provide accurate weather information",
    backstory="Expert in interpreting weather data and advising users",
    tools=[get_weather],
    llm=local_llm,
    verbose=True
)

general_agent = Agent(
    role="General Knowledge Expert",
    goal="Answer general questions clearly and accurately",
    backstory="Expert in multiple domains of knowledge. You handle questions that don't need math or weather tools.",
    llm=local_llm,
    verbose=True
)

# ==========================================
# 4. Define Execution Flow
# ==========================================

def ask_crew(user_question: str):
    """Phase 1: Generate Confidence Scores via Router"""
    
    classifier_task = Task(
        description=f"""Analyze this user query: '{user_question}'
        Assign a confidence score from 0.0 to 1.0 for each category based on who is best equipped to handle it:
        - "math_agent": Query requires arithmetic, calculations, or solving math problems.
        - "weather_agent": Query asks about temperature, forecasts, or current weather conditions.
        - "general_agent": Query is a standard question, factual inquiry, or conversational.
        
        You MUST output ONLY a valid JSON object. Do not include any other text.
        Example format: {{"math_agent": 0.9, "weather_agent": 0.0, "general_agent": 0.1}}""",
        expected_output="A pure JSON object containing confidence scores for the three agents.",
        agent=classifier_agent
    )

    print("\n[Router] Analyzing intent and calculating confidence scores...")
    classifier_crew = Crew(agents=[classifier_agent], tasks=[classifier_task], verbose=False)
    raw_scores_output = classifier_crew.kickoff()
    
    # Clean the LLM output to ensure we extract just the JSON dictionary
    try:
        json_match = re.search(r'\{.*\}', str(raw_scores_output), re.DOTALL)
        if json_match:
            scores = json.loads(json_match.group())
        else:
            scores = json.loads(str(raw_scores_output))
            
        print(f"[Router] Confidence Scores: {json.dumps(scores, indent=2)}")
        
        # Find the agent with the highest score
        winning_agent_name = max(scores, key=scores.get)
        print(f"[Router] Selected: {winning_agent_name.upper()} (Score: {scores[winning_agent_name]})\n")
        
    except Exception as e:
        print(f"[Router Warning] Failed to parse scores, defaulting to General Agent. Error: {e}")
        print(f"[Raw Output Was]: {raw_scores_output}")
        winning_agent_name = "general_agent"

    """Phase 2: Execution via the Winning Agent"""
    
    # Map the string name back to the actual agent object
    agent_mapping = {
        "math_agent": math_agent,
        "weather_agent": weather_agent,
        "general_agent": general_agent
    }
    
    selected_agent = agent_mapping.get(winning_agent_name, general_agent)

    # Create the final task strictly for the winner
    execution_task = Task(
        description=f"Answer the following user query directly and accurately: '{user_question}'",
        expected_output="The final answer to the user's query.",
        agent=selected_agent
    )

    execution_crew = Crew(
        agents=[selected_agent],
        tasks=[execution_task],
        verbose=True
    )

    return execution_crew.kickoff()

# ==========================================
# 5. Run the System
# ==========================================

if __name__ == "__main__":
    print("🤖 Local Smart-Routing AI System Initialized!")
    print("Powered by Ollama + CrewAI")
    print("Type 'exit' to quit.\n")
    
    while True:
        query = input("Ask a question: ")
        if query.lower() == 'exit':
            break
            
        result = ask_crew(query)
        print("\n=== Final Answer ===")
        print(result)
        print("====================\n")