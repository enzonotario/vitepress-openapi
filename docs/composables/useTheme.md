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
            theme: {
                highlighterTheme: {
                    light: 'vitesse-light',
                    dark: 'vitesse-dark',
                },
            },
            path: {
                // Show the base URL in the path component.
                showBaseURL: false,
            },
            requestBody: {
                // Set the default schema view.
                defaultView: 'schema', // schema or contentType
            },
            jsonViewer: {
                // How many levels are expanded on load.
                deep: Infinity,
                // Set the JSON viewer renderer.
                renderer: 'vue-json-pretty', // vue-json-pretty or shiki
            },
            schemaViewer: {
                // How many levels are expanded on load.
                deep: 1,
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
                responseCodeSelector: 'tabs', // tabs or select
                // Set the maximum number of tabs, after which a Select will be shown.
                maxTabs: 5,
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
                examples: {
                    // Behavior for standard `example` / `examples` fields.
                    behavior: 'value', // placeholder, value, or ignore
                    // Behavior for `x-playground-example` extension field.
                    playgroundExampleBehavior: 'value', // placeholder, value, or ignore
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
                    'parameters',
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
                    { code: 'zh', label: '中文' },
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
                defaultTagDescription: '', // Description for the default tag.
                wrapExamples: true, // Wrap examples in a row or show them in a column.
                disableDownload: false, // Disable the download button in the info section.
            },
            server: {
                // Set a custom function to get servers.
                getServers: ({ method, path, operation }) => Array<string>,
                // Allow custom servers.
                allowCustomServer: true,
            },
            storage: {
                // Set the localStorage key prefix.
                prefix: '--oa',
                // Set to false to disable persisting auth values to localStorage.
                persistAuth: true,
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
                externalLinksNewTab: true,
                config: md => md,
            },
        })
    }
}
```

## Utility Functions

General-purpose functions available from the composable.

| Function     | Description                                                             |
|--------------|-------------------------------------------------------------------------|
| `isDark`     | Reactive `Ref<boolean>` that reflects the current VitePress dark mode.  |
| `reset()`    | Resets all theme configuration back to the default values.              |
| `getState()` | Returns a deep plain object (non-reactive) snapshot of the full config. |

```ts
const { isDark, reset, getState } = useTheme()

// Reactively read dark mode
console.log(isDark.value) // true | false

// Reset all config to defaults
reset()

