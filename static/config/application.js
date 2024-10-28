var Config = {
    active : "mssq",
    img : "mssq", //yjs
    // context: "qz-admin",
    context: 'qz-mssq',
    localApi: "http://127.0.0.1:9560",//本地开发，后台环境地址。只用于本地开发测试使用
    // localApi: "http://203.175.139.5:9560",//本地开发，后台环境地址。只用于本地开发测试使用
    // ebusUrl: "http://203.175.139.58",//本地开发，ebus环境地址。只用于本地开发测试使用

    ebusUrl: "http://127.0.0.1:9560",//本地开发，后台环境地址。只用于本地开发测试使用

    //默认激活active.如需配置多个，请打开注释，收到配置 
    // depends:[
    //     "qz"
    // ]
}
module.exports = Config