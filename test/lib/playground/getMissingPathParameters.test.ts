import { describe, expect, it } from 'vitest'
import { getMissingPathParameters } from '../../../src/lib/playground/getMissingPathParameters'

describe('getMissingPathParameters', () => {
  it('returns nothing when every path parameter is filled', () => {
    expect(getMissingPathParameters('/users/{userId}/posts/{postId}', 'https://api.example.com/users/1/posts/2')).toEqual([])
  })

  it('returns the names of the placeholders left in the URL', () => {
    expect(getMissingPathParameters('/users/{userId}/posts/{postId}', 'https://api.example.com/users/1/posts/{postId}')).toEqual(['postId'])
  })

  it('detects encoded placeholders', () => {
    expect(getMissingPathParameters('/users/{userId}', new URL('https://api.example.com/users/{userId}'))).toEqual(['userId'])
  })

  it('detects placeholders inside a segment', () => {
    expect(getMissingPathParameters('/files/{name}.json', 'https://api.example.com/files/{name}.json')).toEqual(['name'])
  })

  it('ignores the query string', () => {
    expect(getMissingPathParameters('/users/{userId}', 'https://api.example.com/users/1?filter={userId}')).toEqual([])
  })

  it('returns nothing for paths without parameters', () => {
    expect(getMissingPathParameters('/users', 'https://api.example.com/users')).toEqual([])
  })
})
