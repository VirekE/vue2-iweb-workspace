<template>
  <div>
    <div v-if="isTabview" class="tab-view-container" :style="{'margin-left':isSidebar=='1'?'210px':'54px'}">
      <el-tabs :value="curTabviewId" class="tab-view-wrapper" @tab-click="onTabClick" @tab-remove="onTabRemove">
        <!--<el-tab-pane label="首页" name="/"></el-tab-pane>-->
        <el-tab-pane :closable="index == 0?false:true" :label="item.NAME" :name="item.PATH" :key="index+item.ID"
                     v-for="(item,index) in tabviews">
          <template slot="label">
            {{item.NAME}}<span class="nums"> {{curTabviewId==item.PATH?isShow(index,'tabs'):''}}</span>
          </template>
        </el-tab-pane>
      </el-tabs>
      <el-dropdown @command="menubar" class="quick-tools text-center bgg">
        <span class="el-dropdown-link">
          <i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="1">关闭其它</el-dropdown-item>
          <el-dropdown-item command="0">关闭所有</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <div v-else class="breadcrumb flex-row" :style="{'margin-left':isSidebar=='1'?'210px':'54px'}">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/home/index' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item :key="item.ID" v-for="(item,index) in breadcrumb">
          <span>{{item.NAME}}</span><span class="nums" v-if="isShow(index,'breadcrumb')">{{isShow(index,'breadcrumb')}}</span>
        </el-breadcrumb-item>
      </el-breadcrumb>
      <div v-if="active=='cms'" class="top-select">
        <!--当前站点：
        <el-select v-model="site" placeholder="请选择" size="mini" @change="setGlobalSiteId(site)">
            <el-option v-for="item in siteOption"
                       :key="item.value"
                       :label="item.label"
                       :value="item.value">
            </el-option>
        </el-select>-->

        <div>
          <!-- <el-dialog
                     title="选择站点"
                     :visible.sync="dialogVisible"
                     width="70%"
                     :append-to-body="true"
                     class="cms-dialog-padding">
               <div class="dialog-content">

                 <el-radio-group v-model="valueData" >
                   <el-radio v-for="data in siteOption" :label="data.value">{{data.label}}</el-radio>
                 </el-radio-group>
               </div>
               <span slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="chooseSite" >确定</el-button>
                    <el-button @click="closeBox">取消</el-button>
                   </span>
             </el-dialog>-->


          <el-dialog
                  title="选择站点"
                  :visible.sync="dialogVisible"
                  width="60%"
                  :append-to-body="true"
                  class="cms-dialog-padding">
            <div class="dialog-content">
              <el-row :gutter="20">
                <div v-for="data in siteOption" class="siteOption">
                  <el-col :span="6">
                    <div class="dialog">
                      <el-image fit="contain" style="width: 100px; height: 100px"
                                v-if="data.extValue!=''&&data.extValue!=null"
                                :src="picUrl()+data.extValue"/>
                      <div class="radio">
                        <el-radio v-model="valueData" :label="data.value">{{data.label}}
                        </el-radio>
                      </div>
                    </div>
                  </el-col>
                </div>
              </el-row>
            </div>

            <span slot="footer" class="dialog-footer">
                            <el-button type="primary" @click="chooseSite">确定</el-button>
                            <el-button @click="closeBox">取消</el-button>
                           </span>
          </el-dialog>

        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import base from '@_src/core/base';
  import Config from "@_src/api/app.config";

  export default {
    mixins: [base],
    name: "Tabview",
    inject: ['reload'],
    data() {
      return {
        webdiskUrl: Config.webdiskDownloadUrl,//网盘地址
        site: "",
        valueData: "",
        dialogVisible: false,
        radio1: "",
        siteBox: false,
        active: Config.active,
        siteOption: [],
        total:'',
      };
    },
    beforeMount() {
      var that = this;
      setTimeout(() => {
        if (Config.active == "cms") {
          that.initSiteSelect();  //初始化站点下拉内容
        }
      }, 500);

    },
    mounted() {
      window.getNums = this.getNums;
      var that = this;
      setTimeout(() => {
        if (Config.active == "cms") {
          if (this.$store.getters.globalSetting.globalSiteIdIsOpen == "0" || this.$store.getters.globalSetting.globalSiteIdIsOpen == undefined) {
            if (this.siteOption.length > 1) {   //默认选中第一条
              if ((this.valueData == "" || this.valueData == undefined) && this.siteOption.length > 0) {
                this.valueData = this.siteOption[0].value;
              }
              that.dialogVisible = true;
            }
          }
        }
      }, 550);

    },
    methods: {
      picUrl() {
        return this.webdiskUrl + "/doc?doc_id=";
      },
      chooseSite() {
        if (this.$store.getters.globalSetting.globalSiteIdIsOpen == "0" || this.$store.getters.globalSetting.globalSiteIdIsOpen == undefined) {
          this.setGlobalSiteId(this.valueData);
          this.$store.dispatch("globalSetting", {globalSiteIdIsOpen: "1"});
          this.closeBox();
        }
      },
      closeBox() {
        this.dialogVisible = false;
        this.$store.dispatch("globalSetting", {globalSiteIdIsOpen: "1"});
      },
      initSiteSelect() {   //初始化生成站点下拉选项
        //获得当前用户
        var user = this.$store.getters.curUser;
        let params = {
          userId: user.id,
          roleValue: user.roleValue
        };
        const rLoading = this.openLoading();
        this.$http_post(this.Config.baseContext + "/cms/cmsChannel/siteSelect", params).then((ret) => {
          let data = ret.rows;
          if (ret.state == 1) {
            this.siteOption = data;
            if (this.$store.getters.globalSetting.globalSiteId != '' && this.$store.getters.globalSetting.globalSiteId != undefined) {
              if (this.siteOption.length > 0) {
                for (var i = 0; i < this.siteOption.length; i++) {
                  if (this.siteOption[i].value == this.$store.getters.globalSetting.globalSiteId) {
                    this.site = this.$store.getters.globalSetting.globalSiteId;
                    break;
                  }
                }
              }
            } else {
              if (this.siteOption.length > 0) {
                this.site = this.siteOption[0].value;
                this.setGlobalSiteId(this.siteOption[0].value);
              }
            }
            rLoading.close();
          } else {
            rLoading.close();
            this.$message.error(ret.message);
          }
        });
      },
      setGlobalSiteId(site) {
        this.site = site;
        this.$store.dispatch("globalSetting", {globalSiteId: site});
        this.reload();
      },
      menubar(e) {
        let tabData = this.$store.getters.tabviews;
        if (e == 1) {
          for (let i = 0, len = tabData.length; i < len; i++) {
            if (tabData[i].PATH == this.$route.fullPath) {
              this.$store.dispatch("closeTabview", {leaveOne: tabData[i].ID});
              break;
            }
          }
        } else {
          this.$store.dispatch("closeTabview", "closeAll");
          if (this.$store.getters.tabviews.length < 1) {
            this.$store.dispatch("changeTabviewId", "");
            this.$store.dispatch("openTab", this.$store.getters.curMenus[0]);//默认第一个为首页
            this.$router.push("/");
          }
        }
      },
      onTabClick(target) {
        let tabData = this.$store.getters.tabviews;
        for (let i = 0, len = tabData.length; i < len; i++) {
          if (tabData[i].PATH == target.name) {
            this.$store.dispatch("changeTabviewId", tabData[i].ID);
          }
        }
        var path = target.name;
        this.$router.push(path);
      },
      onTabRemove(id) {
        let tabData = this.$store.getters.tabviews;
        for (let i = 0, len = tabData.length; i < len; i++) {
          if (tabData[i].PATH == id) {
            this.$store.dispatch("closeTabview", tabData[i].ID);
            if (this.$route.fullPath == id && tabData.length > 0) {
              this.$router.push(tabData[tabData.length - 1].PATH);
              this.$store.dispatch("changeTabviewId", tabData[tabData.length - 1].ID);
            }
            if (this.$store.getters.tabviews.length < 1) {
              this.$store.dispatch("changeTabviewId", "");
              this.$router.push("/");
            }
            break;
          }
        }
      },
      isShow(index,type) {
        let obj = {
          '/catalog/register': true,
          '/catalog/examineCatalog': true,
          '/catalog/issue': true,
          '/item/examineItem': true,
          '/overall/list': true,
          '/catalog/examine': true,
          '/item/todo-list': true,
          '/overAll/todo': true,
          '/taskCenter/message': true,
        };
        if(type == 'breadcrumb' && index + 1 == this.breadcrumb.length && obj[this.$route.path]){
          return this.total;
        }else if(type == 'tabs' && obj[this.$route.path]){
          return this.total
        }else{
          return false
        }
      },
      getNums(val) {
        this.total = val;
      },
    },
    computed: {
      curTabviewId: {
        get() {
          var path = this.$route.path;
          var tabviews = this.tabviews;
          var curTabviewWeight = -1;
          var curTabview = null;
          for (var i = 0; i < tabviews.length; i++) {
            var tabview = tabviews[i];
            var tabviewIndex = tabview.PATH.indexOf(path);
            if (tabviewIndex > -1 && tabview.PATH.length > curTabviewWeight) {
              curTabviewWeight = tabview.PATH.length;
              curTabview = tabview;
            }
          }
          if (curTabview != null) {
            return curTabview.PATH;
          }
          return "/";
        }
      },
      tabviews: {
        get() {
          return this.$store.getters.tabviews;
        }
      },
      breadcrumb() {
        var menu = [];
        let tempName = "";
        let temp = [];
        let meta = {path: this.$route.path};
        let tempList = [];
        for (let i = 0; i < this.menus.length; i++) {
          let item = this.menus[i];
          if (!this.isEmptyObject(this.$route.meta) && localStorage.getItem("setMenuPath")) {
            meta = {path: localStorage.getItem("setMenuPath"), name: this.$route.meta.name};
          }
          if (item.PATH == meta.path) {
            this.$store.dispatch("openTab", item)
            tempList.push(this.menus[i]);
            tempName = item.RES_PATH != undefined ? item.RES_PATH : "";
          }
        }
        if (tempName.indexOf("#") != -1) {
          temp = tempName.split("#");
          for (let i = 0, len = temp.length; i < len; i++) {
            menu.push({NAME: temp[i]});
          }
          if (meta.name) {
            menu.push({NAME: meta.name});
          }
        } else {
          menu = tempList;
        }
        if (menu != null) {
          return menu;
        }
      },
      menus() {
        var userInfo = this.$store.getters.curUser;
        if (!this.isEmptyObject(userInfo)) {
          return userInfo.menus
        }
        return []
      },
      isTabview() {
        return this.$store.getters.globalSetting.tabView;
      },
      isSidebar() {
        return this.$store.getters.globalSetting.sidebarStatus;
      }
    },
    created() {
    },
    watch: {
      $route: {
        handler(to, form) {
          localStorage.setItem("setMenuPath", form.path);
        },
        deep: true,
        immediate: false
      }
    }
  };
