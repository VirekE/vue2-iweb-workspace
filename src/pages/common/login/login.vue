<style src="./login.less" lang="less" scoped>
</style>
<template>

<div class="app">
    <div class="login-container">
        <div class="login bounceInDown animated">
            <div class="login-left">
                <div class="login-time" id="time"></div>
                <div class="login-tit">
                    <img style="width: 380px" :src="loginLogo">
                    <p class="title">{{title}}</p>
                    <!--<p>v{{version}}</p>-->
                </div>
            </div>
            <div class="login-right">
                <div class="login-main">
                    <h4 class="login-title">
                      <div class="el-select">
                          <div class="el-input"  id="select">
                              <input type="text" readonly placeholder="用户登录" class="input el-input__inner" id="choose">
                              <span class="select-icon" style="display:none"><i class="img-down "></i></span>
                              <!--<span class="select-icon"><i class="img-up hide"></i></span>-->
                          </div>
                      </div>
                    </h4>
                    <div class="el-dropdown hide" id="el-dropdown" style="display:none">
                        <div class="wrap">
                            <div class="scroll" >
                                <ul id="choose-item">
                                    <li>租户1 用户登录</li>
                                    <li>租户2 用户登录</li>
                                </ul>
                            </div>
                        </div>
                        <div class="arrow"></div>
                    </div>
                    <div class="login-form el-form">
                        <div class="top" v-show="isWeakPassWord">系统检测到密码强度过弱，请修改密码重新登录</div>
                        <div class="form-item">
                            <input type="text" autocomplete=“off” ref="username" class="el-input el-input__inner" placeholder="请输入用户名">
                            <span class="pre-icon pre-icon-man"><img src="../../../images/login/icon.png" alt=""></span>
                        </div>
                        <div class="form-item">
                            <input type="password" autocomplete=“off” ref = "password" @keyup.enter="onLogin" class="el-input el-input__inner" id="pwd" placeholder="请输入密码">
                            <span class="pre-icon pre-icon-pwd"><img src="../../../images/login/icon.png" alt=""></span>
                            <span class="suffix-icon" id="showPwd" @click="onChange('password')"><img src="../../../images/login/icon.png" alt=""></span>
                        </div>
                        <div class="form-item" v-show="isWeakPassWord">
                            <input type="password" autocomplete=“off” ref = "newPwd" class="el-input el-input__inner" id="newPwd" placeholder="请输入新密码">
                            <span class="pre-icon pre-icon-pwd"><img src="../../../images/login/icon.png" alt=""></span>
                            <span class="suffix-icon" id="showNewPwd" @click="onChange('newPwd')"><img src="../../../images/login/icon.png" alt=""></span>
                        </div>
                        <div class="form-item" v-show="isWeakPassWord">
                            <input type="password" ref = "newSecondPwd" class="el-input el-input__inner" id="newSecondPwd" placeholder="请重新输入确认密码">
                            <span class="pre-icon pre-icon-pwd"><img src="../../../images/login/icon.png" alt=""></span>
                            <span class="suffix-icon" id="showNewSecondPwd" @click="onChange('newSecondPwd')"><img src="../../../images/login/icon.png" alt=""></span>
                        </div>
                        <div class="careful" v-show="isWeakPassWord">注意：新密码必须至少8位含大小写字母、数字、特殊符号(!,@,_等)构成的密码</div>
                      <div class="form-item itemLogin">
                        <input type="text" ref = "verifyCode" class="el-input el-input__inner" id="yanzm" placeholder="请输入验证码">
                        <yanzhengma @yzmClick="getYzmData" :yzmData="yzmData" v-if="yzmData"></yanzhengma>
<!--                        <span class="pre-icon pre-icon-pwd"><img src="../../../images/login/icon.png" alt=""></span>-->
<!--                        <span class="suffix-icon" id="showPwd" @click="onChange('password')"><img src="../../../images/login/icon.png" alt=""></span>-->
                      </div>
                        <div class="form-item">
                            <div class="my-button" @click="onLogin">
                                <button class="login-submit"><span>登录</span></button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
