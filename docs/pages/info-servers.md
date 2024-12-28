---
outline: 2
---

<script setup>
import ScopeConfigurationTabs from '../.vitepress/theme/components/ScopeConfigurationTabs.vue'
</script>

# Info and Servers

You can use the `OAInfo` and `OAServers` components to display the OpenAPI info and servers.

<ScopeConfigurationTabs>

<template #global>

If you have configured the OpenAPI Specification using the `useOpenapi` composable in your `.vitepress/theme/index.[js,ts]` file, you can just use the `OAInfo` and `OAServers` components in any Markdown file.

```markdown
<OAInfo />

<OAServers />
```

</template>

<template #in-markdown>

In your `.md` files, import the OpenAPI specification and pass it as `spec` prop to the `OAInfo` and `OAServers` components.

```markdown
<script setup lang="ts">
import spec from '../public/openapi.json'
</script>

<OAInfo :spec="spec" />

<OAServers :spec="spec" />
```

</template>

</ScopeConfigurationTabs>
