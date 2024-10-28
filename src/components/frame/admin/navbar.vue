<template>
    <div v-if="!hideTitle" class="navbar flex-row" :style="{background:themeStyle,overflow:'hidden'}">
        <div class="sidebar-logo-container flex-row">
            <div :style="{background: bgCompute}" v-if="headerMenu" @click="menu=true" class="menu">
                <i class="iconfont icon-caidan"></i>
            </div>
            <a class="sidebar-logo-link router-link-active">
                <img :src="activeImg" :onerror='defaultImg' alt=""  class="sidebar-logo">
            </a>
            <a class="subtitle" v-if="isTest">测试环境</a>
        </div>

        <!--
        <div class="f14 ml20">
            <a >工作台</a>
            <span class="ml20">
                <a class="el-popover__reference" aria-describedby="el-popover-7837" tabindex="0">
                <span >Application navigation</span>
                <i class="ml5 el-icon-caret-bottom"></i>
                </a>
            </span>
        </div>
        -->
        <div class="h100 pull-right clearfix">
            <a id="screenfull" class="pull-left">
                <svg aria-hidden="true" class="svg-icon">
                    <use xlink:href="#icon-fullscreen"></use>
                </svg>
            </a>
            <el-dropdown class="avatar-container ml30" @command="onUserClick">
                <span class="avatar-wrapper">
                    <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC4AAAAuCAYAAABXuSs3AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyhpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTQwIDc5LjE2MDQ1MSwgMjAxNy8wNS8wNi0wMTowODoyMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6ODFBOUFERjMxMzEzMTFFOUJBN0RFOEJERTY0MUQwREYiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6ODFBOUFERjIxMzEzMTFFOUJBN0RFOEJERTY0MUQwREYiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTcgKE1hY2ludG9zaCkiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpDMTk2QjE3MzczOTUxMUU4QjFBQUM2MUU4MTg2RUJCMSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpDMTk2QjE3NDczOTUxMUU4QjFBQUM2MUU4MTg2RUJCMSIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PjZevGIAAAV5SURBVHjazFndbxRVFD/7PfvR3W26hRaIlgLKkiAtIlgLbUyERIgxRB/xTaM84IPoX6ESlQSiifGhrz4ZhRDwAQmvIiZCiy21lH7bbnc7uzO7O7vrObN3l107O3PnY5Oe5EfJzr3n/Obcc889545rbW0NbEocMcLwEuI5xDZEmD3PIpYRTxB/Iu4gbiPW7Rh1WSQeQLyLOIc4ifCYnF9C3EKMIX5E5NtNPIg4j/gEsROckXnEl4irCKkdxN9EXEbsgfbIFOIC4jrPYDfHGAFxBXGtjaSB6b7GbAl3b9yw5fHtiJ8RR3gsZ1IpWF1aAjGdBimXg5KiqL97vF4IRSLQEYtBorcXwh0dRqp+R5xGLFkh3o+g195rZCWNOqYnJiCbyXC5trO7G/qTSRCCQb1hk4hTiGkzxHextNVnROLJ5CTMTk2Zjgtahf0DAxDv6tIb9g/iBOIpT4yHED/xkJ559MgSaTUfYhg9vHcPRP1V6mNcQjzEv0IMGhmmWH46PW1rN5ZLJZi4fx/K5bLeMOLytRFx2hAfGHoLDT4eH3cklci4iednZoyGvc+4aRKntPcNj7HF2VkoyLJjeXABiVcqFaNhlxnHTcTP8+ZpIu6kFPJ5WF9dNRrWzzg2Eafa41MeI5TyaHmdltTKCs+wz2perxGngmkHz0wOz1iSjXWuYrEX8U4j8fe4DeCpqFZboRDEOzttkXW5XNCVSKj/z2Wx+jWO8zpXN6un3zCTBUiOvvYqHH99BPbtf8ESaY/HA0eGjsLQyDBE4zE1NRYKBZ6pxDVOxEfN1NOyJIHf74eOaLXeePFAEg4OHlKJ8IrP54Njw0OwvaenWgKwlVP4iJOhUS/+c5z7wMCDgk68UDTa9Pvzu/sggfXH+F8PYGFuXldHV3cCDh0ehFD42WHo8/vq5wOnnCDiSd7RFZ0TLhwJw8vHXlFjdW52DlaWlyGTzqhkgkFBfbEdu3ZCYlu3ht5qbFf4YpwkScT3ma4zdDwTCofVuDcT+7XYpsKLU/ZSjPeYyQKNhpySHNvwJvZJgl4xyjvajYrPnH0bGH/HRMxssFj3806JUD1eMWMkIvjB53GD06KUyrAhc69kgRhkTC1rvgjFUtlR0qQvi3rNLBIRXzRVQ+POF9Ez+WLJEdKkh/SVK6YW/l8i/relOrqogDlbGum1UtVjQSaJuKWOgDwkFYu2iNP8srW3f+hmTbHlZS4o1kKG5tkItztE/Da7y7MktKnMkqfxJjdj0/mH+I2IUyF8y86SE4lcoWh4ZNNzGmuDNMmv1HfUEvKYE9khLRVAKiiaOZp+p+dWQ6tBxhovhKgdesw6DNvSGRaa27KsY431Aus95ZrHSfPnsPXlC8a1qcu/yry+VYW4XdG6nqA3ubCFiX9c87bWTRbdT3+/BUn/gPilqcTWuK2lnuouYsAotcmyDPl8HmLYygnYfnmxavS4XQj3plOWxpew06EMI2PqTGcyEAgEQBCEep3fQv5ADFN91+oKrl4AIt5CtLzQI7KpVAqy2KYp2IOK4gaWui7wez2bSKtGXNWXoec0jsbTPJpPekhfC5lhXDbdQBld7N9kf5/Vk6KoelqrO4qEghDG/jKget8LbvR+WfWyAnn0claSQcxJmgcVeT4Sifx/M55slTCMPqX0sNg6rEfaKWkgT59SzuiV3EatzCKLr++oz2wnaTWtoX608y2zqdsn8PRgxPZDSZLIA1Nt5E26T6OdjxrTnh3i1XpDUShVHkRcZEevk8f4Rab7uqLwNRZmu1768nsJsRuqn8NvWiyJS2zuOabrEpj4qsyzOeuSTqehqN3x0MXfKIvLAywL0ffRWooQofq9krLDA3ZGUA+QanWvGIvFDPn8J8AAuXtE1A2IqGcAAAAASUVORK5CYII=" class="user-avatar">
                    <span style="padding:4px;" v-if="curUser !=null">{{curUser.name}}</span>
                    <i class="el-icon-caret-bottom f12"></i>
                </span>
                <el-dropdown-menu slot="dropdown" >
