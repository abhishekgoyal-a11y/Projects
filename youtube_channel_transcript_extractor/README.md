# YouTube Channel Transcript Extractor

Small Python tool that lists every public video on a YouTube channel, downloads **YouTube’s own** captions (manual or auto-generated), and saves **one `.txt` file per video**. No paid APIs and no speech-to-text—only data YouTube already exposes for captions.

## Setup

Python 3.10+ recommended.

```bash
cd youtube_channel_transcript_extractor
python3 -m venv .venv
source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip3 install -r requirements.txt
```

Dependencies are listed in `requirements.txt` (**yt-dlp**, **youtube-transcript-api**, **truststore**, **certifi**).

## Run

Point at a channel URL. You can use the **Videos** tab URL, or paste `https://www.youtube.com/@SomeChannel` alone—the script appends `/videos` for `@` handles so listing matches the uploads tab.

```bash
python3 extract_channel_transcripts.py "https://www.youtube.com/@SomeChannel/videos"
```

Outputs go under `./transcripts/` by default, **one subfolder per channel** (e.g. `transcripts/@SomeChannel/`) so runs for different channels stay separate. Each file is named:

`{sanitized title}__{video id}.txt`

Use **`--no-channel-subdir`** if you want every `.txt` directly in `-o` with no extra folder.

### Useful options


| Flag                  | Meaning                                                                                                  |
| --------------------- | -------------------------------------------------------------------------------------------------------- |
| `-o DIR`              | Base output directory (default: `transcripts`); each channel gets a subfolder under here unless disabled |
| `--no-channel-subdir` | Put `.txt` files directly in `-o` (old flat layout)                                                      |
| `--subfolder NAME`    | Force the subfolder name under `-o` instead of auto-detect from the URL                                  |
| `--languages en,es` | Preferred caption languages (default: `en`) |
| `--proxy URL` | HTTP(S) or SOCKS proxy for **transcript** requests only (helps when YouTube blocks or rate-limits your IP). For `socks5://…`, install **`PySocks`** (`pip install PySocks`) if requests errors. |
| `--delay 1.0` | Pause between transcript requests in seconds (default **1.0**; increase if you see blocks) |
| `--retries 3`         | Retries on transient YouTube HTTP errors per video (default: 3)                                          |
| `--retry-backoff 1.5` | Base delay in seconds; backoff doubles each retry (default: 1.5)                                         |
| `--max-videos N`      | Process only the first N videos after listing (dry run or partial export)                                |
| `--insecure`          | Skip TLS verify for yt-dlp only if SSL still fails (last resort)                                         |
| `-v`                  | Verbose logging                                                                                          |


Videos without captions (or with errors) are skipped, logged, and listed in **`_skipped.txt`** in that channel’s output folder when anything was skipped.

When the run finishes, the script prints a short **summary** (videos listed, transcripts saved, skipped).

## How it works

1. **yt-dlp** — Enumerates video IDs and titles from the channel or playlist URL (no API key). Auto subfolder names use `@handle`, `channel/UC…`, `c/…`, `user/…`, or `playlist_<id>` where applicable.
2. **youtube-transcript-api** — Reads timed caption tracks the same way the site does (not a third-party STT service). Prefers your `--languages` order, then falls back to any caption track YouTube exposes for that video.

## Notes

- **Scale (500+ videos):** The script runs **sequentially** with a small delay between requests to reduce rate limits. For very large channels, consider running overnight or tuning `--delay` if you see many retries.
- **SSL errors (macOS / office networks):** At startup the script prefers **`truststore.inject_into_ssl()`** so Python uses your **operating system trust store** (macOS Keychain, Windows Certificate Store, etc.). That fixes many macOS setups and **corporate TLS inspection** (for example Zscaler), where `certifi` alone is not enough. If `truststore` is not installed, it falls back to **certifi** and related env vars. If you must skip all of that, set **`CHANNEL_TRANSCRIPT_SSL_DEFAULT=1`**. If listing still fails, use **`--insecure`** (disables TLS verify for yt-dlp only; avoid on untrusted networks).
- **YouTube “blocking requests from your IP”:** After many transcript downloads, or on some corporate / cloud egress IPs, YouTube may return **Request blocked** for every video. Mitigations: wait and retry later, run from a different network, increase **`--delay`**, and/or pass **`--proxy URL`** so transcript requests use a residential or low-abuse proxy (same URL format as [requests proxies](https://requests.readthedocs.io/en/latest/user/advanced/#proxies)). Listing still uses **yt-dlp** only; configure a system VPN separately if listing is blocked too.
- **Private / members-only / age-gated** videos may not list or may fail; those are skipped and recorded.
- **Delivering `.txt` files:** Run the script locally; it writes files into your chosen output folder. There is nothing to upload from this repo until you run it against your channel.

## License

Use and modify freely for your own channels and projects.