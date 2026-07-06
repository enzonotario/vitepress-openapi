---
outline: 2
---

# Playground Page

You can use the `OASpecPlayground` component to render a dedicated API explorer page: the currently selected operation Playground in the main content area, with operation navigation provided by your VitePress sidebar.

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

`OASpecPlayground` does not render its own navigation. Use the VitePress docs sidebar and generate operation links with [`useSidebar`](/composables/useSidebar). Point each item to your playground page with a hash suffix (`/playground#operationId`) so the active operation stays in sync.

### Configure the sidebar

Add operation groups to `themeConfig.sidebar`:

```ts
import { defineConfig } from 'vitepress'
import { useSidebar } from 'vitepress-openapi'
import spec from './public/openapi.json'

const sidebar = useSidebar({ spec })

export default defineConfig({
  themeConfig: {
    sidebar: [
      {
        text: 'Playground',
        items: sidebar.generateSidebarGroups({
          linkPrefix: '/api/playground#',
        }),
      },
    ],
  },
})
```

See [`useSidebar`](/composables/useSidebar) for generators, link prefixes, and custom templates. For general VitePress sidebar setup, see [Sidebar Items](/sidebar/sidebar-items).

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

export function createPlaygroundSidebarItems() {
  return [
    sidebar.generateSidebarGroup({
      tag: 'Artists',
      text: 'Rock Artists',
      linkPrefix: '/api/playground#',
      sidebarItemTemplate,
    }),
  ]
}
```

<SandboxIframe auto-height :sandbox-data="{sandboxView: 'preview', previewComponent: 'Playground', playgroundSidebarItemsType: 'custom', playgroundSidebarUseCustomTemplate: true}" :iframe-zoom="0.6" />

### Docs site example

This site wires playground navigation through `docs-sidebar-config.ts`:

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
