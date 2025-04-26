---
outline: 2
---

# Introduction

You can use the `OAIntroduction` component to display the OpenAPI `info` and `servers` sections.

## Example

<SandboxIframe :sandbox-data="{sandboxView: 'preview', previewComponent: 'Introduction', showSidebar: false}" :iframe-zoom="0.6" class="h-[70vh] max-h-[700px]" />

## Markdown File

<ScopeConfigurationTabs>

<template #global>

If you have configured the OpenAPI Specification using the `useOpenapi` composable in your `.vitepress/theme/index.[js,ts]` file, you can just use the `OAIntroduction` component in any Markdown file.

```markdown
<OAIntroduction />
```

</template>

<template #in-markdown>

In your `.md` files, import the OpenAPI specification and pass it as `spec` prop to the `OAIntroduction` component.

```markdown
<script setup lang="ts">
import spec from '../public/openapi.json'
</script>

<OAIntroduction :spec="spec" />
```

</template>

</ScopeConfigurationTabs>

## Info and Servers

The `OAInfo` and `OAServers` components can be used separately to display the OpenAPI `info` and `servers` sections.

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
