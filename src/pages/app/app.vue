<style lang="less" src="@_src/components/frame/admin/index.less" scoped></style>
<template>
    <div class="shell" v-show="isShow">
        <el-header  height="84">
            <Navbar @message="onNavbarMessage"/>
        </el-header>
        <el-container class="app-wrapper">
            <Sidebar @changeUrl="onUrl"/>
            <el-container class="main-container">
                <iframe v-if="isLogin" :src="iframeUrl"
                        frameborder="0"
                        height="100%"
                        width="100%"></iframe>
            </el-container>
            <RightPanel ref="rightPanel" />
        </el-container>
    </div>
</template>

<script>
    import base from '@_src/core/base';
    import Navbar from '@_src/components/frame/admin/navbar';
    import Sidebar from '@_src/components/frame/admin/sidebar';
    import RightPanel from '@_src/components/frame/admin/right-panel';
    import BspApi from '../../../src/api/BspApi'
    const Base64 = require('js-base64').Base64;
    export default {
        mixins: [base],
        inject: ['reload'],//注入刷新事件
        name:"app",
        components:{
            Navbar,
            Sidebar,
            RightPanel
        },
        data() {
            return {
                isShow:false,
                rightPanelShow:false,
                isLogin: false,
                iframeUrl:"./"
            };
        },
        mounted(){
            if(this.$route.params.appCode=='xxx'){
                this.$prompt('请输入应用编码来访问应用（base64编码）', '提示', {
                    confirmButtonText: '确定',
                    showCancelButton: false,
                    showClose: false,
                    closeOnClickModal: false,
                    closeOnPressEscape: false,
                    closeOnHashChange: false,
                    inputPattern: /^[\s\S]*.*[^\s][\s\S]*$/,
                    inputErrorMessage: '请输入应用编码'
                }).then(({ value }) => {
                    this.$router.push({
                        path: '/login',
                        query:{
                            code: value
                        }
                    });
                    this.isShow = true;
                }).catch(() => {
                    this.isShow = true;
                });
            }else{
                if(this.$route.params.appCode!=undefined){
                    let appCode = Base64.decode(this.$route.params.appCode);
                    BspApi.getUserInfo(this.handleUser,appCode);
                }else{
                    BspApi.getUserInfo(this.handleUser);
                }
                this.isShow = true;
            }
            this.tooggleClass();//初始化皮肤
        },
        watch:{

        },
        computed:{

        },
        methods: {
            //打开主题设置
            onNavbarMessage(msg){
                if("setting"==msg.type){
                    this.$refs.rightPanel.show();
                }
            },
            //初始换肤
            tooggleClass(){
                let className = "custom-"+this.$store.getters.globalSetting.themeStyle.substr(1);
                if(!className){
                    return
                }
                document.body.className = className;
            },
            //打开菜单对应页面
            onUrl(value){
                this.iframeUrl = value+"?iframeType=1";
            },
            //获取登录用户信息
            handleUser(ret){
                if(ret.state == 1){
                    var user = ret.row.USER;
                    user.URL = ret.row.URL;
                    // user.URL = "http://127.0.0.1:9395/qz-admin";//测试
                    user.menus = ret.row.menus;
                    user.SHORT_NAME = ret.row.SHORT_NAME;
                    user.SIDE_NAME = ret.row.NAME;
                    this.$store.dispatch("setUser",user);
                    this.isLogin = true;//获取用户之前，不作其他请求。
                }else{
                    if(ret.message == '用户无权访问此系统'){
                        this.$router.push({
                            path: '/admin/noPermission'
                        });
                    }else{
                        if(ret.message!=null&&ret.message!=''){
                            this.$message.error(ret.message);
                        }else{
                            this.$message.error('系统异常，请重新登录');
                        }
                        this.$router.push({
                            path: '/login',
                            query:{
                                code: this.$route.params.appCode
                            }
                        });
                    }
                }
            }
        },
        created() {}
    };
</script>
<style scoped>
    .main-container{
        padding-top: 0px;
    }
</style>