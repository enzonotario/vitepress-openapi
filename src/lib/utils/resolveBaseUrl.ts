export function resolveBaseUrl(url: string, defaultUrl: string = 'http://localhost') {
  try {
    new URL(url)

    return url
  } catch (error: Error | any) {
    console.error('Failed to resolve base URL:', error?.message)
    return defaultUrl
  }
}
