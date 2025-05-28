export function isJson(contentType: string): boolean {
  return contentType.toLowerCase().match(/^(application|text)\/.*json($|;|\+)/) !== null
}

export function isXml(contentType: string): boolean {
  return contentType.toLowerCase().match(/^(text|application)\/.*xml($|;|\+)/) !== null
}

export function isFormUrlEncoded(contentType: string): boolean {
  return contentType.toLowerCase().match(/^application\/x-www-form-urlencoded($|;|\+)/) !== null
}

export function isMultipartFormData(contentType: string): boolean {
  return contentType.toLowerCase().match(/^multipart\/form-data($|;|\+)/) !== null
}

export function isPlainText(contentType: string): boolean {
  return contentType.toLowerCase().match(/^text\/plain($|;|\+)/) !== null
}

export function isFile(contentType: string): boolean {
  if (isJson(contentType) || isXml(contentType) || isFormUrlEncoded(contentType) || isMultipartFormData(contentType) || isPlainText(contentType)) {
    return false
  }

  return contentType.toLowerCase().match(/^(application|image|video|audio)\/.*$/) !== null
}
