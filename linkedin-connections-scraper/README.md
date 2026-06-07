# LinkedIn Connections Scraper — Chrome Extension (Manifest V3)

Opens your [LinkedIn connections page](https://www.linkedin.com/mynetwork/invite-connect/connections/), scrolls from the top through the full list, collects each connection (name, profile URL, headline, connected date), and exports JSON or CSV.

> **Important:** Automated scraping of LinkedIn violates LinkedIn's Terms of Service and may trigger rate limits or account restrictions. Use only on your own logged-in account for personal, low-volume export.

## Installation

1. Open `chrome://extensions` in Chrome.
2. Enable **Developer mode**.
3. Click **Load unpacked** and select this folder.
4. Pin the extension to the toolbar.

## Usage

1. Log in to LinkedIn in your browser.
2. Click the extension icon.
3. Leave **Scrape all connections** checked (default) or uncheck it and set a max count.
4. Click **Start Scraping**.
   - Opens `https://www.linkedin.com/mynetwork/invite-connect/connections/` in a background tab if needed.
   - Scrolls from the top, loading more connections as you go.
5. Click **Stop** anytime. Progress is saved locally.
6. **Download JSON** or **Download CSV** when finished.

## Export fields

| Field | Description |
|-------|-------------|
| `name` | Connection display name |
| `profileUrl` | `https://www.linkedin.com/in/...` |
| `headline` | Job title / headline if visible |
| `connectedAt` | "Connected on …" text if present |

## Folder structure

```
linkedin-connections-scraper/
├── manifest.json
├── popup/           # UI
├── content/         # Scroll loop + DOM extraction
├── background/      # Export downloads
└── utils/           # Storage + helpers
```
