---
aside: false
outline: false
---

# Custom Slots

The following slots are available on both [OAOperation](/components/oa-operation) and [OASpec](/components/oa-spec). They let you override the default operation layout with your own content. For component-specific props and events, see [OAOperation](/components/oa-operation) and [OASpec](/components/oa-spec).

## Available Slots and Props

Each slot receives scoped props you can use in your template. Below is the reference for every slot, its purpose, and its props.

### `header`

Custom header content above the operation.

| Prop | Type | Description |
|------|------|-------------|
| `operation` | `Object` | Parsed operation object from the OpenAPI spec |
| `method` | `String` | HTTP method (e.g. `get`, `post`) |
| `path` | `String` | Path pattern (e.g. `/users/{id}`) |
| `deprecated` | `Boolean` | Whether the operation is marked deprecated |

### `tags`

Custom tags display.

| Prop | Type | Description |
|------|------|-------------|
| `operation` | `Object` | Parsed operation object |
| `method` | `String` | HTTP method |
| `path` | `String` | Path pattern |
| `tags` | `Array` | List of tag names for the operation |

### `path`

Custom path and method display (e.g. endpoint URL and method badge).

| Prop | Type | Description |
|------|------|-------------|
| `operationId` | `String` | Unique operation identifier |
| `operation` | `Object` | Parsed operation object |
| `method` | `String` | HTTP method |
| `path` | `String` | Path pattern |
| `hideBaseUrl` | `Boolean` | Whether to hide the base URL |
| `deprecated` | `Boolean` | Whether the operation is deprecated |
| `servers` | `Array` | Available server URLs |
| `baseUrl` | `String` | Currently selected base URL for the playground |

### `description`

Custom description content (supports markdown).

| Prop | Type | Description |
|------|------|-------------|
| `operation` | `Object` | Parsed operation object |
| `method` | `String` | HTTP method |
| `path` | `String` | Path pattern |

### `security`

Custom security requirements display.

| Prop | Type | Description |
|------|------|-------------|
| `operation` | `Object` | Parsed operation object |
| `method` | `String` | HTTP method |
| `path` | `String` | Path pattern |
| `securityUi` | `Array` | Security schemes available for the operation |
| `selectedSchemeId` | `String` | Currently selected security scheme ID |

### `parameters`

Custom parameters section (path, query, header, cookie).

| Prop | Type | Description |
|------|------|-------------|
| `operationId` | `String` | Unique operation identifier |
| `parameters` | `Array` | Parsed parameters for the operation |

### `request-body`

Custom request body section.

| Prop | Type | Description |
|------|------|-------------|
| `operationId` | `String` | Unique operation identifier |
| `requestBody` | `Object` | Parsed request body schema/content |

### `responses`

Custom responses section.

| Prop | Type | Description |
|------|------|-------------|
| `operationId` | `String` | Unique operation identifier |
| `responses` | `Object` | Parsed responses (status codes and content) |

### `playground`

Custom playground / try-it section.

| Prop | Type | Description |
|------|------|-------------|
| `operationId` | `String` | Unique operation identifier |
| `path` | `String` | Path pattern |
| `method` | `String` | HTTP method |
| `parameters` | `Array` | Operation parameters |
| `requestBody` | `Object` | Request body schema |
| `securityUi` | `Array` | Security schemes for the playground |
| `servers` | `Array` | Available server URLs |

### `code-samples`

Custom code samples section.

| Prop | Type | Description |
|------|------|-------------|
| `operationId` | `String` | Unique operation identifier |
| `operation` | `Object` | Parsed operation object |
| `method` | `String` | HTTP method |
| `path` | `String` | Path pattern |
| `codeSamples` | `Array` | Pre-generated code samples (language + code) |

### `branding`

Custom branding footer (e.g. vitepress-openapi credit).

| Prop | Type | Description |
|------|------|-------------|
| `operationId` | `String` | Unique operation identifier |
| `operation` | `Object` | Parsed operation object |
| `method` | `String` | HTTP method |
| `path` | `String` | Path pattern |

### `footer`

Custom footer content below the operation.

| Prop | Type | Description |
|------|------|-------------|
| `operationId` | `String` | Unique operation identifier |
| `operation` | `Object` | Parsed operation object |
| `method` | `String` | HTTP method |
| `path` | `String` | Path pattern |

## Using slot props

Use Vue's scoped slot syntax to access these props. The same pattern works for both `OAOperation` and `OASpec`:

```vue
<OAOperation operation-id="getUserById">
  <template #header="{ operation, method, path, deprecated }">
    <div class="my-header">
      <span class="method">{{ method.toUpperCase() }}</span>
      <span class="path">{{ path }}</span>
      <span v-if="deprecated" class="badge">Deprecated</span>
    </div>
  </template>
</OAOperation>
```

With `OASpec`, the same slot customizes every operation:

```vue
<OASpec>
  <template #header="{ operation, method, path }">
    <h3>{{ method }} {{ path }}</h3>
  </template>
</OASpec>
```

## Full example

In the following example, we demonstrate how to use all available slots in the `OAOperation` component. Each slot is populated with a `SlotDebugger` component that displays the slot properties for debugging purposes.

<ExampleBlock :code-section-title="null" :example-section-title="null">

<template #code>

```markdown
---
aside: false
outline: false
title: vitepress-openapi
---

<!--@include: ./parts/custom-slots-example.md-->
```

</template>

<template #example>

<!--@include: ./parts/custom-slots-example.md-->

</template>

</ExampleBlock>
