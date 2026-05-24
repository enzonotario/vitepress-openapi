const RE_JSON = /^(?:application|text)\/.*json(?:$|;|\+)/
const RE_XML = /^(?:text|application)\/.*xml(?:$|;|\+)/
const RE_FORM_URLENCODED = /^application\/x-www-form-urlencoded(?:$|;|\+)/
const RE_MULTIPART = /^multipart\/form-data(?:$|;|\+)/
const RE_PLAIN_TEXT = /^text\/plain(?:$|;|\+)/
const RE_FILE = /^(?:application|image|video|audio)\/.*$/

export function isJson(contentType: string): boolean {
  return RE_JSON.test(contentType.toLowerCase())
}

export function isXml(contentType: string): boolean {
  return RE_XML.test(contentType.toLowerCase())
}

export function isFormUrlEncoded(contentType: string): boolean {
  return RE_FORM_URLENCODED.test(contentType.toLowerCase())
}

export function isMultipartFormData(contentType: string): boolean {
  return RE_MULTIPART.test(contentType.toLowerCase())
}

export function isPlainText(contentType: string): boolean {
  return RE_PLAIN_TEXT.test(contentType.toLowerCase())
}

export function isFile(contentType: string): boolean {
  if (isJson(contentType) || isXml(contentType) || isFormUrlEncoded(contentType) || isMultipartFormData(contentType) || isPlainText(contentType)) {
    return false
  }

  return RE_FILE.test(contentType.toLowerCase())
}
