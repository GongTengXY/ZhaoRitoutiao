import axios from 'axios'
import store from '@/store'

axios.defaults.baseURL = "http://toutiao.itheima.net"

//请求拦截器
axios.interceptors.request.use(function (config) {
    // 发起请求会经过这里
    // config ：本次请求的请求配置对象
    const { user } = store.state
    if (user && user.token) {
        config.headers.Authorization = `Bearer ${user.token}`
    }
    //注意：这里务必要返回 config 配置对象，否则请求就会停在这里出不去
    return config
  }, function (error) {
    // 如果请求出错了(还没有发出去)会进入这里
    return Promise.reject(error)
});


export default axios