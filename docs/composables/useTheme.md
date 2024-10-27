# `useTheme` composable

The `useTheme` composable provides functions to configure the theme.

You can use the `useTheme` composable to configure the theme in your `.vitepress/theme/index.js` file, or in any `.md` page/file.

```ts
import { useTheme, locales } from 'vitepress-openapi'

export default {
    async enhanceApp({app, router, siteData}) {
        useTheme({
            request: {
                // Set the default schema view.
                defaultView: 'schema', // schema or contentType
            },
            jsonViewer: {
                // Set the JSON viewer depth.
                deep: Infinity,
            },
            schemaViewer: {
                // Set the schema viewer depth.
                deep: Infinity,
            },
            // Set the heading levels.
            headingLevels: {
                h1: 1,
                h2: 2,
                h3: 3,
                h4: 4,
                h5: 5,
                h6: 6,
            },
            response: {
                // Set the response code selector.
                codeSelector: 'tabs', // tabs or select
                // Set the maximum number of tabs, after which a Select will be shown.
                codeMaxTabs: 5,
            },
            playground: {
                jsonEditor: {
                    // Set the mode of the JSON editor.
                    mode: 'tree', // text, tree, or table
                    // Set the visibility of the main menu bar.
                    mainMenuBar: false,
                    // Set the visibility of the navigation bar.
                    navigationBar: false,
                },
            },
            operation: {
                // Set the operation badges. The order is respected.
                badges: ['deprecated'],
                // Slots to render in the OAOperation component.
                slots: [
                    'header',
                    'path',
                    'description',
                    'security',
                    'request-body',
                    'responses',
                    'try-it',
                    'code-samples',
                    'branding',
                    'footer',
                ],
                // Slots to hide in the OAOperation component.
                hiddenSlots: [],
                // Set the number of columns to use in the OAOperation component.
                cols: 2,
            },
            // Set the i18n configuration.
            i18n: {
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
            },
            // Set spec configuration.
            spec: {
                groupByTags: true, // Group paths by tags.
                collapsePaths: false, // Collapse paths when grouping by tags.
                showPathsSummary: true, // Show a summary of the paths when grouping by tags.
                avoidCirculars: false, // Avoid circular references when parsing schemas.
                lazyRendering: false, // Lazy render Paths and Tags components.
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

## Spec Configuration

| Function        | Description                  | Default Value                                                         | Allowed Values                                                                |
|-----------------|------------------------------|-----------------------------------------------------------------------|-------------------------------------------------------------------------------|
| `setSpecConfig` | Sets the spec configuration. | `{ groupByTags: true, collapsePaths: false, showPathsSummary: true, avoidCirculars: false, lazyRendering: false }` | `{ groupByTags: boolean, collapsePaths: boolean, showPathsSummary: boolean, avoidCirculars: boolean, lazyRendering: boolean }` |
