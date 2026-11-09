// Copy buttons in code blocks (`div[class*="language-"] > button.copy`), for apps without VitePress.
// Port of VitePress' useCopyCode (MIT, https://github.com/vuejs/vitepress).

const COPY_BUTTON_SELECTOR = 'div[class*="language-"] > button.copy'
const RE_SHELL_LANGUAGE = /language-(?:shellscript|shell|bash|sh|zsh)/
const RE_SHELL_PROMPT = /^ *[$>] /gm
const COPIED_MS = 2000

let isSetup = false

export function setupCopyCode() {
  if (isSetup || typeof window === 'undefined') {
    return
  }
  isSetup = true

  const timeouts = new WeakMap<HTMLElement, ReturnType<typeof setTimeout>>()

  window.addEventListener('click', (event) => {
    const button = event.target as HTMLElement | null
    if (!button?.matches?.(COPY_BUTTON_SELECTOR)) {
      return
    }

    // Markup: button.copy, span.lang, then the code.
    const code = button.nextElementSibling?.nextElementSibling
    if (!code) {
      return
    }

    let text = code.textContent || ''
    if (RE_SHELL_LANGUAGE.test(button.parentElement?.className ?? '')) {
      text = text.replace(RE_SHELL_PROMPT, '').trim()
    }

    navigator.clipboard?.writeText(text).then(() => {
      button.classList.add('copied')
      clearTimeout(timeouts.get(button))
      timeouts.set(button, setTimeout(() => {
        button.classList.remove('copied')
        button.blur()
        timeouts.delete(button)
      }, COPIED_MS))
    })
  })
}
