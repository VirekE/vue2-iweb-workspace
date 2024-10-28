<template>
  <div class="dealt" ref="tableH">
    <div class="search-box">
      <Search :fieldData="fieldData" ref="srarch" @searchClick="searchClick"></Search>
    </div>
    <div class="view tab-box">
      <el-table :data="tableData" style="width: 100%" class="qz-table-hide" :height="tableHeight">
        <el-table-column type="index" label="序号" width="50"></el-table-column>
        <el-table-column prop="itemName" label="事项名称" show-overflow-tooltip></el-table-column>
        <el-table-column prop="itemCode" label="事项编码" show-overflow-tooltip></el-table-column>
        <!-- <el-table-column prop="ssbm" label="实施编码" width="100" show-overflow-tooltip></el-table-column>-->
        <el-table-column prop="deptName" label="主管部门" width="200" show-overflow-tooltip></el-table-column>
        <el-table-column prop="version" label="事项版本" width="90" show-overflow-tooltip></el-table-column>
        <el-table-column prop="status" label="事项状态" width="90" show-overflow-tooltip :formatter="dicForValue">
          <template slot-scope="scope">
            <el-tag type="success"
                    v-if="scope.row.status == 'EXAMINE_SUCCESS' || scope.row.status == 'PUBLISH' || scope.row.status == 'DISCARD'">
              {{dicForValue(scope.row)}}
            </el-tag>
            <el-tag v-if="scope.row.status == 'DRAF'">{{dicForValue(scope.row)}}</el-tag>
            <el-tag type="danger" v-if="scope.row.status == 'EXAMINE_FAIL' || scope.row.status == 'ACCEPT_FAIL'">
              {{dicForValue(scope.row)}}
            </el-tag>
            <el-tag type="warning" v-if="scope.row.status == 'EXAMINE_WAIT' || scope.row.status == 'ACCEPT_WAIT'">
              {{dicForValue(scope.row)}}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="lastUpdateTime" label="最后修改时间" width="180" :formatter="formatterDates"></el-table-column>
        <el-table-column label="操作" width="150" algin="right">
          <template slot-scope="scope">
            <el-button type="text" @click="onEditItem(scope.row)"
                       v-if="scope.row.status == 'EXAMINE_WAIT' || scope.row.status == 'ACCEPT_WAIT' ">审核
            </el-button>
            <el-button type="text"
                       v-if="$route.path == '/item/todo-list' && (scope.row.status==='DRAF' || scope.row.status==='EXAMINE_FAIL' || scope.row.status==='ACCEPT_FAIL')"
                       @click="onEditItem(scope.row)">编辑
            </el-button>
            <el-button type="text" v-if="$route.path == '/item/todo-list' && (scope.row.status==='PUBLISH')"
                       @click="onEditItem(scope.row)">变更
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="block">
        <el-pagination
                @current-change="handleCurrentChange"
                :current-page.sync="itemParams.page"
                :page-size="itemParams.rows"
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

  export default {
    name: "item_todo_list",
    mixins: [qzBase],
    components: {},
    data() {
      return {
        fieldData: {
          itemName: {
            label: '事项名称',
            type: 'Input',
            placeholder: '请输入事项名称',
            value: '',
            span: 6,
            itemWidth: '100px',
          },
          itemCode: {
            label: '事项编码',
            type: 'Input',
            placeholder: '请输入事项编码',
            value: '',
            span: 6
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
            span: 6
          }
        },
        roleValue: '',
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
          deptNo: '',
          deptName: '',
        },
        tableHeight: 100
      }
    },
    watch: {
      $route: {
        handler(val) {
          var pageParam = this.itemParams
          var searchParam = this.formInline
          this.onQuery(pageParam, searchParam);
        },
        deep: true,
        immediate: true
      },
      manageType: {
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
      if(this.$route.path != this.$store.getters.searchParams.path) this.$store.dispatch("setSearchParams", {});
      if (!this.isEmptyObject(this.$store.getters.searchParams.data)) {
        this.$nextTick(() => {
          this.$refs.srarch.update('itemName', this.$store.getters.searchParams.data.itemName, false);
          this.$refs.srarch.update('itemCode', this.$store.getters.searchParams.data.itemCode, false);
          this.$refs.srarch.update('manageType', this.$store.getters.searchParams.data.manageType, false);
          this.formInline = this.$store.getters.searchParams.data;
          this.itemParams = this.$store.getters.searchParams.data;
          this.onQuery(this.formInline, this.itemParams);
          this.$store.dispatch("setSearchParams", {});
        })
      } else {
        var pageParam = this.itemParams
        var searchParam = this.formInline
        this.onQuery(pageParam, searchParam);
      }
      var _this = this;
      //表格高度自适应
      this.$nextTick(() => {
        _this.tableHeight = this.$refs.tableH.offsetHeight - 175;
      });
      window.onresize = () => {
        return (() => {
          _this.tableHeight = this.$refs.tableH.offsetHeight - 175;
        })();
      };
      this.queryDictMap("BUSI_TYPE,BUSI_GROUP,ITEM_STATUS,MANAGE_TYPE", (res) => {
        this.dictMap = res
      });
      var curUser = this.$store.getters.curUser;
      this.roleValue = curUser.roleValue;

      //加载列表
      var pageParam = this.itemParams
      var searchParam = this.formInline
      this.onQuery(pageParam, searchParam);
    },
    computed: {
      manageType() {
        return this.dictMap['MANAGE_TYPE']
      },
      itemStatus() {
        let arr = [];
        if ((!this.isEmptyObject(this.dictMap)) && this.dictMap.ITEM_STATUS.length > 0) {
          for (let i = 0; i < this.dictMap.ITEM_STATUS.length; i++) {
            if (this.dictMap.ITEM_STATUS[i].itemCode == 'DRAF' ||
              this.dictMap.ITEM_STATUS[i].itemCode == 'ACCEPT_WAIT' ||
              this.dictMap.ITEM_STATUS[i].itemCode == 'PUBLISH' ||
              this.dictMap.ITEM_STATUS[i].itemCode == 'DISCARD' ||
              this.dictMap.ITEM_STATUS[i].itemCode == 'DISCARD_WAIT' ||
              this.dictMap.ITEM_STATUS[i].itemCode == 'DISCARD_FAIL') {
              arr.push(this.dictMap.ITEM_STATUS[i])
            }
          }
        }
        return arr;
      },
    },
    methods: {
      handleOpen(key, keyPath) {
        console.log(key, keyPath);
      },
      handleClose(key, keyPath) {
        console.log(key, keyPath);
      },
      chooseDep() {
        var _this = this
        OrganTree.show({
          head: '部门选择',
          isCheckbox: false,
          //深圳市编码440301区划编码穿空字符串，不为440301就传区划编码
          rootCode: this.$store.getters.curUser.attrMap.REGION_CODE == '440301' ? '' : this.$store.getters.curUser.attrMap.REGION_CODE,
          isRegion: false,
          regionDisabled: true,
          onOkClick: function (res) {
            _this.formInline.deptId = res.id;
            _this.formInline.deptName = res.name
          }
        });
      },
      onQuery(pageParam, searchParam) {
        var url = this.Config.baseContext + "/mssq/mssqItemVersion/getItemList";
        var param = Object.assign({}, pageParam, searchParam);
        param.isAudit = this.$route.path == '/item/todo-list' ? '0' : '1';
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
      onEditItem(row) {
        this.$store.dispatch("setSearchParams", {path:this.$route.path,data:Object.assign(this.formInline,{page:this.itemParams.page,limit:this.itemParams.limit})});
        //转跳事项梳理页面
        let type = 'todo';
        if (row.status === 'DRAF' || row.status === 'EXAMINE_FAIL' || row.status === 'ACCEPT_FAIL') {
          type = 'edit'
        }
        this.$router.push({
          path: '/item/info',
          query: {
            id: row.itemVid,
            type: type,
            // editType:
          }
        });
      },
      handleCurrentChange(val) {
        this.itemParams.page = val;
        var pageParam = this.itemParams;
        var searchParam = this.formInline;
        this.onQuery(pageParam, searchParam)
      },
      reload(type) {
        this.itemParams = {page: 1, total: 0, limit: 10};
        var pageParam = this.itemParams;
        var searchParam = this.formInline;
        if (type == 'cz') {
          searchParam.deptName = '';
          searchParam.deptId = '';
          searchParam.status = '';
          searchParam.itemName = '';
          searchParam.itemCode = '';
          searchParam.manageType = '';
        }
        this.onQuery(pageParam, searchParam);
      },
      searchClick(val) {
        this.formInline = {
          itemName: val.itemName.value,
          itemCode: val.itemCode.value,
          manageType: val.manageType.value
        };
        this.reload();
      },
      dicForValue(row) {
        var status = row.status
        var statusDict = this.dictMap.ITEM_STATUS
        if(!this.isEmptyObject(this.dictMap)) {
          for (var i = 0; i < statusDict.length; i++) {
            if (statusDict[i].itemCode == status) {
              return statusDict[i].itemValue;
            }
          }
        }
        return "";
      },
      formatterDates(row) {
        return this.formatDate(row.lastModifitionTime, "yyyy-MM-dd HH:mm:ss");
      },
    }
  }
</script>
<style lang='less' scoped>
  .dealt {
    position: relative;
    height: 100%;
    background: #f8f8f8;
    display: flex;
    flex-direction: column;

    .block {
      text-align: right;
    }

    .el-form {
      .el-form-item {
        margin-right: 30px;
      }

      .el-select {
        width: 100%;
      }

      .form-btn {
        /deep/ .el-form-item__content {
          text-align: end;
          margin-left: 0 !important;
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

  .view {
    flex: 1;
    padding: 0 14px;
    background: #fff;
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
</style>