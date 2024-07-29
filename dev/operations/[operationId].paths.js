import { useOpenapi } from 'vitepress-theme-openapi'
import spec from '../public/openapi.json' assert { type: 'json' }

export default {
    paths() {
        const openapi = useOpenapi({ spec })

        if (!openapi?.spec?.paths) {
            return []
        }

        const httpVerbs = ['get', 'post', 'put', 'delete', 'patch', 'options', 'head']

        return Object.keys(openapi.spec.paths)
            .flatMap((path) => {
                return httpVerbs
                    .filter((verb) => openapi.spec.paths[path][verb])
                    .map((verb) => {
                        const { operationId, summary } = openapi.spec.paths[path][verb]
                        return {
                            params: {
                                operationId,
                                pageTitle: `${summary} - vitepress-theme-openapi`,
                            },
                        }
                    })
            })
    },
}
