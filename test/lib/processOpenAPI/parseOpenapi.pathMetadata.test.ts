import { describe, expect, it } from 'vitest'
import { parseOpenapi } from '../../../src/lib/parser/parseOpenapi'

const spec = {
  openapi: '3.0.0',
  info: { title: 'Test', version: '1.0.0' },
  paths: {
    '/example': {
      summary: 'Example summary',
      description: 'Example description',
      get: {
        responses: {
          '200': { description: 'OK' },
        },
      },
    },
  },
}

describe('parseOpenapi with path metadata', () => {
  it('processes paths containing summary or description', () => {
    const result = parseOpenapi().parseSync({ spec })
    expect(result.paths['/example'].summary).toBe('Example summary')
    expect(result.paths['/example'].description).toBe('Example description')
    expect(result.paths['/example'].get.operationId).toBe('get-example')
    expect(result.paths['/example'].get.summary).toBe('GET /example')
  })
})
