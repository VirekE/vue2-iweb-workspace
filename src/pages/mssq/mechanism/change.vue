<template>
  <div class="cardView" ref="tableH">
    <div class="search-box">
      <Search :fieldData="fieldData" ref="srarch" @searchClick="searchClick"></Search>
    </div>
    <div class="tab-box">
      <el-table :data="tableData" style="width: 100%" height="100%" class="qz-table-hide">
        <el-table-column type="index" label="序号" width="50"></el-table-column>
        <el-table-column prop="oldDeptName" label="机构名称" show-overflow-tooltip></el-table-column>
        <el-table-column prop="newDeptName" label="变更后机构名称" show-overflow-tooltip></el-table-column>
        <el-table-column prop="effectOn" label="变更类型" show-overflow-tooltip width="100">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.effectOn == 'UPDATE'">更新</el-tag>
            <el-tag v-else-if="scope.row.effectOn == 'DELETED'" type="danger">删除</el-tag>
          </template>
        </el-table-column>
        <!--事项编码取用目录编码字段-->
        <el-table-column prop="optTime" label="变更时间" show-overflow-tooltip :formatter="formatterDateTime"></el-table-column>
        <el-table-column label="操作" width="200">
          <template slot-scope="scope">
            <el-button type="text" @click="editMechanism(scope.row)">变更机构</el-button>
            <el-button type="text" @click="viewHistory(scope.row)">查看机构变更</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="block">
        <el-pagination
            @current-change="handleCurrentChange"
            :current-page.sync="itemParams.page"
            :page-size="itemParams.limit"
            layout="total,prev, pager, next, jumper"
            :total="itemParams.total">
        </el-pagination>
      </div>
    </div>
    <el-dialog
        title="查看机构变更历史"
        :visible="viewChangeDialog"
        v-if="viewChangeDialog"
        :close-on-click-modal=false
        @close="close"
        width="65%"
        class="qz-dialog-padding">
      <time-axis :dialogData="dialogData" v-if="viewChangeDialog"></time-axis>
    </el-dialog>
  </div>
</template>

<script>
import qzBase from '@_src/pages/mssq/common/util/qzBase';
import TimeAxis from "./components/timeAxis";

