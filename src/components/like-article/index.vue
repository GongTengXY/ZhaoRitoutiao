<template>
  <van-button
        :icon="value === 1 ? 'good-job' : 'good-job-o'"
        :class="{liked : value === 1}"
        @click="onLike"
        :loading="loading"
    />
</template>

<script>
import {likeArticles, cancalLikeArticles} from '@/api/article'

export default {
    props: {
        value : {
            type : [Number, String],
            required : true
        },
        articleId : {
            type : [Number, String, Object], 
            required : true
        }
    },
    data () {
        return {
            loading : false
        }
    },
    methods: {
        async onLike () {
            this.loading = true
            try {
                if (this.value === 1) {
                    //已点赞
                    await likeArticles(this.articleId)
                    this.$toast.success('取消点赞')
                    this.$emit('input', 0)
                } else {
                    //未点赞
                    await cancalLikeArticles(this.articleId)
                    this.$toast.success('点赞成功')
                    this.$emit('input', 1)
                }
            } catch (err) {
                this.$toast('点赞失败，请重试！')
            }
            this.loading = false
        }
    }
}
</script>

<style lang="less" scoped>
.liked {
    .van-button__icon {
        color: skyblue;
    }
}
</style>