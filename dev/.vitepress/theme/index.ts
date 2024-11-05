import { theme, useOpenapi } from 'vitepress-openapi'
import DefaultTheme from 'vitepress/theme'
import spec from '../../../docs/public/openapi.json' assert {type: 'json'}

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    // Set the OpenAPI specification.
    const openapi = useOpenapi({
      spec,
      config: {
        i18n: {
          locale: 'es',
        },
        // codeSamples: {
        //   langs: [
        //     'esjs',
        //     'typescript',
        //   ],
        //   availableLanguages: [
        //     {
        //       lang: 'esjs',
        //       label: 'EsJS',
        //     },
        //     {
        //       lang: 'typescript',
        //       label: 'TypeScript',
        //     },
        //   ],
        //   defaultLang: 'esjs',
        //   generator: (lang, request) => {
        //     return `${lang} code sample for ${request.method} ${request.url}`
        //   },
        // },
      },
    })

    // Use the theme.
    theme.enhanceApp({ app, openapi })
  },
}
