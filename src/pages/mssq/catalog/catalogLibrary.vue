<template>
  <div class="cardView" ref="tableH">
    <div class="search-box">
      <Search :fieldData="fieldData" ref="srarch" @searchClick="searchClick"></Search>
    </div>
    <div class="view">
      <el-card class="box-card box-left" shadow="never">
        <div slot="header" class="clearfix">
          <div class="title">
            <div class="left">
              <div class="icon">
                <i class="el-icon-star-on"></i>
              </div>
              <span>索引</span>
            </div>
            <el-tooltip class="item" effect="dark" content="新增一级索引" placement="top-start">
              <el-button type="text" class="oneIndex" size="mini" @click="addIndex(1,'self')">
				  <i class="el-icon-circle-plus-outline"></i>
				  <span>新增</span>
			  </el-button>
            </el-tooltip>
          </div>
        </div>
        <div class="text item">
          <el-tree :load="loadNode" lazy ref="treeForm" :props="defaultProps" node-key="code" check-strictly
                    @node-click="choseNode">
						<span class="custom-tree-node" slot-scope="{ node, data }">
							<div class="tree-node">
								<el-tooltip class="item" :offset="-100" :enterable="false" effect="dark" :content="node.label" placement="top-start">
                  <div class="tree-label"><span>{{ node.label }}</span></div>
								</el-tooltip>
                <span>
                  <el-tooltip class="item btnShow" :offset="100" :enterable="false" effect="dark" content="新增二级索引" placement="top-start">
                    <el-button @click="addIndex(2,node.data.code)" style="float: right" size="mini" v-if="node.data.code.length == 2" type="text">
						 <i class="el-icon-circle-plus-outline"></i>
					</el-button>
                  </el-tooltip>
                </span>
							</div>
						</span>
          </el-tree>
        </div>
      </el-card>
      <el-card class="box-card box-right" shadow="never">
        <div class="text item">
          <el-table :data="catalogList" style="width: 100%" height="100%" class="qz-table-hide">
            <el-table-column type="index" label="序号" width="50"></el-table-column>
            <el-table-column prop="name" label="索引名称" show-overflow-tooltip></el-table-column>
            <el-table-column prop="code" label="索引编码" show-overflow-tooltip width="100px"></el-table-column>
            <el-table-column prop="parentCode" label="父级编码" show-overflow-tooltip :formatter='formatterParentCode'align="center"></el-table-column>
            <el-table-column prop="createTime" label="创建时间" show-overflow-tooltip :formatter='formatterDateTime'></el-table-column>
            <el-table-column prop="status" label="状态" show-overflow-tooltip align="center" width="150">
              <template slot-scope="scope">
                <el-tag type="success" v-if="scope.row.status == '1'">可用</el-tag>
                <el-tag type="danger" v-if="scope.row.status == '0'">不可用</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="status" label="类型" show-overflow-tooltip align="center" width="150">
              <template slot-scope="scope">
                <el-tag type="success" v-if="scope.row.type == '1'">一级索引</el-tag>
                <el-tag v-if="scope.row.type == '2'">二级索引</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="50">
              <template slot-scope="scope">
                <el-button @click="editCatalog(scope.row)" type="text">变更</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div class="block">
            <el-pagination @current-change="handleCurrentChange" :current-page.sync="itemParams.page"
                           :page-size="itemParams.limit" layout="total,prev, pager, next, jumper"
                           :total="itemParams.total">
            </el-pagination>
          </div>
        </div>
      </el-card>
      <el-dialog title="索引" width="50%"  :close-on-click-modal=false class="qz-dialog-padding qz-law"
                 :visible.sync="indexDialog" v-if="indexDialog">
        <el-form :model="indexData" label-width="80px" ref="indexForm" :rules="rules">
          <template v-if="typeData == '2'">
            <el-form-item label="父级编码" prop="parentCode">
              <el-select v-model="indexData.parentCode" disabled><!--:disabled="indexType == 'add'">-->
                <el-option v-for="item in firstIndexList" :value="item.code" :key="item.code" >
                  <span style="float: left">{{ item.code }}</span>
                  <span>({{ item.name }})</span>
                </el-option>
              </el-select>
            </el-form-item>
          </template>
          <el-form-item label="索引类型">
            <el-input v-model="typeName" disabled></el-input>
          </el-form-item>
          <el-form-item label="索引名称" prop="name">
            <el-input v-model="indexData.name"></el-input>
          </el-form-item>
          <el-form-item label="索引编码" prop="code">
            <el-input v-model="indexData.code" disabled></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
				<el-button @click="indexDialog= false">取 消</el-button>
				<el-button type="primary" :loading="loading" @click="comfirm">确 定</el-button>
			</span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
  import qzBase from '@_src/pages/mssq/common/util/qzBase';
  import option from "../common/components/option";

  export default {
    name: "catalogLibrary",
    mixins: [qzBase],
    components: {},
    data() {
      let validateName = (rule, value, callback) => {
        let params = {
          name:value,
          verifyType:this.indexType,
          id:this.indexData.id || '',
        }

        let _this = this;
        let url = this.Config.baseContext + '/mssq/mssqCatalogIndex/verifyOneIndex';
        if(this.indexData.parentCode !== 'self'){
          url = this.Config.baseContext + '/mssq/mssqCatalogIndex/verifyTowIndex';
          params = {
            name:value,
            verifyType:this.indexType,
            oneCode:this.indexData.parentCode,
            id:this.indexData.id || '',
          };
        }
        this.$nextTick(()=>{
          if(!this.indexData.id){
            this.loading = true;
          }
        })
        if(this.indexData.code && !this.indexData.id){
          callback();
        }else{
          this.$http_post(url,params).then(ret => {
            if(ret.state == '1'){
              this.loading = false;
              if(ret.row == 'true'){
                callback();
                // _this.comfirm();
              }else if(ret.row == 'false'){
                callback(new Error('索引名称重复，请重新输入'))
              }else{
                _this.indexData.code = ret.row;
                callback();
                if(_this.catalogStatus == 'submit'){
                  _this.comfirm();
                }
              }
            }else{
              this.$message.success(ret.message);
            }
          });
        }
      };
      return {
        loading:false,
        chooseIndex:'self',
        catalogList:[],
        typeName:'',
        regionIndex:-1,
        indexDialog: false,
        indexData:{
          code:'',
          name:'',
          parentCode:'',
          type:'',
          status:'1'
        },
        catalogStatus:'',
        brandFold: false,
        defaultProps: {
          children: 'children',
          value: 'value',
          label: 'name'
        },
        searchDeptName: '',
        seachCatalog: {
          first: '',
          second: '',
          third: ''
        },
        fieldData: {
          name: {
            label: '索引名称',
            type: 'Input',
            placeholder: '请输入索引名称',
            value: '',
            span: 8
          },
          code: {
            label: '索引编码',
            type: 'Input',
            placeholder: '请输入索引编码',
            value: '',
            span: 8
          },
          Button: {
            type: 'Button',
            span: 8
          }
        },
        deptIndex: -1,
        deptList: [],
        defulatValue: [],
        activeName: 'isAll',
        dictMap: {},
        tableData: [],
        typeData:'',
        tabPosition: 'top',
        itemParams: {
          page: 1,
          limit: 10,
          total: 0
        },
        indexType:'',
        item_menu: {
          height: ''
        },
        formInline: {
          name: '',
          code: '',
        },
        tableHeight: 100,
        rootNode:{},
        rootResolve:{},
        rules: {
          name: [{
            required: true,
            message: '请输入名称',
            trigger: 'blur'
          }, { validator: validateName, trigger: 'blur' }],
          parentCode: [{
            required: true,
            message: '请输入父级编码',
            trigger: 'blur'
          },],
        },
        firstIndexList:[],
      }
    },
    watch: {
      deptTree: {
        handler(val) {
          this.fieldData.regionCode.selectList = val;
        }
      },
    },
    mounted() {

      //表格高度自适应
      let _this = this;
      this.$nextTick(() => {
        _this.tableHeight = _this.$refs.tableH.offsetHeight - 280;
      });
      window.onresize = () => {
        return (() => {
          _this.tableHeight = _this.$refs.tableH.offsetHeight - 280;
        })();
      };
      //加载字典
      this.queryDictMap("BUSI_TYPE,BUSI_GROUP,ITEM_STATUS,MANAGE_TYPE,SSCJ,REGION", (res) => {
        this.dictMap = res
      });
      this.getCatalogLibrary();
      //加载列表
    },
    methods: {
      loadNode(node, resolve){
        this.rootNode = node
        this.rootResolve = resolve;
        this.getCatalog(node.data?node.data.code:'',v=>{
          resolve(v);
        });
      },
      addIndex(type,val){
        this.indexData = {
          code:'',
          name:'',
          parentCode:'',
          type:'',
          status:'1'
        };
        this.indexType = 'add';
        this.indexDialog = true;
        this.typeData = type;
        this.typeName = type == 1?'一级索引':'二级索引';
        this.indexData.parentCode = val;
        this.indexData.type = type;
      },
      choseNode(data, node) {
        this.chooseIndex = data.code;
        this.getCatalogLibrary();
      },
      editCatalog(val){
        this.typeName = val.type == 1?'一级索引':'二级索引';
        this.indexData = JSON.parse(JSON.stringify(val));
        this.typeData = val.type;
        this.indexType = 'edit';
        this.indexDialog = true;
        this.getCatalog('',(v)=>{
          this.firstIndexList = v;
        })
      },
      getCatalog(val,callBack) {
        var url = this.Config.baseContext + "/mssq/mssqCatalog/selectPrimaryIndex";
        // var param = Object.assign({}, pageParam, searchParam);
        this.$http_post(url,{
          parentCode:val,
          // name:this.formInline.name,
          // code:this.formInline.code,
        }).then(ret => {
          // this.catalogList = ret.rows;
          // this.itemParams.total = ret.records;
          callBack(ret.rows)
        });
      },
      getCatalogLibrary() {
        var url = this.Config.baseContext + "/mssq/mssqCatalogIndex/selectIndexList";
        this.$http_post(url,{
          page: this.itemParams.page,
          limit: this.itemParams.limit,
          parentCode:this.chooseIndex,
          name:this.formInline.name,
          code:this.formInline.code,
        }).then(ret => {
          this.catalogList = ret.rows;
          this.itemParams.total = ret.records;
        });
      },
      handleCurrentChange(val) {
        this.itemParams.page = val;
        this.getCatalogLibrary()
      },
      formatterParentCode(row){
        if(row.parentCode == 'self'){
          return '无'
        }
        return row.parentCode
      },
      searchClick(val,type) {
        this.formInline = {
          name: val.name.value,
          code:val.code.value,
        };
        if(type == 'reload'){
          this.chooseIndex = 'self';
        }
        this.getCatalogLibrary();
      },
      getCodeValue(){

      },
      comfirm(){
        if(!this.indexData.code){this.catalogStatus = 'submit';return}
        let _this = this;
        option.show({
          head: '办理意见',
          msg: '提交报审',
          onOkClick: function (res) {
            if (res == "") {
              _this.$message.error("请填写办理意见!")
              return;
            }
            const rLoading = _this.openLoading('目录库索引变更中，请稍等');
            _this.$refs.indexForm.validate((valid) => {
              if(valid) {
                let url = _this.Config.baseContext + '/mssq/mssqCatalogIndex/saveCatalogIndex';
                if(_this.indexType == 'edit'){
                  url = _this.Config.baseContext + '/mssq/mssqCatalogIndex/editIndex';
                }
                _this.indexData.remark = res;
                _this.$http_post(url,_this.indexData,true).then(ret => {
                  setTimeout(()=>{
                    _this.loading = false;
                  },5000)
                  rLoading.close();
                  if(ret.state == '1'){
                    _this.indexDialog = false;
                    var theChildren = _this.rootNode.childNodes;
                    theChildren.splice(0, theChildren.length);
                    if(_this.indexData.id && _this.rootNode.data){
                      _this.rootNode.data.name = _this.indexData.name;
                    }
                    _this.loadNode(_this.rootNode, _this.rootResolve);
                    _this.getCatalogLibrary();
                    _this.$message.success(_this.indexType == 'edit'?'索引变更成功':'索引新增成功');
                  }else{
                    _this.$message.error(ret.message);
                  }
                }).catch(()=>{
                  _this.loading = false;
                  _this.$message.error('保存失败')
                });
              }
            })
          }
        })

      },
    },
    computed: {
    },
    destroyed() {
      window.onresize = null;
    }
  }
