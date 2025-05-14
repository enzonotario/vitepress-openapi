---
title: Playground Examples API
---

<script setup>
import { useOpenapi } from 'vitepress-openapi/client'

useOpenapi({
  spec: '/openapi-playground-examples.json',
})
</script>

# Playground Examples

When using the Playground, parameter examples are automatically populated from the OpenAPI specification. By default, the Playground uses the `example` or `examples` properties defined in the OpenAPI spec.

## Playground-specific Examples

If you want to specify examples specifically for the Playground that are different from the examples in the OpenAPI spec, you can use the `x-playground-example` extension:

```json
{
  "name": "id",
  "in": "query",
  "required": false,
  "description": "Filter by ID",
  "x-playground-example": "playground-specific-value",
  "schema": {
    "type": "string",
    "example": "general-example-value"
  }
}
```

The `x-playground-example` extension can be used at both the parameter level and the schema level:

```json
{
  "name": "id",
  "in": "query",
  "required": false,
  "description": "Filter by ID",
  "schema": {
    "type": "string",
    "example": "general-example-value",
    "x-playground-example": "schema-level-playground-example"
  }
}
```

The Playground will prioritize examples in the following order:

1. `x-playground-example` at the parameter level
2. `x-playground-example` at the schema level
3. `example` at the parameter level
4. First item in `examples` array at the parameter level
5. `example` at the schema level
6. First item in `examples` array at the schema level

## Example

You can see a live example of this in action in the [Playground Examples API](/tests/playground-examples).
