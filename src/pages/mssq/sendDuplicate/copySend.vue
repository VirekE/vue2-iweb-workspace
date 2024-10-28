<template>
  <div class="dialog">
<!--    <div class="sendCopyButton">-->
<!--&lt;!&ndash;      <el-button size="mini" v-if="activeName === 'first'" @click="sendDept">抄送部门</el-button>&ndash;&gt;-->
<!--    </div>-->
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="抄送列表" name="first">
        <el-table :data="sendCopyList" height="300">
          <el-table-column type="index" label="序号" width="50"></el-table-column>
          <el-table-column prop="deptName" label="抄送部门" show-overflow-tooltip></el-table-column>
          <el-table-column prop="creationTime" :formatter="formatterDateTime" label="抄送时间" show-overflow-tooltip></el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="抄送日志" name="second">
        <div class="sendCopyHistory">
          <div class="totalNum">共抄送<span>{{pageParams.total}}</span>条</div>
          <el-timeline>
            <template v-for="(item,index) in timeAxis">
              <el-timeline-item :key="index" :timestamp="formatDate(item.creationTime,'yyyy-MM-dd HH:mm:ss')" placement="top">
                <el-card>
                  <h4 class="card-title">抄送部门:</h4>
                  <div class="card-body">
                    <div :ref="'operateDept'+index" class="card-cell">
                      <template v-for="row in item.sendDept">
                        <el-tag>{{row.deptName}}</el-tag>
                      </template>
                    </div>
                    <div class="card-footer">
                      <el-button type="text" class="viewMore" v-if="item.isOperateShow" @click="viewDept(item.sendDept)">查看所有部门</el-button>
                    </div>
                  </div>
                </el-card>
              </el-timeline-item>
            </template>
          </el-timeline>
        </div>
      </el-tab-pane>
    </el-tabs>
    <el-dialog
        title="查看抄送部门"
        :visible.sync="viewDialog"
        width="60%"
        :close-on-click-modal="false"
        class="qz-dialog-padding" append-to-body>
      <div class="dialog-body">
        <div class="viewDeptList">
          <template v-for="item in deptList">
            <el-tag>{{item.deptName}}</el-tag>
          </template>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import qzBase from '@_src/pages/mssq/common/util/qzBase';
import OrganTree from "../common/components/organ/organ-tree";

export default {
  name: "copySend",
  components: { OrganTree},
  mixins: [qzBase],

  data(){
    return{
      pageParams:{
        page:1,
        rows:1000000,
        total:0
      },
      timeAxis:[],
      showIndex:'0',
      regionDisabled:true,
      isCheckBox:true,
      viewDialog:false,
      activeName:'first',
      sendCopyData:{},
      sendCopyList:[],
      chooseData:[],
      copyData:[],
      deptList:[],
    }
  },
  props:{
    itemInfo:{
      type:String,
      default:''
    }
  },
  mounted(){
    this.getData();
  },
  methods:{
    getData(){
      let url =this.Config.baseContext + '/mssq/mssqItemSendCopy/getItemSendCopyInfo';
      var param = {};
      param.itemCode = this.itemInfo.itemCode
      this.$http_post(url, param).then(ret => {
        if (ret.state == 1) {
          let sendCopyDept = JSON.parse(ret.row.sendCopyDept);
          for (let i = 0; i < sendCopyDept.length; i++) {
            sendCopyDept[i].creationTime = ret.row.creationTime
          }
          this.sendCopyList = sendCopyDept || [];
        } else {
          this.$message.error(ret.message);
        }
      });
    },
    getLogData(){
      let url =this.Config.baseContext + '/mssq/mssqItemSendCopy/getItemSendCopyLog';
      var param = Object.assign({},this.pageParams,this.sendCopyData);
      param.itemCode = this.itemInfo.itemCode
      this.$http_post(url, param).then(ret => {
        if (ret.state == 1) {
          let arr = JSON.parse(JSON.stringify(ret.rows)) || []
          for (let i = 0; i < arr.length; i++) {
            arr[i].sendDept = JSON.parse(arr[i].sendCopyDept)
          }
          this.timeAxis = arr || [];
          this.pageParams.total = ret.records
          this.getHeight(this.timeAxis)
        } else {
          this.$message.error(ret.message);
        }
      });
    },
    getHeight(list){
      this.$nextTick(()=>{
        for(let i=0;i<list.length;i++){
          let dom1 = this.$refs["operateDept"+i][0]
          let value = dom1.scrollHeight > 80 ? true : false
          console.log(value)
          this.$set(list[i],'isOperateShow',value)
        }
      })
    },
    handleClick(data){
      this.showIndex = data.index
      if(data.index === '0'){
        this.getData()
      }else{
        this.getLogData()
      }
    },

    viewDept(data){
      this.deptList = data;
      this.viewDialog = true;
    },
  }
}
</script>

<style scoped lang="less">
.dialog{
  position: relative;
  .sendCopyButton{
    position: absolute;
    top: 5px;
    right: 0;
    .el-button{
      z-index: 99999;
      position: relative;
    }
  }
  .sendCopyHistory{
    height: 300px;
    padding-right: 10px;
    overflow: auto;
    .totalNum{
      margin-bottom: 10px;
      span{
        color: #409eff;
      }
    }
  }
}
.card{
  &-title{
    padding: 0 0 10px 0;
  }
  &-body{
    .el-tag{
      margin: 5px;
    }
  }
  &-cell{
    max-height: 80px;
    overflow: hidden;
  }
  &-footer{
    text-align: center;
  }
}

.dialog-body{
  max-height: 300px;
  .viewDeptList{
    display: flex;
    flex-wrap: wrap;
    .el-tag{
      margin: 5px;
    }
  }
}
.el-table{
  width: 100%;
}
</style>