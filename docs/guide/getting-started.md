# Getting Started

This guide will walk you through the steps to set up and use the `vitepress-theme-openapi` in your VitePress project.

## Demo

- [DolarApi.com](https://dolarapi.com/)
- [ArgentinaDatos](https://argentinadatos.com/)
- [CriptoYa API](https://docs.criptoya.com/)

## Prerequisites

Before you begin, make sure you have the following installed:

- Node.js
- VitePress
- OpenAPI Specification (Version 3)

## Installation

To install the theme in your VitePress project, run one of the following commands depending on your preferred package
manager:

```bash
npm install vitepress-theme-openapi

pnpm add vitepress-theme-openapi

yarn add vitepress-theme-openapi

bun install vitepress-theme-openapi
```

## Usage

### OpenAPI Specification

Place your OpenAPI specification in the public directory. For example, public/openapi.json.

### Theme Configuration

In your .vitepress/theme/index.js, import the theme and configure it as follows:

```ts
import DefaultTheme from 'vitepress/theme'
import {theme, useOpenapi, useTheme} from 'vitepress-theme-openapi'
import type {Theme} from 'vitepress'
import spec from '../../public/openapi.json' assert {type: 'json'}

import 'vitepress-theme-openapi/dist/style.css'

export default {
    ...DefaultTheme,
    async enhanceApp({app, router, siteData}) {
        // Set the OpenAPI specification
        const openapi = useOpenapi()
        openapi.setSpec(spec)

        // Optionally, configure the theme.
        const themeConfig = useTheme()
        themeConfig.setLocale('en') // en or es

        // Use the theme
        theme.enhanceApp({app})
    }
} satisfies Theme
```

### Creating Operation Pages

To document your API operations, create an operations directory inside docs with the following structure:

```
/docs
├── operations
│   ├── [operationId].md
│   └── [operationId].paths.js
```

Example of `[operationId].md`:

```markdown
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

Example of `[operationId].paths.js`:

```ts
import {useOpenapi} from 'vitepress-theme-openapi'

export default {
    paths() {
        const openapi = useOpenapi()

        if (!openapi?.json?.paths) {
            return []
        }

        return Object.keys(openapi.json.paths)
            .map((path) => {
                const {operationId} = openapi.json.paths[path].get
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

### Auto-Generating the Sidebar

To automatically generate sidebar items, you can use the useSidebar function. Configure your .vitepress/config.js as
follows:

```ts
import {useSidebar, useOpenapi} from 'vitepress-theme-openapi'
import spec from '../public/openapi.json' assert {type: 'json'}

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
