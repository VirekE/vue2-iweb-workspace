
const Config = require('../../src/api/app.config.js');
const defaultConfig = Config.default
import axios from 'axios';
import qs from 'qs';
import SHA256 from "crypto-js/sha256"
import json from "./json.js";
const Base64 = require('js-base64').Base64;

function S4() {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
}
function guid() {
    return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
}
/**
 * 签名方法
 */
function getSignature(timestamp,token,nonce,busiString) {
    var strSignData = timestamp + token + nonce + busiString + timestamp;
    return SHA256(strSignData).toString().toUpperCase();
}

/**
 * 封装ebus请求头
 */
var doCloundRequest = function(appKey,token,busiString){
    var now = new Date().getTime()/1000;
    var timestamp = now + "";
    var nonce = guid();//非随机字符串
    var sign = getSignature(timestamp,token,nonce,busiString);
    var headerObj = {
        "x-aep-appkey":appKey,
        "x-aep-timestamp":timestamp,
        "x-aep-nonce":nonce,
        "x-aep-signature":sign
    }
    return headerObj;
}

var MyStore = null

axios.defaults.timeout = 60000;
axios.defaults.baseURL =defaultConfig.base_url;

// 添加请求拦截器，在发送请求之前做些什么(**具体查看axios文档**)--------------------------------------------
axios.interceptors.request.use(function (config) {
    var busiString = '';
    if(MyStore != null){
        var token =  MyStore.getters.token;
        if(token != null && token != undefined && token.length > 0){
            config.headers["x-aep-token"] = MyStore.getters.token;
        }
       
        //var curUser = MyStore.getters.curUser;
        // if(Config.base_url =="/local" && (curUser != null && curUser != undefined && curUser.id != '')){
        //     var user = JSON.parse(JSON.stringify(curUser))
        //     var uid = Base64.encode(user.id);
        //     var uinfo = Base64.encode(user.name);
        //     var ext = Base64.encode(JSON.stringify(user));
        //     busiString = ","+uid+","+uinfo+","+ext;
        // }
    }
    
    const headObj = doCloundRequest(defaultConfig.app_key,  defaultConfig.app_security,busiString);
    // 显示loading
    config.headers["x-aep-appkey"] = headObj["x-aep-appkey"];
    config.headers["x-aep-signature"] = headObj["x-aep-signature"];
    config.headers["x-aep-timestamp"] = headObj["x-aep-timestamp"];
    config.headers["x-aep-nonce"] = headObj["x-aep-nonce"];
    return config
}, function (error) {
    // 请求错误时弹框提示，或做些其他事
    return Promise.reject(error)
})

// 添加响应拦截器(**具体查看axios文档**)----------------------------------------------------------------
axios.interceptors.response.use(function (response) {
    // 对响应数据做点什么，允许在数据返回客户端前，修改响应的数据
    // 如果只需要返回体中数据，则如下，如果需要全部，则 return response 即可
    return response.data
}, function (error) {
    // 对响应错误做点什么
    return Promise.reject(error)
})


// 封装axios--------------------------------------------------------------------------------------
//jsonContentType是否json格式提交，默认否
function apiAxios (method, action, params,jsonContentType,responseType,addBaseUrl) {
    let requestUrl = action;
    //请求最前面为/
    if(requestUrl.indexOf("/") !=0 && requestUrl.indexOf("http://") ==-1  && requestUrl.indexOf("https://") ==-1){
        requestUrl = "/"+requestUrl;
    }

    if(jsonContentType == null){
        jsonContentType = false
    }

    let httpDefault = {
        method: method
    };
    if(method == "GET" || method == "DELETE"){
        //如果为get请求
        var hasParams = false;//是否已经存在了？
        if(requestUrl.indexOf("?")>-1){
            hasParams = true;
        }
        for(var key in params){
            if(hasParams){
                requestUrl += "&";
            }else{
                requestUrl += "?";
                hasParams = true;
            }
            requestUrl+= key + "="+params[key];
        }
    }
    else{
        if(method == "POST" && jsonContentType){
            httpDefault.data = json.toJSON(params);
            httpDefault.headers=  {
                'Content-Type': 'application/json; charset=UTF-8'
            };
        }else{
            httpDefault.data = qs.stringify(params);
        }

    }
    httpDefault.url = requestUrl;
    if(addBaseUrl != null && addBaseUrl != undefined && addBaseUrl){
        axios.defaults.baseURL = '';
    }else{
        axios.defaults.baseURL = defaultConfig.base_url;
    }
    if(responseType === 'blob'){
        httpDefault.responseType = "blob"
    }
    // 注意**Promise**使用(Promise首字母大写)
    return new Promise((resolve, reject) => {
        axios(httpDefault)
        // 此处的.then属于axios
            .then((res) => {
                resolve(res)
            }).catch((response) => {
            if(reject != null){
                reject(response)
            }
        })
    })
}
// 输出函数getAxios、postAxios、putAxios、deleteAxios，供其他文件调用-----------------------------
// Vue.js的插件应当有一个公开方法 install。这个方法的第一个参数是 Vue 构造器，第二个参数是一个可选的选项对象。
export default {
    get : (url, params) => apiAxios('GET', url, params),
    post : (url, params,jsonContentType,responseType) => apiAxios('POST', url, params,jsonContentType,responseType),
    put : (url, params) => apiAxios('PUT', url, params),
    delete : (url, params) => apiAxios('DELETE', url, params),
    get_blob: (url,params) => apiAxios('GET',url,params,false,'blob'),
    api:apiAxios,
    doCloundRequest:doCloundRequest,
    install: function (Vue,props) {
        MyStore = props.store;
        Vue.prototype.$http_api = this.api;
        Vue.prototype.$http_get = this.get;
        Vue.prototype.$http_post =this.post;
        Vue.prototype.$http_put = this.put;
        Vue.prototype.$http_delete = this.delete;
        Vue.prototype.$get_blob = this.get_blob;
    }
}