<!--                    <el-dropdown-item icon="el-icon-s-home" command="home">主页</el-dropdown-item>-->
                    <!-- <el-dropdown-item icon="el-icon-user-solid" command="user">用户中心</el-dropdown-item> -->
<!--                    <el-dropdown-item icon="el-icon-edit" id="updatePwd" command="changePassword">修改密码</el-dropdown-item>-->
                    <el-dropdown-item v-if="Config.is_test" icon="el-icon-circle-close" command="exit">退出</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
            <a class="mr15" href="javascript:void(0)" @click="onSetting">
                <i class="el-icon-s-tools"></i>
            </a>
        </div>
        <div v-if="menu" @click="menu=false" class="menu-content">
            <div @click.stop="($event)">
                <el-popover
                        placement="right-start"
                        width="800"
                        popper-class="header-product"
                        trigger="hover">
                    <div class="flex-row content">
                        <template v-for="item in productList">
                            <div class="flex-column item" :class="{'item-edit':isEdit}">
                                <div class="title">{{item.name}}</div>
                                <ul>
                                    <li v-if="isEdit" @click="addFast('click',temp.name)" class="flex-row" v-for="temp in item.data">
                                        <span>{{temp.name}}</span>
                                        <el-tooltip v-if="!temp.isFast" content="添加至左侧快捷" :open-delay="700" placement="top" effect="light">
                                            <i class="add el-icon-circle-plus-outline"></i>
                                        </el-tooltip>
                                        <el-tooltip v-else content="移除至左侧快捷" :open-delay="700" placement="top" effect="light">
                                            <i class="remove el-icon-circle-close"></i>
                                        </el-tooltip>
                                    </li>
                                    <li v-else>
                                        <span>{{temp.name}}</span>
                                    </li>
                                </ul>
                            </div>
                        </template>
                    </div>
                    <div class="edit">
                        <el-tooltip v-show="!isEdit" content="编辑" placement="top" effect="light">
                            <i @click="addFast('edit')" class="el-icon-edit"></i>
                        </el-tooltip>
                        <el-tooltip v-show="isEdit" :content="isAll?'移除全部':'添加全部'" placement="top" effect="light">
                            <i @click="addFast('all')" class="el-icon-help"></i>
                        </el-tooltip>
                        <el-tooltip v-show="isEdit" content="完成" placement="top" effect="light">
                            <i @click="addFast('save')" class="el-icon-check"></i>
                        </el-tooltip>
                    </div>
                    <div slot="reference" class="title flex-row">
                        <div>
                            <i class="el-icon-menu"></i>
                            产品服务
                        </div>
                        <i class="el-icon-arrow-right"></i>
                    </div>
                </el-popover>
                <el-menu
                        class="el-menu-vertical">
                    <el-menu-item v-for="(item,index) in selectList" :key="index" :index="item.name">
                        <i class="el-icon-menu"></i>
                        <span slot="title">{{item.name}}</span>
                    </el-menu-item>
                </el-menu>
            </div>
        </div>
        <el-dialog
                class="modify-pwd"
                title="修改密码"
                :visible.sync="modifyPwd"
                :close-on-click-modal=false
                :before-close="closeDialog"
                width="35%">
            <el-form :model="ruleForm" label-position="left" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
                <el-form-item label="旧密码" prop="oldPwd">
                    <el-input type="password" v-model.number="ruleForm.oldPwd"></el-input>
                </el-form-item>
                <el-form-item label="新密码" prop="pass">
                    <el-input type="password" v-model="ruleForm.pass"  autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="确认密码" prop="checkPass">
                    <el-input type="password" v-model="ruleForm.checkPass" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="closeDialog">取 消</el-button>
                <el-button type="primary" @click="confirmModify">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import base from '@_src/core/base';
    import Config  from "@_src/api/app.config";
    import CryptoJS from 'crypto-js'
    import AesJs from '@_src/utils/AesUtil.js'
    export default {
        mixins: [base],
        name:"Navbar",
        data() {
            var validatePass = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入新密码'));
                } else {
                    var reg = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[~!@&%#_])[a-zA-Z0-9~!@&%#_]{8,18}/;
                    var zhenze =new RegExp(reg);
                    var invalidPwd=Config.invalidPwd;
                    if(zhenze.test(value) && invalidPwd.indexOf(value) == -1 && value.length<18){
                        if (this.ruleForm.checkPass !== '') {
                            this.$refs.ruleForm.validateField('checkPass');
                        }
                    }else {
                        callback(new Error('新密码必须至少8位,最大18位含大小写字母、数字、特殊符号构成的密码'));
                    }
                    callback();
                }
            };
            var validatePass2 = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请再次输入密码'));
                } else if (value !== this.ruleForm.pass) {
                    callback(new Error('两次输入密码不一致!'));
                } else {
                    callback();
                }
            };
            return {
                hideTitle: Config.hide_title,
                Config: Config,
                isTest: Config.is_test,
                headerMenu: Config.headerMenu,
                activeImg: `/${Config.context}/static/img/logo-${Config.img}.png`,
                defaultImg: 'this.src="' + require('../../../images/logo.png') + '"',
                menu: false,
                productList:[
                    {
                        name:"计算服务",
                        data:[
                            {name:"数据计算",path:"123",isFast:false},
                            {name:"服务编排",path:"123",isFast:false}
                        ]
                    },
                    {
                        name:"数据服务",
                        data:[
                            {name:"数据交换",path:"123",isFast:false},
                            {name:"数据监控",path:"123",isFast:false},
                            {name:"数据分析",path:"123",isFast:false}
                        ]
                    },
                    {
                        name:"智能服务",
                        data:[
                            {name:"智能问答",path:"123",isFast:false},
                            {name:"数据画像",path:"123",isFast:false}
                        ]
                    },
                    {
                        name:"应用服务",
                        data:[
                            {name:"消息队列",path:"123",isFast:false},
                            {name:"在线表单",path:"123",isFast:false},
                            {name:"云工作流",path:"123",isFast:false}
                        ]
                    },
                    {
                        name:"政务应用",
                        data:[
                            {name:"事项知识库",path:"123",isFast:false},
                            {name:"一表填报",path:"123",isFast:false},
                            {name:"政务导图",path:"123",isFast:false}
                        ]
                    },
                    {
                        name:"安全运维",
                        data:[
                            {name:"安全评测",path:"123",isFast:false},
                            {name:"数据迁移",path:"123",isFast:false}
                        ]
                    }
                ],
                isEdit: false,
                isAll: false,//是否已全选
                modifyPwd:false,//修改密码弹框
                ruleForm: {
                    oldPwd:"",
                    pass: '',
                    checkPass: ''
                },
                rules: {
                    oldPwd:[
                        { required: true, message: '请输入原密码', trigger: 'blur' }
                    ],
                    pass: [
                        { required: true, validator: validatePass, trigger: 'blur' }
                    ],
                    checkPass: [
                        { required: true, validator: validatePass2, trigger: 'blur' }
                    ]
                }
            };
        },
        computed:{
            themeStyle(){
                if(!this.$store.getters.globalSetting.isTheme){
                    return "#272a2f";
                }else{
                    return this.$store.getters.globalSetting.themeStyle;
                }
            },
            curUser(){
                return this.$store.getters.curUser;
            },
            bgCompute(){
                if(!this.$store.getters.globalSetting.isTheme){
                    return this.colorCompute("#272a2f",-10);
                }else{
                    return this.colorCompute(this.$store.getters.globalSetting.themeStyle,-10);
                }
            },
            selectList:{
                get(){
                    let temp = [];
                    let productList = this.productList;
                    for(let i=0,len=productList.length;i<len;i++){
                        for(let j=0,len=productList[i].data.length;j<len;j++){
                            if(productList[i].data[j].isFast){
                                temp.push(productList[i].data[j]);
                            }
                        }
                    }
                    return temp;
                }
            }
        },
        methods: {
            closeDialog(){
                this.$refs['ruleForm'].resetFields();
                this.modifyPwd = false;
            },
            onSetting(){
                this.$emit("message",{type:"setting"});
            },
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
                        this.logout();
                        break;
                    case "home":
                        this.$router.push("/");
                        break;
                    case "changePassword":
                        this.modifyPwd = true;
                        break;
                }
            },
            //颜色明亮度计算
            colorCompute(col, amt){
                var usePound = false;
                if (col[0] == "#") {
                    col = col.slice(1);
                    usePound = true;
                }
                var num = parseInt(col,16);
                var r = (num >> 16) + amt;
                if (r > 255) r = 255;
                else if  (r < 0) r = 0;
                var b = ((num >> 8) & 0x00FF) + amt;
                if (b > 255) b = 255;
                else if  (b < 0) b = 0;
                var g = (num & 0x0000FF) + amt;
                if (g > 255) g = 255;
                else if (g < 0) g = 0;
                return (usePound?"#":"") + (g | (b << 8) | (r << 16)).toString(16);
            },
            //产品服务添加快捷
            addFast(type,name){
                if(type == "edit"){
                    this.isEdit = true;
                }
                if(type == "save"){
                    this.isEdit = false;
                    this.$store.dispatch("globalSetting",{
                        productList: this.productList
                    });
                }else{
                    for(let i=0,len=this.productList.length;i<len;i++){
                        for(let j=0,len=this.productList[i].data.length;j<len;j++){
                            if(type=="click"){
                                if(this.productList[i].data[j].name == name){
                                    let val = this.productList[i].data[j].isFast?false:true;
                                    this.$set(this.productList[i].data[j], 'isFast', val);
                                }
                            }
                            if(type == "all"){
                                let val = this.isAll?false:true;
                                this.$set(this.productList[i].data[j], 'isFast', val);
                            }
                        }
                    }
                    if(type == "all"){
                        this.isAll = this.isAll?false:true;
                    }
                }
            },
            //产品选中初始化
            productInit(){
                let news = this.productList;
                let old = this.$store.getters.globalSetting.productList;
                for(let i=0,len=old.length;i<len;i++){
                    for(let j=0,len=old[i].data.length;j<len;j++){
                        replace(i,j,news[i].data[j].name);
                    }
                }
                function replace(k,n,name) {
                    for(let i=0,len=news.length;i<len;i++){
                        for(let j=0,len=news[i].data.length;j<len;j++){
                            if(news[i].data[j].name == name){
                                news[i].data[j].isFast = old[k].data[n].isFast;
                            }
                        }
                    }
                }
            },
            //修改密码
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
                            this.$http_post(Config.baseContext+'/admin/user/updateUserPassword',parameter).then(ret => {
                                if (ret.state == 1) {
                                    this.modifyPwd = false;
                                    this.$message.success("修改成功");
                                    this.onUserClick("exit");
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
            }
        },
        mounted(){
            var userInfo = this.curUser;
            if(userInfo == null){
                //this.$router.push("/login");
            }
            this.productInit();
        },
        created() {
        }
    };
