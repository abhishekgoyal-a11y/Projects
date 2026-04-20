# AI Email Reply Generator

A small beginner-friendly web app: paste an email, choose a tone (Formal, Friendly, or Short), and get an AI-generated reply using the [Groq API](https://console.groq.com/) (OpenAI-compatible format).

## What’s inside

- **`server/`** — Node.js + Express API and static file hosting for the frontend
- **`client/`** — HTML, CSS, and vanilla JavaScript (no build step)

## Prerequisites

- [Node.js](https://nodejs.org/) version 18 or newer
- A Groq API key from [Groq Console](https://console.groq.com/)

## Setup

### 1. Install dependencies

From the project root:

```bash
cd server
npm install
```

### 2. Configure environment variables

Create a file named `.env` inside the `server` folder (same folder as `package.json`).

You can start from the example:

```bash
cp .env.example .env
```

Edit `server/.env` and set your key:

```env
GROQ_API_KEY=your_actual_key_here
```

Optional:

- `GROQ_MODEL` — defaults to `llama-3.3-70b-versatile` if unset
- `PORT` — defaults to `3000` if unset

**Security tip:** Never commit `.env` or share your API key publicly.

### 3. Run the server

Still in `server/`:

```bash
npm start
```

You should see a message like: `Server running at http://localhost:3000`

### 4. Open the frontend

In your browser, open:

**http://localhost:3000**

The Express server serves the files from `client/`, so you do not need a separate dev server for the HTML/CSS/JS.

## API

**`POST /generate-reply`**

JSON body:

```json
{
  "email": "The pasted email text...",
  "tone": "formal"
}
```

`tone` must be one of: `formal`, `friendly`, `short`.

Success response:

```json
{ "reply": "..." }
```

Error response:

```json
{ "error": "Human-readable message" }
```

## Development

To restart the server automatically when you edit `index.js` (Node 18+):

```bash
npm run dev
```

## Notes for beginners

- Empty input is blocked on both the client and server.
- If the Groq API fails, you’ll see a friendly error message instead of a blank screen.
- The textarea has an **8000 character** limit; the server enforces the same limit.
- Use **Copy to clipboard** after a reply is generated to paste into your mail client.

Do not paste highly sensitive emails into third-party AI services unless your organization allows it.
