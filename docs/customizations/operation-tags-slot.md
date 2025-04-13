---
aside: false
outline: false
---

# Operation `tags` slot

You can include the tags of an operation using `useTheme({ operation: { slots: [ ...DEFAULT_OPERATION_SLOTS, 'tags' ] })`.

<ExampleBlock browser-window-class="h-[70vh] max-h-[700px]">

<template #code>

```markdown
---
aside: false
outline: false
title: vitepress-openapi
---

<!--@include: ./parts/operation-tags-slot-example.md-->
```

</template>

<template #example>

<!--@include: ./parts/operation-tags-slot-example.md-->

</template>

</ExampleBlock>
