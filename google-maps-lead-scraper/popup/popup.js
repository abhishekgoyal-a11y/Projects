'use strict';

const $ = id => document.getElementById(id);

let currentTarget = 20;
let pollInterval  = null;
let mapsTabId     = null;

// ── UI helpers ──────────────────────────────────────────────────────────────

function setStatus(type, text) {
  $('statusDot').className = `dot ${type}`;
  $('statusText').textContent = text;
}

function setProgress(count, target) {
  const pct = target > 0 ? Math.min((count / target) * 100, 100) : 0;
  $('progressFill').style.width = pct + '%';
  $('progressText').textContent = `${count} / ${target} leads`;
}

function setLog(msg) {
  $('logBox').textContent = msg || '—';
}

function setRunning(on) {
  $('btnStart').disabled     = on;
  $('btnStop').disabled      = !on;
  $('query').disabled        = on;
  $('target').disabled       = on;
  $('fetchEmails').disabled  = on;
}

function enableExport(has) {
  $('btnJSON').disabled = !has;
  $('btnCSV').disabled  = !has;
}

// ── Polling ─────────────────────────────────────────────────────────────────

async function poll() {
  const r = await chrome.storage.local.get(['gmRunning', 'gmCount', 'gmLeads', 'gmLog', 'gmError']);
  const count = r.gmCount || 0;
  const has   = (r.gmLeads?.length || 0) > 0;

  setProgress(count, currentTarget);
  enableExport(has);
  if (r.gmLog) setLog(r.gmLog);

  if (r.gmError) {
    setStatus('error', r.gmError);
    setRunning(false);
    stopPoll();
    return;
  }

  if (r.gmRunning) {
    setStatus('running', `Scraping… ${count} lead${count !== 1 ? 's' : ''} collected`);
    setRunning(true);
  } else {
    setStatus(count > 0 ? 'done' : 'idle',
      count > 0 ? `Done — ${count} lead${count !== 1 ? 's' : ''} collected` : 'Idle — enter a query and click Start');
    setRunning(false);
    stopPoll();
  }
}

function startPoll() {
  if (pollInterval) return;
  poll();
  pollInterval = setInterval(poll, 1500);
}

function stopPoll() {
  if (!pollInterval) return;
  clearInterval(pollInterval);
  pollInterval = null;
}

// ── Tab helpers ─────────────────────────────────────────────────────────────

async function ensureMapsTab(query) {
  const searchUrl = `https://www.google.com/maps/search/${encodeURIComponent(query)}/`;
  const existing  = await chrome.tabs.query({ url: 'https://www.google.com/maps/*' });

  if (existing.length > 0) {
    mapsTabId = existing[0].id;
    await chrome.tabs.update(mapsTabId, { url: searchUrl });
    return mapsTabId;
  }

  // Open in background so the popup isn't torn down when focus shifts.
  const tab = await chrome.tabs.create({ url: searchUrl, active: false });
  mapsTabId = tab.id;
  return mapsTabId;
}

function waitForTabComplete(tabId, timeoutMs = 20000) {
  return new Promise((resolve, reject) => {
    const start = Date.now();
    function check() {
      chrome.tabs.get(tabId, tab => {
        if (chrome.runtime.lastError) { reject(new Error('Tab was closed.')); return; }
        if (tab.status === 'complete') { resolve(tab); return; }
        if (Date.now() - start > timeoutMs) { reject(new Error('Timed out waiting for Maps to load.')); return; }
        setTimeout(check, 350);
      });
    }
    check();
  });
}

async function pingContent(tabId, retries = 10, delayMs = 700) {
  for (let i = 0; i < retries; i++) {
    try {
      const r = await chrome.tabs.sendMessage(tabId, { type: 'PING' });
      if (r?.ok) return true;
    } catch { /* not ready yet */ }
    await new Promise(r => setTimeout(r, delayMs));
  }
  return false;
}

// ── Button handlers ─────────────────────────────────────────────────────────

$('btnStart').addEventListener('click', async () => {
  const query       = $('query').value.trim();
  const target      = Math.max(1, parseInt($('target').value, 10) || 20);
  const fetchEmails = $('fetchEmails').checked;

  if (!query) { setStatus('error', 'Please enter a search query.'); return; }

  currentTarget = target;

  // Clear previous run data.
  await chrome.storage.local.remove(['gmLeads', 'gmCount', 'gmRunning', 'gmError', 'gmLog']);
  await chrome.storage.local.set({ gmLastQuery: query });

  setRunning(true);
  enableExport(false);
  setProgress(0, target);
  setLog('Opening Google Maps…');
  setStatus('running', 'Opening Google Maps…');

  try {
    const tabId = await ensureMapsTab(query);

    setStatus('running', 'Waiting for page to load…');
    setLog('Waiting for Maps to load…');
    await waitForTabComplete(tabId);

    setStatus('running', 'Connecting to page…');
    setLog('Connecting to content script…');
    const alive = await pingContent(tabId);
    if (!alive) throw new Error('Content script did not respond — try refreshing the Maps tab.');

    await chrome.tabs.sendMessage(tabId, { type: 'START_SCRAPE', target, fetchEmails });
    await chrome.tabs.update(tabId, { active: true });

    setStatus('running', 'Scraping started…');
    startPoll();
  } catch (err) {
    setStatus('error', err.message);
    setRunning(false);
  }
});

$('btnStop').addEventListener('click', async () => {
  if (mapsTabId) {
    try { await chrome.tabs.sendMessage(mapsTabId, { type: 'STOP_SCRAPE' }); } catch {}
  }
  await chrome.storage.local.set({ gmRunning: false });
  setStatus('idle', 'Stopped by user.');
  setRunning(false);
  stopPoll();
});

$('btnJSON').addEventListener('click', async () => {
  const { gmLeads = [] } = await chrome.storage.local.get('gmLeads');
  chrome.runtime.sendMessage({ type: 'EXPORT', leads: gmLeads, format: 'json' });
});

$('btnCSV').addEventListener('click', async () => {
  const { gmLeads = [] } = await chrome.storage.local.get('gmLeads');
  chrome.runtime.sendMessage({ type: 'EXPORT', leads: gmLeads, format: 'csv' });
});

$('btnClear').addEventListener('click', async () => {
  await chrome.storage.local.remove(['gmLeads', 'gmCount', 'gmRunning', 'gmError', 'gmLog']);
  setStatus('idle', 'Data cleared.');
  setProgress(0, currentTarget);
  setLog('—');
  enableExport(false);
});

// ── Init: restore state when popup reopens ──────────────────────────────────

(async () => {
  const r = await chrome.storage.local.get(['gmLastQuery', 'gmRunning', 'gmCount', 'gmLeads', 'gmLog', 'gmError']);

  if (r.gmLastQuery) $('query').value = r.gmLastQuery;

  const count = r.gmCount || 0;
  const has   = (r.gmLeads?.length || 0) > 0;

  enableExport(has);
  if (count > 0) setProgress(count, currentTarget);
  if (r.gmLog) setLog(r.gmLog);

  if (r.gmRunning) {
    setStatus('running', `Scraping in progress… ${count} leads`);
    setRunning(true);
    startPoll();
    const tabs = await chrome.tabs.query({ url: 'https://www.google.com/maps/*' });
    if (tabs.length > 0) mapsTabId = tabs[0].id;
  } else if (count > 0) {
    setStatus('done', `${count} lead${count !== 1 ? 's' : ''} collected — ready to export`);
  }
})();
