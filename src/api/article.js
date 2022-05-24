//文章请求模块
import request from '@/utils/request'

//请求获取文章列表数据
export const getArticles = params => request({
    method : 'get',
    url : '/v1_0/articles',
    params
})

//请求获取文章详情
export const getArticleDetail = articleId => request({
    method : 'get',
    url : `/v1_0/articles/${articleId}`
}) 

//请求收藏文章
export const collectArticles = target => request({
    method : 'post',
    url : '/v1_0/article/collections',
    data : {
        target,
    }
})

//请求取消收藏文章
export const cancalCollectArticles = target => request({
    method : 'delete',
    url : `/v1_0/article/collections/${target}`
})

//请求点赞文章
export const likeArticles = target => request({
    method : 'post',
    url : '/v1_0/article/likings',
    data : {
        target,
    }
})

//请求取消对文章点赞
export const cancalLikeArticles = target => request({
    method : 'delete',
    url : `/v1_0/article/likings/${target}`
})