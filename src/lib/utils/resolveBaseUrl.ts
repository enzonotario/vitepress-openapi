export function resolveBaseUrl(url: string, defaultUrl: string = 'http://localhost') {
  if (URL.canParse(url)) {
    return url
  }
  console.error('Failed to resolve base URL:', url)
  return defaultUrl
}