</script>
<style lang="less" scoped>
    .navbar{
        justify-content: space-between;
        height: 55px;
        line-height: 55px;
        color: hsla(0,0%,100%,.9);
        -webkit-box-shadow: 0 1px 3px 0 rgba(0,0,0,.12), 0 0 3px 0 rgba(0,0,0,.04);
        box-shadow: 0 1px 3px 0 rgba(0,0,0,.12), 0 0 3px 0 rgba(0,0,0,.04);
        a{
            color:rgba(255,255,255,0.9);
            font-size:14px;
            font-weight:400;
        }
        .avatar-container{
            display: inline-block;
            margin-right: 35px;
            color: hsla(0,0%,100%,.8);
            cursor: pointer;

            .avatar-wrapper {
                position: relative;

                .user-avatar {
                    width: 30px;
                    height: 30px;
                    border-radius: 10px;
                    vertical-align: middle;
                }
            }
        }
        .subtitle{
            margin-left:10px;
            font-size: 20px;
            color:red;
            font-weight: bold
        }
        .sidebar-logo-container{
            position: relative;
            height: 55px;
            line-height: 55px;
            text-align: center;
            overflow: hidden;
            .menu{
                height: 55px;
                line-height: 55px;
                width: 55px;
                background: #191b1f;
                cursor: pointer;
                i{
                    font-size: 30px;
                }
            }
            .sidebar-logo-link{
                .sidebar-logo{
                    height: 40px;
                    vertical-align: middle;
                    margin-right: 4px;
                }
                .sidebar-title{
                    display: inline-block;
                    margin: 0;
                    color: #fff;
                    font-weight: 600;
                    line-height: 50px;
                    vertical-align: middle;
                }
            }
        }
    }
    .menu-content{
        position: fixed;
        top: 0px;
        left: 0px;
        bottom: 0px;
        right: 0px;
        -webkit-transition: opacity .3s cubic-bezier(.7,.3,.1,1);
        background: rgba(0,0,0,.5);
        transition: all 1s;
        z-index: 999;
        .title{
            width: 230px;
            height: 56px;
            line-height: 56px;
            padding: 0px 20px;
            color: black;
            border-bottom: 1px solid #eee;
            background: white;
            position: absolute;
            top: 55px;
            justify-content: space-between;
            cursor: pointer;
            i{color: #909399;}
            &:hover{
                .el-icon-arrow-right{
                    color: #1cb5d5;
                }
            }
            .el-icon-menu{
                margin-right: 5px;
                width: 24px;
                text-align: center;
                font-size: 18px;
                vertical-align: middle;
            }
        }
        .el-menu-vertical{
            width: 230px;
            position: absolute;
            top: 111px;
            bottom: 0px;
            overflow-y: auto;
        }
    }
    .qz-logo{
        margin-left:20px;
        vertical-align: middle;
        height:36px;
    }
    .modify-pwd{
        /deep/.el-dialog__body{
            padding: 0px 20px;
        }
    }
</style>
