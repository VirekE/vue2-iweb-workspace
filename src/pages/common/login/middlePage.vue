<template v-if="false">
  
</template>

<script>
  import Config  from "@_src/api/app.config";

  export default {
    name: "middlePage",
    mounted(){
      if(this.$route.query.token){
        this.$http_get(Config.baseContext+'/api/sso/login',{
          token:this.$route.query.token
        }).then(ret => {
          if (ret.state == 1) {
            this.$store.dispatch("setCookieToken",ret.message);
            this.$message.success('登录成功');
            this.$router.push('/home/index');
          }else{
            if(ret.message!=null){
              this.$message.error('单点登陆失败');
            }else{
              this.$message.error("系统异常");
            }
            this.$router.push('/login');
          }
        }).catch(err => {
          console.log(err);
        });
      }else{
        this.$router.push('/login')
      }
    },
  }
</script>

<style scoped>

</style>