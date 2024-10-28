<template>
  <div class="cardView" ref="tableH">
	<div class="search-box">
		<Search :fieldData="fieldData" ref="srarch" @searchClick="searchClick"></Search>
	</div>
    <div class="tab-box">
      <el-table :data="tableData" style="width: 100%" height="100%" class="qz-table-hide">
        <el-table-column type="index" label="序号" width="50"></el-table-column>
        <el-table-column prop="primaryIndexName" label="一级索引名称" show-overflow-tooltip></el-table-column>
        <el-table-column prop="parentName" label="二级索引名称" show-overflow-tooltip></el-table-column>
        <el-table-column prop="itemCode" label="事项编码" show-overflow-tooltip></el-table-column>
        <!--事项编码取用目录编码字段-->
        <el-table-column prop="itemName" label="事项名称" show-overflow-tooltip></el-table-column>
        <el-table-column prop="level" label="事项层级" :formatter="formatterPriority" show-overflow-tooltip width="100px"
                         align="center"></el-table-column>
        <el-table-column prop="level" label="状态" :formatter="formatterStatus" show-overflow-tooltip width="100px"
                         align="center">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.status == 'EXAMINE_SUCCESS' || scope.row.status == 'PUBLISH' || scope.row.status == 'DISCARD'">{{formatterStatus(scope.row)}}</el-tag>
            <el-tag v-if="scope.row.status == 'DRAF'">{{formatterStatus(scope.row)}}</el-tag>
            <el-tag type="danger" v-if="scope.row.status == 'EXAMINE_FAIL' || scope.row.status == 'ACCEPT_FAIL'">{{formatterStatus(scope.row)}}</el-tag>
            <el-tag type="warning" v-if="scope.row.status == 'EXAMINE_WAIT' || scope.row.status == 'ACCEPT_WAIT'">{{formatterStatus(scope.row)}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100">
          <template slot-scope="scope">
            <el-button type="text" @click="overAllClick(scope.row,'overAllView')">查看</el-button>
            <el-button type="text" v-if="scope.row.status != 'ACCEPT_WAIT'" @click="overAllClick(scope.row,'overAll')">统筹</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="block">
        <el-pagination
                @current-change="handleCurrentChange"
                :current-page.sync="itemParams.page"
                :page-size="itemParams.limit"
                layout="total,prev, pager, next, jumper"
                :total="itemParams.total">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
  import qzBase from '@_src/pages/mssq/common/util/qzBase';
  import OrganTree from '@_src/pages/mssq/common/components/organ'
  import option from '../common/components/option/index.js'

  export default {
    name: "index",
    mixins: [qzBase],
    components: {},
    data() {
      return {
        fieldData:{
          primaryIndexName: {
            label: '一级索引',
            type: 'Input',
            placeholder: '请输入一级索引名称',
            value: '',
            span: 8
          },
          parentName: {
            label: '二级索引',
            type: 'Input',
            placeholder: '请输入二级索引名称',
            value: '',
            span: 8
          },
          itemName: {
            label: '事项名称',
            type: 'Input',
            placeholder: '请输入事项名称',
            value: '',
            span: 8
          },
          itemCode: {
            label: '事项编码',
            type: 'Input',
            placeholder: '请输入事项编码',
            value: '',
            span: 8,
          },
          level: {
            label: '事项层级',
            type: 'Select', //类型
            placeholder: '请选择事项层级',
            value: '',
            span: 8, //布局比例
            selectList: []
          },
          Button: {
            type: 'Button',
            span: 8
          }
        },
        itemInfo: {},
        overAllDialog: false,
        dictMap: {},
        tableData: [],
        tabPosition: 'top',
        itemParams: {
          page: 1,
          limit: 10,
          total: 0
        },
        formInline: {
          itemName: '',
          itemCode: '',
          status: '',
          manageType: '',
          deptName: '',
        },
        tableHeight: 100,
        bgC: '',
        textC: '',
        itemLimit: 1000,
        exportData: [],
        loading: false,
        exportIndex: [],
      }
    },
    watch: {
      level: {
        handler(list) {
          if (list) {
            let res = [];
            list.forEach((item) => {
              res.push({
                id: item.itemCode,
                name: item.itemValue
              })
            });
            this.fieldData.level.selectList = res
          }
        }
      },
    },
    mounted() {
      if(this.$route.path != this.$store.getters.searchParams.path) this.$store.dispatch("setSearchParams", {});
      if (!this.isEmptyObject(this.$store.getters.searchParams.data)) {
        this.$nextTick(() => {
          // this.activeName = this.$store.getters.searchParams.regionCode;
          this.$refs.srarch.update('level', this.$store.getters.searchParams.data.level,false);
          this.$refs.srarch.update('primaryIndexName', this.$store.getters.searchParams.data.primaryIndexName,false);
          this.$refs.srarch.update('parentName', this.$store.getters.searchParams.data.parentName,false);
          this.$refs.srarch.update('itemName', this.$store.getters.searchParams.data.itemName,false);
          this.$refs.srarch.update('itemCode', this.$store.getters.searchParams.data.itemCode,false);
          this.formInline = this.$store.getters.searchParams.data;
          this.itemParams = this.$store.getters.searchParams.data;
          this.onQuery(this.formInline , this.itemParams);
          this.$store.dispatch("setSearchParams", {});
        })
      }else{
        var pageParam = this.itemParams
        var searchParam = this.formInline
        this.onQuery(pageParam, searchParam);
      }
      //表格高度自适应
      let _this = this;
      this.$nextTick(() => {
        _this.tableHeight = _this.$refs.tableH.offsetHeight - 220;
      });
      window.onresize = () => {
        return (() => {
          _this.tableHeight = _this.$refs.tableH.offsetHeight - 220;
        })();
      };
      //加载字典
      this.queryDictMap("DAY_TYPE,SSCJ,MANAGE_TYPE,ITEM_STATUS,BUSI_TYPE", (res) => {
        this.dictMap = res
      });
      /*if (this.$store.getters.curUser.attrMap.DEPT_ID) {
        this.formInline.deptId = this.$store.getters.curUser.attrMap.DEPT_ID;
      } else {
        this.formInline.deptNo = this.$store.getters.curUser.orgCode;
      }
      this.formInline.deptName = this.$store.getters.curUser.orgName;*/
      //加载列表
      // var pageParam = this.itemParams
      // var searchParam = this.formInline
      // this.onQuery(pageParam, searchParam);
    },

    methods: {
      orgCodeList(pageParam, searchParam) {
        var url = this.Config.baseContext + "/admin/pmi/orgCodeList";
        var param = Object.assign({}, pageParam, searchParam);
        this.$http_get(url, param).then(ret => {
          console.log(ret);
        });
      },
      handleOpen(key, keyPath) {
        console.log(key, keyPath);
      },
      handleClose(key, keyPath) {
        console.log(key, keyPath);
      },
      onQuery(pageParam, searchParam) {
        var url = this.Config.baseContext + "/mssq/mssqItemIndex/asWholeList";
        var param = Object.assign({}, pageParam, searchParam);
        param.isAudit = 2;
        this.$http_post(url, param).then(ret => {
          if (ret.state == 1) {
            this.tableData = ret.rows;
            this.itemParams.total = ret.records;
            window.getNums(ret.records);
          } else {
            this.$message.error(ret.message);
          }
        });
      },
      chooseDep() {
        var _this = this
        OrganTree.show({
          head: '部门选择',
          isCheckbox: false,
          //深圳市编码440301区划编码穿空字符串，不为440301就传区划编码
          rootCode:  this.$store.getters.curUser.attrMap.REGION_CODE == '440301'?'':this.$store.getters.curUser.attrMap.REGION_CODE,
          isRegion: false,
          regionDisabled: true,
          //removeCode: '160929095719',
          //isRadio:true,
          onOkClick: function (res) {
            if (res.id) {
              _this.formInline.deptName = res.name;
              _this.formInline.deptId = res.id;
            } else {
              _this.formInline.deptNo = res.code;
              _this.formInline.deptName = res.name;
            }
          }
        });
      },
      onEditItem(id, type) {
        //转跳事项梳理页面
        this.$router.push({
          path: '/qzqd/info',
          query: {
            itemVid: id,
            type: 'view',
            qzqdName: 'qzqdName'
          }
        });
      },
      overAllClick(row,type) {
        this.$store.dispatch("setSearchParams",{path:this.$route.path,data:Object.assign(this.itemParams,this.formInline)});
        // this.overAllDialog = true;
        // let type = 'overAll';
        this.$router.push({
          path: '/item/info',
          query: {
            itemVid: row.itemVid,
            type:type,
            // editType:
          }
        });
        // this.queryInfo(row);
      },
      queryInfo(row) {
        var _this = this;
        var url = this.Config.baseContext + "/mssq/mssqItemIndex/getItemInfoByItemVid";
        const rLoading = this.openLoading();
        this.$http_post(url, {"itemVid": row.itemVid}).then(ret => {
          if (ret.state == 1) {
            _this.itemInfo = ret.row;
          } else {
            this.$message.error(ret.message);
          }
          rLoading.close();
        }).catch(() => {
          rLoading.close();
        });
      },
      onDelItem(itemVid) {
        this.$confirm('是否确认撤销当前事项变更？,撤回后将删除该变更记录！', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let url = this.Config.baseContext + '/mssq/mssqItemVersion/toDelete';
          let param = {"id": itemVid};
          this.$http_post(url, param).then(ret => {
            if (ret.state === 1) {
              this.$message.success(ret.message);
              this.reload();
            } else {
              this.$message.error(ret.message);
            }
          });
        }).catch((e) => {
          console.log(e);
        });
      },
      handleCurrentChange(val) {
        this.itemParams.page = val;
        var pageParam = this.itemParams;
        var searchParam = this.formInline;
        this.onQuery(pageParam, searchParam)
      },
      submitOverAll(){
        let _this = this;
        this.$confirm('是否确认提交该事项?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          option.show({
            head: '办理意见',
            msg: '提交报审',
            onOkClick: function (res) {
              if (res == "") {
                _this.$message.error("请填写办理意见!")
                return;
              }
              const rLoading = this.openLoading();
              let url = _this.Config.baseContext + '/mssq/mssqItemVersion/submitItemInfo';
              _this.itemInfo.remark = res;
              _this.$http_post(url, _this.itemInfo, true).then(ret => {
                if (ret.state === 1) {
                  _this.$message.success("提交成功");
                  _this.overAllDialog = false;
                } else {
                  _this.$message.error(ret.message);
                }
                rLoading.close();
              });
            }
          })
        })
      },
      reload() {
        this.itemParams = {page: 1, total: 0, limit: 10};
        var pageParam = this.itemParams;
        var searchParam = this.formInline;
        this.onQuery(pageParam, searchParam);
        // this.itemCount()
      },
      search(type) {
        if (type == 'cz') {
          this.formInline.deptName = '';
          this.formInline.deptNo = '';
          this.formInline.parentName = '';
          this.formInline.regionName = '';
          this.formInline.regionCode = '';
          this.formInline.manageType = '';
          this.formInline.level = '';
          this.formInline.itemName = '';
          this.formInline.primaryIndexName = '';
          this.formInline.catalogCode = '';
          this.formInline.patentName = '';
          this.formInline.itemCode = '';
        }
        this.reload();
      },
      searchClick(val){
        this.formInline = {
          level:val.level.value,
          primaryIndexName:val.primaryIndexName.value,
          parentName:val.parentName.value,
          itemCode:val.itemCode.value,
          itemName:val.itemName.value,
        };
        this.reload();
      },
      formatterPriority(row) {
        if ((!this.isEmptyObject(this.dictMap)) && this.dictMap.SSCJ.length > 0) {
          for (let i = 0; i < this.dictMap.SSCJ.length; i++) {
            if (this.dictMap.SSCJ[i].itemCode == row.level) {
              return this.dictMap.SSCJ[i].itemValue
            }
          }
        }
      },
      formatterStatus(row) {
        if ((!this.isEmptyObject(this.dictMap)) && this.dictMap.ITEM_STATUS.length > 0) {
          for (let i = 0; i < this.dictMap.ITEM_STATUS.length; i++) {
            if (this.dictMap.ITEM_STATUS[i].itemCode == row.status) {
              return this.dictMap.ITEM_STATUS[i].itemValue
            }
          }
        }
      },
      formatterState(row) {
        if ((!this.isEmptyObject(this.dictMap)) && this.dictMap.ITEM_STATUS.length > 0) {
          for (let i = 0; i < this.dictMap.ITEM_STATUS.length; i++) {
            if (this.dictMap.ITEM_STATUS[i].itemCode == row.status) {
              return this.dictMap.ITEM_STATUS[i].itemValue
            }
          }
        }
      },
    },
    computed: {
      level(){
        return this.dictMap['SSCJ']
      },
    },
    destroyed() {
      window.onresize = null;
    }
  }
