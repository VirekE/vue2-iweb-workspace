<!--<style lang="less" src="@_src/pages/mssq/common/css/form.less" scoped></style>-->
<template>
  <div class="info">
    <page-header subTitle="台账详情"></page-header>
    <div class="cardView">
      <el-form :model="formData" :rules="rules" label-width="100px">
        <el-form-item label="批次" prop="indexTitle">
          <el-input v-model="formData.indexTitle"></el-input>
        </el-form-item>
        <el-form-item label="调整时间" prop="adjustTime">
          <el-date-picker
              v-model="formData.adjustTime"
              format="yyyy 年 MM 月 dd 日"
              value-format="yyyy-MM-dd "
              type="date"
              placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="调整内容" prop="adjustContent">
          <el-input v-model="formData.adjustContent"  type="textarea" :rows="3"></el-input>
        </el-form-item>
        <el-form-item label="调整原因" prop="adjustReason">
          <el-input v-model="formData.adjustReason"  type="textarea" :rows="3"></el-input>
        </el-form-item>
      </el-form>
      <div class="footer" style="text-align:center">
        <el-button @click="save" type="success">保存</el-button>
      </div>
    </div>
  </div>
</template>
<script>
import qzBase from '@_src/pages/mssq/common/util/qzBase';
import PageHeader from '@_src/pages/mssq/common/components/page-header';

export default {
  name: "index",
  mixins: [qzBase],
  components: {
    PageHeader
  },
  data(){
    return{
      formData:{

      },
      rules: {
        indexTitle: [{
          required: true,
          message: '请填写批次',
          trigger: 'blur'
        }],
        adjustContent: [{
          required: true,
          message: '请填写调整内容',
          trigger: 'blur'
        }],
        adjustReason: [{
          required: true,
          message: '请填写调整原因',
          trigger: 'blur'
        }],
        adjustTime: [{
          required: true,
          message: '请选择调整时间',
          trigger: 'change'
        }],
      },
    }
  },
  mounted(){
    if(this.$route.query.id){
     this.formData = JSON.parse(localStorage.getItem('standingBookData'))
      this.formData.adjustTime =  this.formatDate(this.formData.adjustTime,"yyyy-MM-dd")
    }
  },
  methods:{
    save(){
      var url = this.Config.baseContext + "/mssq/mssqAdjustRecord/saveAdjust";
      this.$http_post(url, {
        "adjustContent": this.formData.adjustContent,
        "adjustReason": this.formData.adjustReason,
        "adjustTime": this.formData.adjustTime.replace(/\s*/g, ''),
        "indexTitle": this.formData.indexTitle,
        "id": this.$route.query.id || '',
        "creationTime": this.formData.creationTime || '',
        "lastModifitionTime": this.formData.lastModifitionTime || '',
      },true).then(ret => {
        if (ret.state == 1) {
          let message = this.$route.query.id === ''?'台账新增成功':'台账更新成功'
          this.$message.success(message);
          this.$router.go(-1)
        } else {
          this.$message.error(ret.message);
        }
      });
    },
  }
}
</script>
<style lang="less" scoped>
.info{
  //padding: 0!important;
  .page-header{
    background: #fff;
    padding: 10px;
    margin-bottom: 0;
  }
  .cardView{
    padding-top: 20px;
    background: #fff;
    height: calc(100% - 61px);
    overflow: auto;
    .footer {
      width: 100%;
      height: 50px;
      position: relative;
      margin-top: 30px;

      div {
        position: absolute;
        left: 50%;
        top: 0;
        transform: translateX(-50%);

        /deep/ button {
          width: 120px !important;
        }
      }

      /deep/ .el-popover__reference-wrapper {
        padding: 0 10px;
      }
    }
  }
}
</style>
