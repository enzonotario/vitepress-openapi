import { describe, expect, it } from 'vitest'
import realSpec from '../../../docs/public/openapi.json'
import { processOpenAPI } from '../../../src/lib/processOpenAPI/processOpenAPI'
import { processOpenAPIAsync } from '../../../src/lib/processOpenAPI/processOpenAPIAsync'

describe('processOpenAPI', () => {
  it('processes the OpenAPI spec', async () => {
    let openapi = processOpenAPI(realSpec)
    openapi = await processOpenAPIAsync(openapi)

    expect(openapi).toMatchSnapshot()
  })
})
