import request from '@/utils/request'

//获取联想建议
export const getSearchSuggestion = params => request({
    method : 'get',
    url : '/v1_0/suggestion',
    params : {
        q : params
    }
})

//获取搜索结果
export const getSearchResults = params => request({
    method : 'get',
    url : '/v1_0/search',
    params,
})