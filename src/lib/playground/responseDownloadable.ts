export const RE_OCTET_STREAM = /^application\/octet-stream/i
export const RE_ATTACHMENT = /attachment|download/i

export function isResponseDownloadable(
  contentType: string,
  contentDisposition = '',
): boolean {
  return RE_OCTET_STREAM.test(contentType) || RE_ATTACHMENT.test(contentDisposition)
}
