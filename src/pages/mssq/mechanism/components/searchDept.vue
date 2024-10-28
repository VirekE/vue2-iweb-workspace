<template>
  <el-dialog title="选择单位" width="60%" :close-on-click-modal=false :before-close="closeDialog" class="qz-dialog-padding qz-law"
             :visible.sync="chooseDeptDialog" v-if="chooseDeptDialog">
    <el-tabs @tab-click="tabsChange" v-model="activeName">
      <el-tab-pane label="选择部门" name="0" >
      </el-tab-pane>
      <el-tab-pane label="选择处室/科室" name="1">
      </el-tab-pane>
    </el-tabs>
    <OrganTree
        :type="'organ'" :rootCode="rootCode" @checkChange="checkChange" :cityType="true"
        ref="organTree" :disabledType="activeName" :isCheckbox="isCheckBox" :isSzsType="isSzsType"
        :treeStyle="'max-height: 300px;overflow: auto'"></OrganTree>
    <span slot="footer" class="dialog-footer">
				<el-button @click="closeDialog">取 消</el-button>
				<el-button @click="confirm" type="primary">确 定</el-button>
			</span>
  </el-dialog>
</template>

<script>
  import qzBase from '@_src/pages/mssq/common/util/qzBase';
  import OrganTree from '@_src/pages/mssq/common/components/organ/organ-tree'

  export default {
    mixins: [qzBase],
    components: {
      OrganTree
    },
    name: "searchDept",
    data(){
      return{
        activeName:'0',
        busiType: {},
        selectRow: {},
        searchData: {
          deptName: '',
          deptNo: ''
        },
        isShow:false,
        organTreeArr:[],
        chooseFormParams: {
          page: 1,
          limit: 10,
          total: 0
        },
        tableData:[],
      }
    },
    props:{
      isCheckBox:{
        type:Boolean,
        default:false,
      },
      isSzsType:{
        type:Boolean,
        default:false,
      },
      rootCode:{
        type:String,
        default:'',
      },
      regionDisabled:{
        type:Boolean,
        default:false,
      },
      chooseDeptDialog:{
        type:Boolean,
        default:false,
      },
      type:{// 判断是否分拨页面
        type:Boolean,
        default:false,
      },
      chooseDeptData:{
        type:Object,
        default: ()=>{}
      },
    },
    mounted(){
      this.queryDict("BUSI_TYPE,SSCJ,ITEM_STATUS,MANAGE_TYPE", res => {
        this.busiType = res;
      });
      if (this.$store.getters.curUser.attrMap.REGION_CODE == '440301') { //为深圳市额时候才清空校验缓存
        this.$nextTick(() => {
          // this.$refs.chooseDept.clearValidate();
        });
      }
    },
    computed:{
      manageTypeData() {
        if (this.$store.getters.curUser.attrMap.REGION_CODE == '440301') { //通过440301判断是否展示列表
          if (JSON.stringify(this.busiType) !== '{}') {
            for (let i = 0; i < this.busiType.MANAGE_TYPE.length; i++) {
              if (this.busiType.MANAGE_TYPE[i].itemCode == 'C') {
                this.busiType.MANAGE_TYPE.splice(i, 1)
              }
            }
            return this.busiType.MANAGE_TYPE;
          }
        }else{
          if (JSON.stringify(this.busiType) !== '{}') {
            for (let i = 0; i < this.busiType.MANAGE_TYPE.length; i++) {
              if (this.busiType.MANAGE_TYPE[i].itemCode == 'A') {
                this.busiType.MANAGE_TYPE.splice(i, 1)
              }
            }
            return this.busiType.MANAGE_TYPE;
          }
        }
      },
      tableIsDisabled(){
        return function (val) {
          if(this.type){
            if (val.deptLevel == '2' || val.deptLevel == '4' || val.deptLevel == '6') {
              return false;
            } else {
              return true
            }
          }else{
            return true
          }

        }
      }
    },
    methods:{
      tabsChange(val) {
        this.isShow = false;
        if(val.label == '查询部门')this.isShow = true;
        this.getTableList();
      },
      searchDept(type) {
        if (type == 'cz') {
          this.searchData.deptName = '';
          this.searchData.deptNo = '';
        }
        this.chooseFormParams.page = 1;
        this.getTableList()
      },
      chooseChangePage(data) {
        this.chooseFormParams.page = data;
        this.getTableList()
      },
      getTableList() {
        let url = this.Config.baseContext + '/mssq/pmi/getDeptListToPage';
        this.$http_post(url, {
          deptNo: this.searchData.deptNo,
          deptName: this.searchData.deptName,
          regionCode:this.type? this.$store.getters.curUser.attrMap.REGION_CODE:'',
          page: this.chooseFormParams.page,
          limit: this.chooseFormParams.limit
        }).then(ret => {
          if (ret.state == 1) {
            this.tableData = ret.rows;
            this.chooseFormParams.total = ret.records;
          } else {
            this.$message.error(ret.message);
          }
        });
      },
      isDisabled(data,index) {
        if (data.deptLevel == '2' || data.deptLevel == '4' || data.deptLevel == '6') {
          return false;
        } else {
          return true
        }
      },
      checkChange(val) {
        this.organTreeArr = val;
      },
      handleSelectionChange(data) {
        this.organTreeArr = [];
        for (let i = 0; i < data.length; i++) {
          this.organTreeArr.push({
            "name": data[i].name,
            "id": data[i].id,
            "code": data[i].creditCode,
            "regionCode": data[i].areaCode,
            "regionName": data[i].areaName
          })
        }
      },
      handleChange(val){
        this.organTreeArr = [];
        for (let i = 0; i < this.tableData.length; i++) {
          if(this.tableData[i].id == val){
            this.organTreeArr = {
              id:val,
              name:this.tableData[i].name
            };
          }
        }
      },
      confirm(){
        let params = {
          "deptId": this.organTreeArr.id,
          "deptName": this.organTreeArr.name,
          "deptNo": this.organTreeArr.code,
          "editId": this.$route.query.id,
          "isAgent": this.activeName,
          "itemVids": [],
          "regionCode": this.organTreeArr.regionCode,
          "regionName": this.organTreeArr.regionName
        }
        this.$emit('confirm',params);

      },
      closeDialog(){
        this.$emit('closeDialog');
      },
    }
  }
</script>

<style scoped lang="less">
  :deep(.searchForm){
    .el-row{
      padding-bottom: 10px;
      .el-col{
        height: 45px;
        justify-content: end;
        align-items: center;
        &.button-col{
          display: flex;
        }
        .el-form-item{
          margin: 0;
          .el-input{
            width: 100%;
          }
        }
      }
    }

  }
  .searchButton {
    text-align: end;
  }

  .pagination {
    text-align: end;
  }
</style>