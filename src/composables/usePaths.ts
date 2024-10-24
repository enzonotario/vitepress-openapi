import { OpenApi } from 'vitepress-openapi'

export function usePaths({
  spec,
}) {
  const openapi = OpenApi({ spec })

  return {
    getPathsByVerbs: openapi.getPathsByVerbs,
  }
}
