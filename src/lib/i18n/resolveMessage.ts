import type { Path, PathValue } from 'vue-i18n'

/**
 * Custom `vue-i18n` message resolver that checks flat keys first (so keys containing dots or
 * trailing periods such as `operation.badgePrefix.operationId` or `Failed to load the JSON editor.`
 * are found directly), and falls back to safe nested own-property lookup without touching
 * `Object.prototype`.
 */
export function resolveMessage(obj: unknown, path: Path): PathValue {
  if (obj == null || typeof obj !== 'object') {
    return null
  }

  const record = obj as Record<string, unknown>

  if (Object.hasOwn(record, path)) {
    return record[path] as PathValue
  }

  let current: unknown = record
  for (const part of path.split('.')) {
    if (current == null || typeof current !== 'object' || !Object.hasOwn(current, part)) {
      return null
    }
    current = (current as Record<string, unknown>)[part]
  }

  return current as PathValue
}
