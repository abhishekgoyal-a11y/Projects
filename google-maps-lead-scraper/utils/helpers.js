// Shared utilities injected into content world via globalThis.GMLS
(function () {
  'use strict';

  const sleep    = ms => new Promise(r => setTimeout(r, ms));
  const randInt  = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
  const randSleep = (min, max) => sleep(randInt(min, max));

  async function retry(fn, { attempts = 3, delay = 600 } = {}) {
    for (let i = 0; i < attempts; i++) {
      try {
        const r = await fn();
        if (r !== null && r !== undefined) return r;
      } catch (e) {
        if (i === attempts - 1) throw e;
      }
      await sleep(delay);
    }
    return null;
  }

  function waitForEl(selector, { timeout = 8000, root = document } = {}) {
    return new Promise(resolve => {
      const el = root.querySelector(selector);
      if (el) return resolve(el);
      const timer = setTimeout(() => { obs.disconnect(); resolve(null); }, timeout);
      const obs = new MutationObserver(() => {
        const found = root.querySelector(selector);
        if (found) { clearTimeout(timer); obs.disconnect(); resolve(found); }
      });
      obs.observe(root, { childList: true, subtree: true });
    });
  }

  globalThis.GMLS = { sleep, randInt, randSleep, retry, waitForEl };
})();
