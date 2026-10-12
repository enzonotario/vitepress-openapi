import { merge } from 'allof-merge'
import { describe, expect, it } from 'vitest'
import { mergeAllOf } from '../../../src/lib/parser/mergeAllOf'

describe('mergeAllOf', () => {
  // Node is recursive through allOf, so allof-merge emits cycle $refs pointing into
  // `#/paths/...`: these only resolve if merged entries keep their original paths.
  const spec = () => ({
    openapi: '3.0.0',
    paths: {
      '/nodes/{id}': { get: { responses: { 200: { description: 'ok', content: { 'application/json': { schema: { allOf: [{ $ref: '#/components/schemas/Node' }] } } } } } } },
      '/plain': { get: { responses: { 200: { description: 'ok' } } } },
    },
    components: {
      schemas: {
        Node: { allOf: [{ $ref: '#/components/schemas/Base' }, { properties: { child: { allOf: [{ $ref: '#/components/schemas/Node' }] } } }] },
        Base: { type: 'object', properties: { id: { type: 'string' } } },
      },
    },
  })

  it('matches merging the whole document', () => {
    expect(mergeAllOf(spec())).toEqual(merge(spec()))
  })

  it('does not mutate the input', () => {
    const input = spec()
    mergeAllOf(input)
    expect(input).toEqual(spec())
  })

  it('returns the spec as-is when there is no allOf', () => {
    const input = { openapi: '3.0.0', paths: { '/plain': { get: {} } } }
    expect(mergeAllOf(input)).toBe(input)
  })
})
