
<style lang="less" src="./index.less" scoped></style>
<template>
  <div class="shell">
    <el-header v-if="loginType !='sso'"  height="84">
      <Navbar @message="onNavbarMessage"/>
      <Tabview />
    </el-header>
    <el-container class="app-wrapper" :style="{top:hideTitle?'0px':''}">
      <Sidebar/>
      <el-container class="main-container">
        <el-main  class="main">
          <router-view v-if="isLogin" ref="router"/>
          
        </el-main>
      </el-container>
      <RightPanel ref="rightPanel" />
    </el-container>
  </div>
</template>

<script>
  import base from '@_src/core/base';
  import Navbar from './navbar';
  import Sidebar from './sidebar';
  import RightPanel from './right-panel';
  import Tabview from './tabview';
  import Config  from "@_src/api/app.config";
  import BspApi from '../../../api/BspApi'
  export default {
      mixins: [base],
      inject: ['reload'],//注入刷新事件
      name:"AdminFrame",
      components:{
          Navbar,
          Sidebar,
          Tabview,
          RightPanel
      },
      data() {
         return {
             rightPanelShow:false,
             hideTitle: Config.hide_title,
             loginType:Config.login_type,
         };
      },
      mounted(){
        debugger
          BspApi.getAppInfo();
      },
      watch:{

      },
      computed:{
         isTabview(){
             return this.$store.getters.globalSetting.tabView;
          },
            isLogin(){
              var userInfo = this.$store.getters.curUser
                if(this.isEmptyObject(userInfo)){
                    return false;
                }else{
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
        handleUser(ret){
          if(ret.state == 1){
              var user = ret.row.USER;
              user.menus = ret.row.menus;
              this.$store.dispatch("setUser",user)
              this.isLogin = true;//获取用户之前，不作其他请求。
            }else{
              // this.$router.push({
              //   path: '/login'
              // });
            // this.$alert('获取用户信息失败，请重试', '系统提示', {
            //   type: 'error',
            //   confirmButtonText: '确定',
            //   callback: () => {
            //     window.location.reload();
            //   }
            // });
          }
        },
        showData(){
          this.$router.push({
            path: '/ImportSpeed',
            query: {}
          });
        }
    },
      created() {}
  };
</script>