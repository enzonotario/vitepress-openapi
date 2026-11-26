import { describe, expect, it } from 'vitest'
import { createSSRApp, defineComponent, h } from 'vue'
import { createI18n as createHostVueI18n, useI18n as useHostVueI18n } from 'vue-i18n'
import { renderToString } from 'vue/server-renderer'
import { createOpenapiI18n, useI18n as useOpenapiI18n } from '../../../src/lib/i18n'
import { VOpenapi } from '../../../src/vue'

describe('createOpenapiI18n', () => {
  it('preserves literal special characters like @, |, $, and unmatched braces without throwing', () => {
    const i18n = createOpenapiI18n({
      locale: 'en',
      messages: {
        en: {
          'Powered by': 'foo@bar.com',
          'Specials': 'a | b $10 {not a param}',
          'tags.goTo': 'View {tag} operations (@ {tag})',
        },
      },
    })

    expect(i18n.t('Powered by')).toBe('foo@bar.com')
    expect(i18n.t('Specials')).toBe('a | b $10 {not a param}')
    expect(i18n.t('tags.goTo', { tag: 'Pets' })).toBe('View Pets operations (@ Pets)')
  })

  it('does not overwrite a host app vue-i18n instance when VOpenapi is installed', async () => {
    const hostI18n = createHostVueI18n({
      legacy: false,
      locale: 'en',
      messages: {
        en: {
          greeting: 'Hello from host app',
        },
      },
    })

    const Root = defineComponent({
      setup() {
        const host = useHostVueI18n()
        const openapi = useOpenapiI18n()
        return () => h('div', `${host.t('greeting')} | ${openapi.t('Powered by')}`)
      },
    })

    const app = createSSRApp(Root)
    app.use(hostI18n)
    app.use(VOpenapi, {
      config: {
        i18n: {
          locale: 'en',
          messages: {
            en: {
              'Powered by': 'foo@bar.com',
            },
          },
        },
      },
    })

    const html = await renderToString(app)
    expect(html).toContain('Hello from host app | foo@bar.com')
  })
})
