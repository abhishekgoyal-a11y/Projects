/**
 * Scraper utilities — pure DOM extraction. Lives on globalThis.LFS.Scraper.
 * Selectors are deliberately resilient: LinkedIn changes class names often,
 * so we use data-* attributes and structural fallbacks where possible.
 */

(function () {
  const LFS = (globalThis.LFS = globalThis.LFS || {});

  const POST_SELECTORS = [
    'div.feed-shared-update-v2',
    'div[data-id^="urn:li:activity:"]',
    'div.occludable-update',
  ];

  function findPostNodes(root = document) {
    const nodes = new Set();
    for (const sel of POST_SELECTORS) {
      root.querySelectorAll(sel).forEach((n) => nodes.add(n));
    }
    return Array.from(nodes);
  }

  function extractPostUrn(node) {
    const urn =
      node.getAttribute('data-id') ||
      node.getAttribute('data-urn') ||
      node.querySelector('[data-urn^="urn:li:activity:"]')?.getAttribute('data-urn') ||
      '';
    if (urn) return urn;
    const link = node.querySelector('a[href*="/feed/update/urn:li:activity:"]');
    if (link) {
      const match = link.href.match(/urn:li:activity:\d+/);
      if (match) return match[0];
    }
    return '';
  }

  function extractPostUrl(node, urn) {
    const direct = node.querySelector(
      'a[href*="/feed/update/urn:li:activity:"]'
    );
    if (direct?.href) return LFS.absoluteUrl(direct.href.split('?')[0]);
    if (urn) return `https://www.linkedin.com/feed/update/${urn}/`;
    return '';
  }

  function extractAuthor(node) {
    // Scope to the actor block so we don't pick up commenters / suggested-by links.
    const actor =
      node.querySelector('.update-components-actor__container') ||
      node.querySelector('.update-components-actor') ||
      node.querySelector('.feed-shared-actor');

    const scope = actor || node;
    let name = '';
    let url = '';

    // URL: any /in/ or /company/ link in the actor block. Either link
    // (image or text) points at the same profile, so we just take the first.
    const urlLink =
      scope.querySelector('a[href*="/in/"]') ||
      scope.querySelector('a[href*="/company/"]') ||
      scope.querySelector('a[href*="/school/"]');
    if (urlLink) {
      url = LFS.absoluteUrl(urlLink.href.split('?')[0]);
    }

    // Name: the visible name lives in an aria-hidden span inside the
    // actor title. We must NOT fall back to aria-label, because the
    // image-link's aria-label is "View X's graphic link" — that's why
    // earlier runs produced garbage names.
    const titleContainer =
      scope.querySelector('.update-components-actor__title') ||
      scope.querySelector('.update-components-actor__name') ||
      scope.querySelector('.feed-shared-actor__name');

    if (titleContainer) {
      const visible = titleContainer.querySelector('span[aria-hidden="true"]');
      const clone = (visible || titleContainer).cloneNode(true);
      // Strip duplicated screen-reader text and the "• 1st" / "• Following"
      // suffixes LinkedIn inlines next to the name.
      clone
        .querySelectorAll('.visually-hidden, .update-components-actor__supplementary-actor-info')
        .forEach((el) => el.remove());
      name = LFS.cleanText(clone.textContent || '');
      // Strip trailing degree / follow markers if any survived.
      name = name.replace(/\s*•\s*(1st|2nd|3rd\+?|Following).*$/i, '').trim();
    }

    return { name, url };
  }

  function expandSeeMore(node) {
    const seeMore = node.querySelector(
      'button.feed-shared-inline-show-more-text__see-more-less-toggle, button.see-more, button[aria-label*="see more"]'
    );
    if (seeMore && !seeMore.dataset.lfsClicked) {
      try {
        seeMore.click();
        seeMore.dataset.lfsClicked = '1';
      } catch {
        /* ignore */
      }
    }
  }

  // Block-level tags whose end should produce a paragraph break.
  const BLOCK_TAGS = new Set(['P', 'DIV', 'LI', 'UL', 'OL', 'BLOCKQUOTE', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6']);

  /**
   * Walk the DOM emitting text with proper line breaks. <br> becomes \n,
   * block elements get \n after them. Inline elements (span, a, strong…)
   * pass through transparently — which matters because LinkedIn wraps
   * each visible run of text in a span.
   */
  function richText(root) {
    let out = '';
    const walk = (node) => {
      for (const child of node.childNodes) {
        if (child.nodeType === Node.TEXT_NODE) {
          out += child.nodeValue;
        } else if (child.nodeType === Node.ELEMENT_NODE) {
          const tag = child.tagName;
          if (tag === 'BR') {
            out += '\n';
          } else if (BLOCK_TAGS.has(tag)) {
            walk(child);
            out += '\n';
          } else {
            walk(child);
          }
        }
      }
    };
    walk(root);
    return out;
  }

  /**
   * Clean text while preserving paragraph structure:
   *   - Collapse runs of spaces/tabs (but not newlines).
   *   - Trim whitespace around each newline.
   *   - Collapse 3+ blank lines to a single blank line.
   *   - Trim leading/trailing whitespace overall.
   */
  function tidyMultiline(s) {
    if (!s) return '';
    return s
      .replace(/\r\n?/g, '\n')
      // LinkedIn renders hashtags as <a>hashtag</a><a>#Foo</a>, which
      // textContent reads as "hashtag#Foo". Strip the screen-reader prefix.
      .replace(/\bhashtag(?=#\w)/g, '')
      // Same pattern for @mentions: <a>mention</a><a>@Name</a>.
      .replace(/\bmention(?=@\w)/g, '')
      .replace(/[ \t ]+/g, ' ')
      .replace(/[ \t]*\n[ \t]*/g, '\n')
      .replace(/\n{3,}/g, '\n\n')
      .trim();
  }

  function extractText(node) {
    expandSeeMore(node);
    const textContainer =
      node.querySelector('.update-components-text') ||
      node.querySelector('.feed-shared-update-v2__description') ||
      node.querySelector('.feed-shared-text') ||
      node.querySelector('[data-test-id="main-feed-activity-card"] .update-components-text');

    if (!textContainer) return '';
    const clone = textContainer.cloneNode(true);
    clone
      .querySelectorAll('button, .feed-shared-inline-show-more-text__see-more-less-toggle')
      .forEach((b) => b.remove());
    return tidyMultiline(richText(clone));
  }

  /**
   * Scrape a single post node. Returns null for non-post feed cards
   * (job carousels, "people you may know", aggregate suggestion modules)
   * and for nodes that can't be uniquely identified.
   */
  function scrapePost(node) {
    try {
      const urn = extractPostUrn(node);

      // Only accept real user-authored posts. LinkedIn's feed also serves
      // urn:li:aggregate:* (job/people carousels), urn:li:member:*
      // (person suggestions), urn:li:jobPosting:* (job ads), etc. — none
      // of those carry post text and they pollute the output.
      if (!urn.startsWith('urn:li:activity:')) return null;

      const text = extractText(node);
      const { name: authorName, url: authorUrl } = extractAuthor(node);
      const postUrl = extractPostUrl(node, urn);

      // Drop empty shells: a real post has either body text or at least
      // an identifiable author. This filters out reshare-outer-wrappers
      // whose inner reshared post was unmounted by virtualization.
      if (!text && !authorUrl && !authorName) return null;

      return {
        id: urn,
        urn,
        authorName,
        authorUrl,
        postUrl,
        text,
        scrapedAt: new Date().toISOString(),
      };
    } catch (err) {
      LFS.warn('scrapePost failed:', err);
      return null;
    }
  }

  LFS.Scraper = {
    findPostNodes,
    scrapePost,
  };
})();
