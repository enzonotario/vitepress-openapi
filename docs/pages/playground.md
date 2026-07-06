---
outline: 2
---

# Playground Page

You can use the `OASpecPlayground` component to render a dedicated API explorer page: a navigation sidebar on the left and the currently selected operation Playground on the right.

The selected operation is synchronized with the page hash (`#operationId`), so links are bookmarkable and the active sidebar item stays in sync with the rendered Playground.

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

`OASpecPlayground` ships with operation navigation. See [Playground Sidebar](/pages/playground-sidebar) for built-in sidebar configuration, VitePress integration, custom item templates, and live Sandbox examples.

Live examples:

- [/example/playground](/example/playground)
- [/example/playground-custom-sidebar](/example/playground-custom-sidebar)
