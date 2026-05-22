# SkyCast — Weather forecast

SkyCast is a small, static web app for looking up **current weather** and **today’s high/low** for cities worldwide. It calls the [Open-Meteo](https://open-meteo.com/) geocoding and forecast APIs, so **no API key or backend** is required.

## Demo

<video src="assets/videos/screen-capture.webm" controls playsinline width="100%">
  Your browser does not support the video tag.
  <a href="assets/videos/screen-capture.webm">Download the screen capture (WebM)</a>.
</video>

If the player does not appear (for example in some Markdown previews), open [`assets/videos/screen-capture.webm`](assets/videos/screen-capture.webm) directly.

## Features

- Search by city name; quick picks for London, New York, Tokyo, and Mumbai
- Current temperature, conditions, humidity, wind, visibility, pressure, “feels like,” and sunrise/sunset
- UI theme reacts to condition and day/night
- Works as plain static files (no build step)

## Project structure

```
weather-forecast--main/
├── index.html          # Markup and page shell
├── assets/
│   ├── css/
│   │   └── main.css    # Layout, glass UI, themes, responsive rules
│   ├── js/
│   │   └── app.js      # Geocoding, forecast fetch, DOM updates
│   └── videos/
│       └── screen-capture.webm   # Demo recording
├── README.md
└── .gitignore
```

## Run locally

**Option A — open the file**

Double-click `index.html` or open it from your browser’s File menu.

**Option B — local HTTP server** (useful for consistent behavior across browsers)

```bash
cd weather-forecast--main
python3 -m http.server 8080
```

Then open [http://localhost:8080](http://localhost:8080).

Other static servers (for example `npx serve .`) work the same way.

## Usage

1. Type a city in the search box and press **Go** or **Enter**.
2. Or use a **quick city** chip to load that city.

On first load, the app fetches weather for **London** by default.

## Tech stack

- HTML, CSS, and vanilla JavaScript (no frameworks)
- [Open-Meteo Geocoding API](https://open-meteo.com/en/docs/geocoding-api)
- [Open-Meteo Forecast API](https://open-meteo.com/en/docs)

Weather data is provided by Open-Meteo; see their site for terms and attribution.
