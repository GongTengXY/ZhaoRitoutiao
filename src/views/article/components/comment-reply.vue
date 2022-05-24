<template>
    <div class="comment-reply">
        <!-- 导航栏 -->
        <van-nav-bar>
            <div slot="title" class="title">
                {{comment.reply_count > 0 ?`${comment.reply_count}条回复` : '暂无回复'}}
            </div>
            <van-icon 
            slot="left" 
            name="cross" 
            class="close" 
            @click="$emit('close')"
            ></van-icon>
        </van-nav-bar>
        <!-- /导航栏 -->

        <div class="scroll-warp">
            <!-- 当前评论项 -->
            <CommentItem :comment="comment"></CommentItem>
            <!-- /当前评论项 -->

            <van-cell title="全部回复" />

            <!-- 评论的回复列表 -->
            <CommentList
            :list="commentList"
            :source="comment.com_id"
            type="c"
            ></CommentList>
            <!-- /评论的回复列表 -->
        </div>

        <!-- 底部 -->
        <div class="post-wrap">
            <van-button size="small" round class="post-btn" @click="isPostShow = true">写评论</van-button>
        </div>
        <!-- /底部 -->

        <!-- 发布评论 -->
        <van-popup 
        v-model="isPostShow" 
        position="bottom"
        >
        <CommentPost
        :target="comment.com_id"
        @postSuccess="OnPostSuccess"
        >
        </CommentPost>
        </van-popup>
    </div>
</template>

<script>
import CommentItem from './comment-item.vue'
import CommentList from './comment-list.vue'
import CommentPost from './comment-post.vue'

export default {
    props: {
        comment : {
            type : Object,
            required : true
        }
    },
    data () {
        return {
            isPostShow : false,
            commentList : [],    //评论的回复列表
        }
    },
    components: {
        CommentItem,
        CommentList,
        CommentPost
    },
    methods: {
        OnPostSuccess (data) {
            // console.log(data)
            //更新回复的数量
            this.comment.reply_count++
            //关闭弹层
            this.isPostShow = false
            //将最新的回复评论展示最前面
            this.commentList.unshift(data.new_obj)
        }
    }
}
</script>

<style lang="less" scoped>
.comment-reply {
    padding-top: 110px;
    .van-nav-bar {
        position: fixed;
        top: 10%;
        left: 0;
        right: 0;
        .van-nav-bar__title {
            .title {
                color: skyblue;
                font-size: 30px;
            }
        }
        .close {
            color: #000;
        }
    }
    .post-wrap {
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        height: 80px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-top: 1px solid #d8d8d8;
        background-color: #fff;
        .post-btn {
            width: 60%;
            font-size: 26px;
        }
    }
}
</style>