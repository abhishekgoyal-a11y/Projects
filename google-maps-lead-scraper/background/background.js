// MV3 service worker — handles email fetching from business websites and file exports.
'use strict';

const EMAIL_RE = /[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/g;

// Words that reliably indicate a false-positive email address.
const SKIP_PATTERNS = [
  'example', 'yoursite', 'domain', 'sentry', 'wixpress', 'wordpress',
  'schema', 'noreply', 'no-reply', 'donotreply', 'placeholder', 'test@',
  'user@', 'name@', 'email@', 'info@info',
];

// Social / platform sites rarely expose a scrapable contact email in their HTML.
const SOCIAL_HOSTS = [
  'facebook.com', 'instagram.com', 'twitter.com', 'x.com',
  'linkedin.com', 'youtube.com', 'tiktok.com', 'pinterest.com',
];

function isSocialUrl(url) {
  try { return SOCIAL_HOSTS.some(h => new URL(url).hostname.includes(h)); }
  catch { return false; }
}

function parseEmails(html) {
  // Prefer mailto: links — they're intentional contact addresses.
  const mailtoEmails = (html.match(/mailto:([^"'?> \t\n\r]+)/gi) || [])
    .map(m => m.slice(7).split('?')[0].trim());

  const bodyEmails = html.match(EMAIL_RE) || [];

  const all = [...new Set([...mailtoEmails, ...bodyEmails])];
  return all.filter(e => {
    const lo = e.toLowerCase();
    if (SKIP_PATTERNS.some(p => lo.includes(p))) return false;
    if (/\.(png|jpg|gif|css|js|svg)$/i.test(lo)) return false;
    return true;
  });
}

async function fetchEmailFromSite(url) {
  if (!url || isSocialUrl(url)) return '';
  const ctrl = new AbortController();
  const tid  = setTimeout(() => ctrl.abort(), 9000);
  try {
    const res = await fetch(url, { signal: ctrl.signal });
    clearTimeout(tid);
    if (!res.ok) return '';
    const html  = await res.text();
    const found = parseEmails(html);
    return found[0] || '';
  } catch {
    clearTimeout(tid);
    return '';
  }
}

// ── Export helpers ──────────────────────────────────────────────────────────

const EXPORT_HEADERS = ['name', 'phone', 'email', 'website', 'address', 'category', 'rating', 'reviews', 'scrapedAt'];

function escCSV(v) {
  if (v == null) return '';
  const s = String(v);
  return /[",\n\r]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
}

function toCSV(leads) {
  const lines = [EXPORT_HEADERS.map(escCSV).join(',')];
  for (const r of leads) lines.push(EXPORT_HEADERS.map(h => escCSV(r[h])).join(','));
  return lines.join('\r\n');
}

function download(content, mimeType, ext) {
  // URL.createObjectURL is unavailable in MV3 service workers — use a data URL instead.
  const base64  = btoa(unescape(encodeURIComponent(content)));
  const dataUrl = `data:${mimeType};base64,${base64}`;
  chrome.downloads.download({ url: dataUrl, filename: `maps_leads_${Date.now()}.${ext}` });
}

// ── Message router ──────────────────────────────────────────────────────────

chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
  if (msg.type === 'FETCH_EMAIL') {
    fetchEmailFromSite(msg.url).then(email => sendResponse({ email }));
    return true; // keep message channel open for async response
  }

  if (msg.type === 'EXPORT') {
    const { leads = [], format } = msg;
    if (format === 'csv') {
      download(toCSV(leads), 'text/csv', 'csv');
    } else {
      download(JSON.stringify(leads, null, 2), 'application/json', 'json');
    }
    sendResponse({ ok: true });
  }
});
