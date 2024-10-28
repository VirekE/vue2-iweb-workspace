<template>
  <div>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <template v-for="(item,index) in tabsList">
        <el-tab-pane :key="index" :name="item.value" :label="item.label" ></el-tab-pane>
      </template>
    </el-tabs>
    <el-table :data="tableData" height="300px">
      <el-table-column label="部门名称" prop="name"></el-table-column>
      <el-table-column label="区划名称" prop="areaName" width="130"></el-table-column>
      <el-table-column label="操作" width="100" align="right">
        <template slot-scope="scope">
          <el-button @click="chooseDept(scope.row)" size="mini" type="primary">选择</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import qzBase from '@_src/pages/mssq/common/util/qzBase';

export default {
  name: "chooseDept",
  mixins: [qzBase],
  data(){
    return{
      activeName:'1',
      tableData:[],
      chooseData:{}
    }
  },
  mounted(){
    let curUser = this.infoData;
    if(curUser.manageRole == 'ZSJSH' && curUser.regionCode == '440301'){
      this.activeName = '1';
    }else if(curUser.manageRole != 'ZSJSH' && curUser.regionCode != '440301'){
      this.activeName = '4';
    }else{
      this.activeName = '2';
    }
    this.getTableData();
  },
  props:{
    infoData:{
      type:Object,
      default:()=>{}
    }
  },
  computed:{
    tabsList(){
      let list = [];
      let curUser = this.infoData;
      if(curUser.manageRole == 'ZSJSH' && curUser.regionCode == '440301'){
        list =  [{
          label:'市级事项职责管理员',
          value:'1'
        }]
        return list
      }else if(curUser.manageRole == 'ZSJSH' && curUser.regionCode != '440301'){
        list =  [{
          label:'市级事项审核管理员',
          value:'2'
        },{
          label:'区级事项职责管理员',
          value:'3'
        }]
        return list
      }else if(curUser.manageRole == 'ZSJBB' && curUser.regionCode != '440301'){
        list =  [{
          label:'市级事项职责管理员',
          value:'1'
        },{
          label:'市级事项审核管理员',
          value:'2'
        }]
        return list
      }else{
        this.activeName = '4'
        return [];
      }
    },
    isShow(){
      return function (val){
        if(val.id == this.infoData.disposalDeptId){
          return false
        }
        return true
      }
    }
  },
  methods:{
    getTableData(){debugger
      let obj = {
        1:{
          regionCode:'440301',
          role:'ZSJBB'
        },
        2:{
          regionCode:'440301',
          role:'ZSJSH'
        },
        3:{
          regionCode:this.$store.getters.curUser.attrMap.REGION_CODE,
          role:'ZSJBB'
        },
        4:{
          regionCode:this.$store.getters.curUser.attrMap.REGION_CODE,
          role:'ZSJSH'
        }
      };
      this.chooseData = obj[this.activeName]
      var url = this.Config.baseContext + "/mssq/mssqItemDissent/dissentDeptList";
      this.$http_post(url, {
        regionCode:obj[this.activeName].regionCode,
        role:obj[this.activeName].role,
      }).then(ret => {
        if (ret.state == 1) {
          this.tableData = ret.rows;
        } else {
          this.$message.error(ret.message);
        }
      });
    },
    chooseDept(row){
      if((row.deptLevel != 3 && row.areaNum == '440301') || (row.deptLevel != 5 && row.areaNum != '440301')){
        const rLoading = this.openLoading();
        let url = this.Config.baseContext+'/mssq/pmi/getDeptAndAgentById';
        this.$http_post(url, {
          id:row.id
        }).then(ret => {
          rLoading.close();
          if(ret.state === 1){
            let dataObj = {
              id:ret.row.SELF_DEPT_ID,
              name:ret.row.SELF_DEPT_NAME,
              creditCode:ret.row.SELF_DEPT_NO
            }
            this.$emit('pushDept',dataObj,this.chooseData)
          }else{
            this.$message.error(ret.message);
          }
        });
      }else{
        this.$emit('pushDept',row,this.chooseData)
      }
    },
    handleClick(){
      this.getTableData();
    },
  }
}
</script>

<style scoped>

</style>