<!--<style lang="less" src="@_src/pages/mssq/common/css/form.less" scoped></style>-->
<template>
  <div class="cardView">
    <div class="objection">
      <page-header :subTitle="$route.query.type == 'add'?'异议申请':'查看异议'">
      </page-header>
      <template v-if="$route.query.id">
        <div class="view" ref="getHeight">
          <el-tabs v-model="activeName" @tab-click="changeTabs">
            <el-tab-pane label="异议信息" name="info">
              <el-form ref="form" :model="objectionData" :rules="rules" label-width="180px">
                <div class="fromBox">
                  <el-row>
                    <el-col :span="24">
                      <el-form-item label="异议标题" prop="dissentTitle" class="select">
                        <el-input :class="!canEdit?'inputDisabled':''" :readonly="!canEdit"
                                  v-model="objectionData.dissentTitle" placeholder="请输入异议标题"></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="24">
                      <el-form-item label="异议内容" prop="dissentContent" class="select">
                        <el-input :class="!canEdit?'inputDisabled':''" v-model="objectionData.dissentContent"
                                  :readonly="!canEdit" placeholder="请输入异议内容" type="textarea" :rows="3"></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="24">
                      <el-form-item label="附件">
                        <el-upload  class="upload" ref="material" :disabled="!canEdit"
                                    :before-upload="beforeUpload"
                                    :before-remove="modelBeforeRemove"
                                    accept=".jpg,.jpeg,.png,.pdf"
                                    :action="uploadUrl"
                                    :on-remove="modelRemove"
                                    :on-success="modelSuccess"
                                    :on-preview="onPreview"
                                    :limit="3"
                                    :headers="uploadHeaders"
                                    :on-error="modelError"
                                    :file-list="objectionData.dissentFile">
                          <el-button size="small" type="primary" :disabled="!canEdit">上传附件</el-button>
                          <div slot="tip" class="el-upload__tip">只能上传jpg/png/pdf/jpeg文件，且不超过3个</div>
                        </el-upload>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="24">
                      <el-form-item label="选择事项" prop="itemName">
                        <el-input :class="!canEdit?'inputDisabled':''" placeholder="请选择事项" readonly :disbaled="!canEdit" v-model="objectionData.itemName" class="input-with-select">
                          <template slot="append">
                            <el-button class="iconfont icon-caidan" :disabled="isClick" @click="openItem"></el-button>
                          </template>
                        </el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                </div>
              </el-form>
            </el-tab-pane>
            <el-tab-pane label="流转过程" name="circulation" v-if="$route.query.id">
              <circulation-process :parentHeight="parentHeight" @childHeight="childHeight">
              </circulation-process>
            </el-tab-pane>
          </el-tabs>
        </div>
      </template>
      <template v-else>
        <el-form ref="form" :model="objectionData" :rules="rules" label-width="180px">
          <div class="fromBox">
            <el-row>
              <el-col :span="24">
                <el-form-item label="异议标题" prop="dissentTitle" class="select">
                  <el-input :class="!canEdit?'inputDisabled':''" :readonly="!canEdit"
                            v-model="objectionData.dissentTitle" placeholder="请输入异议标题"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item label="异议内容" prop="dissentContent" class="select">
                  <el-input :class="!canEdit?'inputDisabled':''" v-model="objectionData.dissentContent"
                            :readonly="!canEdit" placeholder="请输入异议内容" type="textarea" :rows="3"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item label="附件">
                  <el-upload  class="upload" ref="material" :disabled="!canEdit"
                              :before-upload="beforeUpload"
                              :before-remove="modelBeforeRemove"
                              :action="uploadUrl"
                              :on-remove="modelRemove"
                              :on-success="modelSuccess"
                              :on-preview="onPreview"
                              :on-exceed="onExceed"
                              :limit="3"
                              accept=".jpg,.jpeg,.png,.pdf"
                              :headers="uploadHeaders"
                              :on-error="modelError"
                             :file-list="objectionData.dissentFile">
                    <el-button size="small" type="primary" :disabled="!canEdit">上传附件</el-button>
                    <div slot="tip" class="el-upload__tip">只能上传jpg/png/pdf/jpeg文件，且不超过3个</div>
                  </el-upload>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item label="选择事项" prop="itemName">
                  <el-input placeholder="请选择事项" readonly v-model="objectionData.itemName"  class="input-with-select">
                    <el-button slot="append" class="iconfont icon-caidan" :disabled="isClick" @click="openItem"></el-button>
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
        </el-form>
      </template>
      <div class="footer" style="text-align:center">
        <el-button @click="$router.go(-1)" type="primary">返 回</el-button>
        <el-button type="success" v-if="$route.query.type == 'add'" @click="submit">提 交</el-button>
        <el-button type="success" v-if="$route.query.type == 'reSubmit'" @click="reSubmitInfo">重新提交</el-button>
        <el-button type="success" v-if="$route.query.type == 'todo'" @click="agree">同 意</el-button>
        <el-button type="warning" v-if="$route.query.type == 'todo'" @click="disAgree">不 同 意</el-button>
      </div>
    </div>
    <el-dialog :visible="itemDialog"
               title="选择事项" width="80%"
               @close="close" class="qz-dialog-padding">
      <el-form :model="searchData" size="small" label-width="70px">
        <el-row>
          <el-col :span="8">
            <el-form-item label="事项名称">
              <el-input v-model="searchData.itemName" placeholder="请输入事项名称"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="事项编码">
              <el-input v-model="searchData.itemCode" placeholder="请输入事项编码"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item class="form-btn">
              <el-button type="primary" icon="el-icon-search" @click="search('search')">查询</el-button>
              <el-button type="primary" plain icon="el-icon-refresh-left" @click="search('result')">重置</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-table :data="itemData" style="width: 100%" ref="table"
                height="180px" class="qz-table-hide" @select="handleSelectionChange">
        <el-table-column
            type="selection"
            width="55">
        </el-table-column>
        <el-table-column prop="deptName" label="实施部门名称" min-width="200" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="itemCode" label="事项编码" show-overflow-tooltip min-width="200"></el-table-column>
        <el-table-column prop="itemName" label="事项名称" min-width="160" show-overflow-tooltip></el-table-column>
        <el-table-column prop="version" label="事项版本" width="100" align="center" show-overflow-tooltip>
        </el-table-column>
      </el-table>
      <el-pagination
          class="pagination"
          @current-change="handleItemChange"
          :page-size="searchData.limit"
          layout="total, prev, pager, next, jumper"
          :total="searchData.total">
      </el-pagination>
      <span slot="footer" class="dialog-footer">
        <el-button @click="close">取消</el-button>
        <el-button type="primary" @click="confirm">确定</el-button>
      </span>
    </el-dialog>
    <el-dialog :visible="deptDialog"
               title="选择提交部门" width="40%"
               @close="closeDept" class="qz-dialog-padding">
      <choose-dept :infoData="objectionData" @pushDept="pushDept"></choose-dept>
