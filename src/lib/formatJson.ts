export function formatJson(json: any) {
  try {
    return JSON.stringify(
      json ?? {},
      null,
      2,
    )
  } catch {
    return '{}'
  }
}
