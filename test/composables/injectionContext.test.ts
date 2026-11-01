import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createApp } from 'vue'
import { injectOpenapi, OPENAPI_LOCAL_KEY } from '../../src/composables/useOpenapi'
import { usePlayground } from '../../src/composables/usePlayground'
import { OPERATION_DATA_KEY } from '../../src/lib/operation/operationData'

// The documented setup calls these composables from a theme's enhanceApp,
// where no component is active.
describe('composables called outside a component', () => {
  let warn: ReturnType<typeof vi.spyOn>

  beforeEach(() => {
    warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
  })

  afterEach(() => {
    warn.mockRestore()
  })

  it('usePlayground does not warn without an injection context', () => {
    usePlayground().setSecuritySchemeDefaultValues({ 'http-bearer': 'Token' })
    expect(warn).not.toHaveBeenCalled()
  })

  it('usePlayground does not warn in an app context without operation data', () => {
    createApp({}).runWithContext(() => usePlayground())
    expect(warn).not.toHaveBeenCalled()
  })

  it('injectOpenapi returns null without warning outside an injection context', () => {
    expect(injectOpenapi()).toBeNull()
    expect(warn).not.toHaveBeenCalled()
  })

  it('injectOpenapi still returns a provided instance', () => {
    const app = createApp({})
    const instance = {} as never
    app.provide(OPENAPI_LOCAL_KEY, instance)
    expect(app.runWithContext(() => injectOpenapi())).toBe(instance)
  })

  it('usePlayground still reads provided operation data', () => {
    const app = createApp({})
    app.provide(OPERATION_DATA_KEY, {} as never)
    app.runWithContext(() => usePlayground())
    expect(warn).not.toHaveBeenCalled()
  })
})
