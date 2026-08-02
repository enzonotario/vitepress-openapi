# Auth Playground

When an operation requires authentication and the playground auth value is empty (or still the default placeholder), `vitepress-openapi` can show a **Get token** button that opens a modal with a nested playground for your login/token endpoint.

After a successful `2xx` response that includes a token field, the value is written to `localStorage` (same key as the Authorization input) and applied to the protected playground.

## Configuration

```ts
import { useTheme } from 'vitepress-openapi/client'

useTheme({
  security: {
    authPlayground: {
      // Optional. Auto-enabled when http/oauth2 schemes exist or operationIds are set.
      // enabled: true,
      operationIds: ['Token_Token'],
      scheme: 'bearerAuth',
      tokenResponseFields: ['access_token'],
    },
  },
})
```

| Option | Description | Default |
| --- | --- | --- |
| `enabled` | Force enable/disable. When omitted, auto-enables if there are `http`/`oauth2` schemes or configured `operationIds`, and at least one auth operation is found. | auto |
| `operationIds` | Explicit auth/login operation IDs to render in the modal (tabs if multiple). | auto-detect |
| `scheme` | Security scheme name to populate after login. | first `http`+`bearer`, then `security.defaultScheme` |
| `tokenResponseFields` | JSON response fields scanned for the token string. | `['access_token', 'token', 'accessToken']` |

## Auto-detection

If `operationIds` is not set, vitepress-openapi looks for `POST` operations with empty/`[]` security whose `operationId` or path matches `/token|auth|login|oauth/i`.

## Theme helpers

| Function | Description |
| --- | --- |
| `getAuthPlaygroundConfig` | Returns the current auth playground config. |
| `setAuthPlaygroundConfig` | Updates auth playground options. |

See also [Security Configuration](/composables/useTheme#security-configuration) in `useTheme`.
