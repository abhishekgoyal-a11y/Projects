from youtube_transcript_api import YouTubeTranscriptApi
from urllib.parse import urlparse, parse_qs


def extract_video_id(url: str) -> str:
    parsed = urlparse(url)
    if parsed.hostname == "youtu.be":
        return parsed.path.lstrip("/").split("?")[0]
    if parsed.hostname in ("www.youtube.com", "youtube.com"):
        qs = parse_qs(parsed.query)
        if "v" in qs:
            return qs["v"][0]
    raise ValueError("Invalid YouTube URL")


def get_transcript(url: str) -> str:
    api = YouTubeTranscriptApi()
    transcript_list = api.list(extract_video_id(url))

    for t in transcript_list:
        if t.language_code.startswith("en"):
            return " ".join(c.text for c in t.fetch())

    # fallback to first available language
    for t in transcript_list:
        return " ".join(c.text for c in t.fetch())

    raise ValueError("No transcript available for this video.")
