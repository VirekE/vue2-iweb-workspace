import * as Cookies from "js-cookie"
import Util from '../core/util.js'

/**
 * actions说明：
 * 只负责中间处理，及数据加工
 */
export default {
  // { commit, dispatch, state ,getters},参数

  globalSetting: ({commit, getters}, globalSetting) => {
    const keys = Object.keys(globalSetting);
    for (var i in keys) {
      var key = keys[i];
      Cookies.set(key, globalSetting[key]);
    }
    var gs = getters.globalSetting;
    gs = Object.assign(gs, globalSetting);
    commit("globalSetting", gs);
  },
  /**
   * 打开标签页
   */
  openTab: ({commit, getters}, tabObj) => {
    var tabviews = getters.tabviews;
    var tabview = null;
    for (var i = 0; i < tabviews.length; i++) {
      var item = tabviews[i];
      if (item.ID == tabObj.ID) {
        tabview = item;
        break;
      }
    }
    if (tabview == null) {
      tabviews.push(tabObj);
      commit("changeTabviews", tabviews);
    }
    commit("changeTabviewId", tabObj.ID);
  },
  /**
   * 关闭标签页
   */
  closeTabview: ({commit, getters}, tabviewId) => {
    var tabviews = getters.tabviews;

    var tabviewIndex = -1;
    for (var i = 0; i < tabviews.length; i++) {
      var item = tabviews[i];
      if (item.ID == tabviewId) {
        tabviewIndex = i;
        break;
      }
    }
    if (tabviewId == "closeAll") {//关闭所有
      tabviews = [];
      commit("changeTabviews", tabviews);
    } else if (typeof tabviewId == "object") {//关闭其他
      let temp = [];
      if (getters.curMenus[0].ID != tabviewId.leaveOne) {
        temp.push(getters.curMenus[0]);//保留第一个的默认首页
      }
      for (let i = 0, len = tabviews.length; i < len; i++) {
        if (tabviewId.leaveOne == tabviews[i].ID) {
          temp.push(tabviews[i]);
        }
      }
      tabviews = temp;
      commit("changeTabviews", tabviews);
    } else if (tabviewIndex > -1) {
      tabviews.splice(tabviewIndex, 1);
      commit("changeTabviews", tabviews);
    }

  },
  /**
   * 修改当前页ID
   */
  changeTabviewId: ({commit}, tabviewId) => {
    commit("changeTabviewId", tabviewId);
  },
  /**
   * 用户登录
   */
  logout: ({commit}) => {
    Util.setCache("jt", "")
    commit("token", null)
  },
  setToken: ({commit}, token) => {
    commit("setToken", token)
  },
  setCookieToken: ({commit}, token) => {
    Util.setCache("jt", token)
    commit("setToken", token)
  },
  /**
   * 设置用户信息
   */
  setUser: ({commit}, user) => {
    commit("user", user)
  },
  setAppInfo: ({commit}, appInfo) => {
    commit("setAppInfo", appInfo)
  },
  /**
   * 设置字典
   */
  setDict: ({commit}, dict) => {
    commit("dict", dict)
  },
  /**
   * 设置cms站点信息
   */
  setGlobalSiteId: ({commit}, globalSiteId) => {
    commit("globalSiteId", globalSiteId)
  },
  setSearchParams: ({commit}, searchParams) => {
    commit("searchParams", searchParams)
  },
  setDeptList: ({commit}, deptList) => {
    commit("deptList", deptList)
  },
  setObjectionData: ({commit}, objectionData) => {
    commit("objectionData", objectionData)
  },
}
