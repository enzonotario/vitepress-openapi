---
aside: false
outline: false
---

# All Operations Layout

You can use the `OASpec` component to render all operations in a single page layout.

```markdown
---
aside: false
outline: false
title: vitepress-theme-openapi
---

<script setup lang="ts">
import { useData } from 'vitepress'

const { isDark } = useData()
</script>

<OASpec :isDark="isDark" />
```

