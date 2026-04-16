import { testsPages } from '../../../../../docs/pages.js'

export default {
  paths() {
    return testsPages.map(({ slug, specPath, specUrl, themeConfig }) => {
      if (!specUrl && !specPath) {
        throw new Error(`Missing specPath or specUrl for test page "${slug}"`)
      }

      const resolvedSpecUrl = specUrl || `https://vitepress-openapi.vercel.app/${specPath.split('/').pop()}`

      return {
        params: {
          testSlug: slug,
          specUrl: resolvedSpecUrl,
          themeConfig,
        },
      }
    })
  },
}
