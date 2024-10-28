<template>
  <el-aside class="has-logo sidebar-container" :class="isTheme?sidebarStyle:'during'" :width="sidebarWidth">
      <div class="title flex-row" :class="isTheme?sidebarStyle:'during'">
          <div ref="scrollFrame" v-show="sidebarStatus">
              <span :s4tyle="{right:scroll+'px'}" ref="scrollbox">{{title}}</span>
          </div>
          <el-tooltip :open-delay="1000" :content="sidebarStatus ?'收缩':'展开'" placement="top">
              <i class="expand-icon" @click="onExtend" :class="sidebarStatus ? 'el-icon-s-fold':'el-icon-s-unfold'" />
          </el-tooltip>
      </div>
      <el-scrollbar wrapClass="scrollbar-wrapper">
          <el-menu :default-active="active" unique-opened :collapse="!sidebarStatus" :class="isTheme?sidebarStyle:'during'" @select="onMenuClick">
              <template v-for="(item,index) in treeMenus" >
                <el-menu-item v-if="item.children.length==0 && sidebarStatus" :key="index" :index="item.ID">
                <i :class="item.ICON"></i>
                <span slot="title">{{item.NAME}}</span>
                </el-menu-item>
                <el-menu-item v-else-if="item.children.length==0 && !sidebarStatus" :key="index" :index="item.ID">
                <el-tooltip :content="item.NAME" placement="right">
                <i :class="item.ICON"></i>
                </el-tooltip>
                </el-menu-item>
                <el-submenu v-else :index="item.ID" :key="index">
                <template slot="title"  style="padding-left:15px;">
                <i :class="item.ICON"></i>
                <span>{{item.NAME}}</span>
                </template>
                <template v-for="(subItem,subIndex) in item.children">
                <el-menu-item :index="subItem.ID" :key="subIndex"><i :class="subItem.ICON"></i>{{subItem.NAME}}</el-menu-item>
                </template>
                </el-submenu>
              </template>
        </el-menu>
      </el-scrollbar>
    </el-aside>
</template>

