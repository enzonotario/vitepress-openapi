import { OpenApi } from '../lib/OpenApi'

let openapi = null

export function useOpenapi({ spec } = { spec: null }) {
  if (spec !== null) {
    openapi = OpenApi({ spec })
  }

  function setSpec(value: any) {
    openapi = OpenApi({ spec: value })
  }

  return {
    spec: openapi?.parsedSpec,
    json: openapi?.spec,
    setSpec,
  }
}
