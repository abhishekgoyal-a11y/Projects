/**
 * Content script — scrolls the LinkedIn connections list and collects entries.
 */

(function () {
  const LCS = globalThis.LCS;
  if (!LCS || !LCS.Scraper) {
    console.error('[LCS] helpers/scraper not loaded — aborting content script.');
    return;
  }

  const extAlive = () => Boolean(chrome?.runtime?.id);
  const isContextInvalidated = (err) =>
    err && /Extension context invalidated/i.test(err.message || String(err));

  const SCROLL_MIN_MS = 1200;
  const SCROLL_MAX_MS = 2400;
  const SCROLL_STEP_MIN = 500;
  const SCROLL_STEP_MAX = 900;
  const STALL_LIMIT = 6;
  const MAX_RUNTIME_MS = 60 * 60 * 1000;

  const session = {
    running: false,
    scrapeAll: true,
    target: 0,
    seen: new Set(),
    connections: [],
    stallCount: 0,
    startedAt: 0,
  };

  async function loadExisting() {
    if (!extAlive()) return;
    try {
      const data = await chrome.storage.local.get('connections');
      const list = Array.isArray(data.connections) ? data.connections : [];
      session.connections = list;
      session.seen = new Set(list.map((c) => c.id));
    } catch (err) {
      if (!isContextInvalidated(err)) throw err;
    }
  }

  async function persist() {
    if (!extAlive()) return;
    try {
      await chrome.storage.local.set({ connections: session.connections });
    } catch (err) {
      if (!isContextInvalidated(err)) throw err;
    }
  }

  function safeSendMessage(message) {
    if (!extAlive()) return;
    try {
      chrome.runtime.sendMessage(message).catch(() => {});
    } catch {
      /* ignore */
    }
  }

  function reportProgress(extra = {}) {
    safeSendMessage({
      type: 'PROGRESS_UPDATE',
      collected: session.connections.length,
      target: session.scrapeAll ? 0 : session.target,
      scrapeAll: session.scrapeAll,
      ...extra,
    });
  }

  function reportDone() {
    safeSendMessage({
      type: 'SCRAPE_DONE',
      collected: session.connections.length,
    });
  }

  function reportError(error) {
    safeSendMessage({ type: 'SCRAPE_ERROR', error: String(error) });
  }

  function atTarget() {
    if (session.scrapeAll) return false;
    return session.connections.length >= session.target;
  }

  async function collectVisible() {
    const nodes = LCS.Scraper.findConnectionNodes();
    let added = 0;

    for (const node of nodes) {
      if (!session.running) break;
      if (atTarget()) break;

      const conn = await LCS.retry(() => LCS.Scraper.scrapeConnection(node), {
        attempts: 2,
        baseDelayMs: 100,
      }).catch(() => null);

      if (!conn || !conn.id) continue;
      if (session.seen.has(conn.id)) continue;

      session.seen.add(conn.id);
      session.connections.push(conn);
      added++;
    }

    if (added > 0) {
      await persist();
      reportProgress({
        log: `+${added} connection(s) (total ${session.connections.length})`,
      });
    }
    return added;
  }

  async function performScrollStep() {
    const container = LCS.Scraper.getScrollContainer();
    const step = LCS.randInt(SCROLL_STEP_MIN, SCROLL_STEP_MAX);
    const before = container.scrollTop;

    container.scrollBy({ top: step, left: 0, behavior: 'smooth' });
    window.scrollBy({ top: step, left: 0, behavior: 'smooth' });

    await LCS.waitFor(
      () =>
        container.scrollTop > before + 30 ||
        container.scrollTop + container.clientHeight >= container.scrollHeight - 5,
      { timeoutMs: 2500, intervalMs: 100 }
    );

    await LCS.sleep(LCS.randInt(SCROLL_MIN_MS, SCROLL_MAX_MS));
    return true;
  }

  async function clickLoadMoreIfPresent() {
    const btn =
      document.querySelector('button.scaffold-finite-scroll__load-button') ||
      document.querySelector('button[aria-label*="Load more"]') ||
      document.querySelector('button[aria-label*="Show more"]');

    if (btn && !btn.disabled) {
      try {
        btn.click();
        await LCS.sleep(LCS.randInt(900, 1600));
      } catch {
        /* ignore */
      }
    }
  }

  async function scrollToTop() {
    const container = LCS.Scraper.getScrollContainer();
    container.scrollTo({ top: 0, behavior: 'auto' });
    window.scrollTo({ top: 0, behavior: 'auto' });
    await LCS.sleep(800);
  }

  async function runLoop() {
    session.startedAt = Date.now();
    reportProgress({ status: 'Scraping…', log: 'Starting from top of connections list…' });

    try {
      await scrollToTop();
      await collectVisible();

      while (session.running && !atTarget()) {
        if (!extAlive()) {
          session.running = false;
          return;
        }

        if (Date.now() - session.startedAt > MAX_RUNTIME_MS) {
          reportProgress({ log: 'Max runtime reached — stopping.', logKind: 'error' });
          break;
        }

        const beforeCount = session.connections.length;
        const container = LCS.Scraper.getScrollContainer();
        const beforeHeight = container.scrollHeight;

        await performScrollStep();
        await clickLoadMoreIfPresent();
        await collectVisible();

        const grew = session.connections.length > beforeCount;
        const pageGrew = container.scrollHeight > beforeHeight + 10;
        const atBottom =
          container.scrollTop + container.clientHeight >= container.scrollHeight - 20;

        if (!grew && !pageGrew && atBottom) {
          session.stallCount++;
          if (session.stallCount >= STALL_LIMIT) {
            reportProgress({
              log: `List appears complete after ${STALL_LIMIT} stalled scrolls.`,
              logKind: 'info',
            });
            break;
          }
          await LCS.sleep(LCS.randInt(1500, 2500));
        } else {
          session.stallCount = 0;
        }
      }
    } catch (err) {
      if (isContextInvalidated(err)) return;
      LCS.error('runLoop error:', err);
      reportError(err.message || String(err));
    } finally {
      session.running = false;
      if (extAlive()) {
        try {
          await chrome.storage.local.set({ isRunning: false });
        } catch (err) {
          if (!isContextInvalidated(err)) throw err;
        }
        const done = session.scrapeAll || session.connections.length >= session.target;
        reportProgress({ status: done ? 'Done' : 'Stopped' });
        reportDone();
      }
    }
  }

  chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
    (async () => {
      try {
        if (msg.type === 'START_SCRAPE') {
          if (session.running) {
            sendResponse({ ok: false, error: 'Already running.' });
            return;
          }

          session.scrapeAll = Boolean(msg.scrapeAll);
          session.target = Math.max(1, parseInt(msg.target, 10) || 99999);
          await loadExisting();
          session.running = true;
          session.stallCount = 0;
          sendResponse({ ok: true });
          runLoop();
        } else if (msg.type === 'STOP_SCRAPE') {
          session.running = false;
          await chrome.storage.local.set({ isRunning: false });
          sendResponse({ ok: true });
        } else if (msg.type === 'PING') {
          sendResponse({ ok: true, alive: true });
        } else {
          sendResponse({ ok: false, error: 'Unknown message type' });
        }
      } catch (err) {
        sendResponse({ ok: false, error: err.message || String(err) });
      }
    })();
    return true;
  });

  LCS.log('Content script ready on', location.href);
})();
