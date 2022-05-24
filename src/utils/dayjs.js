import Vue from 'vue'
import dayjs from 'dayjs'

//dayjs 默认语言是英文，我们这里配置中文
//1.加载中文语言包
import 'dayjs/locale/zh-cn'
dayjs.locale('zh-cn') // 全局使用

//添加相对时间插件
import relativeTime from 'dayjs/plugin/relativeTime'
//配置使用处理相对时间的插件
dayjs.extend(relativeTime)


//定义一个全局过滤器，然后就可以在任何组件的模版中使用
//过滤器相当于一个全局可用的方法
Vue.filter('relativeTime', value => dayjs().to(dayjs(value)))

// console.log( dayjs().format('YYYY-MM-DD'));