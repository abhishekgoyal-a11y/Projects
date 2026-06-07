/**
 * Background service worker — handles exports and profile enrichment.
 */

import { getConnections, setConnections } from '../utils/storage.js';
import { exportAs } from '../utils/export.js';

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.get('connections', (data) => {
    if (!Array.isArray(data.connections)) {
      chrome.storage.local.set({ connections: [], isRunning: false });
    }
  });
  console.log('[LCS] Background worker installed.');
});

// ── Enrichment ───────────────────────────────────────────────────────────────

const enrich = { running: false };

function broadcastToPopup(msg) {
  chrome.runtime.sendMessage(msg).catch(() => {}); // popup may be closed
}

function waitForTabLoad(tabId) {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      chrome.tabs.onUpdated.removeListener(listener);
      reject(new Error('Tab load timeout'));
    }, 30_000);

    function listener(updatedId, info) {
      if (updatedId === tabId && info.status === 'complete') {
        clearTimeout(timeout);
        chrome.tabs.onUpdated.removeListener(listener);
        resolve();
      }
    }
    chrome.tabs.onUpdated.addListener(listener);
  });
}

// Injected into the profile page — extracts everything in one pass.
function extractProfileData() {
  const clean = (t) => (t ? String(t).replace(/\s+/g, ' ').trim() : '');
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const isDegree  = (t) => /^[·•]\s*(1st|2nd|3rd|\d+)/i.test(t);
  const isPronoun = (t) => /^(She|He|They|Xe|Ze|Ve)\//i.test(t.trim());
  const isNameLike = (t) => t.length > 1 && t.length < 70 &&
    !/premium|free|₹|\$|try\s|linkedin|http|@/i.test(t) &&
    /^[\w\s.'\-,()]+$/i.test(t);

  return (async () => {
    const slug = location.pathname.match(/\/in\/([^/]+)/)?.[1] || '';

    // ── Name ────────────────────────────────────────────────────────────────
    // Try h1, then every <p> inside any self-link, then page title.
    let name = '';

    const h1 = document.querySelector('h1');
    if (h1 && isNameLike(clean(h1.textContent))) name = clean(h1.textContent);

    if (!name && slug) {
      outer: for (const a of document.querySelectorAll(`a[href*="/in/${slug}"]`)) {
        for (const p of a.querySelectorAll('p')) {
          const t = clean(p.textContent);
          if (isNameLike(t) && !isDegree(t)) { name = t; break outer; }
        }
      }
    }

    if (!name) {
      for (const part of document.title.split(/\s*[\|–\-]\s*/)) {
        const t = clean(part);
        if (isNameLike(t)) { name = t; break; }
      }
    }

    // ── Headline ─────────────────────────────────────────────────────────────
    // Walk up from contact-info link; need ancestor with 2+ non-degree <p> tags.
    // ps[0] = professional tagline (the LinkedIn headline).
    let headline = '';
    const contactLink = document.querySelector('a[href*="overlay/contact-info"]');
    if (contactLink) {
      let ancestor = contactLink.parentElement;
      for (let i = 0; i < 12; i++) {
        if (!ancestor) break;
        const ps = [...ancestor.querySelectorAll('p')].filter(
          (p) => p.children.length === 0 &&
                 p.textContent.trim().length > 1 &&
                 !isDegree(p.textContent.trim()) &&
                 !isPronoun(p.textContent.trim())
        );
        if (ps.length >= 2) { headline = clean(ps[0].textContent); break; }
        ancestor = ancestor.parentElement;
      }

      // ── Open contact modal ────────────────────────────────────────────────
      contactLink.click();
      await sleep(400);
      const deadline = Date.now() + 8000;
      while (Date.now() < deadline) {
        if (document.querySelector('a[href^="mailto:"]') ||
            document.querySelector('a[href^="tel:"]') ||
            document.querySelector('.artdeco-modal, [role="dialog"]')) break;
        await sleep(300);
      }
      await sleep(500);
    }

    // ── Email ────────────────────────────────────────────────────────────────
    const modal = document.querySelector('.artdeco-modal, [role="dialog"]');
    const emailEl = (modal || document).querySelector('a[href^="mailto:"]');
    const email = emailEl
      ? clean(emailEl.href.replace('mailto:', '')) || clean(emailEl.textContent)
      : '';

    // ── Phone ────────────────────────────────────────────────────────────────
    let phone = '';
    const telEl = (modal || document).querySelector('a[href^="tel:"]');
    if (telEl) {
      phone = clean(telEl.href.replace('tel:', '')) || clean(telEl.textContent);
    } else {
      // Search for "Phone" label then grab the digits that follow (up to 30 chars gap)
      const searchText = (modal || document.body).innerText ||
                         (modal || document.body).textContent || '';
      const m = searchText.match(/\bPhone\b[\s\S]{0,30}?(\+?[\d][\d\s]{5,}[\d])/i);
      if (m) phone = m[1].replace(/\s+/g, ' ').trim();
    }

    return { name, headline, email, phone };
  })();
}

const EXPORT_FIELDS = ['name', 'profileUrl', 'headline', 'connectedAt', 'phone', 'email'];

function buildDataUrl(connections) {
  const rows = connections.map((c) => {
    const out = {};
    for (const f of EXPORT_FIELDS) out[f] = c[f] ?? '';
    return out;
  });
  const content = JSON.stringify(rows, null, 2);
  const utf8 = new TextEncoder().encode(content);
  let binary = '';
  for (const byte of utf8) binary += String.fromCharCode(byte);
  return `data:application/json;base64,${btoa(binary)}`;
}

async function autoSave(connections) {
  const { enrichFilename } = await chrome.storage.local.get('enrichFilename');
  const filename = enrichFilename || 'linkedin_connections_enriched.json';
  return new Promise((resolve) => {
    chrome.downloads.download({
      url: buildDataUrl(connections),
      filename,
      conflictAction: 'overwrite',
      saveAs: false,
    }, resolve);
  });
}

async function runEnrichment(count) {
  const connections = await getConnections();
  const queue = connections.filter((c) => !c.enriched).slice(0, count);
  const total = queue.length;

  for (let i = 0; i < queue.length; i++) {
    if (!enrich.running) break;

    const conn = queue[i];
    broadcastToPopup({
      type: 'ENRICH_PROGRESS',
      current: i + 1,
      total,
      name: conn.name || conn.profileUrl,
    });

    let tabId = null;
    try {
      const tab = await chrome.tabs.create({ url: conn.profileUrl, active: false });
      tabId = tab.id;
      await waitForTabLoad(tabId);
      await sleep(1500);

      const [{ result }] = await chrome.scripting.executeScript({
        target: { tabId },
        func: extractProfileData,
      });

      if (result) {
        const all = await getConnections();
        const idx = all.findIndex((c) => c.id === conn.id);
        if (idx !== -1) {
          if (result.name) all[idx].name = result.name;
          if (result.headline) all[idx].headline = result.headline;
          all[idx].phone = result.phone || '';
          all[idx].email = result.email || '';
          all[idx].enriched = true;
          await setConnections(all);
          await autoSave(all);
        }
      }
    } catch (err) {
      console.error('[LCS] Enrich error for', conn.profileUrl, err);
    } finally {
      if (tabId) {
        try { await chrome.tabs.remove(tabId); } catch { /* already closed */ }
      }
    }

    if (enrich.running && i < queue.length - 1) {
      await sleep(3000 + randInt(0, 5000));
    }
  }

  enrich.running = false;
  broadcastToPopup({ type: 'ENRICH_DONE', processed: queue.length });
}

// ── Message router ───────────────────────────────────────────────────────────

chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
  (async () => {
    try {
      if (msg.type === 'EXPORT') {
        const connections = await getConnections();
        await exportAs(msg.format || 'json', connections);
        sendResponse({ ok: true });
      } else if (msg.type === 'GET_CONNECTIONS') {
        const connections = await getConnections();
        sendResponse({ ok: true, connections });
      } else if (msg.type === 'ENRICH_START') {
        if (enrich.running) {
          sendResponse({ ok: false, error: 'Already enriching.' });
          return;
        }
        enrich.running = true;
        sendResponse({ ok: true });
        runEnrichment(Math.max(1, parseInt(msg.count, 10) || 50));
      } else if (msg.type === 'ENRICH_STOP') {
        enrich.running = false;
        sendResponse({ ok: true });
      } else if (msg.type === 'ENRICH_STATUS') {
        sendResponse({ ok: true, running: enrich.running });
      } else {
        sendResponse({ ok: false, ignored: true });
      }
    } catch (err) {
      console.error('[LCS] Background error:', err);
      sendResponse({ ok: false, error: err.message || String(err) });
    }
  })();
  return true;
});
