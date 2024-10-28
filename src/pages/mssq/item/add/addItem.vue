<template>
  <div class="cardView material" ref="tableH">
    <div class="search-box">
      <Search :fieldData="fieldData" @searchClick="searchClick" ref="srarch" @chooseDept="chooseDept">
        <template slot="footer">
          <div class="addCatalog">
            <el-button type="warning" size="small" icon="el-icon-plus"
                       @click="addItem({})">新增事项
            </el-button>
          </div>
        </template>
      </Search>
    </div>
    <div class="view">
      <el-card class="box-card box-left" shadow="never">
        <div slot="header" class="clearfix">
          <div class="title">
            <div class="left">
              <div class="icon">
                <i class="el-icon-star-on"></i>
              </div>
              <span>事项类型</span>
            </div>
          </div>
        </div>
        <div class="text item">
          <el-menu default-active="0" class="el-menu-vertical-demo">
            <el-menu-item :index="(index+'')" v-for="(item,index) in dictMap['ITEM_TYPE']" :key="index"
                          @click="queryByRegionList(item.itemCode)"
                          :style="formInline.matterType==item.itemCode?themeStyle:''">
              <span slot="title">{{item.itemValue}}</span>

            </el-menu-item>
          </el-menu>
        </div>
      </el-card>
      <el-card class="box-card box-right" shadow="never">
        <div class="text item">
          <el-table :data="tableData" style="width: 100%" height="100%" class="qz-table-hide">
            <el-table-column type="index" label="序号" width="50"></el-table-column>
            <el-table-column prop="regionName" label="区划名称" width="140" show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="deptName" label="实施部门名称" width="160" show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="itemCode" label="事项编码" show-overflow-tooltip></el-table-column>
            <el-table-column prop="itemName" label="事项名称" show-overflow-tooltip></el-table-column>
            <el-table-column prop="status" label="当前状态" width="100" show-overflow-tooltip
                             :formatter="formatterState">
              <template slot-scope="scope">
                <el-tag type="success"
                        v-if="scope.row.status == 'EXAMINE_SUCCESS' || scope.row.status == 'PUBLISH' || scope.row.status == 'DISCARD'">
                  {{formatterState(scope.row)}}
                </el-tag>
                <el-tag v-if="scope.row.status == 'DRAF'">{{formatterState(scope.row)}}</el-tag>
                <el-tag type="danger"
                        v-if="scope.row.status == 'EXAMINE_FAIL' || scope.row.status == 'ACCEPT_FAIL'">
                  {{formatterState(scope.row)}}
                </el-tag>
                <el-tag type="warning"
                        v-if="scope.row.status == 'EXAMINE_WAIT' || scope.row.status == 'ACCEPT_WAIT'">
                  {{formatterState(scope.row)}}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="50">
              <template slot-scope="scope">
                <!--都有查看-->
                <el-button type="text" @click="onEditItem(scope.row.id,'edit')">编辑</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div class="block">
            <el-pagination @current-change="handleCurrentChange" :current-page.sync="itemParams.page"
                           :page-size="itemParams.limit" layout="total,prev, pager, next, jumper"
                           :total="itemParams.total">
            </el-pagination>
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
// import SearchDept from "../components/searchDept";
import qzBase from '@_src/pages/mssq/common/util/qzBase';

