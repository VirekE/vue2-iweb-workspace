<template>
  <!-- 材料管理 -->
  <div class="material" ref="tableH">
    <div>
      <template>
        <div class="material-form">
          <el-form :model="searchFiled" :inline="true" size="small">
            <div class="flex-sb" style="padding:10px 0">
              <div>
                <el-form-item label="消息标题">
                  <el-input v-model="searchFiled.title" placeholder="请输入目录名称"></el-input>
                </el-form-item>
                <el-form-item label="消息状态">
                  <el-input v-model="searchFiled.status" placeholder="请输入目录编码"></el-input>
                </el-form-item>
                <el-form-item label="消息类型">
                  <el-select v-model="searchFiled.type">
                    <el-option v-for="item in messageType" :key="item.itemCode"
                               :label="item.itemValue"
                               :value="item.itemCode"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item class="programme-btn">
                  <el-button type="primary" icon="el-icon-search" @click="search">查询</el-button>
                  <el-button icon="el-icon-refresh-left" @click="search('cz')">重置</el-button>
                </el-form-item>
              </div>
            </div>
          </el-form>
        </div>
        <el-table :data="catalogList" style="width: 100%;" ref="singleTable" :height="tableHeight" class="qz-table-hide">
          <el-table-column type="index" label="排序" width="50"></el-table-column>
          <el-table-column label="消息标题" prop="catalogName" show-overflow-tooltip></el-table-column>
          <el-table-column label="消息类型" prop="level" :formatter="formatterLevel" width="140"></el-table-column>
          <el-table-column label="消息状态" prop="version" width="140"></el-table-column>
          <el-table-column label="操作" width="160" align="right" fixed="right">
            <template slot-scope="scope">
              <!--都有查看-->
              <el-button type="text"  @click="viewMajor(scope.row)">查看</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="block">
          <el-pagination
                  @current-change="handleCurrentChange"
                  :current-page.sync="catalogParams.page"
                  :page-size="catalogParams.limit"
                  layout="total,prev, pager, next, jumper"
                  :total="catalogParams.records">
          </el-pagination>
        </div>
      </template>

    </div>
  </div>
</template>

<script>
  import qzBase from '@_src/pages/mssq/common/util/qzBase';

  export default {
    name: "message-remind",
    mixins: [qzBase],
    data() {
      return {
        busiType: {},
        searchFiled: {
          title: '',//目录名称
          status: '',//目录编码
          type: ''//类型
        },
        tableHeight: 100,
        catalogList: [
        ],
        statusList: [
          {
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
          value: 'ACCEPT_WAIT'
        }, {
          label: '废置',
          value: 'DISCARD'
        }],//调接口时删除
        messageType:[],
        catalogParams: {
          page: 1,
          limit: 10,
          total: 0
        },
        title: '',
        dialogVisible: false,
        activeIndex: '1'
      }
    },
    watch: {},
    mounted() {
      this.onQuery();
      this.queryDict("BUSI_TYPE,SSCJ,ITEM_STATUS",res=>{
        this.busiType = res;
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

    methods: {
      formatterLevel(row){
        let level = row.level;
        if(JSON.stringify(this.busiType) !== '{}') {
          for (let i = 0; i < this.busiType['SSCJ'].length; i++) {
            if (this.busiType['SSCJ'][i].itemCode == level) {
              return this.busiType['SSCJ'][i].itemValue
            }
          }
        }
        return '-'
      },
      onQuery() {
        var url = this.Config.baseContext + "/mssq/mssqCatalog/selectCatalogList";
        this.searchFiled.type = this.catalogType;
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
      formatterState(row) {
        if((!this.isEmptyObject(this.busiType))&&this.busiType.ITEM_STATUS.length >0) {
          for (let i = 0; i < this.busiType.ITEM_STATUS.length; i++) {
            if (this.busiType.ITEM_STATUS[i].itemCode == row.status) {
              return this.busiType.ITEM_STATUS[i].itemValue
            }
          }
        }
      },
      search(type) {
        if(type == 'cz'){
          this.searchFiled.level = '';
          this.searchFiled.catalogName = '';
          this.searchFiled.catalogCode = '';
        }
        this.onQuery();
      },
      handleCurrentChange(val) {
        this.catalogParams.page = val;
        this.onQuery();
      },
      //编辑小项
      editMinor(id, val) {
        if ('addChildCata' == val) {//添加子项
          this.$router.push({
            path: '/catalog/minor_edit',
            query: {
              id: id,
              type: 'addChildCata'
            }
          });
        } else {
          this.$router.push({
            path: '/catalog/minor_edit',
            query: {
              id: id,
              type: 'edit'
            }
          });
        }

      },
      //查看子项
      viewMinor(row) {
        this.$router.push({
          path: '/catalog/minor_edit',
          query: {
            id: row.id,
            catalogId:row.catalogId,
            type: 'view'
          }
        });
      },
      //编辑主项
      editMajor(id) {
        if (this.isNotNull(id)) {
          this.$router.push({
            path: '/catalog/major_edit',
            query: {
              id: id,
              type: 'edit'
            }
          });
        } else {
          this.$router.push({
            path: '/catalog/major_edit',
            query: {
              type: 'edit'
            }
          });
        }

      },
      //查看主项
      viewMajor(row) {
        this.$router.push({
          path: '/catalog/major_edit',
          query: {
            id: row.id,
            catalogId:row.catalogId,
            type: 'view'
          }
        });
      },

      createItem(info) {
        let _this = this;
        var url = this.Config.baseContext + "/admin/itemQzqdVersion/verifyItem"
        this.$http_get(url, {"baseCode": info.code}).then(ret => {
          if (ret.state == 1) {
            _this.$router.push({
              path: '/sxsl/item',
              query: {
                catalogId: info.id,
                type: "edit",
              }
            });
          } else {
            this.$message.error(ret.message);
          }
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
    padding: 20px;
    .material-form{
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
      position: absolute;
      left: 0;
      right: 20px;
      bottom: 20px;
      background: #fff;
    }
  }

  .programme-btn {
    /deep/ .el-popover__reference-wrapper {
      padding: 0 10px;
    }
  }
</style>