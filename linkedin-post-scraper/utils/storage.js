/**
 * Storage helpers — thin promise-based wrappers around chrome.storage.local.
 * Usable from popup and background (ES module).
 */

export async function getPosts() {
  const { posts } = await chrome.storage.local.get('posts');
  return Array.isArray(posts) ? posts : [];
}

export async function setPosts(posts) {
  await chrome.storage.local.set({ posts });
}

export async function clearPosts() {
  await chrome.storage.local.set({ posts: [] });
}

export async function getRunState() {
  return await chrome.storage.local.get(['isRunning', 'target', 'startedAt']);
}

export async function setRunState(state) {
  await chrome.storage.local.set(state);
}
