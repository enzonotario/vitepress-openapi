import { createI18n } from '@byjohann/vue-i18n'
import { describe, expect, it } from 'vitest'
import { nestMessages } from '../../../src/lib/i18n/nestMessages'

function translate(messages: Record<string, string>, key: string, params?: Record<string, string>) {
  const i18n = createI18n({ defaultLocale: 'en', logLevel: 'silent', messages: { en: nestMessages(messages) } })
  return i18n.t(key, params)
}

describe('nestMessages', () => {
  it('keeps keys without dots', () => {
    expect(translate({ 'Try it out': 'Probar' }, 'Try it out')).toBe('Probar')
  })

  it('finds dotted keys', () => {
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

  it('does not write to Object.prototype', () => {
    const toString = Object.prototype.toString
    const nested = nestMessages({ '__proto__.toString': 'translated', 'constructor.prototype.polluted': 'yes' })
    expect(Object.prototype.toString).toBe(toString)
    expect(({} as Record<string, unknown>).polluted).toBeUndefined()
    expect(translate({ '__proto__.toString': 'translated' }, '__proto__.toString')).toBe('translated')
    expect(Object.keys(nested)).toEqual(['__proto__', 'constructor'])
  })
})
