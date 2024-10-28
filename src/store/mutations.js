
/**
 * mutations说明：
 * 只负责将数据存储到state中
 */
export default {
  globalSetting: (state,globalSetting)=>{
    state.globalSetting = globalSetting;
  },
  changeTabviews: (state,tbviews)=>{
    state.tabviews = tbviews;
  },
  changeTabviewId: (state,curTabviewId)=>{
    state.curTabviewId = curTabviewId;
  },
  setToken: (state,token)=>{
    state.token = token;
  },
  user: (state,user)=>{
    state.user = user;
  },
  setAppInfo: (state,appInfo)=>{
    state.appInfo = appInfo;
  },
  dict: (state,dict)=>{
    state.dict = dict;
  },
  globalSiteId: (state,globalSiteId)=>{
    state.globalSiteId = globalSiteId;
  },
  searchParams: (state,searchParams)=>{
    state.searchParams = searchParams;
  },
  deptList: (state,deptList)=>{
    state.deptList = deptList;
  },
  objectionData: (state,objectionData)=>{
    state.objectionData = objectionData;
  },

}
