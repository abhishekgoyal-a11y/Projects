# 🤖 Smart-Routing Multi-Agent System (CrewAI + Ollama)

A production-style, multi-agent AI system built with **CrewAI** and powered entirely by local LLMs via **Ollama**.

Unlike a basic "do-everything" agent, this project utilizes a **Router/Classifier pattern**. It evaluates user queries, calculates confidence scores, and dynamically routes the task to a specialized agent (Math, Weather, or General Knowledge). This ensures higher accuracy, faster execution, and better tool utilization.

---
## 🎥 Video Demo

https://github.com/user-attachments/assets/4072357e-0a3b-4158-977c-16ea9b1661b6



---

## ✨ Features

- **100% Local & Private:** Runs entirely on your machine using Ollama. No OpenAI API keys required.
- **Smart Intent Routing:** Uses a dedicated Classifier Agent to parse queries and assign them to the correct specialist via JSON confidence scores.
- **Tool Integration:**
  - 🧮 **Calculator Tool:** Evaluates complex mathematical string expressions.
  - ⛅ **Weather API Tool:** Fetches real-time weather data using the free Open-Meteo API (No API key needed).
- **Extensible Architecture:** Easily add new agents (e.g., Database Agent, Web Search Agent) by simply updating the Router's JSON instructions.

---

## 🏗️ Architecture Flow

1. **User Input:** User asks a question (e.g., "What is 25 * 48?").
2. **Router Agent:** Analyzes the prompt and outputs a JSON confidence score for each agent.
3. **Execution Delegation:** The system reads the JSON, selects the highest-scoring agent, and ignores the rest.
4. **Specialist Action:** The chosen agent uses its specific tools (if required) to solve the problem.
5. **Final Output:** The synthesized answer is returned to the user.

---

## 🚀 Getting Started

### Prerequisites

1. **Python 3.11 or 3.12** (Avoid pre-release versions like 3.14 to prevent `numpy` compilation errors).
2. **[Ollama](https://ollama.com/)** installed and running on your machine.

### Installation

1. **Clone the repository** (or create a new folder for your project):

   ```bash
   mkdir crewai-smart-agent
   cd crewai-smart-agent
   ```

2. **Create a virtual environment:**

   ```bash
   python -m venv venv

   # Activate on Windows:
   .\venv\Scripts\activate

   # Activate on Mac/Linux:
   source venv/bin/activate
   ```

3. **Install the required Python packages:**

   ```bash
   pip install crewai crewai-tools requests python-dotenv
   ```

4. **Pull your local LLM via Ollama:**

   Make sure the Ollama app is running, then open a terminal and pull your preferred model.
   > **Note:** The code defaults to `gpt-oss:120b-cloud`, but you can use `mistral` or `llama3.2`.

   ```bash
   ollama pull mistral
   ```

---

## 💻 Usage

Run the main script to start the interactive terminal interface:

```bash
python app.py
```

### Example Queries to Try

| Agent | Example Queries |
|-------|----------------|
| 🧮 **Math Agent** | "What is 15% of 2400?" · "Calculate (45 * 3) / 2" |
| ⛅ **Weather Agent** | "Should I carry an umbrella in Delhi today?" · "What is the wind speed in London?" |
| 🧠 **General Agent** | "Who invented Python?" · "Explain quantum computing in one sentence." |

---

## ⚙️ Configuration

To change the local model being used, open `main.py` and modify the `local_llm` configuration block:

```python
local_llm = LLM(
    model="ollama/your-preferred-model",  # e.g., "ollama/mistral" or "ollama/llama3.1"
    base_url="http://localhost:11434",
    temperature=0  # Keep at 0 for best routing/JSON reliability
)
```

---

## 🛠️ Built With

- [CrewAI](https://www.crewai.com/) — Multi-agent orchestration framework
- [Ollama](https://ollama.com/) — Local LLM runner
- [Open-Meteo](https://open-meteo.com/) — Free, open-source weather API
