import { describe, expect, it } from 'vitest'
import { dereferenceWithAnnotationsSync } from '../../../src/lib/parser/dereferenceWithAnnotations'

describe('dereferenceWithAnnotationsSync', () => {
  it('resolves escaped JSON pointers (as emitted by allof-merge)', () => {
    const result: any = dereferenceWithAnnotationsSync({
      paths: { '/users/{id}': { get: { type: 'string' } } },
      ref: { $ref: '#/paths/~1users~1%7Bid%7D/get' },
    } as any)
    expect(result.ref.type).toBe('string')
  })

  it('resolves a nested $ref inside a target referenced more than once', () => {
    const result: any = dereferenceWithAnnotationsSync({
      paths: {
        '/a': {
          get: { parameters: [{ $ref: '#/components/parameters/P' }] },
          post: { parameters: [{ $ref: '#/components/parameters/P' }] },
        },
      },
      components: {
        parameters: { P: { name: 'p', schema: { $ref: '#/components/schemas/S' } } },
        schemas: { S: { type: 'string' } },
      },
    } as any)
    expect(result.paths['/a'].get.parameters[0].schema.type).toBe('string')
    expect(result.paths['/a'].post.parameters[0].schema.type).toBe('string')
  })

  it('leaves unresolvable refs in place without aborting', () => {
    const result: any = dereferenceWithAnnotationsSync({
      missing: { $ref: '#/nope' },
      ok: { $ref: '#/target' },
      target: { type: 'string' },
    } as any)
    expect(result.missing.$ref).toBe('#/nope')
    expect(result.ok.type).toBe('string')
  })
})
