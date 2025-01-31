import { examples } from '../sidebars.ts'

export default {
  paths() {
    return examples.map(({ slug, code }) => {
      return {
        params: {
          exampleSlug: slug,
          code,
        },
      }
    })
  },
}
