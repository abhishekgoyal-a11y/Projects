# Memory Card Game 🎮

An advanced AI-powered Memory Card Game built using React + Vite + Tailwind CSS featuring:

- Multiple difficulty levels
- Multiplayer mode
- AI-generated themes using Groq API
- AI hints
- Daily challenges
- Score tracking
- Sound effects
- Leaderboard system
- Local storage persistence

---

# 🚀 Features

## 🎴 Core Gameplay

- Flip and match memory cards
- Smooth card interactions
- Move tracking
- Timer system
- Score calculation
- Restart functionality

---

# 🧠 AI Features

## ✨ AI Theme Generator

Generate custom emoji themes dynamically using Groq API.

Example themes:
- Space
- Animals
- Technology
- Food
- Nature
- Sports

---

## 💡 AI Hint System

AI analyzes:
- Moves
- Matches
- Difficulty

Then gives strategic hints.

---

# 👥 Multiplayer Mode

Local multiplayer support:

- Player 1 vs Player 2
- Turn-based gameplay
- Match scoring system
- Winner announcement

---

# 🏆 Leaderboard

Stores locally using localStorage:

- Best Score
- Least Moves
- Best Time

---

# 🎯 Daily Challenge

Random challenge displayed daily.

Example:
- Win within 20 moves
- Complete under 60 seconds

---

# 🔊 Sound Effects

Includes:
- Card flip sound
- Match sound
- Wrong match sound
- Win sound

---

# 🎨 Difficulty Levels

| Difficulty | Grid Size | Pairs |
|---|---|---|
| Easy | 4x4 | 8 |
| Medium | 6x6 | 18 |
| Hard | 8x8 | 32 |

---

# 🛠️ Tech Stack

## Frontend
- React.js
- Vite
- Tailwind CSS

## AI
- Groq API

## Storage
- localStorage

---

# 📁 Project Structure

```bash
src/
│
├── components/
│   ├── AIHint/
│   ├── AIThemeGenerator/
│   ├── Board/
│   ├── Card/
│   ├── DailyChallenge/
│   ├── DifficultySelector/
│   ├── Leaderboard/
│   ├── MultiplayerToggle/
│   ├── Scoreboard/
│   └── ThemeSelector/
│
├── hooks/
│   └── useTimer.js
│
├── services/
│   ├── groqService.js
│   ├── hintService.js
│   └── themeService.js
│
├── utils/
│   ├── calculateScore.js
│   ├── difficultyConfig.js
│   ├── generateCards.js
│   └── themes.js
│
└── App.jsx
```

---

# ⚙️ Installation

## 1. Clone Project

```bash
git clone <repository-url>
```

---

## 2. Install Dependencies

```bash
npm install
```

---

## 3. Start Development Server

```bash
npm run dev
```

---

# 🔑 Environment Variables

Create `.env` file:

```env
VITE_GROQ_API_KEY=your_groq_api_key
```

---

# 🌐 Groq API Setup

1. Visit:

https://console.groq.com/

2. Create API key

3. Add key to `.env`

---

# 🎵 Sound Assets

Place sound files inside:

```bash
public/sounds/
```

Required files:

```bash
flip.mp3
match.mp3
wrong.mp3
win.mp3
```

---

# 🧮 Score Formula

```text
Score =
(PairsMatched × 100)
- (Moves × 2)
- (Time × 1)
```

---

# 💾 Local Storage Usage

Stores:
- Game progress
- Best score
- Best moves
- Best time

---

# 🔥 Future Improvements

- Online multiplayer
- Real-time PvP
- Global leaderboard
- User authentication
- Backend integration
- Achievements system
- Mobile app version

---

# output 



https://github.com/user-attachments/assets/6a4d07b1-c5d2-4b8e-8f13-273dcefa1cac



# 👨‍💻 Author

Developed by Harshi Suru

---
