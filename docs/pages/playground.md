---
outline: 2
---

# Playground Page

You can use the `OASpecPlayground` component to render a dedicated API explorer page: a navigation sidebar on the left and the currently selected operation Playground on the right.

The selected operation is synchronized with the page hash (`#operationId`), so links are bookmarkable and the active sidebar item stays in sync with the rendered Playground.

Use the [Sandbox](/sandbox/) with **Playground** to try the page live. Configure sidebar layouts from the **Playground Sidebar** panel.

## Example

<SandboxIframe auto-height :sandbox-data="{sandboxView: 'preview', previewComponent: 'Playground', playgroundSidebarItemsType: 'default'}" :iframe-zoom="0.6" />

## Markdown File

<ScopeConfigurationTabs>

<template #global>

If you have configured the OpenAPI Specification using the `useOpenapi` composable in your `.vitepress/theme/index.[js,ts]` file, you can use the `OASpecPlayground` component in any Markdown file.

```markdown
---
aside: false
outline: false
title: vitepress-openapi
---

<OASpecPlayground spec-url="/openapi.json" />
```

</template>

<template #in-markdown>

In your `.md` files, import the OpenAPI specification and pass it as `spec` prop to the `OASpecPlayground` component.

```markdown
---
aside: false
outline: false
title: vitepress-openapi
---

<script setup lang="ts">
import spec from '../public/openapi.json'
</script>

<OASpecPlayground :spec="spec" />
```

</template>

<template #spec-url>

In your `.md` files, pass the OpenAPI specification URL as `specUrl` prop to the `OASpecPlayground` component.

```markdown
---
aside: false
outline: false
title: vitepress-openapi
---

<OASpecPlayground spec-url="https://vitepress-openapi.vercel.app/openapi.json" />
```

</template>

</ScopeConfigurationTabs>

## Sidebar

`OASpecPlayground` needs operation navigation. By default it renders `OAPlaygroundSidebar`, which builds links from the OpenAPI spec and syncs the active item with `#operationId`.

`OAPlaygroundSidebar` resolves items in this order:

1. [`useTheme().getPlaygroundSidebar()`](/composables/useTheme#playground-sidebar-configuration)
2. `themeConfig.playgroundSidebar` from VitePress config
3. [`useSidebar().generateSidebarGroups({ linkPrefix: '#' })`](/composables/useSidebar)

### Configure the sidebar

Set a static sidebar in VitePress config:

```ts
import { defineConfig } from 'vitepress'

export default defineConfig({
  themeConfig: {
    playgroundSidebar: {
      '/api/': [
        { text: 'Introduction', link: '/api/introduction' },
        { text: 'Playground', link: '/api/playground' },
      ],
    },
  },
})
```

Or generate items at runtime with [`useSidebar`](/composables/useSidebar) and [`useTheme().setPlaygroundSidebar()`](/composables/useTheme#playground-sidebar-configuration):

```ts
import { useTheme, useSidebar } from 'vitepress-openapi/client'
import spec from '../public/openapi.json' with { type: 'json' }

const sidebar = useSidebar({ spec })

useTheme().setPlaygroundSidebar(
  sidebar.generateSidebarGroups({ linkPrefix: '#' }),
)
```

See [`useSidebar`](/composables/useSidebar) for generators, link prefixes, and custom templates.

### Custom groups and templates

Use `generateSidebarGroup` with a custom `sidebarItemTemplate` to rename groups or change how each operation is rendered:

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

useTheme().setPlaygroundSidebar([
  sidebar.generateSidebarGroup({
    tag: 'Artists',
    text: 'Rock Artists',
    linkPrefix: '#',
    sidebarItemTemplate,
  }),
])
```

<SandboxIframe auto-height :sandbox-data="{sandboxView: 'preview', previewComponent: 'Playground', playgroundSidebarItemsType: 'custom', playgroundSidebarUseCustomTemplate: true}" :iframe-zoom="0.6" />

### VitePress docs sidebar integration

On documentation sites you may prefer one VitePress sidebar instead of the playground’s internal navigation:

1. Inject operation groups into `themeConfig.sidebar` with hash links to your playground page.
2. Hide the internal playground sidebar on docs pages.

This site uses that pattern in `docs-sidebar-config.ts`:

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

For general VitePress sidebar setup with `useSidebar`, see [Sidebar Items](/sidebar/sidebar-items).

### Generation modes

The [Sandbox](/sandbox/) **Playground Sidebar** panel exposes the same generators as [`useSidebar`](/composables/useSidebar):

| Mode | `useSidebar` method | Description |
|------|---------------------|-------------|
| `default` | `generateSidebarGroups` | Operations grouped by OpenAPI tags |
| `itemsByTags` | `itemsByTags` | Flat list of tag links |
| `itemsByPaths` | `itemsByPaths` | Nested groups by path |
| `custom` | `generateSidebarGroup` | Manually composed groups |

### Live examples

- [/example/playground](/example/playground) — operations in the VitePress docs sidebar
- [/example/playground-custom-sidebar](/example/playground-custom-sidebar) — custom groups and item templates
