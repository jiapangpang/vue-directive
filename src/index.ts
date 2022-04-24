import type { App } from 'vue'
import './css/sizeDrag.css'
import sizeDragDirective from './directive'
const sizeDragPlugin = {
  install(app: App) {
    app.directive('sizeDrag', sizeDragDirective)
    return app
  },
}
export default sizeDragPlugin
