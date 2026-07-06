---
outline: 2
---

# Playground Sidebar

`OASpecPlayground` needs a navigation sidebar so users can switch between operations. You can use the built-in `OAPlaygroundSidebar`, configure it through theme options, or move playground navigation into the VitePress docs sidebar.

## Built-in sidebar

By default, `OASpecPlayground` renders `OAPlaygroundSidebar` on the left. It builds operation links from the current OpenAPI spec and keeps the active item in sync with the page hash (`#operationId`).

```vue
<OASpecPlayground spec-url="/openapi.json" />
```

`OAPlaygroundSidebar` resolves sidebar items in this order:

1. `useTheme().getPlaygroundSidebar()` / `setPlaygroundSidebar()`
2. `themeConfig.playgroundSidebar` from VitePress config
3. `useSidebar({ spec }).generateSidebarGroups({ linkPrefix: '#' })`

### Via `themeConfig`

`playgroundSidebar` accepts the same shapes as VitePress `sidebar`:

```ts
import { defineConfig } from 'vitepress'

export default defineConfig({
  themeConfig: {
    playgroundSidebar: {
      '/api/': [
        {
          text: 'Introduction',
          link: '/api/introduction',
        },
        {
          text: 'Playground',
          link: '/api/playground',
        },
      ],
    },
  },
})
```

### Via composable

```ts
import { useTheme, useSidebar } from 'vitepress-openapi/client'
import spec from '../public/openapi.json' with { type: 'json' }

const sidebar = useSidebar({ spec })
const theme = useTheme()

theme.setPlaygroundSidebar(
  sidebar.generateSidebarGroups({
    linkPrefix: '#',
  }),
)
```

### Custom item template

Pass `sidebarItemTemplate` when generating sidebar items to customize how each operation is rendered (for example, title on the left and method badge on the right):

```ts
import { minifyHtml, useSidebar } from 'vitepress-openapi'
import spec from '../public/openapi.json' with { type: 'json' }

const sidebar = useSidebar({ spec })

function sidebarItemTemplate({ method, path, title }) {
  const operation = spec.paths[path]?.[method]
  const displayText = title || operation?.summary || path

  return minifyHtml(`
    <span class="OASidebarItem" style="display: grid; grid-template-columns: 1fr auto;">
      <span class="text">${displayText}</span>
      <span class="OASidebarItem-badge OAMethodBadge--${method.toLowerCase()}">${method.toUpperCase()}</span>
    </span>
  `)
}

theme.setPlaygroundSidebar([
  sidebar.generateSidebarGroup({
    tag: 'Artists',
    text: 'Rock Artists',
    linkPrefix: '#',
    sidebarItemTemplate,
  }),
  sidebar.generateSidebarGroup({
    tag: 'Authentication',
    text: 'Auth',
    linkPrefix: '#',
    sidebarItemTemplate,
  }),
])
```

## Example

Custom groups and item templates:

<SandboxIframe auto-height :sandbox-data="{sandboxView: 'preview', previewComponent: 'Playground', playgroundSidebarItemsType: 'custom', playgroundSidebarUseCustomTemplate: true}" :iframe-zoom="0.6" />

## VitePress sidebar integration

On documentation sites, you may prefer a single VitePress sidebar instead of the playground’s internal navigation.

1. Inject operation groups into `themeConfig.sidebar` with hash links to your playground page.
2. Hide the internal playground sidebar on docs pages.

This site uses that pattern in `docs-sidebar-config.ts`: playground operations appear under **Playground Example** and **Playground Custom Sidebar Example**, while `OASpecPlayground` only renders the main panel.

```ts
import { useSidebar } from 'vitepress-openapi'
import spec from './public/openapi.json'

const sidebar = useSidebar({ spec })

export function createPlaygroundExampleSidebarItems() {
  return sidebar.generateSidebarGroups({
    linkPrefix: '/example/playground#',
  })
}
```

Add the generated items to your docs sidebar:

```ts
themeConfig: {
  sidebar: [
    {
      text: 'Playground Example',
      collapsed: true,
      items: createPlaygroundExampleSidebarItems(),
    },
  ],
}
```

Hide the internal playground sidebar when the page is rendered inside VitePress docs:

```css
.VPContent .VPDoc:has(.OASpecPlayground) .OASpecPlayground .OASidebar,
.VPContent .VPDoc:has(.OASpecPlayground) .OASpecPlayground .OAPlaygroundLocalNav,
.VPContent .VPDoc:has(.OASpecPlayground) .OASpecPlayground .VPBackdrop {
  display: none;
}

.VPContent .VPDoc:has(.OASpecPlayground) .OASpecPlayground .OAContent.has-sidebar {
  margin-top: 0;
  padding-left: 0;
  padding-right: 0;
}
```

## Sidebar generation modes

`useSidebar` provides the same generators used by the [Sandbox](/sandbox/) **Playground Sidebar** settings:

| Mode | Description |
|------|-------------|
| `default` | Operations grouped by OpenAPI tags (`generateSidebarGroups`) |
| `itemsByTags` | Flat list of tag groups (`itemsByTags`) |
| `itemsByPaths` | Nested groups by path (`itemsByPaths`) |
| `custom` | Manually composed groups (`generateSidebarGroup`) |

## Live examples

- [/example/playground](/example/playground) — playground page with operations in the VitePress docs sidebar
- [/example/playground-custom-sidebar](/example/playground-custom-sidebar) — custom groups and item templates

## Related

- [Playground Page](/pages/playground)
- [`OASpecPlayground` component](/components/oa-spec-playground)
- [Sidebar Items](/sidebar/sidebar-items)
