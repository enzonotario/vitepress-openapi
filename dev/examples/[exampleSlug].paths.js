import { examplesPages } from '../../docs/pages.js'

export default {
  paths() {
    return examplesPages.map(({ slug, specUrl, themeConfig }) => {
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
