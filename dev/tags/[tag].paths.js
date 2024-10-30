import { usePaths } from 'vitepress-openapi'
import spec from '../../docs/public/openapi.json' assert { type: 'json' }

export default {
    paths() {
        return usePaths({ spec })
            .getTags()
            .map(({ name }) => {
                return {
                    params: {
                        tag: name,
                        pageTitle: `${name} - vitepress-openapi`,
                    },
                }
            })
    },
}
