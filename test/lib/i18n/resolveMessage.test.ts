import { describe, expect, it } from 'vitest'
import { createI18n } from 'vue-i18n'
import { resolveMessage } from '../../../src/lib/i18n/resolveMessage'

function translate(messages: Record<string, unknown>, key: string, params?: Record<string, string>) {
  const i18n = createI18n({
    legacy: false,
    globalInjection: false,
    locale: 'en',
    fallbackLocale: 'en',
    missingWarn: false,
    fallbackWarn: false,
    messageResolver: resolveMessage,
    messages: { en: messages as Record<string, any> },
  })
  return params ? i18n.global.t(key, params) : i18n.global.t(key)
}

describe('resolveMessage', () => {
  it('keeps keys without dots', () => {
    expect(translate({ 'Try it out': 'Probar' }, 'Try it out')).toBe('Probar')
  })

  it('finds flat dotted keys', () => {
    expect(translate({ 'operation.badgePrefix.operationId': 'ID: ' }, 'operation.badgePrefix.operationId')).toBe('ID: ')
  })

  it('finds keys ending with a period', () => {
    expect(translate({ 'Failed to load the JSON editor.': 'No se pudo cargar el editor JSON.' }, 'Failed to load the JSON editor.'))
      .toBe('No se pudo cargar el editor JSON.')
  })

  it('interpolates params of dotted keys', () => {
    expect(translate({ 'tags.goTo': 'View {tag} operations' }, 'tags.goTo', { tag: 'Pets' })).toBe('View Pets operations')
  })

  it('keeps sibling keys under the same prefix', () => {
    const messages = { 'operation.badgePrefix.operationId': 'ID: ', 'operation.badgePrefix.method': 'Method: ' }
    expect(translate(messages, 'operation.badgePrefix.operationId')).toBe('ID: ')
    expect(translate(messages, 'operation.badgePrefix.method')).toBe('Method: ')
  })

  it('supports nested message objects', () => {
    const messages = { operation: { badgePrefix: { operationId: 'ID: ' } } }
    expect(translate(messages, 'operation.badgePrefix.operationId')).toBe('ID: ')
  })

  it('does not read or pollute Object.prototype', () => {
    const toString = Object.prototype.toString
    expect(translate({ '__proto__.toString': 'translated' }, '__proto__.toString')).toBe('translated')
    expect(resolveMessage({}, '__proto__.toString')).toBeNull()
    expect(resolveMessage({}, 'constructor.prototype')).toBeNull()
    expect(Object.prototype.toString).toBe(toString)
    expect(({} as Record<string, unknown>).polluted).toBeUndefined()
  })

  it('falls back to fallbackLocale when a key is missing in active locale', () => {
    const i18n = createI18n({
      legacy: false,
      globalInjection: false,
      locale: 'es',
      fallbackLocale: 'en',
      missingWarn: false,
      fallbackWarn: false,
      messageResolver: resolveMessage,
      messages: {
        en: { 'Try it out': 'Try it out', 'Failed to load the JSON editor.': 'Editor unavailable' },
        es: { 'Try it out': 'Probar' },
      },
    })

    expect(i18n.global.t('Try it out')).toBe('Probar')
    expect(i18n.global.t('Failed to load the JSON editor.')).toBe('Editor unavailable')
  })
})
