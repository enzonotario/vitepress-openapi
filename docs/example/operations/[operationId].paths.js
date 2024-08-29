import { useOpenapi, httpVerbs } from 'vitepress-theme-openapi'
import spec from '../../public/openapi.json' assert { type: 'json' }

export default {
    paths() {
        const openapi = useOpenapi({ spec })

        if (!openapi?.rawSpec?.paths) {
            return []
        }

        return Object.keys(openapi.rawSpec.paths)
            .flatMap((path) => {
                return httpVerbs
                    .filter((verb) => openapi.rawSpec.paths[path][verb])
                    .map((verb) => {
                        const { operationId, summary } = openapi.rawSpec.paths[path][verb]
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