</script>
<style lang='less' scoped>
  .cardView {
    position: relative;
    /*overflow: hidden;*/
    height: 100%;
    background: #f8f8f8;
    display: flex;
    flex-direction: column;

    /deep/ .el-tabs {
      .el-tabs__header {
        .el-tabs__nav-wrap {
          .el-tabs__nav-scroll {
            .el-tabs__nav {
              .el-tabs__item {
                padding: 0px 5px;
                font-size: 13px;
              }
            }
          }
        }
      }
    }

    .el-col {
      .form-btn {
        /deep/ .el-form-item__content {
          text-align: center;
          margin-left: 20px !important;
        }
      }

      .form-btn-right {
        /deep/ .el-form-item__content {
          text-align: end;
          margin-left: 20px !important;
        }
      }

      .el-select {
        width: 100%;
      }
    }

    .view {
      display: flex;
      flex: 1;
      height: calc(100% - 200px);

      .box-left {
        font-size: 12px;
        width: 240px;
        border: none;
        height: 100%;
        background: #fff;
        margin-right: 10px;

        /deep/ .el-card__header {
          padding: 14px 10px;

        }

        .title {
          width:100%;
          display:flex;
          align-items: center;
          justify-content: space-between;
          .left{
            display: flex;
            align-items: center;
            .icon {
              width:14px;
              height:14px;
              border-radius:50%;
              background:#3D91F7;
              display:flex;
              justify-content: center;
              align-items: center;
              margin-right:4px;
              i{
                color:#fff;
                font-size:12px;
              }
            }
            span{
              font-size:14px;
            }
          }
          .search{
            width:120px;
          }
          :deep(.name.el-input) {
            position: relative;
            input::placeholder{
              font-size:12px !important;
              color:#999;
            }
            .el-input__inner {
              width: 120px;
              height: 28px !important;
              border-radius: 100px;
              line-height: 28px !important;
              font-size:12px;
              background:#f5f5f5;
              border:none;
              color:#333;
            }

            .el-input__prefix {
              position: absolute;
              top: 50%;
              transform: translateY(-50%);
            }

            .el-input__suffix {
              position: absolute;
              top: -6px;
            }

            .el-icon-search {
              font-size: 12px;
              line-height: 28px;
              color:#666;
            }

          }
        }

        /deep/ .el-card__body {
          padding: 0;
          height: calc(100% - 65px);
          overflow-y: auto;
          .item {
            height: 100%;
            display: flex;
            flex-direction: column;
            height: 100%;
            .third {
              width: 46% !important;
            }

            .first,
            .second,
            .third {
              padding: 5px;
              text-align: center;
              width: 27%;

              .primaryIndex {
                height: 100%;
                overflow: auto;
                padding-bottom: 55px;

                .auto {
                  margin: 5px 0;
                  cursor: pointer;
                  padding: 5px;
                  box-shadow: 0 2px 12px 0 #0000001a;

                  &:hover {
                    background: #eff7ff;
                  }
                }
              }

              .cell {
                /*padding: 5px;*/
                display: flex;
                justify-content: space-between;
                /*!*padding: 5px 0;*!*/
                /* border-bottom: 1px solid #c2c2c2;*/


                .content {
                  white-space: nowrap;
                  overflow: hidden;
                  text-overflow: ellipsis;
                }
              }

              .el-input {
                .el-input__inner {
                  height: 18px;
                }
              }
            }
          }
        }
      }

      .box-right {
        border: none;
        border-radius: 0;
        display: inline-block;
        width: calc(100% - 250px);
        height: 100%;

        /deep/ .el-card__body {
          padding: 0;
          height: calc(100%);
          padding:0 14px;
          &>.item {
            height: 100%;
            display: flex;
            flex-direction: column;
            height: calc(100%);
            background: #fff;
            .block {
              padding: 10px 0;
            }
          }
        }
      }
    }

    .el-menu {
      border-right: none;
      height: 100%;
    }

    /deep/ .el-menu-item {
      height: 40px;
      line-height: 40px;
    }

    /deep/ .el-menu-item.is-active {}
  }
  .el-dialog{
    .el-dialog__body{
      .el-form{
        :deep(.el-form-item__content){
          .el-select{
            width: 100%;
          }
        }
      }
    }
  }

  /deep/ .el-radio-button__inner {
    padding: 7px 22px !important;
    margin-right: 10px;
    border-radius: 0 !important;
  }

  .block {
    text-align: right;
    margin: 10px;
  }

  .el-menu-vertical-demo {
    .el-menu-item.is-active {
      color: #303133;
    }

    .el-menu-item {
      border-left: 3px solid transparent;

    }

  }

  .treeMenu {
    position: relative;

    .num {
      position: absolute;
      right: 20px;
      font-weight: 400;
      color: #999;
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

  .export {
    margin-left: 10px;
  }

  .buttonIcon {
    position: relative;
    overflow: hidden;
    display: inline-block;
    height: 40px;
    line-height: 40px;
    width: 47.2%;
    padding: 0 10px;
    border: 1px solid #eee;
    margin: 5px;
    cursor: pointer;
    max-width: 100%;
    margin-left: 0 !important;
    text-overflow: ellipsis;
    white-space: nowrap;

    /deep/ .buttons {
      position: absolute;
      top: -20px;
      background: #67c23a;
      height: 40px;
      width: 40px;
      text-align: end;
      padding-left: 18px;
      padding-top: 4px;
      transform: rotate(45deg) translateY(1px);
      left: -20px;
      color: #fff;

      .el-icon-check {
        transform: rotate(-45deg);
        padding-left: 10px;
      }
    }

  }

  .tabPane {
    font-size: 12px;
    padding: 5px 0;
  }

  .nums {
    color: #409eff;
  }

  .deptInfo-all {
    height: 200px;
    overflow: auto;
  }

  .deptInfo {
    display: flex;
    cursor: pointer;
    justify-content: space-between;
    align-items: center;
    padding: 10px 0;
    border-bottom: 1px solid #ccc;

    .name {
      width: 80%;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }

  .addCatalog {
    padding-left: 10px;
    /*position: absolute;*/
    /*right: 0;*/
  }
  .custom-tree-node{
    width: 100%;
    .tree-node {
      width: 100%;
      display: flex;
      flex: 1;
      align-items: center;
      justify-content: space-between;
      font-size: 14px;
      padding-right: 8px;

      .tree-label {
       span{
         max-width: 100px;
         overflow:hidden;
         text-overflow:ellipsis;
       }
      }
    }
  }


  .choose_search {
    position: relative;
    background: #fff;
    margin-bottom: 10px;
    width: 100%;
    /*display: flex;*/
    padding: 20px 10px 6px 16px;

    .content {
      display: flex;
      width: 90%;

      .cell-content {
        width: calc(100% - 90px);
        flex-wrap: wrap;
        display: flex;

        .popover {
          width: 16%;
          margin-bottom: 14px;
        }

        .cell {
          display: flex;
          /*width: 16%;*/
          align-items: center;
          cursor: pointer;
          .name{
            overflow:hidden; //超出的文本隐藏
            text-overflow:ellipsis; //溢出用省略号显示
            white-space:nowrap; //溢出不换行
          }
          &:hover {
            color: #208fff;

            .searchNums {
              background: #208fff;
              color: #fff;
            }

            .downIcon {
              color: #208fff;
            }
          }

          .searchNums {
            margin-left: 5px;
            min-width: 30px;
            text-align: center;
            background: #E0E0E0;
            color: #050505;
            border-radius: 20px;
            padding: 2px 5px;
            line-height: 14px;
            font-size: 12px;
            position: relative;
            top: 1px;
          }

          .downIcon {
            padding-left: 5px;
          }

          &.active {
            .name {
              color: #208fff;
            }

            .searchNums {
              background: #208fff;
              color: #fff;
            }

            .downIcon {
              color: #208fff;
            }
          }
        }
        .isAll-cell {
          display: flex;
          width: 16%;
          align-items: flex-start;
          cursor: pointer;
          .name{
            overflow:hidden; //超出的文本隐藏
            text-overflow:ellipsis; //溢出用省略号显示
            white-space:nowrap; //溢出不换行
          }
          &:hover {
            color: #208fff;

            .searchNums {
              background: #208fff;
              color: #fff;
            }

            .downIcon {
              color: #208fff;
            }
          }

          .searchNums {
            margin-left: 5px;
            min-width: 30px;
            text-align: center;
            background: #E0E0E0;
            color: #050505;
            border-radius: 20px;
            padding: 2px 5px;
            line-height: 14px;
            font-size: 12px;
            position: relative;
            top: 1px;
          }

          .downIcon {
            padding-left: 5px;
          }

          &.active {
            .name {
              color: #208fff;
            }

            .searchNums {
              background: #208fff;
              color: #fff;
            }

            .downIcon {
              color: #208fff;
            }
          }
        }

      }

      .sit-hidden {
        height: 30px;
        overflow: hidden;
      }

      .title {
        width: 90px;
        height: 20px;
        color: #5E5E5E;
        display: flex;
        align-items: center;
      }
    }

    .shrink {
      width: 70px;
      text-align: center;
      font-size: 14px;
      padding-bottom: 10px;

      .is-underline:hover:after {
        border: none;
      }

      span {
        cursor: pointer;
      }

      .el-link {
        margin-left: 5px;
        font-size: 14px;
        color: #666;
      }
    }
  }

  .inputSearch {
    padding: 10px;
  }

  .deptInfo {
    display: flex;
    cursor: pointer;
    justify-content: space-between;
    align-items: center;
    padding: 10px 5px;

    /*border-bottom: 1px solid #ccc;*/
    .name {
      width: 80%;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    &.active {
      background: #E3F1FF;
      color: #3D91F7;
    }

    &:hover {
      background: #E3F1FF;
      color: #3D91F7;
    }
  }

  .search-box {
    background: #fff;
    margin-bottom: 10px;
    width: 100%;
    /*display: flex;*/
    padding: 10px 14px 0 14px;

  }
  .oneIndex{
	  display: flex;
	  align-items: center;
	  color:#666;
    i{
      font-size: 16px;
	  line-height: 16px;
    }
	span{
		font-size:14px;
	}
  }
  :deep(.el-tree){
	  .el-tree-node__content{
		  .btnShow{
			  .el-icon-circle-plus-outline{
				  font-size:16px;
				  color:#666;
				  display: none;
			  }
		  }
		  &:hover{
			  .btnShow{
				  .el-icon-circle-plus-outline{
					  color:#3d91f7;
					  display: block;
				  }
			  }
		  }
	  }
  }
</style>
