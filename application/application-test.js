//系统配置
var SysConfig = {
    context: 'qz-mssq',
    img : "mssq", //yjs
    "depends":["mssq"],
    title:"深圳市民生诉求事项管理系统",
    base_url:"/ebus",//调用本地服务填写local  调用ebus填写ebus
    baseContext:"/qzqd/mssq",//服务上下文. 如：本地服务填写后台服务虚拟路径 网关访问填写网关地址如：zwfw
    indexPath:"/catalog/list",//系统首页地址
    app_key:"qzqd",//网关appKey,
    app_security:"627981155370532865",//网关appSecret
    app_code:"INSPUR-QZQD-MSSQ",//系统编码
    loginUrl: "/ebus/sso/bsp/login",
    is_test: true,//是否测试环境.为true 是，会在系统头部添加显眼的测试环境4大字
    appInfoUrl: "/ebus/sso/bsp/appinfo/INSPUR-QZQD-MSSQ",
    tokenUrl: "",
    invalidPwd:["!QAZ2wsx"],
};
//应用配置
var AppConfig = {
    rcPath: "/qz-mssq/rc",//文件预览路径
}
for(var key in AppConfig){
    SysConfig[key] = AppConfig[key]
}
module.exports = SysConfig
