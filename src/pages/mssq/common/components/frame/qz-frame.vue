<style lang="less" src="@_src/components/frame/admin/index.less" scoped></style>
<template>
    <div class="shell">
        <el-header v-if="Config.login_type !='sso'&&$route.query.iframeType!=1"  height="84">
            <Navbar @message="onNavbarMessage"/>
            <Tabview />
        </el-header>
        <el-container class="app-wrapper" :style="{top:hideTitle||$route.query.iframeType==1?'0px':''}">
            <Sidebar v-if="$route.query.iframeType!=1"/>
            <el-container class="main-container" :style="$route.query.iframeType==1?'paddingTop:0px':''">
                <el-main  class="main" ref="router" :style="$route.query.iframeType==1?'margin:0px':''">
                  <router-view v-if="isLogin" />
                </el-main>
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
    import Tabview from '@_src/components/frame/admin/tabview';
    import BspApi from '../../../../../api/BspApi';
    export default {
        mixins: [base],
        name:"qz-frame",
        data() {
            return {
                rightPanelShow:false,
                hideTitle: false,
            };
        },
        computed:{
            isLogin(){
                var userInfo = this.$store.getters.curUser;
                let phone = '';
              if(userInfo&&userInfo.attrMap&&userInfo.attrMap.PHONE){
                phone = userInfo.attrMap.PHONE.substring((userInfo.attrMap.PHONE.length-4),userInfo.attrMap.PHONE.length);
              }

                if(this.isEmptyObject(userInfo)){
                    return false;
                }else{
                  this.$watermark.set(userInfo.name + '  ' + phone,this.$refs.router.$el,true)
                  return true;
                }
            }
        },
        methods: {
            onNavbarMessage(msg){
                if("setting"==msg.type){
                    this.$refs.rightPanel.show();
                }
            },
        },
        created() {
        },
        mounted(){
          BspApi.getAppInfo();
        },
        components:{
            Navbar,
            Sidebar,
            Tabview,
            RightPanel
        }
    };
</script>
<style scoped>
    .main{
        padding: 0px!important;
    }
</style>