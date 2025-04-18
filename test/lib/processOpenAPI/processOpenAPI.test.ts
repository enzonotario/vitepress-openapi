import yaml from 'js-yaml'
import { describe, expect, it } from 'vitest'
import realSpec from '../../../docs/public/openapi.json'
import { parseOpenapi } from '../../../src/lib/parser/parseOpenapi'

describe('processOpenAPI', () => {
  it('processes the OpenAPI spec', async () => {
    const openapi = await parseOpenapi().parseAsync({ spec: realSpec })

    expect(openapi).toMatchSnapshot()
  })

  it('produces the same result for YAML and JSON specs', async () => {
    const yamlSpec = yaml.dump(realSpec)

    expect(typeof yamlSpec).toBe('string')
    expect(typeof realSpec).toBe('object')

    const openapiFromYaml = await parseOpenapi().parseAsync({ spec: yamlSpec })

    const openapiFromJson = await parseOpenapi().parseAsync({ spec: realSpec })

    expect(openapiFromYaml).toEqual(openapiFromJson)
  })
})
