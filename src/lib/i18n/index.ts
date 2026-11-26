import type { InjectionKey } from 'vue'
import { hasInjectionContext, inject } from 'vue'
import { createI18n } from 'vue-i18n'
import { locales } from '../../locales'
import { resolveMessage } from './resolveMessage'

const RE_SPECIAL_OR_PARAM = /\{(\w+)\}|([{}@$|])/g

export interface OpenapiI18n {
  t: (key: string, params?: Record<string, unknown>) => string
  setLocale: (locale: string) => void
}

export const OPENAPI_I18N_KEY: InjectionKey<OpenapiI18n> = Symbol('vitepress-openapi-i18n')

/**
 * Escapes `vue-i18n` compiler-special characters (`{`, `}`, `@`, `$`, `|`) in literal translation
 * strings while preserving `{name}` named interpolation placeholders.
 */
export function escapeI18nMessage(message: string): string {
  return message.replace(RE_SPECIAL_OR_PARAM, (match, param, special) => {
    if (param) {
      return match
    }
    return `{'${special}'}`
  })
}

function prepareMessages(messages: Record<string, any>): Record<string, any> {
  const prepared: Record<string, any> = Object.create(null)

  for (const [key, value] of Object.entries(messages)) {
    if (typeof value === 'string') {
      prepared[key] = escapeI18nMessage(value)
    } else if (value != null && typeof value === 'object' && !Array.isArray(value)) {
      prepared[key] = prepareMessages(value)
    } else {
      prepared[key] = value
    }
  }

  return prepared
}

export function createOpenapiI18n(options: {
  locale?: string
  fallbackLocale?: string
  messages?: Record<string, Record<string, any>>
} = {}): OpenapiI18n {
  const preparedMessages = Object.fromEntries(
    Object.entries(options.messages || locales).map(([locale, messages]) => [locale, prepareMessages(messages)]),
  )

  const i18n = createI18n({
    legacy: false,
    globalInjection: false,
    locale: options.locale || 'en',
    fallbackLocale: options.fallbackLocale || 'en',
    missingWarn: false,
    fallbackWarn: false,
    messageResolver: resolveMessage,
    messages: preparedMessages,
  })

  return {
    t: (key: string, params?: Record<string, unknown>) => (
      params ? i18n.global.t(key, params) : i18n.global.t(key)
    ),
    setLocale: (locale: string) => {
      i18n.global.locale.value = locale
    },
  }
}

let fallbackInstance: OpenapiI18n | null = null

export function useI18n(): OpenapiI18n {
  const provided = hasInjectionContext() ? inject(OPENAPI_I18N_KEY, null) : null
  if (provided) {
    return provided
  }

  if (!fallbackInstance) {
    fallbackInstance = createOpenapiI18n()
  }

  return fallbackInstance
}
