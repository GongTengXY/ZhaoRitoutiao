<template>
  <div>
      <!-- 头部--已登录 -->
      <div class="header user_login" v-if="user">
         <div class="base_info">
           <div class="left">
             <van-image
                round
                fit="cover"
                class="headphoto"
                :src="userInfo.photo"
              />
              <span>{{userInfo.name}}</span>
           </div>
           <div class="right">
             <van-button round size="mini" class="edit" to="/userprofile">编辑资料</van-button>
           </div>
         </div>
         <div class="data_statis">
           <div class="data_item">
             <span class="count">{{userInfo.art_count}}</span>
             <span class="text">头条</span>
           </div>
           <div class="data_item">
             <span class="count">{{userInfo.follow_count}}</span>
             <span class="text">关注</span>
           </div>
           <div class="data_item">
             <span class="count">{{userInfo.fans_count}}</span>
             <span class="text">粉丝</span>
           </div>
           <div class="data_item">
             <span class="count">{{userInfo.like_count}}</span>
             <span class="text">获赞</span>
           </div>
         </div>
      </div>

      <!-- 头部--未登录 -->
      <div class="header no_login" v-else>
        <div class="loginbtn" @click="$router.push({path : '/login'})">
          <img class="mobile_img" src="~@/assets/mobile.png">
          <span class="mobile_span">登录 / 注册</span>
        </div>
      </div>

      <!-- 宫格导航 -->
      <van-grid :column-num="2" clickable>
        <van-grid-item class="flex_gird" to="/layout/collent">
          <van-icon slot="icon" class="iconfont icon-shoucang gird_icon color_sc"/>
          <span slot="text">收藏</span>
        </van-grid-item>
        <van-grid-item class="flex_gird">
          <van-icon slot="icon" class="iconfont icon-lishi gird_icon color_ls" />
          <span slot="text">历史</span>
        </van-grid-item>
      </van-grid>

      <!-- 单元格 -->
      <van-cell-group >
        <van-cell class="cells" title="消息通知" is-link/>
        <van-cell class="cells" title="小思同学" to="/chat" is-link/>
      </van-cell-group>
      <van-cell v-if="user" class="cells quit_login" title="退出登录" @click="onQuitLogin" clickable/>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { getUserInfo } from '@/api/user.js'
export default {
  name : 'My',
  data () {
    return {
      userInfo : {}
    }
  },
  computed: {
    ...mapState(['user'])
  },
  created () {
    if (this.user) {
      this.getOnlyUser()
    }
  },
  methods: {
    onQuitLogin() {
      //在组件中 是需要使用 this.$dialog 来调用弹出框组件
      this.$dialog.confirm({
        title: '确认退出吗？',
      })
        .then(() => {
          // 点击确认执行这里
          // 确认退出是需要退出状态，也就是清除“user中+本地存储”的token数据
          this.$store.commit('setUser', null)
          this.$store.commit('setUserInfo', null)
          localStorage.removeItem('refresh_token')
        })
        .catch(() => {
          // 点击取消执行这里
        });
    },
    async getOnlyUser() {
      try {
        const {data} = await getUserInfo()
        console.log(data)
        this.userInfo = data.data
        this.$store.commit('setUserInfo', data.data)
        // console.log(this.userInfo) 
      } catch(err) {
        console.log('获取失败', err)
      }
    }
  },
}
</script>

<style lang="less" scoped>
.header {
  height: 366px;
  // 在src下任何的文件使用路径@都指向的是src，但是css中要使用@的话需要在全面加上～符号
  background: url(~@/assets/banner.png);
  background-size: cover;
}

.no_login {
  display: flex;
  justify-content: center;
  align-items: center;
  .loginbtn {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .mobile_img {
      width: 132px;
      height: 132px;
      margin-bottom: 15px;
    }
    .mobile_span {
      font-size: 28px;
      color: #ffffff;
    }
  }
}

.user_login {
  .base_info {
    height: 231px;
    padding: 81px 32px 18px;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .left {
      display: flex;
      align-items: center;
      .headphoto {
        width: 132px;
        height: 132px;
        border: 1px solid white;
      }
      span {
        font-size: 30px;
        color: #ffffff;
        margin-left: 22px;
      }
    }
    .right {
      display: flex;
      align-items: center;
      .edit {
        width: 132px;
        height: 33px;
        line-height: 33px;
        font-size: 20px;
        color: #666666;
      }
    }
  }
  .data_statis {
    display: flex;
    .data_item {
      height: 135px;
      display: flex;
      flex: 1;
      justify-content: center;
      flex-direction: column;
      align-items: center;
      color: #ffffff;
      .count {
        font-size: 36px;
        margin-bottom: 10px;
      }
      .text {
        font-size: 23px;
      }
    }
  }
}

.van-grid {
  margin-bottom: 9px;
  .flex_gird {   
    height: 141px;
    .gird_icon {
      font-size: 45px;
    }
    .color_sc {
      color: #eb5253;
    }
    .color_ls {
      color: #ff9d1d;
    }
    span {
      margin-top: 10px;
      font-size: 28px;
    }
  }
}

.van-cell-group {
  .cells {
    height: 100px;
    font-size: 30px;
    color: #333333;
  }
}
.quit_login {
    height: 104px;
    margin-top: 9px;
    text-align: center;
    color: #d86262;
    font-size: 30px;
  }
</style>