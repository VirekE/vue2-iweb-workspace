
import Util from "./util.js"
import CryptoJS from 'crypto-js'
const Config = require('../../src/api/app.config.js');
const defaultConfig = Config.default
import BspApi from '../api/BspApi';
export default {
    data () {
        return {
            Config: defaultConfig
        }
    },  
  methods: {
    ...BspApi,  
      /**
     * 简单数据格式转树形
     */
    simpleToTree(tableData,idKey,parentIdKey,rootId,childKey){
        if(parentIdKey == null){
            parentIdKey = "PARENT_ID";
        }
        if(rootId == null){
            rootId = "#";
        }
        if(childKey == null){
            rootId = "children";
        }
        var arrRet = [];
        for(var key in tableData){
            var data = tableData[key];
            if(rootId == data[parentIdKey]){
                var arrChild = this.simpleToTree(tableData,idKey,parentIdKey,data[idKey],childKey);
                data[childKey] = arrChild;
                arrRet.push(data);
            }
        }
        return arrRet;
    },
    getUUID(){
        var uid = [];
        var hexDigits = "0123456789abcdefghijklmnopqrstuvwxyz";
        for (var i = 0; i < 32; i++) {
            uid[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
        }
        uid[6] = "4";
        uid[15] = hexDigits.substr((uid[15] & 0x3) | 0x8, 1);
        var uuid = uid.join("");
        return uuid;
    },
    isNotNull(obj) {
      if (obj == null || obj == "null" || obj == "" || obj == "undefined"){
        return false;
      }
      return true;
    },
    /**
     * 对象是否是空对象
     * @param obj
     * @returns {boolean}
     */
    isEmptyObject (obj) {
        if (obj == null || obj === undefined) {
            return true
        }
        for (let key in obj) {
            return false
        }
        return true
    },
    /**
     * 对象是否是function
     * @param obj
     */
    isFunction (obj) {
        if (obj == null || obj === undefined || !(typeof obj === 'function')) {
            return false
        } else {
            return true
        }
    },
    /**
     * 格式化日期
     * @param {值} v 
     * @param {格式化参数yyyy-MM-dd mm:HH:ss} dateFormat 
     */
    formatDate(v,dateFormat){
      return Util.format.formatDate(v,dateFormat);
    },
    /**
     * 
     * @param {字符串} str 
     */
    md5(str){
        return CryptoJS.MD5(str).toString();
    },
    //是否存在该角色
    //用户角色userRole是否拥有角色配置roleConfig的权限
    isInRole(roleConfig, userRole) {
        if(null!=userRole && undefined !=userRole && null!=roleConfig && undefined !=roleConfig){
            var roles = userRole.split(",");
            var roleConfigs = ","+roleConfig+",";
            for(var i=0;i<roles.length;i++){
                var role = ","+roles[i]+",";
                if(roleConfigs.indexOf(role)>=0){
                    return true;
                }
            }
            return false;
        }else{
            return false;
        }
    }
  }
};
