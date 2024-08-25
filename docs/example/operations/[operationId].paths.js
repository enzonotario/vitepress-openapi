import { useOpenapi, httpVerbs } from 'vitepress-theme-openapi'
import spec from '../../public/openapi.json' assert { type: 'json' }

export default {
    paths() {
        const openapi = useOpenapi({ spec })

        if (!openapi?.spec?.paths) {
            return []
        }

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
