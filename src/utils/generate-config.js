const Aes = require("./aes-util");
const fs = require("fs");
function generateConfig(parameter) {
    console.log('ceshi')
    let param = Object.assign({},{
        path: "static",
        config: true,
        key:"0123456789101112",
        iv:"1211109876543210"
    },parameter);
    let data = {};
    if(param.config){
        const Config = require('../../application/application.js');
        const ConfigData = require(`../../application/application-${Config.active}.js`);
        data = Object.assign({}, Config, ConfigData);
        if ("production" === process.env.NODE_ENV || (parameter&&parameter.config)) {
            let key = param.key;
            let iv = param.iv;
            let hash = Aes.encrypt(JSON.stringify(data), key, iv);
            let garble = hash.substring(7, 17);
            hash = hash + key + iv + garble;
            fs.writeFile(`./${param.path}/version.json`, '{"version":"'+Config.version+'","hash":"'+hash+'","timestamp":'+new Date().getTime()+'}', function (err) {
                if (err) {
                    return console.log(err)
                }
                console.log("配置文件已生成")
            })
        }
    }
    return data
}

module.exports = generateConfig;
