<!--<style lang="less" src="@_src/pages/mssq/common/css/form.less" scoped></style>-->
<template>
  <div class="info">
    <page-header subTitle="目录职责清单详情"></page-header>
    <div class="cardView">
      <el-form :model="formData" :rules="rules" label-width="180px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="一级索引名称" prop="indexLv1">
              <el-input v-model="formData.indexLv1"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="一级索引编码" prop="indexLv1Code">
              <el-input v-model="formData.indexLv1Code"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="二级索引名称" prop="indexLv2">
              <el-input v-model="formData.indexLv2"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="二级索引编码" prop="indexLv2Code">
              <el-input v-model="formData.indexLv2Code"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="三级分类（事件描述）" prop="indexLv3">
              <el-input v-model="formData.indexLv3"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="三级分类编码" prop="indexLv3Code">
              <el-input v-model="formData.indexLv3Code"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="事项来源" prop="itemSource">
              <el-input v-model="formData.itemSource"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="事项层级" prop="sxcj">
              <el-input v-model="formData.sxcj"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="部门名称" prop="deptName">
              <el-input v-model="formData.deptName" type="textarea" :rows="3"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
<!--        <el-form-item label="批次" prop="indexTitle">
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
        </el-form-item>-->
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
    this.formData = JSON.parse(localStorage.getItem('catalogZzqd'))
  },
  methods:{
    save(){
      var url = this.Config.baseContext + "/mssq/mssqDutyExt/saveDuty";
      this.$http_post(url, this.formData,true).then(ret => {
        if (ret.state == 1) {
          this.$message.success('职责清单更新成功');
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
    padding: 10px;
    //padding-top: 20px;
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