<!--      <span slot="footer" class="dialog-footer">
        <el-button @click="closeDept">取消</el-button>
        <el-button type="primary" @click="confirmDept">确定</el-button>
      </span>-->
    </el-dialog>
  </div>
</template>
<script>
import qzBase from '@_src/pages/mssq/common/util/qzBase';
import PageHeader from '@_src/pages/mssq/common/components/page-header';
import uploadUtil from '@_src/utils/upload';
import circulationProcess from './circulationProcess';
import option from "../common/components/option";
import Item from "../statistical/item";
import ChooseDept from "./chooseDept";


export default {
  mixins: [qzBase],
  components: {
    ChooseDept,
    Item,
    PageHeader,
    circulationProcess
  },
  data() {
    return {
      activeName:'info',
      parentHeight:0,
      rules:{
        dissentTitle: [
          { required: true, message: '请输入异议标题', trigger: 'blur' },
        ],
        dissentContent: [
          { required: true, message: '请输入异议内容', trigger: 'blur' },
        ],
        itemName:[
          { required: true, message: '请选择事项', trigger: ['blur','change'] },
        ],
      },
      itemData:[],
      searchData:{
        itemName:'',
        itemCode:'',
        page:1,
        limit:10,
        total:0
      },
      objectionData:{
        dissentFile:[],
        itemName:'',
        itemCode:'',
        dissentContent:'',
        dissentTitle:'',
      },
      canEdit:false,
      reSubmit:false,
      itemDialog:false,
      deptDialog:false,
      uploadUrl:'',
      uploadHeaders: {},
      previewFileType: "jpg,png,gif",
      selectioned: {},
    }
  },
  computed: {
    isClick(){
      let res = this.canEdit? this.reSubmit : false;
      return  res
    },
  },
  watch: {
  },
  methods: {
    childHeight() {
      //获取父级高度传递给子级
      this.parentHeight = this.$refs.getHeight.offsetHeight;
    },
    changeTabs() {
      this.parentHeight = 0;
    },
    modelRemove(file, fileList) {

    },
    modelBeforeRemove(file, fileList) {
      if(this.objectionData.dissentFile.length == 0){
        this.objectionData.dissentFile = [];
        return;
      }
      for (let i = 0; i < this.objectionData.dissentFile.length; i++) {
        if (this.objectionData.dissentFile[i].rcId == file.rcId) {
          this.objectionData.dissentFile.splice(i, 1);
          return
        }
      }
    },
    modelSuccess(response, file, fileList) {
      if (response.state == 1) {
        this.$message({
          message: '上传成功',
          type: 'success'

        });
        var material = response.row;
        var fileObj = {
          name: material.fileName,
          rcId: material.rcId
        }
        this.objectionData.dissentFile.push(fileObj);
      } else {
        this.$message.error('上传失败, 请稍后重试');
        for (let i = 0; i < fileList.length; i++) {
          if (fileList[i].rcId == file.rcId) {
            fileList.splice(i, 1);
            return
          }
        }
      }
    },
    onExceed(files, fileList){
      if(fileList.length >= 3){
        this.$message.error('附件最多上传三个')
      }
    },
    modelError(err,file,fileList){
      this.$message.error('上传失败, 请稍后重试');
    },
    onPreview(file){
      var fileIndex = file.name.lastIndexOf(".");
      file.fileType = file.name.substring(fileIndex + 1, file.name.length);
      if(file.fileType === 'pdf'){
        const rLoading = this.openLoading();
        var url = this.Config.baseContext + "/mssq/mssqRc/disk/" + file.rcId;
        // var url = this.Config.rcPath + "/disk/" + file.rcId;
        this.$get_blob(url, {}, null, 'blob').then(ret => {
          rLoading.close();
          if (ret.state == 0) {
            this.$message.error(ret.message);
            return
          }
          let a = document.createElement('a');
          let url = window.URL.createObjectURL(ret);
          a.href = url;
          //设置文件名称
          let fileName = file.name;
          a.download = fileName;
          a.click();
          this.$message.success('下载成功');
        })
      }else {
        if (file.rcId == "" || file.rcId == null) {
          let rcId = file.response.row.rcId;
          let fileType = file.response.row.fileType;
          file.rcId = rcId;
          file.fileType = fileType;
        } else {
          var index = file.name.lastIndexOf(".");
          file.fileType = file.name.substring(index + 1, file.name.length);
        }
        window.open(this.Config.rcPath + "/disk/" + file.rcId + '');
      }
    },
    beforeUpload(file) {
      const isLt5M = file.size / 1024 / 1024 < 5;
      let type = true;
      if (!isLt5M) {
        this.$message.error("上传文件大小不能超过 5MB!");
      }
      var testmsg = file.name.substring(file.name.lastIndexOf('.') + 1);
      const extension1 = testmsg === 'jpg';
      const extension2 = testmsg === 'jpeg';
      const extension3 = testmsg === 'png';
      const extension4 = testmsg === 'pdf';
      // const isLt2M = file.size / 1024 / 1024 < 10
      if (!extension1 && !extension2 && !extension3 && !extension4) {
        this.$message({
          message: '上传文件只能是.jpg,.jpeg,.png,.pdf!',
          type: 'warning'
        });
        type = false
      }
      return isLt5M && type;
    },
    openItem(){
      this.itemDialog = true;
      this.getItemData();
    },
    search(type){
      if(type == 'result'){
        this.searchData.itemName = '';
        this.searchData.itemCode = '';
      }
      this.getItemData();
    },
    getItemData(){
      var url = this.Config.baseContext + "/mssq/mssqItemIndex/getItemList";
      this.$http_post(url, this.searchData).then(ret => {
        if (ret.state == 1) {
          this.itemData = ret.rows;
          this.$nextTick(()=>{
            for (let i = 0; i < this.itemData.length; i++) {
              if(this.itemData[i].itemCode == this.objectionData.itemCode){
                this.$refs.table.toggleRowSelection(this.itemData[i], true)
              }
            }
          })
          this.searchData.total = ret.records;
        } else {
          this.$message.error(ret.message);
        }
      });
    },
    openDept(){
      this.deptDialog = true;
    },
    handleSelectionChange(selection, row){
      this.$refs.table.clearSelection()
      if (selection.length === 0) { // 判断selection是否有值存在
        this.selectioned = {}
        return
      }
      if (row) {
        this.selectioned = row
        this.$refs.table.toggleRowSelection(row, true)
      }
    },
    handleItemChange(data){
      this.searchData.page = data;
      this.getItemData();
    },
    close(){
      this.itemDialog = false;
    },
    closeDept(){
      this.deptDialog = false;
      this.objectionData.disposalDeptName = '';
      this.objectionData.disposalDeptNo = '';
      this.objectionData.disposalDeptId = '';
    },
    pushDept(val){
      this.objectionData.disposalDeptId = val.id;
      this.objectionData.disposalDeptName = val.name;
      this.objectionData.disposalDeptNo = val.creditCode;
      const rLoading = this.openLoading();
      let url = this.Config.baseContext+'/mssq/mssqItemDissent/submitItemDissent';
      if(this.$route.query.type == 'reSubmit'){
        url = this.Config.baseContext+'/mssq/mssqItemDissent/resubmitItemDissent'
      }
      var cataLogInfo = JSON.parse(JSON.stringify(this.objectionData));
      for (let i = 0; i < cataLogInfo.dissentFile.length; i++) {
        cataLogInfo.dissentFile[i] = {
          name: cataLogInfo.dissentFile[i].name,
          rcId: cataLogInfo.dissentFile[i].rcId
        }
      }
      cataLogInfo.manageRole = 'ZSJSH';
      cataLogInfo.regionCode = this.$store.getters.curUser.attrMap.REGION_CODE;
      cataLogInfo.dissentType = '1';
      cataLogInfo.dissentFile = JSON.stringify(cataLogInfo.dissentFile);
      this.$http_post(url, cataLogInfo,true).then(ret => {
        rLoading.close();
        if(ret.state === 1){
          this.$message.success("异议申请提交成功")
          this.$router.go(-1)
        }else{
          this.$message.error(ret.message);
        }
      });
      this.closeDept();
    },
    confirm(){
      if(JSON.stringify(this.selectioned) == '{}'){
        this.$message.warning('请选择一条数据')
        return
      }
      this.objectionData.dissentDeptId = this.selectioned.deptId;
      this.objectionData.dissentDeptName = this.selectioned.deptName;
      this.objectionData.dissentDeptNo = this.selectioned.deptNo;
      this.objectionData.itemName = this.selectioned.itemName;
      this.objectionData.itemCode = this.selectioned.itemCode;
      this.objectionData.itemVid = this.selectioned.itemVid;
      this.itemDialog = false;
    },
    submit(){
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.$confirm('是否确认提交当前异议信息?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.openDept()
           /* option.show({
              head: '办理意见',
              msg: '提交报审',
              onOkClick: function (res) {
                if (res == "") {
                  _this.$message.error("请填写办理意见!")
                  return;
                }

              }
            })*/
          }).catch((e) => {
            console.log(e);
          });
        }
      })
    },
    reSubmitInfo(){
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.$confirm('是否确认重新提交当前异议信息?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.openDept();
          }).catch((e) => {
            console.log(e);
          });
        }
      })
    },
    agree(){
      let that = this;
      option.show({
        head: '办理意见',
        'requiredMsg': true,
        msg: '同意',
        onOkClick: function(res){
          if(res==""){
            that.$message.error("请填写办理意见!")
            return;
          }
          let url = that.Config.baseContext+'/mssq/mssqItemDissent/dissentAuditToYes';
          var id = that.$route.query.id;
          that.$http_post(url,{"dissentId":id,"remark":res}).then(ret => {
            if(ret.state === 1){
              that.$message.success(ret.message)
              that.$router.go(-1)
            }else{
              that.$message.error(ret.message);
            }
          });
        }
      })
    },
    disAgree(){
      let that = this;
      option.show({
        head: '办理意见',
        'requiredMsg': true,
        onOkClick: function(res){
          if(res==""){
            that.$message.error("请填写办理意见!")
            return;
          }
          let url = that.Config.baseContext+'/mssq/mssqItemDissent/dissentAuditToNo';
          var id = that.$route.query.id;
          that.$http_post(url, {"dissentId":id,"remark":res}).then(ret => {
            if(ret.state === 1){
              that.$message.success(ret.message)
              that.$router.go(-1)
            }else{
              that.$message.error(ret.message);
            }
          });
        }
      })
    },
  },
  mounted() {
    this.uploadUrl = this.Config.rcPath + "/upload";
    let headers = uploadUtil.setHeaders();
    headers['x-aep-token'] = this.$store.getters.token;
    this.uploadHeaders = headers;
    if(this.$route.query.type !== 'add'){
      let objectionData = JSON.parse(JSON.stringify(localStorage.getItem('objectionData')))
      this.objectionData = JSON.parse(objectionData)
      // this.objectionData = JSON.parse(JSON.stringify(this.$store.getters.objectionData))
      if(this.objectionData.dissentFile) this.objectionData.dissentFile = JSON.parse(this.objectionData.dissentFile)
    }
    if(this.$route.query.type == 'view' || this.$route.query.type == 'todo'){
      this.canEdit = false;
    }else{
      this.canEdit = true;
    }
    if(this.$route.query.type == 'reSubmit'){
      this.reSubmit = true;
    }
  }
}
</script>
<style lang="less" scoped>
.cardView {
  padding: 10px 20px 10px 20px;
  &>.objection{
    background:#fff;
    min-height: 100%;
    padding:0 14px;
  }
  .view {
    height: calc(100vh - 270px);
    overflow: auto;

    /deep/ .el-tabs {
      height: 100%;

      .el-tabs__content {
        height: calc(100% - 60px);
        overflow: auto;

        .el-tab-pane {
          height: 100%;
        }
      }
    }
  }

  .el-form {
    .linkButton {
      float: right;
      font-size: 14px;
    }
  }

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

.page-header.divider {
  border: none;
}

.page-header {
  margin-bottom: 10px;
}

.icon-tishi {
  color: #999;
  position: relative;
  top: 3px;
}

.qz-dialog-padding {
  /deep/ .el-dialog__body {
    .laws {
      padding: 0;

      /deep/ .el-table {
        .el-table__body-wrapper {
          max-height: calc(100vh - 400px) !important;
        }
      }
    }
  }
}

.select {

  /deep/ .el-form-item__content {
    .backColor {
      background: #f5f5f5;

    }

    .catalog {
      display: flex;
      border-radius: 4px;
      color: #606266;
      border: 1px solid #dcdfe6;

      .code {
        position: relative;
        left: 16px;
        white-space: nowrap;
        z-index: 100;
        padding-left: 16px;
        margin-left: -16px;
      }

      .catalogCodeDisabled {
        background-color: #f5f5f5;
        color: #606266;
      }

      .el-input {
        .el-input__inner {
          border: none;
        }
      }
    }

    .el-radio-group {
      margin: 0;
    }

    .selectChange {
      .el-input {
        .el-input__inner {
          background: #f5f5f5;
          color: #606266;
        }
      }
    }
  }

}

.inputDisabled {
  /*display:none;*/
  :deep(.el-input) {
    .el-input__inner {
      background: #f5f5f5;
      color: #606266;
    }
  }
  &.el-input{
    :deep(.el-input__inner) {
      background: #f5f5f5;
      color: #606266;
    }
  }
  &.el-textarea{
    :deep(.el-textarea__inner) {
      background: #f5f5f5;
      color: #606266;
    }
  }

}
.cellAll{
  width: 100%;
  overflow: auto;
  max-height: 300px;
}
.focusCell{
  width: 100%;
  padding: 10px 5px;
  cursor: pointer;
  &:hover{
    background: #ecf4fe;
  }
  &.active{
    background: #ecf4fe;
  }
}

.select-content{
  display: flex;
  justify-content: space-between;
  .addr{
    width: 70%;
    white-space: nowrap;
    text-overflow:ellipsis;
    overflow:hidden;
  }
}
.el-autocomplete{
  width: 100%;
  .el-input{
    width: 100%;
  }
}
.el-select{
  width: 100%;
  .el-input{
    width: 100%;
  }
}
.objectionDataTable{
  display: flex;
  flex-direction: column;
  min-height: 400px;
  margin-top: 10px;
  padding: 6px 14px 14px 14px;
  background:#fff;
  .block{
    text-align: end;
    background: #fff;
    padding: 10px 0 0 0;
  }
}
.jump-title {
  min-height: 10px;
  min-width: 50px;
  display: inline-block;
  max-width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: var(--primary, #409eff);
  cursor: pointer;
  vertical-align: middle;
}
.info{
  display: flex;
  align-items: center;
  font-size: 16px;
  .imgClass{
    height: 20px;
    width: 20px;
  }
  span{
    padding-left: 8px;
  }
}
.pagination{
  text-align: end;
}

:deep(.el-table__header-wrapper)  .el-checkbox {
  display: none;
}
.form-btn{
  text-align: end;
}
</style>
