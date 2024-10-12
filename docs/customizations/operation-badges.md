---
aside: false
outline: false
---

# Operation Badges

Each operation can have different badges that indicate its state, for example if it is deprecated, the operation id, etc. The available badges are:

- `deprecated`
- `operationId`

By default, only the `deprecated` badge is shown, as appropriate. You can customize the operation badges using the `useTheme().setOperationBadges()` method. **The order in which you set the badges is the order in which they will be displayed.**

For example:

```markdown
---
aside: false
outline: false
title: vitepress-openapi
---

<script setup lang="ts">
import { useData } from 'vitepress'
import { useTheme } from 'vitepress-openapi'
import spec from '../public/openapi.json'

const { isDark } = useData()

const themeConfig = useTheme()
themeConfig.setOperationBadges(['deprecated', 'operationId'])
</script>

<OAOperation :spec="spec" operationId="getAllData" :isDark="isDark" />
```

You can also customize the prefix of the badges by setting the `operation.badgePrefix.{badgeName}` key in the i18n messages. For example, in your `.vitepress/theme/index.ts`, before calling `theme.enhanceApp({ app })`, you can set the following:

```typescript
import { locales, theme, useTheme } from 'vitepress-openapi'
import DefaultTheme from 'vitepress/theme'
import 'vitepress-openapi/dist/style.css'

export default {
    extends: DefaultTheme,
    enhanceApp({ app }) {
        // Optionally, set the i18n configuration.
        const themeConfig = useTheme()
        themeConfig.setI18nConfig({
            messages: {
                en: {
                    ...locales.en,
                    'operation.badgePrefix.operationId': 'Operation ID: ',
                },
                es: {
                    ...locales.es,
                    'operation.badgePrefix.operationId': 'ID de operación: ',
                },
            },
        })

        // Use the theme.
        theme.enhanceApp({ app })
    },
}

```

## Example

---

<script setup lang="ts">
import { useData } from 'vitepress'
import { useTheme } from 'vitepress-openapi'
import spec from '../public/openapi.json'

const { isDark } = useData()

const themeConfig = useTheme()
themeConfig.setOperationBadges(['deprecated', 'operationId'])
</script>

<OAOperation :spec="spec" operationId="getAllData" :isDark="isDark" />
