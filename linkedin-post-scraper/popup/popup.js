/**
 * Popup controller — manages UI state, user input, and messaging with
 * the background service worker and active content script.
 * Supports three scraping modes: keyword search, profile activity, group feed.
 */

const els = {
  keywords: document.getElementById('keywords'),
  profileUrl: document.getElementById('profileUrl'),
  keywordPanel: document.getElementById('keywordPanel'),
  urlPanel: document.getElementById('urlPanel'),
  modeBtns: document.querySelectorAll('.mode-btn'),
  targetCount: document.getElementById('targetCount'),
  startBtn: document.getElementById('startBtn'),
  stopBtn: document.getElementById('stopBtn'),
  downloadJsonBtn: document.getElementById('downloadJsonBtn'),
  downloadCsvBtn: document.getElementById('downloadCsvBtn'),
  clearBtn: document.getElementById('clearBtn'),
  statusText: document.getElementById('statusText'),
  postCount: document.getElementById('postCount'),
  targetCountDisplay: document.getElementById('targetCountDisplay'),
  progressFill: document.getElementById('progressFill'),
  logArea: document.getElementById('logArea'),
};

const STATE = {
  IDLE: 'Idle',
  RUNNING: 'Scraping…',
  STOPPED: 'Stopped',
  DONE: 'Done',
  ERROR: 'Error',
};

let currentMode = 'keyword'; // 'keyword' | 'url'

function setMode(mode) {
  currentMode = mode;
  els.modeBtns.forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.mode === mode);
  });
  els.keywordPanel.style.display = mode === 'keyword' ? '' : 'none';
  els.urlPanel.style.display = mode === 'url' ? '' : 'none';
}

els.modeBtns.forEach((btn) => {
  btn.addEventListener('click', () => setMode(btn.dataset.mode));
});

function log(message, kind = 'info') {
  const entry = document.createElement('div');
  entry.className = `log-entry ${kind}`;
  const time = new Date().toLocaleTimeString();
  entry.textContent = `[${time}] ${message}`;
  els.logArea.appendChild(entry);
  els.logArea.scrollTop = els.logArea.scrollHeight;
  if (els.logArea.children.length > 50) {
    els.logArea.removeChild(els.logArea.firstChild);
  }
}

function setStatus(state) {
  els.statusText.textContent = state;
  els.statusText.style.color =
    state === STATE.ERROR ? '#b91c1c' :
    state === STATE.RUNNING ? '#0a66c2' :
    state === STATE.DONE ? '#057642' : '#111827';
}

function updateProgress(collected, target) {
  els.postCount.textContent = collected;
  els.targetCountDisplay.textContent = target;
  const pct = target > 0 ? Math.min(100, (collected / target) * 100) : 0;
  els.progressFill.style.width = `${pct}%`;
  const hasData = collected > 0;
  els.downloadJsonBtn.disabled = !hasData;
  els.downloadCsvBtn.disabled = !hasData;
}

function setRunningUI(isRunning) {
  els.startBtn.disabled = isRunning;
  els.stopBtn.disabled = !isRunning;
  els.targetCount.disabled = isRunning;
  els.keywords.disabled = isRunning;
  els.profileUrl.disabled = isRunning;
  els.modeBtns.forEach((btn) => { btn.disabled = isRunning; });
}

function buildTargetUrl(mode, value) {
  if (mode === 'keyword') {
    const q = encodeURIComponent(value.trim());
    return `https://www.linkedin.com/search/results/content/?keywords=${q}&origin=SWITCH_SEARCH_VERTICAL`;
  }
  return value.trim();
}

function validateProfileUrl(url) {
  try {
    const u = new URL(url);
    return (
      u.hostname === 'www.linkedin.com' &&
      (u.pathname.startsWith('/in/') || u.pathname.startsWith('/groups/'))
    );
  } catch {
    return false;
  }
}

// Returns the first two path segments so tabs at the same profile/group/search
// section are considered compatible for reuse.
// e.g. /in/username/recent-activity/all → /in/username
//      /groups/9334060                  → /groups/9334060
//      /search/results/content          → /search/results
function getTabBasePath(pathname) {
  return pathname.replace(/\/$/, '').split('/').slice(0, 3).join('/') || '/';
}

async function getActiveLinkedInTab() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab?.url?.startsWith('https://www.linkedin.com/')) return null;
  return tab;
}

async function ensureFeedTab(targetUrl) {
  const tab = await getActiveLinkedInTab();
  if (tab) {
    try {
      const currentBase = getTabBasePath(new URL(tab.url).pathname);
      const targetBase = getTabBasePath(new URL(targetUrl).pathname);
      if (currentBase === targetBase) return { tab, created: false };
    } catch { /* fall through to create */ }
  }
  const created = await chrome.tabs.create({ url: targetUrl, active: false });
  return { tab: created, created: true };
}

function waitForTabComplete(tabId) {
  return new Promise((resolve) => {
    const listener = (updatedId, info) => {
      if (updatedId === tabId && info.status === 'complete') {
        chrome.tabs.onUpdated.removeListener(listener);
        resolve();
      }
    };
    chrome.tabs.onUpdated.addListener(listener);
  });
}

