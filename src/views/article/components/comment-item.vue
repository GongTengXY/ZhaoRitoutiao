<template>
  <van-cell class="comment-item">
    <van-image
      slot="icon"
      class="avatar"
      round
      fit="cover"
      :src="comment.aut_photo"
    />
    <div slot="title" class="title-wrap">
      <div class="user-name">{{comment.aut_name}}</div>
      <van-button
        class="like-btn"
        :class="{liked : comment.is_liking}"
        :icon="comment.is_liking ? 'good-job' : 'good-job-o'"
        @click="onCommentLike"
        :loading="commentLoading"
      >{{comment.like_count || ''}}</van-button>
    </div>
    <div slot="label">
      <p class="comment-content">{{comment.content}}</p>
      <div class="bottom-info">
        <span class="comment-pubdate">{{comment.pubdate | relativeTime}}</span>
        <van-button
          class="reply-btn"
          round
          @click="$emit('replyClick', comment)"
        >回复 {{comment.reply_count}}</van-button>
      </div>
    </div>
  </van-cell>
</template>

<script>
import {addLikings, cancalAddLiking} from '@/api/comment'

export default {
    props: {
        comment : {
            type : Object,
            required : true
        }
    },
    data () {
        return {
            commentLoading : false
        }
    },
    methods: {
        async onCommentLike () {
            this.commentLoading = true
            try {
                if (this.comment.is_liking) {
                    //已点赞
                    await cancalAddLiking(this.comment.com_id)
                    this.comment.like_count--
                    this.$toast.success('取消点赞')
                } else {
                    //未点赞
                    await addLikings(this.comment.com_id)
                    this.comment.like_count++ 
                    this.$toast.success('点赞成功')
                }
                this.comment.is_liking = !this.comment.is_liking
            } catch (err) {
                this.$toast('点赞失败，请重试')
            }
            this.commentLoading = false
        }
    }
}
</script>

<style scoped lang="less">
.comment-item {
  .avatar {
    width: 72px;
    height: 72px;
    margin-right: 25px;
  }
  .title-wrap {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .user-name {
      color: #406599;
      font-size: 26px;
    }
  }
  .comment-content {
    font-size: 32px;
    color: #222222;
    word-break: break-all;
    text-align: justify;
  }
  .comment-pubdate {
    font-size: 19px;
    color: #222;
    margin-right: 25px;
  }
  .bottom-info {
    display: flex;
    align-items: center;
  }
  .reply-btn {
    width: 135px;
    height: 48px;
    line-height: 48px;
    font-size: 21px;
    color: #222;
  }
  .like-btn {
    height: 30px;
    padding: 0;
    border: none;
    font-size: 19px;
    line-height: 30px;
    margin-right: 7px;
    .van-icon {
      font-size: 30px;
    }
    &.liked {
        color: skyblue;
    }
  }
}
</style>

