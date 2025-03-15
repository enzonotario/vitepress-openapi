import { describe, expect, it } from 'vitest'
import realSpec from '../../../docs/public/openapi.json'
import { processAsyncOpenAPI } from '../../../src/lib/processOpenAPI/processAsyncOpenAPI'
import { processOpenAPI } from '../../../src/lib/processOpenAPI/processOpenAPI'

describe('processOpenAPI', () => {
  it('processes the OpenAPI spec', async () => {
    let openapi = processOpenAPI(realSpec)
    openapi = await processAsyncOpenAPI(openapi)

    expect(openapi).toMatchSnapshot()
  })
})
