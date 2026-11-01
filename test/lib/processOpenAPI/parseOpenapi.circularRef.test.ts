import { describe, expect, it } from 'vitest'
import { getSchemaUi } from '../../../src/lib/parser/getSchemaUi'
import { parseOpenapi } from '../../../src/lib/parser/parseOpenapi'
import { specWithCircularRef } from '../../testsConstants'

describe('parseOpenapi circular references', () => {
  it('marks circular references in schema UI', () => {
    const openapi = parseOpenapi().parseSync({ spec: specWithCircularRef })
    const schema = getSchemaUi((openapi as any).components.schemas.Parent)

    const child = (schema as any).properties?.find((p: any) => p.name === 'child')
    const parentProp = child?.properties?.find((p: any) => p.name === 'parent')

    expect(parentProp?.meta?.isCircularReference).toBe(true)
  })
})

describe('parseOpenapi shared schemas', () => {
  // L0..L30, each with two expandable (Stripe-style anyOf) props pointing at the
  // next level, and L30 pointing back at L0: 2^30 paths if expanded as a tree.
  const depth = 30
  const level = (i: number) => ({ anyOf: [{ type: 'string' }, { $ref: `#/components/schemas/L${i + 1}` }] })
  const schemas: Record<string, any> = {}
  for (let i = 0; i < depth; i++) {
    schemas[`L${i}`] = { type: 'object', properties: { a: level(i), b: level(i) } }
  }
  schemas[`L${depth}`] = { type: 'object', properties: { back: { $ref: '#/components/schemas/L0' } } }

  it('parses without expanding shared schemas per path', () => {
    const parsed: any = parseOpenapi().parseSync({
      spec: {
        openapi: '3.0.0',
        paths: { '/x': { get: { responses: { 200: { description: 'ok', content: { 'application/json': { schema: { $ref: '#/components/schemas/L0' } } } } } } } },
        components: { schemas },
      } as any,
    })

    let node = parsed.paths['/x'].get.responses[200].content['application/json'].ui
    for (let i = 0; i < depth; i++) {
      node = node.properties.find((p: any) => p.name === (i % 2 ? 'a' : 'b')).properties[1]
    }
    expect(node.properties.find((p: any) => p.name === 'back').meta.isCircularReference).toBe(true)
  })
})

describe('getSchemaUi cache scope', () => {
  it('reflects in-place schema mutations between calls', () => {
    const schema: any = { type: 'object', properties: { a: { type: 'string' } } }
    getSchemaUi(schema)

    // A stale UI cache would miss `self`; a stale walked set would leave the cycle uncut.
    schema.properties.self = schema
    const ui: any = getSchemaUi(schema)

    expect(ui.properties.find((p: any) => p.name === 'self').meta.isCircularReference).toBe(true)
  })
})
