<template>
  <div class="cardView" ref="tableH">
    <div class="header">
      <page-header :subTitle="subTitle">
      </page-header>
    </div>
    <div class="view">
      <el-card class="box-card box-right" shadow="never">
        <div class="text item">
          <el-table :data="tableData" style="width: 100%" height="100%" class="qz-table-hide">
            <el-table-column type="index" label="序号" width="50"></el-table-column>
            <el-table-column prop="itemCode" label="事项编码" show-overflow-tooltip></el-table-column>
            <el-table-column prop="itemName" label="事项名称" show-overflow-tooltip></el-table-column>
            <!--            <el-table-column prop="proCode" label="省事项编码" show-overflow-tooltip></el-table-column>-->
            <el-table-column prop="proName" label="省事项名称" show-overflow-tooltip></el-table-column>
            <el-table-column prop="isReport" label="是否自动上报" show-overflow-tooltip align="center">
              <template slot-scope="scope">
                <el-tag v-if="scope.row.isReport == '0'">否</el-tag>
                <el-tag v-else-if="scope.row.isReport == '1'">是</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="proName" label="状态" show-overflow-tooltip align="center">
              <template slot-scope="scope">
                <el-tag v-if="scope.row.status == '1'">待上报</el-tag>
                <el-tag v-if="scope.row.status == '2'" type="success">上报成功</el-tag>
                <el-tag v-if="scope.row.status == '3'" type="danger">上报失败</el-tag>
                <el-tag v-if="scope.row.status == '4'" type="danger">上报中</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="lastModifitionTime" label="变更时间" :formatter="formatterDates" show-overflow-tooltip></el-table-column>
            <el-table-column label="操作" align="right" width="240">
              <template slot-scope="scope">
                <el-button type="text" @click="handleError(scope.row)">上报详情</el-button>
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
    <el-dialog  title="上报失败提示"
                :visible.sync="dialogShow"
                :close-on-click-modal=false
                width="70%"
                class="qz-dialog-padding" append-to-body>
      <el-input v-model="fileMessage" :rows="3" type="textarea" readonly></el-input>
    </el-dialog>
  </div>
</template>

<script>
import qzBase from '@_src/pages/mssq/common/util/qzBase';
import PageHeader from '@_src/pages/mssq/common/components/page-header';

