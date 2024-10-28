import Vue from 'vue'
import App from './App.vue'

import 'es6-promise/auto'

import {createStore} from './store'
import { createRouter } from './router'
import { sync } from 'vuex-router-sync'
import VueClipboard from 'vue-clipboard2'
// import AppConfig  from "./api/app.config.js";

import '../static/css/notify.css'
import watermark from './components/frame/admin/watermark.js'
Vue.prototype.$watermark = watermark
const store = createStore()
const router = createRouter(store)
// console.log(router)
sync(store, router)
import 'element-ui/lib/theme-chalk/index.css';

import ElementUI from 'element-ui';
import SlideVerify from 'vue-monoplasty-slide-verify';

Vue.use(SlideVerify);
Vue.use(ElementUI);
Vue.use(VueClipboard);//点击复制剪贴板功能
//echart挂在
 import echarts from 'echarts'
 Vue.prototype.$echarts = echarts;

Vue.prototype.openLoading = function(text,isTime) {
    const loading = this.$loading({           // 声明一个loading对象
        lock: true,                             // 是否锁屏
        text: text==undefined?'加载中...':text,                     // 加载动画的文字
        spinner: 'el-icon-loading',             // 引入的loading图标
        background: 'rgba(255, 255, 255, 0.5)',       // 背景颜色
        target: '.sub-main',                    // 需要遮罩的区域
        body: true,
        customClass: 'mask'                     // 遮罩层新增类名
    })
    if(isTime){
        setTimeout(function () {            // 设定定时器，超时5S后自动关闭遮罩层，避免请求失败时，遮罩层一直存在的问题
            loading.close();                        // 关闭遮罩层
        },10000);
    }
    return loading;
}
Vue.component('Search', () => import('./pages/mssq/components/Search.vue'));

import Http from './core/http'
Vue.use(Http,{
    store:store
})


const app = new Vue({
  router,
  store,
  render: h => h(App)
})
app.$mount('#app')
export default app;
