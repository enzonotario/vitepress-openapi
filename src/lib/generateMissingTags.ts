import { useTheme } from 'vitepress-openapi'

export function generateMissingTags(spec: any) {
  const paths = spec.paths

  if (!paths) {
    return spec
  }

  for (const path of Object.values(paths)) {
    for (const verb of Object.keys(path)) {
      const operation = path[verb]
      const tags = operation.tags || [useTheme().getSpecConfig().defaultTag]
      operation.tags = tags
    }
  }

  return spec
}
