export const testsPages = [
  {
    slug: 'response-types',
    label: 'Response Types',
    specPath: './public/openapi-response-types.json',
    themeConfig: {},
  },
  {
    slug: 'response-statuses',
    label: 'Response Statuses',
    specPath: './public/openapi-response-statuses.json',
    themeConfig: {},
  },
  {
    slug: 'schemas',
    label: 'Schemas',
    specPath: './public/openapi-schemas.json',
    themeConfig: {},
  },
  {
    slug: 'parameters',
    label: 'Parameters',
    specPath: './public/openapi-parameters.json',
    themeConfig: {},
  },
  {
    slug: 'security',
    label: 'Security',
    specPath: './public/openapi-security.json',
    themeConfig: {},
  },
  {
    slug: 'playground-examples',
    label: 'Playground Examples',
    specPath: './public/openapi-playground-examples.json',
    themeConfig: {},
  },
]

export const examplesPages = [
  {
    slug: 'argentinadatos',
    label: 'ArgentinaDatos',
    specUrl: 'https://argentinadatos.com/openapi.json',
    themeConfig: {},
  },
  {
    slug: 'criptoya-argentina',
    label: 'CriptoYa Argentina',
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
    label: 'Scalar Galaxy',
    specUrl: 'https://galaxy.scalar.com/openapi.yaml',
    themeConfig: {},
  },
  {
    slug: 'plant-store',
    label: 'Mintlify Plant Store',
    specUrl: 'https://raw.githubusercontent.com/mintlify/starter/refs/heads/main/api-reference/openapi.json',
    themeConfig: {},
  },
  {
    slug: 'museum',
    label: 'Redocly Museum',
    specUrl: 'https://raw.githubusercontent.com/Redocly/museum-openapi-example/refs/heads/main/openapi.yaml',
    themeConfig: {},
  },
  {
    slug: 'petstore-3.1',
    label: 'Petstore 3.1',
    specUrl: 'https://raw.githubusercontent.com/Redocly/redoc/refs/heads/main/demo/openapi-3-1.yaml',
    themeConfig: {},
  },
]
