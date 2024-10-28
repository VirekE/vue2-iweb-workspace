<template>
  <div ref="tableH">
    <div class="tooltip">
      <div v-if="!isEdit" class="tooltip-textShow">
        <div class="tooltip-title">简报</div>
        <span class="tooltip-text">{{tooltipData.adjustContent}}</span>
        <el-button  v-if="$store.getters.curUser.roleValue && $store.getters.curUser.roleValue.indexOf('MSA02RS06') != -1" type="text" class="el-icon-edit" @click="isEdit = true"></el-button>
      </div>
      <div v-else class="tooltip-bottom">
        <el-input  v-model="formData.ajContent" type="textarea" :rows="3">
        </el-input>
        <div class="tooltip-button">
          <el-button size="mini" type="success" class="el-icon-check" @click="saveTooltip">保存</el-button>
          <el-button size="mini" type="warning" class="el-icon-close" @click="isEdit = false">取消</el-button>
        </div>
      </div>
    </div>
    <div class="search-box">
      <Search :fieldData="fieldData" ref="srarch" @searchClick="searchClick">
        <template slot="footer"  v-if="$store.getters.curUser.roleValue && $store.getters.curUser.roleValue.indexOf('MSA02RS06') != -1">
          <div class="addCatalog">
            <el-button type="warning" size="small" icon="el-icon-plus"
                       @click="addStandingBook({})">新增台账
            </el-button>
          </div>
        </template>
      </Search>
    </div>
    <div class="text item">
      <el-table :data="tableData" style="width: 100%" :height="tableHeight" class="qz-table-hide">
        <el-table-column type="index" label="序号" width="50"></el-table-column>
        <el-table-column prop="indexTitle" label="批次" width="150" show-overflow-tooltip></el-table-column>
        <el-table-column prop="adjustContent" label="调整内容" show-overflow-tooltip></el-table-column>
        <el-table-column prop="adjustReason" label="调整原因" show-overflow-tooltip></el-table-column>
        <el-table-column prop="adjustTime" label="调整时间" width="150" :formatter="formatterDates" show-overflow-tooltip></el-table-column>
        <el-table-column label="操作" width="100" align="right"  >
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="addStandingBook(scope.row)">编辑</el-button>
            <el-button type="text" size="small" @click="delData(scope.row)">删除</el-button>
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
  </div>
</template>

<script>
import qzBase from '@_src/pages/mssq/common/util/qzBase';

