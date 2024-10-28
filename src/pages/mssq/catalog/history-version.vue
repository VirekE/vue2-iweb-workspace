<template>
    <div>
        <el-table :data="historyList" ref="singleTable" :style="{height:tableHeight}" style="width: 100%;" :height="tableHeight"
                  class="qz-table-hide">
            <el-table-column type="index" label="排序" width="50"></el-table-column>
            <el-table-column label="三级分类（事件描述）" prop="catalogName" show-overflow-tooltip></el-table-column>
            <el-table-column label="三级索引码" prop="catalogCode" show-overflow-tooltip></el-table-column>
            <el-table-column label="状态" prop="status" :formatter="formatterState">
                <template slot-scope="scope">
                    <el-tag type="success" v-if="scope.row.status == 'EXAMINE_SUCCESS' || scope.row.status == 'PUBLISH' || scope.row.status == 'DISCARD'">{{formatterState(scope.row)}}</el-tag>
                    <el-tag v-if="scope.row.status == 'DRAF'">{{formatterState(scope.row)}}</el-tag>
                    <el-tag type="danger" v-if="scope.row.status == 'EXAMINE_FAIL' || scope.row.status == 'APPROVAL_FAIL'">{{formatterState(scope.row)}}</el-tag>
                    <el-tag type="warning" v-if="scope.row.status == 'EXAMINE_WAIT' || scope.row.status == 'APPROVAL_WAIT'">{{formatterState(scope.row)}}</el-tag>
                </template>
            </el-table-column>
            <el-table-column label="版本" prop="version"></el-table-column>
            <el-table-column label="事项层级" prop="level" :formatter="formatterLevel"></el-table-column>
            <el-table-column label="操作" width="100px" align="right">
                <template slot-scope="scope">
                    <el-button type="text" @click="view(scope.row)">查看</el-button>
                </template>
            </el-table-column>
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
        name: "history-version",
        mixins: [qzBase],

        data() {
            return {
                busiType:{},
                tableHeight: 100,
                historyList: [],
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
            },
          cataLogInfo:{
            type:Object,
            default: ()=>{}
          }
        },
        watch: {
            parentHeight(val) {
                this.tableHeight = val - 100 + 'px!important';
            },
          cataLogInfo:{
            handler(val){
              if(val&&val.catalogId && !this.$route.query.catalogId){
                this.getData();
              }
            },
            deep:true,
            immediate: true
          }
        },
        mounted() {
            this.queryDict("BUSI_TYPE,SSCJ,ITEM_STATUS,ITEM_STATUS",res=>{
                this.busiType = res;
            });
          if(this.$route.query.catalogId){
            this.getData();
          }
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
              let catalogId = this.$route.query.catalogId;
              if(!catalogId){
                catalogId = this.cataLogInfo.catalogId
              }
                let url =this.Config.baseContext+ '/mssq/mssqCatalog/getPublishHistory';
                this.$http_post(url, {
                    catalogId:catalogId,
                    page:this.circulationParams.page,
                    limit:this.circulationParams.limit
                }).then(ret => {
                    if (ret.state == 1) {
                        this.historyList = ret.rows;
                        this.circulationParams.records = ret.records;
                    } else {
                        this.$message.error(ret.message);
                    }
                });
            },
            handleCurrentChange(data) {
                this.circulationParams.page = data;
                this.getData();
            },
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
            formatterState(row){
                if((!this.isEmptyObject(this.busiType))&&this.busiType.ITEM_STATUS.length >0) {
                    for (let i = 0; i < this.busiType.ITEM_STATUS.length; i++) {
                        if (this.busiType.ITEM_STATUS[i].itemCode == row.status) {
                            return this.busiType.ITEM_STATUS[i].itemValue
                        }
                    }
                }
            },
            view(row){
                let routeData = this.$router.resolve({
                    path: '/catalog/minor_edit',
                    query: {
                        id: row.id,
                        catalogId: row.catalogId,
                        type: 'view',
                        version:row.version,
                        pageType:'history',
                    }
                });
                window.open(routeData.href, '_blank');
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