---
outline: 2
---

# OASpecPlayground Component

The `OASpecPlayground` component renders a dedicated Playground view for an OpenAPI spec. Operation navigation comes from your VitePress sidebar; the component renders the currently selected operation Playground in the main content area.

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
| `playground` | `{ openapi, operationId }` | Replace the default main Playground panel |

## Basic Usage

```vue
<OASpecPlayground spec-url="/openapi.json" />
```

Pair it with a VitePress sidebar generated from your spec. See [Playground Page — Sidebar](/pages/playground#sidebar).

## Custom Layout Example

```vue
<OASpecPlayground spec-url="/openapi.json">
  <template #playground="{ openapi, operationId }">
    <div class="w-full max-w-3xl mx-auto">
      <OAOperationPlayground
        :openapi="openapi"
        :operation-id="operationId"
      />
    </div>
  </template>
</OASpecPlayground>
```

## Related Building Blocks

- [`useSidebar`](/composables/useSidebar) generates VitePress sidebar items for operation navigation.
- `OAOperationPlayground` renders the Playground and code samples for a single operation.

You usually won’t need `OAOperationPlayground` directly unless you replace the default `OASpecPlayground` layout with the `playground` slot.
