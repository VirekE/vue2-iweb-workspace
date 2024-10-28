<template>
  <!-- 材料管理 -->
  <div class="material" ref="tableH">
    <div class="box">
      <div class="tab-box">
        <page-header subTitle="推送日志"></page-header>
        <el-table :data="catalogList" height="100%" style="width: 100%;"  class="qz-table-hide">
          <el-table-column type="index" label="序号" width="50"></el-table-column>
          <el-table-column label="目录id" prop="catalogId" show-overflow-tooltip></el-table-column>
          <el-table-column label="推送职责部门名称" prop="deptName" show-overflow-tooltip></el-table-column>
          <el-table-column label="推送时间" prop="syncLogTime" algin="center" :formatter="formatterDateTime"></el-table-column>
          <el-table-column label="推送日志" prop="logTxt"  algin="center"></el-table-column>
          <el-table-column label="操作" width="100">
            <template slot-scope="scope">
              <!--都有查看-->
              <el-button type="text" @click="distri(scope.row)">查看</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="block">
          <el-pagination @current-change="handleCurrentChange" :current-page.sync="catalogParams.page"
                         :page-size="catalogParams.limit" layout="total,prev, pager, next, jumper"
                         :total="catalogParams.records">
          </el-pagination>
        </div>
      </div>
    </div>
    <el-dialog title="查看日志详情" width="50%" :close-on-click-modal=false class="qz-dialog-padding qz-law"
               :visible.sync="chooseDeptDialog">
      <el-form :model="formData" label-width="80px" ref="indexForm">
        <el-form-item label="目录id">
          <el-input v-model="formData.catalogId" readonly></el-input>
        </el-form-item>
        <el-form-item label="推送日志">
          <el-input v-model="formData.logTxt" readonly></el-input>
        </el-form-item>
        <el-form-item label="推送时间">
          <el-date-picker
              format="yyyy-MM-dd HH:mm:ss"
              v-model="formData.time"
              disabled
              type="datetime"
              placeholder="选择日期时间"
              align="right">
          </el-date-picker>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
				<el-button @click="chooseDeptDialog= false">取 消</el-button>
			</span>
    </el-dialog>
  </div>
</template>

<script>
import PageHeader from '@_src/pages/mssq/common/components/page-header';

import qzBase from '@_src/pages/mssq/common/util/qzBase';

