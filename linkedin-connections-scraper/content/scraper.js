/**
 * DOM extraction for LinkedIn connections list.
 */

(function () {
  const LCS = globalThis.LCS;
  if (!LCS) return;

  const PROFILE_PATH_RE = /^\/in\/[^/?#]+\/?$/;

  function profileSlug(url) {
    try {
      const u = new URL(url);
      const m = u.pathname.match(/^\/in\/([^/?#]+)/);
      return m ? m[1].toLowerCase() : '';
    } catch {
      return '';
    }
  }

  function findProfileLink(root) {
    const links = root.querySelectorAll('a[href*="/in/"]');
    for (const a of links) {
      try {
        const path = new URL(a.href, location.origin).pathname;
        if (PROFILE_PATH_RE.test(path)) return a;
      } catch {
        /* ignore */
      }
    }
    return null;
  }

  function extractName(profileLink, root) {
    if (profileLink) {
      const fromLink = LCS.cleanText(profileLink.textContent);
      if (fromLink && fromLink.length < 120) return fromLink;

      const aria = profileLink.getAttribute('aria-label') || '';
      const ariaMatch = aria.match(/(?:View|Open)\s+(.+?)(?:'s|'s)?\s+profile/i);
      if (ariaMatch) return LCS.cleanText(ariaMatch[1]);
    }

    const nameEl =
      root.querySelector('.mn-connection-card__name') ||
      root.querySelector('[data-anonymize="person-name"]') ||
      root.querySelector('span[dir="ltr"] > span[aria-hidden="true"]');

    return LCS.cleanText(nameEl?.textContent || '');
  }

  function extractHeadline(root) {
    const el =
      root.querySelector('.mn-connection-card__occupation') ||
      root.querySelector('[data-anonymize="headline"]') ||
      root.querySelector('.entity-result__primary-subtitle') ||
      root.querySelector('.artdeco-entity-lockup__subtitle');

    return LCS.cleanText(el?.textContent || '');
  }

  function extractConnectedAt(root) {
    const timeEl = root.querySelector('time');
    if (timeEl) {
      const dt = timeEl.getAttribute('datetime');
      const label = LCS.cleanText(timeEl.textContent);
      return dt || label;
    }

    const text = root.textContent || '';
    const match = text.match(/Connected\s+(?:on\s+)?([A-Za-z]{3,9}\s+\d{1,2},?\s+\d{4}|\d+\s+[A-Za-z]{3,9}\s+\d{4})/i);
    return match ? LCS.cleanText(match[0]) : '';
  }

  LCS.Scraper = {
    CONNECTIONS_URL: 'https://www.linkedin.com/mynetwork/invite-connect/connections/',

    findConnectionNodes() {
      const seen = new Set();
      const nodes = [];

      const selectors = [
        'li.mn-connection-card',
        'div.mn-connection-card',
        '[data-view-name="connections-list"] li',
        'ul.mn-connections li',
        'main li:has(a[href*="/in/"])',
      ];

      for (const sel of selectors) {
        try {
          document.querySelectorAll(sel).forEach((node) => {
            if (!node.querySelector('a[href*="/in/"]')) return;
            if (seen.has(node)) return;
            seen.add(node);
            nodes.push(node);
          });
        } catch {
          /* :has() unsupported in very old engines — skip */
        }
      }

      if (nodes.length > 0) return nodes;

      document.querySelectorAll('a[href*="/in/"]').forEach((a) => {
        try {
          const path = new URL(a.href, location.origin).pathname;
          if (!PROFILE_PATH_RE.test(path)) return;
          const card =
            a.closest('li') ||
            a.closest('[class*="connection"]') ||
            a.closest('.artdeco-entity-lockup') ||
            a.parentElement;
          if (!card || seen.has(card)) return;
          seen.add(card);
          nodes.push(card);
        } catch {
          /* ignore */
        }
      });

      return nodes;
    },

    scrapeConnection(node) {
      const profileLink = findProfileLink(node);
      const profileUrl = profileLink ? LCS.absoluteUrl(profileLink.href.split('?')[0]) : '';
      const slug = profileSlug(profileUrl);
      if (!slug) return null;

      const name = extractName(profileLink, node);
      const headline = extractHeadline(node);
      const connectedAt = extractConnectedAt(node);

      return {
        id: slug,
        name,
        profileUrl,
        headline,
        connectedAt,
        scrapedAt: new Date().toISOString(),
      };
    },

    getScrollContainer() {
      const candidates = [
        document.querySelector('.scaffold-finite-scroll__content'),
        document.querySelector('[data-view-name="connections-list"]'),
        document.querySelector('main'),
        document.scrollingElement,
        document.documentElement,
      ];
      for (const el of candidates) {
        if (!el) continue;
        if (el.scrollHeight > el.clientHeight + 20) return el;
      }
      return document.scrollingElement || document.documentElement;
    },
  };
})();