export default {
  name: "index",
  mixins: [qzBase],

  data(){
    return{
      formInline:{
        content:"",
        title:"",
        queryTime:"",
      },
      tableHeight:100,
      itemParams:{
        page: 1,
        limit: 10,
        total: 0
      },
      tableData:[],
      fieldData: {
        title: {
          label: '批次',
          type: 'Input',
          placeholder: '请输入批次',
          value: '',
          span: 8
        },
        queryTime: {
          label: '调整时间',
          type: 'DatePicker',
          placeholder: '请选择调整时间',
          types: 'date',
          value: '',
          valueFormat: 'yyyy-MM-dd',
          span: 8,
        },
        content: {
          label: '调整内容',
          type: 'Input',
          placeholder: '请输入调整内容',
          value: '',
          span: 8
        },
        adjustReason: {
          label: '调整原因',
          type: 'Input',
          placeholder: '请输入调整原因',
          value: '',
          span: 8
        },
        Button: {
          type: 'Button',
          span: 16
        }
      },
      formData:{
        ajContent:''
      },
      tooltipData:{},
      isEdit:false,
    }
  },
  computed:{
  },
  mounted(){
    this.getTooltip();
    this.getList();
    this.$nextTick(() => {
      this.tableHeight = this.$refs.tableH.offsetHeight - 269;
    });
    window.onresize = () => {
      return (() => {
        this.tableHeight = this.$refs.tableH.offsetHeight - 269;
      })();
    };
  },
  methods:{
    getTooltip(){
      // console.log(this.Config)
      var url = this.Config.baseContext + "/mssq/mssqAdjustRecord/selectByOne";
      this.$http_post(url, {}).then(ret => {
        if (ret.state == 1) {
          this.tooltipData = ret.row;
          this.formData.ajContent = ret.row.adjustContent
        } else {
          this.$message.error(ret.message);
        }
      });
    },
    formatterDates(row){
      return this.formatDate(row.adjustTime,"yyyy-MM-dd");
    },
    getList(){
      // console.log(this.Config)
      var url = this.Config.baseContext + "/mssq/mssqAdjustRecord/getList";
      this.$http_post(url, {
        page:this.itemParams.page,
        limit:this.itemParams.limit,
        content:this.formInline.content,
        queryTime:this.formInline.queryTime,
        adjustReason:this.formInline.adjustReason,
        title:this.formInline.title,
      }).then(ret => {
        if (ret.state == 1) {
          this.tableData = ret.rows;
          this.itemParams.total = ret.records;
        } else {
          this.$message.error(ret.message);
        }
      });
    },
    handleCurrentChange(val){
      this.itemParams.page = val;
      this.getList();
    },
    searchClick(val){
      this.formInline = {
        content:val.content.value,
        queryTime:val.queryTime.value,
        adjustReason:val.adjustReason.value,
        title:val.title.value,
      };
      this.getList();
    },
    addStandingBook(data){
      let query = {}
      if(JSON.stringify(data) !== '{}'){
        query = {id:data.id}
      }
      localStorage.setItem('standingBookData',JSON.stringify(data))
      this.$router.push({
        path:'info',
        query:query,
      })
    },
    delData(val){
      this.$confirm('是否删除【'+val.indexTitle+'】批次?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        var url = this.Config.baseContext + "/mssq/mssqAdjustRecord/delById";
        this.$http_post(url, {
          id:val.id,
        }).then(ret => {
          if (ret.state == 1) {
            this.$message.success('删除成功');
            this.getList();
          } else {
            this.$message.error(ret.message);
          }
        });
      }).catch((e) => {
        console.log(e)
      });
    },
    saveTooltip(){
      var url = this.Config.baseContext + "/mssq/mssqAdjustRecord/saveAdjust";
      this.$http_post(url, {
        "adjustContent": this.formData.ajContent,
        "id": this.tooltipData.id,
      },true).then(ret => {
        if (ret.state == 1) {
          this.$message.success('提示更改成功');
          this.isEdit = false;
          this.getTooltip();
        } else {
          this.$message.error(ret.message);
        }
      });
    },
  },
}
</script>

<style scoped lang="less">
  .tooltip{
    //background: #fff;
    //padding: 10px;
    .tooltip-textShow{
      background: #fff;
      padding: 10px;
      .tooltip-text{
        padding-right: 10px;
        //color: #f00;
      }
      display: flex;
      align-items: center;
      .tooltip-title{
        //clip-path: polygon(0 0, 88% 0, 88% 35%, 95% 50%, 88% 65%, 88% 100%, 0 100%);
        //height: 30px;
        margin-right: 10px;
        line-height: 16px;
        min-width: 50px;
        color: #fff;
        max-width: 50px;
        padding: 10px;
        background: #007fff;
        border-radius: 10px;
        position: relative;
        &::after{
          //background:#2281E196 ;
          content: '';
          position: absolute;
          width: 0;
          height: 0;
          /* 箭头靠右边 */
          top: 13px;
          right: -9px;
          border-top: 10px solid transparent;
          border-bottom: 10px solid transparent;
          border-left: 10px solid #007fff;
          /* 箭头靠下边 */
          /* left: 25px;
          bottom: -10px;
          border-left: 10px solid transparent;
          border-right: 10px solid transparent;
          border-top: 10px solid teal; */
          /* 箭头靠左边 */
          /* top: 13px;
          left: -10px;
          border-top: 10px solid transparent;
          border-bottom: 10px solid transparent;
          border-right: 10px solid teal; */
          /* 箭头靠下边 */
          /* top: -10px;
          left: 25px;
          border-left: 10px solid transparent;
          border-right: 10px solid transparent;
          border-bottom: 10px solid teal; */
        }
      }
    }

    .tooltip-button{
      padding: 0;
    }
    .tooltip-bottom{
      padding: 10px;
      background: #fff;
      .tooltip-button{
        text-align: end;
        margin-top: 10px;
      }
    }
  }
  .search-box {
    background: #fff;
    width: 100%;
    /*display: flex;*/
    margin: 10px 0 10px 0;
    .addCatalog {
      display: flex;
      padding-left: 10px;
      /*position: absolute;*/
      /*right: 0;*/
    }
  }
  .item{
    background: #fff;
    .block{
      text-align: end;
      padding: 10px 0;
    }
  }
</style>