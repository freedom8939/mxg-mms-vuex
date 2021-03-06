import request from '@/utils/request'


export function login(username, password) {
    return request({
        url: '/user/login',
        method: 'post',
        data: {
            username, // username: username
            password
        }
    })
}

export function getUserInfo(token) {
    return request({
        url: `/user/info/`,
        method: 'get',
        params: { token: token }
    })
}

export function logout(token) {
    return request({
        url: `/user/logout`,
        method: 'post',
        data: {
            token
        }
    })
}