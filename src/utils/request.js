import axios from 'axios'
import store from '@/store'
import {refreshToken} from '@/api/user'

axios.defaults.baseURL = "http://toutiao.itheima.net"

//请求拦截器
axios.interceptors.request.use(function (config) {
    // 发起请求会经过这里
    // config ：本次请求的请求配置对象
    const { user } = store.state
    if (user && config.headers.Authorization === undefined ) {
        config.headers.Authorization = `Bearer ${user}`
    }
    //注意：这里务必要返回 config 配置对象，否则请求就会停在这里出不去
    return config
  }, function (error) {
    // 如果请求出错了(还没有发出去)会进入这里
    return Promise.reject(error)
});

//响应拦截器
axios.interceptors.response.use((response) => {
      return response
    }, async (error) => {
      
      if (error.response.status === 401) {  // 身份过期
        // token续签方式2: refreshToken(用户无感知)
        store.commit('setUser', '')
        const res = await refreshToken()

        // 新token回来之后
        // 先更新到本地
        store.commit('setUser', res.data.data.token)

        // 发起之前，先把token替换一下
        error.config.headers.Authorization = 'Bearer ' + res.data.data.token
        // 未完成这次请求，再一次发起
        // 把未完成的请求再重新return回原本逻辑页面调用的地方， return回一个promise对象
        return axios(error.config)
      } else if(error.response.status === 500 && error.config.url === '/v1_0/authorizations' && error.config.method === 'put') {
        // 满足的话表示，刷新的refresh_token也过期了 这时候就只能返回登录页
        // 先清token
        store.commit('setUser', '')
        store.commit('setUserInfo', null)
        localStorage.clear() // 本地也都清空，才能跳转到登录页，因为有路由独享守卫BeforeEnter
        this.$router.replace('/login')
        this.$toast({
          message : '身份过期，请重新登录！',
          position : 'top'
        })
      }
})

export default axios