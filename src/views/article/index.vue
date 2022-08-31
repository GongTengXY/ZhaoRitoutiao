<template>
  <div class="article-container">
    <!-- 导航栏 -->
    <van-nav-bar
      class="page-nav-bar"
      left-arrow
      @click-left="onClickLeft"
      title="朝日头条"
    ></van-nav-bar>
    <!-- /导航栏 -->

    <div class="main-wrap">
      <!-- 加载中 -->
      <div class="loading-wrap" v-if="loading">
        <van-loading
          color="#3296fa"
          vertical
        >加载中</van-loading>
      </div>
      <!-- /加载中 -->

      <!-- 加载完成-文章详情 -->
      <div class="article-detail" v-else-if="article.title">
        <!-- 文章标题 -->
        <h1 class="article-title">{{article.title}}</h1>
        <!-- /文章标题 -->

        <!-- 用户信息 -->
        <van-cell class="user-info" center :border="false">
          <van-image
            class="avatar"
            slot="icon"
            round
            fit="cover"
            :src="article.aut_photo"
          />
          <div slot="title" class="user-name">{{article.aut_name}}</div>
          <div slot="label" class="publish-date">{{article.pubdate | relativeTime}}</div>
          <FollowUser 
          v-model="article.is_followed"
          :userId="article.aut_id"
          >
          </FollowUser>
        </van-cell>
        <!-- /用户信息 -->

        <!-- 文章内容 -->
        <div 
          class="article-content markdown-body" 
          v-html="article.content"
          ref="article-content"
        >
        </div>
        <van-divider>正文结束</van-divider>
        <van-cell title="全部评论"></van-cell>
        <!-- 评论列表 -->
        <CommentList
        :source="article.art_id"
        @changeNum="commentNum"
        :list="commentList"
        @replyClick="onReplyClick"
        >
        </CommentList>
        <!-- 底部区域 -->
        <div class="article-bottom" >
          <van-button
            class="comment-btn"
            type="default"
            round
            size="small"
            @click="isPostShow = true"
          >写评论</van-button>
          <van-icon
            name="comment-o"
            :info="commentNumber"
            color="#777"
          />
          <!-- 收藏组件 -->
          <CollectArticle 
          v-model="article.is_collected"
          :articleId="article.art_id"
          >
          </CollectArticle>
          <!-- 点赞组件 -->
          <LikeArticle
          v-model="article.like_count"
          :articleId="article.art_id"
          >
          </LikeArticle>
          <van-icon name="share" color="#777777"></van-icon>
        </div>
        <!-- /底部区域 -->
        <!-- 发布评论 -->
        <van-popup 
        v-model="isPostShow" 
        position="bottom"
        >
        <CommentPost
        :target="article.art_id"
        @postSuccess="OnPostSuccess"
        >
        </CommentPost>
        </van-popup>
      </div>
      <!-- /加载完成-文章详情 -->

      <!-- 加载失败：404 -->
      <div class="error-wrap" v-else-if="errStatus === 404">
        <van-icon name="failure" />
        <p class="text">该资源不存在或已删除！</p>
      </div>
      <!-- /加载失败：404 -->

      <!-- 加载失败：其它未知错误（例如网络原因或服务端异常） -->
      <div class="error-wrap" v-else>
        <van-icon name="failure" />
        <p class="text">内容加载失败！</p>
        <van-button class="retry-btn" @click="readfileDetail">点击重试</van-button>
      </div>
      <!-- /加载失败：其它未知错误（例如网络原因或服务端异常） -->
    </div>

    <!-- 弹出层是懒渲染的：只有在第一次展示的时候才会渲染里面的内容，之后他的关闭和显示都是在切换内容的显示和隐藏 -->
    <!-- 评论回复 -->
    <van-popup 
        v-model="isReplyShow" 
        position="bottom"
        :style="{ height: '90%' }"
        >
        <!-- v-if：条件渲染，如果true会渲染，如果为false的话会销毁 -->
        <CommentReply 
        v-if="isReplyShow"
        :comment="currentComment"
        @close="isReplyShow = false"
        ></CommentReply>
    </van-popup>
  </div>
</template>

<script>
import { getArticleDetail } from '@/api/article'
import { ImagePreview } from 'vant'
import FollowUser from '@/components/follow-user'
import CollectArticle from '@/components/collect-article'
import LikeArticle from '@/components/like-article'
import CommentList from './components/comment-list.vue'
import CommentPost from './components/comment-post.vue'
import CommentReply from './components/comment-reply.vue'