<script>
  import base from '@_src/core/base';
  import Config from "@_src/api/app.config";

  export default {
    mixins: [base],
    name:"Sidebar",
    data() {
       return {
           title: Config.title==''?'xxx系统':Config.title,
           scroll: 0,//标题过长滚动显示
           scrollTime:""
       };
    },
    methods: {
        onMenuClick(index){
            var menu = null;
            for(var i=0;i<this.menus.length;i++){
              var item = this.menus[i];
              if(item.ID == index){
                localStorage.setItem("setMenuPath",item.PATH);
                menu = item;
                break;
              }
            }
            if(menu != null){
              this.$store.dispatch("openTab",menu);
              if(Config.active=='app'){
                  var userInfo = this.$store.getters.curUser;
                  if(userInfo!=undefined && userInfo!=null){
                      this.$emit("changeUrl",menu.PATH);
                  }
              }else{
                  this.$router.push(menu.PATH);
              }
            }
        },
        onExtend(){
            var gs={
                sidebarStatus : this.sidebarStatus ? "0":"1"
            };
            this.$store.dispatch("globalSetting",gs);
        }
    },
     watch:{
      treeMenus: {// 默认打开第一个菜单
        handler(treeMenus) {
              // this.$store.dispatch("openTab",this.menus[0]);//默认第一个为首页
          // for(let i=0,len=this.menus.length;i<len;i++){
          //   if(this.menus[i].PATH == this.$route.fullPath){
          //     this.$store.dispatch("changeTabviewId",this.menus[i].ID);
          //     this.onMenuClick(this.menus[i].ID);
          //   }
          // }

          if(!this.isEmptyObject(treeMenus)) {
            var defaultMenu = {}
            var curMenu = {};
            var item = treeMenus[0];
            var children = item.children;
            if(this.isEmptyObject(children)){
                defaultMenu = item;
            }else{
                 defaultMenu = children[0]
            }
            for(let i=0,len=this.menus.length;i<len;i++){
              if(this.menus[i].PATH == this.$route.fullPath){
                curMenu = this.menus[i];
                break;
              }
              if(this.menus[i].PATH ==localStorage.getItem("setMenuPath")){
                defaultMenu = this.menus[i];
              }
            }
           this.$store.dispatch("openTab",defaultMenu);
            if(Config.active=='app'){
                this.$emit("changeUrl",defaultMenu.PATH);
            }
            if(!this.isEmptyObject(curMenu)){
               this.onMenuClick(curMenu.ID);
            }else if(this.$route.fullPath === '/'){
              this.onMenuClick(defaultMenu.ID);
            }

          }
        },
        immediate: false
      },
    },
    computed: {
        menus(){
            var curUser = this.$store.getters.curUser
            if(!this.isEmptyObject(curUser)) {
                if(Config.active=='app'){
                    // this.title = userInfo.SHORT_NAME;
                    this.title = appInfo.SIDE_NAME;
                }
              let menus = [];
              for (let i = 0; i < curUser.menus.length; i++) {
                let flag = true;
                if(curUser.roleValue.indexOf('ZSJSH') != -1 || curUser.roleValue.indexOf('ZSJBB') != -1){
                  if(curUser.attrMap.REGION_CODE == '440301'){
                    let obj = {
                      1:'/objection/propose',
                    };
                    for(let path in obj){
                      if(curUser.menus[i].PATH == obj[path]){
                        flag = false;
                      }
                    }
                    if(flag){
                      menus.push(curUser.menus[i])
                    }
                  }else{
                    let obj = {
                      1:'/objection/todo_list',
                      2:'/catalog/issue',
                      3:'/catalog/edit',
                      4:'/objection/summary',
                      5:'/catalog/disuse',
                      6:'/overAll/todo',
                      7:'/overall/list',
                      8:'/catalog/disuse',
                      9:'/catalog/library',
                      10:'/item/association',
                    };
                    for(let path in obj){
                      if(curUser.menus[i].PATH == obj[path]){
                        flag = false;
                      }
                    }
                    if(flag){
                      menus.push(curUser.menus[i])
                    }
                  }
                }else{
                  if(curUser.attrMap.REGION_CODE != '440301'){
                    let obj = {
                      1:'/overall/list',
                    };
                    for(let path in obj){
                      if(curUser.menus[i].PATH == obj[path]){
                        flag = false;
                      }
                    }
                    if(flag){
                      menus.push(curUser.menus[i])
                    }
                  }else{
                    menus = JSON.parse(JSON.stringify(curUser.menus))
                  }
                }
              }
                return menus
            }
            return []
        },
        active:{
            get(){
                return this.$store.getters.curTabviewId;
            }
        },
        themeStyle(){
            return this.$store.getters.globalSetting.themeStyle;
        },
        treeMenus:{
            get(){
              return this.simpleToTree(this.menus,"ID","PARENT_CODE","#","children");
            }
        },
        sidebarStatus:{
            get(){
              return ("1"==this.$store.getters.globalSetting.sidebarStatus);
            }
        },
        sidebarWidth:{
            get(){
              return this.sidebarStatus ? "210px" : "54px";
            }
        },
        sidebarStyle(){
            return this.$store.getters.globalSetting.sidebarStyle;
        },
        isTheme(){
            return this.$store.getters.globalSetting.isTheme;
        }
    },
    mounted(){
        let that = this;
        //固定标题过长滚动
        this.$nextTick(function () {
            let max = this.$refs.scrollbox.offsetWidth-this.$refs.scrollFrame.offsetWidth;
            if(max>0){
                that.scroll = max;
                let stop = window.setTimeout(function() {
                    that.scroll = 0;
                    window.clearTimeout(stop);
                },2500);
                // that.scrollTime = window.setInterval(function() {
                //     if(that.scroll < max){
                //         that.scroll+=1;
                //     }else {
                //         window.clearInterval(that.scrollTime);
                //         let stop = window.setTimeout(function() {
                //             that.scroll = 0;
                //             window.clearTimeout(stop);
                //         },1000);
                //     }
                // },50);
            }
        })
    }
  };
