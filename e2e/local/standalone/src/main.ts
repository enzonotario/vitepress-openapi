// A plain Vue app (no VitePress) using vitepress-openapi through its Vue plugin.
import { VitepressOpenapi } from 'vitepress-openapi/vue'
import { createApp } from 'vue'
import App from './App.vue'
import { baseConfig } from './config'
import { spec } from './pages'
import { setupRouter } from './router'
// Same order as VitePress: theme styles first, then the library styles.
import 'vitepress-openapi/dist/standalone.css'
import 'vitepress-openapi/dist/style.css'

setupRouter()

createApp(App)
  .use(VitepressOpenapi, { spec, config: baseConfig })
  .mount('#app')
