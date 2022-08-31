// 用户相关请求
import store from '@/store'
import request from '@/utils/request'

// 登录注册
export const login = data => request({
    method : "post",
    url : "/v1_0/authorizations",
    data,
})

// 发送验证码
export const sendCode = (mobile) => request({
    method : 'get',
    url : `/v1_0/sms/codes/${mobile}`
})

// 获取用户自己信息
export const getUserInfo = () => request({
    method : 'get',
    url : '/v1_0/user'
    // headers : {
    //     Authorization : `Bearer ${store.state.user.token}`
    // }
})

// 获取用户频道
export const getUserChannel = () => request({
    method : 'get',
    url : '/v1_0/user/channels'
})

// 关注用户 
export const focusUser = target => request({
    method : 'post',
    url : '/v1_0/user/followings',
    data : {
        target,
    }
})

// 取消关注用户
export const cancalFoucsUser = target => request({
    method : 'delete',
    url : `/v1_0/user/followings/${target}`
})

// 获取用户个人的资料
export const getUserProfile = () => request({
    method : 'get',
    url : '/v1_0/user/profile',
})

// 刷新用户token
export const refreshToken = () => request({
    method : 'put',
    url : '/v1_0/authorizations',
    headers : {
        Authorization : `Bearer ${localStorage.getItem('refresh_token')}`
    }
})