export default {
  components: {
    // SearchDept
  },
  name: "addItem",
  mixins: [qzBase],
  data() {
    return {
      chooseDeptDialog:false,
      fieldData: {
        itemName: {
          label: '事项名称',
          type: 'Input',
          placeholder: '请输入事项名称',
          value: '',
          span: 8,
        },
        itemCode: {
          label: '事项编码',
          type: 'Input',
          placeholder: '请输入事项编码',
          value: '',
          span: 8
        },
        manageType: {
          label: '管理类型',
          type: 'Select',
          placeholder: '请输入管理类型',
          value: '',
          span: 8,
          selectList: []

        },
        itemType: {
          label: '业务类型',
          type: 'Select',
          placeholder: '请输入业务类型',
          value: '',
          span: 8,
          selectList: []

        },
        status: {
          label: '事项状态',
          type: 'Select',
          placeholder: '请选择事项状态',
          value: '',
          span: 8,
          selectList: []
        },
        matterType: {
          label: '事项类型',
          type: 'Select', //类型
          placeholder: '请选择事项类型',
          value: '',
          span: 0, //布局比例
          selectList: []
        },
        Button: {
          type: 'Button',
          span: 16
        }
      },
      activeName: 'isAll',
      dictMap: {},
      formInline: {
        itemName: '',
        itemCode: '',
        deptName: '',
        manageType: '',
        itemType: '',
        matterType: '',
        deptNo: '',
        shortCode: '',
        agentCode: ''
      },
      matterType: [],
      regionList: [],
      tableHeight: 100,
      title: '',
      dialogVisible: false,
      activeIndex: '0',

      item_menu: {
        height: ''
      },
      tableData: [],
      itemParams: {
        page: 1,
        limit: 10,
        total: 0
      },
    }
  },
  watch: {
    itemStatus: {
      handler(val) {
        let arr = [];
        for (let i = 0; i < val.length; i++) {
          arr.push({
            name: val[i].itemValue,
            id: val[i].itemCode,
          })
        }
        this.fieldData.status.selectList = arr;
      }
    },
    manageType: {
      handler(val) {
        let arr = [];
        for (let i = 0; i < val.length; i++) {
          arr.push({
            name: val[i].itemValue,
            id: val[i].itemCode,
          })
        }
        this.fieldData.manageType.selectList = arr;
      }
    },
    itemType: {
      handler(val) {
        let arr = [];
        for (let i = 0; i < val.length; i++) {
          arr.push({
            name: val[i].itemValue,
            id: val[i].itemCode,
          })
        }
        this.fieldData.itemType.selectList = arr;
      }
    },
  },
  mounted() {
    //加载字典
    this.queryDictMap("ITEM_TYPE,BUSI_GROUP,ITEM_STATUS,MANAGE_TYPE,REGION,BUSI_TYPE", (res) => {
      this.dictMap = res;
      for (let i = 0; i < res['ITEM_TYPE'].length; i++) {
        res['ITEM_TYPE'][i].id = res['ITEM_TYPE'][i].itemCode
        res['ITEM_TYPE'][i].name = res['ITEM_TYPE'][i].itemValue
      }
      res['ITEM_TYPE'].unshift({
        name:"全部",
        itemValue:"全部",
        id:"",
        itemCode:'',
      })
      this.fieldData.matterType.selectList = res['ITEM_TYPE']
      //加载列表
    })
    let _this = this;
    this.$nextTick(() => {
      _this.tableHeight = _this.$refs.tableH.offsetHeight - 320;
    });
    window.onresize = () => {
      return (() => {
        _this.tableHeight = _this.$refs.tableH.offsetHeight - 320;
      })();
    };
    var pageParam = this.itemParams;
    var searchParam = this.formInline;
    this.onQuery(pageParam, searchParam)
  },
  methods: {
    formatterState(row) {
      if ((!this.isEmptyObject(this.dictMap)) && this.dictMap.ITEM_STATUS.length > 0) {
        for (let i = 0; i < this.dictMap.ITEM_STATUS.length; i++) {
          if (this.dictMap.ITEM_STATUS[i].itemCode == row.status) {
            if (row.version > 1.0) {
              return this.dictMap.ITEM_STATUS[i].itemCode == 'DRAF' ? this.dictMap.ITEM_STATUS[i].itemValue + '（变更中）' : this.dictMap.ITEM_STATUS[i].itemValue
            }
            return this.dictMap.ITEM_STATUS[i].itemCode == 'DRAF' ? this.dictMap.ITEM_STATUS[i].itemValue : this.dictMap.ITEM_STATUS[i].itemValue
          }
        }
      }
    },
    onEditItem(id, type) {
      this.$store.dispatch("setSearchParams",{path:this.$route.path,data:Object.assign(this.formInline,{page:this.itemParams.page,limit:this.itemParams.limit})} );
      this.$router.push({
        path: '/item/addItemInfo',
        query: {
          id: id,
          type: type
        }
      });
    },
    onQuery(pageParam, searchParam) {
      var url = this.Config.baseContext + "/check/mssqCheckIndex/getDutyItemList";
      var param = Object.assign({}, pageParam, searchParam);
      this.$http_post(url, param).then(ret => {
        if (ret.state == 1) {
          this.tableData = ret.rows;
          this.itemParams.total = ret.records;
        } else {
          this.$message.error(ret.message);
        }
      });
    },
    handleCurrentChange(val) {
      this.itemParams.page = val;
      var pageParam = this.itemParams;
      var searchParam = this.formInline;
      this.onQuery(pageParam, searchParam)
    },
    queryByRegionList(val) {
      this.$refs.srarch.update('matterType', val, true)
      // this.reload();//重新加载表单
    },
    queryByStatus(val) {
      this.formInline.menuStatus = val;
      this.reload(); //重新加载表单
    },
    searchClick(res) {
      this.formInline = {
        itemName: res.itemName.value,
        itemCode: res.itemCode.value,
        manageType: res.manageType.value,
        itemType: res.itemType.value,
        matterType: res.matterType.value,
        status: res.status.value,
      };
      if (res.matterType.value == 'isAll') {
        this.formInline.matterType = ''
      }
      this.reload();
    },
    reload() {
      this.itemParams = {
        page: 1,
        total: 0,
        limit: 10
      };
      var pageParam = this.itemParams
      var searchParam = this.formInline
      this.onQuery(pageParam, searchParam);
      this.activeIndex = '0';
    },
    addItem(row) {
      this.$router.push({
        path: '/item/addItemInfo',
        query: {
          id: row.id || '',
          type: 'edit',
        }
      })
    },
    chooseDept() {
      this.chooseDeptDialog = true;
    },
    revert() {
      this.formInline = {
        itemName: '',
        itemCode: '',
        deptName: '',
        manageType: '',
        itemType: '',
        matterType: '',
        deptNo: '',
        shortCode: '',
        agentCode: ''
      };
      this.reload()
    },

    dicForValue(row) {
      var status = row.status
      var version = row.version
      if ((!this.isEmptyObject(this.dictMap)) && this.dictMap.ITEM_STATUS.length) {
        var statusDict = this.dictMap.ITEM_STATUS
        for (var i = 0; i < statusDict.length; i++) {
          if (statusDict[i].itemCode == status) {
            if (parseFloat(version) > 1.0 && status != "PUBLISH" && status != "DISCARD" && status !=
                "DELETE") {
              //return statusDict[i].itemValue+"<span>(变更中)</span>";
              return statusDict[i].itemValue +
                  '<span style="color:#ff4824;display:inline-block">(变更中)</span><br/>'
            } else {
              return statusDict[i].itemValue;
            }
          }
        }
        return "";
      }
    },
    formatterOrigin(row) {
      if (row.origin === 'shenzhen') {
        return '深圳'
      } else if (row.origin === 'pro') {
        return '省系统'
      } else {
        return '--'
      }
    },
    colorCompute(sHex, alpha) {
      var reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
      /* 16进制颜色转为RGB格式 */
      let sColor = sHex.toLowerCase()
      if (sColor && reg.test(sColor)) {
        if (sColor.length === 4) {
          var sColorNew = '#'
          for (let i = 1; i < 4; i += 1) {
            sColorNew += sColor.slice(i, i + 1).concat(sColor.slice(i, i + 1))
          }
          sColor = sColorNew
        }
        // 处理六位的颜色值
        var sColorChange = []
        for (let i = 1; i < 7; i += 2) {
          sColorChange.push(parseInt('0x' + sColor.slice(i, i + 2)))
        }
        return 'rgba(' + sColorChange.join(',') + ',' + alpha + ')'
      } else {
        return sColor
      }
    },
    confirm(val){
      let arr = [];
      arr.push(val);
      this.closeDialog();
    },
    closeDialog(){
      this.chooseDeptDialog = false;
    }
  },
  computed: {
    getColNum() {
      if (this.$store.getters.curUser.roleValue.indexOf('ZSJSH') != -1 && this.$store.getters.curUser.attrMap
          .REGION_CODE == '440301') {
        return 8
      } else if (this.$store.getters.curUser.roleValue.indexOf('ZSJSH') != -1 && this.$store.getters.curUser
          .attrMap.REGION_CODE != '440301') {
        return 16
      } else {
        return 24
      }
    },
    themeStyle() {
      var style = {
        color: this.$store.getters.globalSetting.themeStyle,
        borderColor: this.$store.getters.globalSetting.themeStyle,
        backgroundColor: this.colorCompute(this.$store.getters.globalSetting.themeStyle, 0.1)
      };
      this.bgC = style.backgroundColor;
      return style;
    },
    itemStatus() {
      let arr = [];
      if ((!this.isEmptyObject(this.dictMap)) && this.dictMap.ITEM_STATUS.length) {
        for (let i = 0; i < this.dictMap.ITEM_STATUS.length; i++) {
          if (this.dictMap.ITEM_STATUS[i].itemCode == 'DRAF' ||
              this.dictMap.ITEM_STATUS[i].itemCode == 'ACCEPT_WAIT' ||
              this.dictMap.ITEM_STATUS[i].itemCode == 'PUBLISH' ||
              this.dictMap.ITEM_STATUS[i].itemCode == 'DISCARD' ||
              this.dictMap.ITEM_STATUS[i].itemCode == 'EXAMINE_WAIT' ||
              this.dictMap.ITEM_STATUS[i].itemCode == 'EXAMINE_SUCCESS' ||
              this.dictMap.ITEM_STATUS[i].itemCode == 'EXAMINE_FAIL' ||
              this.dictMap.ITEM_STATUS[i].itemCode == 'DISCARD_WAIT' ||
              this.dictMap.ITEM_STATUS[i].itemCode == 'ACCEPT_FAIL' ||
              this.dictMap.ITEM_STATUS[i].itemCode == 'DISCARD_FAIL'
          ) {
            arr.push(this.dictMap.ITEM_STATUS[i])
          }
        }
        return arr;
      }
    },
    manageType() {
      return this.dictMap.MANAGE_TYPE
    },
    itemType() {
      return this.dictMap.BUSI_TYPE
    },
  },
  destroyed() {
    window.onresize = null;
  },
}
</script>
<style scoped lang="less">
/*.material {
    position: relative;
    height: 100%;
    padding: 20px;
    .el-menu-demo {
        margin-bottom: 15px;
        margin-top: -15px;
        .el-menu-item {
            margin-right: 20px;
            height: 52px;
            line-height: 52px;
            padding: 0 28px;
        }
    }
    .block {
        text-align: right;
        position: absolute;
        left: 0;
        right: 20px;
        bottom: 0px;
        background: #fff;
    }
    .view {
        .box-right {
            /deep/ .el-card__body {
                padding: 0;
            }
        }
    }
    .el-menu {
        border-right: none;
        height: 100%;
    }
    /deep/ .el-menu-item {
        height: 40px;
        line-height: 40px;
    }
    /deep/ .el-menu-item.is-active {

    }
}*/
.cardView {
  position: relative;
  height: 100%;
  background: #f8f8f8;
  display: flex;
  flex-direction: column;

  .el-col {
    .form-btn {
      /deep/ .el-form-item__content {
        margin-left: 20px !important;
        text-align: center;
      }
    }

    .form-btn-right {
      /deep/ .el-form-item__content {
        margin-left: 20px !important;
        text-align: end;
      }
    }

    .el-select {
      width: 100%;
    }
  }

  .view {
    display: flex;
    flex: 1;
    height: calc(100% - 210px);

    .box-left {
      width: 200px;
      border: none;
      height: 100%;
      background: #fff;
      margin-right: 10px;

      /deep/ .el-card__header {
        padding: 15px 10px;
      }

      .title {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;

        .left {
          display: flex;
          align-items: center;

          .icon {
            width: 14px;
            height: 14px;
            border-radius: 50%;
            background: #3D91F7;
            display: flex;
            justify-content: center;
            align-items: center;
            margin-right: 4px;

            i {
              color: #fff;
              font-size: 12px;
            }
          }

          span {
            font-size: 14px;
          }
        }
      }

      /deep/ .el-card__body {
        padding: 0;
        height: calc(100% - 50px);
        overflow-y: auto;

        .item {
          height: 100%;
          display: flex;
          flex-direction: column;
          height: 100%;
          background: #fff;
        }
      }
    }

    .box-right {
      border: none;
      border-radius: 0;
      display: inline-block;
      width: calc(100% - 210px);

      /deep/ .el-card__body {
        padding: 0;
        height: calc(100%);
        padding: 0 14px;

        & > .item {
          height: 100%;
          display: flex;
          flex-direction: column;
          //height: calc(100% - 58px);
          background: #fff;
          padding: 0px 14px;

          .block {
            padding: 10px 0;
          }
        }
      }

      :deep(.el-tabs) {
        .el-tabs__item {
          line-height: 50px !important;
          height: 50px !important;
        }
      }
    }
  }

  .el-menu {
    border-right: none;
    height: 100%;
  }

  /deep/ .el-menu-item {
    height: 40px;
    line-height: 40px;
  }

  /deep/ .el-menu-item.is-active {
    background: #ecf4fe;
  }
}

