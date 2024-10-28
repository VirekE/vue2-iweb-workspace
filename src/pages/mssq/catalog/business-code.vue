<template>
    <div>
        <el-form :inline="true" size="small">
            <div class="flex-sb">
                <div>
                    <el-form-item label="部门编码">
                        <el-input v-model="businessParams.itemCode"></el-input>
                    </el-form-item>
                    <el-form-item label="部门名称">
                        <el-input v-model="businessParams.itemValue"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" icon="el-icon-search" @click="onSearch">查询</el-button>
                    </el-form-item>
                </div>
            </div>
        </el-form>
        <el-table :data="BUSINESS_CODE"
                  style="width: 100%"
                  :height="tableHeight"
                  @selection-change="handleSelectionChange"
                  ref="cerTable"
                  class="qz-table-hide">
            <el-table-column type="selection"></el-table-column>
            <el-table-column label="部门编码" prop="itemCode" show-overflow-tooltip></el-table-column>
            <el-table-column label="部门名称" prop="itemValue" width="210" show-overflow-tooltip></el-table-column>
        </el-table>
        <div class="block" style="margin-left: 180px">
            <el-pagination
                    @current-change="handleCurrentChange"
                    :current-page.sync="businessParams.page"
                    :page-size="businessParams.rows"
                    layout="total,prev, pager, next, jumper"
                    :total="businessParams.total">
            </el-pagination>
        </div>
    </div>
</template>
<script>
    import qzBase from '@_src/pages/mssq/common/util/qzBase';
    export default{
        mixins: [qzBase],
        data(){
            return{
                BUSINESS_CODE:[],
                tableHeight:200,
                businessParams:{
                    page:1,
                    rows:8,
                    total:0
                }
            }
        },
        props:{

        },
        mounted(){
            this.onQuery(this.businessParams)
        },

        methods:{
            onSearch(){
                this.businessParams = {
                    ITEM_CODE:this.businessParams.itemCode,
                    ITEM_VALUE:this.businessParams.itemValue,
                    page:1,
                    rows:10
                };
                this.onQuery(this.businessParams);
            },
            onQuery(params){
                const rLoading = this.openLoading();
                params.DICT_CODE = "BUSINESS_CODE";
                var url = this.Config.baseContext + "/admin/pubDict/getDictItemList"
                this.$http_post(url, params).then(ret => {
                    if (ret.state == 1) {
                        let rows = ret.rows;
                        this.BUSINESS_CODE = rows;
                        this.businessParams.total = ret.records;
                    }else{
                        this.$alert(ret.message)
                    }
                    rLoading.close();
                });
            },
            handleCurrentChange(val){
                this.businessParams.page = val;
                this.onQuery(this.businessParams);
            },
            handleSelectionChange(val) {//选择
                let ret = val;
                if(ret.length>1){
                    this.$message("请选择一条记录")
                }else {
                    this.$emit("results",ret);
                }
            }
        }
    }
</script>
<style lang="less" scoped>
    .addMaterial{
        /deep/ .el-form-item{
            position: relative;
            .el-form-item__label{
                line-height:20px;
                display: flex;
                justify-content: flex-end;
                align-items: center;
                height: 100%;
                position: absolute;
            }
            .el-checkbox-group{
                position:relative;
                top:3px;
            }
            .el-form-item__content{
                line-height:15px;
            }
        }
        .el-card{
            border-top:1px solid #e2e2e2;
            /deep/.el-card__header{
                padding:0px 20px;
                div{
                    display:flex;
                    align-items:center;
                    justify-content:space-between;
                    .icon-icon02{
                        margin-right:5px;
                    }
                }
            }
            /deep/.el-card__body{
                padding:0;
                table{
                    tr:last-child{
                        td{
                            border-bottom:none;
                        }
                    }
                }
                .el-table--border{
                    border:none;
                }
                .el-table th.is-leaf{
                    border-color:#e2e2e2;
                    background:#f5f7fa;
                }
                .el-table::before{
                    height:0;
                }
            }
        }

    }
    .box-card{
        margin-bottom:20px;
    }
    .textTop{
        /deep/.el-form-item__label{
            align-items:initial!important;
            padding-top:8px;
        }
    }
    .el-select{
        width:100%;
    }
</style>