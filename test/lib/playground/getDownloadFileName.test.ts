import { describe, expect, it } from 'vitest'
import { getDownloadFileNameFromContentDisposition } from '../../../src/lib/playground/getDownloadFileName'

describe('getDownloadFileNameFromContentDisposition', () => {
  it('returns fallback when header is missing', () => {
    expect(getDownloadFileNameFromContentDisposition(undefined)).toBe('response_file')
    expect(getDownloadFileNameFromContentDisposition(null, 'fallback.txt')).toBe('fallback.txt')
  })

  it('parses quoted filename parameter', () => {
    const cd = 'attachment; filename="report.csv"'
    expect(getDownloadFileNameFromContentDisposition(cd)).toBe('report.csv')
  })

  it('parses unquoted filename parameter', () => {
    const cd = 'attachment; filename=report.csv'
    expect(getDownloadFileNameFromContentDisposition(cd)).toBe('report.csv')
  })

  it('prefers filename* (RFC 5987) over filename and decodes percent-encoding', () => {
    const cd = 'attachment; filename=plain.txt; filename*=UTF-8\'\'hello%20world.txt'
    expect(getDownloadFileNameFromContentDisposition(cd)).toBe('hello world.txt')
  })

  it('handles quoted filename* value', () => {
    const cd = 'attachment; filename*="UTF-8\'\'%E2%9C%93.txt"'
    expect(getDownloadFileNameFromContentDisposition(cd)).toBe('✓.txt')
  })

  it('handles filename* without charset/lang pieces by decoding whole value', () => {
    const cd = 'attachment; filename*=hello%20world.txt'
    expect(getDownloadFileNameFromContentDisposition(cd)).toBe('hello world.txt')
  })

  it('falls back to filename when filename* is malformed', () => {
    const cd = 'attachment; filename=good.txt; filename*=UTF-8\'\'bad%ZZ'
    expect(getDownloadFileNameFromContentDisposition(cd)).toBe('good.txt')
  })

  it('falls back to default when nothing usable is present', () => {
    const cd = 'attachment; something=else'
    expect(getDownloadFileNameFromContentDisposition(cd)).toBe('response_file')
  })
})
