// A plain Vue app (no VitePress) using the v-openapi package.
import { VitepressOpenapi } from 'v-openapi'
import { createApp } from 'vue'
import App from './App.vue'
import { baseConfig } from './config'
import { spec } from './pages'
import { setupRouter } from './router'
// Same order as VitePress: theme styles first, then the library styles.
import 'v-openapi/standalone.css'
import 'v-openapi/style.css'

setupRouter()

createApp(App)
  .use(VitepressOpenapi, { spec, config: baseConfig })
  .mount('#app')
