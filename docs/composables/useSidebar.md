---
prev:
  text: 'Sidebar Items'
  link: /sidebar/sidebar-items
next:
  text: 'useTheme'
  link: /composables/useTheme
---

# `useSidebar` composable

`useSidebar` generates VitePress-compatible sidebar items from an OpenAPI specification. Use it in `themeConfig.sidebar` or anywhere you need operation navigation links.

For ready-to-use `themeConfig.sidebar` recipes, see [Sidebar Items](/sidebar/sidebar-items). For playground pages, see [Playground Page — Sidebar](/pages/playground#sidebar).

```ts
import { useSidebar } from 'vitepress-openapi'
import spec from '../public/openapi.json' with { type: 'json' }

const sidebar = useSidebar({ spec })
```

## Configuration

Pass these options when creating the sidebar helper:

| Option | Default | Description |
|--------|---------|-------------|
| `spec` | — | OpenAPI document used to generate items |
| `linkPrefix` | `'/operations/'` | Prefix for operation links (`generateSidebarGroups`, `itemsByPaths`) |
| `tagLinkPrefix` | `'/tags/'` | Prefix for tag links (`itemsByTags`, tag groups) |
| `defaultTag` | `'Default'` | Tag assigned to untagged operations during parsing |
| `methodAliases` | `{}` | Map HTTP methods to custom badge labels |
| `sidebarItemTemplate` | built-in badge + title | HTML template for each operation item |
| `sidebarGroupTemplate` | path string | Template for group headings |

Operation titles resolve in this order: `x-sidebar-title` extension → `summary` → `` `[METHOD] path` ``.

## Methods

### `generateSidebarGroups(config?)`

Returns operation groups keyed by OpenAPI tags. Each group contains operation links.

| Config field | Default | Description |
|--------------|---------|-------------|
| `tags` | all operation tags | Limit which tag groups are generated |
| `linkPrefix` | `linkPrefix` from `useSidebar` | Prefix for operation links in this call |
| `sidebarItemTemplate` | global template | Override item template for this call |
| `sidebarGroupTemplate` | global template | Override group template for this call |

```ts
sidebar.generateSidebarGroups({
  linkPrefix: '/operations/',
})
```

### `generateSidebarGroup(config)`

Returns a single sidebar group filtered by tag(s). Useful for custom group labels or mixed navigation.

| Config field | Description |
|--------------|-------------|
| `tag` | One tag or an array of tags to include |
| `text` | Group label passed to `sidebarGroupTemplate` |
| `linkPrefix` | Prefix for operation links in this group |
| `sidebarItemTemplate` | Override item template for this group |
| `sidebarGroupTemplate` | Override group template for this group |

```ts
sidebar.generateSidebarGroup({
  tag: 'Artists',
  text: 'Rock Artists',
  linkPrefix: '#',
})
```

### `generateSidebarItem(method, path, linkPrefix?, template?)`

Returns a single operation sidebar item, or `null` if the operation does not exist.

### `itemsByTags(config?)`

Returns a flat list of tag links (not operations). Useful for tag index pages.

| Config field | Default | Description |
|--------------|---------|-------------|
| `tags` | all filtered tags | Tags to include |
| `linkPrefix` | `tagLinkPrefix` from `useSidebar` | Prefix for each tag link |

```ts
sidebar.itemsByTags({ linkPrefix: '/tags/' })
```

### `itemsByPaths(config?)`

Returns a nested sidebar tree grouped by URL path segments.

| Config field | Default | Description |
|--------------|---------|-------------|
| `startsWith` | `''` | Only include paths matching this prefix |
| `collapsible` | `true` | Whether nested groups are collapsible |
| `depth` | `6` | Maximum nesting depth |
| `linkPrefix` | `linkPrefix` from `useSidebar` | Prefix for leaf operation links |
| `sidebarItemTemplate` | global template | Override item template |
| `sidebarGroupTemplate` | global template | Override group template |

```ts
sidebar.itemsByPaths({
  depth: 4,
  linkPrefix: '/operations/',
})
```

## Custom templates

### Item template

`sidebarItemTemplate` receives `{ method, path, title }` and must return HTML for the sidebar entry. Use [`minifyHtml`](/utils/minifyHtml) to strip whitespace from generated markup.

```ts
import { minifyHtml, useSidebar } from 'vitepress-openapi'

const sidebar = useSidebar({
  spec,
  sidebarItemTemplate: ({ method, path, title }) => minifyHtml(`
    <span class="OASidebarItem">
      <span class="OASidebarItem-badge OAMethodBadge--${method.toLowerCase()}">${method.toUpperCase()}</span>
      <span class="OASidebarItem-text text">${title || path}</span>
    </span>
  `),
})
```

### Group template

`sidebarGroupTemplate` receives `{ path, depth }` where `path` is the group label you passed as `text`.

### OpenAPI extension

Set `x-sidebar-title` on an operation to override the title used in sidebar templates:

```json
{
  "get": {
    "operationId": "getAllArtists",
    "summary": "Get all artists",
    "x-sidebar-title": "List artists"
  }
}
```

## Playground usage

In playground pages, use hash links so items navigate by `operationId` (for example `linkPrefix: '/api/playground#'`).

See [Playground Page — Sidebar](/pages/playground#sidebar) for VitePress integration and live examples.
