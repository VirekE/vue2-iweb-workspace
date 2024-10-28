<template>
  <div ref="tableH">
    <div class="content">
      <el-form :model="formInline" :inline="true" size="small">
        <div class="flex-sb">
          <div>
            <el-form-item label="表单名称">
              <el-input v-model="formInline.name" placeholder="请输入表单名称"></el-input>
            </el-form-item>
            <el-form-item label="表单ID">
              <el-input v-model="formInline.formId" placeholder="请输入表单ID"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" icon="el-icon-search" @click="onSearch">查询</el-button>
            </el-form-item>
          </div>
        </div>
      </el-form>
      <div class="tab-box">
        <!-- 列表 -->
        <el-table :data="formList" style="width: 100%" :height="tableHeight"
                  class="qz-table-hide">
          <el-table-column label="表单ID" prop="id"></el-table-column>
          <el-table-column label="表单名称" prop="name"></el-table-column>
          <el-table-column label="表单版本" prop="currentVersionName" width="110"></el-table-column>
          <!--            <el-table-column label="表单类型" prop="type" width="110" :formatter="typeFormatter"></el-table-column>-->
          <!--            <el-table-column label="表单状态" prop="status" width="80" :formatter="statusFormatter"></el-table-column>-->
          <el-table-column label="操作" width="200" align="right">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="cancelRelevance(scope.row)">查看关联</el-button>
              <el-button type="text" size="small" @click="onEdit(scope.row)">关联事项</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页 -->
        <div class="block">
           <el-pagination
              @current-change="onPageClick"
              :current-page.sync="formParams.page"
              :page-size="formParams.limit"
              layout="total,prev, pager, next, jumper"
              :total="formParams.total">
          </el-pagination>
        </div>
      </div>
      <el-dialog
          title="关联事项"
          :visible.sync="dialogVisible"
          :close-on-click-modal=false
          width="60%" height="80%"
          class="qz-dialog-padding">
        <el-table :data="tableData" style="width: 100%" height="300" class="qz-table-hide"
                  @selection-change="selectionChangeItem">
          <el-table-column
              type="selection"
              width="55">
          </el-table-column>
          <el-table-column type="index" label="序号" width="50"></el-table-column>
          <el-table-column prop="selfAgentName" label="实施部门名称" width="140" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="itemCode" label="事项编码" show-overflow-tooltip></el-table-column>
          <el-table-column prop="itemName" label="事项名称" show-overflow-tooltip></el-table-column>
          <el-table-column prop="version" label="事项版本" width="100" align="center" show-overflow-tooltip>
          </el-table-column>
        </el-table>
        <div class="block">
          <el-pagination @current-change="handleCurrentChange" :current-page.sync="itemParams.page"
                         :page-size="itemParams.limit" layout="total,prev, pager, next, jumper"
                         :total="itemParams.total">
          </el-pagination>
        </div>
        <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="onSave">关联</el-button>
                <el-button @click="dialogVisible = false">关闭</el-button>
            </span>
      </el-dialog>
      <el-dialog
          title="已关联事项"
          :visible.sync="cancelRelevanceDialog"
          v-if="cancelRelevanceDialog"
          :close-on-click-modal=false
          width="60%" height="80%"
          class="qz-dialog-padding">
        <el-table :data="relevanceData" style="width: 100%" height="300" class="qz-table-hide">
          <el-table-column prop="selfAgentName" label="实施部门名称" width="140" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="itemCode" label="事项编码" show-overflow-tooltip></el-table-column>
          <el-table-column prop="itemName" label="事项名称" show-overflow-tooltip></el-table-column>
          <el-table-column prop="itemVersion" label="事项版本" width="100" align="center" show-overflow-tooltip>
          </el-table-column>
          <el-table-column label="操作" width="100" align="center" show-overflow-tooltip>
            <template slot-scope="scope">
              <el-button type="text" @click="cancel(scope.row)">取消关联</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="block">
          <el-pagination @current-change="relevanceChange" :current-page.sync="relevanceParams.page"
                         :page-size="relevanceParams.limit" layout="total,prev, pager, next, jumper"
                         :total="relevanceParams.total">
          </el-pagination>
        </div>
      </el-dialog>
    </div>
  </div>

</template>

<script>
import qzBase from '@_src/pages/mssq/common/util/qzBase';
// import tag from '../../../components/tag';

