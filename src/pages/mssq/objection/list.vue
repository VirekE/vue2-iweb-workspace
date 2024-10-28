<template>
  <div class="cardView material" ref="tableH">
    <div>
      <div class="search-box">
        <Search :fieldData="fieldData" @searchClick="searchClick" ref="srarch" @chooseDept="chooseDept"></Search>
      </div>
      <div class="tab-box">
        <el-table :data="appLyList" style="width: 100%;" :height="tableHeight" class="qz-table-hide">
          <el-table-column label="事项名称" prop="itemName" show-overflow-tooltip width="200"></el-table-column>
          <el-table-column label="事项编码" prop="itemCode" show-overflow-tooltip width="200"></el-table-column>
          <el-table-column label="异议标题" prop="dissentTitle" show-overflow-tooltip></el-table-column>
          <el-table-column label="提出部门" prop="dissentDeptName" show-overflow-tooltip width="260"></el-table-column>
          <el-table-column label="处理部门" prop="disposalDeptName" show-overflow-tooltip width="260"></el-table-column>
          <el-table-column label="异议状态" prop="dissentStatus" show-overflow-tooltip width="100">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.dissentStatus == '1'">待处理</el-tag>
              <el-tag type="success" v-else-if="scope.row.dissentStatus == '2'">同意</el-tag>
              <el-tag type="danger" v-else-if="scope.row.dissentStatus == '3'">不同意</el-tag>
              <el-tag type="danger" v-else-if="scope.row.dissentStatus == '4'">已退回</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="right" width="80" fixed="right">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="editApply('view',scope.row)">查看</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="block">
          <el-pagination @current-change="handleCurrentChange" :current-page.sync="applyParams.page"
                         :page-size="applyParams.limit" layout="total,prev, pager, next, jumper"
                         :total="applyParams.total">
          </el-pagination>
        </div>
      </div>
    </div>
    <search-dept :chooseDeptDialog="chooseDeptDialog" :isSzsType="true" :isCheckbox="false" :regionDisabled="false"
                 :chooseDeptData="{}" :type="false" @closeDialog="closeDialog" @confirm="confirm"></search-dept>
  </div>
</template>

<script>
import SearchDept from "../components/searchDept";
import qzBase from '@_src/pages/mssq/common/util/qzBase';

