export function isJson(contentType: string): boolean {
  return contentType.toLowerCase().match(/^(application|text)\/.*json($|;|\\+)/) !== null
}

export function isXml(contentType: string): boolean {
  return contentType.toLowerCase().match(/^(text|application)\/.*xml($|;|\\+)/) !== null
}

export function isFormUrlEncoded(contentType: string): boolean {
  return contentType.toLowerCase().match(/^application\/x-www-form-urlencoded($|;|\\+)/) !== null
}

export function isMultipartFormData(contentType: string): boolean {
  return contentType.toLowerCase().match(/^multipart\/form-data($|;|\\+)/) !== null
}
