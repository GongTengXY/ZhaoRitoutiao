import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store'

Vue.use(VueRouter)

//路由匹配表
const routes = [
  {
    path : "/login",
    component : () => import('@/views/Login'),
    beforeEnter (to, from, next) {
      if (store.state.user) { // vuex里有token(代表登录过, 但是一定要注意过期和主动退出要先清除vuex和本地的token, 让其跳转登录页)
        return next('/')
      }
      next()
    }
  },
  {
    path : '/',
    redirect: '/layout'
  },
  {
    path : '/layout',
    component : () => import('@/views/Layout'),
    redirect: '/layout/home',
    children : [
      {
        path : "home",   //默认子路由
        component : () => import('@/views/Home'),
        // meta: {
        //   keepAlive : true,
        // }
      },
      // {
      //   path : "question",
      //   component : () => import('@/views/Question')
      // },
      // {
      //   path : "video",
      //   component : () => import('@/views/Video')
      // },
      {
        path : "my",
        component : () => import('@/views/My'),
      },
      {
        path : 'collent',
        component : () => import('@/views/Collent'),
        // meta: {
        //   requireAuth : true
        // }
      }
    ]
  },
  {
    path : '/chat',
    component : () => import('@/views/Chat')
  },
  {
    path : '/userprofile',
    component : () => import('@/views/User-profile')
  },
  {
    path : '/search',
    component : () => import('@/views/Search')
  },
  {
    path : '/article/:articleId',
    component : () => import('@/views/article'),
    //开启props传参，就是把路由参数映射到组件上
    props : true,
  }
]

const router = new VueRouter({
  routes
})


//路由守卫
router.beforeEach((to, from, next) => {
  if (to.path === "/layout/collent") {
    if (localStorage.getItem('TouTiao_User') == 'null') {
      setTimeout('console.clear()', 0)
      next('/login')
    } else {
      next(true)
    }
  } else {
    next(true)
  }
})

export default router
