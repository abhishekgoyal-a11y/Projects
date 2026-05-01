#!/usr/bin/env python3
"""
Fetch all public transcripts for a YouTube channel and save one .txt per video.

Uses yt-dlp to enumerate videos (no API key) and youtube-transcript-api to read
YouTube's own caption tracks (manual or auto-generated).
"""

from __future__ import annotations

import argparse
import hashlib
import logging
import os
import re
import sys
import time
from pathlib import Path
from typing import Any


def _bootstrap_ssl() -> None:
    """
    Make HTTPS verification succeed on:
    - macOS python.org builds with an empty default CA store
    - Corporate networks (Zscaler, etc.) that MITM TLS using roots in the OS
      keychain — certifi alone cannot verify those connections.

    Uses truststore (OS trust) when available, then certifi + env vars as fallback.
    Set CHANNEL_TRANSCRIPT_SSL_DEFAULT=1 to skip and use the process default.
    """
    if os.environ.get("CHANNEL_TRANSCRIPT_SSL_DEFAULT") == "1":
        return
    try:
        import truststore

        truststore.inject_into_ssl()
    except ImportError:
        try:
            import ssl

            import certifi

            ca = certifi.where()
            os.environ["SSL_CERT_FILE"] = ca
            os.environ["REQUESTS_CA_BUNDLE"] = ca
            os.environ["CURL_CA_BUNDLE"] = ca

            def _ctx() -> ssl.SSLContext:
                return ssl.create_default_context(cafile=ca)

            ssl._create_default_https_context = _ctx  # type: ignore[method-assign]
        except ImportError:
            pass


_bootstrap_ssl()

from youtube_transcript_api import YouTubeTranscriptApi
from youtube_transcript_api._errors import (
    NoTranscriptFound,
    RequestBlocked,
    TranscriptsDisabled,
    VideoUnavailable,
    YouTubeRequestFailed,
)
from youtube_transcript_api.proxies import GenericProxyConfig
from yt_dlp import YoutubeDL

LOG = logging.getLogger("channel_transcripts")


def build_transcript_client(proxy_url: str | None) -> YouTubeTranscriptApi:
    """youtube-transcript-api 1.x client; optional HTTP(S) proxy for transcript fetches."""
    u = proxy_url.strip() if proxy_url else ""
    if u:
        cfg = GenericProxyConfig(http_url=u, https_url=u)
        return YouTubeTranscriptApi(proxy_config=cfg)
    return YouTubeTranscriptApi()


def normalize_channel_url(url: str) -> str:
    u = url.strip()
    if "youtube.com/@" in u and "/videos" not in u.split("?", 1)[0]:
        # Prefer /videos tab so listing matches "all uploads" users expect
        base = u.split("?", 1)[0].rstrip("/")
        if not re.search(r"/@[^/]+/videos$", base):
            q = ""
            if "?" in u:
                q = "?" + u.split("?", 1)[1]
            return base.rstrip("/") + "/videos" + q
    return u


def sanitize_filename(name: str, max_len: int = 120) -> str:
    s = re.sub(r'[<>:"/\\|?*\x00-\x1f]', "_", name)
    s = re.sub(r"\s+", " ", s).strip()
    if not s:
        s = "untitled"
    return s[:max_len].rstrip(" .")


def output_subdir_for_channel_url(url: str) -> str:
    """
    Derive a stable folder name from a channel / uploads / playlist URL.
    Used so multiple channel runs do not mix .txt files in one directory.
    """
    raw = url.strip()
    path_only = raw.split("?", 1)[0].rstrip("/")

    m = re.search(r"youtube\.com/@([^/?#]+)", path_only)
    if m:
        return sanitize_filename("@" + m.group(1), max_len=80)

    m = re.search(r"youtube\.com/channel/([^/?#]+)", path_only)
    if m:
        return sanitize_filename(m.group(1), max_len=80)

    m = re.search(r"youtube\.com/c/([^/?#]+)", path_only)
    if m:
        return sanitize_filename(m.group(1), max_len=80)

    m = re.search(r"youtube\.com/user/([^/?#]+)", path_only)
    if m:
        return sanitize_filename(m.group(1), max_len=80)

    m = re.search(r"[?&]list=([^&]+)", raw)
    if m:
        pl = re.sub(r"[^a-zA-Z0-9_-]", "_", m.group(1))
        return sanitize_filename("playlist_" + pl, max_len=80)

    return "channel_" + hashlib.sha256(raw.encode()).hexdigest()[:12]


def resolve_output_dir(
    base: Path, channel_url: str, *, use_subdir: bool, subfolder_override: str | None
) -> Path:
    if not use_subdir:
        return base
    override = subfolder_override.strip() if subfolder_override else None
    name = (
        sanitize_filename(override, max_len=80)
        if override
        else output_subdir_for_channel_url(channel_url)
    )
    return base / name