export default {
  name: "change",
  mixins: [qzBase],
  components: {TimeAxis},
  data() {
    return {
      fieldData:{
        deptCode: {
          label: '机构编码',
          type: 'Input',
          placeholder: '请输入机构编码',
          value: '',
          span: 6
        },
        deptName: {
          label: '机构名称',
          type: 'Input',
          placeholder: '请输入机构名称',
          value: '',
          span: 6
        },
        effectOn: {
          label: '变更类型',
          type: 'Select',
          placeholder: '请选择变更类型',
          value: '',
          span: 6,
          selectList: [{
            id: 'UPDATE',
            name: '更新'
          },{
            id: 'DELETED',
            name: '删除'
          }]
        },
        Button: {
          type: 'Button',
          span: 6
        }
      },
      tableData:[],
      itemParams:{
        page:1,
        total:0,
        limit:10
      },
      viewChangeDialog:false,
      dialogData:{},
    }
  },
  watch: {
  },
  mounted() {
    if(this.$route.path != this.$store.getters.searchParams.path) this.$store.dispatch("setSearchParams", {});
    if (!this.isEmptyObject(this.$store.getters.searchParams.data)) {
      this.$nextTick(() => {
        // this.activeName = this.$store.getters.searchParams.regionCode;
        this.$refs.srarch.update('deptCode', this.$store.getters.searchParams.data.deptCode,false);
        this.$refs.srarch.update('deptName', this.$store.getters.searchParams.data.deptName,false);
        this.$refs.srarch.update('effectOn', this.$store.getters.searchParams.data.effectOn,false);
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
    //表格高度自适应
    let _this = this;
    this.$nextTick(() => {
      _this.tableHeight = _this.$refs.tableH.offsetHeight - 220;
    });
    window.onresize = () => {
      return (() => {
        _this.tableHeight = _this.$refs.tableH.offsetHeight - 220;
      })();
    };
    //加载字典
    this.queryDictMap("DAY_TYPE,SSCJ,MANAGE_TYPE,ITEM_STATUS,BUSI_TYPE", (res) => {
      this.dictMap = res
    });
  },

  methods: {
    onQuery(pageParam, searchParam) {
      var url = this.Config.baseContext + "/mssq/mssqDeptEdit/selectDeptEditList";
      var param = Object.assign({}, pageParam, searchParam);
      this.$http_post(url, param).then(ret => {
        if (ret.state == 1) {
          this.tableData = ret.rows;
          this.itemParams.total = ret.records;
          window.getNums(ret.records);
        } else {
          this.$message.error(ret.message);
        }
      });
    },
    searchClick(val){
      this.searchFiled = {
        deptName: val.deptName.value,
        deptCode: val.deptCode.value,
        effectOn: val.effectOn.value,
      }
      this.onQuery(this.itemParams,this.searchFiled);
    },
    handleCurrentChange(data){
      this.itemParams.page = data;
      this.onQuery(this.itemParams,this.formInline);
    },
    editMechanism(row){
      this.$router.push({
        path: 'relevanceItem',
        query: {
          id:row.id
        }
      });
    },
    viewHistory(row){
      this.viewChangeDialog = true;
      this.dialogData = row
    },
    close(){ this.viewChangeDialog = false;},
  },
  computed: {

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

  .el-col {
    .form-btn {
      /deep/ .el-form-item__content {
        margin-left: 20px !important;
      }
    }

    .el-select {
      width: 100%;
    }
  }

  .view {
    /*display: flex;*/
    /*border: 1px solid #e2e2e2;*/
    flex:1;
    height:calc(100% - 130px);
    background:#fff;
    padding:0 14px;
    .box-left {
      width: 200px;
      border: none;

      /deep/ .el-card__header {
        padding: 13.3px 20px;
        background: #f5f7fa;
      }

      /deep/ .el-card__body {
        padding: 0;

        .item {
          overflow: auto;
        }
      }
    }

    .box-right {
      border: none;
      border-left: 1px solid #e2e2e2;
      border-radius: 0;
      display: inline-block;
      width: calc(100% - 200px);

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
}

/deep/ .el-radio-button__inner {
  padding: 7px 22px !important;
  margin-right: 10px;
  border-radius: 0 !important;
}

.block {
  text-align: right;
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

.jump-title {
  min-height: 10px;
  min-width: 50px;
  display: inline-block;
  max-width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: var(--primary, #409eff);
  cursor: pointer;
  vertical-align: middle;
}

.export {
  padding-left: 10px;
}

.buttonIcon {
  position: relative;
  overflow: hidden;

  /deep/ .buttons {
    position: absolute;
    top: -20px;
    background: #67c23a;
    height: 40px;
    width: 40px;
    text-align: end;
    padding-top: 16px;
    transform: rotate(45deg) translateY(1px);
    left: -20px;
    color: #fff;

    .el-icon-check {
      transform: rotate(-45deg);
      padding-left: 10px;
    }
  }

}

.timeDay {
  /*border-right: 1px solid #e2e2e2;*/
  flex-direction: row;

  .el-input {
    width: 58%;
  }

  /deep/ .el-form-item__content {
    display: flex;

    .el-select {
      width: 42% !important;

      /deep/ .el-input {
        width: 100%;
      }
    }
  }
}
.search-box {
  background: #fff;
  margin-bottom: 10px;
  width: 100%;
  padding: 10px 14px 0 14px;
}
.tab-box{
  flex:1;
  display: flex;
  flex-direction: column;
  height: calc(100% - 200px);
  background:#fff;
  padding:0px 14px;
  .el-table{
    flex:1;
  }
  .block{
    padding:10px 0;
  }
}
</style>