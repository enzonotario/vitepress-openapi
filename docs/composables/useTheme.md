---
prev:
  text: 'Sidebar Items'
  link: /sidebar/sidebar-items
---

# `useTheme` composable

The `useTheme` composable provides functions to configure the theme.

You can use the `useTheme` composable to configure the theme in your `.vitepress/theme/index.js` file, or in any `.md` page/file.

```ts
import { useTheme, locales } from 'vitepress-openapi/client'

export default {
    async enhanceApp({app, router, siteData}) {
        useTheme({
            requestBody: {
                // Set the default schema view.
                defaultView: 'schema', // schema or contentType
            },
            jsonViewer: {
                // Set the JSON viewer depth.
                deep: Infinity,
                // Set the JSON viewer renderer.
                renderer: 'vue-json-pretty', // vue-json-pretty or shiki
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
                body: {
                    // Set the default view.
                    defaultView: 'schema', // schema or contentType
                },
            },
            playground: {
                jsonEditor: {
                    // Set the mode of the JSON editor.
                    mode: 'tree', // text, tree, or table
                    // Set the visibility of the main menu bar.
                    mainMenuBar: false,
                    // Set the visibility of the navigation bar.
                    navigationBar: false,
                    // Set the visibility of the status bar.
                    statusBar: false,
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
                    'playground',
                    'code-samples',
                    'branding',
                    'footer',
                ],
                // Slots to hide in the OAOperation component.
                hiddenSlots: [],
                // Set the number of columns to use in the OAOperation component.
                cols: 2,
                // Set the default base URL.
                defaultBaseUrl: 'http://localhost',
                // Deprecated. Use `server.getServers` instead.
                getServers: ({ method, path, operation }) => Array<string>,
            },
            // Set the i18n configuration.
            i18n: {
                locale: 'en', // en | es | ja | pt-BR | string
                fallbackLocale: 'en', // en | es | ja | pt-BR | string
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
                availableLocales: [
                    { code: 'en', label: 'English' },
                    { code: 'es', label: 'Español' },
                    { code: 'ja', label: 'Japanese' },
                    { code: 'pt-BR', label: 'Português (Brasil)' },
                ],
            },
            // Set spec configuration.
            spec: {
                groupByTags: true, // Group paths by tags.
                collapsePaths: false, // Collapse paths when grouping by tags.
                showPathsSummary: true, // Show a summary of the paths when grouping by tags.
                avoidCirculars: false, // Avoid circular references when parsing schemas.
                lazyRendering: false, // Lazy render Paths and Tags components.
                defaultTag: 'Default', // Default tag to use when a path has no tags.
                wrapExamples: true, // Wrap examples in a row or show them in a column.
                disableDownload: false, // Disable the download button in the info section.
            },
            server: {
                // Set a custom function to get servers.
                getServers: ({ method, path, operation }) => Array<string>,
                // Allow custom servers.
                allowCustomServer: true,
            },
            markdown: {
                operationLink: {
                    // Link prefix to search for operations.
                    linkPrefix: '/operations/',
                    // Transform the href of operation links.
                    transformHref: (href) => {
                        return `/example${href}`
                    },
                },
            },
        })
    }
}
```

## Schema Configuration

| Function               | Description                         | Default Value | Allowed Values              |
|------------------------|-------------------------------------|---------------|-----------------------------|
| `setShowBaseURL`       | Sets whether the base URL is shown. | `true`        | `true`, `false`             |

## Request Body Configuration

| Function                    | Description                   | Default Value | Allowed Values              |
|-----------------------------|-------------------------------|---------------|-----------------------------|
| `setRequestBodyDefaultView` | Sets the default schema view. | `'schema'`    | `'schema'`, `'contentType'` |

## JSON Viewer Configuration

| Function                | Description                    | Default Value       | Allowed Values                 |
|-------------------------|--------------------------------|---------------------|--------------------------------|
| `setJsonViewerDeep`     | Sets the JSON viewer depth.    | `Infinity`          | `number`                       |
| `setJsonViewerRenderer` | Sets the JSON viewer renderer. | `'vue-json-pretty'` | `'vue-json-pretty'`, `'shiki'` |

## Schema Viewer Configuration

| Function              | Description                   | Default Value | Allowed Values |
|-----------------------|-------------------------------|---------------|----------------|
| `setSchemaViewerDeep` | Sets the schema viewer depth. | `Infinity`    | `number`       |

## Heading Levels Configuration

| Function           | Description              | Default Value                                  | Allowed Values                                                               |
|--------------------|--------------------------|------------------------------------------------|------------------------------------------------------------------------------|
| `setHeadingLevels` | Sets the heading levels. | `{ h1: 1, h2: 2, h3: 3, h4: 4, h5: 5, h6: 6 }` | `{ h1: number, h2: number, h3: number, h4: number, h5: number, h6: number }` |

