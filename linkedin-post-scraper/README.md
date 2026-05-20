# LinkedIn Feed Scraper — Chrome Extension (Manifest V3)

A personal-use Chrome extension that opens your LinkedIn feed, scrolls it
automatically with human-like delays, scrapes each visible post (author
name, author profile URL, post URL, full text), de-duplicates, and lets you
export the result as JSON or CSV.

> **Important — read before using**
>
> Automated scraping of LinkedIn is **against LinkedIn's Terms of Service**
> and may result in rate limiting, captchas, or account restriction. This
> tool is intended for **personal, low-volume use on your own feed only**
> (e.g. exporting posts you've already seen for personal archive or
> research). You are responsible for how you use it. Do not use it to
> scrape other users' private data or at scale.

---

## Features

- Manifest V3 with a service-worker background script.
- Popup UI: target post count, Start / Stop, live progress, JSON / CSV export, clear data.
- Content script that scrolls with randomized intervals and step sizes.
- Resilient post extraction with multiple selector fallbacks and "see more" auto-expansion.
- Duplicate suppression via LinkedIn `urn:li:activity:*` IDs.
- Retry logic on extraction failures and graceful handling of stalled feeds.
- Data persisted to `chrome.storage.local`; survives popup close and reload.
- JSON & CSV export via `chrome.downloads`.

## Folder Structure

```
chromeexte/
├── manifest.json
├── README.md
├── popup/
│   ├── popup.html
│   ├── popup.css
│   └── popup.js
├── content/
│   ├── content.js        # scroll loop + collection
│   └── scraper.js        # DOM extraction utilities
├── background/
│   └── background.js     # MV3 service worker (export, coordination)
├── utils/
│   ├── helpers.js        # shared DOM/sleep/CSV helpers (content world)
│   ├── storage.js        # ES module — chrome.storage.local wrappers
│   └── export.js         # ES module — JSON/CSV download
└── icons/
    ├── icon16.png
    ├── icon32.png
    ├── icon48.png
    └── icon128.png       # see icons/README.txt
```

## Installation

1. Clone or download this folder.
2. Add icon PNGs (16, 32, 48, 128) in `icons/`. Any square PNGs work — see
   `icons/README.txt` for details. The extension loads without them but
   Chrome will log warnings.
3. Open `chrome://extensions` in Chrome.
4. Enable **Developer mode** (top-right toggle).
5. Click **Load unpacked** and select the `chromeexte/` folder.
6. Pin the extension to the toolbar for easy access.

## Usage

1. Log in to LinkedIn in your browser.
2. Click the extension icon. The popup opens.
3. Enter the **number of posts to scrape** (e.g. 100).
4. Click **Start Scraping**.
   - If you're not on the feed, the extension opens
     `https://www.linkedin.com/feed/` automatically.
   - The page begins scrolling with randomized delays.
   - The popup shows live progress and a log tail.
5. Click **Stop Scraping** at any time. Collected posts are preserved.
6. Click **Download JSON** or **Download CSV** to save the data.
7. **Clear Data** wipes the local store when you're done.

The popup can be closed while scraping continues — progress is read back
from storage when you reopen it.

## Output Schema

Each post looks like:

```json
{
  "id": "urn:li:activity:7193456789012345678",
  "urn": "urn:li:activity:7193456789012345678",
  "authorName": "Jane Doe",
  "authorUrl": "https://www.linkedin.com/in/janedoe/",
  "postUrl": "https://www.linkedin.com/feed/update/urn:li:activity:7193456789012345678/",
  "text": "Excited to share that…",
  "scrapedAt": "2025-05-20T18:42:11.000Z"
}
```

CSV uses the same fields as headers (RFC 4180 escaping).

## How It Works

- **Content script** (`content/content.js`) injects on `linkedin.com/feed/*`.
  It listens for `START_SCRAPE` from the popup, then enters a loop:
  scroll → wait randomized 1.4–2.8 s → click any "Show more" button → run
  `Scraper.findPostNodes()` and `scrapePost()` → de-duplicate by URN →
  persist to `chrome.storage.local`. Stops when target reached, user
  clicks Stop, the feed stalls 5 times in a row, or 30 minutes elapse.
- **Scraper module** (`content/scraper.js`) holds extraction selectors and
  tries multiple fallbacks because LinkedIn's class names rotate often.
- **Helpers** (`utils/helpers.js`) gives both content scripts shared
  utilities on `globalThis.LFS` (sleep, randInt, retry, CSV, etc.).
- **Background worker** (`background/background.js`) is intentionally thin
  — it only handles `EXPORT` messages so downloads work even if the popup
  closes. ES modules are enabled (`"type": "module"`).
- **Popup** (`popup/popup.js`) opens / sends messages to the active feed
  tab, displays progress streamed via `chrome.runtime.sendMessage`, and
  reads persisted state on open.

## Anti-Detection Notes

The extension uses randomized scroll step sizes (600–1100 px) and pause
intervals (1.4–2.8 s) to look more human. It does not bypass any LinkedIn
defenses — if LinkedIn presents a captcha or rate-limit, the scrolling
will simply stall and the script will exit after 5 unproductive scrolls.

If you hit issues:

- Slow down by editing `SCROLL_MIN_MS` / `SCROLL_MAX_MS` in `content/content.js`.
- Reduce target count.
- Reload the feed and re-run (the script resumes against the existing
  de-dup set).

## Development

There's no build step — it's plain ES modules and DOM JS. After editing:

1. Go to `chrome://extensions`.
2. Click the **reload** icon on the LinkedIn Feed Scraper card.
3. Refresh the LinkedIn feed tab.

## Troubleshooting

| Symptom | Likely cause |
| --- | --- |
| "Content script did not respond" | Reload the LinkedIn tab so the content script re-injects. |
| Counter stuck at 0 | LinkedIn changed selectors. Open DevTools → Console for `[LFS]` logs; selectors live in `content/scraper.js`. |
| Captcha appears | You're being rate-limited. Stop and wait. |
| Downloads not saving | Check `chrome://settings/downloads` for the prompt setting. |

## License

MIT — see source. No warranty; for personal use only.