</script>
<style lang="less" scoped>
.dark{
    background-color: #17202a !important;
    color: rgba(255, 255, 255, 0.65);
    .title{
        span,i{
            color: rgba(255, 255, 255, 0.65);
        }
    }
    /deep/.el-submenu,.el-menu-item {
        color:rgba(255,255,255,0.65);
        .el-submenu__title{
            color:rgba(255,255,255,0.65);
            i{
                margin-right: 5px;
            }
            &:hover{
                color: white;
                background: transparent;
            }
        }
        .el-menu{
            background: inherit;
        }
    }
    .el-menu-item:not(.is-active):hover,.el-submenu__title:focus,.el-submenu__title:hover {
        color: #fff!important;
        cursor: pointer;
        i{
            color: white;
        }
    }
    .el-menu-item:focus,
    .el-menu-item:hover,
    .el-submenu__title:focus,
    .el-submenu__title:hover {
        background-color: inherit;
        i{
            color: white !important;
        }
    }
}
.during{
    background-color: #3e4754 !important;
    color: rgba(255, 255, 255, 0.65);
    .title{
        span,i{
            color: rgba(255, 255, 255, 0.65);
        }
    }
    /deep/.el-submenu,.el-menu-item {
        color:rgba(255,255,255,0.65);
        .el-submenu__title{
            color:rgba(255,255,255,0.65);
            i{
                margin-right: 5px;
            }
            &:hover{
                color: white;
                background: transparent;
            }
        }
        .el-menu{
            background: inherit;
        }
    }
    .el-menu-item:not(.is-active):hover,.el-submenu__title:focus,.el-submenu__title:hover {
        color: #fff!important;
        cursor: pointer;
        i{
            color: white !important;
        }
    }
}
.el-menu-item{
    i{
        margin-right: 5px;
        position: relative;
    }
    &:hover{
        color: black;
    }
}
.el-menu{
    .el-submenu{
        .el-submenu__title{
            i{
                margin-right: 10px;
                position: relative;
                top: 2px;
            }
            &:hover{
                i{
                    color: black;
                }
            }
        }
    }
}
.sidebar-container{
    overflow: hidden !important;
    transition: width .28s;
    .title{
        height: 40px;
        line-height: 40px;
        padding: 0px 20px;
        color: #303133;
        background: transparent;
        justify-content: space-between;
        position: relative;
        div{
            position: absolute;
            left: 20px;
            line-height: normal;
            width: 150px;
            overflow-x: auto;
            span{
                position: relative;
                word-break: normal;
                white-space: nowrap;
                transition: all 1.5s;
                font-size: 16px
            }
            i{
                cursor: pointer;
            }
            &::-webkit-scrollbar{
                display: none;
            }
        }
        .expand-icon{
            position: absolute;
            right: 18px;
            font-size: 17px;
            cursor: pointer;
            &:focus{
                outline: none;
            }
        }
    }
    .is-horizontal {
        display: none;
    }
    a {
        display: inline-block;
        width: 100%;
        overflow: hidden
    }
    /deep/.el-scrollbar{
        height: 100%;
      .scrollbar-wrapper {
          overflow-x: hidden!important;
          position: absolute;
          top: 0px;
          left: 0px;
          right: 0px;
          bottom: 0px;
          .el-scrollbar__view{
              padding-bottom: 55px;
          }
        .el-scrollbar__bar.is-vertical {
            right: 0;
        }
      }
    }
    /deep/.el-menu{
        width:100%!important;
        border: none;
        &.el-menu--collapse{
            .el-submenu__title{
                padding-left:15px;
            }
        }
        .el-menu-item{
            background: transparent;
            padding-left:20px;
            span{
                font-size:14px;
            }
        }
    }
    .sidebar-logo-link{
        height: 100%;
        width: 100%;
    }
}
</style>
