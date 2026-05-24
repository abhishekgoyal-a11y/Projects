/**
 * TypeMaster Pro — application logic (single bundle).
 *
 * Recommended layout when this directory is writable (e.g. chmod u+w):
 *   index.html
 *   README.md
 *   assets/
 *     css/main.css      ← move styles from style.css
 *     js/
 *       passages.js     ← PASSAGES only (assign window.TYPEMASTER_PASSAGES)
 *       app.js          ← this file without the PASSAGES object
 */

(() => {
  "use strict";

  // ---------------------------------------------------------------------------
  // Passages by difficulty (edit here or split to passages.js later)
  // ---------------------------------------------------------------------------
  const PASSAGES = {
    easy: [
      "The quick brown fox jumps over the lazy dog.",
      "Cats nap while dogs run in the sunny park.",
      "Type each line with calm and steady rhythm.",
    ],
    medium: [
      "Technology is transforming the way people work and communicate.",
      "Practice typing daily to improve speed and accuracy.",
      "Web development combines creativity and logical thinking.",
    ],
    hard: [
      "Artificial intelligence is changing modern software systems.",
      "Cryptographic protocols authenticate endpoints without revealing secrets.",
      "Refactoring monoliths into bounded contexts requires discipline and measurement.",
    ],
  };

  // ---------------------------------------------------------------------------
  // DOM references
  // ---------------------------------------------------------------------------
  const homeScreen = document.getElementById("homeScreen");
  const testScreen = document.getElementById("testScreen");
  const resultScreen = document.getElementById("resultScreen");

  const startBtn = document.getElementById("startBtn");
  const retryBtn = document.getElementById("retryBtn");

  const paragraph = document.getElementById("paragraph");
  const typingInput = document.getElementById("typingInput");
  const difficultySelect = document.getElementById("difficulty");
  const durationSelect = document.getElementById("duration");

  const el = {
    timer: document.getElementById("timer"),
    wpm: document.getElementById("wpm"),
    accuracy: document.getElementById("accuracy"),
    errors: document.getElementById("errors"),
    cpm: document.getElementById("cpm"),
    progressFill: document.getElementById("progressFill"),
    bestScore: document.getElementById("bestScore"),
    finalWpm: document.getElementById("finalWpm"),
    finalAccuracy: document.getElementById("finalAccuracy"),
    finalErrors: document.getElementById("finalErrors"),
    finalBest: document.getElementById("finalBest"),
  };

  // ---------------------------------------------------------------------------
  // Run state
  // ---------------------------------------------------------------------------
  let timer = null;
  let timeLeft = 60;
  let totalTime = 60;
  let errors = 0;
  /** Exact passage for this run (early-finish check). */
  let currentTargetText = "";
  /** True while the timed test is in progress (guards double finish). */
  let testActive = false;

  // ---------------------------------------------------------------------------
  // Persistence
  // ---------------------------------------------------------------------------
  function readBestWpm() {
    try {
      const raw = localStorage.getItem("bestWpm");
      if (raw == null || raw === "") return 0;
      const n = Number(raw);
      return Number.isFinite(n) ? n : 0;
    } catch {
      return 0;
    }
  }

  function writeBestWpm(value) {
    try {
      localStorage.setItem("bestWpm", String(value));
    } catch {
      /* private mode / blocked storage */
    }
  }

  // ---------------------------------------------------------------------------
  // Navigation / screens
  // ---------------------------------------------------------------------------
  function showScreen(screen) {
    homeScreen.classList.remove("active");
    testScreen.classList.remove("active");
    resultScreen.classList.remove("active");
    screen.classList.add("active");
  }

  // ---------------------------------------------------------------------------
  // Markup helpers
  // ---------------------------------------------------------------------------
  /** Escape a single character for safe use inside HTML span text. */
  function escapeHtmlChar(c) {
    if (c === "&") return "&amp;";
    if (c === "<") return "&lt;";
    if (c === ">") return "&gt;";
    if (c === '"') return "&quot;";
    return c;
  }

  // ---------------------------------------------------------------------------
  // Typing engine (highlight + metrics)
  // ---------------------------------------------------------------------------
  function applyTypingState(typed) {
    const chars = paragraph.querySelectorAll("span");
    let correct = 0;
    errors = 0;

    chars.forEach((char, index) => {
      if (typed[index] == null) {
        char.classList.remove("correct", "incorrect");
      } else if (typed[index] === char.textContent) {
        char.classList.add("correct");
        char.classList.remove("incorrect");
        correct++;
      } else {
        char.classList.add("incorrect");
        char.classList.remove("correct");
        errors++;
      }
    });

    const overflow = Math.max(0, typed.length - chars.length);
    errors += overflow;

    const typedLen = typed.length;
    const accuracy =
      typedLen > 0 ? ((correct / typedLen) * 100).toFixed(1) : "0.0";
    const elapsedMinutes = Math.max((totalTime - timeLeft) / 60, 1 / 60);
    const wpm = Math.round((correct / 5) / elapsedMinutes);
    const cpm = Math.round(correct / elapsedMinutes);

    return { correct, accuracy, wpm, cpm, totalChars: chars.length };
  }

  function pickParagraph() {
    const key = difficultySelect.value;
    const pool = PASSAGES[key] || PASSAGES.medium;
    if (!pool || pool.length === 0) {
      return "Practice typing to improve your speed and accuracy.";
    }
    return pool[Math.floor(Math.random() * pool.length)];
  }

  function parseDurationSeconds() {
    const n = parseInt(durationSelect.value, 10);
    return Number.isFinite(n) && n > 0 ? n : 60;
  }

  // ---------------------------------------------------------------------------
  // Test lifecycle
  // ---------------------------------------------------------------------------
  function startTest() {
    showScreen(testScreen);

    currentTargetText = pickParagraph();
    paragraph.innerHTML = currentTargetText
      .split("")
      .map((c) => `<span>${escapeHtmlChar(c)}</span>`)
      .join("");

    typingInput.disabled = false;
    typingInput.value = "";
    typingInput.focus();

    if (timer != null) {
      clearInterval(timer);
      timer = null;
    }

    timeLeft = parseDurationSeconds();
    totalTime = timeLeft;
    el.timer.textContent = String(timeLeft);

    errors = 0;
    el.errors.textContent = "0";
    el.accuracy.textContent = "0.0";
    el.cpm.textContent = "0";
    el.wpm.textContent = "0";
    el.progressFill.style.width = "0%";

    testActive = true;
    startTimer();
  }

  function startTimer() {
    timer = setInterval(() => {
      timeLeft--;
      el.timer.textContent = String(timeLeft);

      if (timeLeft <= 0) {
        clearInterval(timer);
        timer = null;
        finishTest();
      }
    }, 1000);
  }

  function finishTest() {
    if (!testActive) return;
    testActive = false;

    if (timer != null) {
      clearInterval(timer);
      timer = null;
    }

    typingInput.disabled = true;
    typingInput.blur();

    const typed = typingInput.value;
    const { accuracy, wpm } = applyTypingState(typed);

    showScreen(resultScreen);

    el.finalWpm.textContent = String(wpm);
    el.finalAccuracy.textContent = accuracy + "%";
    el.finalErrors.textContent = String(errors);

    let best = readBestWpm();
    if (wpm > best) {
      best = wpm;
      writeBestWpm(best);
    }

    el.bestScore.textContent = String(best);
    el.finalBest.textContent = String(best);

    retryBtn.focus();
  }

  function resetApp() {
    testActive = false;
    el.bestScore.textContent = String(readBestWpm());
    showScreen(homeScreen);
    startBtn.focus();
  }

  // ---------------------------------------------------------------------------
  // Input handlers
  // ---------------------------------------------------------------------------
  typingInput.addEventListener("paste", (e) => {
    e.preventDefault();
  });

  typingInput.addEventListener("dragover", (e) => {
    e.preventDefault();
  });

  typingInput.addEventListener("drop", (e) => {
    e.preventDefault();
  });

  typingInput.addEventListener("input", () => {
    if (!testActive) return;

    const typed = typingInput.value;
    const { accuracy, wpm, cpm, totalChars } = applyTypingState(typed);

    el.errors.textContent = String(errors);
    el.accuracy.textContent = accuracy;
    el.cpm.textContent = String(cpm);
    el.wpm.textContent = String(wpm);
    const denom = Math.max(totalChars, 1);
    el.progressFill.style.width =
      Math.min((typed.length / denom) * 100, 100) + "%";

    if (typed === currentTargetText) {
      finishTest();
    }
  });

  startBtn.addEventListener("click", startTest);
  retryBtn.addEventListener("click", resetApp);

  // ---------------------------------------------------------------------------
  // Boot
  // ---------------------------------------------------------------------------
  el.bestScore.textContent = String(readBestWpm());
})();
