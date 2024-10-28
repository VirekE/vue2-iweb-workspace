<template>
  <!-- 材料管理 -->
  <div class="material" ref="tableH">
    <div class="box">
      <div class="search-box">
        <Search :fieldData="fieldData" ref="srarch" @searchClick="searchClick"></Search>
      </div>
      <div class="tab-box">
        <el-table :data="catalogList" height="100%" style="width: 100%;" class="qz-table-hide">
          <el-table-column type="index" label="序号" width="50"></el-table-column>
          <el-table-column label="一级索引名称" prop="primaryIndexName" show-overflow-tooltip></el-table-column>
          <el-table-column label="二级索引名称" prop="parentName" show-overflow-tooltip></el-table-column>
          <el-table-column label="三级索引码" prop="catalogCode" width="160"></el-table-column>
          <el-table-column label="三级分类（事件描述）" prop="catalogName" show-overflow-tooltip>
            <template slot-scope="scope">
              <div class="jump-title" @click="jumpCatalog(scope.row)">{{ scope.row.catalogName }}</div>
            </template>
          </el-table-column>
          <el-table-column label="是否配置" prop="extId" align="center" width="100" show-overflow-tooltip>
            <template slot-scope="scope">
              <el-tag type="success" v-if="scope.row.extId">是</el-tag>
              <el-tag type="danger" v-else>否</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="管理类型" align="center" prop="manageTypeExt" width="100" :formatter="manageFormat"
                           show-overflow-tooltip>
            <template slot-scope="scope">
              <el-tag type="success" v-if="scope.row.manageTypeExt">{{ manageFormat(scope.row) }}</el-tag>
              <span v-else></span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="100">
            <template slot-scope="scope">
              <el-button type="text" @click="viewMinor(scope.row)">配置详情</el-button>
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
    <el-dialog title="统筹配置" width="50%" :close-on-click-modal=false class="qz-dialog-padding qz-law"
               :visible.sync="distributionDialog" v-if="distributionDialog">
      <div class="tooltip">
        <div>温馨提示：统筹要素保存时，将自动同步已分拨该目录的事项，请知悉。</div>
        <div>管理类型<span class="imp">A类变更为C类</span>，需先<span class="imp">取消分拨原A类</span>目录后方可变更。</div>
        <div>管理类型<span class="imp">B类变更为A类</span>，需先<span class="imp">取消原B类下发的区级</span>目录后方可变更。</div>
        <div>管理类型<span class="imp">C类变更为A类</span>，需先<span class="imp">取消下发原C类</span>目录后方可变更。</div>
      </div>
      <el-form :model="chooseDeptData" :rules="rules" ref="chooseDept" :disabled="!isEdit">
        <el-row>
          <el-col :span="12">
            <el-form-item label="管理类型" prop="manageTypeExt">
              <el-select v-model="chooseDeptData.manageTypeExt">
                <el-option v-for="item in manageTypeData" :key="item.itemCode" :disabled="item.disabled"
                           :label="item.itemValue" :value="item.itemCode"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
				<el-button @click="distributionDialog= false">取 消</el-button>
				<el-button type="primary" @click="confirm">确 定</el-button>
			</span>
    </el-dialog>
  </div>
</template>

<script>
import qzBase from '@_src/pages/mssq/common/util/qzBase';
import OrganTree from '@_src/pages/mssq/common/components/organ/organ-tree'
import uploadUtil from '@_src/utils/upload';
import SearchDept from "../components/searchDept";

