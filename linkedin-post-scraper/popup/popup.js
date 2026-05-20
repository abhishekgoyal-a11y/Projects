/**
 * Popup controller — manages UI state, user input, and messaging with
 * the background service worker and active content script.
 */

const els = {
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
}

async function getActiveLinkedInTab() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab || !tab.url || !tab.url.startsWith('https://www.linkedin.com/feed')) {
    return null;
  }
  return tab;
}

async function ensureFeedTab() {
  const tab = await getActiveLinkedInTab();
  if (tab) return tab;
  return chrome.tabs.create({ url: 'https://www.linkedin.com/feed/' });
}

async function sendToContent(tabId, message, retries = 3) {
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

  setRunningUI(true);
  setStatus(STATE.RUNNING);
  log(`Starting scrape for ${target} posts…`);

  try {
    const tab = await ensureFeedTab();
    if (!tab) throw new Error('Could not obtain a LinkedIn feed tab.');

    if (tab.status !== 'complete') {
      await new Promise(resolve => {
        const listener = (tabId, info) => {
          if (tabId === tab.id && info.status === 'complete') {
            chrome.tabs.onUpdated.removeListener(listener);
            resolve();
          }
        };
        chrome.tabs.onUpdated.addListener(listener);
      });
    }

    await chrome.storage.local.set({
      isRunning: true,
      target,
      startedAt: Date.now(),
    });

    const response = await sendToContent(tab.id, { type: 'START_SCRAPE', target });
    if (response && response.ok) {
      log('Content script acknowledged. Scrolling…');
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
  const data = await chrome.storage.local.get(['posts', 'isRunning', 'target']);
  const posts = data.posts || [];
  const target = data.target || parseInt(els.targetCount.value, 10) || 0;
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
