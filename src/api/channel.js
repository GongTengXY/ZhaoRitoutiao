import request from '@/utils/request'

//请求获取所有频道列表
export const getAllChannels = () => request({
    method : 'get',
    url : '/v1_0/channels',
})

//添加用户频道
export const addUserChannels = channel => request({
    method : 'patch',
    url : '/v1_0/user/channels',
    data : {
        channels : [channel]
    }
})

//删除指定用户频道
export const deleteUserChannels = channelId => request({
    method : 'DELETE',
    url : `/v1_0/user/channels/${channelId}`,
})