// Ensures the content script is running on the given tab. Chrome does NOT
// re-inject content scripts into tabs that were already open when the
// extension was installed or reloaded. We detect that case via a PING and
// inject programmatically if needed.
async function ensureContentScript(tabId) {
  try {
    const resp = await chrome.tabs.sendMessage(tabId, { type: 'PING' });
    if (resp?.alive) return; // already running
  } catch { /* not injected yet — fall through */ }

  await chrome.scripting.executeScript({
    target: { tabId },
    files: ['utils/helpers.js', 'content/scraper.js', 'content/content.js'],
  });
  // Give scripts a moment to register their message listener
  await new Promise(r => setTimeout(r, 400));
}

// LinkedIn's content script injects at document_idle, but the feed renders
// asynchronously after that, so we keep retrying generously.
async function sendToContent(tabId, message, retries = 12) {
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      return await chrome.tabs.sendMessage(tabId, message);
    } catch (err) {
      if (attempt === retries - 1) throw err;
      await new Promise(r => setTimeout(r, 500));
    }
  }
}

els.startBtn.addEventListener('click', async () => {
  const target = parseInt(els.targetCount.value, 10);
  if (!Number.isFinite(target) || target < 1) {
    log('Enter a valid positive number.', 'error');
    return;
  }

  let inputValue;
  if (currentMode === 'keyword') {
    inputValue = (els.keywords.value || '').trim();
    if (!inputValue) {
      log('Enter search keywords.', 'error');
      return;
    }
  } else {
    inputValue = (els.profileUrl.value || '').trim();
    if (!inputValue) {
      log('Enter a LinkedIn profile or group URL.', 'error');
      return;
    }
    if (!validateProfileUrl(inputValue)) {
      log('URL must be a LinkedIn /in/… or /groups/… link.', 'error');
      return;
    }
  }

  setRunningUI(true);
  setStatus(STATE.RUNNING);
  log(`Starting scrape for ${target} posts…`);

  try {
    await chrome.storage.local.set({
      mode: currentMode,
      keywords: (els.keywords.value || '').trim(),
      profileUrl: (els.profileUrl.value || '').trim(),
    });

    const targetUrl = buildTargetUrl(currentMode, inputValue);
    const { tab, created } = await ensureFeedTab(targetUrl);
    if (!tab) throw new Error('Could not obtain a LinkedIn tab.');

    if (created || tab.status !== 'complete') {
      log('Waiting for LinkedIn to load…');
      await waitForTabComplete(tab.id);
    }

    await chrome.storage.local.set({
      isRunning: true,
      target,
      startedAt: Date.now(),
    });

    await ensureContentScript(tab.id);
    const response = await sendToContent(tab.id, { type: 'START_SCRAPE', target });
    if (response && response.ok) {
      log('Content script acknowledged. Scrolling…');
      if (created) chrome.tabs.update(tab.id, { active: true });
    } else {
      throw new Error(response?.error || 'Content script did not respond.');
    }
  } catch (err) {
    log(`Error: ${err.message}`, 'error');
    setStatus(STATE.ERROR);
    setRunningUI(false);
    await chrome.storage.local.set({ isRunning: false });
  }
});

els.stopBtn.addEventListener('click', async () => {
  log('Stop requested…');
  try {
    const tab = await getActiveLinkedInTab();
    if (tab) await sendToContent(tab.id, { type: 'STOP_SCRAPE' });
  } catch (err) {
    log(`Stop error: ${err.message}`, 'error');
  }
  await chrome.storage.local.set({ isRunning: false });
  setStatus(STATE.STOPPED);
  setRunningUI(false);
});

els.downloadJsonBtn.addEventListener('click', async () => {
  log('Exporting JSON…');
  await chrome.runtime.sendMessage({ type: 'EXPORT', format: 'json' });
});

els.downloadCsvBtn.addEventListener('click', async () => {
  log('Exporting CSV…');
  await chrome.runtime.sendMessage({ type: 'EXPORT', format: 'csv' });
});

els.clearBtn.addEventListener('click', async () => {
  if (!confirm('Clear all scraped data?')) return;
  await chrome.storage.local.set({ posts: [], isRunning: false });
  updateProgress(0, parseInt(els.targetCount.value, 10) || 0);
  setStatus(STATE.IDLE);
  log('Data cleared.');
});

chrome.runtime.onMessage.addListener((msg) => {
  if (msg.type === 'PROGRESS_UPDATE') {
    updateProgress(msg.collected, msg.target);
    if (msg.status) setStatus(msg.status);
    if (msg.log) log(msg.log, msg.logKind || 'info');
  } else if (msg.type === 'SCRAPE_DONE') {
    setStatus(STATE.DONE);
    setRunningUI(false);
    log(`Scrape complete: ${msg.collected} posts.`);
  } else if (msg.type === 'SCRAPE_ERROR') {
    setStatus(STATE.ERROR);
    setRunningUI(false);
    log(`Scrape error: ${msg.error}`, 'error');
  }
});

(async function init() {
  const data = await chrome.storage.local.get(['posts', 'isRunning', 'target', 'keywords', 'profileUrl', 'mode']);
  const posts = data.posts || [];
  const target = data.target || parseInt(els.targetCount.value, 10) || 0;

  if (data.mode) setMode(data.mode);
  if (data.keywords) els.keywords.value = data.keywords;
  if (data.profileUrl) els.profileUrl.value = data.profileUrl;

  updateProgress(posts.length, target);
  if (data.isRunning) {
    setStatus(STATE.RUNNING);
    setRunningUI(true);
  } else {
    setStatus(posts.length > 0 ? STATE.DONE : STATE.IDLE);
    setRunningUI(false);
  }
  log('Popup ready.');
})();
