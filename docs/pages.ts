export const testsPages = [
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

export const examplesPages = [
  {
    slug: 'argentinadatos',
    specUrl: 'https://argentinadatos.com/openapi.json',
    themeConfig: {},
  },
  {
    slug: 'criptoya-argentina',
    specUrl: 'https://docs.criptoya.com/argentina/openapi.json',
    themeConfig: {
      jsonViewer: {
        deep: 1,
      },
      schemaViewer: {
        deep: 1,
      },
      requestBody: {
        defaultView: 'schema',
      },
    },
  },
  {
    slug: 'scalar-galaxy',
    specUrl: 'https://galaxy.scalar.com/openapi.yaml',
    themeConfig: {},
  },
  {
    slug: 'plant-store',
    specUrl: 'https://raw.githubusercontent.com/mintlify/starter/refs/heads/main/api-reference/openapi.json',
    themeConfig: {},
  },
  {
    slug: 'museum',
    specUrl: 'https://raw.githubusercontent.com/Redocly/museum-openapi-example/refs/heads/main/openapi.yaml',
    themeConfig: {},
  },
]
