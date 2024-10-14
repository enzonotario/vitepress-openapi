# Getting Started

This guide will walk you through the steps to set up and use the `vitepress-openapi` in your VitePress project.

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
npm install vitepress-openapi

pnpm add vitepress-openapi

yarn add vitepress-openapi

bun install vitepress-openapi
```

## Usage

### OpenAPI Specification

Place your OpenAPI specification in the public directory. For example, `public/openapi.json`.

### Theme Configuration

In your `.vitepress/theme/index.js`, import the theme and configure it as follows:

```ts
import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'

import { theme, useOpenapi } from 'vitepress-openapi'
import 'vitepress-openapi/dist/style.css'

import spec from '../../public/openapi.json' assert { type: 'json' }

export default {
    extends: DefaultTheme,
    async enhanceApp({app, router, siteData}) {
        // Set the OpenAPI specification.
        const openapi = useOpenapi({ spec })
        app.provide('openapi', openapi)

        // Use the theme.
        theme.enhanceApp({ app })
    }
} satisfies Theme
```

### Layouts

You can render the OpenAPI specification in different layouts:

- [One operation per page](/layouts/one-operation.html)
- [All operations in a single page](/layouts/all-operations.html)
- [Sidebar items](/layouts/sidebar.html)

### Customization

You can use the [`useTheme`](/composables/useTheme) composable to configure the theme in your `.vitepress/theme/index.js` file, or in any `.md` page/file.
