---
aside: false
outline: false
title: vitepress-theme-openapi
---

# Multiple specs

You can use multiple OpenAPI definitions on the same page by importing them and passing them as `spec` prop to the `OAOperation` component.

## Example

In this example, we are using two different specs to render the same operation.

```markdown
---
aside: false
outline: false
title: vitepress-theme-openapi
---

<script setup lang="ts">
import { useData } from 'vitepress'
import spec from '../public/openapi.json'
import specV2 from '../public/openapi-v2.json'

const { isDark } = useData()
</script>

::: info
Using [default spec](../public/openapi.json)
:::

<OAOperation operationId="buyMuseumTickets" :spec="spec" :isDark="isDark" />

---

::: info
Using [v2 spec](../public/openapi-v2.json)
:::

<OAOperation operationId="buyMuseumTickets" :spec="specV2" :isDark="isDark" />
```

<script setup lang="ts">
import { useData } from 'vitepress'
import spec from '../public/openapi.json'
import specV2 from '../public/openapi-v2.json'

const { isDark } = useData()
</script>

::: info
Using [default spec](../public/openapi.json)
:::

<OAOperation operationId="buyMuseumTickets" :spec="spec" :isDark="isDark" />

---

::: info
Using [v2 spec](../public/openapi-v2.json)
:::

<OAOperation operationId="buyMuseumTickets" :spec="specV2" :isDark="isDark" />
