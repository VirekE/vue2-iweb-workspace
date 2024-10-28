<template>
    <div class="content" ref="tableH">
        <el-form :inline="true" size="small">
            <div class="flex-sb">
                <div>
                    <el-form-item label="字典编码">
                        <el-input v-model="params.dictCode" placeholder=""></el-input>
                    </el-form-item>
                    <el-form-item label="字典名称">
                        <el-input v-model="params.dictName" placeholder=""></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" icon="el-icon-search" @click="onSearch">查询</el-button>
                    </el-form-item>
                </div>
                <el-form-item class="programme-btn">
                    <el-button size="small" icon="el-icon-plus" @click="onAdd">新增</el-button>
                    <el-button type="warning" size="small" icon="el-icon-remove-outline"  @click="onClearCache">清理缓存</el-button>
                </el-form-item>
            </div>
        </el-form>
        <div class="tab-box">
            <el-table :data="dataList"  @selection-change="handleSelectionChange" :height="tableHeight" class="qz-table-hide">
                <el-table-column type="selection" width="55"></el-table-column>
                <el-table-column prop="dictCode" label="字典编码" width="250"></el-table-column>
                <el-table-column prop="dictName" label="字典名称" width="300"></el-table-column>
                <el-table-column prop="description" label="描述"></el-table-column>
                <el-table-column label="操作" width="175" align="right">
                    <template slot-scope="scope">
                        <el-button type="text" size="small" @click="onEdit(scope.row)">编辑</el-button>
                        <el-button type="text" size="small" @click="onDelete(scope.row)">删除</el-button>
                        <el-button type="text" size="small" @click="onEditDictItem(scope.row.dictCode)">查看数据项</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="block">
                <el-pagination
                        @current-change="onPageClick"
                        :current-page.sync="params.page"
                        :page-size="params.rows"
                        layout="total,prev, pager, next, jumper"
                        :total="records">
                </el-pagination>
            </div>
        </div>
        <el-dialog
                :title="dialogIsEdit ? '编辑字典':'添加字典'"
                :visible.sync="dialogVisible"
                :close-on-click-modal=false
                width="60%" height="80%"
                class="qz-dialog-padding">
            <DictEdit :data="selectRow" :isEdit="dialogIsEdit" ref="dictEdit" @close="dialogVisible = false;onQuery()"/>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="()=>{$refs.dictEdit.onSave()}">保存</el-button>
                <el-button @click="dialogVisible = false">关闭</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import DictEdit from './dict-edit';
    import qzBase from '@_src/pages/mssq/common/util/qzBase';
    export default {
        mixins: [qzBase],
        components: {DictEdit},
        data(){
            return{
                dataList: [],
                records: 1,
                params: {
                    page: 1,
                    rows: 9
                },
                dataArray: null,

                dialogVisible: false,
                dialogIsEdit: false,
                selectList: [],
                selectRow: {},
                tableHeight:100
            }
        },
        props:{

        },
        computed: {

        },
        watch:{
            dataArray(val){
                if(!this.isEmptyObject(val)){
                    if(val.length > 2){
                        val.splice(0, 1);
                    }
                    if(val.length === 2){
                        var start = val[0];
                        var end = val[1];
                        if(start > end){
                            val[0] = end;
                            val[1] = start;
                        }
                    }

                }
            }
        },
        methods:{
            formatterStatus(row,col){
                var status = row.isUse;
                if(status === '1'){
                    return '是'
                }else{
                    return '否'
                }
            },
            formattterDate(row,col){
                var property = col.property;
                var val = row[property]
                return this.formatDate(val,'yyyy-MM-dd HH:mm:ss')
            },
            handleSelectionChange(val) {
                console.info(val);
                this.selectList = val;
            },
            onAdd(){
                this.selectRow = {};
                this.dialogIsEdit = false;
                this.dialogVisible = true;
            },
            onEdit(row){
                /*var selectList = this.selectList;
                if(this.isEmptyObject(selectList)){
                  this.$message("请选择一条记录")
                }else if(selectList.length > 1){
                  this.$message("请选择一条记录")
                }else{
                  this.selectRow = selectList[0];
                  this.dialogIsEdit = true;
                  this.dialogVisible = true;
                }*/
                this.selectRow = row;
                this.dialogIsEdit = true;
                this.dialogVisible = true;
            },
            onEditDictItem(dictCode){
                this.$router.push({
                    path: '/dict/item_list',
                    query: {
                        dictCode: dictCode
                    }
                });
            },
            onClearCache(){
                this.$confirm('清理后，字典更改将立即生效', '确认清理数据字典缓存?', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    showCancelButton: true,
                }).then(() => {
                    var url = this.Config.baseContext + "/mssq/pubDict/clearCache"
                    this.$http_get(url, {}).then(ret => {
                        if (ret.state == 1) {
                            this.$message.success(ret.message);
                        }else{
                            this.$alert(ret.message)
                        }
                    });
                }).catch(action => {});
            },
            onClearDeptCache(){
                this.$confirm('清理后，字典更改将立即生效', '确认清理数据字典部门缓存?', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    showCancelButton: true,
                }).then(() => {
                    var url = this.Config.baseContext + "/admin/pubDict/clearCacheDept";
                    this.$http_post(url, {}).then(ret => {
                        if (ret.state == 1) {
                            this.$message.success(ret.message);
                        }else{
                            this.$alert(ret.message)
                        }
                    });
                }).catch(action => {});
            },
            onDelete(row){
                var selectRow = row;
                var url = this.Config.baseContext + "/mssq/pubDict/deleteDict";
                this.$alert('一但删除，将无法恢复', '确定删除该字典项?', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    showCancelButton: true,
                }).then(() => {
                    this.$http_post(url, {dictCode: selectRow.dictCode}).then(ret => {
                        if (ret.state == 1) {
                            this.$message.success("删除成功");
                            this.onQuery();
                        }else{
                            this.$alert(ret.message)
                        }
                    });
                }).catch(action => {});
            },
            // 搜索功能
            onSearch() {
                this.params.page = 1;
                this.onQuery();
            },
            // 切换页数
            onPageClick(val) {
                this.params.page = val;
                this.onQuery();
            },
            onQuery(){
                var params = this.params;
                const rLoading = this.openLoading();
                var url = this.Config.baseContext + "/mssq/pubDict/getDictList";
                this.$http_post(url, params).then(ret => {
                    if (ret.state == 1) {
                        let rows = ret.rows;
                        this.dataList = rows;
                        this.records  = ret.records;
                    }else{
                        this.$alert(ret.message)
                    }
                    rLoading.close();
                });
            },
        },
        mounted() {
            //表格高度自适应
            this.$nextTick(() => {
                this.tableHeight = this.$refs.tableH.offsetHeight - 150;
            });
            window.onresize = () => {
                return (() => {
                    this.tableHeight = this.$refs.tableH.offsetHeight - 150;
                })();
            };
            this.onQuery();
        }
    };
</script>

<style lang="less" scoped>
    .content{
        position: relative;
        height: 100%;
        display: flex;
        flex-direction: column;
        background: #f8f8f8;
        .el-form{
            background: #fff;
            margin-bottom: 10px;
            width: 100%;
            /*display: flex;*/
            padding: 10px 14px 0 14px;
            .programme-btn{
                margin-right: 0;
            }
        }
        .block{
            text-align: right;
            background: #fff;
        }
    }
    .tab-box{
        flex:1;
        height: calc(100% - 200px);
        background:#fff;
        padding:0px 14px;
        .block{
            width:100%;
            padding:10px 0;
        }
    }
</style>