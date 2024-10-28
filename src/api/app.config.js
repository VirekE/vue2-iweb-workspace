import Aes from '@_src/utils/AesUtil';

const application = require('../../application/application.js');
let private_config = {};
if ("development" === process.env.NODE_ENV) {
  private_config = require(`../../application/application-${application.active}.js`)
}
let result = {};
if ("development" === process.env.NODE_ENV) {
  result = Object.assign({}, application, private_config)
} else {
  let xmlhttp = null;
  if (window.XMLHttpRequest) {
    xmlhttp = new XMLHttpRequest()
  } else if (window.ActiveXObject) {
    xmlhttp = new ActiveXObject("Microsoft.XMLHTTP")
  }
  if (xmlhttp == null) {
    console.log("get_error:", "您的浏览器不支持XMLHttp")
  } else {
    xmlhttp.onreadystatechange = function () {
      if (xmlhttp.readyState == 4) {
        if (xmlhttp.status == 200) {
          try {
            let ret = JSON.parse(xmlhttp.responseText);
            let temp = ret.hash.substring(0, ret.hash.length - 42);
            let a = ret.hash.substring(ret.hash.length - 26, ret.hash.length - 10);
            let b = ret.hash.substring(ret.hash.length - 42, ret.hash.length - 26);
            let data = Aes.decrypt(temp, b, a);
            result = JSON.parse(data)
          } catch (e) {
            console.log("format_error:", e)
          }
        } else {
          console.log("get_error:", xmlhttp)
        }
      }
    };
    const context = window.location.pathname.substring(0, window.location.pathname.indexOf("/", 1))
    xmlhttp.open("GET", context + "/static/version.json", false);
    xmlhttp.send(null)
  }
}
export default result;
