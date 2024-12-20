import { readFileSync } from 'node:fs'

const tests = [
  {
    slug: 'response-types',
    specPath: './docs/public/openapi-response-types.json',
    themeConfig: {},
  },
  {
    slug: 'response-statuses',
    specPath: './docs/public/openapi-response-statuses.json',
    themeConfig: {},
  },
  {
    slug: 'schemas',
    specPath: './docs/public/openapi-schemas.json',
    themeConfig: {},
  },
  {
    slug: 'parameters',
    specPath: './docs/public/openapi-parameters.json',
    themeConfig: {},
  },
  {
    slug: 'security',
    specPath: './docs/public/openapi-security.json',
    themeConfig: {},
  },
]

export default {
  paths() {
    return tests.map(({ slug, specPath, themeConfig }) => {
      const file = readFileSync(specPath)

      const spec = JSON.parse(file.toString())

      return {
        params: {
          testSlug: slug,
          spec,
          themeConfig,
        },
      }
    })
  },
}
