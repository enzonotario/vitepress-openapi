---
aside: false
outline: false
---

# Branding Customization

You can customize or hide the default `Powered by VitePress OpenAPI` branding that appears at the bottom of `vitepress-openapi` components.

> [!TIP] Support the Project
> Please show your support for this project by **giving a star on [GitHub](https://github.com/enzonotario/vitepress-openapi)** and/or **sponsoring [Enzo Notario](https://github.com/sponsors/enzonotario)**, the maintainer of this project.

## Hiding the Branding

The simplest way to hide the branding is to use the `hide-branding` prop on the `OASpec` or `OAOperation` components:

<ExampleBlock browser-window-class="h-[70vh] max-h-[700px]">

<template #code>

```markdown
---
aside: false
outline: false
title: vitepress-openapi
---

<!--@include: ./parts/hide-branding-prop-example.md-->
```

</template>

<template #example>

<!--@include: ./parts/hide-branding-prop-example.md-->

</template>

</ExampleBlock>

## Custom Branding with Slots

For more control, you can replace the default branding with your own content using the `branding` slot:

<ExampleBlock browser-window-class="h-[70vh] max-h-[700px]">

<template #code>

```markdown
---
aside: false
outline: false
title: vitepress-openapi
---

<!--@include: ./parts/branding-slot-example.md-->
```

</template>

<template #example>

<!--@include: ./parts/branding-slot-example.md-->

</template>

</ExampleBlock>
