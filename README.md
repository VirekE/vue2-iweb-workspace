
# 0. 准备动作 
```
1.node最新环境
2.安装cnpm npm install -g cnpm
3.切换到私有仓库
cnpm config set disturl https://npmmirror.com/mirrors/node
cnpm config set registry http://117.73.3.108:7001
4.安装iweb cnpm install -g @jangod/iweb-cli
5.cnpm install
```
# 1. 运行项目
```
1.cnpm run dev
```
# 2. 安装依赖
```
npm install 
iweb install
```

# 3. web端本地调试
```
iweb server 

访问地址
http://127.0.0.1:9394/local/html/index.html
```

# 4. 编译发布
```
iweb build
iweb publish
```

# 5. 项目结构
```
├── dist                              编译目录
│   ├── html                          静态模板
│   │   └── index.html           
│   ├── css                           样式文件
│   │   └── index.css
│   │   js                            脚本文件
│   │   └── index.js
├── src                               源文件目录
│   ├── pages                         项目页面集合
│   │   └── index                     /local/html/index.html
│   │       ├── components            页面相关组件
│   │       ├── images                图片集
│   │       ├── main.js               页面入口
│   │       ├── index.vue             视图文件
│   │       ├── index.js              业务逻辑文件
│   │       ├── index.less            样式文件
│   │       └── data.js               cgi数据文件
│   ├── components                    公共组件库
│   │   ├── {componentName}           组件名
│   │   │   ├── index.js              组件入口
│   │   │   └── src                   组件vue
│   ├── core                          公共核心方法（提供给vue mixins）
│   │   ├── base.js
│   ├── styles                        公共样式
│   ├── fonts                         公共字体
│   ├── utils                         公共工具类
│   └── images                        公共图片
│       
├── README.md
├── package.json
└── iweb.config.js                    wefe编译器配置
```

#实际编译过程--add by yuh
```
浪潮开发人员环境：
node-v14.17.6
本地dev环境：
node-v14.21.3
npm-6.14.18

涉及python2，通过conda管理切换python环境，也可以主机直接安装python2
conda create -c 'https://repo.continuum.io/pkgs/free/osx-64' -n python27 python=2.7
conda activate python27

cnpm config set registry http://117.73.3.108:7001
cnpm install -g @jangod/iweb-cli
或
cnpm install -g @jangod/iweb-cli --registry=http://117.73.3.108:7001

npm install

启动的时候根据报错又额外安装了以下内容：
npm i colors -g
npm i lru-cache -g
npm i minimatch -g

npm install sockjs-client
npm install --save ansi-html-community loglevel

启动后台服务，登陆页面：
http://127.0.0.1:9396/qz-mssq/

默认帐户：sq_zsj  gm_zsj sq_zgh sq_ghzzb gm_mzj gm_mzjfwzx
默认密码：Mssq@2022
```
