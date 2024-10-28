<template>
    <div>
        <el-table :data="circulationList" ref="singleTable" :style="{height:tableHeight}" style="width: 100%;" :height="tableHeight"
                  class="qz-table-hide">
            <el-table-column label="步骤" prop="orderIndex" width="50"></el-table-column>
            <el-table-column label="环节单位" prop="name" show-overflow-tooltip>
            </el-table-column>
            <el-table-column label="环节名称" prop="stepName"  show-overflow-tooltip></el-table-column>
            <el-table-column label="处理人" prop="optName" show-overflow-tooltip></el-table-column>
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
                let url = this.Config.baseContext+'/mssq/mssqCatalog/getAuditList';
                this.$http_post(url, {catalogId:catalogId}).then(ret => {
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
                        let status=row.stepCode;
                        if( status!=='PUBLISH'){ // 部门 审核通过 审核不通过 部门新增变更和提交
                            row.name='事项单位';
                            if (status==='APPROVAL_WAIT'){
                                row.name='审核单位';
                                ret.push(row);
                                if(i===rows.length){//部门已提交且尚未审核
                                    ret.push({optName: '', optTime: '', remark: '', stepName: '',name:'审核单位'});
                                }
                            }else if(status==='DRAF'){
                                ret.push(row);
                                if(i===rows.length){//部门新增 或 变更 （暂存） 且尚未提交
                                    ret.push({optName: '', optTime: '', remark: '', stepName: '',name:'审核单位'});
                                }
                            }else if(status==='EXAMINE_WAIT'){
                                row.name = '事项单位';
                                ret.push(row);
                                if(i===rows.length){//部门新增 或 变更 （暂存） 且尚未提交
                                    ret.push({optName: '', optTime: '', remark: '', stepName: '',name:'审核单位'});
                                }
                            }else if(status==='DELETE'){
                                row.stepName='取消';
                                ret.push(row);
                                if(i===rows.length){//部门已取消
                                    ret.push({optName: '', optTime: '', remark: '', stepName: '',name:'审核单位'});
                                }
                            }else if(status == 'DISCARD'){
                                row.stepName='废置';
                                ret.push(row);
                                if(i===rows.length){//废置
                                    ret.push({optName: '', optTime: '', remark: '', stepName: '',name:'审核单位'});
                                }
                            }else {
                                row.stepName='审核不通过';
                                ret.push(row);
                                if(i===rows.length){//部门审核不通过且未再次提交
                                    ret.push({optName: '', optTime: '', remark: '', stepName: '',name:'审核单位'});
                                }
                            }
                        }else if(status==='DRAF' || status==='SUBMIT'){ //审核单位新增 提交
                            row.name='审核单位';
                            ret.push(row);
                            if (status==='SUBMIT' && i===rows.length){ //已提交且尚未审核
                                ret.push({optName: '', optTime: '', remark: '', stepName: '',name:'审核单位'});
                            }else if (status==='DRAF' && i===rows.length) {
                                ret.push({optName: '', optTime: '', remark: '', stepName: '',name:'审核单位'});
                            }
                        } else if (status==='PUBLISH' || status==='ACCEPT_FAIL'){ //发布 审核不通过
                            row.name='审核单位';
                            ret.push(row);
                            if(i===rows.length ){//已发布且尚未变更
                                let falg=false;
                                for(let j=0;j<ret.length;j++){
                                    if(ret[j].name==='审核单位'){
                                        falg=true;
                                        break;
                                    }
                                }
                                if(falg){
                                    ret.push({optName: '', optTime: '', remark: '', stepName: '',name:'事项单位'});
                                }else {
                                    ret.push({optName: '', optTime: '', remark: '', stepName: '',name:'事项单位'});
                                }
                            }
                        }else if(status==='EXAMINE_SUCCESS' || status==='EXAMINE_FAIL'){
                            row.name='事项单位';
                            ret.push(row);
                            if(i===rows.length){//预审
                                ret.push({optName: '', optTime: '', remark: '', stepName: '',name:'审核单位'});
                            }
                        }
                    }
                }

                for (var i = 0;i < ret.length;i++) {
                    ret[i].orderIndex= i+1;
                }

                ret=ret.reverse();
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