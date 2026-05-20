/**
 * Background service worker — coordinates exports and forwards messages
 * between the popup and content script when needed.
 *
 * Most of the heavy lifting (scrolling, scraping, persistence) happens in
 * the content script; the worker is intentionally thin to stay friendly to
 * MV3's lifecycle (it can be terminated and restarted at any time).
 */

import { getPosts } from '../utils/storage.js';
import { exportAs } from '../utils/export.js';

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.get('posts', (data) => {
    if (!Array.isArray(data.posts)) {
      chrome.storage.local.set({ posts: [], isRunning: false });
    }
  });
  console.log('[LFS] Background worker installed.');
});

chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
  (async () => {
    try {
      if (msg.type === 'EXPORT') {
        const posts = await getPosts();
        await exportAs(msg.format || 'json', posts);
        sendResponse({ ok: true });
      } else if (msg.type === 'GET_POSTS') {
        const posts = await getPosts();
        sendResponse({ ok: true, posts });
      } else {
        // Fall-through: not our message; let other listeners handle.
        sendResponse({ ok: false, ignored: true });
      }
    } catch (err) {
      console.error('[LFS] Background error:', err);
      sendResponse({ ok: false, error: err.message || String(err) });
    }
  })();
  return true;
});