</script>
<style lang='less' scoped>
  .cardView {
    position: relative;
    height: 100%;
    background: #f8f8f8;
    display: flex;
    flex-direction: column;
	
    .el-col {
      .form-btn {
        /deep/ .el-form-item__content {
          margin-left: 20px !important;
        }
      }

      .el-select {
        width: 100%;
      }
    }

    .view {
      /*display: flex;*/
      /*border: 1px solid #e2e2e2;*/
	  flex:1;
	  height:calc(100% - 130px);
	  background:#fff;
      padding:0 14px;
      .box-left {
        width: 200px;
        border: none;

        /deep/ .el-card__header {
          padding: 13.3px 20px;
          background: #f5f7fa;
        }

        /deep/ .el-card__body {
          padding: 0;

          .item {
            overflow: auto;
          }
        }
      }

      .box-right {
        border: none;
        border-left: 1px solid #e2e2e2;
        border-radius: 0;
        display: inline-block;
        width: calc(100% - 200px);

        /deep/ .el-card__body {
          padding: 0;
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

    /deep/ .el-menu-item.is-active {

    }
  }

  /deep/ .el-radio-button__inner {
    padding: 7px 22px !important;
    margin-right: 10px;
    border-radius: 0 !important;
  }

  .block {
    text-align: right;
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
    padding-left: 10px;
  }

  .buttonIcon {
    position: relative;
    overflow: hidden;

    /deep/ .buttons {
      position: absolute;
      top: -20px;
      background: #67c23a;
      height: 40px;
      width: 40px;
      text-align: end;
      padding-top: 16px;
      transform: rotate(45deg) translateY(1px);
      left: -20px;
      color: #fff;

      .el-icon-check {
        transform: rotate(-45deg);
        padding-left: 10px;
      }
    }

  }

  .timeDay {
    /*border-right: 1px solid #e2e2e2;*/
    flex-direction: row;

    .el-input {
      width: 58%;
    }

    /deep/ .el-form-item__content {
      display: flex;

      .el-select {
        width: 42% !important;

        /deep/ .el-input {
          width: 100%;
        }
      }
    }
  }
  .search-box {
  	background: #fff;
  	margin-bottom: 10px;
  	width: 100%;
  	padding: 10px 14px 0 14px;
  }
  .tab-box{
  		flex:1;
  		display: flex;
  		flex-direction: column;
  		height: calc(100% - 200px);
  		background:#fff;
  		padding:0px 14px;
		.el-table{
			flex:1;
		}
  		.block{
  			padding:10px 0;
  		}
  	}
</style>