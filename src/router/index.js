import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '@/views/Login'
import Layout from '@/views/Layout'
import Home from '@/views/Home'
import Question from '@/views/Question'
import Video from '@/views/Video'
import My from '@/views/My'
import Search from '@/views/Search'
import Article from '@/views/article'
import UserProfile from '@/views/User-profile'
import Collent from '@/views/Collent'

Vue.use(VueRouter)

//路由匹配表
const routes = [
  {
    path : "/login",
    component : Login
  },
  {
    path : '/',
    redirect: '/layout'
  },
  {
    path : '/layout',
    component : Layout,
    redirect: '/layout/home',
    children : [
      {
        path : "home",   //默认子路由
        component : Home,
        meta: {
          keepAlive : true,
        }
      },
      {
        path : "question",
        component : Question
      },
      {
        path : "video",
        component : Video
      },
      {
        path : "my",
        component : My,
      },
      {
        path : 'collent',
        component : Collent,
        // meta: {
        //   requireAuth : true
        // }
      }
    ]
  },
  {
    path : '/userprofile',
    component : UserProfile
  },
  {
    path : '/search',
    component : Search
  },
  {
    path : '/article/:articleId',
    component : Article,
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