## Response Configuration

| Function                     | Description                                                          | Default Value | Allowed Values              |
|------------------------------|----------------------------------------------------------------------|---------------|-----------------------------|
| `setResponseCodeSelector`    | Sets the response code selector.                                     | `'tabs'`      | `'tabs'`, `'select'`        |
| `setResponseCodeMaxTabs`     | Sets the maximum number of tabs, after which a Select will be shown. | `5`           | `number`                    |
| `setResponseBodyDefaultView` | Sets the default view of the response body.                          | `'schema'`    | `'schema'`, `'contentType'` |

## Playground JSON Editor Configuration

| Function                               | Description                                | Default Value | Allowed Values                |
|----------------------------------------|--------------------------------------------|---------------|-------------------------------|
| `setPlaygroundJsonEditorMode`          | Sets the mode of the JSON editor.          | `'tree'`      | `'text'`, `'tree'`, `'table'` |
| `setPlaygroundJsonEditorMainMenuBar`   | Sets the visibility of the main menu bar.  | `false`       | `true`, `false`               |
| `setPlaygroundJsonEditorNavigationBar` | Sets the visibility of the navigation bar. | `false`       | `true`, `false`               |
| `setPlaygroundJsonEditorStatusBar`     | Sets the visibility of the status bar.     | `false`       | `true`, `false`               |

## Operation Configuration

| Function                     | Description                                        | Default Value        | Allowed Values                  |
|------------------------------|----------------------------------------------------|----------------------|---------------------------------|
| `setOperationBadges`         | Sets the operation badges. The order is respected. | `['deprecated']`     | `['deprecated', 'operationId']` |
| `setOperationDefaultBaseUrl` | Sets the default base URL.                         | `'http://localhost'` | `string`                        |

## I18n Configuration

| Function        | Description                  | Default Value                                               | Allowed Values                                                                                                                           |
|-----------------|------------------------------|-------------------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------|
| `setI18nConfig` | Sets the i18n configuration. | `{ locale: 'en', fallbackLocale: 'en', messages: locales }` | `{ locale: 'es' \| 'en' \| 'ja' \| 'pt-BR' \| string, fallbackLocale: 'es' \| 'en' \| 'ja' \| 'pt-BR' \| string, messages: Record<'es' \| 'en' \| 'ja' \| 'pt-BR', Record<string, Record<string, string>>> }` |

## Spec Configuration

| Function        | Description                  | Default Value                                                                                                                             | Allowed Values                                                                                                                                     |
|-----------------|------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------|
| `setSpecConfig` | Sets the spec configuration. | `{ groupByTags: true, collapsePaths: false, showPathsSummary: true, avoidCirculars: false, lazyRendering: false, defaultTag: 'Default', wrapExamples: true, disableDownload: false }` | `{ groupByTags: boolean, collapsePaths: boolean, showPathsSummary: boolean, avoidCirculars: boolean, lazyRendering: boolean, defaultTag: string, wrapExamples: boolean, disableDownload: boolean }` |

## Server Configuration

| Function                      | Description                              | Default Value                                                                         | Allowed Values                                                                           |
|-------------------------------|------------------------------------------|---------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------|
| `setServerConfig`             | Sets the server configuration.           | `{ getServers: ({ method, path, operation }) => Array<string>, allowCustomServer: true }` | `{ getServers: ({ method, path, operation }) => Array<string>, allowCustomServer: boolean }` |
| `getServers`                  | Gets the servers for an operation.       | `({ method, path, operation }) => Array<string>`                                           | `({ method, path, operation }) => Array<string>`                                              |
| `getServerAllowCustomServer` | Gets whether custom servers are allowed. | `true`                                                                                | `true`, `false`                                                                          |

## Markdown Configuration

| Function              | Description                       | Default Value                                                | Allowed Values                                                                                                                                                                    |
|------------------------|-----------------------------------|------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------| 
| `setMarkdownConfig`    | Sets the markdown configuration.  | `{ operationLink: { linkPrefix: '/operations/' } }`        | `{ operationLink: { linkPrefix: string, transformHref: (href: string) => string, createOperationLinkHtml: (href: string, method: string, title: string) => string } }`            |
| `getMarkdownConfig`    | Gets the markdown configuration.  | `{ operationLink: { linkPrefix: '/operations/' } }`        | `{ operationLink: { linkPrefix: string, transformHref: (href: string) => string, createOperationLinkHtml: (href: string, method: string, title: string) => string } }` |
| `getOperationLinkConfig` | Gets the operation link configuration. | `{ linkPrefix: '/operations/' }`                    | `{ linkPrefix: string, transformHref: (href: string) => string, createOperationLinkHtml: (href: string, method: string, title: string) => string }`                    |
