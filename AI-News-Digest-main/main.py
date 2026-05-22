from dotenv import load_dotenv
load_dotenv()

import uvicorn

if __name__ == "__main__":
    print("🚀 Starting AI News Digest server at http://localhost:8000")
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)
