/**
 * Background service worker — handles exports.
 */

import { getConnections } from '../utils/storage.js';
import { exportAs } from '../utils/export.js';

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.get('connections', (data) => {
    if (!Array.isArray(data.connections)) {
      chrome.storage.local.set({ connections: [], isRunning: false });
    }
  });
  console.log('[LCS] Background worker installed.');
});

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
