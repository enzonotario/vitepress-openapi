---
outline: 2
---

# Page by Spec

You can use the `OASpec` component to render all operations in any Markdown file.

## Example

<SandboxIframe :sandbox-data="{sandboxView: 'preview', previewComponent: 'PagesBySpec', showSidebar: false}" :iframe-zoom="0.6" class="h-[70vh] max-h-[700px]" />

## Markdown File

<ScopeConfigurationTabs>

<template #global>

If you have configured the OpenAPI Specification using the `useOpenapi` composable in your `.vitepress/theme/index.[js,ts]` file, you can just use the `OASpec` component to render all operations in any Markdown file.

```markdown
---
aside: false
outline: false
title: vitepress-openapi
---

<OASpec />
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
import spec from '../public/openapi.json'
</script>

<OASpec :spec="spec" />
```

</template>

</ScopeConfigurationTabs>

## Large Specs

`OASpec` renders every operation on one page. The full HTML is generated at build time, so search engines see all of it, and on the client each operation only becomes interactive when it gets close to the viewport.

For specs with hundreds of operations, the page itself gets heavy (HTML size and memory). Two options:

- **One page per operation or per tag** (recommended): see [Page by Operation](/pages/by-operation) and [Page by Tag](/pages/by-tag). Each page only renders what it needs.
- **`lazy-rendering`**: render only the first operation, and the rest when the browser is idle. The other operations are not in the build HTML, so prefer separate pages if you care about SEO.

```markdown
<OASpec :lazy-rendering="true" />
```

