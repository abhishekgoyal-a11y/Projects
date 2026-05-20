/**
 * Shared helper utilities — exposed on globalThis.LFS so both content
 * scripts and other modules can access them without ES module imports
 * (content scripts run in an isolated world that doesn't easily support
 * module imports across script files declared in manifest).
 */

(function () {
  const LFS = (globalThis.LFS = globalThis.LFS || {});

  LFS.sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  /** Random integer in [min, max] inclusive. */
  LFS.randInt = (min, max) =>
    Math.floor(Math.random() * (max - min + 1)) + min;

  /** Random float in [min, max). */
  LFS.randFloat = (min, max) => Math.random() * (max - min) + min;

  /**
   * Wait up to `timeoutMs` for `predicate()` to return truthy.
   * Polls every `intervalMs`. Resolves with the truthy value or null.
   */
  LFS.waitFor = async (predicate, { timeoutMs = 5000, intervalMs = 200 } = {}) => {
    const start = Date.now();
    while (Date.now() - start < timeoutMs) {
      try {
        const result = predicate();
        if (result) return result;
      } catch {
        /* swallow — caller decides */
      }
      await LFS.sleep(intervalMs);
    }
    return null;
  };

  /**
   * Retry an async function up to `attempts` times with exponential backoff.
   */
  LFS.retry = async (fn, { attempts = 3, baseDelayMs = 300 } = {}) => {
    let lastErr;
    for (let i = 0; i < attempts; i++) {
      try {
        return await fn();
      } catch (err) {
        lastErr = err;
        await LFS.sleep(baseDelayMs * Math.pow(2, i) + LFS.randInt(0, 200));
      }
    }
    throw lastErr;
  };

  /** Strip whitespace and normalize internal blanks. */
  LFS.cleanText = (text) => {
    if (!text) return '';
    return String(text).replace(/\s+/g, ' ').trim();
  };

  /** Absolute URL from a possibly relative href. */
  LFS.absoluteUrl = (href) => {
    if (!href) return '';
    try {
      return new URL(href, 'https://www.linkedin.com').toString();
    } catch {
      return href;
    }
  };

  /** Convert array of flat objects to CSV string (RFC 4180-ish). */
  LFS.toCSV = (rows) => {
    if (!rows || rows.length === 0) return '';
    const headers = Array.from(
      rows.reduce((set, row) => {
        Object.keys(row).forEach((k) => set.add(k));
        return set;
      }, new Set())
    );
    const escape = (val) => {
      if (val === null || val === undefined) return '';
      const s = String(val);
      if (/[",\n\r]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
      return s;
    };
    const lines = [headers.join(',')];
    for (const row of rows) {
      lines.push(headers.map((h) => escape(row[h])).join(','));
    }
    return lines.join('\n');
  };

  /** Lightweight logger that prefixes everything. */
  LFS.log = (...args) => console.log('[LFS]', ...args);
  LFS.warn = (...args) => console.warn('[LFS]', ...args);
  LFS.error = (...args) => console.error('[LFS]', ...args);
})();
