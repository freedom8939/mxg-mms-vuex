import Vue from "vue";
import ElementUI from 'element-ui'; // 组件库
import 'element-ui/lib/theme-chalk/index.css'; // 样式
import store from "@/store";


import App from "./App.vue";
import router from "./router";

// 权限拦截
Vue.use(ElementUI);
import './permission'

Vue.config.productionTip = process.env.NODE_ENV === 'production';

new Vue({
    router,
    store, //注册
    render: (h) => h(App),
}).$mount("#app");