export default {
  name: "register",
  mixins: [qzBase],
  components: {
    PageHeader
  },
  data() {
    return {
      chooseDeptDialog:false,
      dutyChangeDialog:false,
      formData:{},
      fieldData: {
        primaryIndexName: {
          label: '一级索引',
          type: 'Input',
          placeholder: '请输入一级索引名称',
          value: '',
          span: 6,
        },
        parentName: {
          label: '二级索引',
          type: 'Input',
          placeholder: '请输入二级索引名称',
          value: '',
          span: 6
        },
        catalogCode: {
          label: '三级索引码',
          type: 'Input',
          placeholder: '请输入三级索引码',
          value: '',
          span: 6
        },
        catalogName: {
          label: '三级分类',
          type: 'Input',
          placeholder: '请输入三级分类（事件描述）',
          value: '',
          span: 6,
        },
        manageType: {
          label: '管理类型',
          type: 'Select', //类型
          placeholder: '请选择管理类型',
          value: '',
          span: 6, //布局比例
          selectList: []
        },
        Button: {
          type: 'Button',
          span: 18
        }
      },
      busiType: {},
      checkList: [],
      cancelFbList: [],
      distributionDialog: false,
      cancleList: {},
      fbShow: false,
      searchFiled: {
        primaryIndexName: '', //目录名称
        parentName: '', //目录编码
        catalogName: '', //类型
        catalogCode: '', //层级
        manageType: '' //层级
      },
      catalogLimit:10000,
      uploadUrl: '',
      uploadHeaders: {},
      fileList: [],
      disabledNum: 0,
      tableHeight: 100,
      catalogList: [],
      deptList: [],
      dictList:[],
      statusList: [{
        label: '全部',
        value: ''
      }, {
        label: '发布',
        value: '3'
      }, {
        label: '草稿',
        value: 'DRAF'
      }, {
        label: '待审核',
        value: 'APPROVAL_WAIT'
      }, {
        label: '废置',
        value: 'DISCARD'
      }], //调接口时删除
      catalogParams: {
        page: 1,
        limit: 10,
        total: 0
      },
      manageTypeList:[],
      title: '',
      chooseDeptData: {
        isStreet:'',
        manageTypeExt: '',
      },
      organTreeArr: [],
      dialogVisible: false,
      isShow: false,
      activeIndex: '1',
      changeRecord:{},
    }
  },
  watch: {
    manageTypeData: {
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
    },
  },
  mounted() {
    this.onQuery();

    this.queryDict("PUSH_TYPE", res => {
      this.dictList = res;
    });
    //表格高度自适应
    this.$nextTick(() => {
      this.tableHeight = this.$refs.tableH.offsetHeight - 210;
    });
    window.onresize = () => {
      return (() => {
        this.tableHeight = this.$refs.tableH.offsetHeight - 210;
      })();
    };
  },
  computed: {
    isSzsType(){
      if(this.$store.getters.curUser.roleValue.indexOf('MSA02RS06') === -1){
        return false;
      }
      return true;
    },
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
  },
  methods: {
    changeType(val){
      let arr = this.dictList['PUSH_TYPE'];
      if(!arr || arr.length <= 0){return }
      for (let i = 0; i < arr.length; i++) {
        if(arr[i].itemCode === val){
          return arr[i].itemValue
        }
      }
      return '无'
    },
    manageFormat(row) {
      let manageType = row.manageType;
      if (this.isNotNull(this.manageTypeList)) {
        for (let i = 0; i < this.manageTypeList.length; i++) {
          if (this.manageTypeList[i].itemCode == manageType) {
            return this.manageTypeList[i].itemValue
          }
        }
      }
      return '-'
    },
    formatterBusiType(row) {
      var type = row.busiType;
      if (JSON.stringify(this.busiType) !== '{}') {
        for (var i = 0; i < this.busiType['BUSI_TYPE'].length; i++) {
          if (this.busiType['BUSI_TYPE'][i].itemCode == type) {
            return this.busiType['BUSI_TYPE'][i].itemValue
          }
        }
      }
      return '-';
    },
    onQuery() {
      var url = this.Config.baseContext + "/mssq/mssqSyncCatalog/getLogById";
      this.$http_post(url, {
        id:this.$route.query.id,
      }).then(ret => {
        if (ret.state == 1) {
          this.catalogList = ret.rows;
          this.getInfo();
          this.catalogParams.records = ret.records;
        } else {
          this.$message.error(ret.message);
        }
      });
    },
    getInfo(){
      var url = this.Config.baseContext + "/mssq/mssqSyncCatalog/getById";
      this.$http_post(url, {
        id:this.$route.query.id
      }).then(ret => {
        if (ret.state == 1) {
          let data = {};
          if(ret.row.syncParams){
            data = JSON.parse(ret.row.syncParams)
          }
          let str = '';
          for (let i = 0; i < data.mssqFbDTO.fbDeptList.length; i++) {
            if(str === ''){
              str = data.mssqFbDTO.fbDeptList[i].fbDeptName
            }else{
              str += ',' + data.mssqFbDTO.fbDeptList[i].fbDeptName
            }
          }
          for (let i = 0; i < this.catalogList.length; i++) {
            this.$set(this.catalogList[i],'deptName',str)
          }
        } else {
          this.$message.error(ret.message);
        }
      });
    },
    formatterState(row) {
      if ((!this.isEmptyObject(this.busiType)) && this.busiType.ITEM_STATUS.length > 0) {
        for (let i = 0; i < this.busiType.ITEM_STATUS.length; i++) {
          if (this.busiType.ITEM_STATUS[i].itemCode == row.status) {
            return this.busiType.ITEM_STATUS[i].itemValue
          }
        }
      }
    },
    /* search(type) {
       if (type == 'cz') {
         this.searchFiled.manageType = '';
         this.searchFiled.status = '';
         this.searchFiled.primaryIndexName = '';
         this.searchFiled.parentName = '';
         this.searchFiled.catalogName = '';
         this.searchFiled.catalogCode = '';
       }
       this.onQuery();
     },*/
    searchClick(val) {
      this.searchFiled = {
        manageType: val.manageType.value,
        primaryIndexName: val.primaryIndexName.value,
        parentName: val.parentName.value,
        catalogName: val.catalogName.value,
        catalogCode: val.catalogCode.value,
      }
      this.onQuery();
    },
    handleCurrentChange(val) {
      this.catalogParams.page = val;
      this.onQuery();
    },
    distri(row) {
      this.chooseDeptDialog = true;
      this.formData = row;
      this.formData.time = this.formatDate(row.syncLogTime,'yyyy-MM-dd HH:mm:ss')
    },
    // formatterDateTime(row) {
    //   let dateee = new Date(row.lastUpdateTime).toJSON()
    //   return row.lastUpdateTime = new Date(+new Date(dateee) + 8 * 3600 * 1000).toISOString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '')
    // },
    pushLogs(row){
      this.$router.push({
        path:'index',
        query:{
          id:row.id
        }
      })
    },
    rePush(data){
      this.$confirm('是否重新推送当前数据?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        var delPro = this.Config.baseContext + "/mssq/mssqSyncCatalog/repush";
        this.$http_post(delPro, {
          id:data.id
        }).then(ret => {
          if(ret.state == 1){
            this.$message.success('推送成功')
            this.onQuery();
            // this.getSave();
            // return
          }else{
            this.$message.error(ret.message);
            return;
          }
        });
      })
    },
    remove(item) {
      let arr = [];
      if (!this.fbShow) {
        arr.push({
          fbDeptId: item.fbDeptId,
          fbDeptName: item.fbDeptName,
          fbDeptNo: item.fbDeptNo,
          regionCode: item.regionCode,
          regionName: item.regionName,
        })
      } else {
        if (this.checkList.length <= 0) {
          this.$message.error('请选择部门');
          return
        }
        for (let i = 0; i < this.checkList.length; i++) {
          arr.push({
            fbDeptId: this.checkList[i].fbDeptId,
            fbDeptName: this.checkList[i].fbDeptName,
            fbDeptNo: this.checkList[i].fbDeptNo,
            regionCode: this.checkList[i].regionCode,
            regionName: this.checkList[i].regionName,
          });
        }
      }
      let params = {
        catalogCode: this.cancleList.catalogCode,
        catalogId: this.cancleList.catalogId,
        catalogVid: this.cancleList.id,
        manageTypeExt: this.cancleList.manageTypeExt,
        fbDeptList: arr,
      };
      this.$confirm('是否取消分拨当前部门，取消分拨后当前部门事项将会变更废置状态?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const rLoading = this.openLoading('取消分拨中，请稍等');
        var url = this.Config.baseContext + "/mssq/mssqCatalog/deleteFbDeptByCatalogCode";
        this.$http_post(url, params, true).then(ret => {
          rLoading.close();
          if (ret.state == 1) {
            this.getDeptList();
            this.checkList = [];
            this.$message.success('分拨取消成功')
          } else {
            this.$message.error(ret.message);
          }
        });
      })
    },
    confirm(params) {
      const rLoading = this.openLoading('分拨中，请稍等');
      let url = this.Config.baseContext + '/mssq/mssqCatalog/saveFbDeptByCatalogCode';
      this.$http_post(url, params, true).then(ret => {
        rLoading.close();
        if (ret.state == 1) {
          this.$message.success('分拨成功');
          this.closeDialog();
          this.$refs.searchDept.organTreeArr = [];
          this.onQuery();
        } else {
          this.$message.error(ret.message);
        }
      });
    },
    closeDialog(){
      this.chooseDeptDialog = false;
    },
    jumpCatalog(row) {
      this.$store.dispatch("setSearchParams", {path:this.$route.path,data:Object.assign(this.searchFiled,{page:this.catalogParams.page,limit:this.catalogParams.limit})});
      this.$router.push({
        path: '/catalog/minor_edit',
        query: {
          id: row.id,
          catalogId: row.catalogId,
          type: 'view',
          pageType: 'distribution',
        }
      });
    },
    viewMinor(row) {
      this.distributionDialog = true;
      this.cancleList = row;
      this.getDeptList();
    },
    changeHistory(row){
      this.changeRecord = row;
      this.dutyChangeDialog = true;
    },
    getDeptList() {
      let url = this.Config.baseContext + '/mssq/mssqCatalog/getFbDeptList';
      this.$http_post(url, {
        limit: 10000,
        page: 1,
        catalogId: this.cancleList.catalogId
      }).then(ret => {
        if (ret.state == 1) {
          this.deptList = ret.rows;
        } else {
          this.$message.error(ret.message);
        }
      });
    },
    createItem(info) {
      this.$router.push({
        path: '/item/info',
        query: {
          catalogId: info.id,
          type: "edit",
        }
      });
    },
    modelRemove(file, fileList) {},
    modelBeforeRemove(file, fileList) {
      for (let i = 0; i < this.fileList.length; i++) {
        if (this.fileList[i].rcId == file.rcId) {
          this.fileList.splice(i, 1);
          return
        }
      }
    },
    modelSuccess(response, file, fileList) {
      this.rLoading.close();
      if (response.state == 1) {
        this.$notify({
          title: '事项分拨导入详情',
          dangerouslyUseHTMLString: true,
          duration: 0,
          customClass: 'importCatalog',
          message: `<p class="successNum">当前导入成功<span class="num">${response.row.successNum}</span>条,</p>
                    <p class="errorNum">导入失败<span class="num">${response.row.errorNum}</span>条,</p>
                     <p class="notifyLink"><span onClick="getError('${response.row.erorrLogId}')">点击获取导入失败的事项分拨清单</span></p>`
        });
        this.onQuery();
      } else {
        this.$message.error(response.message);
      }
    },
    modelError(err, file, fileList) {
      this.$message.error(error.message);
    },
    onPreview(file) {

    },
    beforeUpload(file) {
      if (file.name.indexOf('.') != -1) {
        const Xls = file.name.split(".");
        if (Xls[Xls.length - 1] === "xls" || Xls[Xls.length - 1] === "xlsx" || Xls[Xls.length - 1] === "csv") {
          return file;
        } else {
          this.$message.error("请上传excel格式的文件!");
          return false;
        }
      }
      this.$message.error("请上传excel格式的文件!");
    },
    onProgress(file) {
      this.rLoading = this.openLoading('分拨导入中，请稍等');
    },
    getError(erorrLogId) {
      const rLoading = this.openLoading();
      var url = this.Config.baseContext + '/mssq/mssqCatalog/catalogExcel/' + erorrLogId;
      this.$http_post(url, {}, null, 'blob').then(ret => {
        rLoading.close();
        if (ret.state == 0) {
          this.$message.error(ret.message);
          return
        }
        let a = document.createElement('a');
        let url = window.URL.createObjectURL(ret);
        a.href = url;
        //设置文件名称
        var t = this.formatDate(new Date().getTime(), 'yyyyMMddHHmmss');
        let fileName = '事项分拨导入失败数据' + t + '.xlsx';
        a.download = fileName;
        a.click();
        this.$message.success('导出成功');
      });
    },
    exportChange(){
      let _this = this;
      const rLoading = this.openLoading();
      // this.exportIndex.push(index);
      this.loading = true;
      var url = this.Config.baseContext + "/mssq/mssqFbRealLog/exportFbList";
      let params = JSON.parse(JSON.stringify(this.searchFiled));
      params.page = 1;
      params.limit = this.catalogLimit;
      this.$http_post(url, params, null, 'blob').then(ret => {
        rLoading.close();
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
  },
  destroyed() {
    window.onresize = null;
  },
}
</script>

<style scoped lang="less">
.material {
  position: relative;
  height: 100%;

  &>div.box {
    height: 100%;
    background: #f8f8f8;
    display: flex;
    flex-direction: column;

    .search-box {
      background: #fff;
      margin-bottom: 10px;
      width: 100%;
      padding: 10px 14px 0 14px;
    }
  }

  .el-menu-demo {
    margin-bottom: 15px;
    margin-top: -15px;

    .el-menu-item {
      margin-right: 20px;
      height: 52px;
      line-height: 52px;
      padding: 0 28px;
    }
  }

  .block {
    text-align: right;
    background: #fff;
  }
}

.programme-btn {
  text-align: center;

  /deep/ .el-popover__reference-wrapper {
    padding: 0 10px;
  }
}

.top-list {
  margin-top: 10px;
  padding: 10px;
  overflow-y: auto;
  max-height: 200px;
  text-align: start;
  border: 1px #ccc dashed;

  .top-list-item {
    display: inline-block;
    line-height: 30px;
    margin: 5px 0 0 5px;
    padding: 0 10px;
    border-radius: 1px;
  }

  .choose {
    background: #F3F6FC;
  }

  .noChoose {
    width: 24%;
    margin: 5px 3px;
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

.upload {
  padding-left: 10px;

  /deep/ .el-upload-list.el-upload-list--text {
    display: none;
  }
}

.tab-box{
  flex:1;
  display: flex;
  flex-direction: column;
  height: calc(100% - 200px);
  background:#fff;
  padding:0px 14px;
  .block{
    padding:10px 0;
  }
}
.dutyChange{
  :deep(.el-dialog){
    .el-dialog__body{
      overflow: auto;
      height: 400px;
    }
  }
}
.more-buttons{
  padding-left: 10px;
}
</style>
