import { useOpenapi } from 'vitepress-openapi'
import spec from '../../public/openapi.json' assert {type: 'json'}

export default {
    paths() {
        const openapi = useOpenapi({ spec })

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
