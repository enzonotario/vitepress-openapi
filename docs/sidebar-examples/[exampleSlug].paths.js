import { examples } from '../sidebar-examples-configs.ts'

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
