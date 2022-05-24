<template>
    <van-button
        :icon="value ? 'star' : 'star-o'"
        :class="{collected : value}"
        @click="onCollect"
        :loading="loading"
    />
</template>

<script>
import {collectArticles, cancalCollectArticles} from '@/api/article'

export default {
    props: {
        value : {
            type : Boolean,
            required : true
        },
        articleId : {
            type : [Number, String],
            required : true
        }
    },
    data () {
        return {
           loading : false  //请求是否收藏时的状态 
        }
    },
    methods: {
        async onCollect () {
            this.loading = true
            try {
                if (this.value) {
                    //已收藏
                    await cancalCollectArticles(this.articleId)
                    this.$toast.success('取消收藏')
                } else {
                    //未收藏
                    await collectArticles(this.articleId)
                    this.$toast.success('收藏成功')
                }
                this.$emit('input', !this.value)
            } catch (err) {
                this.$toast('收藏失败，请重试')
            }
            this.loading = false
        }
    }
}
</script>

<style lang="less" scoped>
.collected {
    .van-icon {
        color: #ffa500;
    }
}
</style>