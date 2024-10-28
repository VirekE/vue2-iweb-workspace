<template>
  <div :class="showFlag==true?'show':''">
    <div class="right-panel-background" @click="onClose"></div>
    <div class="right-panel bgw">
      <div  class="drawer-container" >
        <div>
          <h3  class="drawer-title">页面风格设置</h3>
          <div  class="drawer-item">
            <p >主题</p>
            <div class="clearfix mt15">
              <div
                :class="'color-item pull-left'+(item == theme ? ' active':'')"
                v-for="item in themeList" :style="'background:'+item+';'"
                @click="onThemeClick(item)">
              </div>
            </div>
          </div>
          <div  class="drawer-item p0 mt10">
            <div >侧边栏风格
              <el-tooltip content="打开【导航跟随主题色】可修改侧边栏风格" placement="top" effect="light">
                <i class="el-icon-info"></i>
              </el-tooltip></div>
            <div  class="mt15">
              <el-radio-group :disabled="!isTheme" v-model="sideStyle">
                <el-radio label="light">
                  <img  src="../../../images/side-style-1.png" />
                </el-radio>
                <el-radio label="dark">
                  <img  src="../../../images/side-style-2.png" />
                </el-radio>
              </el-radio-group>
            </div>
          </div>
          <div  class="drawer-item mt10">
            <span>导航跟随主题色</span>
            <el-switch v-model="isTheme" class="pull-right" />
          </div>
          <div  class="drawer-item">
            <span >打开标签页</span> 
            <el-switch v-model="tabView" class="pull-right" />
          </div>
          <div  class="drawer-item p0 mt20">
            <div class="reset"><span @click="reset">恢复默认设置</span></div>
          </div>
          <!--<div  class="drawer-item">-->
            <!--<span >固定头部</span> -->
            <!--<el-switch v-model="fixedHeader" class="pull-right" />-->
          <!--</div>-->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import base from '@_src/core/base';
  import Config  from "@_src/api/app.config";
  export default {
    mixins: [base],
    name:"RightPanel",
    data() {
       return {
         themeList:["#F5222D", "#FA541C", "#FAAD14", "#52C41A", "#3D91F7", "#2F54EB", "#722ED1","#1CB5D5"],
         theme:"#2F54EB",
         fixedHeader:true,
         showFlag:false
       };
    },
    props:{
    },
    watch: {
    },
    computed: {
      sideStyle:{
        get(){
          return this.$store.getters.globalSetting.sidebarStyle;
        },
        set(val){
          this.$store.dispatch("globalSetting",{
            sidebarStyle:val
          });
        }
      },
        isTheme:{
          get(){
              return this.$store.getters.globalSetting.isTheme;
          },
          set(val){
              this.$store.dispatch("globalSetting",{
                  isTheme:val,
                  sidebarStyle: val?"dark":''
              });
          }
      },
      tabView:{
          get(){
              return this.$store.getters.globalSetting.tabView;
          },
          set(val){
              this.$store.dispatch("globalSetting",{
                  tabView:val
              });
          }
      }
    },
      mounted(){
          //初始化皮肤
          this.theme = this.$store.getters.globalSetting.themeStyle;
          this.tooggleClass("custom-"+this.$store.getters.globalSetting.themeStyle.substr(1));
      },
      methods: {
          onThemeClick(item){
              this.theme = item;
              let themeUrl = "/"+Config.context+"/static/theme/"+item.substr(1)+"/index.css";
              if(!this.isInclude(themeUrl)){
                  this.dynamicLoadCss(themeUrl,()=> {
                      setTimeout(()=>{
                          this.$store.dispatch("globalSetting",{
                              themeStyle: item
                          });
                          this.tooggleClass("custom-"+item.substr(1));
                      },100);
                  });
              }else{
                  this.tooggleClass("custom-"+item.substr(1));
                  this.$store.dispatch("globalSetting",{
                      themeStyle: item
                  });
              }
          },
          //加载样式
          dynamicLoadCss(url,callback) {
              var head = document.getElementsByTagName('head')[0];
              var link = document.createElement('link');
              link.type='text/css';
              link.rel = 'stylesheet';
              link.href = url;
              head.appendChild(link);
              callback();
          },
          //换肤
          tooggleClass(className){
              if(!className){
                  return
              }
              document.body.className = className;
          },
          //是否加载过文件
          isInclude(name){
              var js= /js$/i.test(name);
              var es=document.getElementsByTagName(js?'script':'link');
              for(var i=0;i<es.length;i++)
                  if(es[i][js?'src':'href'].indexOf(name)!=-1)return true;
              return false;
          },
          onClose(){
            this.showFlag = false;
          },
          show(){
            this.showFlag = true;
          },
          //恢复默认设置
          reset(){
              this.onThemeClick("#1CB5D5");
              this.$store.dispatch("globalSetting",{
                  isTheme: true,
                  sidebarStyle:"",
                  tabView: false
              });
          }
      },
      created() {
      }
  };
</script>
<style lang="less" scoped>
.right-panel-background{
    opacity: 0;
    -webkit-transition: opacity .3s cubic-bezier(.7,.3,.1,1);
    transition: opacity .3s cubic-bezier(.7,.3,.1,1);
    background: rgba(0,0,0,.2);
    width: 0;
    height: 0;
    top: 0;
    left: 0;
    position: fixed;
    z-index: -1;
}
.right-panel {
    position: fixed;
    top: 55px;
    bottom: 0;
    width: 260px;
    right: 0;
    -webkit-box-shadow: 0 0 15px 0 rgba(0,0,0,.05);
    box-shadow: 0 0 15px 0 rgba(0,0,0,.05);
    -webkit-transition: all .25s cubic-bezier(.7,.3,.1,1);
    transition: all .25s cubic-bezier(.7,.3,.1,1);
    -webkit-transform: translate(100%);
    transform: translate(100%);
    z-index: 999;
}
.show{
  .right-panel-background {
    z-index: 998;
    opacity: 1;
    width: 100%;
    height: 100%;
  }
  .right-panel{
    -webkit-transform: translate(0);
    transform: translate(0);
  }
}

.drawer-container{
	padding: 10px 15px;
	line-height: 1.5;
	word-wrap: break-word;
  .drawer-title {
    margin-bottom: 12px;
    color: rgba(0,0,0,.85);
    font-size: 14px;
    line-height: 22px;
    text-align: center;
    border-bottom: 1px solid #e8e8e8;
    padding-bottom: 10px;
  }
  .drawer-item{
    color: rgba(0,0,0,.65);
    font-size: 14px;
    padding: 12px 0;
    position: relative;
    .el-radio__input {
      vertical-align: top
    }
    .el-radio{
      cursor: pointer;
      margin-right: 20px;
      /deep/.el-radio__label{
        padding-left: 10px;
      }
      &:last-child{
        margin-right: 0px;
      }
    }
    .reset{
      text-align: right;
      span{
        cursor: pointer;
        &:hover{
          font-weight: bold;
        }
      }
    }
    i{
      position: absolute;
      top: 2px;
      right: 0px;
      font-size: 17px;
      cursor: pointer;
      &:focus{
        outline: none;
      }
      &:hover{
        font-weight: bold;
      }
    }
  }
}

.color-item {
	position: relative;
	cursor: pointer;
	width: 19px;
	height: 19px;
	margin-right: 7px;
	margin-bottom: 10px;

  &.active:before {
    content: "\221A";
    display: block;
    position: absolute;
    left: 2px;
    color: #fff
  }
}
</style>