<template>
  <div>
    <!-- 子路由出口 -->
    <router-view></router-view>
    <!-- 标签底部导航栏 -->
    <van-tabbar route>
        <van-tabbar-item to="/layout/home">
            <i slot="icon" replace class="iconfont icon-shouye"></i>
            首页
        </van-tabbar-item>
        <!-- <van-tabbar-item to="/layout/question">
            <i slot="icon" replace class="iconfont icon-wenda"></i>
            问答
        </van-tabbar-item>
        <van-tabbar-item to="/layout/video">
            <i slot="icon" replace class="iconfont icon-shipin"></i>
            视频
        </van-tabbar-item> -->
        <van-tabbar-item to="/layout/my">
            <i slot="icon" replace class="iconfont icon-wode"></i>
            {{user ? '我的' : '未登录'}}
        </van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
    data () {
        return {
            
        }
    },
    computed: {
        ...mapState(['user'])
    }
}
</script>

<style scoped lang="less">
    .van-tabbar-item__icon {
        i {
            font-size: 34px;
        }
    }    
</style>