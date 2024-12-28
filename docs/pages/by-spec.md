---
outline: 2
---

<script setup>
import ScopeConfigurationTabs from '../.vitepress/theme/components/ScopeConfigurationTabs.vue'
</script>

# Page by Spec

You can use the `OASpec` component to render all operations in any Markdown file.

<ScopeConfigurationTabs>

<template #global>

If you have configured the OpenAPI Specification using the `useOpenapi` composable in your `.vitepress/theme/index.[js,ts]` file, you can just use the `OASpec` component to render all operations in any Markdown file.

```markdown
---
aside: false
outline: false
title: vitepress-openapi
---

<script setup lang="ts">
import { useData } from 'vitepress'

const { isDark } = useData()
</script>

<OASpec :isDark="isDark" />
```

</template>

<template #in-markdown>

In your `.md` files, import the OpenAPI specification and pass it as `spec` prop to the `OASpec` component.

```markdown
---
aside: false
outline: false
title: vitepress-openapi
---

<script setup lang="ts">
import { useData } from 'vitepress'
import spec from '../public/openapi.json'

const { isDark } = useData()
</script>

<OASpec :spec="spec" :isDark="isDark" />
```

</template>

</ScopeConfigurationTabs>

## Example

<SandboxIframe :sandbox-data="{sandboxView: 'preview', previewComponent: 'OASpec', showSidebar: false}" :iframe-zoom="0.6" class="h-[70vh] max-h-[700px]" />
