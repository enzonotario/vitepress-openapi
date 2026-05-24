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

### Slots

| Slot    | Description                                                                                                                                                                                                                      |
|---------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| default | Optional content to replace the title. The content will be processed by the `OAMarkdown` component, allowing you to use Markdown syntax within the slot. If no slot is provided, the `title` prop will be used as the link text. |

### Usage

To add an operation link in your Vue template, use the component as shown below:

```vue
<OAOperationLink href="/example/operations/getAllArtists" method="get" title="Get all artists" />
```

This will render a clickable link with a method badge: <OAOperationLink href="/example/operations/getAllArtists" method="get" title="Get all artists" />

You can also use a slot to customize the content:

```vue
<OAOperationLink href="/example/operations/getAllArtists" method="get">
[Get all artists]() `/api/v1/artists`
</OAOperationLink>
```

This will render:
<OAOperationLink href="/example/operations/getAllArtists" method="get">[Get all artists]() `/api/v1/artists`</OAOperationLink>

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

You can write links using the `/operations/` prefix directly in Markdown. The plugin
converts them into `OAOperationLink` components with the correct HTTP method badge.

```markdown
The [Get Artists](/operations/getAllArtists) operation retrieves all artists.
```

### Disabling the plugin

If you prefer to handle these links yourself, disable the plugin via `useTheme`:

```ts
import { useTheme } from 'vitepress-openapi/client'

useTheme({
  markdown: {
    operationLink: false,
  },
})
```
