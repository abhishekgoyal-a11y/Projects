# Google Maps Lead Scraper — Chrome Extension (Manifest V3)

A personal-use Chrome extension that searches Google Maps for a keyword you choose, scrolls through the results, visits each business detail panel, and exports the leads (name, phone, website, email, address, category, rating) as JSON or CSV.

> **Important — read before using**
>
> Automated scraping of Google Maps is **against Google's Terms of Service**
> and may result in rate limiting, captchas, or account restrictions. This
> tool is intended for **personal, low-volume use only** (e.g. building a
> local outreach list). You are responsible for how you use it. Do not use
> it to scrape at scale or resell data.

---

## Features

- Manifest V3 with a service-worker background script.
- Popup UI: keyword input, lead count target, email-fetch toggle, Start / Stop,
  live progress bar, JSON / CSV export, clear data. Last query remembered.
- Single-click start from any tab — the popup opens the Maps search tab in the
  background, waits for it to load, connects to the content script, then
  foregrounds the tab.
- Content script scrolls the results feed with randomised intervals and step
  sizes (human-like pacing).
- Clicks each result to open its detail panel, extracts all structured fields,
  then navigates back to the list — no page reloads needed.
- Supports stable `data-item-id` selectors for phone, website, and address
  (more resilient to Google's class-name changes than CSS class selectors).
- **Email fetching**: the background service worker fetches each business
  website (if present), parses `mailto:` links first, then falls back to a
  regex scan. Social-media URLs and known false-positive patterns are skipped.
- De-duplication via a normalised place key derived from the Maps URL.
- Data persisted to `chrome.storage.local` — survives popup close and reopen.
- Scrape resumes from the existing de-dup set if restarted after a stop.
- Graceful exit on extension reload ("Extension context invalidated" guarded).

## Folder Structure

```
google-maps-lead-scraper/
├── manifest.json
├── README.md
├── popup/
│   ├── popup.html        — search input, controls, status, export buttons
│   ├── popup.css
│   └── popup.js          — tab management, polling, UI events
├── content/
│   ├── content.js        — scroll + click loop, back-navigation, storage
│   └── scraper.js        — DOM extraction (name, phone, website, address…)
├── background/
│   └── background.js     — email fetching from websites, JSON/CSV downloads
├── utils/
│   └── helpers.js        — sleep, randInt, retry, waitForEl (content world)
└── icons/
    └── README.txt
```

## Installation

1. Clone or download this folder.
2. Add icon PNGs (16, 32, 48, 128 px) in `icons/`. See `icons/README.txt`.
3. Open `chrome://extensions` in Chrome.
4. Enable **Developer mode** (top-right toggle).
5. Click **Load unpacked** and select the project folder.
6. Pin the extension to the toolbar for easy access.

## Usage

1. Click the extension icon. The popup opens.
2. Enter **Search query** (e.g. `dentists in Austin TX`).
3. Set **Leads target** (e.g. 30).
4. Leave **Fetch emails from websites** checked if you want the extension to
   visit each business website and look for a contact email address.
5. Click **Start Scraping**.
   - The extension opens (or reuses) a Google Maps tab loaded with your search,
     waits for it to finish loading, connects to the content script, and begins.
   - The popup shows live progress and a log line.
   - The popup can be closed while scraping continues.
6. Click **Stop** at any time. Collected leads are preserved.
7. Click **↓ JSON** or **↓ CSV** to save the data.
8. **Clear data** wipes the local store.

## Output Schema

Each lead is stored as:

```json
{
  "id":        "dentist-name",
  "name":      "Smile Dental",
  "phone":     "+1-512-555-0100",
  "email":     "hello@smiledental.com",
  "website":   "https://smiledental.com",
  "address":   "123 Main St, Austin, TX 78701",
  "category":  "Dentist",
  "rating":    "4.8",
  "reviews":   "312",
  "scrapedAt": "2026-06-06T10:22:11.000Z"
}
```

The exported JSON array and CSV file include all fields above.

## How It Works

- **Content script** (`content/content.js`) is injected on `google.com/maps/*`.
  It listens for `START_SCRAPE`, then loops: read unprocessed links from the
  feed → click the first one → wait for the detail panel → extract fields →
  click Back → wait for the feed to reappear → repeat. Stops when the target
  is reached, Stop is clicked, 6 consecutive scrolls yield no new items, or
  30 minutes elapse.
- **Scraper module** (`content/scraper.js`) uses `data-item-id` attributes
  (`phone:tel:…`, `authority`, `address`) that Google has kept stable for
  years. Multiple CSS fallbacks are tried for each field.
- **Helpers** (`utils/helpers.js`) provides `sleep`, `randSleep`, `retry`,
  and `waitForEl` (MutationObserver-based) on `globalThis.GMLS`.
- **Background worker** (`background/background.js`) handles two things:
  (1) fetches business websites and returns the first valid email address;
  (2) generates and downloads JSON/CSV files via `chrome.downloads`.
- **Popup** (`popup/popup.js`) opens a Maps search tab with `active: false`
  (so the popup isn't torn down mid-handshake), waits for `tab.status ===
  "complete"`, pings the content script, sends `START_SCRAPE`, then polls
  `chrome.storage.local` every 1.5 s for progress updates.

## Email Fetching Notes

When **Fetch emails from websites** is enabled:

- The background service worker fetches the website over the network (it
  bypasses the content-security-policy of the Maps page).
- `mailto:` links are extracted first (most reliable).
- A fallback regex scans the page HTML for addresses matching
  `word@domain.tld`.
- Common false positives (`noreply@`, `example.com`, image asset paths, etc.)
  are filtered out.
- Social-media homepages (Facebook, Instagram, etc.) are skipped entirely
  since their HTML is fully JS-rendered and contains no scrapable email.
- If no email is found the field is left blank — no error is thrown.
- Email fetching adds 1–4 s per lead and requires the `<all_urls>` host
  permission declared in `manifest.json`.

## Anti-Detection Notes

Random scroll step sizes (400–750 px) and pause intervals (1.5–2.8 s) make
the behaviour look more human. The extension does not bypass any Google
defences — if a captcha or rate-limit appears, the scrape stalls and exits
after 6 unproductive scroll attempts.

If you hit issues:
- Slow down by increasing `SCROLL_MIN_MS` / `SCROLL_MAX_MS` in `content/content.js`.
- Reduce the lead target and run in shorter batches.
- Reload the Maps tab and re-run (existing de-dup set is restored from storage).

## Troubleshooting

| Symptom | Fix |
|---|---|
| "Content script did not respond" | Reload the Google Maps tab and try again. |
| Counter stuck at 0 | Open DevTools → Console on the Maps tab. Check `document.querySelectorAll('div[role="feed"] a[href*="/maps/place/"]').length`. If 0, Maps changed its feed layout — update `SEL.feedLinks` in `content/scraper.js`. |
| Phone / website always empty | Google changed `data-item-id` values — inspect the detail panel and update `SEL.phone` / `SEL.website` in `content/scraper.js`. |
| Scraper clicks wrong result | The feed may have reordered after a scroll. The de-dup key guards against duplicate data. |
| Captcha appears | Stop and wait before retrying. Reduce batch size. |
| Emails always blank | The business website may be JS-rendered (email not in raw HTML), or email fetching is disabled. |
| "Extension context invalidated" | Hard-refresh the Maps tab. Future reloads exit cleanly. |

## Development

No build step — plain JavaScript. After editing:

1. Go to `chrome://extensions`.
2. Click the **reload** icon on the Google Maps Lead Scraper card.
3. Hard-refresh the Google Maps tab (Cmd/Ctrl + Shift + R).

Chrome does **not** re-inject content scripts into already-open tabs on
extension reload — you must refresh the Maps tab yourself.

## License

MIT — personal use only. No warranty.
