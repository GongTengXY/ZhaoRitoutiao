<template>
  <div class="search-results">
    <van-list
    v-model="loading"
    :finished="finished"
    finished-text="没有更多了"
    :error.sync="error"
    error-text="更新失败，点击重新加载"
    @load="onLoad"
    >
        <van-cell v-for="item in list" :key="item.art_id" :title="item.title" :to="`/article/${item.art_id}`" />
    </van-list>
  </div>
</template>

<script>
import { getSearchResults } from '@/api/search'

export default {
    props: {
        searchValue : {
            type : String,
            required : true,
        }
    },
    data() {
        return {
            list: [],
            loading: false,
            finished: false,
            error : false,
            page : 1,
            per_page : 20,
        };
    },
    methods: {
        async onLoad() {
            // 异步更新数据
            try {
                //1.请求获取数据
                const {data} = await getSearchResults({
                    page : this.page,       //页码
                    per_page : this.per_page,   //每页大小
                    q : this.searchValue,          //查询关键词
                })
                // console.log(data)
                //2.将数据添加到数组列表中
                const {results} = data.data
                this.list.push(...results)
                //3.将本次加载的loading 关闭
                this.loading = false
                //4.判断是否还有数据
                if (results.length) {
                    //  有的话， 更新获取下一个数据的页码
                    this.page++
                } else {
                    //  没有的话，则加载状态finished 设置为结束
                    this.finished = true
                }
                
            } catch (err) {
                //如果获取失败了，则显示加载失败提示
                this.error = true
                //即便加载失败，也得再一次关闭加载状态
                this.loading = false
                
                this.$toast('数据获取失败，请稍后重试')
            }
        },
    },
}
</script>

<style>

</style>