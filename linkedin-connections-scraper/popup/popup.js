/**
 * Popup controller for LinkedIn Connections Scraper.
 */

const CONNECTIONS_URL =
  'https://www.linkedin.com/mynetwork/invite-connect/connections/';

const els = {
  scrapeAll: document.getElementById('scrapeAll'),
  targetWrap: document.getElementById('targetWrap'),
  targetCount: document.getElementById('targetCount'),
  startBtn: document.getElementById('startBtn'),
  stopBtn: document.getElementById('stopBtn'),
  downloadJsonBtn: document.getElementById('downloadJsonBtn'),
  downloadCsvBtn: document.getElementById('downloadCsvBtn'),
  clearBtn: document.getElementById('clearBtn'),
  statusText: document.getElementById('statusText'),
  connCount: document.getElementById('connCount'),
  targetDisplay: document.getElementById('targetDisplay'),
  progressFill: document.getElementById('progressFill'),
  logArea: document.getElementById('logArea'),
  loadJsonBtn: document.getElementById('loadJsonBtn'),
  jsonFileInput: document.getElementById('jsonFileInput'),
  loadedFilename: document.getElementById('loadedFilename'),
  enrichLimit: document.getElementById('enrichLimit'),
  enrichBtn: document.getElementById('enrichBtn'),
  stopEnrichBtn: document.getElementById('stopEnrichBtn'),
  enrichProgressRow: document.getElementById('enrichProgressRow'),
  enrichCount: document.getElementById('enrichCount'),
  enrichName: document.getElementById('enrichName'),
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

function updateProgress(collected, target, scrapeAll) {
  els.connCount.textContent = collected;
  if (scrapeAll) {
    els.targetDisplay.textContent = '';
    els.progressFill.style.width = collected > 0 ? '100%' : '0%';
  } else {
    els.targetDisplay.textContent = ` / ${target}`;
    const pct = target > 0 ? Math.min(100, (collected / target) * 100) : 0;
    els.progressFill.style.width = `${pct}%`;
  }
  const hasData = collected > 0;
  els.downloadJsonBtn.disabled = !hasData;
  els.downloadCsvBtn.disabled = !hasData;
  els.enrichBtn.disabled = !hasData;
}

function setRunningUI(isRunning) {
  els.startBtn.disabled = isRunning;
  els.stopBtn.disabled = !isRunning;
  els.targetCount.disabled = isRunning;
  els.scrapeAll.disabled = isRunning;
}

function isConnectionsUrl(url) {
  return (
    url &&
    url.startsWith('https://www.linkedin.com/mynetwork/invite-connect/connections')
  );
}

async function getConnectionsTab() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (tab && isConnectionsUrl(tab.url)) return tab;

  const tabs = await chrome.tabs.query({
    url: 'https://www.linkedin.com/mynetwork/invite-connect/connections/*',
  });
  return tabs[0] || null;
}

