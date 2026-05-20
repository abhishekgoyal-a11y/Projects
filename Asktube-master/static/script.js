const videoUrlInput = document.getElementById("videoUrl");
const loadBtn       = document.getElementById("loadBtn");
const btnSpinner    = document.getElementById("btnSpinner");
const btnText       = document.getElementById("btnText");
const chatBody      = document.getElementById("chatBody");
const questionInput = document.getElementById("questionInput");
const askBtn        = document.getElementById("askBtn");
const statusDot     = document.getElementById("statusDot");
const statusMsg     = document.getElementById("statusMsg");
const statusSub     = document.getElementById("statusSub");
const progressBar   = document.getElementById("progressBar");
const progressFill  = document.getElementById("progressFill");
const videoLabel    = document.getElementById("videoLabel");
const chatHint      = document.getElementById("chatHint");

// ── Internal debug log (console only, not visible in UI) ──
function dbg(msg) { console.log(`[AskTube] ${msg}`); }

// ── Status helpers ────────────────────────────────────────
function setStatus(dot, msg, sub = "", progress = null) {
  statusDot.className = `dot ${dot}`;
  statusMsg.textContent = msg;
  statusSub.textContent = sub;
  if (progress !== null) {
    progressBar.classList.remove("hidden");
    progressFill.style.width = progress + "%";
  } else {
    progressBar.classList.add("hidden");
  }
}

// ── Chat helpers ──────────────────────────────────────────
function clearChat() {
  chatBody.innerHTML = "";
}

function addMessage(text, role, extra = "") {
  const wrap = document.createElement("div");
  wrap.className = `msg-wrap ${role} ${extra}`;

  const meta = document.createElement("div");
  meta.className = "msg-meta";
  meta.textContent = role === "user" ? "You" : "AskTube";

  const bubble = document.createElement("div");
  bubble.className = "msg-bubble";

  if (extra === "thinking") {
    bubble.innerHTML = `Thinking <span class="thinking-dots"><span></span><span></span><span></span></span>`;
  } else {
    bubble.textContent = text;
  }

  wrap.appendChild(meta);
  wrap.appendChild(bubble);
  chatBody.appendChild(wrap);
  chatBody.scrollTop = chatBody.scrollHeight;
  return wrap;
}

// ── Load Video ────────────────────────────────────────────
async function loadVideo() {
  const url = videoUrlInput.value.trim();
  if (!url) {
    setStatus("red", "Please enter a URL", "Paste a YouTube link above");
    return;
  }

  dbg("Loading: " + url);
  loadBtn.disabled = true;
  btnSpinner.classList.remove("hidden");
  btnText.textContent = "Loading...";
  setStatus("yellow", "Fetching transcript...", "Connecting to YouTube", 15);

  let elapsed = 0;
  const timer = setInterval(() => {
    elapsed += 5;
    const pct = Math.min(15 + elapsed * 2, 85);
    if (elapsed < 20) {
      setStatus("yellow", "Fetching transcript...", `${elapsed}s elapsed`, pct);
    } else {
      setStatus("yellow", "Building index...", `${elapsed}s elapsed — almost there`, pct);
    }
    dbg(`Still loading... ${elapsed}s`);
  }, 5000);

  try {
    const res = await fetch("/load", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url }),
    });

    clearInterval(timer);
    dbg(`HTTP ${res.status}`);
    const data = await res.json();
    dbg(`Response: ${JSON.stringify(data)}`);

    if (!res.ok) {
      setStatus("red", "Failed to load", data.error || "Unknown error");
      return;
    }

    setStatus("green", "Video ready", "Ask anything below", 100);
    setTimeout(() => progressBar.classList.add("hidden"), 1000);

    videoLabel.textContent = "Video loaded ✓";
    videoLabel.classList.add("active");
    chatHint.textContent = "Press Enter or click Send";

    questionInput.disabled = false;
    askBtn.disabled = false;
    clearChat();
    addMessage("Video loaded! Ask me anything about it.", "bot");
    questionInput.focus();

  } catch (err) {
    clearInterval(timer);
    dbg("Error: " + err.message);
    setStatus("red", "Connection failed", "Is Flask running on port 5000?");
  } finally {
    loadBtn.disabled = false;
    btnSpinner.classList.add("hidden");
    btnText.textContent = "Load Video";
  }
}

// ── Ask Question ──────────────────────────────────────────
async function askQuestion() {
  const question = questionInput.value.trim();
  if (!question) return;

  addMessage(question, "user");
  questionInput.value = "";
  askBtn.disabled = true;
  dbg(`Question: ${question}`);

  const thinking = addMessage("", "bot", "thinking");

  try {
    const res = await fetch("/ask", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question }),
    });

    const data = await res.json();
    thinking.remove();
    dbg(`Answer: ${data.answer?.slice(0, 80)}...`);

    if (!res.ok) {
      addMessage("Error: " + data.error, "bot");
      return;
    }
    addMessage(data.answer, "bot");

  } catch (err) {
    thinking.remove();
    dbg("Ask error: " + err.message);
    addMessage("Could not reach server.", "bot");
  } finally {
    askBtn.disabled = false;
    questionInput.focus();
  }
}