/deep/ .el-radio-button__inner {
  padding: 7px 22px !important;
  margin-right: 10px;
  border-radius: 0 !important;
}

.block {
  text-align: right;
  margin: 10px 0;
}

.el-menu-vertical-demo {
  .el-menu-item.is-active {
    color: #303133;
  }

  .el-menu-item {
    border-left: 3px solid transparent;

  }

}

.el-form-item {
  /*margin-bottom: 0 !important;*/
}

.view {
}

.searchCon {
  position: absolute;
  left: 0;
  top: 62px;
  width: 100%;
  min-height: 60px;
  z-index: 222;
  background: #fff;
  box-shadow: 0 0px 20px rgba(0, 0, 0, 0.175);
  padding: 20px;

  .el-row {
    padding: 6px 0;
  }

  /deep/ .el-form-item {
    width: 100% !important;

    .el-form-item__content {
      width: 100%;
      margin: 0 !important;
    }
  }

  .el-col-2 {
    text-align: right;
    padding: 0 14px;
  }

  .searCheck {
    .el-col-2 {
      margin-top: 16px;
    }
  }

  /deep/ .programme-btn {
    .el-form-item__content {
      display: flex;
      justify-Content: center;
    }
  }
}

.searchCon-view {
  /deep/ .el-form-item {
    .el-col {
      padding-left: 0 !important;
    }
  }
}

