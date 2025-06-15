import { usePaths } from 'vitepress-openapi'
import spec from '../../../../../docs/public/openapi.json'

export default {
  paths() {
    return usePaths({ spec })
      .getPathsByVerbs()
      .map(({ operationId, summary }) => {
        return {
          params: {
            operationId,
            pageTitle: `${summary} - vitepress-openapi`,
          },
        }
      })
  },
}
