import { useOpenapi } from 'vitepress-theme-openapi'
import spec from '../public/openapi.json' assert { type: 'json' }

export default {
    paths() {
        const openapi = useOpenapi({ spec })

        if (!openapi?.spec?.paths) {
            return []
        }

        return Object.keys(openapi.spec.paths)
            .map((path) => {
                const { operationId } = openapi.spec.paths[path].get
                const summary = openapi.spec.paths[path].get.summary
                return {
                    params: {
                        operationId,
                        pageTitle: `${summary} - vitepress-theme-openapi`,
                    },
                }
            })
    },
}
