# Auth Playground

When an operation requires authentication and the playground auth value is empty (or still the default placeholder), `vitepress-openapi` can show a **Get token** button that opens a modal with a nested playground for your login/token endpoint.

## Modes

| Mode | Behavior |
| --- | --- |
| `tryIt` (default) | Nested playground with **Try it**. On a successful `2xx` response that includes a token field, the value is written to `localStorage` (same key as the Authorization input) and applied to the protected playground. |
| `samples` | Params/body still update the request, but the modal shows **code samples** instead of Try it + Response. No browser fetch, no auto-extract. The user runs curl (or another sample) and pastes the token into Authorization on the protected operation. |

Use `samples` when the auth endpoint cannot be called from the browser (for example, CORS blocks successful responses).

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
      // mode: 'tryIt', // default
      // description: 'Optional markdown shown when the operation has no description.',
    },
  },
})
```

| Option | Description | Default |
| --- | --- | --- |
| `enabled` | Force enable/disable. When omitted, auto-enables if there are `http`/`oauth2` schemes or configured `operationIds`, and at least one auth operation is found. | auto |
| `operationIds` | Explicit auth/login operation IDs to render in the modal (tabs if multiple). | auto-detect |
| `scheme` | Security scheme name to populate after login. | first `http`+`bearer`, then `security.defaultScheme` |
| `tokenResponseFields` | JSON response fields scanned for the token string (`tryIt` mode only). | `['access_token', 'token', 'accessToken']` |
| `mode` | `tryIt` or `samples`. | `tryIt` |
| `description` | Markdown shown above the nested playground when the operation has no `x-auth-playground-description` / `description`. | — |

## Modal description (markdown)

Instructions above the playground resolve in this order:

1. `x-auth-playground-description` on the auth operation
2. `operation.description`
3. `security.authPlayground.description` (theme)
4. Built-in i18n Dialog copy (`Auth playground description` / `Auth playground samples description`)

```yaml
paths:
  /token:
    post:
      operationId: Token_Token
      x-auth-playground-description: |
        El endpoint `/token` no expone CORS en respuestas exitosas.
        Copiá el curl, ejecutalo en tu terminal y pegá el `access_token`
        en **Authorization** de la operación protegida.
```

## Auto-detection

If `operationIds` is not set, vitepress-openapi looks for `POST` operations with empty/`[]` security whose `operationId` or path matches `/token|auth|login|oauth/i`.

## Theme helpers

| Function | Description |
| --- | --- |
| `getAuthPlaygroundConfig` | Returns the current auth playground config. |
| `setAuthPlaygroundConfig` | Updates auth playground options. |

See also [Security Configuration](/composables/useTheme#security-configuration) in `useTheme`.
