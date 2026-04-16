import { readFileSync } from 'node:fs'
import { testsPages } from '../pages.js'

export default {
  paths() {
    return testsPages.map(({ slug, specPath, specUrl, themeConfig }) => {
      if (specUrl) {
        return {
          params: {
            testSlug: slug,
            specUrl,
            themeConfig,
          },
        }
      }

      if (!specPath) {
        throw new Error(`Missing specPath or specUrl for test page "${slug}"`)
      }

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
