/**
 * Shared helper utilities — exposed on globalThis.LCS for content scripts.
 */

(function () {
  const LCS = (globalThis.LCS = globalThis.LCS || {});

  LCS.sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  LCS.randInt = (min, max) =>
    Math.floor(Math.random() * (max - min + 1)) + min;

  LCS.waitFor = async (predicate, { timeoutMs = 5000, intervalMs = 200 } = {}) => {
    const start = Date.now();
    while (Date.now() - start < timeoutMs) {
      try {
        const result = predicate();
        if (result) return result;
      } catch {
        /* ignore */
      }
      await LCS.sleep(intervalMs);
    }
    return null;
  };

  LCS.retry = async (fn, { attempts = 3, baseDelayMs = 300 } = {}) => {
    let lastErr;
    for (let i = 0; i < attempts; i++) {
      try {
        return await fn();
      } catch (err) {
        lastErr = err;
        await LCS.sleep(baseDelayMs * Math.pow(2, i) + LCS.randInt(0, 200));
      }
    }
    throw lastErr;
  };

  LCS.cleanText = (text) => {
    if (!text) return '';
    return String(text).replace(/\s+/g, ' ').trim();
  };

  LCS.absoluteUrl = (href) => {
    if (!href) return '';
    try {
      return new URL(href, 'https://www.linkedin.com').toString();
    } catch {
      return href;
    }
  };

  LCS.log = (...args) => console.log('[LCS]', ...args);
  LCS.warn = (...args) => console.warn('[LCS]', ...args);
  LCS.error = (...args) => console.error('[LCS]', ...args);
})();
