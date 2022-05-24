<template>
  <div class="channel-edit">
    <van-cell>
        <div slot="title" class="title">
            我的频道
        </div>
            <van-button plain round size="mini" @click="iconState = !iconState">{{iconState ? '完成' : '编辑'}}</van-button>
    </van-cell>
    <!-- 我的频道 -->
    <van-grid :gutter="10">
        <van-grid-item class="grid-item" v-for="(value, index) in myChannels" :key="index" @click="onMyChannelBtn(value, index)">
            <van-icon name="clear" slot="icon" v-show="iconState && !fiexdChannels.includes(value.id)"></van-icon>
            <span slot="text" :class="{ activecss: index === active }">{{value.name}}</span>
        </van-grid-item>
    </van-grid>

    <!-- 频道推荐 -->
    <van-cell>
        <div slot="title" class="title">
            频道推荐
        </div>
    </van-cell>
    <van-grid :gutter="10" direction="horizontal">
        <van-grid-item @click="onAddChannel(item)" class="grid-itemMore" v-for="item in recommendChannels" icon="plus" :key="item.id" :text="item.name" />
    </van-grid>
  </div>
</template>

<script>
import { getAllChannels, addUserChannels, deleteUserChannels} from '@/api/channel.js'
import { mapState } from 'vuex'
import { setItem } from '@/utils/storage.js'

export default {
    props: {
        myChannels : {
            type : Array,
            required : true
        },
        active : {
            type : Number,
            required : true
        }
    },
    data () {
        return {
            allChannels : [],  //存储所有频道
            iconState : false, //控制编辑状态的显示
            fiexdChannels : [0]  //固定频道，不允许删除
        }
    },
    created () {
        this.getChannels()
    },
    methods: {
        async getChannels() {
            try {
                const {data} = await getAllChannels()
                this.allChannels = data.data.channels
                // console.log(this.allChannels)
            } catch (err) {
                console.log('请求失败', err)
            }
        },
        async onAddChannel (channel) {
            this.myChannels.push(channel)

            //数据持久化处理：
            if (this.user) {
                try {
                    //2.已登录，把用户数据请求接口放到线上
                    await addUserChannels({
                        id : channel.id,  //频道ID
                        seq : this.myChannels.length,  //序号
                    })
                } catch (err) {
                    this.$toast('保存失败，请稍后重试')
                }
            } else {
                //1.未登录，把数据存储到本地
                setItem('TOUTIAO_CHANNELS', this.myChannels)

            }
            
        },
        onMyChannelBtn (channel, index) {
            if (this.iconState) {
                //1.如果选择的是固定频道，那么不允许删除
                if (this.fiexdChannels.includes(index)) {
                    return
                }
                //2.删除频道项
                this.myChannels.splice(index, 1)

                //3.编辑状态，则执行删除频道
                if (index <= this.active) {
                    //将激活频道的索引 -1
                    this.$emit('updateActive', this.active - 1, true)
                }
                //4. 处理删除持久化
                this.deleteChannel(channel)
            } else {
                //4.非编辑状态，执行切换
                this.$emit("updateActive", index)
            }
        },
        async deleteChannel (channel) {
            if (this.user) {
                //已登录，则将数据更新到线上
                try {
                    await deleteUserChannels(channel.id)
                } catch (err) {
                    this.$toast('删除失败，请稍后重试')
                }
            } else {
                //未登录，将数据更新到本地
                setItem('TOUTIAO_CHANNELS', this.myChannels)
            }
            // try {
            //     if (this.user) {
            //         //已登录，则将数据更新到线上
            //         await deleteUserChannels(channel.id)
            //     } else {
            //         //未登录，将数据更新到本地
            //         setItem('TOUTIAO_CHANNELS', this.myChannels)
            //     }
            // } catch (err) {
            //     this.$toast('删除失败，请稍后重试')
            // }
        }
    },
    //利用计算属性来算剩下的推荐频道 -- 会观测内部数据的变量，如果内部数据变化了则计算属性会重新计算
    computed: {
        ...mapState(['user']),

        recommendChannels () {
            //第二种方法
            return this.allChannels.filter(channel => {
                //return后面所跟的就是filter的条件 true了就是
                return !this.myChannels.find(mychannel => {
                    return mychannel.id === channel.id
                })
            })

            //第一种方法
            // const moreChannels = []
            // this.allChannels.forEach(obj => {
            //     const ret = this.myChannels.find(mychannel => {
            //         return mychannel.id === obj.id
            //     })
            //     //如果我的频道中不包括该频道项，则收集到推荐频道中
            //     if (!ret) {
            //         moreChannels.push(obj)
            //     }
                

            // })
            // //把计算结果返回
            // return moreChannels
        }
    }
}
</script>

<style lang="less" scoped>
.channel-edit {
    padding: 84px 0;
    .van-cell {
        .van-cell__title {
            display: flex;
            align-items: center;
            .title {
            font-size: 32px;
            color: #333333;
            }
        }

        .van-cell__value {
            display: flex;
            align-items: center;
            justify-content: right;
            .van-button {
            width: 100px;
            height: 50px;
            font-size: 28px;
            color: #f85c5c;
            }

            .van-button--default {
                border-color: #f85c5c;
            }
        }
    }
    
    /deep/ .van-grid {
        .grid-item {
            position: relative;
            width: 160px;
            height: 86px;
            margin-top: 0;
            .van-grid-item__content {
                white-space: nowrap;
                background-color: #f4f5f6;
                .van-grid-item__text,  span {
                    font-size: 28px;
                    color: #222222;
                }
                .van-grid-item__icon-wrapper {
                    position: unset;
                    .van-icon {
                        position: absolute;
                        right: -6px;
                        top: -8px;
                        font-size: 28px;
                        z-index: 2;
                    }
                }
                .activecss {
                    color: #f85c5c;
                }
            }
        }

        .grid-itemMore {
            width: 160px;
            height: 86px;
            .van-grid-item__content {
                white-space: nowrap;
                background-color: #f4f5f6;
                .van-grid-item__text {
                    font-size: 28px;
                    color: #222222;
                    margin-left: 2px;
                }
                .van-grid-item__icon {
                    font-size: 28px;
                }
            }
        }
    }
}
</style>