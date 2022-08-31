<template>
  <div>
    <!-- 固定导航 -->
    <van-nav-bar fixed left-arrow @click-left="$router.back()" title="小思同学" class="navTitle"></van-nav-bar>

    <!-- 聊天主体区域 -->
    <div class="chat-list">
      <div v-for="(item, index) in list" :key="index">
          <!-- 左侧是机器人小思 -->
          <div class="chat-item left" v-if="item.name !== 'me'">
            <van-image fit="cover" round src="https://img.yzcdn.cn/vant/cat.jpeg" />
            <div class="chat-pao">{{item.msg}}</div>
          </div>

          <!-- 右侧是当前用户 -->
          <div class="chat-item right" v-else>
            <div class="chat-pao-right">{{item.msg}}</div>
            <van-image fit="cover" round :src="photo" />
          </div>
       </div>
    </div>

    <!-- 对话区域 -->
    <div class="reply-container van-hairline--top">
      <van-field  placeholder="说点什么..." v-model="words" @keyup.enter="sendFn">
        <template #button>
          <span  style="font-size:12px;color:#000" @click="sendFn">发送</span>
        </template>
      </van-field>
    </div>
  </div>
</template>

<script>
import { io } from 'socket.io-client'
export default {
  name: 'Chat',
  data () {
    return {
        words : '',
        list: [
            // 只根据 name 属性，即可判断出这个消息应该渲染到左侧还是右侧
            { name: 'xs', msg: 'hi，你好！我是小思' },
            { name: 'me', msg: '我是编程小王子' }
        ],
        socket : null,    // 客户端与服务端建立连接的对象
    }
  },
  computed: {
    photo() {
        return this.$store.state.userInfo.photo
    }
  },
  created () {
    // 这里的io中的地址，还需要写基地址。因为io建立的是socket连接，和axios一毛钱关系也没有

    // 这样就创建好了一个socket实例对象
    this.socket = io('http://toutiao.itheima.net', {
        query: {
            token: this.$store.state.user
        },
        transports: ['websocket']
    })

    // 建立连接 触发connect：建立连接的事件
    this.socket.on('connect', ()=> {
        console.log('webSocket通道建立成功')
    })

    // 接受消息的事件
    this.socket.on('message', data => {
        this.list.push({
            name : 'xs',
            msg : data.msg
        })

        this.$nextTick(() => {
            this.scrollViewBottom()
        })
    })
  },
  methods : {
    // 发送信息
    sendFn() {
        if (this.words.trim().length === 0) return

        // 把自己说的话加进去
        this.list.push({
            name : 'me',
            msg : this.words
        })

        this.socket.emit('message', {
            msg : this.words,
            timestamp : new Date().getTime()
        })

        // 发送结束要手动清除words内容
        this.words = ''

        this.$nextTick(() => {
            this.scrollViewBottom()
        })
    },
    scrollViewBottom() {
        let chatItem = document.querySelectorAll('.chat-item')
        // 获取最后一条消息
        let lastItem = chatItem[chatItem.length - 1]
        lastItem.scrollIntoView({
            behavior : 'smooth'    // 动画平滑
        })
    },
  },
  destroyed() {
    this.socket.close()  // 先关闭socket连接
    this.socket = null   // 再把
  }
}
</script>

<style lang="less" scoped>
.chat-list {
    padding: 94px 0;
    height: 100%;
    .chat-item {
            padding: 20px;
        .van-image {
            vertical-align: top;
            width: 80px;
            height: 80px;
        }
        .chat-pao {
            vertical-align: top;
            display: inline-block;
            min-width: 80px;
            max-width: 70%;
            min-height: 76px;
            line-height: 76px;
            border: 1px solid #c2d9ea;
            border-radius: 8px;
            position: relative;
            padding: 0 20px;
            background-color: #e0effb;
            word-break: break-all;
            font-size: 28px;
            color: #333;
            &::before {
                content: '';
                width: 20px;
                height: 20px;
                position: absolute;
                top: 24px;
                border-top: 1px solid #c2d9ea;
                border-right: 1px solid #c2d9ea;
                background: #e0effb;
            }
        }

        .chat-pao-right {
            right: 0;
            vertical-align: top;
            display: inline-block;
            min-width: 80px;
            max-width: 70%;
            min-height: 76px;
            line-height: 76px;
            border: 1px solid #c2d9ea;
            border-radius: 8px;
            position: relative;
            padding: 0 20px;
            background-color: #e0effb;
            word-break: break-all;
            font-size: 28px;
            color: #333;
            &::before {
                content: '';
                width: 20px;
                height: 20px;
                position: absolute;
                top: 24px;
                border-top: 1px solid #c2d9ea;
                border-right: 1px solid #c2d9ea;
                background: #e0effb;
            }
        }
    }
}
.chat-item.right {
  text-align: right;
  .chat-pao-right {
    text-align: left;
    margin-left: 0;
    margin-right: 30px;
    &::before {
      right: -12px;
      transform: rotate(45deg);
    }
  }
}
.chat-item.left {
  text-align: left;
  .chat-pao {
    margin-left: 30px;
    margin-right: 0;
    &::before {
      left: -10px;
      transform: rotate(-135deg);
    }
  }
}
.reply-container {
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  background: #f5f5f5;
}

::v-deep .van-nav-bar__title {
  color: #fff;
}

::v-deep .van-nav-bar {
  background-color: #3296fa;
}

::v-deep .van-nav-bar .van-icon {
    color: #fff;
}
</style>

