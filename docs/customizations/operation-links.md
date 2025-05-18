# Operation Links

Operation Links enable you to create navigable references to specific API operations within your documentation. This feature is especially useful for cross-referencing operations from various sections, such as Markdown files or OpenAPI specification descriptions.

## Component

The `OAOperationLink` component can be used anywhere in your Vue templates to generate links to API operations, with HTTP method badges.

### Props

| Prop | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
| `href` | `string` | `''` | The URL to link to |
| `method` | `string` | `''` | The HTTP method (GET, POST, etc.) |
| `title` | `string` | `''` | The text to display for the link |

### Usage

To add an operation link in your Vue template, use the component as shown below:

```vue
<OAOperationLink href="/example/operations/getAllArtists" method="get" title="Get all artists" />
```

This will render a clickable link with a method badge: <OAOperationLink href="/example/operations/getAllArtists" method="get" title="Get all artists" />

## `markdown-it` plugin

The `operationLink` plugin for `markdown-it` allows you to automatically converts operation links in your OpenAPI descriptions into a custom component with a method badge.

### Configuration

You can use the `useTheme` composable to configure the `operationLink` plugin. This is typically done in your `theme/index.[js,ts]` file.

```js
import { useTheme } from 'vitepress-openapi/client'

useTheme({
  markdown: {
    operationLink: {
      linkPrefix: '/operations/',
      transformHref: (href) => href.replace('/operations/', '/api/'),
      createOperationLinkHtml: (href, method, title) => `<a href="${href}" class="operation-link">${title} (${method})</a>`,
    },
  },
})
```

### Options

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `linkPrefix` | `string` | `'/operations/'` | Prefix for operation links |
| `transformHref` | `(href: string) => string` | `undefined` | Function to transform the href before rendering |
| `createOperationLinkHtml` | `(href: string, method: string, title: string) => string` | `undefined` | Custom function to create the HTML for operation links |

### Usage in OpenAPI specification

In the `description` field of an OpenAPI operation, you can write:

::: code-group

```json [json]
{
  "description": "The [](/operations/getAllArtists) operation retrieves all artists from the database.\nThe [createArtist operation](/operations/createArtist) creates a new artist in the database."
}
```

```yaml [yaml]
description: |
  The [](/operations/getAllArtists) operation retrieves all artists from the database.
  The [createArtist operation](/operations/createArtist) creates a new artist in the database.
```

:::

The plugin will transform it into:

<OAMarkdown :content="'The [](/operations/getAllArtists) operation retrieves all artists from the database.\nThe [createArtist operation](/operations/createArtist) creates a new artist in the database.'" />

### Usage in Markdown

WIP.