</script>

<style lang="less" scoped>


  .radio {
    margin-top: 10px;
    margin-bottom: 20px;
  }

  .item-form {
    color: #606266;

    .el-row {
      .preview-img {
        height: 100px;

        img {
          margin-left: 20px;
          width: auto;
          height: auto;
          max-width: 80%;
          max-height: 80%;
          cursor: pointer;
        }
      }

      .el-select {
        width: 100%;
      }

      .right {
        /deep/ .el-form-item__label {
          padding-left: 20px;
        }
      }

      .description {
        span {
          color: #606266;
          min-width: 80px;
        }

        .el-button {
          margin-left: 20px;
        }
      }

      .core-step {
        span {
          color: #606266;
          min-width: 50px;
        }

        .el-button {
          margin-left: 20px;
        }
      }
    }
  }

  .el-row {
    margin-bottom: 20px;

    &:last-child {
      margin-bottom: 0;
    }
  }

  .el-col {
    border-radius: 4px;
  }

  .dialog {
    display: flex;
    flex-direction: column;
    align-items: center;

  }

  .row-bg {
    padding: 10px 0;
    background-color: #f9fafc;
  }

  .breadcrumb {
    background: #fff;
    transition: all 0.3s;
    position: relative;
    z-index: 99;

    .el-breadcrumb {
      height: 40px;
      line-height: 40px;
      padding-left: 15px;
    }
  }

  .nums{
    margin-left: 5px;
    min-width: 30px;
    text-align: center;
    background: #f56c6c;
    color: #fff;
    border-radius: 20px;
    padding: 2px 8px;
    line-height: 14px;
    font-size: 12px;
    position: relative;
    /*bo: 3px;*/
  }

  .top-select {
    height: 40px;
    line-height: 40px;
    margin-left: 20px;
  }

  .tab-view-container {
    height: 34px;
    background: #fff;
    position: relative;
    z-index: 99;
    transition: all 0.3s;

    /deep/ .tab-view-wrapper {
      padding: 0 57px 0 15px;

      .el-tabs__active-bar {
        display: none
      }

      .el-tabs__item {
        position: relative;
        cursor: pointer;
        height: 34px;
        line-height: 34px;
        padding: 0 15px !important
      }

      .el-tabs__item.is-active {
        background: #f5f5f5;
        border-bottom: 2px solid
      }

      .el-tabs__item a {
        display: inline-block
      }

      .el-tabs__nav-next, .el-tabs__nav-prev {
        line-height: 34px
      }

      .el-tabs__nav-wrap:after {
        height: 0
      }
    }

    .quick-tools {
      position: absolute;
      width: 42px;
      height: 33px;
      line-height: 33px;
      right: 0;
      top: 0;
      z-index: 1011;
      cursor: pointer;
      background: white;
    }
  }
</style>