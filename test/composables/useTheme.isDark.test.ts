import { describe, expect, it } from 'vitest'
import { ref } from 'vue'
import { setIsDarkSource, useTheme } from '../../src/composables/useTheme'

// https://github.com/enzonotario/vitepress-openapi/issues/178
describe('useTheme isDark', () => {
  it('follows the linked VitePress isDark (e.g. appearance: force-dark)', () => {
    const vitepressIsDark = ref(true)
    setIsDarkSource(vitepressIsDark)

    expect(useTheme().isDark.value).toBe(true)

    vitepressIsDark.value = false
    expect(useTheme().isDark.value).toBe(false)
  })

  it('returns the same linked ref on every access', () => {
    const vitepressIsDark = ref(true)
    setIsDarkSource(vitepressIsDark)

    expect(useTheme().isDark).toBe(vitepressIsDark)
  })
})
