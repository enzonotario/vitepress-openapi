# `usePlayground` Composable

The `usePlayground` composable provides functions to manage the Playground.

You can use the `usePlayground` composable to configure the Playground in your `.vitepress/theme/index.js` file, or in any `.md` page/file.

```ts
import { usePlayground } from 'vitepress-openapi/client'

export default {
    async enhanceApp({ app, router, siteData }) {
        const playground = usePlayground()
        
        // Set custom security scheme default values.
        playground.setSecuritySchemeDefaultValues({
            'http-basic': 'Custom Basic Auth',
            'http-bearer': 'Custom Bearer Token',
            // ...
        })
    }
}
```

## Security Scheme Default Values Configuration

| Function                         | Description                                      | Default Value                                                                                                                                 | Allowed Values                         |
|----------------------------------|--------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------|----------------------------------------|
| `setSecuritySchemeDefaultValues` | Sets custom default values for security schemes. | `{ 'http-basic': 'Basic Auth', 'http-bearer': 'Token', 'apiKey': null, 'openIdConnect': 'OpenID Connect', 'oauth2': 'OAuth2 Token', }` | Partial\<SecuritySchemeDefaultValues\> |
