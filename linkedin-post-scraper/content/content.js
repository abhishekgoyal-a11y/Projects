/**
 * Content script — drives infinite scrolling and post collection on the
 * LinkedIn feed. Communicates with the popup/background via messages and
 * persists collected posts to chrome.storage.local.
 */

(function () {
  if (globalThis.LFS?._contentRegistered) return; // prevent double-injection
  const LFS = globalThis.LFS;
  if (!LFS || !LFS.Scraper) {
    console.error('[LFS] helpers/scraper not loaded — aborting content script.');
    return;
  }
  LFS._contentRegistered = true;

  // After the extension is reloaded/updated, orphan content scripts keep
  // running on the page but `chrome.runtime.id` becomes undefined and any
  // chrome.* call throws "Extension context invalidated". Guard with this
  // helper and treat that specific error as a clean stop signal.
  const extAlive = () => Boolean(chrome?.runtime?.id);
  const isContextInvalidated = (err) =>
    err && /Extension context invalidated/i.test(err.message || String(err));

  const SCROLL_MIN_MS = 1400;
  const SCROLL_MAX_MS = 2800;
  const SCROLL_STEP_MIN = 600;
  const SCROLL_STEP_MAX = 1100;
  const STALL_LIMIT = 5;
  const MAX_RUNTIME_MS = 30 * 60 * 1000;

  const session = {
    running: false,
    target: 0,
    seen: new Set(),
    posts: [],
    stallCount: 0,
    startedAt: 0,
  };

  async function loadExistingPosts() {
    if (!extAlive()) return;
    try {
      const data = await chrome.storage.local.get('posts');
      const posts = Array.isArray(data.posts) ? data.posts : [];
      session.posts = posts;
      session.seen = new Set(posts.map((p) => p.id));
    } catch (err) {
      if (!isContextInvalidated(err)) throw err;
    }
  }

  async function persistPosts() {
    if (!extAlive()) return;
    try {
      await chrome.storage.local.set({ posts: session.posts });
    } catch (err) {
      if (!isContextInvalidated(err)) throw err;
    }
  }

  function safeSendMessage(message) {
    if (!extAlive()) return;
    try {
      chrome.runtime.sendMessage(message).catch(() => {});
    } catch {
      /* context invalidated between the check and the call — ignore */
    }
  }

  function reportProgress(extra = {}) {
    safeSendMessage({
      type: 'PROGRESS_UPDATE',
      collected: session.posts.length,
      target: session.target,
      ...extra,
    });
  }

  function reportDone() {
    safeSendMessage({
      type: 'SCRAPE_DONE',
      collected: session.posts.length,
    });
  }

  function reportError(error) {
    safeSendMessage({ type: 'SCRAPE_ERROR', error: String(error) });
  }

  async function collectVisiblePosts() {
    const nodes = LFS.Scraper.findPostNodes();
    let added = 0;
    for (const node of nodes) {
      if (!session.running) break;
      if (session.posts.length >= session.target) break;

      const post = await LFS.retry(() => LFS.Scraper.scrapePost(node), {
        attempts: 2,
        baseDelayMs: 150,
      }).catch(() => null);

      if (!post || !post.id) continue;
      if (session.seen.has(post.id)) continue;

      session.seen.add(post.id);
      session.posts.push(post);
      added++;
    }

    if (added > 0) {
      await persistPosts();
      reportProgress({ log: `+${added} post(s) (total ${session.posts.length})` });
    }
    return added;
  }

  async function performScrollStep() {
    const step = LFS.randInt(SCROLL_STEP_MIN, SCROLL_STEP_MAX);
    const before = window.scrollY;
    window.scrollBy({ top: step, left: 0, behavior: 'smooth' });

    const waited = await LFS.waitFor(
      () => window.scrollY > before + 50 || window.scrollY + window.innerHeight >= document.body.scrollHeight - 5,
      { timeoutMs: 2000, intervalMs: 100 }
    );

    await LFS.sleep(LFS.randInt(SCROLL_MIN_MS, SCROLL_MAX_MS));
    return Boolean(waited);
  }

  // Returns true if a "load more" button was found and clicked.
  // Profile/group pages are paginated rather than infinitely scrolling, so
  // after clicking we wait longer to give the next batch time to render.
  async function clickShowMoreIfPresent() {
    const showMoreBtn = document.querySelector([
      'button.scaffold-finite-scroll__load-button',
      'button[aria-label*="Show more"]',
      'button[aria-label*="Load more"]',
      'button[aria-label*="show more results" i]',
      'button[aria-label*="See more" i]',
    ].join(', '));

    if (showMoreBtn && !showMoreBtn.dataset.lfsClicked) {
      try {
        showMoreBtn.dataset.lfsClicked = '1';
        showMoreBtn.click();
        // Wait longer on paginated pages — new batch takes time to render
        await LFS.sleep(LFS.randInt(2000, 3500));
        return true;
      } catch {
        /* ignore */
      }
    }
    return false;
  }

  async function runLoop() {
    session.startedAt = Date.now();
    reportProgress({ status: 'Scraping…', log: 'Loop started.' });

    try {
      await collectVisiblePosts();

      while (session.running && session.posts.length < session.target) {
        // Extension was reloaded mid-scrape — stop quietly. Any further
        // chrome.* call would throw "Extension context invalidated".
        if (!extAlive()) {
          session.running = false;
          return;
        }

        if (Date.now() - session.startedAt > MAX_RUNTIME_MS) {
          reportProgress({ log: 'Max runtime reached — stopping.', logKind: 'error' });
          break;
        }

        const beforeCount = session.posts.length;
        const beforeHeight = document.body.scrollHeight;

        await performScrollStep();
        const clicked = await clickShowMoreIfPresent();
        await collectVisiblePosts();

        const grew = session.posts.length > beforeCount;
        const pageGrew = document.body.scrollHeight > beforeHeight + 10;

        if (!grew && !pageGrew) {
          // Clicking "load more" counts as productive even if new posts
          // haven't rendered yet — don't penalise it as a stall.
          if (clicked) {
            session.stallCount = 0;
          } else {
            session.stallCount++;
            if (session.stallCount >= STALL_LIMIT) {
              reportProgress({
                log: `Feed appears exhausted after ${STALL_LIMIT} stalled scrolls.`,
                logKind: 'error',
              });
              break;
            }
            await LFS.sleep(LFS.randInt(1500, 2500));
          }
        } else {
          session.stallCount = 0;
        }
      }
    } catch (err) {
      if (isContextInvalidated(err)) {
        // Orphaned content script after extension reload — silent exit.
        return;
      }
      LFS.error('runLoop error:', err);
      reportError(err.message || String(err));
    } finally {
      session.running = false;
      if (extAlive()) {
        try {
          await chrome.storage.local.set({ isRunning: false });
        } catch (err) {
          if (!isContextInvalidated(err)) throw err;
        }
        reportProgress({ status: session.posts.length >= session.target ? 'Done' : 'Stopped' });
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
          session.target = Math.max(1, parseInt(msg.target, 10) || 50);
          await loadExistingPosts();
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

  LFS.log('Content script ready on', location.href);
})();
