const RE_FILENAME_STAR = /filename\*\s*=\s*([^;]+)/i
const RE_FILENAME = /filename\s*=\s*([^;]+)/i

export function getDownloadFileNameFromContentDisposition(
  cd: string | null | undefined,
  fallback = 'response_file',
): string {
  if (!cd) {
    return fallback
  }

  const starMatch = cd.match(RE_FILENAME_STAR)
  if (starMatch) {
    let v = starMatch[1].trim()
    if (v.startsWith('"') && v.endsWith('"')) {
      v = v.slice(1, -1)
    }
    const parts = v.split('\'')
    if (parts.length >= 3) {
      const encoded = parts.slice(2).join('\'')
      try {
        const decoded = decodeURIComponent(encoded)
        if (decoded) {
          return decoded
        }
      } catch {}
    } else {
      try {
        const decoded = decodeURIComponent(v)
        if (decoded) {
          return decoded
        }
      } catch {}
    }
  }

  const fnameMatch = cd.match(RE_FILENAME)
  if (fnameMatch) {
    let v = fnameMatch[1].trim()
    if (v.startsWith('"') && v.endsWith('"')) {
      v = v.slice(1, -1)
    }
    if (v) {
      return v
    }
  }

  return fallback
}
