import { OpenApi } from '../lib/OpenApi'

let openapi = null

export function useOpenapi({ spec } = { spec: null }) {
  if (spec !== null) {
    setupOpenApi({ spec })
  }

  function setSpec(value: any) {
    setupOpenApi({ spec: value })
  }

  function setupOpenApi({ spec }) {
    openapi = OpenApi({ spec })
  }

  return {
    ...(openapi || {}),
    spec: openapi?.parsedSpec,
    json: openapi?.spec,
    setSpec,
  }
}
