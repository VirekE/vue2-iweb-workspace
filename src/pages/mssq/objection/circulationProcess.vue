<template>
    <div>
        <el-table :data="circulationList" ref="singleTable" :style="{height:tableHeight}" style="width: 100%;" :height="tableHeight"
                  class="qz-table-hide">
            <el-table-column label="步骤" prop="orderIndex" width="50"></el-table-column>
            <el-table-column label="环节单位" prop="name" show-overflow-tooltip>
            </el-table-column>
            <el-table-column label="环节名称" prop="statusName"  show-overflow-tooltip></el-table-column>
            <el-table-column label="处理单位" prop="optOrgName" show-overflow-tooltip></el-table-column>
            <el-table-column label="处理人" prop="optUserName" show-overflow-tooltip></el-table-column>
            <el-table-column label="处理时间" prop="optTime" :formatter="formatterDateTime" show-overflow-tooltip></el-table-column>
            <el-table-column label="处理意见" prop="remark" show-overflow-tooltip></el-table-column>
        </el-table>
       <!-- <div class="block">
            <el-pagination
                    @current-change="handleCurrentChange"
                    :current-page.sync="circulationParams.page"
                    :page-size="circulationParams.limit"
                    layout="total,prev, pager, next, jumper"
                    :total="circulationParams.total">
            </el-pagination>
        </div>-->
    </div>
</template>

<script>
  import qzBase from '@_src/pages/mssq/common/util/qzBase';

  export default {
        mixins: [qzBase],

        name: "circulationProcess",
        data() {
            return {
                tableHeight: 100,
                circulationList: [],
                circulationParams: {
                    page: 1,
                    limit: 10,
                    total: 0
                },
            }
        },
        props: {
            parentHeight: {
                type: Number,
                default: 0
            }
        },
        watch: {
            parentHeight(val) {
                this.tableHeight = val - 100 + 'px!important';
            },
        },
        mounted() {
            this.getData();
            this.$nextTick(() => {
                this.$emit('childHeight');
            });
            window.onresize = () => {
                return (() => {
                    this.$emit('childHeight');
                })();
            };
        },
        methods: {
            getData() {
                let url = this.Config.baseContext+'/mssq/mssqItemDissent/dissentFlow';
                this.$http_post(url, {dissentId:this.$route.query.id}).then(ret => {
                    if (ret.state == 1) {
                        this.circulationList = this.formatStatus(ret.rows);
                        this.circulationParams.total = ret.records;
                    } else {
                        this.$message.error(ret.message);
                    }
                });
            },
            formatStatus(rows){
                let ret=[];  //重新组装数据
                if(rows.length>0){
                    for(let i=1;i<=rows.length;i++){
                        let row=rows[i-1];
                        let statusName=row.statusName;
                        row.name = ''
                      console.log(row,'流转过程');
                      let name , nextName = '';
                      if(row.optRole == 'QBMLR'){
                        name = '区单位'
                        nextName = '区事项审核单位'
                      }else if(row.optRole == 'BMLR'){
                        name = '市单位'
                        nextName = '市事项审核单位'
                      }else if(row.optRole == 'QKSLR'){
                        name = '区单位'
                        nextName = '区事项审核单位'
                      }else if(row.optRole == 'KSLR'){
                        name = '市单位'
                        nextName = '市事项审核单位'
                      }else if(row.optRegion != '440301' && row.optRole == 'ZSJSH'){
                        name = '区事项审核单位'
                        nextName = '区职责管理单位'
                      }else if(row.optRegion != '440301' && row.optRole == 'ZSJBB'){
                        name = '区职责管理单位'
                        nextName = '市事项审核单位'
                      }else if(row.optRegion == '440301' && row.optRole == 'ZSJSH'){
                        name = '市事项审核单位'
                        nextName = '市职责管理单位'
                      }else if(row.optRegion == '440301' && row.optRole == 'ZSJBB'){
                        name = '市职责管理单位'
                        nextName = ''
                      }
                      row.name = name;
                      ret.push(row);
                      if(nextName && i===1 && row.status == 1){
                        // ret.unshift({optName: '', optTime: '', remark: '', stepName: '',name:nextName});
                      }
                    }
                }

                for (var i = 0;i < ret.length;i++) {
                    ret[i].orderIndex= i+1;
                }

                // ret=ret.reverse();
                return ret;
            },
            handleCurrentChange(data) {
                this.circulationParams.page = data;
                this.getData();
            },
        },
        destroyed() {
            window.onresize = null;
        },
    }
</script>

<style scoped lang="less">
    /deep/.el-table {
       .el-table__body-wrapper.is-scrolling-none{
           height: calc( 100% - 48px)!important;
           overflow: auto;
       }
    }

    .block {
        text-align: end;
    }
</style>