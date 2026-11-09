// A plain Vue app (no VitePress) using vitepress-openapi through its Vue plugin.
import { VitepressOpenapi } from 'vitepress-openapi/vue'
import { createApp } from 'vue'
import spec from '../../../../docs/public/openapi.json'
import App from './App.vue'
import 'vitepress-openapi/dist/style.css'
import 'vitepress-openapi/dist/standalone.css'

createApp(App)
  .use(VitepressOpenapi, { spec })
  .mount('#app')
