import axios from "axios";
import { Loading,Message } from "element-ui";


const loading = {
    loadingInstance : null,  //Loading实例

    //打开加载
    open: function (){
        //创建实例， 而且会打开 加载窗口
      if(this.loadingInstance === null){
          //如果实例为空 ，则创建
          this.loadingInstance = Loading.service({
              //target 给哪块构建Loading
              target: '.main',
              text: '加载中.....',
              background: 'rgba(0,0,0,0.3)'
          })
      }
    },
    //关闭加载
    close: function (){
        //不为空时，则关闭加载窗口
        if(this.loadingInstance !== null){
            this.loadingInstance.close()
        }
        this.loadingInstance = null
    }
}

const request = axios.create({
    baseURL: process.env.VUE_APP_BASE_API, // "/dev-api"
})

//请求拦截器
request.interceptors.request.use(config=>{
    //打开加载窗口
    loading.open()
    return config
}),error =>{
    // 关闭加载窗口
    loading.close()
    //出现异常
    return Promise.reject(error)
}

//响应拦截器
request.interceptors.response.use(response=>{
    loading.close()
    const resp = response.data


    //后台正常相应的状态不是 2000  说明后天处理有问题
    if(resp.code !== 2000){
       Message({
           message: resp.message || '系统异常',
           type: 'warning',
           duration: 5000
       })
    }

    return response
}),error=>{
    loading.close()
    console.log('response.error',error.response.status)
    Message({
        message: error.message,
        type: 'error',
        duration: 5000
    })
    return Promise.reject(error)
}

export default request;
