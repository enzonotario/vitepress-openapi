import { describe, expect, it } from 'vitest'
import { processOpenAPI } from '../../src/lib/processOpenAPI'
import realSpec from '../../docs/public/openapi.json'

describe('processOpenAPI', () => {
  it('processes the OpenAPI spec', () => {
    const parsedSPec = processOpenAPI(realSpec)

    expect(parsedSPec).toMatchSnapshot()
  })
})
