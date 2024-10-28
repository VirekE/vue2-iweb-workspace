<template>
  <div>
    <el-timeline>
      <template v-for="(item,index) in timeAxis">
        <el-timeline-item :timestamp="formatDate(item.optTime,'yyyy-MM-dd HH:mm:ss')" placement="top">
          <el-card>
            <div class="cell">
              <h4 class="card-title">部门名称:</h4>
              <div>{{item.oldDeptName}}</div>
            </div>
            <div class="cell">
              <h4 class="card-title">变更后部门名称:</h4>
              <div>{{item.newDeptName}}</div>
            </div>
            <div class="cell">
              <h4 class="card-title">变更类型:</h4>
              <div>{{item.effectOn == 'UPDATE'?"更新":"删除"}}</div>
            </div>
          </el-card>
        </el-timeline-item>
      </template>
    </el-timeline>
  </div>

</template>

<script>
import qzBase from '@_src/pages/mssq/common/util/qzBase';

export default {
  name: "timeAxis",
  mixins: [qzBase],

  data(){
    return{
      timeAxis:[],
      isShow:false,
      isOperateShow:false,
      fbListDialog:false,
      dialogTitle:'',
      dialogDeptData: [],
    }
  },
  props:{
    dialogData:{
      type:Object,
      default:()=>{}
    }
  },
  computed:{},
  mounted(){
    this.getData();
  },
  methods:{
    getData(){
      var url = this.Config.baseContext + '/mssq/mssqDeptEdit/deptEditHistory';
      this.$http_post(url, {
        editId:this.dialogData.id
      }).then(ret => {
        if (ret.state == 1) {
          this.timeAxis = ret.rows;
        } else {
          this.$message.error(ret.message);
        }
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
  .cell{
    display: flex;
    align-items: center;
  }
</style>