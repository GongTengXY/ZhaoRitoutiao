<template>
  <div class="home">
      <!-- 导航栏 -->
    <van-nav-bar class="page-nav-bar" fixed>
        <!-- 搜索栏 -->
        <van-button class="search_btn" slot="title" type="info" size="small" round icon="search" to="/search">搜索</van-button>
    </van-nav-bar>
    <!-- 标签栏 -->
    <van-tabs class="channel-tabs" v-model="active" animated swipeable>
        <van-tab :title="obj.name" v-for="obj in channels" :key="obj.id">
            <!-- 文章列表组件 -->
            <Article :obj="obj"></Article>
        </van-tab>
        <div slot="nav-right" class="placeholder"></div>
        <div slot="nav-right" class="more-btn" @click="moreChannels">
            <i class="iconfont icon-gengduo"></i>
        </div>
    </van-tabs>
    <!-- 频道列表 -->
    <van-popup
    v-model="isChannelShow"
    closeable
    round
    close-icon-position="top-left"
    position="bottom"
    :style="{ height: '100%' }">
    <ChannelEdit :myChannels="channels" :active="active" @updateActive="onUpdateChange"></ChannelEdit>
    </van-popup>
  </div>
</template>

<script>
import { getUserChannel } from '@/api/user.js'
import ChannelEdit from './components/channel-Edit.vue'
import Article from './components/article-list.vue'
import { mapState } from 'vuex'
import { getItem } from '@/utils/storage.js'

export default {
    name : 'Home',
    data () {
        return {
            active : 0,
            channels : [],   //标签栏内容
            isChannelShow : false,  //控制频道弹出层的显示状态
        }
    },
    computed: {
      ...mapState(['user']) 
    },
    components: {
        Article,
        ChannelEdit
    },
    created () {
        this.loadUserChannel()
    },
    methods: {
        async loadUserChannel() {
            try {
                let channels = []
                if (this.user) {
                    //已登录
                    const { data }  = await getUserChannel()
                    channels = data.data.channels
                } else {
                    //未登录
                    const loacChannels = getItem('TOUTIAO_CHANNELS', )
                    if (loacChannels) {
                        channels = loacChannels
                    } else {
                        //如果本地没有数据，则让其请求默认频道列表
                        const { data }  = await getUserChannel()
                        channels = data.data.channels
                    }
                }
                this.channels = channels
            } catch(err) {
                this.$toast('获取频道数据失败')
            }
        },
        moreChannels () {
            this.isChannelShow = true
        },
        onUpdateChange (index, onShow = false) {     //更改标签栏的显示 
            //()里面的参数，如果直接在里面设置就是默认值，子组件传了这个参数就使用传过来的，没有传值就使用默认值这是es6的新语法
            this.active = index
            this.isChannelShow = onShow
        }
    }
}
</script>

<style scoped lang="less">
.home {
    padding-bottom: 100px;
    padding-top: 177px;
    .search_btn {
        width: 555px;
        height: 64px;
        background-color: #5babfb;
        font-size: 28px;
        .van-icon {
            font-size: 32px;
        }
    }

    // /deep/ 深度操作服务，可以使后面的子代受到影响
    /deep/ .channel-tabs {
        
        .van-tabs__wrap {
            height: 83px;
            position: fixed;
            top: 92px;
            z-index: 1;
            left: 0;
            right: 0;
        }
        .van-tab {
            border-right: 1px solid #edeff3;
            min-width: 190px;
            font-size: 30px;
            color: #777777;
        }
        .van-tab--active {
            color: #333333;
        }

        .van-tabs__nav {
            padding-bottom: 0;
        }

        .van-tabs__line {
            width: 31px !important;
            bottom: 9px;
            height: 6px;
            background-color: #3296fa;
        }
        
        .more-btn {
            position: fixed;
            right: 0;
            width: 66px;
            height: 83px;
            display: flex;
            justify-content: center;
            align-items: center;
            background-color: #fff;
            opacity: 0.9;
            i {
                font-size: 33px;
                color: #333333;
            }
            &:before {
                content: "";
                position: absolute;
                left: 0;
                width: 1px;
                height: 58px;
                background: url(~@/assets/gradient-gray-line.png);
                background-size: contain;
            }
        }

        .placeholder {
            width: 50px;
            height: 83px;
            flex-shrink: 0;
        }
    }
}

    
</style>