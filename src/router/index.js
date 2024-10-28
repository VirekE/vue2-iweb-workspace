import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)

// route-level code splitting
const LoginPage = () => import('../pages/common/login/login.vue');
const SinglePointLogin = () => import('../pages/common/login/middlePage.vue');
const todoLogin = () => import('../pages/common/login/todo.vue');

const Error = () => import('../pages/common/error/error.vue');
const Error404 = () => import('../pages/common/error/404.vue');
const NoPermission = () => import('../pages/common/error/noPermission.vue');
const AppPage = () => import('../pages/app/app.vue');
import AdminFrame from '../components/frame/admin/index.vue'
import Config  from "@_src/api/app.config";
import BspApi  from "@_src/api/BspApi";
const Base64 = require('js-base64').Base64;

/**
 * 全局路由配置
 * @type {*[]}
 */
const Common = [
    {
        path: "/",
        name:"index",
        component: AdminFrame,
        redirect:Config.indexPath,
        children:[
        ]
    },
  {
        path: "/singlePointLogin",
        name:"singlePointLogin",
        component: SinglePointLogin,
        meta:{
            requireAuth : false
        }
    },
  {
        path: "/todo",
        name:"todoLogin",
        component: todoLogin,
        meta:{
            requireAuth : false
        }
    },
    {
        path: "/app/",
        name:"app",
        component: AppPage,
        meta:{
            requireAuth : false
        }
    },
    {
        path: "/admin/",
        component: Error,
        children:[
            {path:"404",component:Error404,meta: {
                    requireAuth: false
                }},
            {path:"noPermission",component:NoPermission,meta: {
                    requireAuth: false
                }}
        ],

        hidden: true
    },
    {path: "/mmcs/*",redirect: "/admin/404",hidden:true},
    {path: "/logout",hidden:true}
]
if(Config.is_test){
    Common.push(
        {
            path: "/login",
            name:"login",
            component: LoginPage,
            meta:{
                requireAuth : false
            }
        },
    )
}

var router = new Router({
    mode:"history",
    base:"/"+Config.context,
    scrollBehavior: () => ({ y: 0 }),
    routes: Common
});
let isLoadRouters = false;
// router.beforeEach((to, from, next) => {
//   next();
// });
function LoadRoutes(){
  var arrDepend = [];
  for(var ci in Config.depends){
    var depend = Config.depends[ci];
    arrDepend.push(import("../pages/"+depend+"/router.js"));
  }
  Promise.all(arrDepend).then((res)=>{
    var routes = [];
    if(res && res.length == arrDepend.length){
      for(var i=0;i<res.length;i++){
        routes.push(...res[i].default);
      }
    }
    router.addRoutes(routes);
    isLoadRouters = true;
  });
}


LoadRoutes();
let Store = null;
router.beforeEach((to, from, next) => {
    if(!isLoadRouters){
        setTimeout(()=>{
            next({...to,replace:true})
        },50)
        return;
    }
    //卡密码查询验证
    if(to.meta.checkEnterOnce){
        var pass=Store.getters.globalSetting.globalVipAuth;
        if (!pass) {
            return next('/vip/home')// 跳转回去
        }
    }

  if(from.fullPath.indexOf("/ebus/")==0){
    next();
    return;
  }else if(to.fullPath.indexOf("/logout")==0){
      var redirect = from.fullPath;
      if(redirect != null && redirect != undefined && (redirect.indexOf('admin/404') != -1 || redirect.indexOf('admin/noPermission') != -1)){
        redirect = '/'
      }
      Store.dispatch("logout");
      Store.dispatch("setUser",null);
      var type = to.query.type;
      if(type === 'sso'){
        window.location.href = '/sso/bsp/login?redirect='+Base64.encode("/"+Config.context+redirect)
      }else{
        next({
          path: '/login',
          query: {redirect: Base64.encode(redirect)} 
        })
      }
    return;
  }else if (false != to.meta.requireAuth) {
    // 判断该路由是否需要登录权限
    const token = Store.getters.token
    if (token != null && token.length>0) {
      next();
    }else {
      BspApi.getCurToken(ret=>{
        if(ret.state == 1){
          var token = ret.message;
          Store.commit("setToken",token);
          next();
        }else{
          var redirect = to.fullPath;
          next({
            path: '/login',
            query: {redirect: Base64.encode(redirect)} 
          })
        }
        
      })
    }
  }
  else {
      next();
  }
})
export function createRouter (store) {
  Store = store;
  return router;
}
