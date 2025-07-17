---
outline: 2
---

# OAOperation Component

The `OAOperation` component renders a specific API operation with all its details including parameters, request body, responses, and an interactive playground.

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `operationId` | `String` | **required** | Unique identifier for the operation to render |
| `spec` | `Object \| String` | `undefined` | OpenAPI specification object or JSON string |
| `specUrl` | `String` | `null` | URL to fetch OpenAPI specification from |
| `prefixHeadings` | `Boolean` | `false` | Add prefixes to component headings (useful for one-page views) |
| `hideBranding` | `Boolean` | `false` | Hide the vitepress-openapi branding footer |

### Deprecated Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `hideDefaultFooter` | `Boolean` | `undefined` | **Deprecated:** Use `hideBranding` instead |

## Events

| Event | Payload | Description |
|-------|---------|-------------|
| `update:spec` | `Object` | Emitted when the spec is loaded or updated |

## Slots

The `OAOperation` component supports the following slots for customization:

| Slot | Description |
|------|-------------|
| `header` | Custom header content above the operation |
| `tags` | Custom tags display |
| `path` | Custom path and method display |
| `description` | Custom description content |
| `security` | Custom security requirements display |
| `parameters` | Custom parameters section |
| `request-body` | Custom request body section |
| `responses` | Custom responses section |
| `playground` | Custom playground/try-it section |
| `code-samples` | Custom code samples section |
| `branding` | Custom branding footer |
| `footer` | Custom footer content |

## Usage Examples

### Basic Usage

<ScopeConfigurationTabs>

<template #global>

If you have configured the OpenAPI specification globally:

```vue
<OAOperation operation-id="getUserById" />
```

</template>

<template #in-markdown>

Using a local specification file:

```vue
<script setup>
import spec from '../public/openapi.json'
</script>

<OAOperation 
  operation-id="getUserById" 
  :spec="spec" 
/>
```

</template>

<template #spec-url>

Using a remote specification:

```vue
<OAOperation 
  operation-id="getUserById"
  spec-url="https://api.example.com/openapi.json" 
/>
```

</template>

</ScopeConfigurationTabs>

### Dynamic Routes

Perfect for creating individual operation pages with VitePress dynamic routes:

```vue
<script setup>
import { useRoute } from 'vitepress'

const route = useRoute()
const operationId = route.data.params.operationId
</script>

<OAOperation :operation-id="operationId" />
```

### One Page Documentation

Use `prefixHeadings` when combining multiple operations on a single page:

```vue
<OAOperation 
  operation-id="getUsers" 
  :prefix-headings="true" 
/>
<OAOperation 
  operation-id="createUser" 
  :prefix-headings="true" 
/>
```

### Custom Slots

Customize specific sections of the operation:

```vue
<OAOperation operation-id="getUserById">
  <template #header="{ operation }">
    <div class="custom-operation-header">
      <h1>{{ operation.summary }}</h1>
      <p class="operation-description">{{ operation.description }}</p>
    </div>
  </template>
  
  <template #playground="{ operation }">
    <div class="custom-playground">
      <p>Try this operation in our custom playground:</p>
    </div>
  </template>
</OAOperation>
```

## Finding Operation IDs

Operation IDs are defined in your OpenAPI specification. You can find them:

1. **In the OpenAPI spec**: Look for the `operationId` field in each operation
2. **Using developer tools**: Inspect the generated sidebar or use browser dev tools
3. **Programmatically**: Use the `usePaths` composable to list all operations

```js
import { usePaths } from 'vitepress-openapi'
import spec from './openapi.json'

const paths = usePaths({ spec })
const operations = paths.getPathsByVerbs()

operations.forEach(op => {
  console.log(`Operation ID: ${op.operationId}`)
  console.log(`Summary: ${op.summary}`)
  console.log(`Method: ${op.method}`)
  console.log(`Path: ${op.path}`)
})
```

## Spec vs SpecUrl

### When to use `spec`

Use the `spec` prop when:
- You have the OpenAPI specification as a local file
- You want to bundle the specification with your documentation
- You need to process or modify the specification

```vue
<script setup>
import spec from './api-spec.json'

const filteredSpec = {
  ...spec,
  paths: Object.fromEntries(
    Object.entries(spec.paths).filter(([path, methods]) => 
      Object.values(methods).some(op => op.tags?.includes('public'))
    )
  )
}
</script>

<OAOperation 
  operation-id="getPublicData"
  :spec="filteredSpec" 
/>
```

### When to use `specUrl`

Use the `specUrl` prop when:
- You want to fetch the specification from a remote URL
- The specification is dynamically generated
- You want to always show the latest version of the API

```vue
<OAOperation 
  operation-id="getUserById"
  spec-url="https://api.example.com/v1/openapi.json" 
/>
```

## Error Handling

If an operation ID is not found in the specification, the component will display an error message. Make sure:

1. The `operationId` exists in your OpenAPI specification
2. The specification is properly loaded
3. There are no typos in the operation ID

## Performance Tips

- **Use global configuration** when possible to avoid loading the same spec multiple times
- **Bundle local specs** for faster initial page loads
- **Use dynamic imports** for large specifications that are only needed on certain pages

```vue
<script setup>
const { spec } = await import('./large-api-spec.json')
</script>

<OAOperation 
  operation-id="complexOperation"
  :spec="spec" 
/>
```
