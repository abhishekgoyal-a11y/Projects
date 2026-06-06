// Main scrape loop for Google Maps Lead Scraper
(function () {
  'use strict';

  const { sleep, randInt, randSleep, waitForEl } = globalThis.GMLS;
  const S = globalThis.GMScraper;

  const DETAIL_TIMEOUT_MS = 7000;
  const SCROLL_MIN_MS    = 1500;
  const SCROLL_MAX_MS    = 2800;
  const MAX_STALL        = 6;
  const MAX_RUNTIME_MS   = 30 * 60 * 1000;

  let running      = false;
  let fetchEmails  = true;
  let leads        = [];
  let processedIds = new Set();

  function extAlive() {
    try { return !!chrome.runtime?.id; } catch { return false; }
  }

  async function safeGet(key) {
    if (!extAlive()) return null;
    try { const r = await chrome.storage.local.get(key); return r[key] ?? null; } catch { return null; }
  }

  async function safeSet(obj) {
    if (!extAlive()) return;
    try { await chrome.storage.local.set(obj); } catch {}
  }

  async function report(log) {
    await safeSet({ gmLeads: leads, gmCount: leads.length, gmLog: log });
    if (!extAlive()) return;
    try { chrome.runtime.sendMessage({ type: 'PROGRESS', count: leads.length, log }); } catch {}
  }

  async function fetchEmail(websiteUrl) {
    if (!websiteUrl || !fetchEmails || !extAlive()) return '';
    try {
      const r = await chrome.runtime.sendMessage({ type: 'FETCH_EMAIL', url: websiteUrl });
      return r?.email || '';
    } catch { return ''; }
  }

  // Derive a stable dedup key from the place URL.
  function placeKey(href) {
    const m = href.match(/\/maps\/place\/([^/@]+)/);
    return m ? decodeURIComponent(m[1]).toLowerCase() : href;
  }

  async function goBackToList() {
    const btn = document.querySelector(S.SEL.backBtn);
    if (btn) btn.click();
    else history.back();
    // Wait for the feed to reappear (list view) — up to 7 s.
    await waitForEl(S.SEL.feed, { timeout: 7000 });
    await randSleep(700, 1300);
  }

  async function scrapeOneLink(link) {
    const key = placeKey(link.href);
    if (processedIds.has(key)) return 'duplicate';
    processedIds.add(key);

    link.click();

    // Wait for the business name heading to confirm detail panel is loaded.
    const nameEl = await waitForEl(S.SEL.name, { timeout: DETAIL_TIMEOUT_MS });
    if (!nameEl) { await goBackToList(); return null; }

    await randSleep(500, 1000);

    const name     = S.extractName();
    if (!name) { await goBackToList(); return null; }

    const phone    = S.extractPhone();
    const website  = S.extractWebsite();
    const address  = S.extractAddress();
    const category = S.extractCategory();
    const rating   = S.extractRating();
    const reviews  = S.extractReviewCount();

    // Email is fetched from the business website by the background service worker.
    const email = await fetchEmail(website);

    await goBackToList();

    return {
      id: key,
      name,
      phone,
      email,
      website,
      address,
      category,
      rating,
      reviews,
      scrapedAt: new Date().toISOString(),
    };
  }

  async function scrollFeed() {
    const feed = S.getFeed();
    if (!feed) return;
    feed.scrollTop += randInt(400, 750);
    await randSleep(SCROLL_MIN_MS, SCROLL_MAX_MS);
  }

  async function runScrape(target, opts) {
    running     = true;
    fetchEmails = opts.fetchEmails !== false;

    await safeSet({ gmRunning: true, gmLeads: leads, gmCount: leads.length, gmLog: 'Starting…' });

    // Wait for the search-results feed to appear (Maps may still be loading).
    const feed = await waitForEl(S.SEL.feed, { timeout: 15000 });
    if (!feed) {
      await safeSet({ gmRunning: false, gmError: 'Results feed not found. Make sure you are on a Google Maps search page.' });
      running = false;
      return;
    }

    let stall    = 0;
    const deadline = Date.now() + MAX_RUNTIME_MS;

    while (running && leads.length < target && Date.now() < deadline) {
      if (!extAlive()) break;

      // Re-read links each iteration — DOM refreshes after back navigation.
      const newLinks = S.getFeedLinks().filter(a => !processedIds.has(placeKey(a.href)));

      if (newLinks.length === 0) {
        stall++;
        if (stall >= MAX_STALL) break;
        await report(`No new results visible, scrolling… (${stall}/${MAX_STALL})`);
        await scrollFeed();
        continue;
      }

      stall = 0;
      const link = newLinks[0]; // one at a time so DOM refs stay fresh after back nav

      const result = await scrapeOneLink(link);

      if (result && result !== 'duplicate') {
        leads.push(result);
        await report(`Collected: ${result.name}${result.phone ? ' · ' + result.phone : ''}`);
      }

      await randSleep(300, 600);
    }

    running = false;
    await safeSet({
      gmRunning: false,
      gmLeads: leads,
      gmCount: leads.length,
      gmLog: `Done — ${leads.length} lead${leads.length !== 1 ? 's' : ''} collected.`,
    });
    if (extAlive()) {
      try { chrome.runtime.sendMessage({ type: 'DONE', count: leads.length }); } catch {}
    }
  }

  // Restore existing leads from storage when the content script (re-)injects.
  (async () => {
    const stored = await safeGet('gmLeads');
    if (Array.isArray(stored)) {
      leads        = stored;
      processedIds = new Set(stored.map(l => l.id).filter(Boolean));
    }
  })();

  chrome.runtime.onMessage.addListener((msg, _sender, respond) => {
    if (msg.type === 'PING') {
      respond({ ok: true });

    } else if (msg.type === 'START_SCRAPE') {
      if (running) { respond({ ok: false, reason: 'already running' }); return; }
      leads        = [];
      processedIds = new Set();
      runScrape(msg.target || 20, { fetchEmails: msg.fetchEmails });
      respond({ ok: true });

    } else if (msg.type === 'STOP_SCRAPE') {
      running = false;
      respond({ ok: true });
    }
  });
})();
