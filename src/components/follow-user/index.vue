<template>
    <van-button
        v-if="value"
        class="follow-btn"
        round
        size="small"
        @click="onFocus"
        :loading="loading"
        >已关注
    </van-button>
    <van-button
        v-else
        class="follow-btn"
        type="info"
        color="#3296fa"
        round
        size="small"
        icon="plus"
        @click="onFocus"
        :loading="loading"
        >关注
    </van-button>
</template>

<script>
import {focusUser, cancalFoucsUser} from '@/api/user'

export default {
    props: {
        //关注状态
        value : {
            type : Boolean,
            required : true
        },
        //用户id
        userId : {
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
        //处理关注用户
        async onFocus () {
          this.loading = true    //展示关注按钮的loading状态
          try {
            if (this.value) {
              //已关注
              await cancalFoucsUser(this.userId)
              this.$toast.success('取消关注')
              // this.article.is_followed = false
            } else {
              //未关注
              await focusUser(this.userId)
              this.$toast.success('关注成功')
              // this.article.is_followed = true
            }
            // this.article.is_followed = !this.article.is_followed
            this.$emit('input', !this.value)
          } catch (err) {
            if (err.response && err.response.status === 400) {
              this.$toast('您不能关注自己！')
            } else {
              this.$toast('操作失败，请重试！')
            }
            
          }
          this.loading = false    //关闭关注按钮的loading状态
        }
    }
}
</script>

<style lang="less" scoped>

</style>