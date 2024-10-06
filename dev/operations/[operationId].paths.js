import { OpenApi } from 'vitepress-openapi'
import spec from '../../docs/public/openapi.json' assert { type: 'json' }

export default {
    paths() {
        const openapi = OpenApi({ spec })

        return openapi.getPathsByVerbs().map(({ operationId, summary }) => {
            return {
                params: {
                    operationId,
                    pageTitle: `${summary} - vitepress-openapi`,
                },
            }
        })
    },
}
