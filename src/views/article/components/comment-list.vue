<template>
    <van-list
        v-model="loading"
        :immediate-check="false"
        :finished="finished"
        finished-text="没有更多了"
        :error="error"
        error-text="加载失败，请重试！"
        @load="onLoad"
        >
        <CommentItem
        v-for="(item, index) in list" 
        :key="index" 
        :comment="item"
        @replyClick="$emit('replyClick', $event)"
        />
    </van-list>
</template>

<script>
import { getCommentList } from '@/api/comment'
import CommentItem from './comment-item.vue'

export default {
    data() {
        return {
        // list: [],
        loading: false,
        finished: false,
        offset : null,   //获取下一页的标记
        limit : 10,      //每次获取评论的条数
        error : false,   //加载失败的状态
        };
    },
    props: {
        source : {
            type : [Number, String],
            required : true
        },
        list : {
            type : Array,
            default : () => []
        },
        type : {
            type : String,
            //自定义 prop数据验证
            validator (value) {
                return ['a', 'c'].includes(value)
            },
            default : 'a'
        }
    },
    created () {
        //当你手动初始 onLoad 的话，它不会自动开始初始的 loading，所以需要手动开启
        this.loading = true
        this.onLoad()
    },
    methods: {
        async onLoad() {
            try {
                //1.请求获取数据
                const {data} = await getCommentList({
                    type : this.type,         
                    source : this.source,       
                    offset : this.offset,       
                    limit : this.limit,
                })
                // console.log(data)
                //2.数据添加到其中
                this.list.push(...data.data.results)
                // console.log(this.list) 
                //将评论总数传给父组件
                this.$emit('changeNum', data.data.total_count)
                //3.将loading 状态设置为 false
                this.loading = false
                //4.判断是否还有数据
                if (results.length) {
                    //有，更新获取下一页的数据页码
                    this.offset = data.data.last_id
                } else {
                    //没有，就将 finished 状态设置为 true
                    this.finished = true
                }
            } catch (err) {
                this.error = true
                this.loading = false
            }
        }
    },
    components: {
        CommentItem,
    }
}
</script>

<style lang="less" scoped>

</style>