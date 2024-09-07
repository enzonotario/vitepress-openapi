import { generateMissingOperationIds } from '../lib/generateMissingOperationIds';

let json: any = {}

const parsedSpec: any = {}

export function useOpenapi({ spec } = { spec: null }) {
  if (spec !== null) {
    setSpec(spec)
  }

  function setSpec(value: any) {
    if (!value) {
      return
    }

    if (!value.openapi || !value.openapi.startsWith('3.')) {
        throw new Error('Only OpenAPI 3.x is supported')
    }

    if (value?.paths) {
      value = generateMissingOperationIds(value)
    }

    json = value
  }

  return {
    spec: parsedSpec,
    json,
    setSpec,
  }
}
