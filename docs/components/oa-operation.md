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

## Loading Indicator

When the `specUrl` prop is provided, the component will show a loading indicator while fetching the specification.
