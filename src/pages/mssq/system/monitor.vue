<template>
  <div class="content" ref="tableH">
    <!--<el-form :inline="true" size="small">
      <div class="flex-sb">
        <div>
          <el-form-item label="标签编码">
            <el-input v-model="params.code" placeholder=""></el-input>
          </el-form-item>
          <el-form-item label="标签名称">
            <el-input v-model="params.name" placeholder=""></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" @click="onSearch">查询</el-button>
          </el-form-item>
        </div>
        <el-form-item class="programme-btn">
          <el-button size="small" icon="el-icon-plus" @click="onAdd">新增</el-button>
        </el-form-item>
      </div>
    </el-form>-->
	<div class="tab-box">
		<el-table :data="dataList" :height="tableHeight" class="qz-table-hide">
		  <el-table-column prop="importPeopleName" label="导入人名称"></el-table-column>
		  <el-table-column prop="importNum" label="导入次数" align="center" width="100px">
			<template slot-scope="scope">
			  <el-tag>{{scope.row.importNum}}次</el-tag>
			</template>
		  </el-table-column>
		  <el-table-column prop="successNum" label="成功次数" align="center" width="100px">
			<template slot-scope="scope">
			  <el-tag type="success">{{scope.row.successNum}}次</el-tag>
			</template>
		  </el-table-column>
		  <el-table-column prop="erorrNum" label="失败次数" align="center" width="100px">
			<template slot-scope="scope">
			  <el-tag type="danger">{{scope.row.erorrNum}}次</el-tag>
			</template>
		  </el-table-column>
		  <el-table-column prop="importTime" label="导入时间" align="center" width="160px" :formatter="formatterDateTime"></el-table-column>
		  <el-table-column label="操作" width="100px" align="right">
			<template slot-scope="scope">
			  <el-button type="text" size="small" @click="getError(scope.row.id)">查看失败模板</el-button>
			</template>
		  </el-table-column>
		</el-table>
		<div class="block">
		  <el-pagination
				  @current-change="onPageClick"
				  :current-page.sync="params.page"
				  :page-size="params.limit"
				  layout="total,prev, pager, next, jumper"
				  :total="records">
		  </el-pagination>
		</div>
    </div>
  </div>
</template>

<script>
  import qzBase from '@_src/pages/mssq/common/util/qzBase';
  export default {
    mixins: [qzBase],
    name:'monitor',
    data(){
      return{
        dataList: [],
        records: 1,
        params: {
          code:'',
          name:'',
          page: 1,
          limit: 10
        },
        tagData:{
          color:'#1e90ff'
        },
        selectRow: {},
        tableHeight:100,
      }
    },
    props:{

    },
    computed: {

    },
    watch:{
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
      getError(erorrLogId){
        window.open('/local'+ this.Config.baseContext +'/mssq/mssqCatalog/catalogExcel/'+erorrLogId);
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
        const rLoading = this.openLoading();
        var url = this.Config.baseContext + "/mssq/mssqCatalogImport/selectImportList";
        this.$http_post(url, params).then(ret => {
          if (ret.state == 1) {
            let rows = ret.rows;
            this.dataList = rows;
            this.records  = ret.records;
          }else{
            this.$message.error(ret.message)
          }
          rLoading.close();
        });
      },
      colorChange(val) {
        this.$set(this.tagData, 'color', val)
      },
      onSave(){
        this.$refs.form.validate((valid) => {
          if(valid){
            var url = this.Config.baseContext + "/mssq/mssqLabel/saveLabel";
            this.$http_post(url, this.tagData,true).then(ret => {
              if (ret.state == 1) {
                this.$message.success(this.tagData.id?'标签编辑成功':'标签新增成功');
                this.onQuery();
                this.dialogVisible = false;
              }else{
                this.$message.error(ret.message)
              }
            });
          }
        });

      },
    },
    mounted() {
      //表格高度自适应
      this.$nextTick(() => {
        this.tableHeight = this.$refs.tableH.offsetHeight - 85;
      });
      window.onresize = () => {
        return (() => {
          this.tableHeight = this.$refs.tableH.offsetHeight - 85;
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
	.tab-box{
		height:100%;
		background:#fff;
		padding:0 14px;
	}
    .el-form{
      .programme-btn{
        margin-right: 0;
      }
    }
    .block{
      text-align: right;
	  padding:10px 0;
      background: #fff;
    }
  }
  /deep/.el-form{
    .color{
      .el-form-item__content{
        display: flex;
        align-items: center;
      }
    }
  }
  .defaultColor{
    margin: 0 10px;
    width: 30px;
    height: 30px;
  }
</style>