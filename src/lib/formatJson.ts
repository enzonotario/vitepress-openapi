import { useTheme } from '../composables/useTheme'
import { formatJsonWithCircularRef } from './formatJsonWithCircularRef'

export function formatJson(json: any): string {
  if (useTheme().getSpecConfig().avoidCirculars.value) {
    return formatJsonWithCircularRef(json)
  }

  if (typeof json !== 'object' && typeof json !== 'undefined' && json !== null) {
    return '{}'
  }

  try {
    return JSON.stringify(json ?? {}, null, 2)
  } catch {
    return '{}'
  }
}
