export function formatJson(json: any): string {
  if (typeof json !== 'object' && typeof json !== 'undefined' && json !== null) {
    return null
  }

  try {
    return JSON.stringify(json ?? {}, null, 2)
  } catch {
    return '{}'
  }
}
