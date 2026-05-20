/**
 * Popup controller — manages UI state, user input, and messaging with
 * the background service worker and active content script.
 */

const els = {
  keywords: document.getElementById('keywords'),
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
}

function buildSearchUrl(keywords) {
  const q = encodeURIComponent(keywords.trim());
  return `https://www.linkedin.com/search/results/content/?keywords=${q}&origin=SWITCH_SEARCH_VERTICAL`;
}

async function getActiveLinkedInTab() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab || !tab.url) return null;
  const ok =
    tab.url.startsWith('https://www.linkedin.com/search/results/') ||
    tab.url.startsWith('https://www.linkedin.com/feed');
  return ok ? tab : null;
}

async function ensureFeedTab(keywords) {
  const tab = await getActiveLinkedInTab();
  if (tab) return { tab, created: false };
  // Open in background so the popup stays open long enough to finish the
  // START_SCRAPE handshake. If the popup loses focus (which it would if we
  // created the tab with active:true), it gets torn down and the rest of
  // this click handler never runs.
  const created = await chrome.tabs.create({
    url: buildSearchUrl(keywords),
    active: false,
  });
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

// LinkedIn's content script injects at document_idle, but the search-results
// feed renders asynchronously after that, so we keep retrying generously.
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

  const keywords = (els.keywords.value || '').trim();
  if (!keywords) {
    log('Enter search keywords.', 'error');
    return;
  }

  setRunningUI(true);
  setStatus(STATE.RUNNING);
  log(`Starting scrape for ${target} posts on "${keywords}"…`);

  try {
    await chrome.storage.local.set({ keywords });
    const { tab, created } = await ensureFeedTab(keywords);
    if (!tab) throw new Error('Could not obtain a LinkedIn feed tab.');

    if (created || tab.status !== 'complete') {
      log('Waiting for LinkedIn to load…');
      await waitForTabComplete(tab.id);
    }

    await chrome.storage.local.set({
      isRunning: true,
      target,
      startedAt: Date.now(),
    });

    const response = await sendToContent(tab.id, { type: 'START_SCRAPE', target });
    if (response && response.ok) {
      log('Content script acknowledged. Scrolling…');
      // Now safe to bring the tab to the foreground — handshake is done.
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
  const data = await chrome.storage.local.get(['posts', 'isRunning', 'target', 'keywords']);
  const posts = data.posts || [];
  const target = data.target || parseInt(els.targetCount.value, 10) || 0;
  if (data.keywords) els.keywords.value = data.keywords;
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