export default {
  name: "overAll",
  mixins: [qzBase],
  components: {
    SearchDept,
    OrganTree
  },
  data() {
    return {
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
        isConfig: {
          label: '是否配置',
          type: 'Select', //类型
          placeholder: '请选择管理类型',
          value: '',
          span: 6, //布局比例
          selectList: [{
            id: '0',
            name: '否'
          },{
            id: '1',
            name: '是'
          }]
        },
        manageTypeExt: {
          label: '管理类型',
          type: 'Select', //类型
          placeholder: '请选择管理类型',
          value: '',
          span: 6, //布局比例
          selectList: []
        },
        Button: {
          type: 'Button',
          span: 12
        }
      },
      rules: {
        manageTypeExt: [{
          required: true,
          message: '请选择管理类型',
          trigger: 'change'
        }],
        isStreet: [{
          required: true,
          message: '请选择事项是否下沉街道',
          trigger: 'change'
        }],
      },
      defulatData:{},
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

      uploadUrl: '',
      uploadHeaders: {},
      fileList: [],
      disabledNum: 0,
      tableHeight: 100,
      catalogList: [],
      deptList: [],
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
      manageTypeList: [],
      title: '',
      chooseDeptData: {
        isStreet: '',
        manageTypeExt: '',
      },
      organTreeArr: [],
      dialogVisible: false,
      dialogLoading: false,
      isShow: false,
      activeIndex: '1',
      isEdit:true,
    }
  },
  watch: {
    manageTypeData: {
      handler() {
        if (this.manageTypeList) {
          let res = [];
          this.manageTypeList.forEach((item) => {
            res.push({
              id: item.itemCode,
              name: item.itemValue
            })
          });
          this.fieldData.manageTypeExt.selectList = res
        }
      }
    },
  },
  mounted() {
    if (this.$route.path != this.$store.getters.searchParams.path) this.$store.dispatch("setSearchParams", {});
    if (!this.isEmptyObject(this.$store.getters.searchParams.data)) {
      this.$nextTick(() => {
        this.$refs.srarch.update('manageTypeExt', this.$store.getters.searchParams.data.isConfig, false);
        this.$refs.srarch.update('isConfig', this.$store.getters.searchParams.data.isConfig, false);
        this.$refs.srarch.update('primaryIndexName', this.$store.getters.searchParams.data.primaryIndexName, false);
        this.$refs.srarch.update('parentName', this.$store.getters.searchParams.data.parentName, false);
        this.$refs.srarch.update('catalogName', this.$store.getters.searchParams.data.catalogName, false);
        this.$refs.srarch.update('catalogCode', this.$store.getters.searchParams.data.catalogCode, false);
        this.catalogParams = this.$store.getters.searchParams.data;
        this.searchFiled = this.$store.getters.searchParams.data;
        this.onQuery();
        this.$store.dispatch("setSearchParams", {});
      })
    } else {
      this.onQuery();
    }
    this.queryDict("BUSI_TYPE,SSCJ,ITEM_STATUS,MANAGE_TYPE", res => {
      this.busiType = res;
      this.manageTypeList = JSON.parse(JSON.stringify(res.MANAGE_TYPE))
    });
    this.uploadUrl = this.Config.base_url + this.Config.baseContext + '/mssq/mssqCatalog/fbCatalogImport';
    let headers = uploadUtil.setHeaders();
    headers['x-aep-token'] = this.$store.getters.token;
    this.uploadHeaders = headers;
    //表格高度自适应
    this.$nextTick(() => {
      this.tableHeight = this.$refs.tableH.offsetHeight - 210;
    });
    window.onresize = () => {
      return (() => {
        this.tableHeight = this.$refs.tableH.offsetHeight - 210;
      })();
    };
    this.$nextTick(()=>{

    })
  },
  computed: {
    manageTypeData() {
      if(this.$store.getters.curUser.attrMap.REGION_CODE != '440301' && (this.chooseDeptData.manageTypeExt == '' || this.chooseDeptData.manageTypeExt == 'C')){
        for (let i = 0; i < this.manageTypeList.length; i++) {
          if(this.manageTypeList[i].itemCode == 'C'){
            return [this.manageTypeList[i]]
          }
        }
      }
      return this.manageTypeList
    },
  },
  methods: {
    manageFormat(row) {
      let manageType = row.manageTypeExt;
      if (this.isNotNull(this.manageTypeList)) {
        for (let i = 0; i < this.manageTypeList.length; i++) {
          if (this.manageTypeList[i].itemCode == manageType) {
            return this.manageTypeList[i].itemValue
          }
        }
      }
      return ''
    },
    onQuery() {
      var url = this.Config.baseContext + "/mssq/mssqCatalog/getFbCatalogList";
      // this.searchFiled.type = '0';
      this.searchFiled.page = this.catalogParams.page;
      this.searchFiled.limit = this.catalogParams.limit;
      this.$http_post(url, this.searchFiled).then(ret => {
        if (ret.state == 1) {
          this.catalogList = ret.rows;
          this.catalogParams.records = ret.records;
        } else {
          this.$message.error(ret.message);
        }
      });
    },
    searchClick(val) {
      this.searchFiled = {
        isConfig: val.isConfig.value,
        manageTypeExt: val.manageTypeExt.value,
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
    getBTypeInfo(row) {
      let url = this.Config.baseContext + '/mssq/mssqCatalogExtConfig/selectExtConfig';
      this.$http_post(url, {
        catalogId: row.catalogId
      }).then(ret => {
        if (ret.state == 1) {
          this.chooseDeptData.catalogId = row.catalogId;
          this.defulatData = JSON.parse(JSON.stringify(ret.row));
          if(!this.isEmptyObject(ret.row)){
            this.chooseDeptData.id = ret.row.id;
            this.chooseDeptData.manageTypeExt = ret.row.manageTypeExt;
            this.chooseDeptData.isStreet = ret.row.isStreet;
          }else{
            this.chooseDeptData.id = '';
            this.chooseDeptData.manageTypeExt = '';
            this.chooseDeptData.isStreet = '';
          }
          if(this.$store.getters.curUser.attrMap.REGION_CODE != '440301' && (ret.row&&ret.row.manageTypeExt == 'B')){
            this.isEdit = false
          }else{
            this.isEdit = true
          }
          this.$nextTick(()=>{
            if(this.$refs.chooseDept){
              this.$refs.chooseDept.clearValidate();
            }
          });
        } else {
          this.$message.error(ret.message);
        }
      });
    },
    confirm() {
      let _this = this;
      let url,message ='';
      if(this.chooseDeptData.id){
        if((this.defulatData && this.defulatData.manageTypeExt == 'A') && this.chooseDeptData.manageTypeExt == 'C'){
          url = '/mssq/mssqCatalogExtConfig/verifyAIsfb';
          message = '请先取消分拨原A类目录';

        }else if((this.defulatData && this.defulatData.manageTypeExt == 'B') && this.chooseDeptData.manageTypeExt == 'A'){
          url = '/mssq/mssqCatalogExtConfig/verifyBIsxf';
          message = '请先取消原B类下发的区级目录';
        }else if((this.defulatData && this.defulatData.manageTypeExt == 'C') && this.chooseDeptData.manageTypeExt == 'A'){
          url = '/mssq/mssqCatalogExtConfig/verifyCIsxf';
          message = '请先取消下发原C类目录';
        }else{
          this.$confirm('保存配置将同步变更已关联事项要素，请知悉', '温馨提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.dialogLoading = true;
            getResult()
          })
        }
        _this.$http_post(_this.Config.baseContext + url, {catalogId:_this.chooseDeptData.catalogId}).then(ret => {
          if (ret) {
            _this.$refs.chooseDept.validate((valid) => {
              if (valid) {
                _this.$confirm('保存配置将同步变更已关联事项要素，请知悉', '温馨提示', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning'
                }).then(() => {
                  this.dialogLoading = true;
                  getResult()
                })
              }
            })
          } else {
            _this.$message.warning(message);
          }
        });
      }else{
        _this.$refs.chooseDept.validate((valid) => {
          if (valid) {
            this.$confirm('保存配置将同步变更已关联事项要素，请知悉', '温馨提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.dialogLoading = true;
              getResult()
            })
          }
        })
      }
        function getResult(){
          const rLoading = _this.openLoading('统筹配置中，请稍等');
          let url = _this.Config.baseContext + '/mssq/mssqCatalogExtConfig/saveExtConfig';
          _this.$http_post(url, _this.chooseDeptData, true).then(ret => {
            rLoading.close();
            if (ret.state == 1) {
              _this.$message.success('配置成功');
              _this.distributionDialog = false;
              _this.dialogLoading = false;
              _this.onQuery();
            } else {
              _this.$message.error(ret.message);
            }
          });
        }
    },
    jumpCatalog(row) {
      this.$store.dispatch("setSearchParams", Object.assign(this.searchFiled, {
        page: this.catalogParams.page,
        limit: this.catalogParams.limit
      }));
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
      this.getBTypeInfo(row);
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

  & > div.box {
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

.tab-box {
  flex: 1;
  display: flex;
  flex-direction: column;
  height: calc(100% - 200px);
  background: #fff;
  padding: 0px 14px;

  .block {
    padding: 10px 0;
  }
}

.tooltip{
  //color: #b5b5b5;
  font-size: 12px;
  padding-bottom: 10px;
  .imp{
    color: #E6A23C;
    font-weight: 700;
  }
}
.qz-law{
  :deep(.el-dialog){
    .el-dialog__body{
      padding: 20px;
    }
  }
}

</style>