// Read full config as a plain object
console.log(getState())
```

## Theme / Highlighter Configuration

Configures the syntax highlighter (Shiki) theme for code blocks. You can set different themes for light and dark mode.

| Function               | Description                          |
|------------------------|--------------------------------------|
| `setHighlighterTheme`  | Sets the highlighter theme config.   |
| `getHighlighterTheme`  | Returns the current theme config.    |

Config shape: `{ light?: ShikiTheme, dark?: ShikiTheme }`. Shiki theme names (e.g. from `@shikijs/themes`) or theme objects are supported.

```ts
useTheme({
  theme: {
    highlighterTheme: {
      light: 'vitesse-light',
      dark: 'vitesse-dark',
    },
  },
})
```

## Path Configuration

| Function          | Description                          | Default Value | Allowed Values  |
|-------------------|--------------------------------------|---------------|-----------------|
| `setShowBaseURL`  | Sets whether the base URL is shown.  | `false`       | `true`, `false` |
| `getShowBaseURL`  | Gets whether the base URL is shown.  | —             | —               |

## Request Body Configuration

| Function                    | Description                   | Default Value   | Allowed Values              |
|-----------------------------|-------------------------------|-----------------|-----------------------------|
| `setRequestBodyDefaultView` | Sets the default schema view. | `'contentType'` | `'schema'`, `'contentType'` |
| `getRequestBodyDefaultView` | Gets the default schema view. | —               | —                           |

## JSON Viewer Configuration

| Function                | Description                    | Default Value       | Allowed Values                 |
|-------------------------|--------------------------------|---------------------|--------------------------------|
| `setJsonViewerDeep`     | Sets the JSON viewer depth.    | `Infinity`          | `number`                       |
| `getJsonViewerDeep`     | Gets the JSON viewer depth.    | —                   | —                              |
| `setJsonViewerRenderer` | Sets the JSON viewer renderer. | `'vue-json-pretty'` | `'vue-json-pretty'`, `'shiki'` |
| `getJsonViewerRenderer` | Gets the JSON viewer renderer. | —                   | —                              |

## Schema Viewer Configuration

| Function              | Description                   | Default Value | Allowed Values |
|-----------------------|-------------------------------|---------------|----------------|
| `setSchemaViewerDeep` | Sets the schema viewer depth. | `1`           | `number`       |
| `getSchemaViewerDeep` | Gets the schema viewer depth. | —             | —              |

## Heading Levels Configuration

| Function           | Description                                       | Default Value                                    | Allowed Values                                                               |
|--------------------|---------------------------------------------------|--------------------------------------------------|------------------------------------------------------------------------------|
| `setHeadingLevels` | Sets the heading levels.                          | `{ h1: 1, h2: 2, h3: 3, h4: 4, h5: 5, h6: 6 }` | `{ h1: number, h2: number, h3: number, h4: number, h5: number, h6: number }` |
| `getHeadingLevels` | Gets the full heading levels object.              | —                                                | —                                                                            |
| `getHeadingLevel`  | Gets the resolved tag name for a specific level.  | —                                                | `'h1'` \| `'h2'` \| ... \| `'h6'`                                           |

`getHeadingLevel(level)` accepts a key (`'h1'`–`'h6'`) and returns the mapped HTML tag string (e.g. `'h2'`). Throws if the configured value is out of range `[1, 6]`.

```ts
const { getHeadingLevel } = useTheme()
getHeadingLevel('h1') // → 'h1' (or whatever h1 is mapped to)
```

## Response Configuration

| Function                     | Description                                                          | Default Value   | Allowed Values              |
|------------------------------|----------------------------------------------------------------------|-----------------|-----------------------------|
| `setResponseCodeSelector`    | Sets the response code selector.                                     | `'tabs'`        | `'tabs'`, `'select'`        |
| `getResponseCodeSelector`    | Gets the response code selector.                                     | —               | —                           |
| `setResponseCodeMaxTabs`     | Sets the maximum number of tabs, after which a Select will be shown. | `5`             | `number`                    |
| `getResponseCodeMaxTabs`     | Gets the maximum number of tabs.                                     | —               | —                           |
| `setResponseBodyDefaultView` | Sets the default view of the response body.                          | `'contentType'` | `'schema'`, `'contentType'` |
| `getResponseBodyDefaultView` | Gets the default view of the response body.                          | —               | —                           |

## Playground JSON Editor Configuration

| Function                               | Description                                | Default Value | Allowed Values                |
|----------------------------------------|--------------------------------------------|---------------|-------------------------------|
| `setPlaygroundJsonEditorMode`          | Sets the mode of the JSON editor.          | `'tree'`      | `'text'`, `'tree'`, `'table'` |
| `getPlaygroundJsonEditorMode`          | Gets the mode of the JSON editor.          | —             | —                             |
| `setPlaygroundJsonEditorMainMenuBar`   | Sets the visibility of the main menu bar.  | `false`       | `true`, `false`               |
| `getPlaygroundJsonEditorMainMenuBar`   | Gets the visibility of the main menu bar.  | —             | —                             |
| `setPlaygroundJsonEditorNavigationBar` | Sets the visibility of the navigation bar. | `false`       | `true`, `false`               |
| `getPlaygroundJsonEditorNavigationBar` | Gets the visibility of the navigation bar. | —             | —                             |
| `setPlaygroundJsonEditorStatusBar`     | Sets the visibility of the status bar.     | `false`       | `true`, `false`               |
| `getPlaygroundJsonEditorStatusBar`     | Gets the visibility of the status bar.     | —             | —                             |

## Playground Examples Configuration

Controls how example values from the OpenAPI spec are applied in the playground. Two sources are configured independently:

- **`behavior`** — applies to standard `example` / `examples` fields.
- **`playgroundExampleBehavior`** — applies to the `x-playground-example` extension field.

See [Playground Examples](/customizations/playground-examples) for details on `x-playground-example`.

| Function                         | Description                                                     | Default Value | Allowed Values                         |
|----------------------------------|-----------------------------------------------------------------|---------------|----------------------------------------|
| `setPlaygroundExamplesBehavior`  | Sets the behavior for standard `example` / `examples` values.  | `'value'`     | `'placeholder'`, `'value'`, `'ignore'` |
| `getPlaygroundExamplesBehavior`  | Gets the current behavior for standard examples.                | —             | —                                      |
| `setPlaygroundXExampleBehavior`  | Sets the behavior for `x-playground-example` values.           | `'value'`     | `'placeholder'`, `'value'`, `'ignore'` |
| `getPlaygroundXExampleBehavior`  | Gets the current behavior for `x-playground-example` values.   | —             | —                                      |

- **`placeholder`** — show as placeholder text only.
- **`value`** — pre-fill the field with the example value.
- **`ignore`** — do not use the example.

```ts
useTheme({
  playground: {
    examples: {
      behavior: 'placeholder',           // for spec `example` fields
      playgroundExampleBehavior: 'value', // for spec `x-playground-example` fields
    },
  },
})
```

## Security Configuration

Sets the default security scheme used when multiple schemes are available (e.g. in the playground).

| Function                    | Description                           | Default Value | Allowed Values   |
|-----------------------------|---------------------------------------|---------------|------------------|
| `setSecurityDefaultScheme`  | Sets the default security scheme ID.  | `null`        | `string \| null` |
| `getSecurityDefaultScheme`  | Gets the current default scheme.      | —             | —                |

## Code Samples Configuration

Configures how code samples are generated and displayed (languages, generator, default headers).

| Function                           | Description                                        |
|------------------------------------|----------------------------------------------------|
| `setCodeSamplesConfig`             | Sets the full code samples config.                 |
| `getCodeSamplesDefaultLang`        | Gets the default language for the code samples UI. |
| `getCodeSamplesAvailableLanguages` | Gets the list of available languages.              |
| `getCodeSamplesGenerator`          | Gets the custom generator function.                |
| `getCodeSamplesDefaultHeaders`     | Gets the default headers used when generating samples. |

`getCodeSamplesAvailableLanguages(filter?)` accepts an optional `string[]` to filter languages by their `lang` identifier.

Config shape: `{ defaultLang?, availableLanguages?, generator?, defaultHeaders? }`.

```ts
useTheme({
  codeSamples: {
    defaultLang: 'curl',
    availableLanguages: [
      {
        lang: 'curl',
        label: 'cURL',
        target: 'shell',
        client: 'curl',
        highlighter: 'bash',
        icon: 'curl',
      },
    ],
    generator: async (langConfig, request) => { /* return generated code string */ },
    defaultHeaders: { 'X-Custom': 'value' },
  },
})
```

Each language in `availableLanguages` is a `LanguageConfig` object:

| Field        | Description                                                              | Required |
|--------------|--------------------------------------------------------------------------|----------|
| `lang`       | Unique identifier and Shiki highlighter language (e.g. `'curl'`, `'javascript'`) | ✓ |
| `label`      | Display name shown in the UI                                             | ✓        |
| `target`     | Target language for `@scalar/snippetz` code generation (e.g. `'js'`, `'shell'`) | —  |
| `client`     | HTTP client for the target language (e.g. `'fetch'`, `'axios'`, `'curl'`)        | —  |
| `icon`       | Icon identifier for `vitepress-plugin-group-icons`                       | —        |
| `highlighter`| Shiki language for syntax highlighting (defaults to `'plain'`)           | —        |

## Links Prefixes Configuration

Configures URL prefixes used for generated navigation links (tags and operations). Affects how links to tags and operations are built in the spec UI.

| Function                  | Description                                           | Default Value  |
|---------------------------|-------------------------------------------------------|----------------|
| `setLinksPrefixesConfig`  | Sets `{ tags: string, operations: string }`.          | —              |
| `getLinksPrefixesConfig`  | Gets the current links prefixes config.               | —              |
| `getTagsLinkPrefix`       | Gets the prefix used for tag links.                   | `'/tags/'`     |
| `getOperationsLinkPrefix` | Gets the prefix used for operation links.             | `'/operations/'` |

```ts
useTheme({
  linksPrefixes: {
    tags: '/tags/',
    operations: '/operations/',
  },
})
```

## Operation Configuration

| Function                      | Description                                            | Default Value        | Allowed Values                  |
|-------------------------------|--------------------------------------------------------|----------------------|---------------------------------|
| `setOperationBadges`          | Sets the operation badges. The order is respected.     | `['deprecated']`     | `['deprecated', 'operationId']` |
| `getOperationBadges`          | Gets the current operation badges.                     | —                    | —                               |
| `setOperationSlots`           | Sets which slots are rendered (order is respected).    | See Custom Slots     | `OperationSlot[]`               |
| `getOperationSlots`           | Gets the list of slots to render.                      | —                    | —                               |
| `setOperationHiddenSlots`     | Sets which slots are hidden (filtered out from render).| `[]`                 | `OperationSlot[]`               |
| `getOperationHiddenSlots`     | Gets the list of hidden slots.                         | —                    | —                               |
| `setOperationCols`            | Sets the operation layout columns (1 or 2).            | `2`                  | `1 \| 2`                        |
| `getOperationCols`            | Gets the current column layout.                        | —                    | —                               |
| `setOperationDefaultBaseUrl`  | Sets the default base URL.                             | `'http://localhost'` | `string`                        |
| `getOperationDefaultBaseUrl`  | Gets the default base URL.                             | —                    | —                               |

## I18n Configuration

| Function        | Description                  | Default Value                                               | Allowed Values                                                                                                                                           |
|-----------------|------------------------------|-------------------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------|
| `setI18nConfig` | Sets the i18n configuration. | `{ locale: 'en', fallbackLocale: 'en', messages: locales }` | `{ locale: 'es' \| 'en' \| 'ja' \| 'pt-BR' \| string, fallbackLocale: 'es' \| 'en' \| 'ja' \| 'pt-BR' \| string, messages: Messages, availableLocales: AvailableLocale[] }` |
| `getI18nConfig` | Gets the full i18n config.   | —                                                           | —                                                                                                                                                        |
| `getLocale`     | Gets the active locale code. | `'en'`                                                      | —                                                                                                                                                        |

## Spec Configuration

| Function             | Description                                                       | Default Value                                                                                                                                        | Allowed Values                                                                                                                                                      |
|----------------------|-------------------------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `setSpecConfig`      | Sets the spec configuration.                                      | `{ groupByTags: true, collapsePaths: false, showPathsSummary: true, avoidCirculars: false, lazyRendering: false, defaultTag: 'Default', wrapExamples: true, disableDownload: false }` | `{ groupByTags: boolean, collapsePaths: boolean, showPathsSummary: boolean, avoidCirculars: boolean, lazyRendering: boolean, defaultTag: string, wrapExamples: boolean, disableDownload: boolean }` |
| `getSpecConfig`      | Gets the full spec config object.                                 | —                                                                                                                                                    | —                                                                                                                                                                   |
| `getWrapExamples`    | Gets whether examples are wrapped in a row layout.                | `true`                                                                                                                                               | `true`, `false`                                                                                                                                                     |
| `getSpecDisableDownload` | Gets whether the download button in the info section is disabled. | `false`                                                                                                                                          | `true`, `false`                                                                                                                                                     |

## Server Configuration

| Function                     | Description                              | Default Value                                    | Allowed Values                                                         |
|------------------------------|------------------------------------------|--------------------------------------------------|------------------------------------------------------------------------|
| `setServerConfig`            | Sets the server configuration.           | `{ getServers: null, allowCustomServer: false }` | `{ getServers: ({ method, path, operation }) => string[], allowCustomServer: boolean }` |
| `getServerConfig`            | Gets the full server config object.      | —                                                | —                                                                      |
| `getOperationServers`        | Gets the servers function for an operation. | `null`                                        | `({ method, path, operation }) => string[]`                            |
| `getServerAllowCustomServer` | Gets whether custom servers are allowed. | `false`                                          | `true`, `false`                                                        |

## Storage Configuration

| Function                 | Description                                                        | Default Value | Allowed Values   |
|--------------------------|--------------------------------------------------------------------|---------------|------------------|
| `setStorageConfig`       | Sets the storage configuration.                                    | —             | —                |
| `getStoragePrefix`       | Returns the current localStorage key prefix.                       | `'--oa'`      | `string`         |
| `getStoragePersistAuth`  | Returns whether auth values are persisted to localStorage.         | `true`        | `true`, `false`  |

## Markdown Configuration

| Function               | Description                       | Default Value                                                                   | Allowed Values                                                                                                                                           |
|------------------------|-----------------------------------|---------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------|
| `setMarkdownConfig`    | Sets the markdown configuration.  | `{ operationLink: { linkPrefix: '/operations/' }, externalLinksNewTab: false }` | `{ operationLink: { linkPrefix: string, transformHref: (href: string) => string } \| false, externalLinksNewTab: boolean, config: (md) => MarkdownIt }` |
| `getMarkdownConfig`    | Gets the markdown configuration.  | —                                                                               | —                                                                                                                                                        |
| `getOperationLinkConfig` | Gets the operation link configuration. | `{ linkPrefix: '/operations/' }`                                           | `{ linkPrefix: string, transformHref: (href: string) => string } \| false`                                                                              |
| `getExternalLinksNewTab` | Gets whether external links open in new tab. | `false`                                                               | `true`, `false`                                                                                                                                          |

Setting `operationLink` to `false` disables the operation link plugin entirely.

You can also customize the markdown renderer with the `config` callback:

```ts
useTheme({
  markdown: {
    config: md => {
      // add custom markdown-it plugins
      md.use(myPlugin, myParams)
      return;

      // or return your own instance
      const myMd = (/* ... */)
      return myMd
    },
  },
})
```

`md` is an instance of [markdown-it](https://github.com/markdown-it/markdown-it).
