<template>
  <!-- 材料管理 -->
  <div class="cardBox" ref="tableH">
    <div class="search-box">
      <Search :fieldData="fieldData" ref="srarch" @searchClick="searchClick"></Search>
    </div>
    <el-table :data="dirList" style="width: 100%" height="100%" class="qz-table-hide">
      <el-table-column align="center" label="同步状态" width="90">
        <template slot-scope="scope">
          <i class="table-status" :class="formatStatus(scope.row)"></i>
        </template>
      </el-table-column>
      <el-table-column label="系统名称" prop="signName"
                       show-overflow-tooltip></el-table-column>
      <el-table-column label="系统编码" prop="signCode"
                       show-overflow-tooltip></el-table-column>
      <el-table-column label="上下文" prop="targetUri"
                       show-overflow-tooltip></el-table-column>
      <el-table-column label="状态" prop="callStatus" align="center"
                       show-overflow-tooltip>
        <template slot-scope="scope">
          <el-tag v-if="scope.row.callStatus == '0'" type="danger">失败</el-tag>
          <el-tag v-if="scope.row.callStatus == '1'" type="success">成功</el-tag>
          <el-tag v-if="!scope.row.callStatus" type="warning">异常数据</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="时间" prop="callTime" :formatter="formatterDateTime"
                       show-overflow-tooltip></el-table-column>
      <el-table-column label="操作" width="90" align="right">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="goDetail('dir', scope.row)">查看详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="block">
      <el-button type="text" icon="el-icon-refresh" @click="refresh('dir')">刷新</el-button>
      <el-pagination
              @current-change="dirHandleCurrentChange"
              :current-page.sync="dirParams.page"
              :page-size="dirParams.limit"
              layout="total,prev, pager, next, jumper"
              :total="dirParams.total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
  import qzBase from '@_src/pages/mssq/common/util/qzBase'

  export default {
    components: {},

    name: "material-manage",

    mixins: [qzBase],

    data() {
      return {
        //配置搜索
        fieldData: {
          signName: {
            label: '系统名称',
            type: 'Input',
            placeholder: '请输入系统名称',
            value: '',
            span: 10,
            itemWidth: '100px',
          },
          targetUri: {
            label: '上下文',
            type: 'Input',
            placeholder: '请输入上下文',
            value: '',
            span: 7,
          },
          signCode: {
            label: '系统编码',
            type: 'Input',
            placeholder: '请输入系统编码',
            value: '',
            span: 7,
            width: '90%'
          },
          time: {
            label: '时间',
            type: 'DatePicker',
            placeholder: '请选择时间',
            types: 'datetimerange',
            itemWidth: '60px',
            value: '',
            valueFormat: 'yyyy-MM-dd HH:mm:ss',
            span: 10,
          },
          callStatus: {
            label: '状态',
            type: 'Select',
            placeholder: '请选择状态',
            value: '',
            selectList: [{
              name: '成功',
              id: '1'
            }, {
              name: '失败',
              id: '0'
            }],
            span: 7,
          },
          Button: {
            type: 'Button',
            span: 7
          }
        },
        //实施清单查询条件
        itemInline: {
          targetUri: '',
          signCode: '',
          startTime:'',
          endTime:''
        },
        //通用目录查询条件
        dirInline: {
          state: '',
          way: '',
          date: ''
        },
        //表高
        tableHeight: 100,
        //通用目录列表数据
        dirList: [],
        //实施清单列表数据
        itemList: [],
        //实施清单翻页
        itemParams: {
          page: 1,
          limit: 10,
          total: 0
        },
        //通用目录翻页
        dirParams: {
          page: 1,
          limit: 10,
          total: 0
        },
        //tab下标
        tabIndex: 0
      }
    },

    mounted() {
      if(this.$route.path != this.$store.getters.searchParams.path) this.$store.dispatch("setSearchParams", {});
      if (!this.isEmptyObject(this.$store.getters.searchParams.data)) {
        this.$nextTick(() => {
          this.activeName = this.$store.getters.searchParams.data.regionCode;
          this.$refs.srarch.update('signCode', this.$store.getters.searchParams.data.signCode, false);
          this.$refs.srarch.update('callStatus', this.$store.getters.searchParams.data.callStatus, false);
          this.$refs.srarch.update('signName', this.$store.getters.searchParams.data.signName, false);
          if(this.$store.getters.searchParams.startTime && this.$store.getters.searchParams.data.endTime){
            this.$refs.srarch.update('time', [this.$store.getters.searchParams.data.startTime, this.$store.getters.searchParams.data.endTime], false);
          }
          this.$refs.srarch.update('targetUri', this.$store.getters.searchParams.data.targetUri, false);
          this.itemInline = this.$store.getters.searchParams.data;
          this.itemParams = this.$store.getters.searchParams.data;
          this.search();
          this.$store.dispatch("setSearchParams", {});
        })
      } else {
        var pageParam = this.itemParams
        var searchParam = this.formInline
        this.search();
      }
      //表格高度自适应
      this.$nextTick(() => {
        this.tableHeight = this.$refs.tableH.offsetHeight - 210;
      });
      window.onresize = () => {
        return (() => {
          this.tableHeight = this.$refs.tableH.offsetHeight - 210;
        })();
      };
      // this.search();
      //获取列表数据
    },
    methods: {
      //计算
      calSum(row) {
        return row.reqNum - row.resultNum;
      },

      //tab点击事件
      tabClick(tab, event) {
        this.tabIndex = tab.index;
        if (tab.index == 0) {
          this.search('item');
        } else if (tab.index == 1) {
          this.search('dir');
        }
      },

      //跳转详情页
      goDetail(type, row) {
        this.$store.dispatch("setSearchParams", {path:this.$route.path,data:Object.assign(this.itemInline,{page:this.itemParams.page,limit:this.itemParams.limit})});
        this.$router.push({
          path: 'managementRegion',
          query: {
            id: row.id,
            type: type
          }
        });
      },

      //表格状态样式
      formatStatus(row) {
        if (row.callStatus == "1") {
          return "status-normal";
        }
        return "status-abnormal";
      },

      //表格状态样式
      formatPullType(row) {
        if (row.pullType == "1") {
          return "增量";
        }
        if (row.pullType == "2") {
          return "单条";
        }
        return "";
      },

      //格式化解析状态
      formatParseStatus(row) {
        if (row.parseStatus == 0) {
          return "失败";
        } else if (row.parseStatus == 1) {
          return "成功";
        } else {
          return '数据异常'
        }
      },

      //查询
      search() {
        let url = this.Config.baseContext + "/mssq/mssqCall/getCallList";
        const rLoading = this.openLoading();
        this.$http_post(url, {
          page: this.itemParams.page,
          limit: this.itemParams.limit,
          signCode: this.itemInline.signCode,
          targetUri: this.itemInline.targetUri,
          callStatus: this.itemInline.callStatus,
          signName: this.itemInline.signName,
          startTime: this.itemInline.startTime,
          endTime: this.itemInline.endTime,
        }).then(ret => {
          rLoading.close();
          if (ret.state == 1) {
            this.dirList = ret.rows;
            this.dirParams.total = ret.records;
          } else {
            this.$message.error(ret.message);
          }
        }).catch(err => {
          rLoading.close();
          console.log(err);
        });
      },

      //页面搜索
      searchClick(val) {
        this.itemInline = {
          signCode: val.signCode.value,
          callStatus: val.callStatus.value,
          signName: val.signName.value,
          startTime: val.time.value[0],
          endTime: val.time.value[1],
          targetUri: val.targetUri.value,
        };
        this.search();
      },

      //通用目录翻页
      dirHandleCurrentChange(val) {
        this.dirParams.page = val;
        this.search('dir');
      },

      //实施清单翻页
      itemHandleCurrentChange(val) {
        this.itemParams.page = val;
        this.search('item');
      },

      //刷新
      refresh(type) {
        if (type == 'dir') {
          this.dirParams.page = 1;
          this.search(type);
        } else {
          this.itemParams.page = 1;
          this.search(type);
        }
      }

    }
  }
</script>

<style scoped lang="less">
  .cardBox {
    flex: 1;
    display: flex;
    flex-direction: column;
    height: calc(100% - 200px);
    background: #fff;
    padding: 0px 14px;

    .search-box {
      background: #fff;
      margin-bottom: 10px;
      width: 100%;
      padding: 10px 14px 0 14px;
    }

    .block {
      display: flex;
      background: #fff;
      justify-content: space-between;
      padding: 10px 0;
    }
  }

  .status-normal {
    color: #67c23a
  }

  .status-abnormal {
    color: #f56c6c
  }

  .table-status {
    font-style: normal;

    &:after {
      content: "\25CF";
      font-size: 26px;
      margin-top: -14px;
      display: inline-block;
      position: absolute;
    }
  }
</style>