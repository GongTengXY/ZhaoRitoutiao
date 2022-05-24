<template>
  <div class="comment-post">
    <van-field
      class="post-field"
      v-model.trim="message"
      rows="3"
      autosize
      type="textarea"
      maxlength="50"
      placeholder="请输入留言"
      show-word-limit
    />
    <van-button 
    class="post-btn"
    @click="onPost"
    :disabled="!message.length"
    >
    发布
    </van-button>
  </div>
</template>

<script>
import {addComment} from '@/api/comment'

export default {
    props: {
        target : {
            type : [Number, String],
            required : true
        }
    },
    //父组件提供的数据接收用inject
    inject: {
        articleId : {
            type : [Number, String],
            default : null
        }
    },
    data () {
        return {
            message: ''
        }
    },
    methods: {
        async onPost () {
            this.$toast.loading({
                message: '发布中...',
                forbidClick: true,  //禁止点击其他
                duration : 0,  //如果为0，则持续展示
            })
            try {
                const {data} = await addComment({
                    target : this.target,    //评论的目标id（评论文章即为文章id，对评论进行回复则为评论id）
                    content : this.message, 
                    art_id : this.articleId,
                })
                // console.log(data)
                this.$emit('postSuccess', data.data)
                //将发布内容显示到列表顶部
                //清空文本框
                this.message = ''
                //发布成功
                this.$toast.success('发布成功')
            } catch (err) {
                this.$toast.fail('发布失败')
            }
        }
    }
}
</script>

<style scoped lang="less">
.comment-post {
  display: flex;
  align-items: center;
  padding: 32px 0 32px 32px;
  .post-field {
    background-color: #f5f7f9;
  }
  .post-btn {
    width: 150px;
    border: none;
    padding: 0;
    color: #6ba3d8;
    &::before {
      display: none;
    }
  }
}
</style>

