<template>
  <!-- 材料管理 -->
  <div class="material" ref="tableH">
    <div>
      <div class="search-box">
        <Search :fieldData="fieldData" ref="srarch" @searchClick="searchClick">
          <template slot="footer">
<!--            <div class="addCatalog">-->
              <el-button type="warning" icon="el-icon-plus" size="small" @click="editApply('add',{})">申请
              </el-button>
<!--            </div>-->
          </template>
        </Search>
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
          <el-table-column label="操作" align="right" width="120" fixed="right">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="editApply('view',scope.row)">查看</el-button>
              <el-button type="text" size="small" v-if="scope.row.dissentStatus == '4' && roleList.indexOf(scope.row.manageRole) != -1" @click="editApply('reSubmit',scope.row)">重新提交</el-button>
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
  </div>
</template>

<script>
import qzBase from '@_src/pages/mssq/common/util/qzBase';

export default {
  name: "register",
  mixins: [qzBase],
  data() {
    return {
      appLyList:[],
      tableHeight:100,
      roleList:'BMLR,QBMLR,KSLR,QKSLR',
      fieldData: {
          title: {
              label: '异议标题',
              type: 'Input',
              placeholder: '请输入异议标题',
              value: '',
              span: 6,
          },
        itemName: {
          label: '事项名称',
          type: 'Input',
          placeholder: '请输入事项名称',
          value: '',
          span: 6,
          itemWidth:'100px'
        },
        itemCode: {
          label: '事项编码',
          type: 'Input',
          placeholder: '请输入事项编码',
          value: '',
          span: 6,
        },
        Button: {
          type: 'Button',
          span: 6
        }
      },
      objectionDictData:{},
      applyParams:{
        limit:10,
        page:1,
        total:0,
      },
      searchFiled:{},
      objectionClickType:'',
      objectionData: {},

    }
  },
  computed: {
  },
  watch: {
  },
  mounted() {
    if(this.$route.path != this.$store.getters.searchParams.path) this.$store.dispatch("setSearchParams", {});
    if (!this.isEmptyObject(this.$store.getters.searchParams.data)) {
      this.$nextTick(() => {
        this.$refs.srarch.update('itemName', this.$store.getters.searchParams.data.itemName,false);
        this.$refs.srarch.update('itemCode', this.$store.getters.searchParams.data.itemCode,false);
        this.applyParams = this.$store.getters.searchParams.data;
        this.searchFiled = this.$store.getters.searchParams.data;
        this.onQuery();
        this.$store.dispatch("setSearchParams", {});
      })
    }else{
      this.onQuery();
    }
    //表格高度自适应
    this.$nextTick(() => {
      this.tableHeight = this.$refs.tableH.offsetHeight - 210;
    });
    window.onresize = () => {
      return (() => {
        this.tableHeight = this.$refs.tableH.offsetHeight - 210;
      })();
    };
  },

  methods: {
    onQuery() {
      var url = this.Config.baseContext + "/mssq/mssqItemDissent/myDissentList";
      this.searchFiled.page = this.applyParams.page;
      this.searchFiled.limit = this.applyParams.limit;
      // this.searchFiled.deptNo = this.$store.getters.curUser.orgCode;
      this.$http_post(url, this.searchFiled).then(ret => {
        if (ret.state == 1) {
          this.appLyList = ret.rows;
          this.applyParams.total = ret.records;
        } else {
          this.$message.error(ret.message);
        }
      });
    },
    search(type) {
      if (type == 'cz') {
        this.searchFiled.title = '';
        this.searchFiled.status = '';
      }
      this.onQuery();
    },
    searchClick(val) {
      this.searchFiled = {
         title: val.title.value,
         itemName: val.itemName.value,
         itemCode: val.itemCode.value,
      };
      this.onQuery();
    },
    editApply(type, data){
      if(type == 'view' || type == 'reSubmit'){
        // this.$store.dispatch("setObjectionData",data);
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
    formatterStatus(){

    },
    handleCurrentChange(){
      
    },
  },
  destroyed() {
    window.onresize = null;
  },
}
</script>

<style scoped lang="less">
.material {
  position: relative;
  height: 100%;

  &>div {
    height: 100%;
    background: #f8f8f8;
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
