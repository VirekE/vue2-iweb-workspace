<template>
    <div>
        <el-table :data="processList">
            <el-table-column label="步骤" prop="orderIndex" width="50"></el-table-column>
            <el-table-column label="环节单位" prop="name" show-overflow-tooltip>
            </el-table-column>
            <el-table-column label="环节名称" prop="stepName"  show-overflow-tooltip></el-table-column>
            <el-table-column label="处理人" prop="optName" show-overflow-tooltip></el-table-column>
            <el-table-column label="处理时间" prop="optTime" :formatter="formatterDateTime" show-overflow-tooltip></el-table-column>
            <el-table-column label="处理意见" prop="remark" show-overflow-tooltip></el-table-column>
            <!--<el-table-column prop="step" label="步骤" width="50" align="center"></el-table-column>
            <el-table-column prop="optOrgName" label="环节单位" width="200"> </el-table-column>
            <el-table-column prop="nextStepName" label="环节名称"></el-table-column>
            <el-table-column prop="optName" label="处理人" width="120"></el-table-column>
            <el-table-column prop="opinion" label="处理意见" width="120" align="right"></el-table-column>-->
        </el-table>
    </div>
</template>

<script>
  import qzBase from '@_src/pages/mssq/common/util/qzBase';

  export default {
        name: "circulation",
        mixins: [qzBase],
        data(){
            return{
                processList:[],
            }
        },
        props:{
            itemCode:{
                type:String,
                required: true
            },
        },
        mounted(){
            this.onQuery();
        },
        methods:{
            onQuery(){
                var itemCode = this.itemCode;
                var param = Object.assign({},this.processParams,{"itemCode":itemCode});
                var url = this.Config.baseContext + "/mssq/mssqItemIndex/getAuditList";
                this.$http_post(url, param).then(ret => {
                    if (ret.state == 1) {
                        this.tableData  = ret.rows;
                        this.processList=this.formatStatus(this.tableData);
                        // this.processParams.total = ret.records;
                    }else{
                        this.$message.error(ret.message);
                    }
                });
            },
            handleCurrentChange(val){
                this.processParams.page = val;
                this.onQuery()
            },
            formatStatus(rows){
                let ret=[];  //重新组装数据
                if(rows.length>0){
                    for(let i=1;i<=rows.length;i++){
                        let row=rows[i-1];
                        let status=row.stepCode;
                        if( status!=='PUBLISH' && status!=='ACCEPT_FAIL'){ // 部门 预审通过 预审不通过 部门新增变更和提交
                            row.name='事项单位';
                                if (status==='ACCEPT_WAIT'){
                                    row.stepName = '预审通过';
                                    ret.push(row);
                                    if(i===rows.length){//部门已提交且尚未审核
                                        ret.push({optName: '', optTime: '', remark: '', stepName: '',name:'审核单位'});
                                    }
                                }else if(status==='DRAF'){
                                    ret.push(row);
                                    if(i===rows.length){//部门新增 或 变更 （暂存） 且尚未提交
                                        ret.push({optName: '', optTime: '', remark: '', stepName: '',name:'事项单位'});
                                    }
                                }else if(status==='SUBMIT'){
                                    if(row.nextStep == "EXAMINE_WAIT"){
                                        row.name = '事项单位';
                                        ret.push(row);
                                        if (status==='SUBMIT' && i===rows.length){ //已提交且尚未审核
                                            ret.push({optName: '', optTime: '', remark: '', stepName: '',name:'事项单位'});
                                        }else if (status==='DRAF' && i===rows.length) {
                                            ret.push({optName: '', optTime: '', remark: '', stepName: '',name:'事项单位'});
                                        }
                                    }else{
                                        row.name = '事项单位';
                                        ret.push(row);
                                        if (status==='SUBMIT' && i===rows.length){ //已提交且尚未审核
                                            ret.push({optName: '', optTime: '', remark: '', stepName: '',name:'审核单位'});
                                        }else if (status==='DRAF' && i===rows.length) {
                                            ret.push({optName: '', optTime: '', remark: '', stepName: '',name:'事项单位'});
                                        }
                                    }
                                }else if(status==='DELETE'){
                                    row.stepName='取消';
                                    ret.push(row);
                                    if(i===rows.length){//部门已取消
                                        ret.push({optName: '', optTime: '', remark: '', stepName: '',name:'事项单位'});
                                    }
                                }else if(status==='DISCARD'){
                                    row.stepName='废置';
                                    ret.push(row);
                                    if(i===rows.length){//部门预审不通过且未再次提交
                                        ret.push({optName: '', optTime: '', remark: '', stepName: '',name:'事项单位'});
                                    }
                                }else {
                                    row.stepName='预审不通过';
                                    ret.push(row);
                                    if(i===rows.length){//部门预审不通过且未再次提交
                                        ret.push({optName: '', optTime: '', remark: '', stepName: '',name:'事项单位'});
                                    }
                                }
                            }else if(status==='DRAF' || status==='SUBMIT'){ //科室新增 提交
                                row.name='事项单位';
                                ret.push(row);
                                if (status==='SUBMIT' && i===rows.length){ //已提交且尚未审核
                                    ret.push({optName: '', optTime: '', remark: '', stepName: '',name:'事项单位'});
                                }else if (status==='DRAF' && i===rows.length) {
                                    ret.push({optName: '', optTime: '', remark: '', stepName: '',name:'事项单位'});
                                }
                            } else if (status==='PUBLISH' || status==='ACCEPT_FAIL'){ //发布 审核不通过
                                row.name='审核单位';
                                ret.push(row);
                                if(i===rows.length ){//已发布且尚未变更
                                    let falg=false;
                                    for(let j=0;j<ret.length;j++){
                                        if(ret[j].name==='事项单位'){
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
                            }
                    }
                }

                for (var i = 0;i < ret.length;i++) {
                    ret[i].orderIndex= i+1;
                }

                ret=ret.reverse();
                return ret;
            }
        }
    }
</script>

<style scoped>

</style>