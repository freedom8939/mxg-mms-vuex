import request from "@/utils/request"

export default {

    //检查密码 userId  指的是唯一id ,password  旧密码
    checkPwd(userId, password) {
        return request({
            url: '/user/pwd',
            method: 'post',
            data: {userId, password}
        })
    },
    //修改密码 userId: 用户id   password新密码
    updatePwd(userId, password){
        return request({
            url: '/user/pwd',
            method: 'put',
            data:{userId, password}
        })
    }
}
