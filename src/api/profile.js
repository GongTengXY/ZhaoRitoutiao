import request from '@/utils/request'

//编辑用户个人资料
export const editUserProfile = data => request({
    method : 'PATCH',
    url : '/v1_0/user/profile',
    data,
})

//编辑用户头像
export const editUserPhoto = data => request({
    method : 'PATCH',
    url : '/v1_0/user/photo',
    data,
})