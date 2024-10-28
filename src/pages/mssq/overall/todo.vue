<template>
  <div class="dealt" ref="tableH">
    <!--<div class="opera">
      <el-form :model="formInline" size="small" label-width="90px">
        <el-row>
          <el-col :span="8">
            <el-form-item label="事项名称">
              <el-input v-model="formInline.itemName" placeholder="请输入事项名称"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="事项编码">
              <el-input v-model="formInline.itemCode" placeholder="请输入事项编码"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="管理类型">
              <el-select v-model="formInline.manageType">
                <el-option value="" label="全部"></el-option>
                <el-option v-for="(opt,index) in dictMap.MANAGE_TYPE" :key="index"  :label="opt.itemValue" :value="opt.itemCode"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8" v-if="this.roleValue.indexOf('ZSJSH') != -1">
            <el-form-item label="部门">
              <el-input v-model="formInline.deptName" placeholder="请选择部门"  :readonly="true">
                <el-button slot="append" class="iconfont icon-caidan" @click="chooseDep"></el-button>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="16">
            <el-form-item class="form-btn">
              <el-button type="primary" icon="el-icon-search" @click="search()">查询</el-button>
              &lt;!&ndash; <el-button icon="el-icon-plus" style="float: right;">地方目录</el-button> &ndash;&gt;
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>-->
    <div class="search-box">
      <Search @searchClick="searchClick" ref="srarch" :fieldData="fieldData"></Search>
    </div>
    <div class="tab-box">
      <el-table :data="tableData" style="width: 100%" class="qz-table-hide" :height="tableHeight">
        <el-table-column type="index" label="序号" width="50"> </el-table-column>
        <el-table-column prop="itemName" label="事项名称" show-overflow-tooltip></el-table-column>
        <el-table-column prop="itemCode" label="事项编码" show-overflow-tooltip></el-table-column>
        <!-- <el-table-column prop="ssbm" label="实施编码" width="100" show-overflow-tooltip></el-table-column>-->
        <el-table-column prop="deptName" label="主管部门" width="200" show-overflow-tooltip></el-table-column>
        <el-table-column prop="version" label="事项版本" width="90" show-overflow-tooltip></el-table-column>
        <el-table-column prop="status" label="发布状态" width="90" show-overflow-tooltip :formatter="dicForValue">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.status == 'EXAMINE_SUCCESS' || scope.row.status == 'PUBLISH' || scope.row.status == 'DISCARD'">{{dicForValue(scope.row)}}</el-tag>
            <el-tag v-if="scope.row.status == 'DRAF'">{{dicForValue(scope.row)}}</el-tag>
            <el-tag type="danger" v-if="scope.row.status == 'EXAMINE_FAIL' || scope.row.status == 'ACCEPT_FAIL'">{{dicForValue(scope.row)}}</el-tag>
            <el-tag type="warning" v-if="scope.row.status == 'EXAMINE_WAIT' || scope.row.status == 'ACCEPT_WAIT'">{{dicForValue(scope.row)}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="lastUpdateTime" label="最后修改时间" width="180" :formatter="formatterDates"></el-table-column>
        <el-table-column label="操作" width="140" algin="right">
          <template slot-scope="scope">
            <el-button type="text" @click="overAllClick(scope.row,'overAllView')">查看</el-button>
            <el-button type="text" @click="onEditItem(scope.row)" v-if="$route.fullPath == '/overAll/todo'">审核</el-button>
            <el-button type="text" @click="overAllClick(scope.row,'overAll')" v-if="$route.fullPath == '/overAll/waitTodo'">统筹</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="block">
        <el-pagination
                @current-change="handleCurrentChange"
                :current-page.sync="itemParams.page"
                :page-size="itemParams.rows"
                layout="total,prev, pager, next, jumper"
                :total="itemParams.total">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
  import qzBase from '@_src/pages/mssq/common/util/qzBase';
  import OrganTree from '@_src/pages/mssq/common/components/organ'

  export default {
    name: "item_todo_list",
    mixins: [qzBase],
    components:{

    },
    data(){
      return{
        fieldData:{
          itemName: {
            label: '事项名称',
            type: 'Input',
            placeholder: '请输入事项名称',
            value: '',
            span: 6,
            itemWidth:'70px',
          },
          itemCode: {
            label: '事项编码',
            type: 'Input',
            placeholder: '请输入事项编码',
            value: '',
            span: 6
          },
          /*manageType: {
            label: '管理类型',
            type: 'Select',
            placeholder: '请输入管理类型',
            value: '',
            span: 6,
            selectList: []

          },*/
          Button: {
            type: 'Button',
            span: 6
          }
        },
        roleValue:'',
        dictMap: {},
        tableData: [],
        tabPosition: 'top',
        itemParams:{
          page:1,
          limit:10,
          total:0
        },
        formInline:{
          itemName:'',
          itemCode:'',
          status:'',
          // manageType:'',
          deptNo:'',
          deptName:'',
        },
        tableHeight:100
      }
    },
    watch:{
     /* manageType:{
        handler(list) {
          if (list) {
            let res = [];
            list.forEach((item) => {
              res.push({
                id: item.itemCode,
                name: item.itemValue
              })
            });
            this.fieldData.manageType.selectList = res
          }
        }
      },*/
    },
    computed:{
     /* manageType(){
        return this.dictMap['MANAGE_TYPE']
      },*/
    },
    mounted() {
      var _this=this;
      //表格高度自适应
      this.$nextTick(() => {
        _this.tableHeight = this.$refs.tableH.offsetHeight -200;
      });
      window.onresize = () => {
        return (() => {
          _this.tableHeight = this.$refs.tableH.offsetHeight-200;
        })();
      };
      this.queryDictMap("BUSI_TYPE,BUSI_GROUP,ITEM_STATUS,MANAGE_TYPE",(res) =>{
        this.dictMap = res
      });
      var curUser = this.$store.getters.curUser;
      this.roleValue=curUser.roleValue;

      //加载列表
      if(this.$route.path != this.$store.getters.searchParams.path) this.$store.dispatch("setSearchParams", {});
      if (!this.isEmptyObject(this.$store.getters.searchParams.data)) {
        this.$nextTick(() => {
          this.$refs.srarch.update('itemCode', this.$store.getters.searchParams.data.itemCode, false);
          this.$refs.srarch.update('itemName', this.$store.getters.searchParams.data.itemName, false);
          this.formInline = this.$store.getters.searchParams.data;
          this.itemParams =this.$store.getters.searchParams.data;
          this.onQuery(this.formInline , this.itemParams);
          this.$store.dispatch("setSearchParams", {});
        })
      }else{
        var pageParam = this.itemParams;
        var searchParam = this.formInline;
        this.onQuery(pageParam, searchParam);
      }
    },

    methods:{
      handleOpen(key, keyPath) {
        console.log(key, keyPath);
      },
      handleClose(key, keyPath) {
        console.log(key, keyPath);
      },
      searchClick(val){
        this.formInline = {
          // manageType:val.manageType.value,
          itemCode:val.itemCode.value,
          itemName:val.itemName.value,
        };
        this.reload();
      },
      chooseDep(){
        var _this = this
        OrganTree.show({
          head: '部门选择',
          isCheckbox: false,
          //深圳市编码440301区划编码穿空字符串，不为440301就传区划编码
          rootCode:  this.$store.getters.curUser.attrMap.REGION_CODE == '440301'?'':this.$store.getters.curUser.attrMap.REGION_CODE,
          isRegion: false,
          regionDisabled: true,
          //removeCode: '160929095719',
          //isRadio:true,
          onOkClick: function(res){
            let arr = [];
            arr.push(res);
            _this.fieldData.deptId.selectList = arr;
            _this.fieldData.deptName.selectList = arr;
            _this.$refs.srarch.update('deptId',res.id,true);
            _this.$refs.srarch.update('deptName',res.name,true);
          }
        });
      },
      onQuery(pageParam,searchParam){
        var url = this.Config.baseContext + "/mssq/mssqItemIndex/asWholeList";
        var param = Object.assign({},pageParam,searchParam);
        if(this.$route.fullPath == '/overAll/todo'){
          param.isAudit = 1;
        }else{
          param.isAudit = 0;
        }
        this.$http_post(url, param).then(ret => {
          if(ret.state == 1){
            this.tableData = ret.rows;
            this.itemParams.total = ret.records;
            window.getNums(ret.records);
          }else{
            this.$message.error(ret.message);
          }
        });
      },
      onEditItem(row){
        this.$store.dispatch("setSearchParams",{path:this.$route.path,data: Object.assign(this.formInline,{page:this.itemParams.page,limit:this.itemParams.limit})});
        //转跳事项梳理页面
        let type = 'overAllTodo';
        this.$router.push({
          path: '/item/info',
          query: {
            itemVid: row.itemVid,
            type:type,
            // editType:
          }
        });
      },
      overAllClick(row,type) {
        this.$store.dispatch("setSearchParams", {path:this.$route.path,data:Object.assign(this.formInline,{page:this.itemParams.page,limit:this.itemParams.limit})});
        this.$router.push({
          path: '/item/info',
          query: {
            itemVid: row.itemVid,
            type:type,
          }
        });
      },
      handleCurrentChange(val){
        this.itemParams.page = val;
        var pageParam = this.itemParams;
        var searchParam = this.formInline;
        this.onQuery(pageParam,searchParam)
      },
      reload(){
        this.itemParams={page:1, total:0,  limit:10};
        var pageParam = this.itemParams
        var searchParam = this.formInline
        this.onQuery(pageParam,searchParam);
      },
      search(){
        this.reload();
      },
      dicForValue(row){
        var status = row.status
        var statusDict = this.dictMap.ITEM_STATUS
        for(var i = 0 ;i<statusDict.length;i++){
          if(statusDict[i].itemCode == status){
            return statusDict[i].itemValue;
          }
        }
        return "";
      },
      formatterDates(row){
        return this.formatDate(row.lastModifitionTime,"yyyy-MM-dd HH:mm:ss");
      },
    }
  }
</script>
<style lang='less' scoped>
  .dealt{
    position: relative;
    height: 100%;
    background: #f8f8f8;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    .block{
      text-align: right;
    }
    .el-form{
      .el-form-item{
        margin-right: 30px;
      }
      .el-select{
        width: 100%;
      }
      .form-btn{
        /deep/ .el-form-item__content{
          text-align: right;
          margin-left: 0!important;
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