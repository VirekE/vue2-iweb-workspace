<template>
  <div class="content" ref="tableH">
	  <div>
        <page-header subTitle="字典项列表"></page-header>
      <el-form :inline="true" size="small">
          <div class="flex-sb">
              <div>
                  <el-form-item label="字典项编码">
                      <el-input v-model="params.ITEM_CODE"></el-input>
                  </el-form-item>
                  <el-form-item>
                      <el-button type="primary" icon="el-icon-search" @click="onSearch">查询</el-button>
                  </el-form-item>
              </div>
              <el-form-item>
                  <el-button icon="el-icon-plus" @click="onAdd">新增</el-button>
              </el-form-item>
          </div>
      </el-form>
      <el-table :data="dataList"  @selection-change="handleSelectionChange" :height="tableHeight" class="qz-table-hide">
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column prop="itemCode" label="字典项编码" width="200" show-overflow-tooltip></el-table-column>
          <el-table-column prop="itemValue" label="字典项名称" show-overflow-tooltip></el-table-column>
          <el-table-column prop="dictCode" label="字典编码" width="200"></el-table-column>
          <el-table-column prop="description" label="描述" show-overflow-tooltip></el-table-column>
          <el-table-column label="操作" width="140">
              <template slot-scope="scope">
                  <el-button type="text" size="small" @click="onEdit(scope.row)">编辑</el-button>
                  <el-button type="text" size="small" @click="onDelete(scope.row)">删除</el-button>
              </template>
          </el-table-column>
      </el-table>
      <div class="block">
          <el-pagination
                  @current-change="onPageClick"
                  :current-page.sync="params.page"
                  :page-size="params.rows"
                  layout="total,prev, pager, next, jumper"
                  :total="records">
          </el-pagination>
      </div>
       <el-dialog
            :title="dialogIsEdit ? '编辑字典':'添加字典'"
            :visible.sync="dialogVisible"
            :close-on-click-modal=false
            width="60%"
            class="qz-dialog-padding">
            <DictItemEdit :data="selectRow" :isEdit="dialogIsEdit" ref="dictEdit" @close="dialogVisible = false;onQuery()"/>     
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="()=>{$refs.dictEdit.onSave()}">保存</el-button>
                <el-button @click="dialogVisible = false">关闭</el-button>
            </span>
        </el-dialog>
		</div>
  </div>
</template>

<script>
  import DictItemEdit from './dict-item-edit';
  import qzBase from '@_src/pages/mssq/common/util/qzBase';
  import PageHeader from '@_src/pages/mssq/common/components/page-header';
  export default {
    mixins: [qzBase],
    components: {DictItemEdit,PageHeader},
    data(){
      return{
        dataList: [],
        dictCode: '',
        records: 1,
        params: {
          page: 1,
          rows: 10
        },
        dataArray: null,


        dialogVisible: false,
        dialogIsEdit: false,
        selectList: [],
        selectRow: {},
          tableHeight:100
      }
    },
    props:{
      
    },
    computed: {
     
    },
    watch:{
      dataArray(val){
        if(!this.isEmptyObject(val)){
          if(val.length > 2){
            val.splice(0, 1);
          }
          if(val.length === 2){
            var start = val[0];
            var end = val[1];
            if(start > end){
              val[0] = end;
              val[1] = start;
            }
          }
          
        }
      }
    },
    methods:{
      formatterStatus(row,col){
          var status = row.isUse;
           if(status === '1'){
                return '是'
            }else{
                return '否'
            }
      },
      formattterDate(row,col){
       var property = col.property;
       var val = row[property]
       return this.formatDate(val,'yyyy-MM-dd HH:mm:ss')
     },
      handleSelectionChange(val) {
        this.selectList = val;
      },
      onAdd(){
          this.selectRow = {dictCode: this.dictCode,isUse: '1'};
          this.dialogIsEdit = false;
          this.dialogVisible = true;
      },
      onEdit(row){
            this.selectRow = row;
            this.dialogIsEdit = true;
            this.dialogVisible = true;

      },
      onEditDictItem(){

      },
      onDelete(row){
            var selectRow = row;
            var url = this.Config.baseContext + "/mssq/pubDict/deleteDictItem";
            this.$alert('一但删除，将无法恢复', '确定删除该字典项?', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                showCancelButton: true,
            }).then(() => {
                this.$http_post(url, {id: selectRow.id}).then(ret => {
                  if (ret.state == 1) {
                    this.$message.success("删除成功");
                    this.onQuery();
                  }else{
                    this.$alert(ret.message)
                  }
                });
            }).catch(action => {});
      },
      // 搜索功能
      onSearch() {
        this.params.page = 1;
        this.onQuery();
      },
      // 切换页数
      onPageClick(val) {
        this.params.page = val;
        this.onQuery();
      },
      onQuery(){
        var params = this.params;
        var dictCode = this.$route.query.dictCode;
        if(!this.isNotNull(dictCode)){
            this.$message.error("请传递字典编码");
            return;
        }
        this.dictCode = dictCode;
        const rLoading = this.openLoading();
        params.DICT_CODE = dictCode;
        var url = this.Config.baseContext + "/mssq/pubDict/getDictItemList";
        this.$http_post(url, params).then(ret => {
          if (ret.state == 1) {
            let rows = ret.rows;
            this.dataList = rows;
            this.records  = ret.records;
          }else{
            this.$alert(ret.message)
          }
          rLoading.close();
        });
      },
    },
    mounted() {
        //表格高度自适应
        this.$nextTick(() => {
            this.tableHeight = this.$refs.tableH.offsetHeight - 185;
        });
        window.onresize = () => {
            return (() => {
                this.tableHeight = this.$refs.tableH.offsetHeight - 185;
            })();
        };
      this.onQuery();
    }
  };
</script>

<style lang="less" scoped>
    .content{
        position: relative;
        height: 100%;
        padding: 20px;
		
		&>div{
			background:#fff;
			padding:0 14px;
			height:100%;
		}
        .page-header {
            margin-bottom: 10px;
            &.divider{
                border: none;
            }
        }
        .block{
            text-align: right;
            background: #fff;
			padding:10px 0;
        }
    }
</style>