<!--  <el-dialog title="请滑动滑块到指定区域"
             class="dialogBody"
             :visible.sync="captchaDialog"
             width="360px"
             v-if="captchaDialog">
    <div class="yanzhengma">
      <slide-verify
          :l="42"
          :r="10"
          :w="310"
          :h="155"
          :imgs="bgimgs"
          @success="onSuccess"
          @fail="onFail"
          @refresh="onRefresh"
          ref="slideblock"
          :slider-text="text"
      ></slide-verify>
    </div>
  </el-dialog>-->
</div>
</template>

<script>
  import base from '@_src/core/base';
  import CryptoJS from 'crypto-js'
  import AesJs from '@_src/utils/AesUtil.js'
  import Config  from "@_src/api/app.config";
  import Navbar from '@_src/components/frame/admin/navbar';
  import Yanzhengma from "./yanzhengma";
  import appConfig from "../../../api/app.config";
  const Base64 = require('js-base64').Base64;
  export default {
    components: {Yanzhengma},
    mixins: [base],
    data() {
        return {
          username:'',
          password:'',
          newPwd:'',
          newSecondPwd:'',
          bgimgs: [require('../../../../static/img/tree.png'), require('../../../../static/img/tree.png')],
          captchaDialog:false,
          text: "向右滑动~",
            title:"",
            version:"1.0.0",
            ruleForm:{},
            rules:{},
            loginCancle:-1,
          yzmData:'',
        };
    },
    watch:{
    },
    computed: {
      loginLogo(){
        return require('../../../images/login/logo-'+ appConfig.img +'.png')
      },
        isWeakPassWord(){
            if(this.loginCancle == 1){
                return true
            }
            return false
        },
    },
    methods: {
      onLogin(){
        this.onSuccess()
      },
      onSuccess(){
        let _this = this;
        var invalidPwd=Config.invalidPwd;
        var username = this.$refs.username.value;
        var password = this.$refs.password.value;
        var verifyCode = this.$refs.verifyCode.value;
        let rex = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[~!@&%#_])[a-zA-Z0-9~!@&%#_]{8,18}/;
        if(username == null || username.length==0){
          alert("请输入用户名");
          this.$refs.username.focus();
          return;
        }
        if(password == null || password.length==0){
          alert("请输入密码");
          this.$refs.password.focus();
          return;
        }
        if(this.loginCancle == 1){
          // var rex = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[~!@&%#_])[a-zA-Z0-9~!@&%#_]{8,18}/;
          var zhenze =new RegExp(rex);
          if(this.$refs.newPwd.value == null || this.$refs.newPwd.value.length==0){
            alert("请输入新密码");
            this.$refs.password.focus();
            return;
          }else if(!zhenze.test(this.$refs.newPwd.value) || invalidPwd.indexOf(this.$refs.newPwd.value) > -1){
            alert("新密码格式错误，请重新输入");
            return;
          }else if(this.$refs.newPwd.value.length>18){
            alert("新密码大于18位请更改");
            return;
          }
          if(this.$refs.newPwd.value !== this.$refs.newSecondPwd.value){
            alert("确认密码和新密码不一致，请重新输入");
            this.$refs.password.focus();
            return;
          }
          this.$http_api('get',Config.appInfoUrl,{},false,null,true).then((ret)=>{
            let parameter = {
              account: username,
              id: (ret.row.USER && ret.row.USER.id) || ret.row.id,
              oldPassword: CryptoJS.MD5(password+'').toString(),
              newPassword: AesJs.encrypt(this.$refs.newPwd.value)
            };
            this.$http_post(Config.baseContext+'/mssq/pmi/updateUserPassword',parameter).then(ret => {
              if (ret.state == 1) {
                loginMethods(this.$refs.newPwd.value)
              }else{
                if(ret.message!=null){
                  this.$message.error(ret.message);
                }else{
                  this.$message.error("系统异常");
                }
              }
            }).catch(err => {
              console.log(err);
            });
          })
        }else{
          loginMethods(password);
        }
        function loginMethods(pass) {
          _this.login(username,pass,verifyCode,(ret)=>{
            if(ret.state==1){
              _this.$store.dispatch("setCookieToken",ret.message);
              var exp = new Date();
              var Days = 1;
              exp.setTime(exp.getTime() + Days*24*60*60*1000);
              document.cookie = "ewtk="+ret.message+ ";path="+"/"+";expires=" + exp.toGMTString();
              let redirect = _this.$route.query.redirect;
              localStorage.setItem("dialogState","0"); //设置密码框不打开
              if(!rex.test(pass) || invalidPwd.indexOf(pass) > -1 || pass.length>18){
                localStorage.setItem("dialogState","1"); //设置密码框是否打开
                _this.loginCancle = localStorage.getItem("dialogState"); //设置密码框是否打开
              }else{
                redirect = '/home/index';
                _this.$router.push(redirect);
              }
            }else if(ret.state === 0){
              alert(ret.message || '登录失败，请重新登录');
              _this.getYzmData();
            }else if(ret.state === undefined){
              alert('资源获取失败');
              _this.getYzmData();
            }
          })
        }
      },
      onFail(){
        this.$refs.slideblock.reset();
      },
      onRefresh(){
        console.log('点击了刷新小图标');
        // this.msg = ''
      },
        onChange(type){
            if( this.$refs[type].type == 'password'){
                this.$refs[type].type = 'text'
            }else{
                this.$refs[type].type = 'password'
            }
        },
        confirmModify(){
            this.$refs.ruleForm.validate((valid) => {
                if (valid) {
                    let user = this.$store.getters.curUser;
                    if(user!=null){
                        let parameter = {
                            account: user.account,
                            id: user.id,
                            oldPassword: CryptoJS.MD5(this.ruleForm.oldPwd+'').toString(),
                            newPassword: AesJs.encrypt(this.ruleForm.pass)
                        };
                        const rLoading = this.openLoading('修改中...');
                        this.$http_post(Config.baseContext+'/mssq/pmi/updateUserPassword',parameter).then(ret => {
                            if (ret.state == 1) {
                                this.modifyPwd = false;
                                this.$message.success("修改成功");
                                this.onUserClick("exit");
                                localStorage.removeItem("dialogState")
                            }else{
                                if(ret.message!=null){
                                    this.$message.error(ret.message);
                                }else{
                                    this.$message.error("系统异常");
                                }
                            }
                            rLoading.close();
                        }).catch(err => {
                            rLoading.close();
                            console.log(err);
                        });
                    }
                } else {
                    return false;
                }
            });
        },
      getYzmData(){
        this.yzmData = '';
        var url = this.Config.baseContext + "/sso/bsp/verifyCode";
        this.$http_post(url,{}).then(ret => {
          if (ret.state == 1) {
            this.yzmData = String(ret.message);
          } else {
            this.$message.error(ret.message);
          }
        });
      }
    },
    mounted(){
        // $('body').addClass('custom-'+this.$store.getters.globalSetting.themeStyle.substr(1));
        // this.open1();
        this.title = Config.title;
        this.version = Config.version;
        var user = this.$store.getters.curUser;
        let redirect = this.$route.query.redirect;
        if(this.isNotNull(redirect)){
            redirect =  Base64.decode(redirect);
        }else{
            redirect = "/"
        }
        this.getYzmData();
        if(!this.isEmptyObject(user)){
            this.$router.push(redirect);
        }
    },
    created() {
    }
  };
</script>
<style lang="less" scoped>
    .careful{
        font-size: 12px;
        color: rgba(71, 71, 71, 0.9);
    }
    .top{
        color: #F56C6C;
    }
    .dialogBody{
      :deep(.el-dialog){
        position: relative;
        margin: 0 auto 50px;
        background: #fff;
        border-radius: 2px;
        box-shadow: 0 1px 3px rgba(0,0,0,.3);
        box-sizing: border-box;
      }
    }
    .login-form{
      .itemLogin{
        display: flex;
        .el-input{
          height: 38px;
          line-height: 38px;
          padding-left: 0;
        }
      }
    }
</style>