export default {
    name : 'Detail',
    props: {
        articleId: {
          type: [Number, String],
          required: true
        }
    },
    data () {
        return {
            article : {},   //文章详情
            loading : true,   //加载中的 loading 状态
            errStatus : 0,    //失败的状态
            followLoading : false,   //关注按钮的loading状态
            commentNumber : 0,    //评论数量
            isPostShow : false,   //控制发布评论的显示状态
            commentList : [],   //评论列表
            isReplyShow : false,   //评论回复
            currentComment : {},   //当前点击回复的评论项
        }
    },
    //依赖注入，父组件提供的数据或方法，子组件接收直接拿
    provide() {
      return {
        articleId : this.articleId
      }
    },
    created () {
        this.readfileDetail ()
    },
    methods: {
        async readfileDetail () {
            this.loading = true
            try {
                const {data} = await getArticleDetail(this.articleId)
                // console.log(data)
                // 数据驱动视图这件事不是立即的
                this.article = data.data
                // console.log(this.article)
                setTimeout(() => {
                  // console.log(this.$refs['article-content'])
                  //初始化图片点击加载
                  this.previewImage()
                },0)
            } catch (err) {
                // this.toast('请求失败')
                console.log(err.response)
                if (err.response && err.response.status === 404) {
                  this.errStatus = 404
                }
            }
            //请求成功与否都要关闭loading
            this.loading = false
        },
        onClickLeft () {
          this.$router.back()
        },
        //获取内容中的节点
        previewImage () {
          //获取所有的img节点
          const articleContent = this.$refs['article-content']
          const imgs = articleContent.querySelectorAll('img')
          const images = []
          imgs.forEach((img, index) => {
            images.push(img.src)
            img.onclick = () => {
              ImagePreview({
                //预览的图片地址数组
                images,
                //起始的位置
                startPosition: index,
              });
            }
          })
        },
        commentNum (val) {
          this.commentNumber = val
        },
        OnPostSuccess (obj) {
          //关闭弹出层
          this.isPostShow = false
          //将发布内容显示到列表顶部
          this.commentList.unshift(obj.new_obj)
        },
        onReplyClick (comment) {
          // console.log(comment)
          this.currentComment = comment
          //显示评论弹出层
          this.isReplyShow = true
        }
    },
    components: {
      FollowUser,
      CollectArticle,
      LikeArticle,
      CommentList,
      CommentPost,
      CommentReply
    }
}
</script>

<style scoped lang="less">
@import "./github-markdown.css";

.article-container {
  .main-wrap {
    position: fixed;
    left: 0;
    right: 0;
    top: 92px;
    bottom: 88px;
    overflow-y: scroll;
    background-color: #fff;
  }
  .article-detail {
    .article-title {
      font-size: 40px;
      padding: 50px 32px;
      margin: 0;
      color: #3a3a3a;
    }

    .user-info {
      padding: 0 32px;
      .avatar {
        width: 70px;
        height: 70px;
        margin-right: 17px;
      }
      .van-cell__label {
        margin-top: 0;
      }
      .user-name {
        font-size: 24px;
        color: #3a3a3a;
      }
      .publish-date {
        font-size: 23px;
        color: #b7b7b7;
      }
      .follow-btn {
        width: 170px;
        height: 58px;
      }
    }

    .article-content {
      padding: 55px 32px;
      /deep/ p {
        text-align: justify;
      }
    }
  }

  .loading-wrap {
    padding: 200px 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #fff;
  }

  .error-wrap {
    padding: 200px 32px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: #fff;
    .van-icon {
      font-size: 122px;
      color: #b4b4b4;
    }
    .text {
      font-size: 30px;
      color: #666666;
      margin: 33px 0 46px;
    }
    .retry-btn {
      width: 280px;
      height: 70px;
      line-height: 70px;
      border: 1px solid #c3c3c3;
      font-size: 30px;
      color: #666666;
    }
  }

  .article-bottom {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: space-around;
    align-items: center;
    box-sizing: border-box;
    height: 88px;
    border-top: 1px solid #d8d8d8;
    background-color: #fff;
    .van-button--default {
      border: none;
    }
    .van-button--normal {
      padding: 0;
    }
    .comment-btn {
      width: 282px;
      height: 46px;
      border: 2px solid #eeeeee;
      font-size: 30px;
      line-height: 46px;
      color: #a7a7a7;
    }
    /deep/ .van-icon {
      font-size: 40px;
      .van-info {
        font-size: 16px;
        background-color: #e22829;
      }
    }
  }
}
</style>
