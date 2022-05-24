import Vue from 'vue'
import Vuex from 'vuex'
import {setItem, getItem} from '@/utils/storage'

Vue.use(Vuex)

const Token_KEY = 'TouTiao_User'

export default new Vuex.Store({
  state: {
    user : getItem(Token_KEY)
    // user : JSON.parse(window.localStorage.getItem(Token_KEY)),    //存储用户登录时的token
  },
  getters: {
  },
  mutations: { 
    setUser(state, data) {
      state.user = data      

      //为防止刷新后数据丢失，使用本地存储备份   --- 为了数据持久化
      // window.localStorage.setItem(Token_KEY, JSON.stringify(state.user))
      setItem(Token_KEY, state.user)
    }
  },
  actions: {
  },
  modules: {
  }
})
