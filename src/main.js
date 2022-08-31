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

if (process.env.NODE_ENV !== 'development') { // process是Node环境全部变量, 运行时根据敲击的命令不同, 脚手架会取环境变量给env添加属性和值
  console.log = function () {}
  console.error = function(){}
  console.dir = function(){}
}

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
