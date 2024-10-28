const os = require('os');
const path = require('path');
const CopyWebpackPlugin = require("copy-webpack-plugin")
const devServerPort = 9396;
const Config = require("./static/config/application");
const GenerateConfig = require('./src/utils/generate-config');
const Global = GenerateConfig();
module.exports = {
    // wepack配置项 - webpack-chain方式
    // https://github.com/mozilla-neutrino/webpack-chain
    // 见->Merging Config
    webpack: {
        plugin: {
            "CopyWebpackPlugin": {
                plugin: CopyWebpackPlugin,
                args: [
                    [
                        {
                            from: path.resolve(__dirname, './static'),
                            to:"static",
                            ignore: ['.*']
                        }
                    ]
                ]
            },
            // "babel-loader":{
            //     presets: ['@babel/preset-env']
            // }
        },
        // 本地开发服务配置
        devServer: {
            port: devServerPort,
            // host: '203.175.139.52',
            host: '127.0.0.1',
            contentBase: false,
            // integrity: true,
            compress: false,
            publicPath: '/'+Config.context+'/',
            disableHostCheck: true,
            historyApiFallback: {
                rewrites: [
                    { from: /.*/, to: path.posix.join("/"+Config.context, 'index.html') }
                ]
            },
            //正式环境
          proxy: {
              '/ebus/*': {
                  target: Config.ebusUrl,
                  secure: false
              },
              '/sso/*': {
                  target: Config.ebusUrl,
                  secure: false,
              },
              '/local/*': {
                    target: Config.localApi,
                    secure: false,
                    pathRewrite:{
                    '^/local':''
                    }
                  },
           },
            headers: {
                'X-Custom-Foo': 'bar',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
                'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization',
            }
        }
        ,
        output: {
            publicPath: "/"+Config.context+"/"
        }
    },
    baseConfig: {
        cCategory: false, // 关闭文件分类
        cExt: false, // 关闭文件扩展命名
        dist: path.resolve(`${process.cwd()}/`+Config.context+'/'), // 编译路径
        publicPath: '/'+Config.context+'/' // 资源路径
    },
    eslintOptions: {
        configFile: require.resolve('./.eslintrc.js'),
        ignorePath: require.resolve('./.eslintignore'),
        useEslintrc: false
    },
    beginAction: [
        function (options) {
            console.log('=====>beginAction:', options)
        },
        {
            key: 'test'
        }
    ],
    endAction: [
        function (options) {
            console.log('=====>endAction:', options)
        },
        {
            key: 'test'
        }
    ],
    publish: ['iweb-action-publish', {
        mkdir: '', // 发布目标机器创建路径
        // 文件分类发布目标机器路径
        path: {
            html: '',
            css: '',
            js: '',
            image: ''
        },
        // 发布目标机器sftp连接配置 ----  server可以是require路径，将配置不放在项目里
        server: {
            host: '127.0.0.1',
            port: '9999',
            username: 'usrname',
            password: 'password',
        }
    }],
    presets: [
        '@jangod/iweb-fix-splitchunk',
        '@jangod/iweb-fix-vue',
        '@jangod/iweb-fix-scene',
        '@jangod/iweb-fix-babel',
        //'@jangod/iweb-fix-eslint'
    ]
};


