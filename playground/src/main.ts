import { createApp } from 'vue'
import myDirective from 'size-drag'
import '../node_modules/size-drag/dist/index.css'
import App from './App.vue'

createApp(App).use(myDirective).mount('#app')
