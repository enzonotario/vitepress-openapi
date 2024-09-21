# `useTheme` composable

The `useTheme` composable provides functions to configure the theme.

You can use the `useTheme` composable to configure the theme in your `.vitepress/theme/index.js` file, or in any `.md` page/file.

```ts
import { useTheme } from 'vitepress-theme-openapi'

export default {
    async enhanceApp({app, router, siteData}) {
        const themeConfig = useTheme()
        
        // Set the language.
        themeConfig.setLocale('en') // en or es
        
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
    }
}
```

## Global Configuration

| Function    | Description                           | Default Value |
|-------------|---------------------------------------|---------------|
| `setLocale` | Sets the language (`'es'` or `'en'`). | `'en'`        |

## Schema Configuration

| Function               | Description                         | Default Value |
|------------------------|-------------------------------------|---------------|
| `setSchemaDefaultView` | Sets the default schema view.       | `'schema'`    |
| `setShowBaseURL`       | Sets whether the base URL is shown. | `true`        |

## JSON Viewer Configuration

| Function            | Description                 | Default Value |
|---------------------|-----------------------------|---------------|
| `setJsonViewerDeep` | Sets the JSON viewer depth. | `Infinity`    |

## Schema Viewer Configuration

| Function              | Description                   | Default Value |
|-----------------------|-------------------------------|---------------|
| `setSchemaViewerDeep` | Sets the schema viewer depth. | `Infinity`    |

## Heading Levels Configuration

| Function           | Description              | Default Value                                  |
|--------------------|--------------------------|------------------------------------------------|
| `setHeadingLevels` | Sets the heading levels. | `{ h1: 1, h2: 2, h3: 3, h4: 4, h5: 5, h6: 6 }` |

## Response Configuration

| Function                  | Description                                                          | Default Value |
|---------------------------|----------------------------------------------------------------------|---------------|
| `setResponseCodeSelector` | Sets the response code selector.                                     | `'tabs'`      |
| `setResponseCodeMaxTabs`  | Sets the maximum number of tabs, after which a Select will be shown. | `5`           |

## Playground JSON Editor Configuration

| Function                               | Description                                | Default Value |
|----------------------------------------|--------------------------------------------|---------------|
| `setPlaygroundJsonEditorMode`          | Sets the mode of the JSON editor.          | `'tree'`      |
| `setPlaygroundJsonEditorMainMenuBar`   | Sets the visibility of the main menu bar.  | `false`       |
| `setPlaygroundJsonEditorNavigationBar` | Sets the visibility of the navigation bar. | `false`       |