export default {
  mixins: [qzBase],
  components: {},
  data() {
    var checkCode = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入编码'));
      } else {
        var url = this.Config.baseContext + "/mssq/mssqLabel/verifyCode";
        this.$http_post(url, {
          code: value,
          id: this.tagData.id || '',
        }).then(ret => {
          if (ret && !ret.state) {
            callback();
          } else if (!ret && !ret.state) {
            callback(new Error('编码重复'));
          } else if (ret && ret.state == 0) {
            callback(new Error(ret.message));
          }
          rLoading.close();
        });
      }
    };
    return {
      dataList: [],
      tableData: [],
      chooseItem: [],
      itemParams: {
        page: 1,
        total: 0,
        limit: 10,
      },
      cancelRelevanceDialog:false,
      relevanceData:[],
      relevanceParams:{
        page:1,
        limit:10,
        total:0
      },
      relationData:{},
      records: 1,
      //搜索条件
      formInline: {
        name: '',
        formId: '',
        area: ''
      },
      //表单分页
      formParams: {
        page: 1,
        limit: 10,
        total: 0
      },
      dataArray: null,
      predefineColors: [
        '#ff4500',
        '#ff8c00',
        '#ffd700',
        '#90ee90',
        '#00ced1',
        '#1e90ff'
      ],
      tagData: {
        color: '#1e90ff'
      },
      currentData:{},
      dialogVisible: false,
      dialogIsEdit: false,
      selectList: [],
      selectRow: {},
      tableHeight: 100,
      rules: {
        name: [
          {required: true, message: '请输入标题', trigger: 'blur'}
        ],
        code: [{required: true, validator: checkCode, trigger: 'blur'}],
        color: [
          {required: true, message: '请选择标签背景颜色', trigger: 'change'}
        ]
      },
      formList:[]
    }
  },
  props: {},
  computed: {},
  watch: {
    dataArray(val) {
      if (!this.isEmptyObject(val)) {
        if (val.length > 2) {
          val.splice(0, 1);
        }
        if (val.length === 2) {
          var start = val[0];
          var end = val[1];
          if (start > end) {
            val[0] = end;
            val[1] = start;
          }
        }

      }
    }
  },
  methods: {
    formatterStatus(row, col) {
      var status = row.isUse;
      if (status === '1') {
        return '是'
      } else {
        return '否'
      }
    },
    formattterDate(row, col) {
      var property = col.property;
      var val = row[property]
      return this.formatDate(val, 'yyyy-MM-dd HH:mm:ss')
    },
    handleSelectionChange(val) {
      console.info(val);
      this.selectList = val;
    },
    selectionChangeItem(val) {
      this.chooseItem = val;
    },
    onAdd() {
      this.tagData = {
        id: '',
        color: '#1e90ff',
        name: '',
        code: '',
        description: ''
      };
      this.dialogIsEdit = false;
      this.dialogVisible = true;
    },
    onEdit(row) {
      this.dialogVisible = true;
      this.relationData = row;
      this.getItemData();
    },
    getItemData() {
      var url = this.Config.baseContext + "/mssq/mssqItemIndex/getItemList";
      // searchParam.deptNo = this.$store.getters.curUser.orgCode;
      var param = {
        page: this.itemParams.page,
        limit: this.itemParams.limit,
      };
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
    onEdittagItem(tagCode) {
      this.$router.push({
        path: '/tag/item_list',
        query: {
          tagCode: tagCode
        }
      });
    },
    handleCurrentChange(val) {
      this.itemParams.page = val;
      this.getItemData();
    },
    cancelRelevance(row) {
      this.cancelRelevanceDialog = true;
      this.currentData = row;
      this.getRelevanceData();
    },
    getRelevanceData(){
      var url = this.Config.baseContext + "/mssq/mssqForm/selectItem";
      var param = {
        formId:this.currentData.id
      };
      this.$http_post(url, param).then(ret => {
        if (ret.state == 1) {
          this.relevanceData = ret.rows;
        } else {
          this.$message.error(ret.message);
        }
      });
    },
    relevanceChange(val){
      this.relevanceParams.page = val;
      this.getRelevanceData();
    },
    cancel(row){
      this.$confirm('是否取消表单【'+this.currentData.name+'】关联的事项【' + row.itemName + '】', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        var url = this.Config.baseContext + "/mssq/mssqForm/delItem";
        var param = {
          itemCode: row.itemCode,
          formId: row.formId
        };
        this.$http_post(url, param).then(ret => {
          if (ret.state == 1) {
            this.getRelevanceData();
          } else {
            this.$message.error(ret.message);
          }
        });
      })
    },
    // 搜索功能
    onSearch() {
      this.formParams.page = 1;
      this.onQuery();
    },
    // 切换页数
    onPageClick(val) {
      this.formParams.page = val;
      this.onQuery();
    },
    onQuery() {
      let url = this.Config.baseContext + "/mssq/pmi/getNewFormList";
      let dept = this.dept;
      let param = {
        page: this.formParams.page,
        rows: this.formParams.limit,
        dept: dept,
        status: "",
        type: "1",
        name: this.formInline.name,
        formId: this.formInline.formId
      };
      this.$http_post(url, param).then(ret => {
        if (ret.state === 1) {
          this.formParams.total = ret.records;
          this.formList = ret.rows;
        } else {
          this.$message.error(ret.message);
        }
      }).catch(err => {
        console.log(err);
      });
    },
    colorChange(val) {
      this.$set(this.tagData, 'color', val)
    },
    onSave() {
      let codes = '';
      for (let i = 0; i < this.chooseItem.length; i++) {
        if(codes === ''){
          codes = this.chooseItem[i].itemCode
        }else{
          codes += ',' + this.chooseItem[i].itemCode
        }
      }
      var url = this.Config.baseContext + "/mssq/mssqForm/relevanceItem";
      this.$http_post(url,{
        itemCodes:codes,
        formId:this.relationData.id
      }).then(ret => {
        if (ret.state == 1) {
          this.$message.success('表单关联事项成功');
          this.onQuery();
          this.dialogVisible = false;
        } else {
          this.$message.error(ret.message)
        }
      });
    },
  },
  mounted() {
    //表格高度自适应
    this.$nextTick(() => {
      this.tableHeight = this.$refs.tableH.offsetHeight - 140;
    });
    window.onresize = () => {
      return (() => {
        this.tableHeight = this.$refs.tableH.offsetHeight - 140;
      })();
    };
    this.onQuery();
  }
};
</script>

<style lang="less" scoped>
.content {
  position: relative;
  height: 100%;
  padding: 20px;
  background: #fff;

  .el-form {
    .programme-btn {
      margin-right: 0;
    }
  }

  .block {
    text-align: right;
    //position: absolute;
    //left: 0;
    //right: 20px;
    //bottom: 20px;
    background: #fff;
  }
}

/deep/ .el-form {
  .color {
    .el-form-item__content {
      display: flex;
      align-items: center;
    }
  }
}

.defaultColor {
  margin: 0 10px;
  width: 30px;
  height: 30px;
}
</style>