/**
 * Export connections as JSON / CSV via chrome.downloads.
 */

const EXPORT_FIELDS = ['name', 'profileUrl', 'headline', 'connectedAt'];

function projectRow(row) {
  const out = {};
  for (const f of EXPORT_FIELDS) out[f] = row[f] ?? '';
  return out;
}

function toCSV(rows) {
  if (!rows || rows.length === 0) return '';
  const escape = (val) => {
    if (val === null || val === undefined) return '';
    const s = String(val);
    if (/[",\n\r]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
    return s;
  };
  const lines = [EXPORT_FIELDS.join(',')];
  for (const row of rows) {
    lines.push(EXPORT_FIELDS.map((h) => escape(row[h])).join(','));
  }
  return lines.join('\n');
}

function dataUrl(content, mime) {
  const utf8 = new TextEncoder().encode(content);
  let binary = '';
  for (const byte of utf8) binary += String.fromCharCode(byte);
  return `data:${mime};base64,${btoa(binary)}`;
}

function timestamp() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  return (
    d.getFullYear() +
    pad(d.getMonth() + 1) +
    pad(d.getDate()) +
    '_' +
    pad(d.getHours()) +
    pad(d.getMinutes()) +
    pad(d.getSeconds())
  );
}

export async function exportAs(format, connections) {
  if (!connections || connections.length === 0) {
    throw new Error('No connections to export.');
  }

  const projected = connections.map(projectRow);
  let content;
  let mime;
  let ext;

  if (format === 'csv') {
    content = toCSV(projected);
    mime = 'text/csv';
    ext = 'csv';
  } else {
    content = JSON.stringify(projected, null, 2);
    mime = 'application/json';
    ext = 'json';
  }

  const filename = `linkedin_connections_${timestamp()}.${ext}`;
  const url = dataUrl(content, mime);

  return new Promise((resolve, reject) => {
    chrome.downloads.download(
      { url, filename, saveAs: true },
      (downloadId) => {
        if (chrome.runtime.lastError) {
          reject(new Error(chrome.runtime.lastError.message));
        } else {
          resolve(downloadId);
        }
      }
    );
  });
}
