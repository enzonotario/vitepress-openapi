import { httpVerbs } from 'vitepress-theme-openapi'

export function generateMissingSummary(value: any) {
  if (!value.paths) {
    return value
  }

  return {
    ...value,
    paths: Object.fromEntries(
      Object.entries(value.paths).map(([path, pathValue]) => {
        httpVerbs.forEach((verb) => {
          if (pathValue[verb] && !pathValue[verb].summary) {
            pathValue[verb].summary = `${verb.toUpperCase()} ${path}`
          }
        })
        return [path, pathValue]
      }),
    ),
  }
}
