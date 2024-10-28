<template>
  <div style="height: 100%">
    <router-view v-if="isRouterAlive"/>
  </div>
</template>

<script>
  import Config from "@_src/api/app.config";

  export default {
    name:"App",
      data(){
        return{
            isRouterAlive: true
        }
      },
    created() {
      document.addEventListener('visibilitychange',  ()=> {
        if(this.$store.getters.token){
          if (this.$store.getters.token != window.localStorage.getItem('jt')) {
            this.$alert('登录用户信息已过期，即将刷新页面并跳转至首页！', '温馨提示', {
              confirmButtonText: '确定',
              type: 'warning',
              showClose:false,
            }).then(() => {
              window.location.href = this.$router.options.base+ '/home/index'
            });
          }
        }
      });
    },
      mounted(){
        let themeUrl = "/"+Config.context+"/static/theme/"+this.$store.getters.globalSetting.themeStyle.substr(1)+"/index.css";
        //let themeUrl = "../static/theme/"+this.$store.getters.globalSetting.headerStyle.substr(1)+"/index.css";
        this.dynamicLoadCss(themeUrl);
      },
      methods:{
        onUserClick(command){
          switch(command){
            case "user":
              this.$router.push("/iot/portal/setting");
              break;
            case "exit":
              this.$store.dispatch("closeTabview","closeAll");//用户退出关闭所有标签页
              this.$emit('logout','exit');
              if (Config.active == "cms") {
                this.$store.dispatch("globalSetting", {globalSiteId: ""});   //清空站点
              }
              this.$router.push({
                path:'/logout'
              });
              break;
            case "home":
              this.$router.push("/");
              break;
            case "changePassword":
              this.modifyPwd = true;
              break;
          }
        },
          dynamicLoadCss(url) {
              var head = document.getElementsByTagName('head')[0];
              var link = document.createElement('link');
              link.type='text/css';
              link.rel = 'stylesheet';
              link.href = url;
              head.appendChild(link);
          },
          /**
           * 全局页面刷新方法
           * inject: ['reload'],//在需要使用页面注入刷新事件
           * 如下示例：
               export default {
                  name:"App",
                  inject: ['reload'], //在此处注入
                  data(){
                    return{}
                  }
               }
               this.reload()  //使用刷新
           */
          reload () {
              this.isRouterAlive = false
              this.$nextTick(function() {
                  this.isRouterAlive = true
              })
          }
      },
      provide () {
          return {
              reload: this.reload
          }
      }
  };
</script>
<style lang="less">
@import './styles/common.less';
</style>
