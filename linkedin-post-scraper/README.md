# LinkedIn Post Scraper — Chrome Extension (Manifest V3)

A personal-use Chrome extension that opens LinkedIn's content-search
results for a keyword you choose, auto-scrolls with human-like delays,
scrapes each visible post (author name, author profile URL, post text),
de-duplicates, and exports the result as JSON or CSV. Also works on the
classic LinkedIn feed.

> **Important — read before using**
>
> Automated scraping of LinkedIn is **against LinkedIn's Terms of Service**
> and may result in rate limiting, captchas, or account restriction. This
> tool is intended for **personal, low-volume use on your own account
> only** (e.g. exporting hiring posts for personal triage or research).
> You are responsible for how you use it. Do not use it to scrape other
> users' private data or at scale.

---

## Features

- Manifest V3 with a service-worker background script.
- Popup UI: keyword input, target post count, Start / Stop, live progress,
  JSON / CSV export, clear data. Keywords are remembered between sessions.
- Single-click start from any tab — the popup opens the LinkedIn search
  tab in the background, waits for it to load, sends the start signal to
  the content script, then brings the tab to the foreground.
- Content script that scrolls with randomized intervals and step sizes.
- Resilient post extraction supporting two LinkedIn layouts:
  - Classic feed (`feed-shared-update-v2` / `data-id="urn:li:activity:…"`)
  - New content-search results (`componentkey`-based DOM with
    `data-testid="expandable-text-box"`).
- "See more" auto-expansion for both the classic toggle and the new
  `expandable-text-button`.
- Duplicate suppression via LinkedIn `urn:li:activity:*` IDs when present,
  or a stable synthetic id derived from the search card's `componentkey`.
- Retry logic on extraction failures and graceful handling of stalled
  feeds.
- Data persisted to `chrome.storage.local`; survives popup close and
  reload.
- JSON & CSV export via `chrome.downloads`.
- Safe behaviour when the extension is reloaded mid-scrape: the orphaned
  content script exits silently instead of throwing
  "Extension context invalidated" errors.

## Folder Structure

```
linkedin-post-scraper/
├── manifest.json
├── README.md
├── popup/
│   ├── popup.html        # keyword + count inputs, controls, status
│   ├── popup.css
│   └── popup.js          # opens search tab, drives content script
├── content/
│   ├── content.js        # scroll loop + collection (with reload guards)
│   └── scraper.js        # DOM extraction utilities (feed + search)
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
5. Click **Load unpacked** and select the project folder.
6. Pin the extension to the toolbar for easy access.

## Usage

1. Log in to LinkedIn in your browser.
2. Click the extension icon. The popup opens.
3. Enter **Search keywords** (e.g. `qa engineer hiring`). The last value is
   remembered across sessions.
4. Enter the **number of posts to scrape** (e.g. 50).
5. Click **Start Scraping**.
   - The extension opens
     `https://www.linkedin.com/search/results/content/?keywords=<your keywords>`
     in a background tab, waits for it to finish loading, sends the start
     signal to the content script, then brings the tab to the front.
   - If you're already on a LinkedIn search or feed tab, that tab is
     reused.
   - The popup shows live progress and a log tail.
6. Click **Stop Scraping** at any time. Collected posts are preserved.
7. Click **Download JSON** or **Download CSV** to save the data.
8. **Clear Data** wipes the local store when you're done.

The popup can be closed while scraping continues — progress is read back
from storage when you reopen it.

## Output Schema

Each post is stored internally as:

```json
{
  "id": "urn:li:activity:7193456789012345678",
  "urn": "urn:li:activity:7193456789012345678",
  "authorName": "Jane Doe",
  "authorUrl": "https://www.linkedin.com/in/janedoe/",
  "postUrl": "https://www.linkedin.com/feed/update/urn:li:activity:7193456789012345678/",
  "text": "Excited to share that…",
  "scrapedAt": "2026-05-21T18:42:11.000Z"
}
```

For posts collected from the new search-results layout, LinkedIn no longer
exposes a `urn:li:activity:` permalink in the DOM. In that case the `id`
is a stable synthetic value (e.g. `urn:li:activity:search:<componentkey>`)
used for de-duplication, and `postUrl` is left blank.

**Exported JSON / CSV contains only `authorUrl` and `text`** — the
remaining fields are kept in storage for de-dup and debugging.

CSV uses RFC 4180-style escaping for embedded commas / quotes / newlines.

## How It Works

- **Content script** (`content/content.js`) is injected on
  `linkedin.com/search/results/*` and `linkedin.com/feed/*`. It listens
  for `START_SCRAPE` from the popup, then enters a loop: scroll → wait
  randomized 1.4–2.8 s → click any "Show more" / "expandable-text-button"
  → run `Scraper.findPostNodes()` and `scrapePost()` → de-duplicate by id
  → persist to `chrome.storage.local`. Stops when the target is reached,
  the user clicks Stop, the feed stalls 5 times in a row, or 30 minutes
  elapse. Every `chrome.*` call is guarded by `extAlive()` so an orphan
  loop after extension reload exits cleanly.
- **Scraper module** (`content/scraper.js`) holds extraction selectors
  and tries multiple fallbacks because LinkedIn's class names rotate
  often. Supports both the classic feed DOM and the new
  `componentkey`-based search-results DOM. Author name is pulled from the
  overflow menu's `aria-label` ("Open control menu for post by …") when
  the classic actor block isn't present.
- **Helpers** (`utils/helpers.js`) gives both content scripts shared
  utilities on `globalThis.LFS` (sleep, randInt, retry, CSV, etc.).
- **Background worker** (`background/background.js`) is intentionally
  thin — it only handles `EXPORT` messages so downloads work even if the
  popup closes. ES modules are enabled (`"type": "module"`).
- **Popup** (`popup/popup.js`) reads the keyword + count, ensures a
  LinkedIn tab exists (opening one in the **background** so the popup
  itself doesn't lose focus and get torn down mid-handshake), waits for
  `tab.status === "complete"`, sends `START_SCRAPE`, and only then
  foregrounds the tab. Persisted state is restored on reopen.

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
2. Click the **reload** icon on the LinkedIn Post Scraper card.
3. Hard-refresh the LinkedIn tab (Cmd/Ctrl + Shift + R). Chrome does
   **not** re-inject content scripts into already-open tabs when the
   extension reloads — you must refresh the page yourself.

## Troubleshooting

| Symptom | Likely cause |
| --- | --- |
| "Content script did not respond" | Reload the LinkedIn tab so the content script re-injects. |
| Counter stuck at 0 on search results | Open DevTools → Console and check `document.querySelectorAll('div[role="listitem"][componentkey]').length`. If it's 0, LinkedIn changed selectors; update `POST_SELECTORS` in `content/scraper.js`. |
| First click on Start doesn't start scraping | The popup was being torn down when the LinkedIn tab took focus. This is fixed by opening the tab with `active: false` — make sure you reloaded the extension after the popup.js change. |
| "Extension context invalidated" in `chrome://extensions` Errors | An orphan content script from a previous extension reload is talking to a torn-down runtime. Hard-refresh the LinkedIn tab; future reloads are guarded. |
| Captcha appears | You're being rate-limited. Stop and wait. |
| Downloads not saving | Check `chrome://settings/downloads` for the prompt setting. |

## License

MIT — see source. No warranty; for personal use only.
