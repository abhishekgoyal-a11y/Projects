# AI Workout Planner

AI-powered fitness planner: enter your goal, training days, equipment, and experience level — get a structured weekly workout plan.

## Stack

- **Frontend:** React + Vite + Tailwind CSS
- **Backend:** FastAPI (Python)
- **Planning:** Rule-based split engine + exercise database (works offline)
- **Optional AI:** [Groq](https://console.groq.com) (recommended) or OpenAI for plans & coach chat

## Quick start

### 1. Backend

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

API docs: http://127.0.0.1:8000/docs

### 2. Frontend

```powershell
cd frontend
npm install
npm run dev
```

Open http://localhost:5173

### 3. Docker (optional)

```powershell
docker compose up --build
```

### 4. Groq AI (recommended)

1. Get a free API key at [console.groq.com](https://console.groq.com)
2. Copy `backend/.env.example` → `backend/.env`
3. Set your key:

```
GROQ_API_KEY=gsk_...
GROQ_MODEL=llama-3.3-70b-versatile
AI_PROVIDER=auto
```

4. Restart the backend — header should show **Groq AI**
5. Enable **Use AI-enhanced plan** or use the **Coach** tab

OpenAI still works as fallback: set `OPENAI_API_KEY` and `AI_PROVIDER=openai`.

## Project structure

```
AI_Workout_Planner/
├── backend/
│   └── app/
│       ├── main.py           # API routes
│       ├── models.py         # Request/response schemas
│       ├── split_engine.py   # 3–6 day split logic
│       ├── exercises.py      # Exercise database
│       ├── plan_generator.py # Rule-based planner
│       └── ai_generator.py   # Optional OpenAI layer
└── frontend/
    └── src/
        ├── App.tsx
        └── components/
```

## Features

**v2**
- **Edit plans** — change sets, reps, rest; swap exercises; add/remove moves
- **Save plans** — stored in browser localStorage (Saved tab)
- **Workout history** — mark days complete; streak counter (History tab)

**v3**
- **Injury-aware plans** — select limitations; risky exercises are excluded
- **Nutrition tab** — calorie & macro targets from goal + weight
- **AI coach** — chat for training advice (OpenAI optional)
- **Adaptive plans** — after 3+ logged sessions, bump volume automatically

**v4**
- **Accounts** — register/sign in; plans & history stored in SQLite
- **Export plan** — download weekly plan as Markdown
- **Docker Compose** — run full stack with one command

## API

`GET /api/exercises?goal=muscle_gain&equipment=dumbbells,bench&injuries=knee`

`POST /api/plan/generate`

`POST /api/plan/adapt` — progressive overload from session count

`POST /api/nutrition` — macro targets

`POST /api/coach/chat` — fitness coach messages

`POST /api/auth/register` · `POST /api/auth/login` — user accounts

`GET/POST/DELETE /api/user/plans` · `GET/POST/DELETE /api/user/history` — requires Bearer token

```json
{
  "goal": "muscle_gain",
  "days": 5,
  "equipment": ["dumbbells", "bench"],
  "level": "beginner",
  "use_ai": false
}
```
