---
aside: false
outline: false
---

# Custom Slots

The `OAOperation` component provides several slots for customizing the operation layout. These slots allow you to override the default components with your own custom content.

## Available Slots

The following slots are available for customization:

- `header`
- `tags`
- `path`
- `description`
- `security`
- `parameters`
- `request-body`
- `responses`
- `playground`
- `code-samples`
- `branding`
- `footer`

In the following example, we demonstrate how to use all available slots in the `OAOperation` component. Each slot is populated with a `SlotDebugger` component that displays the slot properties for debugging purposes.

<ExampleBlock :code-section-title="null" :example-section-title="null">

<template #code>

```markdown
---
aside: false
outline: false
title: vitepress-openapi
---

<!--@include: ./parts/custom-slots-example.md-->
```

</template>

<template #example>

<!--@include: ./parts/custom-slots-example.md-->

</template>

</ExampleBlock>
