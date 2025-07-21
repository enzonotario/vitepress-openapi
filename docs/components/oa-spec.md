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
| `groupByTags` | `Boolean` | `null` | Group operations by tags |
| `tags` | `Array` | `undefined` | Filter operations to only show specific tags |
| `hideBranding` | `Boolean` | `false` | Hide the `vitepress-openapi` branding footer |
| `hidePathsSummary` | `Boolean` | `undefined` | Hide the paths summary when grouping by tags |

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

## Loading indicator

When the `specUrl` prop is provided, the component will show a loading indicator while fetching the specification.