async function ensureConnectionsTab() {
  const existing = await getConnectionsTab();
  if (existing) return { tab: existing, created: false };

  const created = await chrome.tabs.create({
    url: CONNECTIONS_URL,
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

async function sendToContent(tabId, message, retries = 15) {
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      return await chrome.tabs.sendMessage(tabId, message);
    } catch (err) {
      if (attempt === retries - 1) throw err;
      await new Promise((r) => setTimeout(r, 500));
    }
  }
}

els.scrapeAll.addEventListener('change', () => {
  els.targetWrap.classList.toggle('hidden', els.scrapeAll.checked);
});

els.startBtn.addEventListener('click', async () => {
  const scrapeAll = els.scrapeAll.checked;
  const target = parseInt(els.targetCount.value, 10);

  if (!scrapeAll && (!Number.isFinite(target) || target < 1)) {
    log('Enter a valid positive number.', 'error');
    return;
  }

  setRunningUI(true);
  setStatus(STATE.RUNNING);
  log(
    scrapeAll
      ? 'Starting full connections scrape…'
      : `Starting scrape for up to ${target} connections…`
  );

  try {
    const { tab, created } = await ensureConnectionsTab();
    if (!tab) throw new Error('Could not open connections page.');

    if (created || tab.status !== 'complete') {
      log('Waiting for LinkedIn connections page to load…');
      await waitForTabComplete(tab.id);
      await new Promise((r) => setTimeout(r, 1500));
    }

    await chrome.storage.local.set({
      isRunning: true,
      scrapeAll,
      target: scrapeAll ? 0 : target,
      startedAt: Date.now(),
    });

    const response = await sendToContent(tab.id, {
      type: 'START_SCRAPE',
      scrapeAll,
      target,
    });

    if (response && response.ok) {
      log('Content script acknowledged. Scrolling from top…');
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
    const tab = await getConnectionsTab();
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
  if (!confirm('Clear all scraped connections?')) return;
  await chrome.storage.local.set({ connections: [], isRunning: false });
  const scrapeAll = els.scrapeAll.checked;
  const target = parseInt(els.targetCount.value, 10) || 0;
  updateProgress(0, target, scrapeAll);
  setStatus(STATE.IDLE);
  log('Data cleared.');
});

// ── Load JSON file ───────────────────────────────────────────────────────────

els.loadJsonBtn.addEventListener('click', () => els.jsonFileInput.click());

els.jsonFileInput.addEventListener('change', async () => {
  const file = els.jsonFileInput.files[0];
  if (!file) return;

  try {
    const text = await file.text();
    const parsed = JSON.parse(text);
    if (!Array.isArray(parsed)) throw new Error('JSON must be an array.');

    // Normalise each entry — assign an id if missing
    const connections = parsed.map((c) => ({
      id: c.id || (() => {
        try { return new URL(c.profileUrl).pathname.replace(/^\/in\//, '').replace(/\/$/, '').toLowerCase(); } catch { return ''; }
      })(),
      name: c.name || '',
      profileUrl: c.profileUrl || '',
      headline: c.headline || '',
      connectedAt: c.connectedAt || '',
      phone: c.phone || '',
      email: c.email || '',
      enriched: c.enriched || false,
    })).filter((c) => c.id);

    await chrome.storage.local.set({
      connections,
      enrichFilename: file.name,
    });

    els.loadedFilename.textContent = file.name;
    els.loadedFilename.title = file.name;
    const scrapeAll = els.scrapeAll.checked;
    const target = parseInt(els.targetCount.value, 10) || 0;
    updateProgress(connections.length, target, scrapeAll);
    log(`Loaded ${connections.length} connections from "${file.name}".`);
  } catch (err) {
    log(`Failed to load file: ${err.message}`, 'error');
  }

  els.jsonFileInput.value = '';
});

function setEnrichingUI(running) {
  els.enrichBtn.disabled = running;
  els.stopEnrichBtn.disabled = !running;
  els.enrichLimit.disabled = running;
  els.enrichProgressRow.style.display = running ? 'flex' : 'none';
  if (!running) els.enrichName.textContent = '';
}

els.enrichBtn.addEventListener('click', async () => {
  const count = parseInt(els.enrichLimit.value, 10);
  if (!Number.isFinite(count) || count < 1) {
    log('Enter a valid number of profiles to enrich.', 'error');
    return;
  }
  setEnrichingUI(true);
  log(`Starting enrichment for up to ${count} profiles — auto-saving after each…`);
  try {
    const resp = await chrome.runtime.sendMessage({ type: 'ENRICH_START', count });
    if (!resp?.ok) throw new Error(resp?.error || 'Failed to start.');
  } catch (err) {
    log(`Enrich error: ${err.message}`, 'error');
    setEnrichingUI(false);
  }
});

els.stopEnrichBtn.addEventListener('click', async () => {
  log('Stopping enrichment…');
  await chrome.runtime.sendMessage({ type: 'ENRICH_STOP' });
  setEnrichingUI(false);
  const data = await chrome.storage.local.get('connections');
  els.enrichBtn.disabled = !(data.connections?.length > 0);
});

chrome.runtime.onMessage.addListener((msg) => {
  if (msg.type === 'PROGRESS_UPDATE') {
    updateProgress(msg.collected, msg.target, msg.scrapeAll);
    if (msg.status) setStatus(msg.status);
    if (msg.log) log(msg.log, msg.logKind || 'info');
  } else if (msg.type === 'SCRAPE_DONE') {
    setStatus(STATE.DONE);
    setRunningUI(false);
    log(`Scrape complete: ${msg.collected} connections.`);
  } else if (msg.type === 'SCRAPE_ERROR') {
    setStatus(STATE.ERROR);
    setRunningUI(false);
    log(`Scrape error: ${msg.error}`, 'error');
  } else if (msg.type === 'ENRICH_PROGRESS') {
    els.enrichCount.textContent = `${msg.current} / ${msg.total}`;
    els.enrichName.textContent = msg.name ? `· ${msg.name}` : '';
    log(`Enriching ${msg.current}/${msg.total}: ${msg.name || ''}`);
  } else if (msg.type === 'ENRICH_DONE') {
    setEnrichingUI(false);
    els.enrichBtn.disabled = false;
    log(`Enrichment done: ${msg.processed} profiles processed.`);
  }
});

(async function init() {
  const data = await chrome.storage.local.get([
    'connections',
    'isRunning',
    'target',
    'scrapeAll',
    'enrichFilename',
  ]);

  const connections = data.connections || [];
  const scrapeAll = data.scrapeAll !== false;
  const target = data.target || parseInt(els.targetCount.value, 10) || 0;

  els.scrapeAll.checked = scrapeAll;
  els.targetWrap.classList.toggle('hidden', scrapeAll);

  updateProgress(connections.length, target, scrapeAll);

  if (data.isRunning) {
    setStatus(STATE.RUNNING);
    setRunningUI(true);
  } else {
    setStatus(connections.length > 0 ? STATE.DONE : STATE.IDLE);
    setRunningUI(false);
  }

  if (data.enrichFilename) {
    els.loadedFilename.textContent = data.enrichFilename;
    els.loadedFilename.title = data.enrichFilename;
  }

  // Restore enrich state if background enrichment is still running
  try {
    const enrichStatus = await chrome.runtime.sendMessage({ type: 'ENRICH_STATUS' });
    if (enrichStatus?.running) setEnrichingUI(true);
  } catch { /* background may not be ready yet */ }

  log('Popup ready.');
})();
