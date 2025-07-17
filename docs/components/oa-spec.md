---
outline: 2
---

# OASpec Component

The `OASpec` component renders a complete OpenAPI specification, including all operations, schemas, and documentation.

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `spec` | `Object \| String` | `null` | OpenAPI specification object or JSON string |
| `specUrl` | `String` | `null` | URL to fetch OpenAPI specification from |
| `hideInfo` | `Boolean` | `false` | Hide the info section (title, description, version) |
| `hideServers` | `Boolean` | `false` | Hide the servers section |
| `groupByTags` | `Boolean` | `null` | Group operations by tags (uses global config if null) |
| `tags` | `Array` | `undefined` | Filter operations to only show specific tags |
| `hideBranding` | `Boolean` | `false` | Hide the vitepress-openapi branding footer |
| `hidePathsSummary` | `Boolean` | `undefined` | Hide the paths summary when grouping by tags |

### Deprecated Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `hideDefaultFooter` | `Boolean` | `undefined` | **Deprecated:** Use `hideBranding` instead |

## Events

| Event | Payload | Description |
|-------|---------|-------------|
| `update:spec` | `Object` | Emitted when the spec is loaded or updated |

## Slots

The `OASpec` component supports all operation slots for customizing the display of individual operations:

| Slot | Description |
|------|-------------|
| `header` | Custom header content for operations |
| `tags` | Custom tags display |
| `path` | Custom path display |
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
<OASpec />
```

</template>

<template #in-markdown>

Using a local specification file:

```vue
<script setup>
import spec from '../public/openapi.json'
</script>

<OASpec :spec="spec" />
```

</template>

<template #spec-url>

Using a remote specification:

```vue
<OASpec spec-url="https://api.example.com/openapi.json" />
```

</template>

</ScopeConfigurationTabs>

### Filtering by Tags

Show only operations with specific tags:

```vue
<OASpec :tags="['users', 'authentication']" />
```

### Customizing Display

Hide certain sections and group by tags:

```vue
<OASpec 
  :hide-info="true"
  :hide-servers="true" 
  :group-by-tags="true"
  :hide-branding="true"
/>
```

### Custom Slots

Customize specific sections of operations:

```vue
<OASpec>
  <template #header="{ operation }">
    <div class="custom-header">
      <h2>{{ operation.summary }}</h2>
      <span class="custom-badge">{{ operation.method }}</span>
    </div>
  </template>
  
  <template #branding>
    <div class="custom-footer">
      Powered by My API Documentation
    </div>
  </template>
</OASpec>
```

## Spec vs SpecUrl

### When to use `spec`

Use the `spec` prop when:
- You have the OpenAPI specification as a local file
- You want to bundle the specification with your documentation
- You need to modify or process the specification before rendering

```vue
<script setup>
import spec from './api-spec.json'

const modifiedSpec = {
  ...spec,
  info: {
    ...spec.info,
    title: 'My Custom API Title'
  }
}
</script>

<OASpec :spec="modifiedSpec" />
```

### When to use `specUrl`

Use the `specUrl` prop when:
- You want to fetch the specification from a remote URL
- The specification is dynamically generated
- You want to always show the latest version of the API

```vue
<OASpec spec-url="https://api.example.com/v1/openapi.json" />
```

### Performance Considerations

- **Local specs** (`spec` prop): Faster initial load, bundled with your site
- **Remote specs** (`specUrl` prop): Always up-to-date, but requires network request

## Integration with VitePress

The `OASpec` component integrates seamlessly with VitePress features:

### Sidebar Generation

Use with `useSidebar` to automatically generate navigation:

```js
import { useSidebar } from 'vitepress-openapi'
import spec from '../public/openapi.json'

const sidebar = useSidebar({ spec })

export default {
  themeConfig: {
    sidebar: sidebar.generateSidebarGroups()
  }
}
```

### Search Integration

Operations rendered by `OASpec` are automatically indexed by VitePress search when using static content.
