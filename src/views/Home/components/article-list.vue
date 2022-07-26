<template>
  <div class="article-list">
    <van-pull-refresh v-model="isNewLoading" @refresh="onRefresh" :success-text="newSuccessText" success-duration="700">
        <!-- 列表 -->
        <van-list
            v-model="loading"
            :finished="finished"
            finished-text="没有更多了"
            offset="450"
            error.sync="error"
            error-text="请求失败，点击重新加载"
            @load="onLoad"
        >
        <ArticleItem v-for="(item, index) in list" :key="index" :article="item" />
        </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import { getArticles } from '@/api/article.js'
import ArticleItem from '@/components/article-item'
export default {
    props: {
        obj : {
            type : Object,
            required : true
        }
    },
    data () {
        return {
            list: [],            //存储列表数据的数组
            loading: false,      //控制加载的状态
            finished: false,     //控制数据加载结束的状态
            timestamp : null,   //请求下一页数据的事件戳
            error: false,       //控制列表加载失败的提示状态
            isNewLoading: false,  //控制下拉刷新的loading状态
            newSuccessText : '',  //下拉刷新成功后显示
        }
    },
    methods: {
        //初始化滚动距离底部offset的值才触发调用 onload
        async onLoad () {
            try {
                // 1.请求获取数据
                const { data } = await getArticles({
                    channel_id : this.obj.id,
                    timestamp : this.timestamp || Date.now(),
                })
                const { results } = data.data
                // 2.把请求结果数据放到list 数组中
                this.list.push(...results)
                // 3.本次数据加载结束之后要把加载状态loading 设置为结束
                this.loading = false
                // 4.判断数据是否全部加载完毕
                if (results.length) {
                    //更新获取下一页的时间戳
                    this.timestamp = data.data.pre_timestamp
                } else {
                    //没有数据了，将finished 设置成 true， 不再触发load事件加载更多
                    this.finished = true
                }
            } catch (err) {
                this.error = true
                //请求失败了，loading还需要关闭
                this.loading = false
            }
        },
        //下拉刷新触发调用该函数
        async onRefresh () {
            try {
                //1.请求获取数据
                const { data } = await getArticles({
                    channel_id : this.obj.id,
                    timestamp : Date.now(),  //下拉刷新每次获取都是最新数据
                })
                const results = data.data.results
                //2.将请求的数据追加到列表的顶部
                this.list.unshift(...results)
                //3.关闭下拉刷新的 loading状态
                this.isNewLoading = false
                //下拉更新成功后显示
                this.newSuccessText = `刷新成功，更新了${results.length}条新闻`
            } catch (err) {
                this.isNewLoading = false
                this.newSuccessText = '刷新失败，请重试'
            }
        }                                                               
    },
    components: {
        ArticleItem,
    }
}
</script>

<style lang="less" scoped>
.article-list {
    height: 79vh;
    overflow-y: auto;
}
</style>