def list_channel_videos(
    channel_url: str, max_videos: int | None, *, insecure_ssl: bool
) -> list[dict[str, str]]:
    opts: dict[str, Any] = {
        "quiet": True,
        "no_warnings": True,
        "extract_flat": "in_playlist",
        "playlistend": max_videos,
        "ignoreerrors": True,
        "skip_download": True,
    }
    if insecure_ssl:
        opts["nocheckcertificate"] = True
    out: list[dict[str, str]] = []
    with YoutubeDL(opts) as ydl:
        info = ydl.extract_info(channel_url, download=False)
        if not info:
            return out
        entries = info.get("entries") or []
        for e in entries:
            if not e or not isinstance(e, dict):
                continue
            vid = e.get("id")
            if not vid:
                continue
            title = e.get("title") or vid
            out.append({"id": vid, "title": str(title)})
    return out


def fetch_transcript_text(
    api: YouTubeTranscriptApi, video_id: str, languages: list[str] | None
) -> str:
    """
    Return plain transcript text using YouTube-hosted captions only.
    Prefers manual captions, then auto-generated, in the given language order;
    if none match, uses any available track on the video.
    """
    langs = languages or ["en"]
    tlist = api.list(video_id)

    def try_fetch(tr: Any) -> str:
        fetched = tr.fetch()
        lines = [s.text.strip() for s in fetched if getattr(s, "text", "").strip()]
        return "\n".join(lines)

    try:
        return try_fetch(tlist.find_transcript(langs))
    except NoTranscriptFound:
        pass

    # Any available transcript (still YouTube data, not third-party STT)
    for tr in tlist:
        try:
            return try_fetch(tr)
        except Exception:
            continue

    raise NoTranscriptFound(video_id, langs, tlist)


def extract_with_retries(
    api: YouTubeTranscriptApi,
    video_id: str,
    languages: list[str] | None,
    retries: int,
    backoff: float,
) -> str:
    last: Exception | None = None
    for attempt in range(retries + 1):
        try:
            return fetch_transcript_text(api, video_id, languages)
        except YouTubeRequestFailed as e:
            last = e
            if attempt < retries:
                time.sleep(backoff * (2**attempt))
        except RequestBlocked as e:
            last = e
            if attempt < retries:
                # YouTube often rate-limits or blocks datacenter IPs; wait longer before retry.
                time.sleep(backoff * (2**attempt) + 8.0)
        except Exception as e:
            last = e
            break
    if last:
        raise last
    raise RuntimeError("unexpected")


