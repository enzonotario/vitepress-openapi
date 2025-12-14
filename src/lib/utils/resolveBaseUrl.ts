export function resolveBaseUrl(url: string, defaultUrl: string = 'http://localhost') {
  try {
    // Ensure that the URL is valid.
    // eslint-disable-next-line no-new
    new URL(url)

    return url
  } catch (error: Error | any) {
    console.error('Failed to resolve base URL:', error?.message)
    return defaultUrl
  }
}
