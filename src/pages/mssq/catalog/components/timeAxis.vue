<template>
  <div class="app">
    <div v-if="timeAxis.length>0">
      <div class="exportButton">
        <el-button type="primary" size="mini" v-loading="loading" @click="exportChange">导出变更记录</el-button>
      </div>
      <el-timeline>
        <template v-for="(item,index) in timeAxis">
          <el-timeline-item :key="index" :timestamp="formatDate(item.optTime,'yyyy-MM-dd HH:mm:ss')" placement="top">
            <el-card>
              <h4 class="card-title">操作过程:</h4>
              <div :class="item.isOperateShow?'fbDeptList':''">
                <div :ref="'operateDept'+index" :class="item.isOperateShow?'deptList':''">
                  <span :class="item.fbType == '1'?'fbType':'cacleFbType'">{{item.fbType == '1'?'分拨':'取消分拨'}}</span>
                  <template v-for="row in item.optDeptNameList">
                    <el-tag>{{row}}</el-tag>
                  </template>
                </div>
                <el-button type="text" class="viewMore" v-if="item.isOperateShow" @click="openDeptList(item,'optDeptNameList')">查看更多部门</el-button>
              </div>
              <h4 class="card-title">当前目录已分拨部门:</h4>
              <div :class="item.isShow?'fbDeptList':''">
                <div :ref="'fbDept'+index" :class="item.isShow?'deptList':''">
                  <template v-for="row in item.deptNameList">
                    <el-tag>{{row}}</el-tag>
                  </template>
                </div>
                <el-button type="text" class="viewMore" v-if="item.isShow" @click="openDeptList(item,'deptNameList')">查看更多部门</el-button>
              </div>
            </el-card>
          </el-timeline-item>
        </template>
      </el-timeline>
    </div>
    <div v-else class="no-data">
      <no-data class="nodata" :hText="'暂无职责变更记录'"></no-data>
    </div>
    <el-dialog
        @close="close"
        :title="dialogTitle"
        :visible="fbListDialog"
        :close-on-click-modal=false
        width="30%"
        append-to-body
        class="qz-dialog-padding">
      <template v-for="row in dialogDeptData">
        <el-tag>{{row}}</el-tag>
      </template>
    </el-dialog>
  </div>

</template>

<script>
import qzBase from '@_src/pages/mssq/common/util/qzBase';
import NoData from "../../common/components/NoData";

export default {
  name: "timeAxis",
  components: {NoData},
  mixins: [qzBase],

  data(){
    return{
      timeAxis:[],
      isShow:false,
      loading:false,
      isOperateShow:false,
      fbListDialog:false,
      dialogTitle:'',
      dialogDeptData: [],
    }
  },
  props:{
    changeRecord:{
      type:Object,
      default:()=>{}
    }
  },
  computed:{
  },
  mounted(){
    this.getData();
  },
  methods:{
    getData(){
      var url = this.Config.baseContext + '/mssq/mssqFbRealLog/selectCatalogFbList';
      this.$http_post(url, {
        catalogId:this.changeRecord.catalogId
      }).then(ret => {
        if (ret.state == 1) {
          for (let i = 0; i < ret.rows.length; i++) {
            ret.rows[i].deptNameList = ret.rows[i].deptNameList.split(',')
            ret.rows[i].optDeptNameList = ret.rows[i].optDeptNameList.split(',')
            ret.rows[i].isShow = true;
            ret.rows[i].isOperateShow = true;
          }
          this.timeAxis = ret.rows;
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
          let dom2 = this.$refs["fbDept"+i][0]
          list[i].isOperateShow = dom1.scrollHeight > 90 ? true : false
          list[i].isShow = dom2.scrollHeight > 90 ? true : false
        }
      })
    },
    openDeptList(row,type){
      this.fbListDialog = true;
      this.dialogTitle = '当前目录已分拨部门';
      this.dialogDeptData = row[type]
    },
    close(){
      this.fbListDialog = false;
    },
    exportChange(){
      let _this = this;
      // const rLoading = this.openLoading();
      // this.exportIndex.push(index);
      this.loading = true;
      var url = this.Config.baseContext + "/mssq/mssqFbRealLog/exportFbList";
      let params = {
        catalogId:this.changeRecord.catalogId
      };
      params.page = 1;
      params.limit = 10000;
      this.$http_post(url, params, null, 'blob').then(ret => {
        // rLoading.close();
        if (ret.type == 'application/json') {
          const reader = new FileReader(); //创建一个FileReader实例
          reader.readAsText(ret, 'utf-8'); //读取文件,结果用字符串形式表示
          reader.onload = function() { //读取完成后,**获取reader.result**
            const msg = JSON.parse(reader.result);
            _this.$message.error(msg.message); //弹出错误提示
          };
          return;
        }
        let a = document.createElement('a');
        let url = window.URL.createObjectURL(ret);
        a.href = url;
        //设置文件名称
        var t = this.formatDate(new Date().getTime(), 'yyyyMMddHHmmss');
        let fileName = '职责变更记录' + t + '.xlsx';
        a.download = fileName;
        a.click();
        this.visible = false;
        this.$message.success('导出成功');
        this.loading = false;
      });
    },
  }
}
</script>

<style scoped lang="less">
  .fbType{
    color: #409eff;
    font-weight: 600;
  }
  .cacleFbType{
    color: #f00;
    font-weight: 600;
  }
  .card-title{
    font-weight: 600;
    font-size: 14px;
    padding: 5px 0;
  }
  .deptList{
    overflow: hidden;
    //display: -webkit-box;
    height: 85px;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
  }
  .fbDeptList{
    height: 100px;
    position: relative;
    .viewMore{
      position: absolute;
      right: 50%;
      //left: 50%;
      bottom: -12px;
    }
  }
  .el-tag{
    margin:5px;
  }
  .exportButton{
    position: relative;
    width: 100%;
    .el-button{
      position: absolute;
      right: 10px;
      top: -25px;
    }
  }
  .app{
    height:100%;
    .no-data{
      height:100%;
      :deep(.nodata) {
        p {
          font-size: 14px;
          color: #999;
          margin: 20px 0 10px 0;
        }

        .imgClass {
          height: 108px;
        }
      }
    }
  }

</style>