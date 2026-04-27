# Travel Planner Agent

A Streamlit web app that generates a detailed, day-by-day travel itinerary based on your destination, budget, travel style, and interests — complete with accommodation picks, a food guide, transport options, packing essentials, and money-saving tips. A follow-up Q&A chat lets you refine the plan. Powered by the [Groq API](https://console.groq.com/) with LLaMA 3.3 70B.

## Features

- **Day-by-day itinerary** — morning/afternoon/evening breakdown with estimated daily costs
- **Accommodation recommendations** — 3 options matched to your travel style and budget
- **Food guide** — must-try dishes and restaurant/market picks
- **Getting around** — transport options and local tips
- **Packing essentials** — destination and season specific
- **Money-saving tips** — 3–5 practical suggestions
- **Follow-up chat** — ask the agent to adjust or expand any part of the plan

### Travel styles

Budget Backpacker, Mid-Range Comfort, Luxury, Adventure, Cultural & Historical, Family-Friendly, Digital Nomad.

## Prerequisites

- Python 3.9+
- A Groq API key from [Groq Console](https://console.groq.com/)

## Setup

### 1. Install dependencies

```bash
pip3 install -r requirements.txt
```

### 2. Configure the API key

```bash
mkdir -p .streamlit
```

Create `.streamlit/secrets.toml` with:

```toml
GROQ_API_KEY = "your_groq_api_key_here"
```

### 3. Run the app

```bash
streamlit run app.py
```

Open your browser to **http://localhost:8501**

## Usage

1. Fill in the trip form: destination, origin, number of days, budget per person per day, travel style, pace, number of travelers, and interests.
2. Optionally list things to avoid and any special requirements.
3. Click **Plan My Trip** to generate the full itinerary.
4. Use the **Ask Follow-Up Questions** chat below to refine or expand specific parts.
5. Download the itinerary as a `.txt` file using the download button.

## Notes

- The agent uses real place names where possible but cannot guarantee real-time availability or pricing.
- Hotel and restaurant suggestions reflect the model's training data — always verify before booking.