def skip_reason_for_exception(e: BaseException) -> str:
    if isinstance(e, RequestBlocked):
        return "youtube_request_blocked"
    return type(e).__name__


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Download YouTube captions for every public video on a channel."
    )
    parser.add_argument(
        "channel_url",
        help="Channel URL (e.g. https://www.youtube.com/@Handle/videos)",
    )
    parser.add_argument(
        "-o",
        "--output-dir",
        type=Path,
        default=Path("transcripts"),
        help="Base directory for exports (default: ./transcripts). "
        "By default each channel gets its own subfolder under here.",
    )
    parser.add_argument(
        "--no-channel-subdir",
        action="store_false",
        dest="channel_subdir",
        help="Write all .txt files directly under -o (no per-channel subfolder).",
    )
    parser.add_argument(
        "--subfolder",
        default=None,
        metavar="NAME",
        help="Use this subfolder name under -o instead of auto-detecting from the URL.",
    )
    parser.add_argument(
        "--languages",
        default="en",
        help="Comma-separated language codes to prefer (default: en)",
    )
    parser.add_argument(
        "--proxy",
        metavar="URL",
        default=None,
        help="HTTP(S) proxy URL for transcript fetches only, e.g. http://127.0.0.1:8080 "
        "or socks5://user:pass@host:port (same format as curl/requests). "
        "Helps when YouTube blocks or rate-limits your IP.",
    )
    parser.add_argument(
        "--delay",
        type=float,
        default=1.0,
        help="Seconds to sleep between transcript requests (default: 1.0; increase if blocked)",
    )
    parser.add_argument(
        "--retries",
        type=int,
        default=3,
        help="Retries per video on transient YouTube errors (default: 3)",
    )
    parser.add_argument(
        "--retry-backoff",
        type=float,
        default=1.5,
        help="Base backoff seconds for retries (default: 1.5)",
    )
    parser.add_argument(
        "-v",
        "--verbose",
        action="store_true",
        help="Verbose logging",
    )
    parser.add_argument(
        "--max-videos",
        type=int,
        default=None,
        metavar="N",
        help="Only process the first N videos after listing (optional dry run / partial export)",
    )
    parser.add_argument(
        "--insecure",
        action="store_true",
        help="Disable TLS certificate verification for yt-dlp (listing only). "
        "Use only if you still see SSL errors after truststore/certifi; traffic can be intercepted.",
    )
    parser.set_defaults(channel_subdir=True)
    args = parser.parse_args()

    logging.basicConfig(
        level=logging.DEBUG if args.verbose else logging.INFO,
        format="%(levelname)s: %(message)s",
    )

    channel_url = normalize_channel_url(args.channel_url)
    languages = [x.strip() for x in args.languages.split(",") if x.strip()]

    output_dir = resolve_output_dir(
        args.output_dir,
        channel_url,
        use_subdir=args.channel_subdir,
        subfolder_override=args.subfolder,
    )
    output_dir.mkdir(parents=True, exist_ok=True)
    LOG.info("Output directory: %s", output_dir.resolve())

    ytt = build_transcript_client(args.proxy)
    if args.proxy:
        LOG.info("Transcript requests use --proxy")

    if args.insecure:
        LOG.warning(
            "TLS verification disabled for video listing (--insecure). "
            "Not recommended on untrusted networks."
        )

    LOG.info("Listing videos (yt-dlp): %s", channel_url)
    videos = list_channel_videos(
        channel_url, args.max_videos, insecure_ssl=args.insecure
    )
    if not videos:
        LOG.error("No videos found. Try adding /videos to the channel URL.")
        return 1

    LOG.info("Found %d video(s). Saving transcripts to %s", len(videos), output_dir.resolve())

    ok = 0
    skipped: list[tuple[str, str, str]] = []

    for i, v in enumerate(videos, start=1):
        vid = v["id"]
        title = v["title"]
        stem = sanitize_filename(title)
        path = output_dir / f"{stem}__{vid}.txt"

        try:
            text = extract_with_retries(
                ytt,
                vid,
                languages,
                retries=args.retries,
                backoff=args.retry_backoff,
            )
            if not text.strip():
                skipped.append((vid, title, "empty transcript"))
                LOG.warning("[%d/%d] SKIP empty: %s (%s)", i, len(videos), title, vid)
            else:
                path.write_text(text, encoding="utf-8")
                ok += 1
                LOG.info("[%d/%d] OK: %s", i, len(videos), path.name)
        except TranscriptsDisabled:
            skipped.append((vid, title, "transcripts disabled"))
            LOG.warning("[%d/%d] SKIP (no captions): %s (%s)", i, len(videos), title, vid)
        except VideoUnavailable:
            skipped.append((vid, title, "video unavailable"))
            LOG.warning("[%d/%d] SKIP (unavailable): %s (%s)", i, len(videos), title, vid)
        except NoTranscriptFound:
            skipped.append((vid, title, "no transcript found"))
            LOG.warning("[%d/%d] SKIP (no transcript): %s (%s)", i, len(videos), title, vid)
        except RequestBlocked as e:
            skipped.append((vid, title, skip_reason_for_exception(e)))
            if args.verbose:
                LOG.warning(
                    "[%d/%d] SKIP (YouTube blocked / rate-limited): %s (%s)\n%s",
                    i,
                    len(videos),
                    title,
                    vid,
                    e,
                )
            else:
                LOG.warning(
                    "[%d/%d] SKIP (YouTube blocked or rate-limited this IP — "
                    "try --proxy, higher --delay, or retry later): %s (%s)",
                    i,
                    len(videos),
                    title,
                    vid,
                )
        except Exception as e:
            skipped.append((vid, title, skip_reason_for_exception(e)))
            if args.verbose:
                LOG.warning("[%d/%d] SKIP: %s (%s)", i, len(videos), title, vid, exc_info=True)
            else:
                LOG.warning(
                    "[%d/%d] SKIP (%s): %s (%s)",
                    i,
                    len(videos),
                    type(e).__name__,
                    title,
                    vid,
                )

        if args.delay > 0 and i < len(videos):
            time.sleep(args.delay)

    skip_log = output_dir / "_skipped.txt"
    if skipped:
        lines = [f"{vid}\t{reason}\t{title}" for vid, title, reason in skipped]
        skip_log.write_text("\n".join(lines) + "\n", encoding="utf-8")
        LOG.info("Wrote skip list: %s", skip_log)

    LOG.info("--- summary ---")
    LOG.info("Videos listed: %d", len(videos))
    LOG.info("Transcripts saved: %d", ok)
    LOG.info("Skipped: %d", len(skipped))
    return 0


if __name__ == "__main__":
    sys.exit(main())
