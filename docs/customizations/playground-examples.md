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

## Examples behavior

You can control how examples are used in the Playground. Both `behavior` and `playgroundExampleBehavior` accept:

| Value | Description |
|-------|-------------|
| `value` | Example is used as both the placeholder and the initial value (default). |
| `placeholder` | Example is shown only as placeholder text; inputs start empty. |
| `ignore` | Example is not used for placeholder or initial value. |

### `behavior`

Controls how the standard `example` / `examples` fields are applied. Defaults to `value`.

### `playgroundExampleBehavior`

Controls how `x-playground-example` is applied. Defaults to `value`.

This allows you to configure each source independently. For example, to show standard examples only as placeholders while still pre-filling inputs with `x-playground-example` values:

```ts
useTheme({
  playground: {
    examples: {
      behavior: 'placeholder',
      playgroundExampleBehavior: 'value',
    },
  },
})
```

This applies to parameters, request body, and security scheme inputs.

## Example

You can see a live example of this in action in the [Playground Examples API](/tests/playground-examples).
