import { readFileSync } from 'node:fs'
import { testsPages } from '../../docs/pages.js'

export default {
  paths() {
    return testsPages.map(({ slug, specPath, themeConfig }) => {
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
