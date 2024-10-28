<template>
  <div ref="tableH">
    <el-table
        :data="versionList"
        style="width: 100%"
        class="qz-table-hide">
      <el-table-column label="职责部门" prop="deptName" show-overflow-tooltip></el-table-column>
      <el-table-column label="事项名称" prop="itemName" show-overflow-tooltip></el-table-column>
      <el-table-column label="事项编码" prop="itemCode" show-overflow-tooltip></el-table-column>
      <el-table-column label="数据版本id" prop="id" show-overflow-tooltip></el-table-column>
      <el-table-column label="发布时间" prop="publishTime" width="200" :formatter="formatterDateTime"
                       show-overflow-tooltip></el-table-column>
      <el-table-column label="事项状态" prop="status" width="100" :formatter="dicForValue" show-overflow-tooltip
                       align="center">
        <template slot-scope="scope">
          <el-tag type="success"
                  v-if="scope.row.status == 'EXAMINE_SUCCESS' || scope.row.status == 'PUBLISH' || scope.row.status == 'DISCARD'">
            {{ dicForValue(scope.row) }}
          </el-tag>
          <el-tag v-if="scope.row.status == 'DRAF'">{{ dicForValue(scope.row) }}</el-tag>
          <el-tag type="danger" v-if="scope.row.status == 'EXAMINE_FAIL' || scope.row.status == 'ACCEPT_FAIL'">
            {{ dicForValue(scope.row) }}
          </el-tag>
          <el-tag type="warning" v-if="scope.row.status == 'EXAMINE_WAIT' || scope.row.status == 'ACCEPT_WAIT'">
            {{ dicForValue(scope.row) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="版本号" prop="version" width="80" show-overflow-tooltip></el-table-column>
      <el-table-column label="操作" width="120" align="right">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="view(scope.row.id)">查看</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="block">
      <el-pagination @current-change="handleCurrentChange" :current-page.sync="versionParams.page"
                     :page-size="versionParams.limit" layout="total,prev, pager, next, jumper"
                     :total="versionParams.total">
      </el-pagination>
    </div>
  </div>
</template>
<script>
import qzBase from '@_src/pages/mssq/common/util/qzBase';

export default {
  name: "item-version",
  mixins: [qzBase],
  data() {
    return {
      versionList: [],
      versionParams: {
        page: 1,
        limit: 10,
        total: 0
      },
      tableHeight: 500,
      statusDict: []
    }
  },
  props: {
    itemCode: {
      type: String,
      required: true
    }
  },
  mounted() {
    this.onQuery();
    this.queryDict("ITEM_STATUS", (ret) => {
      this.statusDict = ret['ITEM_STATUS'];
    })
  },
  methods: {
    onQuery() {
      var itemCode = this.itemCode;
      var param = Object.assign({}, this.versionParams, {"itemCode": itemCode});
      var url = this.Config.baseContext + "/mssq/mssqItemIndex/getPublishHistory";
      this.$http_post(url, param).then(ret => {
        if (ret.state == 1) {
          this.versionList = ret.rows;
          this.versionParams.total = ret.records;
        } else {
          this.$message.error(ret.message);
        }
      });
    },
    view(id) {
      let routeData = this.$router.resolve({
        path: "/item/info",
        query: {
          id: id,
          type: 'view'
        }
      });
      window.open(routeData.href, '_blank');
    },
    handleCurrentChange(val) {
      this.versionParams.page = val;
      this.onQuery()
    },
    dicForValue(row) {
      var status = row.status;
      var statusDict = this.statusDict;
      for (var i = 0; i < statusDict.length; i++) {
        if (statusDict[i].itemCode == status) {
          return statusDict[i].itemValue;
        }
      }
      return "";
    }
  }
}
</script>

<style scoped lang="less">

  .block {
    text-align: right;
    margin: 10px 15px;
    background: #fff;
  }
</style>