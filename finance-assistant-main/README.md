# 💰 AI Personal Finance Assistant

A production-grade, multi-agent AI system built with **CrewAI** and **Streamlit**, powered entirely by local LLMs via **Ollama**.

This application acts as a smart financial advisor. It ingests your raw bank or credit card statements (CSV), uses AI agents to automatically categorize your spending, analyzes your habits for budget optimization, and provides personalized, beginner-friendly investment education based on your unique financial profile.

---

## 🎥 video demo


https://github.com/user-attachments/assets/797d5650-d27a-45eb-937c-0459fc87a45d



---

## ✨ Features

- **100% Local & Private:** Financial data is highly sensitive. This app runs entirely on your local machine using Ollama. No data is sent to OpenAI or any cloud provider.
- **Interactive UI:** Built with Streamlit for a clean, intuitive web dashboard.
- **Automated Data Pipeline:** Uses `pandas` to clean and structure raw CSV data before feeding it to the AI.
- **Multi-Agent Architecture:**
  - 🗂️ **Expense Categorizer:** Classifies raw transactions into meaningful buckets (Food, Transport, Bills, etc.).
  - 📉 **Budget Advisor:** Analyzes categorized spending, detects unusual spikes, and gives 3 concrete savings tips.
  - 🎓 **Investment Educator:** Teaches investment strategies (like SIPs or Mutual Funds) tailored to the savings identified by the Budget Advisor.

---

## 🏗️ Project Structure

The codebase follows a modular, production-ready architecture:

```text
finance-assistant/
│
├── data/
│   └── expenses.csv           # Place your raw transaction data here
│
├── agents/
│   ├── categorizer.py         # AI Agent for categorizing expenses
│   ├── advisor.py             # AI Agent for budget analysis
│   └── educator.py            # AI Agent for financial education
│
├── tools/
│   ├── csv_loader.py          # Pandas logic for ingesting/cleaning data
│   ├── analytics.py           # Helper functions for data calculation
│   └── charts.py              # Streamlit chart rendering logic
│
├── main.py                    # Terminal/CLI entry point
├── dashboard.py               # Streamlit Web UI entry point
├── crew.py                    # CrewAI orchestrator (tasks and delegation)
└── requirements.txt           # Python dependencies
```

---

## 🚀 Getting Started

### Prerequisites

- Python **3.11** or **3.12** installed on your machine.
- [Ollama](https://ollama.com) installed and running.

### Installation

1. **Clone the repository** (or navigate to your project folder):

   ```bash
   cd finance-assistant
   ```

2. **Create and activate a virtual environment:**

   ```bash
   python -m venv venv

   # Activate on Windows:
   .\venv\Scripts\activate

   # Activate on Mac/Linux:
   source venv/bin/activate
   ```

3. **Install the required dependencies:**

   ```bash
   pip install -r requirements.txt
   ```

4. **Pull your local LLM:**

   Ensure the Ollama app is running in the background, then pull the model specified in your agent files (e.g., a 120B model, Mistral, or Llama3).

   ```bash
   ollama pull gpt-oss:120b-cloud
   ```

   > **Note:** You can change the model name in the `agents/` files to match whichever model you prefer to use.

---

## 💻 Usage

### Option 1: Web Dashboard (Recommended)

To launch the interactive web interface, run:

```bash
streamlit run dashboard.py
```

This will open the application in your default web browser. From there, you can upload your CSV file and click **"Analyze with AI Agents"** to see the magic happen.

### Option 2: Command Line Interface (CLI)

If you prefer to run the analysis purely in the terminal:

1. Ensure your CSV is located at `data/expenses.csv`.
2. Run the main script:

   ```bash
   python main.py
   ```

---

## 📊 CSV Format Guide

The system expects a CSV file with at least an `Amount` column. For best results, use the following format:

| Date       | Item             | Amount |
|------------|------------------|--------|
| 2023-10-01 | Swiggy           | 500    |
| 2023-10-05 | Amazon           | 2000   |
| 2023-10-18 | Electricity Bill | 1500   |

---

## 🛠️ Built With

- [CrewAI](https://github.com/joaomdmoura/crewAI) — AI Agent Orchestration
- [Ollama](https://ollama.com) — Local LLM Engine
- [Streamlit](https://streamlit.io) — Frontend Web Framework
- [Pandas](https://pandas.pydata.org) — Data Manipulation
