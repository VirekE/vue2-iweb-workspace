//系统配置
var SysConfig = {
  context: 'qz-mssq',
  img : "lz", //
  wordKey:false,
  title:"民生诉求事项系统",
  "depends":["mssq"],
  base_url:"/local",//调用本地服务填写local  调用ebus填写ebus
  baseContext:"/mssq",//服务上下文. 如：本地服务填写后台服务虚拟路径 网关访问填写网关地址如：zwfw
  indexPath:"/catalog/list",//系统首页地址
  app_key:"qzqd",//网关appKey,
  app_security:"619519756935888897",//网关appSecret
  app_code:"INSPUR-QZQD-MSSQ",//系统编码
  loginUrl: "/local/mssq/sso/bsp/login",
  is_test: true,//是否测试环境.为true 是，会在系统头部添加显眼的测试环境4大字,控制头部退出按钮，为是，隐藏头部退出按钮，//控制是否显示登录页面，为是，不显示登录页面
  appInfoUrl: "/local/mssq/sso/bsp/appinfo/INSPUR-QZQD-MSSQ",
  tokenUrl: "",
  invalidPwd:["!QAZ2wsx"],
};
//应用配置
var AppConfig = {
  rcPath: 'http://116.172.193.233:18000/local/mssq/mssq/mssqRc',//文件预览路径
}
for(var key in AppConfig){
  SysConfig[key] = AppConfig[key]
}

module.exports = SysConfig
