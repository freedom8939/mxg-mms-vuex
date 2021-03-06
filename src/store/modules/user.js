import {getToken, setToken, setUser, getUser, removeToken} from "@/utils/auth"
import {login, getUserInfo, logout} from "@/api/login"

const user = {
    state: {
        token: getToken(),  //getToken()作为token初始值，解决刷新页面之后token为null问题
        user: getUser()
    },
    mutations: {
        SET_TOKEN(state, token) {
            state.token = token
            setToken(token)
        },
        SET_USER(state, user) {
            state.user = user
            setUser(user)
        }
    },
    actions: {
        //登录获取token
        Login({commit}, form) {
          return  new Promise((resolve, reject) => {
                //resolve 触发成功处理  reject 触发异常处理
                login(form.username.trim(), form.password.trim()).then(response => {
                    const resp = response.data  //获取到的就是响应的data数据
                    commit('SET_TOKEN', resp.data.token)
                    resolve(resp) //通知this.$store.dispath('Login)执行成功
                }).catch(error => {
                    reject(error)
                })
            })
        },
        // 通过token获取用户信息
        GetUserInfo({commit,state} ) {
           return  new Promise((resolve, reject) =>{
                getUserInfo(state.token).then(response =>{
                    const respUser = response.data
                    commit('SET_USER', respUser.data)
                    resolve(respUser)
                }).catch(error =>{
                    reject(error)
                })
            })
        },
        //退出
        Logout({commit,state}) {
            return new Promise((resolve, reject)=>{
                logout(state.token).then(response=>{
                    const resp = response.data
                    commit('SET_TOKEN', '')
                    commit('SET_USER', null)
                    removeToken()
                    resolve(resp)
                }).catch(error=>{
                    reject(error)
                })
            })
        }

    }
}

export default user
