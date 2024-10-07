# `useTheme` composable

The `useTheme` composable provides functions to configure the theme.

You can use the `useTheme` composable to configure the theme in your `.vitepress/theme/index.js` file, or in any `.md` page/file.

```ts
import { useTheme, locales } from 'vitepress-openapi'

export default {
    async enhanceApp({app, router, siteData}) {
        const themeConfig = useTheme()
        
        // Set the default schema view.
        themeConfig.setSchemaDefaultView('schema') // schema or contentType
        
        // Set the JSON viewer depth.
        themeConfig.setJsonViewerDeep(Infinity)
        
        // Set the schema viewer depth.
        themeConfig.setSchemaViewerDeep(Infinity)
        
        // Set the heading levels.
        themeConfig.setHeadingLevels({
            h1: 1,
            h2: 2,
            h3: 3,
            h4: 4,
            h5: 5,
            h6: 6,
        })
        
        // Set the response code selector.
        themeConfig.setResponseCodeSelector('tabs') // tabs or select
        
        // Set the maximum number of tabs, after which a Select will be shown.
        themeConfig.setResponseCodeMaxTabs(5)
        
        // Set the mode of the JSON editor.
        themeConfig.setPlaygroundJsonEditorMode('tree') // text, tree, or table
        
        // Set the visibility of the main menu bar.
        themeConfig.setPlaygroundJsonEditorMainMenuBar(false)
        
        // Set the visibility of the navigation bar.
        themeConfig.setPlaygroundJsonEditorNavigationBar(false)
        
        // Get the current operation badges.
        themeConfig.getOperationBadges() // ['deprecated']
        
        // Set the operation badges.
        themeConfig.setOperationBadges(['deprecated'])
        
        // Get the current i18n configuration.
        themeConfig.getI18nConfig() // { locale: 'en', fallbackLocale: 'en', messages: locales }
        
        // Set the i18n configuration.
        themeConfig.setI18nConfig({
            locale: 'en', // en or es
            fallbackLocale: 'en', // en or es
            messages: {
                en: {
                    ...locales.en,
                    'operation.badgePrefix.operationId': 'Operation ID',
                },
                es: {
                    ...locales.es,
                    'operation.badgePrefix.operationId': 'ID de operación',
                },
            },
        })
    }
}
```

## Schema Configuration

| Function               | Description                         | Default Value | Allowed Values              |
|------------------------|-------------------------------------|---------------|-----------------------------|
| `setSchemaDefaultView` | Sets the default schema view.       | `'schema'`    | `'schema'`, `'contentType'` |
| `setShowBaseURL`       | Sets whether the base URL is shown. | `true`        | `true`, `false`             |

## JSON Viewer Configuration

| Function            | Description                 | Default Value | Allowed Values |
|---------------------|-----------------------------|---------------|----------------|
| `setJsonViewerDeep` | Sets the JSON viewer depth. | `Infinity`    | `number`       |

## Schema Viewer Configuration

| Function              | Description                   | Default Value | Allowed Values |
|-----------------------|-------------------------------|---------------|----------------|
| `setSchemaViewerDeep` | Sets the schema viewer depth. | `Infinity`    | `number`       |

## Heading Levels Configuration

| Function           | Description              | Default Value                                  | Allowed Values                                                               |
|--------------------|--------------------------|------------------------------------------------|------------------------------------------------------------------------------|
| `setHeadingLevels` | Sets the heading levels. | `{ h1: 1, h2: 2, h3: 3, h4: 4, h5: 5, h6: 6 }` | `{ h1: number, h2: number, h3: number, h4: number, h5: number, h6: number }` |

## Response Configuration

| Function                  | Description                                                          | Default Value | Allowed Values       |
|---------------------------|----------------------------------------------------------------------|---------------|----------------------|
| `setResponseCodeSelector` | Sets the response code selector.                                     | `'tabs'`      | `'tabs'`, `'select'` |
| `setResponseCodeMaxTabs`  | Sets the maximum number of tabs, after which a Select will be shown. | `5`           | `number`             |

## Playground JSON Editor Configuration

| Function                               | Description                                | Default Value | Allowed Values                |
|----------------------------------------|--------------------------------------------|---------------|-------------------------------|
| `setPlaygroundJsonEditorMode`          | Sets the mode of the JSON editor.          | `'tree'`      | `'text'`, `'tree'`, `'table'` |
| `setPlaygroundJsonEditorMainMenuBar`   | Sets the visibility of the main menu bar.  | `false`       | `true`, `false`               |
| `setPlaygroundJsonEditorNavigationBar` | Sets the visibility of the navigation bar. | `false`       | `true`, `false`               |

## Operation Configuration

| Function             | Description                                        | Default Value    | Allowed Values                  |
|----------------------|----------------------------------------------------|------------------|---------------------------------|
| `setOperationBadges` | Sets the operation badges. The order is respected. | `['deprecated']` | `['deprecated', 'operationId']` |

## I18n Configuration

| Function        | Description                  | Default Value                                               | Allowed Values                                                                                                                   |
|-----------------|------------------------------|-------------------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------|
| `setI18nConfig` | Sets the i18n configuration. | `{ locale: 'en', fallbackLocale: 'en', messages: locales }` | `{ locale: 'es' \| 'en', fallbackLocale: 'es' \| 'en', messages: Record<'es' \| 'en', Record<string, Record<string, string>>> }` |
