const examples = [
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

export default {
  paths() {
    return examples.map(({ slug, specUrl, themeConfig }) => {
      return {
        params: {
          exampleSlug: slug,
          specUrl,
          themeConfig,
        },
      }
    })
  },
}
