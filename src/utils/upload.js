import AppConfig from "@_src/api/app.config";
import SHA256 from "crypto-js/sha256";

const setHeaders = function() {
  function S4 () {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
  }
  function guid () {
    return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
  }
  function getSignature (timestamp, token, nonce, busiString) {
    var strSignData = timestamp + token + nonce + busiString + timestamp;
    return SHA256(strSignData).toString().toUpperCase();
  }

  var now = new Date().getTime() / 1000;
  var timestamp = now + "";
  var nonce = guid();//非随机字符串
  var sign = getSignature(timestamp, AppConfig.app_security || '', nonce, '');
  var headerObj = {
    "x-aep-appkey": AppConfig.app_key || '',
    "x-aep-timestamp": timestamp,
    "x-aep-nonce": nonce,
    "x-aep-signature": sign
  }

  return headerObj;
}


export default {
  // 本地化接口
  // 第三方对接接口
  setHeaders
}