export default {
  components: {
    SearchDept
  },
  name: "search",
  mixins: [qzBase],
  data() {
    return {
      chooseDeptDialog: false,
      fieldData: {
          title: {
              label: '异议标题',
              type: 'Input',
              placeholder: '请输入异议标题',
              value: '',
              span: 8,
          },
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
        status: {
          label: '状态',
          type: 'Select',
          placeholder: '请选择状态',
          value: '',
          span: 8,
          selectList: [{
            id:'1',
            name:'待处理',
          },{
            id:'2',
            name:'同意',
          },{
            id:'3',
            name:'不同意',
          }]
        },
        deptId: {
          label: '提出部门名称',
          type: 'inputSelect', //类型
          placeholder: '请选择提出部门名称',
          value: '',
          span: 0, //布局比例
          selectList: []
        },
        deptName: {
          label: '提出部门',
          type: 'inputSelect', //类型
          placeholder: '请选择提出部门名称',
          value: '',
          span: 8, //布局比例
          selectList: []
        },
        Button: {
          type: 'Button',
          span: 8
        }
      },
      dictMap: {},
      formInline: {
        itemName: '',
        itemCode: '',
        deptName: '',
        manageType: '',
        regionCode: '',
        deptNo: '',
        shortCode: '',
        agentCode: ''
      },
      busiType: [],
      regionList: [],
      tableHeight: 100,
      title: '',
      dialogVisible: false,
      activeIndex: '0',

      item_menu: {
        height: ''
      },
      appLyList: [],
      applyParams: {
        page: 1,
        limit: 10,
        total: 0
      },
    }
  },
  watch: {},
  mounted() {
    //加载字典
    this.queryDictMap("BUSI_TYPE,BUSI_GROUP,ITEM_STATUS,MANAGE_TYPE,REGION", (res) => {
      this.dictMap = res;
      this.$nextTick(() => {
        if (this.$route.path != this.$store.getters.searchParams.path) this.$store.dispatch("setSearchParams", {});
        if (!this.isEmptyObject(this.$store.getters.searchParams.data)) {
          // this.activeName = this.$store.getters.searchParams.data.itemType;
          this.fieldData.deptId.selectList.push({
            name: this.$store.getters.searchParams.data.deptName,
            id: this.$store.getters.searchParams.data.deptId
          });
          this.$refs.srarch.update('status', this.$store.getters.searchParams.data.status, false);
          this.$refs.srarch.update('itemName', this.$store.getters.searchParams.data.itemName, false);
          this.$refs.srarch.update('itemCode', this.$store.getters.searchParams.data.itemCode, false);
          this.$refs.srarch.update('deptId', this.$store.getters.searchParams.data.deptId, false);
          this.$refs.srarch.update('deptName', this.$store.getters.searchParams.data.deptName, false);
          this.formInline = this.$store.getters.searchParams.data;
          this.applyParams = this.$store.getters.searchParams.data;
          this.onQuery(this.formInline, this.applyParams);
          this.$store.dispatch("setSearchParams", {});
        } else {
          var searchParam = this.formInline;
          searchParam.deptId = this.$store.getters.curUser.attrMap.SELF_DEPT_ID
          this.fieldData.deptId.value = this.$store.getters.curUser.attrMap.SELF_DEPT_ID;
          this.fieldData.deptName.value = this.$store.getters.curUser.attrMap.SELF_DEPT_NAME;
          this.fieldData.deptId.selectList.push({
            name: this.$store.getters.curUser.attrMap.SELF_DEPT_NAME,
            id: this.$store.getters.curUser.attrMap.SELF_DEPT_ID
          });
        }
        let _this = this;
        this.$nextTick(() => {
          _this.tableHeight = _this.$refs.tableH.offsetHeight - 320;
        });
        window.onresize = () => {
          return (() => {
            _this.tableHeight = _this.$refs.tableH.offsetHeight - 320;
          })();
        };
      });
    });
    //加载列表
  },
  methods: {
    onQuery(pageParam, searchParam) {
      var url = this.Config.baseContext + "/mssq/mssqItemDissent/dissentListAll";
      var param = Object.assign({}, pageParam, searchParam);
      this.$http_post(url, param).then(ret => {
        if (ret.state == 1) {
          this.appLyList = ret.rows;
          this.applyParams.total = ret.records;
        } else {
          this.$message.error(ret.message);
        }
      });
    },
    handleCurrentChange(val) {
      this.applyParams.page = val;
      var pageParam = this.applyParams;
      var searchParam = this.formInline;
      this.onQuery(pageParam, searchParam)
    },
    searchClick(res) {
      this.formInline = {
        title: res.title.value,
        itemName: res.itemName.value,
        itemCode: res.itemCode.value,
        deptId: res.deptId.value,
        deptName: res.deptName.value,
        status: res.status.value,
      };
      this.reload();
    },
    reload() {
      this.applyParams = {
        page: 1,
        total: 0,
        limit: 10
      };
      var pageParam = this.applyParams
      var searchParam = this.formInline
      this.onQuery(pageParam, searchParam);
      this.activeIndex = '0';
    },
    chooseDept() {
      this.chooseDeptDialog = true;
    },
    editApply(type, data){
      if(type == 'view'){
        localStorage.setItem( 'objectionData',JSON.stringify(data));
      }
      this.$router.push({
        path:'/objection/info',
        query:{
          type:type,
          id:data.id
        }
      })
    },
    confirm(val) {
      let arr = [];
      arr.push(val);
      this.fieldData.deptId.selectList = arr;
      this.fieldData.deptName.selectList = arr;
      this.$refs.srarch.update('deptId', val.id, true);
      this.$refs.srarch.update('deptName', val.name, true);
      this.closeDialog();
    },
    closeDialog() {
      this.chooseDeptDialog = false;
    }
  },
  computed: {
  }
}
</script>
<style scoped lang="less">
.material {
  position: relative;
  height: 100%;

  &>div {
    height: 100%;
    //background: #f8f8f8;
    display:flex;
    flex-direction: column;
    .search-box{
      background:#fff;
      margin-bottom:10px;
      width: 100%;
      padding: 10px 14px 0 14px;
    }
  }

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
    /*position: absolute;*/
    background: #fff;
  }
}

.programme-btn {
  display: flex;
  padding-left: 10px;
  justify-content: space-between;

  /deep/.el-popover__reference-wrapper {
    padding: 0 10px;
  }

}

.addCatalog {
  padding-left: 10px;
  /*position: absolute;*/
  /*right: 0;*/
}

.tab-box{
  flex:1;
  display: flex;
  flex-direction: column;
  height: calc(100% - 200px);
  background:#fff;
  padding:0px 14px;
  .block{
    padding:10px 0;
  }
}
</style>
