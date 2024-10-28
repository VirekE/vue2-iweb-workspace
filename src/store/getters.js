/**
 * getters说明：
 * 只负责获取，不允许修改
 */

export default {
  /**
   * 全局配置信息
   */
  globalSetting (state){
    return state.globalSetting;
  },
  /**
   * 标签列表
   */
  tabviews (state){
    return state.tabviews;
  },
  /**
   * 当前Tab Id
   */
  curTabviewId (state){
    return state.curTabviewId;
  },
  /**
   * 获取当前用户
   */
  curUser(state){
    var user = state.user;
    if(user != null){
      return user;
    }
    return null;
  },
   /**
   * 获取当前系统信息
   */
  appInfo(state){
    var appInfo = state.appInfo;
    if(appInfo != null){
      return appInfo;
    }
    return null;
  },
  /**
   * 获取当前字典
   */
  getDict(state){
    var dict = state.dict;
    if(dict != null){
      return dict;
    }
    return null;
  },
  token(state){
    return state.token;
  },
  /**
   * cms站点id
   */
  globalSiteId (state){
    return state.globalSiteId;
  },
  deptList (state){
    return state.deptList;
  },
  searchParams (state){
    return state.searchParams;
  },
  objectionData (state){
    return state.objectionData;
  },
}
