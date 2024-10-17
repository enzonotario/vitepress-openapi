import { stringify } from 'flatted'

export function formatJson(json: any): string {
  if (typeof json !== 'object' && typeof json !== 'undefined' && json !== null) {
    return '{}'
  }

  try {
    console.debug('formatJson', json)
    return stringify(json)
  } catch {
    return '{}'
  }
}