export default {
  name: "escalation",
  mixins: [qzBase],
  components: {PageHeader},
  data() {
    return {
      fieldData: {
        status: {
          label: '状态',
          type: 'Select',
          placeholder: '请输入状态',
          value: '',
          span: 8,
          itemWidth: '100px',
          selectList: [{
            name: '待上报',
            id: '1'
          }, {
            name: '上报成功',
            id: '2'
          }, {
            name: '上报失败',
            id: '3'
          }]
        },
        Button: {
          type: 'Button',
          span: 16
        }
      },
      tableData:[],
      dictMap: {},
      itemParams: {
        page: 1,
        limit: 10,
        total: 0
      },
      fileMessage:'',
      formInline: {
        itemName: '',
        itemCode: '',
        status: '',
        manageType: '',
      },
      tableHeight: 100,
      dialogShow: false,
      subTitle: '',
    }
  },
  watch: {

  },
  mounted() {
    //表格高度自适应
    // let _this = this;
    this.subTitle = this.$route.query.itemName
    if(this.$route.path != this.$store.getters.searchParams.path) this.$store.dispatch("setSearchParams", {});
    if (!this.isEmptyObject(this.$store.getters.searchParams.data)) {
      this.$nextTick(() => {
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
      this.tableHeight = this.$refs.tableH.offsetHeight - 220;
    });
    window.onresize = () => {
      return (() => {
        this.tableHeight = this.$refs.tableH.offsetHeight - 220;
      })();
    };
    //加载字典
    this.queryDictMap("BUSI_TYPE,BUSI_GROUP,ITEM_STATUS,MANAGE_TYPE,REGION,ITEM_TYPE", (res) => {
      this.dictMap = res
    });
  },
  methods: {
    onQuery(pageParam, searchParam) {
      searchParam.itemCode = this.$route.query.code
      searchParam.proCode = this.$route.query.proCode
      var url = this.Config.baseContext + "/mssq/mssqEtlItem/reportHistoryList";
      var param = Object.assign({}, pageParam, searchParam);
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
    searchClick(val) {
      this.formInline = {
        status: val.status.value,
      };
      this.reload();
    },
    reload(){
      var pageParam = this.itemParams
      var searchParam = this.formInline
      this.onQuery(pageParam, searchParam);
    },
    handleCurrentChange(val){
      this.itemParams.page = val;
      var pageParam = this.itemParams
      var searchParam = this.formInline
      this.onQuery(pageParam, searchParam);
    },
    formatterDates(row) {
      return this.formatDate(row.lastModifitionTime, "yyyy-MM-dd HH:mm:ss");
    },
    escalation(row){
      this.$confirm('是否上报事项【'+row.itemName+'】', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        var delPro = this.Config.baseContext + "/mssq/mssqEtlItem/reportById";
        this.$http_post(delPro, {
          reportId: row.id
        }).then(ret => {
          if (ret.state == 1) {
            this.$message.success('上报成功');
            var pageParam = this.itemParams;
            var searchParam = this.formInline;
            this.onQuery(pageParam, searchParam);
          }else {
            this.$message.error('上报失败')
          }
        })
      })
    },
    viewHistory(row){
      this.$router.push({
        path:'./escalaHistory',
        query:{
          id:row.id
        }
      })
    },
    handleError(row){
      this.dialogShow = true;
      this.fileMessage = row.message;
    },
    changeIsReport(val,row,index){
      let name = '禁止'
      if(val == '1'){
        name = '开启'
      }
      this.$confirm('是否'+name+'事项【'+row.itemName+'】自动上报', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        var delPro = this.Config.baseContext + "/mssq/mssqEtlItem/editIsReport";
        this.$http_post(delPro, {
          reportId: row.id,
          isReport:val,
        }).then(ret => {
          if (ret.state == 1) {
            this.$message.success('自动上报'+name+'成功');
            var pageParam = this.itemParams;
            var searchParam = this.formInline;
            this.onQuery(pageParam, searchParam);
          }else {
            this.$message.error('自动上报'+name+'失败')
          }
        })
      }).catch((e)=>{
        /*var pageParam = this.itemParams;
        var searchParam = this.formInline;
        this.onQuery(pageParam, searchParam);*/
        if(val == '1'){
          this.tableData[index].isReport = '0'
        }else if(val == '0'){
          this.tableData[index].isReport = '1'
        }
      })
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
  .header{
    background: #fff;
    //padding: 0 10px;
    .page-header{
      padding: 0 10px;
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
    display: flex;
    flex: 1;
    height:calc(100% - 200px);
    .box-left {
      width: 200px;
      border: none;
      height: 100%;
      background: #fff;
      margin-right: 10px;
      /deep/ .el-card__header {
        padding: 14px 10px;
      }
      .title {
        width:100%;
        display:flex;
        align-items: center;
        justify-content: space-between;
        .left{
          display: flex;
          align-items: center;
          .icon {
            width:14px;
            height:14px;
            border-radius:50%;
            background:#3D91F7;
            display:flex;
            justify-content: center;
            align-items: center;
            margin-right:4px;
            i{
              color:#fff;
              font-size:12px;
            }
          }
          span{
            font-size:14px;
          }
        }
      }
      /deep/ .el-card__body {
        padding: 0;
        height:calc(100% - 50px);
        overflow-y: auto;
        .item {
          /*overflow: auto;*/
          height:100%;
          display: flex;
          flex-direction: column;
          height: 100%;
          background:#fff;
        }
      }
    }

    .box-right {
      border: none;
      border-radius: 0;
      display: inline-block;
      width: 100%;

      /deep/ .el-card__body {
        padding: 0;
        height:calc(100%);
        &>.item{
          height:100%;
          display: flex;
          flex-direction: column;
          height: calc(100%);
          background:#fff;
          padding:0px 14px;
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
.popover{
  padding-left: 10px;
}
</style>
