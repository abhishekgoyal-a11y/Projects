/**
 * Storage helpers for chrome.storage.local.
 */

export async function getConnections() {
  const { connections } = await chrome.storage.local.get('connections');
  return Array.isArray(connections) ? connections : [];
}

export async function setConnections(connections) {
  await chrome.storage.local.set({ connections });
}

export async function clearConnections() {
  await chrome.storage.local.set({ connections: [] });
}
