import Vue from 'vue'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/zh-CN'

import App from './App.vue'
import Conditioner from '../lib/index'

Vue.config.productionTip = false

Vue.use(Conditioner)
Vue.use(ElementUI, { locale })

new Vue({
  render: h => h(App)
}).$mount('#app')
