---
aside: false
outline: false
title: vitepress-openapi
---

# Multiple specs

You can use multiple OpenAPI specs on the same page by importing them and passing them as `spec` prop to the `OAOperation` component.

## Example

In this example, we are using two different specs to render the same operation.

```markdown
---
aside: false
outline: false
title: vitepress-openapi
---

<script setup lang="ts">
import defaultSpec from './openapi.json'
import schemasSpec from './openapi-schemas.json'
</script>

::: info
Using [default spec](../public/openapi.json)
:::

<OAOperation operationId="getAllArtists" />

---

::: info
Using [schemas spec](../public/openapi-schemas.json)
:::

<OAOperation operationId="getCircularReference" :spec="schemasSpec" />
```

<script setup lang="ts">
import defaultSpec from '../public/openapi.json'
import schemasSpec from '../public/openapi-schemas.json'
</script>

::: info
Using [default spec](../public/openapi.json)
:::

<OAOperation operationId="getAllArtists" />

---

::: info
Using [schemas spec](../public/openapi-schemas.json)
:::

<OAOperation operationId="getCircularReference" :spec="schemasSpec" />
