import { httpVerbs } from 'vitepress-openapi'

export function generateMissingOperationIds(value: any) {
  if (!value.paths) {
    return value
  }

  return {
    ...value,
    paths: Object.fromEntries(
      Object.entries(value.paths).map(([path, pathValue]) => {
        httpVerbs.forEach((verb) => {
          if (pathValue[verb] && !pathValue[verb].operationId) {
            pathValue[verb].operationId = `${verb}${path.replace(/\//g, '-')}`
          }
        })
        return [path, pathValue]
      }),
    ),
  }
}
