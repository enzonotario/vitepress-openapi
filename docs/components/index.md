---
outline: 2
---

# Component API Reference

This section provides comprehensive documentation for the main components provided by vitepress-openapi.

## Available Components

- [`OASpec`](/components/oa-spec) - Renders a complete OpenAPI specification
- [`OAOperation`](/components/oa-operation) - Renders a specific API operation

## Quick Start

All components support both local and remote OpenAPI specifications:

::: code-group

```vue [Local Spec]
<script setup>
import spec from './openapi.json'
</script>

<OASpec :spec="spec" />
```

```vue [Remote Spec]
<OASpec spec-url="https://api.example.com/openapi.json" />
```

:::

## Global Configuration

If you have configured the OpenAPI specification globally using the `useOpenapi` composable in your `.vitepress/theme/index.js` file, you can use components without passing the spec:

```vue
<OASpec />
<OAOperation operation-id="getUserById" />
```
