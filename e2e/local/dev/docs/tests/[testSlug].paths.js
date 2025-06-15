import { testsPages } from '../../../../../docs/pages.js'

export default {
  paths() {
    return testsPages.map(({ slug, specPath, themeConfig }) => {
      const specFilename = specPath.split('/').pop()

      return {
        params: {
          testSlug: slug,
          specUrl: `https://vitepress-openapi.vercel.app/${specFilename}`,
          themeConfig,
        },
      }
    })
  },
}
