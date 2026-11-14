---
outline: 2
---

# Vue Apps (without VitePress)

The components also work in any Vue 3 app, without VitePress, through the `v-openapi` package. It has the same components and composables as `vitepress-openapi`.

See it working in the <a href="/standalone/" target="_self">Vue demo</a>, a plain Vue app built with this package.

## Installation

::: code-group

```sh [npm]
npm install v-openapi
```

```sh [yarn]
yarn add v-openapi
```

```sh [pnpm]
pnpm add v-openapi
```

```sh [bun]
bun add v-openapi
```

:::

## Setup

Install the `VitepressOpenapi` plugin with your OpenAPI document, and import the two stylesheets:

```ts
import { VitepressOpenapi } from 'v-openapi'
import { createApp } from 'vue'
import App from './App.vue'
import spec from './openapi.json'

// Document styles first, then the component styles (same order as in VitePress).
import 'v-openapi/standalone.css'
import 'v-openapi/style.css'

createApp(App)
  .use(VitepressOpenapi, { spec })
  .mount('#app')
```

Then use the components anywhere in your app:

```vue
<template>
  <OAOperation operation-id="getAllArtists" />
</template>
```

`OASpec`, `OAIntroduction`, `OAInfo` and `OAServers` work the same way. Like in VitePress, each one also accepts its own `spec` or `spec-url`.

### Plugin options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `spec` | `Object \| String` | — | OpenAPI document used by the components without their own `spec`. |
| `config` | `Object` | — | Theme configuration, the same as [`useTheme`](/composables/useTheme). |
| `copyCode` | `Boolean` | `true` | Handle the copy buttons of code blocks. |
| `vpDoc` | `Boolean` | `true` | Wrap the components in a `.vp-doc` element, which `standalone.css` styles. |

## Styles

- `v-openapi/style.css`: the component styles, the same file that VitePress sites use.
- `v-openapi/standalone.css`: the document styles that VitePress' default theme provides (colors, typography, code blocks and code groups), built from VitePress' own styles. Do not load it inside VitePress.

To match your design, override any `--vp-*` variable:

```css
:root {
  --vp-c-brand-1: #e11d48;
}
```

## Sidebar

`useSidebar` gives you the sidebar data. The UI and the routing stay in your app:

```ts
import { useSidebar } from 'v-openapi'

const groups = useSidebar({ spec, linkPrefix: '/operations/' }).generateSidebarGroups()
// [{ text: 'Artists', items: [{ text: '...', link: '/operations/getAllArtists' }] }, ...]
```

Item texts include the HTML of the method badge, so render them with `v-html`.

## Operation links

Links to operations in descriptions point to `/operations/:operationId`. Change them to match your routes with `transformHref`:

```ts
app.use(VitepressOpenapi, {
  spec,
  config: {
    markdown: {
      operationLink: {
        transformHref: href => `/docs${href}`,
      },
    },
  },
})
```

## Dark mode

`useTheme().isDark` follows the system color scheme, and toggles the `dark` class on `<html>`. Write it to build a light/dark switch; the choice is kept in `localStorage`:

```ts
import { useTheme } from 'v-openapi'

const isDark = useTheme().isDark

function toggle() {
  isDark.value = !isDark.value
}
```
