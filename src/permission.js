/**
 * 权限校验：
 * VueRouter中的  前置沟子函数 beforeEach(to, from ,next)
 * 当金进行路由跳转之前，  进行判断是否已经登陆过， 登录过允许访问非登陆界面。
 * 否则 回到登录页
 */
import router from "@/router";
import {getUserInfo} from "@/api/login";
import store from "@/store";

/**
 * to: 进入的目标路有对象
 * from：即将离开的路由对象
 * next: 是一个方法  可以指定路由地址，进行路由跳转
 */
router.beforeEach((to, from, next) => {
    //1.获取token
    // const token = localStorage.getItem('mxg-msm-token')
    const token = store.state.user.token
    console.log('token', token)
    /**
     * 如果没有获取到本地的token
     */
    if (!token) {
        //1.1 如果没有获取到token
        //要访问非登录页面，则不让访问 跳转到 /login页面
        if (to.path !== '/login') {
            next({path: '/login'})
        } else {
            //要请求登录页面 直接让他去目标路由
            next()
        }
    } else {
        //1.2 获取到token,
        //1.2.1.请求的路由 /login,那就去目标路由
        if (to.path === '/login') {
            next()
        } else {
            //1.2.2 请求的路由 非登录页，先在本地查看是否有用户信息，
            // const userInfo = localStorage.getItem('mxg-msm-user')
            const userInfo = store.state.user.user
            console.log(userInfo)
            if (userInfo) {
                //本地获取到 ，则 直接让他去目标路由
                next()
            } else {
                //如果本地没有信息，通过token获取用户信息
                store.dispatch('GetUserInfo').then(response => {
                    if(response.flag){
                        next()
                    }else{
                        next({path: '/login'})
                    }
                }).catch(error => {

                })
            }
        }

    }
})
