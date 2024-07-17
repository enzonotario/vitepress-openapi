# vitepress-theme-openapi

A VitePress theme for OpenAPI documentation. 

## Demo

- [DolarApi.com](https://dolarapi.com/)
- [ArgentinaDatos](https://argentinadatos.com/)
- [CriptoYa API](https://docs.criptoya.com/)

## Getting Started

### Prerequisites

- Node.js
- VitePress
- OpenAPI Specification

### Installation

On your VitePress project, install the theme:

```bash
npm install vitepress-theme-openapi

pnpm add vitepress-theme-openapi

yarn add vitepress-theme-openapi

bun install vitepress-theme-openapi
```

### Usage

#### OpenAPI Specification

Place your OpenAPI specification in the `public` directory. For example, `public/openapi.json`.

#### Pages

In your `.vitepress/theme/index.js`:

```js
import DefaultTheme from 'vitepress/theme'
import { theme, useOpenapi } from 'vitepress-theme-openapi'
import spec from '../../public/openapi.json' assert {type: 'json'}

import 'vitepress-theme-openapi/dist/style.css'

export default {
    ...DefaultTheme,
    async enhanceApp({ app }) {
        // Use the theme.
        app.use(theme)

        // Set the OpenAPI specification.
        const openapi = useOpenapi()
        openapi.setSpec(spec)
    }
}
```

Then you can create a `operations` directory with following structure:

```
/docs
├── operations
│   ├── [operationId].md
│   └── [operationId].paths.js
```

In the `[operationId].md` file:

```md
---
aside: false
outline: false
title: vitepress-theme-openapi
---

<script setup lang="ts">
import { useRoute, useData } from 'vitepress'

const route = useRoute()

const { isDark } = useData()

const operationId = route.data.params.operationId
</script>

<OAOperation :operationId="operationId" :isDark="isDark" />
```

In the `[operationId].paths.js` file:

```js
import { useOpenapi } from 'vitepress-theme-openapi'

export default {
  paths() {
    const openapi = useOpenapi()

    if (!openapi?.json?.paths) {
      return []
    }

    return Object.keys(openapi.json.paths)
      .map((path) => {
        const { operationId } = openapi.json.paths[path].get
        return {
          params: {
            operationId,
            pageTitle: `${openapi.getOperation(operationId).summary} - vitepress-theme-openapi`,
          },
        }
      })
  },
}
```

#### Sidebar

To auto-generate sidebar items, you can use the `useSidebar` function. In your `.vitepress/config.js`:

```js
import { useSidebar, useOpenapi } from 'vitepress-theme-openapi'
import spec from '../public/openapi.json' assert { type: 'json' }

const openapi = useOpenapi()
openapi.setSpec(spec)
const sidebar = useSidebar()

module.exports = {
  // ...
  themeConfig: {
    sidebar: [
      ...sidebar.generateSidebarGroups(),
    ],
  },
}
```

## License

[MIT License](./LICENSE) © 2023-present [Enzo Notario](https://github.com/enzonotario).

