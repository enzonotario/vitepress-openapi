---
outline: 2
---

# OASpecPlayground Component

The `OASpecPlayground` component renders a dedicated Playground view for an OpenAPI spec: a navigation sidebar on the left and the currently selected operation Playground on the right.

It is designed for “API explorer” pages where users focus on trying operations one at a time instead of reading the full spec document.

By default, the selected operation is synchronized with the page hash (`#operationId`), so links are bookmarkable and the active sidebar item stays in sync with the rendered Playground.

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `spec` | `Object \| String` | `null` | OpenAPI specification object or JSON/YAML string |
| `specUrl` | `String` | `null` | URL to fetch the OpenAPI specification from |
| `hideBranding` | `Boolean` | `false` | Hide the `vitepress-openapi` footer branding |

## Events

| Event | Payload | Description |
|-------|---------|-------------|
| `update:spec` | `Object` | Emitted when the spec is loaded or updated |

## Slots

| Slot | Slot Props | Description |
|------|------------|-------------|
| `sidebar` | `{ openapi, sidebarOpen, openSidebar, closeSidebar, toggleSidebar }` | Replace the sidebar contents while keeping the built-in desktop/mobile shell |
| `playground` | `{ openapi, operationId }` | Replace the default main Playground panel |

## Basic Usage

```vue
<OASpecPlayground spec-url="/openapi.json" />
```

## Custom Layout Example

```vue
<OASpecPlayground spec-url="/openapi.json">
  <template #sidebar="{ openapi }">
    <OAPlaygroundSidebar :openapi="openapi" />
  </template>
  <template #playground="{ openapi, operationId }">
    <div class="OAContent has-sidebar vp-doc">
      <div class="OADoc w-full max-w-3xl mx-auto">
        <OAOperationPlayground
          :openapi="openapi"
          :operation-id="operationId"
        />
      </div>
    </div>
  </template>
</OASpecPlayground>
```

## Configure the Playground sidebar

You can configure the default Playground sidebar without using the `sidebar` slot. See [Playground Sidebar](/pages/playground-sidebar) for the full guide, including VitePress integration and custom item templates.

### Via VitePress `themeConfig`

`playgroundSidebar` accepts the same shapes as VitePress `sidebar`:

```ts
export default defineConfig({
  themeConfig: {
    playgroundSidebar: {
      '/example/': [
        {
          text: 'Introduction',
          link: '/example/introduction',
        },
        {
          text: 'Playground',
          link: '/example/playground',
        },
      ],
    },
  },
})
```

### Via composable

If you're rendering Playground components in a custom theme/app entry, you can set it with `useTheme` or `useOpenapi`:

```ts
useTheme({
  playground: {
    sidebar: [
      {
        text: 'Introduction',
        link: '/example/introduction',
      },
      {
        text: 'Playground',
        link: '/example/playground',
      },
    ],
  },
})
```

## Related Building Blocks

- `OAPlaygroundSidebar` renders the sidebar items for the current spec.
- `OAOperationPlayground` renders the Playground and code samples for a single operation.

You usually won’t need those directly unless you want to replace one side of the default `OASpecPlayground` layout.
