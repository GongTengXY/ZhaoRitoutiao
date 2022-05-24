import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Vant from 'vant'
import 'vant/lib/index.css'

// 加载样式
import '@/styles/index.less'
import 'amfe-flexible/index.js'

// 加载dayjs 初始化配置
import './utils/dayjs'

//注册使用组件vant组件库
Vue.use(Vant)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
