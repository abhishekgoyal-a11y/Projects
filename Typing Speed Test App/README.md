# TypeMaster Pro

A small, static typing speed test that runs entirely in the browser. Pick difficulty and duration, type the shown line as fast and accurately as you can, then review WPM, accuracy, errors, and your best score (saved with `localStorage` when allowed).

## Run locally

No install or build step.

1. Open `index.html` in a modern browser (double-click, or “Open with…” your browser).

For correct loading of `style.css` and `script.js`, use a local server if your browser blocks file URLs for scripts/styles:

```bash
cd /path/to/this-project
python3 -m http.server 8080
```

Then visit `http://localhost:8080`.

## Project layout

| File         | Role                                    |
|-------------|-----------------------------------------|
| `index.html` | Markup, fonts, links to CSS/JS        |
| `style.css`  | Layout and theme                       |
| `script.js`  | Game logic (IIFE, no global pollution) |

Optional split layout (see the comment at the top of `index.html` for commands and path updates):

```text
index.html
README.md
assets/
  css/main.css
  js/
    passages.js   # passage lists only
    app.js        # rest of the logic
```

## Features (summary)

- Difficulty tiers with different passage pools
- Timer starts when you start a challenge; finish early by completing the line
- Paste and drag/drop into the typing area are blocked
- WPM and CPM use elapsed time; overflow keystrokes past the line count as errors
- Best WPM persisted when storage is available

## Browser support

Targets recent evergreen browsers with `localStorage`, CSS flex/grid, and `defer` scripts.

## License

Add a license here if you publish the project.
