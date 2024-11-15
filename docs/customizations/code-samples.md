---
aside: false
outline: false
---

# Code Samples

Code Samples allow you to showcase API request examples in multiple programming languages.
This feature helps API consumers understand how to integrate with your API using their preferred language.

You can customize:

- Which languages to display (`langs`)
- Available languages for selection (`availableLangs`)
- How code is generated for each language (`generator`)


<ExampleBlock>

<template #code>

## Custom Languages

For example, you can add [Bru Markup Language](https://docs.usebruno.com/bru-lang/overview) to the list of languages to show and available languages to select from and a generator to convert the request object to Bru code.

```markdown
---
aside: false
outline: false
title: vitepress-openapi
---

<!--@include: ./parts/code-samples-example.md-->
```

</template>

<template #example>

<!--@include: ./parts/code-samples-example.md-->

</template>

</ExampleBlock>
