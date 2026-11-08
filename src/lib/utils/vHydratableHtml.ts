import type { Directive } from 'vue'

type HtmlElement = Pick<HTMLElement, 'innerHTML' | 'hasChildNodes'> & { _oaHtml?: string }

function writeHtml(el: HtmlElement, html: string) {
  if (el._oaHtml !== html) {
    el.innerHTML = html
    el._oaHtml = html
  }
}

/**
 * Like `v-html`, but keeps server-rendered markup while hydrating.
 *
 * Vue re-assigns `innerHTML` for `v-html` during hydration, even when it is unchanged.
 * That recreates every child node, so the browser reports a new Largest Contentful Paint
 * at hydration time. This directive adopts the server markup and only writes on change.
 */
export const vHydratableHtml: Directive<HtmlElement, string> = {
  getSSRProps: ({ value }) => ({ innerHTML: value }),
  beforeMount(el, { value }) {
    // Hydration: the element already holds the server-rendered markup for this value.
    if (el.hasChildNodes()) {
      el._oaHtml = value
      return
    }
    writeHtml(el, value)
  },
  updated(el, { value }) {
    writeHtml(el, value)
  },
}
