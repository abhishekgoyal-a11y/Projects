// DOM extraction helpers for Google Maps — exposed on globalThis.GMScraper
(function () {
  'use strict';

  // Selectors use data-item-id attributes which are more stable than generated class names.
  const SEL = {
    feed:        'div[role="feed"]',
    feedLinks:   'div[role="feed"] a[href*="/maps/place/"]',

    // Detail panel
    name:        'h1.DUwDvf, h1[class*="fontHeadlineLarge"]',
    phone:       'button[data-item-id^="phone:tel:"], button[aria-label^="Phone:"]',
    website:     'a[data-item-id="authority"], a[aria-label^="Website:"]',
    address:     'button[data-item-id="address"], button[aria-label^="Address:"]',
    category:    'button.DkEaL',
    rating:      'div.F7nice span[aria-hidden="true"]',
    reviewCount: 'div.F7nice span[aria-label]:nth-child(1)',
    backBtn:     'button[aria-label="Back"], button[aria-label="Go back"]',
  };

  // Try each comma-separated selector, return first matching element.
  function q(selStr, root = document) {
    for (const sel of selStr.split(',')) {
      const el = root.querySelector(sel.trim());
      if (el) return el;
    }
    return null;
  }

  function extractName() {
    return q(SEL.name)?.textContent.trim() || '';
  }

  function extractPhone() {
    const el = q(SEL.phone);
    if (!el) return '';
    // Prefer data-item-id="phone:tel:+1234567890"
    const fromId = (el.getAttribute('data-item-id') || '').replace('phone:tel:', '').trim();
    if (fromId) return fromId;
    return (el.getAttribute('aria-label') || '').replace(/^Phone:\s*/i, '').trim();
  }

  function extractWebsite() {
    return q(SEL.website)?.href || '';
  }

  function extractAddress() {
    const el = q(SEL.address);
    if (!el) return '';
    return (el.getAttribute('aria-label') || '').replace(/^Address:\s*/i, '').trim()
      || el.textContent.trim();
  }

  function extractCategory() {
    return q(SEL.category)?.textContent.trim() || '';
  }

  function extractRating() {
    return q(SEL.rating)?.textContent.trim() || '';
  }

  function extractReviewCount() {
    const el = q(SEL.reviewCount);
    if (!el) return '';
    const label = el.getAttribute('aria-label') || '';
    const m = label.match(/[\d,]+/);
    return m ? m[0].replace(',', '') : '';
  }

  // Return deduplicated place links visible in the feed right now.
  function getFeedLinks() {
    const seen = new Set();
    return Array.from(document.querySelectorAll(SEL.feedLinks)).filter(a => {
      if (seen.has(a.href)) return false;
      seen.add(a.href);
      return true;
    });
  }

  function getFeed() {
    return document.querySelector(SEL.feed);
  }

  globalThis.GMScraper = {
    SEL,
    extractName, extractPhone, extractWebsite, extractAddress,
    extractCategory, extractRating, extractReviewCount,
    getFeedLinks, getFeed,
  };
})();
