const SECTIONS_META = {
  "🔥 Top Headlines": { icon: "🔥", badge: "HOT",     badgeClass: "badge-hot",     cardClass: "card-top" },
  "🧠 Tech":          { icon: "🧠", badge: "TECH",    badgeClass: "badge-tech",    cardClass: "" },
  "💰 Finance":       { icon: "💰", badge: "FINANCE", badgeClass: "badge-finance", cardClass: "" },
  "⚽ Sports":        { icon: "⚽", badge: "SPORTS",  badgeClass: "badge-sports",  cardClass: "" },
};

function setLoading(on) {
  const btn = document.getElementById("refresh-btn");
  const bar = document.getElementById("status-bar");
  btn.disabled = on;
  document.getElementById("btn-icon").textContent = on ? "⏳" : "⚡";
  bar.classList.toggle("visible", on);
}

function showError(msg) {
  const box = document.getElementById("error-box");
  box.textContent = "⚠️ " + msg;
  box.classList.add("visible");
}

function clearError() {
  document.getElementById("error-box").classList.remove("visible");
}

function renderSkeletons() {
  const grid = document.getElementById("digest-grid");
  grid.innerHTML = Array.from({ length: 4 }, () => `
    <div class="skeleton-card">
      <div class="skeleton-line short" style="margin-bottom:18px"></div>
      <div class="skeleton-line long"></div>
      <div class="skeleton-line medium"></div>
      <div class="skeleton-line long"></div>
      <div class="skeleton-line medium"></div>
    </div>
  `).join("");
}

function renderDigest(sections) {
  const grid = document.getElementById("digest-grid");
  grid.innerHTML = "";

  const order = ["🔥 Top Headlines", "🧠 Tech", "💰 Finance", "⚽ Sports"];

  order.forEach(key => {
    const bullets = sections[key];
    if (!bullets || bullets.length === 0) return;

    const meta = SECTIONS_META[key] || { icon: "📰", badge: key, badgeClass: "", cardClass: "" };
    const li = bullets.map(b => `<li>${b}</li>`).join("");

    const card = document.createElement("div");
    card.className = `card ${meta.cardClass}`;
    card.innerHTML = `
      <div class="card-header">
        <span class="card-icon">${meta.icon}</span>
        <span class="card-title">${key}</span>
        <span class="card-badge ${meta.badgeClass}">${meta.badge}</span>
      </div>
      <ul class="bullet-list">${li}</ul>
    `;
    grid.appendChild(card);
  });

  document.getElementById("last-updated").textContent =
    "Last updated: " + new Date().toLocaleTimeString();
}

async function loadDigest() {
  clearError();
  setLoading(true);
  renderSkeletons();

  try {
    const res = await fetch("/api/digest");
    const data = await res.json();

    if (data.status === "error") {
      showError(data.message);
      document.getElementById("digest-grid").innerHTML = "";
      return;
    }

    renderDigest(data.sections);
  } catch (e) {
    showError("Could not reach the server. Make sure the backend is running.");
    document.getElementById("digest-grid").innerHTML = "";
  } finally {
    setLoading(false);
  }
}
