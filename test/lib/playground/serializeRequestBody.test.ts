import { describe, expect, it } from 'vitest'
import { serializeRequestBody } from '../../../src/lib/playground/serializeRequestBody'

describe('serializeRequestBody', () => {
  it('returns undefined for nullish bodies', () => {
    expect(serializeRequestBody(null)).toBeUndefined()
    expect(serializeRequestBody(undefined)).toBeUndefined()
  })

  it('passes through FormData, Blob and string bodies', () => {
    const formData = new FormData()
    const blob = new Blob(['x'])

    expect(serializeRequestBody(formData)).toBe(formData)
    expect(serializeRequestBody(blob)).toBe(blob)
    expect(serializeRequestBody('raw=text')).toBe('raw=text')
  })

  it('JSON.stringifies object bodies by default', () => {
    expect(serializeRequestBody({ username: 'user', grant_type: 'password' })).toBe(
      JSON.stringify({ username: 'user', grant_type: 'password' }),
    )
  })

  it('encodes object bodies as application/x-www-form-urlencoded', () => {
    expect(
      serializeRequestBody(
        {
          grant_type: 'password',
          username: 'user@example.com',
          password: 'secret',
        },
        'application/x-www-form-urlencoded',
      ),
    ).toBe('grant_type=password&username=user%40example.com&password=secret')
  })

  it('encodes form-urlencoded bodies with charset suffix', () => {
    expect(
      serializeRequestBody(
        { grant_type: 'password' },
        'application/x-www-form-urlencoded; charset=utf-8',
      ),
    ).toBe('grant_type=password')
  })

  it('skips nullish values and flattens arrays for form-urlencoded', () => {
    expect(
      serializeRequestBody(
        {
          a: '1',
          b: null,
          c: undefined,
          d: ['x', 'y'],
          e: true,
        },
        'application/x-www-form-urlencoded',
      ),
    ).toBe('a=1&d=x&d=y&e=true')
  })
})
