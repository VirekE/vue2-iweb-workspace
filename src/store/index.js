import Vue from 'vue'
import Vuex from 'vuex'
import actions from './actions'
import mutations from './mutations'
import getters from './getters'
import * as Cookies from "js-cookie"

import util from '../core/util.js'
import qz from './modules/qz.js'


Vue.use(Vuex)

/**
 * 全局设置
 */
const DefaultGlobalSetting = {
    fixedHeader: false,
    sidebarStatus: 1,
    sidebarStyle: "light",
    themeStyle: "#3D91F7",
    isTheme: true,
    tabView: false,
    theme: "",
    deviceData:null,
    globalVipAuth:null,
    productList: [],//头部产品快捷方式记录

};
const fixedHeader = Cookies.get("fixedHeader");
if (fixedHeader != null) {
    DefaultGlobalSetting.fixedHeader = fixedHeader;
}
const sidebarStatus = Cookies.get("sidebarStatus");
if (sidebarStatus != null) {
    DefaultGlobalSetting.sidebarStatus = sidebarStatus;
}
const sidebarStyle = Cookies.get("sidebarStyle");
if (sidebarStyle != null) {
    DefaultGlobalSetting.sidebarStyle = sidebarStyle;
}
const themeStyle = Cookies.get("themeStyle");
if (themeStyle != null) {
    DefaultGlobalSetting.themeStyle = themeStyle;
}
const isTheme = Cookies.get("isTheme");
if (isTheme != null) {
    DefaultGlobalSetting.isTheme = isTheme === "true" ? true : false;
}
const tabView = Cookies.get("tabView");
if (tabView != null) {
    DefaultGlobalSetting.tabView = tabView === "true" ? true : false;
}
const theme = Cookies.get("theme");
if (theme != null) {
    DefaultGlobalSetting.theme = theme;
}
const productList = Cookies.get("productList");
if (productList != null) {
    DefaultGlobalSetting.productList = JSON.parse(productList);
}
const strToken = util.getCache("jt");

export function createStore() {
    return new Vuex.Store({
        state: {
            tabviews: [],             //Tab标签数量
            curTabviewId: "",         //当前选中的TabId
            globalSetting: DefaultGlobalSetting,
            globalSiteId: "",          //cms全局站点id
            token: strToken,          //Token值
            user: {},                 //用户信息
            appInfo: {}, //系统信息
            dict:{},  //字典信息
            //搜索条件
            searchParams:{
            },
            objectionData: {},
            deptList:[]
        },
        actions,
        mutations,
        getters,
        modules: {
            qz
        }
    })
}