# To-Do List App

A lightweight task list that runs entirely in the browser: add tasks with priorities, filter the list, track completion, and keep data in **localStorage** (no backend).

## Features

- Add tasks with **priority** (low / medium / high)
- Mark tasks complete or delete them
- **Filters**: All, Active, Done, Urgent (high priority, not done)
- **Progress** bar and quick stats (total, done, active, urgent count)
- **Clear completed** in one click
- **Dark mode** follows the system color scheme (`prefers-color-scheme`)
- Sample tasks on first visit (until you have saved data)

## Demo

A short screen recording of the app in use:

- **File:** [`assets/video/todo-list-app-demo.webm`](assets/video/todo-list-app-demo.webm) (WebM)

Open it in a browser or VLC, or embed it in a portfolio page with a `<video>` tag pointing at that path.

## Tech stack

- HTML5, CSS3, vanilla JavaScript (no build step)
- [DM Sans](https://fonts.google.com/specimen/DM+Sans) & DM Serif Display (Google Fonts)
- [Tabler Icons](https://tabler.io/icons) (webfont via jsDelivr)

## Project layout

| Path | Purpose |
|------|---------|
| `index.html` | Page structure and links to styles/scripts |
| `assets/css/styles.css` | Layout, theming, motion |
| `assets/js/app.js` | State, rendering, events, `localStorage` |
| `assets/video/todo-list-app-demo.webm` | Demo screen recording |

## Run locally

### Option A — open the file

Double-click `index.html`, or open it from your editor, or from a terminal:

```bash
open -a "Google Chrome" "/path/to/To-Do List App/index.html"
```

(On macOS; use your browser’s path on Windows or Linux.)

### Option B — small static server

Useful if you prefer `http://localhost` or need consistent origins:

```bash
cd "To-Do List App"
python3 -m http.server 8080
```

Then open `http://localhost:8080` in your browser.

## Data & privacy

- Tasks are saved in the browser under the key **`mytasks_v1`** in **localStorage**.
- Data stays on your machine; clearing site data or using another browser/profile starts fresh.
- **`file://` vs HTTP**: storage is tied to the page’s **origin**. Opening as a file and serving from `localhost` are different origins, so lists do not transfer between them.

## Requirements

- A modern browser with JavaScript enabled
- Network access for Google Fonts and Tabler Icons (first load)

## License

Use and modify freely for personal or learning projects.
