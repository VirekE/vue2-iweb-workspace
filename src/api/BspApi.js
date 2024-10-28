// import Config  from "@_src/api/app.config";
const Config = require('../../src/api/app.config.js');
const defaultConfig = Config.default

import http from '../core/http'
import CryptoJS from 'crypto-js'
import Vue from '../app'
let isDevelop = true;
if(process.env.NODE_ENV !== 'development'){
    isDevelop = false;
}
let app_code = defaultConfig.app_code;
let loginUrl = defaultConfig.loginUrl;
let appInfoUrl = defaultConfig.appInfoUrl;
let tokenUrl =  defaultConfig.tokenUrl;
let logoutUrl =  defaultConfig.logoutUrl;
if(!isNotNull(loginUrl)){
    loginUrl = isDevelop ? '/sso/jwt/login':'/sso/bsp/login'
}
if(!isNotNull(appInfoUrl)){
    appInfoUrl = isDevelop ? "/sso/jwt/appinfo/"+app_code:"/sso/bsp/appinfo/"+app_code
}
if(!isNotNull(tokenUrl)){
    tokenUrl = '/sso/bsp/curJwt';
}
if(!isNotNull(logoutUrl)){
    logoutUrl = '/sso/bsp/logout';
}


function isNotNull(obj) {
    if (obj == null || obj == "null" || obj == "" || obj == "undefined"){
        return false;
    }
    return true;
};
function isEmptyObject (obj) {
    if (obj == null || obj === undefined) {
        return true
    }
    for (let key in obj) {
        return false
    }
    return true
};
function isFunction (obj) {
    if (obj == null || obj === undefined || !(typeof obj === 'function')) {
        return false
    } else {
        return true
    }
};
const BspApi = {
    isDevelop(){
        return isDevelop;
    },
    getCurToken(callback){
        $.ajax({
            url: tokenUrl,
            type: "get",
            dataType:"json",
            async:false,
            success: function(ret) {
                callback(ret);
            },
            error: function(e){
                callback({state: 0})
            }
        });
    },
    /**
     * 获取系统菜单
     */
    getAppInfo(callback){
        Vue.$http_api('GET',appInfoUrl,{},false,null,true).then((ret)=>{
            if(ret.state == 1){
                if(isEmptyObject(ret.row.USER) || isEmptyObject(ret.row.menus)){
                    var row = ret.row;
                    var menus = JSON.parse(JSON.stringify(row.menuList))
                    delete row.menuList;
                    var user = row;
                    user.menus = menus;
                    Vue.$store.dispatch("setUser",user);
                    if(isFunction(callback)){
                        callback(ret)
                    }
                }else{
                    var user = ret.row.USER;
                    user.menus = ret.row.menus;
                    Vue.$store.dispatch("setUser",user);
                    if(isFunction(callback)){
                        callback(ret)
                    }
                }


            }else{
                if(ret.message ==='用户无权访问此系统' || ret.message === '用户未登录或已失效'
                    || ret.message.indexOf("'exp' claim expired at") != -1){
                    if(ret.message.indexOf("'exp' claim expired at") != -1){
                        Vue.$message.error("用户未登录或已失效");
                    }else {
                        Vue.$message.error(ret.message);
                    }
                    Vue.$router.push({
                        path: '/admin/noPermission'
                    });
                }else{
                    Vue.$message.error(ret.message);
                    Vue.$router.push({
                        path: '/admin/404'
                    });
                }

            }
        }).catch((ret)=>{
            Vue.$message.error(ret.message);
            Vue.$router.push({
                path: '/admin/404'
            });
        });
    },

    login(account,password,verifyCode,callback){
        http.api('POST',loginUrl,{username:account,password:CryptoJS.MD5(password).toString(),verifyCode:verifyCode},false,null,true).then((ret)=>{
            callback(ret);
        });
        return;
    },
    logout(){
        if(loginUrl === '/sso/bsp/login'){
            Vue.$http_api('GET',logoutUrl,{},false,null,true).then((ret)=>{
                Vue.$router.push({
                    path:'/logout',
                    query: {type: 'sso'}
                });
            }).catch((ret)=>{
                Vue.$router.push({
                    path:'/logout',
                    query: {type: 'sso'}
                });
            });
        }else{
            Vue.$router.push({
                path:'/logout'
            });
        }
    },
    /* logout() {
         BspApi.getCurToken(ret => {
             if (ret.state == 1) {
                 var token = ret.message;
                 var storeToken = Vue.$store.getters.token;
                 if (token === storeToken) {
                     Vue.$http_api('GET', logoutUrl, {}, false, null, true).then((ret) => {
                         Vue.$router.push({
                             path: '/logout',
                             query: {type: 'sso'}
                         });
                     }).catch((ret) => {
                         Vue.$router.push({
                             path: '/logout',
                             query: {type: 'sso'}
                         });
                     });
                 } else {
                     Vue.$router.push({
                         path: '/logout'
                     });
                 }
             } else {
                 Vue.$router.push({
                     path: '/logout'
                 });
             }
         });
     }*/
};

export default BspApi;