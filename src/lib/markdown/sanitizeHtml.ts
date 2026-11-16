import type * as XSS from 'xss'
import type { IWhiteList } from 'xss'
import xssModule from 'xss'

// `xss` is a CommonJS module: its helpers are only reliably reachable through the default export.
const {
  escapeAttrValue,
  FilterXSS,
  friendlyAttrValue,
  getDefaultWhiteList,
  safeAttrValue,
} = xssModule as unknown as typeof XSS

/** Attributes allowed on every allowed tag. */
const GLOBAL_ATTRIBUTES = ['class', 'id', 'title', 'align', 'target', 'rel', 'style']

/** Tags that markdown-it (and common plugins) can emit, missing from the js-xss default whitelist. */
const EXTRA_TAGS: IWhiteList = {
  input: ['type', 'checked', 'disabled'],
  q: ['cite'],
  dfn: [],
  var: [],
  samp: [],
  wbr: [],
  time: ['datetime'],
  ruby: [],
  rt: [],
  rp: [],
}

/** Extra per-tag attributes markdown-it emits. */
const EXTRA_TAG_ATTRIBUTES: IWhiteList = {
  ol: ['start', 'type', 'reversed'],
  li: ['value'],
}

const RE_DATA_OR_ARIA_ATTRIBUTE = /^(?:data|aria)-[\w-]+$/
// Control characters and whitespace, ignored by browsers when parsing URLs.
const RE_URL_IGNORED_CHARS = /[\s\p{Cc}]/gu
// A URL has a scheme when a colon appears before the first `/`, `?` or `#`.
const RE_URL_SCHEME = /^[^/?#]*:/

function buildWhiteList(): IWhiteList {
  const whiteList: IWhiteList = { ...getDefaultWhiteList(), ...EXTRA_TAGS }

  for (const [tag, attributes] of Object.entries(EXTRA_TAG_ATTRIBUTES)) {
    whiteList[tag] = [...(whiteList[tag] ?? []), ...(attributes ?? [])]
  }

  for (const tag of Object.keys(whiteList)) {
    whiteList[tag] = [...new Set([...(whiteList[tag] ?? []), ...GLOBAL_ATTRIBUTES])]
  }

  return whiteList
}

const filter = new FilterXSS({
  whiteList: buildWhiteList(),
  // Remove tags outside the whitelist (keeping their text), and drop the content of these entirely.
  stripIgnoreTag: true,
  stripIgnoreTagBody: ['script', 'style'],
  allowCommentTag: false,
  onIgnoreTagAttr(_tag, name, value) {
    if (RE_DATA_OR_ARIA_ATTRIBUTE.test(name)) {
      return `${name}="${escapeAttrValue(value)}"`
    }
    // Any other attribute (including `on*` event handlers) is removed.
    return undefined
  },
  safeAttrValue(tag, name, value, cssFilter) {
    const safeValue = safeAttrValue(tag, name, value, cssFilter)

    // js-xss only keeps absolute URLs from a fixed list of schemes and `/`, `./`, `../`, `#` prefixes.
    // Also keep scheme-less relative URLs (e.g. `users/list`, `?page=2`) emitted by Markdown links.
    if ((name === 'href' || name === 'src') && safeValue === '') {
      const url = friendlyAttrValue(value).trim()
      if (url !== '' && !RE_URL_SCHEME.test(url.replace(RE_URL_IGNORED_CHARS, ''))) {
        return escapeAttrValue(url)
      }
    }

    return safeValue
  },
})

/**
 * Sanitizes HTML rendered from Markdown: keeps formatting markup (headings, lists, tables, code,
 * links, images, `<details>`, …) and removes scripts, event handlers and unsafe URLs.
 */
export function sanitizeHtml(html: string): string {
  return filter.process(html)
}