.shrink {
  cursor: pointer;
}

.mapping-content {
  /deep/ .el-dialog__body {
    padding: 0px 20px;
  }

  /deep/ .el-tabs {
    position: relative;
    top: 0px;
    left: 0px;
    bottom: 0px;
    right: 0px;

    .el-tabs__content {
      top: 0px;
      position: relative !important;
    }
  }

  /deep/ .el-transfer {
    justify-content: space-between;

    .el-transfer-panel {
      width: 42%;

      .el-transfer-panel__body {
        &:last-child {
          .el-checkbox-group {
            padding-bottom: 0px;
          }
        }

        height: 400px;
        padding-bottom: 100px;

        .el-checkbox-group {
          height: 350px;
          padding-bottom: 100px;

          .is-disabled {
            .el-checkbox__input {
              display: none;
            }

            .el-checkbox__label {
              padding-left: 0px;
              font-weight: 600;
              color: black;
            }
          }

          label {
            display: block;
          }
        }
      }

      .el-transfer-panel__footer {
        height: 100px;
        padding: 10px;
        overflow-y: auto;

        .el-button {
          margin: 0px 10px 7px 0px;
        }

        &:after {
          display: none;
        }
      }
    }
  }
}

.search-box {
  background: #fff;
  margin-bottom: 10px;
  width: 100%;
  /*display: flex;*/
  padding: 10px 14px 0 14px;

}

.addCatalog {
  padding-left: 10px;
  /*position: absolute;*/
  /*right: 0;*/
}
</style>
