from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from dotenv import load_dotenv

load_dotenv()

from services.transcript import get_transcript
from services.qa_chain import build_chain, ask

app = Flask(__name__, static_folder="static", static_url_path="/static")
CORS(app)


@app.route("/")
def index():
    return send_from_directory("static", "index.html")


@app.route("/load", methods=["POST"])
def load_video():
    url = request.json.get("url", "").strip()
    if not url:
        return jsonify({"error": "URL is required"}), 400
    try:
        transcript = get_transcript(url)
        build_chain(transcript)
        return jsonify({"message": "Video loaded successfully."})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/ask", methods=["POST"])
def ask_question():
    question = request.json.get("question", "").strip()
    if not question:
        return jsonify({"error": "Question is required"}), 400
    try:
        return jsonify({"answer": ask(question)})
    except RuntimeError as e:
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(threaded=True, use_reloader=False)
