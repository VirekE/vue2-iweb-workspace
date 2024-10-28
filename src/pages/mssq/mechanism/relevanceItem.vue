<template>
  <div class="cardView" ref="tableH">
    <page-header subTitle="机构变更"></page-header>
    <div class="search-box">
      <Search :fieldData="fieldData" ref="srarch" @searchClick="searchClick"></Search>
    </div>
    <div style="background: #fff;padding: 10px">
      <el-table :data="tableData" style="width: 100%" :height="tableHeight" class="qz-table-hide">
        <el-table-column type="index" label="序号" width="50"></el-table-column>
        <el-table-column prop="deptName" label="实施部门名称" width="140" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="itemCode" label="事项编码" show-overflow-tooltip></el-table-column>
        <el-table-column prop="itemName" label="事项名称" show-overflow-tooltip></el-table-column>
        <el-table-column prop="version" label="事项版本" width="100" align="center" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="status" label="当前状态" align="center" width="140" show-overflow-tooltip
                         :formatter="formatterState">
          <template slot-scope="scope">
            <el-tag type="success"
                    v-if="scope.row.status == 'EXAMINE_SUCCESS' || scope.row.status == 'PUBLISH' || scope.row.status == 'DISCARD'">
              {{formatterState(scope.row)}}</el-tag>
            <el-tag v-if="scope.row.status == 'DRAF'">{{formatterState(scope.row)}}</el-tag>
            <el-tag type="danger"
                    v-if="scope.row.status == 'EXAMINE_FAIL' || scope.row.status == 'ACCEPT_FAIL'">
              {{formatterState(scope.row)}}</el-tag>
            <el-tag type="warning"
                    v-if="scope.row.status == 'EXAMINE_WAIT' || scope.row.status == 'ACCEPT_WAIT'">
              {{formatterState(scope.row)}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="right" width="140px">
          <template slot-scope="scope">
            <el-button @click="edit(scope.row)" type="text">变更</el-button>
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
    <search-dept ref="searchDept" :chooseDeptDialog="viewChangeDialog"  :isSzsType="true" :isCheckBox="false"
                 @closeDialog="closeDialog" @confirm="confirm"></search-dept>
  </div>
</template>

<script>
import qzBase from '@_src/pages/mssq/common/util/qzBase';
import SearchDept from "./components/searchDept";
import PageHeader from '@_src/pages/mssq/common/components/page-header';

export default {
  name: "list",
  mixins: [qzBase],
  components: {SearchDept,PageHeader},
  data() {
    return {
      fieldData: {
        itemName: {
          label: '事项名称',
          type: 'Input',
          placeholder: '请输入事项名称',
          value: '',
          span: 8,
          itemWidth: '100px',
        },
        itemCode: {
          label: '事项编码',
          type: 'Input',
          placeholder: '请输入事项编码',
          value: '',
          span: 8
        },
        Button: {
          type: 'Button',
          span: 8
        }
      },
      dictMap: {},
      busiType: [],
      tableData: [],
      tabPosition: 'top',
      itemParams: {
        page: 1,
        limit: 10,
        total: 0
      },
      formInline: {
        itemName: '',
        itemCode: '',
        status: '',
        manageType: '',
      },
      tableHeight: 100,
      viewChangeDialog:false,
      dialogData:[],
      loading: false,
    }
  },
  watch: {},
  mounted() {
    //表格高度自适应
    // let _this = this;
    if(this.$route.path != this.$store.getters.searchParams.path) this.$store.dispatch("setSearchParams", {});
    if (!this.isEmptyObject(this.$store.getters.searchParams.data)) {
      this.$nextTick(() => {
        // this.activeName = this.$store.getters.searchParams.regionCode;
        this.$refs.srarch.update('itemName', this.$store.getters.searchParams.data.itemName,false);
        this.$refs.srarch.update('itemCode', this.$store.getters.searchParams.data.itemCode,false);
        this.formInline = this.$store.getters.searchParams.data;
        this.itemParams = this.$store.getters.searchParams.data;
        this.onQuery(this.formInline , this.itemParams);
        this.$store.dispatch("setSearchParams", {});
      })
    }else{
      var pageParam = this.itemParams
      var searchParam = this.formInline
      this.onQuery(pageParam, searchParam);
    }
    this.$nextTick(() => {
      this.tableHeight = this.$refs.tableH.offsetHeight - 260;
    });
    window.onresize = () => {
      return (() => {
        this.tableHeight = this.$refs.tableH.offsetHeight - 260;
      })();
    };
    //加载字典
    this.queryDictMap("BUSI_TYPE,BUSI_GROUP,ITEM_STATUS,MANAGE_TYPE,REGION,ITEM_TYPE", (res) => {
      this.dictMap = res
    });
    /* if(this.$store.getters.curUser.attrMap.DEPT_ID){
         this.formInline.deptId = this.$store.getters.curUser.attrMap.DEPT_ID;
     }else{
         this.formInline.deptNo = this.$store.getters.curUser.orgCode;
     }*/
    //加载列表
    // var pageParam = this.itemParams
    // var searchParam = this.formInline
    // this.onQuery(pageParam, searchParam);
  },

  methods: {
    onQuery(pageParam, searchParam) {
      var url = this.Config.baseContext + "/mssq/mssqDeptEdit/deptItemList";
      var param = Object.assign({}, pageParam, searchParam);
      param.editId = this.$route.query.id;
      this.$http_post(url, param).then(ret => {
        if (ret.state == 1) {
          this.tableData = ret.rows;
          this.itemParams.total = ret.records;
          localStorage.setItem('total', ret.records);
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
    reload() {
      this.itemParams = {
        page: 1,
        total: 0,
        limit: 10
      };
      var pageParam = this.itemParams
      var searchParam = this.formInline
      this.onQuery(pageParam, searchParam);
    },
    searchClick(val) {
      this.formInline = {
        itemName: val.itemName.value,
        itemCode: val.itemCode.value,
      };
      this.reload();
    },
    formatterState(row) {
      if ((!this.isEmptyObject(this.dictMap)) && this.dictMap.ITEM_STATUS.length > 0) {
        for (let i = 0; i < this.dictMap.ITEM_STATUS.length; i++) {
          if (this.dictMap.ITEM_STATUS[i].itemCode == row.status) {
            if(row.version > 1.0){
              return this.dictMap.ITEM_STATUS[i].itemCode == 'DRAF'? this.dictMap.ITEM_STATUS[i].itemValue+'（变更中）':this.dictMap.ITEM_STATUS[i].itemValue
            }
            return this.dictMap.ITEM_STATUS[i].itemCode == 'DRAF'? this.dictMap.ITEM_STATUS[i].itemValue:this.dictMap.ITEM_STATUS[i].itemValue
          }
        }
      }
    },
    edit(row){
      this.dialogData = [];
      this.viewChangeDialog = true;
      this.dialogData.push(row);
    },
    closeDialog(){ this.viewChangeDialog = false;},
    confirm(val){
      let code = '';
      let ids = [];
      for (let i = 0; i < this.dialogData.length; i++) {
        ids.push(this.dialogData[i].itemVid)
        if(code == ''){
          code = this.dialogData[i].selfDeptName + '(' + this.dialogData[i].selfDeptNo + ')'
        }else{
          code += ',' + this.dialogData[i].selfDeptName + '(' + this.dialogData[i].selfDeptNo + ')'
        }
      }
      let deptNo = val.deptNo?val.deptNo:'机构代码为空'
      this.$confirm('<div style="display: flex"><div class="tooltip-font">原机构:</div><div class="tooltip">'+ code +'</div></div><div style="display: flex"><div class="tooltip-change">机构变更:</div><div class="tooltip">'+val.deptName+'('+deptNo+')</div>'+'</div>'+'<div style="color: #f00; font-weight: 600;">机构变更后立即生效，且不可撤销，请确定要进行此操作！</div>', '温馨提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        dangerouslyUseHTMLString: true,
        customClass:'message_box_relevance',
        type: 'warning',
        showClose:false,
      }).then(() => {
        const rLoading = this.openLoading();

        val.itemVids = ids;
        var url = this.Config.baseContext + "/mssq/mssqDeptEdit/editDeptByItemId";
        this.$http_post(url, val,true).then(ret => {
          if (ret.state == 1) {
            rLoading.close();
           this.$message.success('事项机构变更成功');
            var pageParam = this.itemParams
            var searchParam = this.formInline
           this.onQuery(pageParam,searchParam)
            this.closeDialog();
          } else {
            this.$message.error(ret.message);
          }
        });
      });
    }
  },
  computed: {
    itemStatus() {
      let arr = [];
      if ((!this.isEmptyObject(this.dictMap)) && this.dictMap.ITEM_STATUS.length > 0) {
        for (let i = 0; i < this.dictMap.ITEM_STATUS.length; i++) {
          if (this.dictMap.ITEM_STATUS[i].itemCode == 'DRAF' ||
              this.dictMap.ITEM_STATUS[i].itemCode == 'ACCEPT_WAIT' ||
              this.dictMap.ITEM_STATUS[i].itemCode == 'PUBLISH' ||
              this.dictMap.ITEM_STATUS[i].itemCode == 'DISCARD' ||
              this.dictMap.ITEM_STATUS[i].itemCode == 'DISCARD_WAIT' ||
              this.dictMap.ITEM_STATUS[i].itemCode == 'ACCEPT_FAIL' ||
              this.dictMap.ITEM_STATUS[i].itemCode == 'EXAMINE_WAIT' ||
              this.dictMap.ITEM_STATUS[i].itemCode == 'EXAMINE_SUCCESS' ||
              this.dictMap.ITEM_STATUS[i].itemCode == 'EXAMINE_FAIL' ||
              this.dictMap.ITEM_STATUS[i].itemCode == 'DISCARD_FAIL') {
            arr.push(this.dictMap.ITEM_STATUS[i])
          }
        }
      }
      return arr;
    },
  },
  destroyed() {
    window.onresize = null;
  }
}
</script>
<style lang='less' scoped>
.cardView {
  position: relative;
  height: 100%;
  background: #f8f8f8;
  display: flex;
  flex-direction: column;
  .page-header {
    margin-bottom: 10px;
    &.divider{
      padding: 10px;
      background: #fff;
      border: none;
    }
  }
  .el-col {
    .form-btn {
      padding-left: 20px;
      text-align: end;

      /deep/ .el-form-item__content {
        /*display: flex;*/
        text-align: center;
        /*justify-content: end;*/
        /*justify-content: space-between;*/

        div {
          margin-right: 20px;
        }
      }
    }

    .el-select {
      width: 100%;
    }
  }

  .view {
    //display: flex;
    //flex: 1;
    //height:calc(100% - 200px);
    .box-right {
      border: none;
      border-radius: 0;

      /deep/ .el-card__body {
        padding: 0;
        height:calc(100%);
        &>.item{
          height:100%;
          display: flex;
          flex-direction: column;
          background:#fff;
          padding:14px;
          .block{
            padding:10px 0;
          }
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

  /deep/ .el-menu-item.is-active {}
}

/deep/ .el-radio-button__inner {
  padding: 7px 22px !important;
  margin-right: 10px;
  border-radius: 0 !important;
}

.block {
  text-align: right;
  margin: 10px;
}

.el-menu-vertical-demo {
  .el-menu-item.is-active {
    color: #303133;
  }

  .el-menu-item {
    border-left: 3px solid transparent;

  }

}

.treeMenu {
  position: relative;

  .num {
    position: absolute;
    right: 20px;
    font-weight: 400;
    color: #999;
  }
}

.buttonIcon {
  position: relative;
  overflow: hidden;
  display: inline-block;
  height: 40px;
  line-height: 40px;
  width: 47.2%;
  padding: 0 10px;
  border: 1px solid #eee;
  margin: 5px;
  cursor: pointer;
  max-width: 100%;
  margin-left: 0 !important;
  text-overflow: ellipsis;
  white-space: nowrap;

  /deep/ .buttons {
    position: absolute;
    top: -20px;
    background: #67c23a;
    height: 40px;
    width: 40px;
    text-align: end;
    padding-left: 18px;
    padding-top: 4px;
    transform: rotate(45deg) translateY(1px);
    left: -20px;
    color: #fff;

    .el-icon-check {
      transform: rotate(-45deg);
      padding-left: 10px;
    }
  }

}

.export {
  margin-left: 10px;
}

.addCatalog {
  padding-left: 10px;
  /*position: absolute;*/
  /*right: 0;*/
}
.search-box {
  background: #fff;
  margin-bottom: 10px;
  width: 100%;
  /*display: flex;*/
  padding: 10px 14px 0 14px;

}

</style>
<style>
.message_box_relevance{
  width: auto !important;
  max-width: 500px!important;
}
.tooltip{
  font-weight: 700;
}
.tooltip-font{
  flex-wrap:nowrap;
  min-width: 47px;
  display: flex;
}
.tooltip-change{
  flex-wrap:nowrap;
  min-width: 60px;
  display: flex;
}
</style>
