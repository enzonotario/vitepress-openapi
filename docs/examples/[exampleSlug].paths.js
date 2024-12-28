import { examplesPages } from '../pages.ts'

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
