import { DEFAULT_SCHEMA, vitepressOpenAPI } from '../vitepress-openapi'

let mainSchema = null

export function useOpenapi({ spec } = { spec: null }) {
  if (spec !== null) {
    setupOpenApi({ spec })
  }

  function setSpec(value: any) {
    setupOpenApi({ spec: value })
  }

  function setupOpenApi({ spec }) {
    const schemas = vitepressOpenAPI({ spec })
    mainSchema = schemas.get(DEFAULT_SCHEMA)
  }

  return {
    ...(mainSchema?.openapi || {}),
    spec: mainSchema?.parsedSpec,
    json: mainSchema?.spec,
    setSpec,
  }
}
