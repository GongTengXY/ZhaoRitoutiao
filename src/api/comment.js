import request from '@/utils/request'

//获取文章评论列表
export const getCommentList = params => request({
    method : 'get',
    url : '/v1_0/comments',
    params,
})

//对评论或评论回复点赞
export const addLikings = target => request({
    method : 'post',
    url : '/v1_0/comment/likings',
    data : {
        target,
    }
})

//取消对评论或评论回复点赞
export const cancalAddLiking = target => request({
    method : 'delete',
    url : `/v1_0/comment/likings/${target}`
})

//对文章或者评论进行评论
export const addComment = data => request({
    method : 'post',
    url : '/v1_0/comments',
    data,
})