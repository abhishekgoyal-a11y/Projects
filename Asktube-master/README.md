# 🎬 AskTube — YouTube Q&A Bot

AskTube lets you have a conversation with any YouTube video. Paste a video link, and the app automatically fetches the transcript, breaks it into chunks, and builds a searchable vector index. You can then ask any question about the video and get accurate, context-aware answers powered by LLaMA 3 — no manual note-taking or scrubbing through the video required.

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | Flask, LangChain, FAISS |
| LLM | LLaMA 3.3 70B via Groq (free) |
| Embeddings | HuggingFace `all-MiniLM-L6-v2` |
| Transcript | youtube-transcript-api |
| Frontend | HTML, CSS, JavaScript |

## Setup

1. Clone the repo
   ```bash
   git clone https://github.com/rbbhadiyar/Asktube.git
   cd Asktube
   ```

2. Install dependencies
   ```bash
   pip install -r requirements.txt
   ```

3. Create `.env` from the example
   ```bash
   cp .env.example .env
   ```
   Fill in your API keys:
   - **GROQ_API_KEY** → [console.groq.com](https://console.groq.com)
   - **HUGGINGFACE_API_KEY** → [huggingface.co/settings/tokens](https://huggingface.co/settings/tokens)

4. Run
   ```bash
   python app.py
   ```

5. Open [http://localhost:5000](http://localhost:5000)

---

## Screenshots

### Loading a Video
> Paste any YouTube URL and hit Load Video. The status card shows live progress as the transcript is fetched and the vector index is built in the background.

![Loading State](assets/Screenshot%202026-05-19%20165850.png)

### Chatting with the Video
> Once the video is loaded, ask anything about it. AskTube retrieves the most relevant parts of the transcript and generates a precise answer using LLaMA 3.

![Chat State](assets/Screenshot%202026-05-19%20170103.png)

## Demo
> A full walkthrough — loading a video and asking questions about it in real time.

https://github.com/user-attachments/assets/5b370db0-37a5-4a86-867d-002459575348
