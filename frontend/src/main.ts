import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { formattersPlugin } from './plugins/formatters'
import { focusDirective } from './directives/focus'

import './assets/main.css'

const app = createApp(App)

// Plugins
app.use(createPinia())
app.use(router)
app.use(formattersPlugin)

// Directives
app.directive('focus', focusDirective)

app.mount('#app')
