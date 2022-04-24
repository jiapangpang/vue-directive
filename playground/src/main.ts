import { createApp } from 'vue'
import myDirective from '../../src/index'
import '../../src/css/sizeDrag.scss'
import App from './App.vue'

createApp(App).use(myDirective).mount('#app')
