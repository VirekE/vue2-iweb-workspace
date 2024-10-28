<template>
  
</template>

<script>
  import Config  from "@_src/api/app.config";

  export default {
    name: "todoLogin",
    mounted(){
      if(this.$route.query.token){
        this.$http_get(Config.baseContext+'/api/sso/login',{
          token:this.$route.query.token
        }).then(ret => {
          if (ret.state == 1) {
            let obj = {
              catalogTodo:'/catalog/examine',
              itemTodo:'/item/todo-list',
              catalogTodoInfo:'/catalog/minor_edit',
              itemTodoInfo:'/item/info',
            };
            let typeCode = this.$route.query.typeCode
            let params = {
              jumpType:'dandian'
            }
            if(this.$route.query.id){
              //判断路由是否有id，有id跳转详情页  this.$route.query.typeCode+'Info',没有id跳转相对应列表页
              typeCode = typeCode + 'Info'
              params = {
                id:this.$route.query.id,
                jumpType:'dandian'
              }
            }
            //存token
            this.$store.dispatch("setCookieToken",ret.message);
            if(typeCode && obj[typeCode]){
              //跳转
              this.$router.push({
                path:obj[typeCode],
                query:params
              });
            }else{
              //如果都不成立跳转首页
              this.$router.push('/home/index');
            }
            this.$message.success('登录成功');
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
    }
  }
</script>

<style scoped>

</style>