import { describe, expect, it } from 'vitest'
import realSpec from '../../docs/public/openapi.json'
import { processOpenAPI } from '../../src/lib/processOpenAPI/processOpenAPI'

describe('processOpenAPI', () => {
  it('processes the OpenAPI spec', async () => {
    const parsedSPec = await processOpenAPI(realSpec)

    expect(parsedSPec).toMatchSnapshot()
  })
})
