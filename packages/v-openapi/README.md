# v-openapi

Vue 3 components to render OpenAPI documents, with a playground and code samples. No VitePress needed.

Built on [vitepress-openapi](https://github.com/enzonotario/vitepress-openapi). [Docs](https://vitepress-openapi.vercel.app/guide/vue) · [Live demo](https://vitepress-openapi.vercel.app/standalone/).

## Install

```sh
npm install v-openapi
```

## Usage

```ts
import { VitepressOpenapi } from 'v-openapi'
import { createApp } from 'vue'
import App from './App.vue'
import spec from './openapi.json'
// Document styles first, then component styles.
import 'v-openapi/standalone.css'
import 'v-openapi/style.css'

createApp(App)
  .use(VitepressOpenapi, { spec })
  .mount('#app')
```

```vue
<template>
  <OAOperation operation-id="createArtist" />
</template>
```

`OASpec`, `OAIntroduction`, `OAInfo` and `OAServers` work the same way. Build a sidebar with `useSidebar({ spec }).generateSidebarGroups()`, and switch dark mode with `useTheme().isDark`.

## License

MIT
