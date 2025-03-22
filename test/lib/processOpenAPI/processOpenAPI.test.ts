import { describe, expect, it } from 'vitest'
import realSpec from '../../../docs/public/openapi.json'
import { parseOpenapi } from '../../../src/lib/parser/parseOpenapi'

describe('processOpenAPI', () => {
  it('processes the OpenAPI spec', async () => {
    const openapi = await parseOpenapi().parseAsync({ spec: realSpec })

    expect(openapi).toMatchSnapshot()
  })
})
