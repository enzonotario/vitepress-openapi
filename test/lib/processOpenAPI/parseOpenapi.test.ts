import { describe, expect, it } from 'vitest'
import realSpec from '../../../docs/public/openapi-schemas.json'
import { parseOpenapi } from '../../../src/lib/parser/parseOpenapi'

describe('parseOpenapi', () => {
  describe('parseSync', () => {
    it('parses the OpenAPI spec synchronously', () => {
      const parser = parseOpenapi()
      const openapi = parser.parseSync({ spec: realSpec })

      expect(openapi).toMatchSnapshot()
    })

    it('handles default tag and description', () => {
      const parser = parseOpenapi()
      const openapi = parser.parseSync({
        spec: realSpec,
        defaultTag: 'Default',
        defaultTagDescription: 'Default tag description',
      })

      expect(openapi).toMatchSnapshot()
    })
  })

  describe('parseAsync', () => {
    it('parses the OpenAPI spec asynchronously', async () => {
      const parser = parseOpenapi()
      const openapi = await parser.parseAsync({ spec: realSpec })

      expect(openapi).toMatchSnapshot()
    })

    it('handles default tag and description', async () => {
      const parser = parseOpenapi()
      const openapi = await parser.parseAsync({
        spec: realSpec,
        defaultTag: 'Default',
        defaultTagDescription: 'Default tag description',
      })

      expect(openapi).toMatchSnapshot()
    })
  })

  describe('transformSync', () => {
    it('transforms the OpenAPI spec synchronously', () => {
      const parser = parseOpenapi()
      const openapi = parser.transformSync({ spec: realSpec })

      expect(openapi).toMatchSnapshot()
    })

    it('handles default tag and description', () => {
      const parser = parseOpenapi()
      const openapi = parser.transformSync({
        spec: realSpec,
        defaultTag: 'Default',
        defaultTagDescription: 'Default tag description',
      })

      expect(openapi).toMatchSnapshot()
    })
  })

  describe('transformAsync', () => {
    it('transforms the OpenAPI spec asynchronously', async () => {
      const parser = parseOpenapi()
      const openapi = await parser.transformAsync({ spec: realSpec })

      expect(openapi).toMatchSnapshot()
    })
  })
})
