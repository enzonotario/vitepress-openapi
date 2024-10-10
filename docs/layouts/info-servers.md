---
aside: false
outline: false
---

# Info and Servers

You can use the `OAInfo` and `OAServers` components to display the OpenAPI info and servers.

If you have configured the OpenAPI spec globally (in your `.vitepress/config.js`), you can use the components as follows:

```markdown
<OAInfo />

<OAServers />
```

Or you can import the OpenAPI spec and pass it as a prop directly to the components:

```markdown
<script setup lang="ts">
import spec from '../public/openapi.json'
</script>

<OAInfo :spec="spec" />

<OAServers :spec="spec" />
```
