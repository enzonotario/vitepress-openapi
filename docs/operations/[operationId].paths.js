import { useOpenapi } from 'vitepress-theme-openapi'

export default {
  paths() {
    const openapi = useOpenapi()

    return Object.keys(openapi.json.paths)
      .map((path) => {
        const { operationId } = openapi.json.paths[path].get
        return {
          params: {
            operationId,
            pageTitle: `${openapi.getOperation(operationId).summary} - vitepress-theme-openapi`,
          },
        }
      })
  },
}
