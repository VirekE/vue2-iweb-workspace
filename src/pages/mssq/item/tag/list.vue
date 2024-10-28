<template>
    <div class="content" ref="tableH">
        <el-form :inline="true" size="small">
            <div class="flex-sb">
                <div>
                    <el-form-item label="标签编码">
                        <el-input v-model="params.code" placeholder=""></el-input>
                    </el-form-item>
                    <el-form-item label="标签名称">
                        <el-input v-model="params.name" placeholder=""></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" icon="el-icon-search" @click="onSearch">查询</el-button>
                    </el-form-item>
                </div>
                <el-form-item class="programme-btn">
                    <el-button size="small" icon="el-icon-plus" @click="onAdd">新增</el-button>
                </el-form-item>
            </div>
        </el-form>
        <el-table :data="dataList"  @selection-change="handleSelectionChange" :height="tableHeight" class="qz-table-hide">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column prop="code" label="标签编码" width="150"></el-table-column>
            <el-table-column prop="name" label="标签" align="center">
                <template slot-scope="scope">
                    <tag :content="scope.row.name" :bgColor="scope.row.color"></tag>
                </template>
            </el-table-column>
            <el-table-column prop="description" label="描述" width="300px"></el-table-column>
            <el-table-column prop="status" :formatter="formatterStatus" label="是否有效" width="80" align="center"></el-table-column>
            <el-table-column label="操作" width="175" align="right">
                <template slot-scope="scope">
                    <el-button type="text" size="small" @click="onEdit(scope.row)">编辑</el-button>
                    <el-button type="text" size="small" @click="onDelete(scope.row)">删除</el-button>
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
        <el-dialog
                :title="dialogIsEdit ? '编辑标签':'添加标签'"
                :visible.sync="dialogVisible"
                :close-on-click-modal=false
                width="60%" height="80%"
                class="qz-dialog-padding">
            <el-form :model="tagData" ref="form" :rules="rules">
                    <el-form-item label="标题" prop="name">
                        <el-input v-model="tagData.name"></el-input>
                    </el-form-item>
                    <el-form-item label="编码" prop="code">
                        <el-input v-model="tagData.code"></el-input>
                    </el-form-item>
                    <el-row>
                        <el-col :span="24">
                            <el-form-item label="背景颜色" prop="color" class="color">
                                <el-color-picker
                                        v-model="tagData.color"
                                        :predefine="predefineColors"
                                        @active-change="colorChange">
                                </el-color-picker>
                                <template v-for="item in predefineColors">
                                    <div class="defaultColor" :style="{background:item}" @click="tagData.color = item"></div>
                                </template>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-form-item label="描述">
                        <el-input v-model="tagData.description" type="textarea" :rows="3"></el-input>
                    </el-form-item>
            </el-form>
             <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="onSave">保存</el-button>
                <el-button @click="dialogVisible = false">关闭</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import qzBase from '@_src/pages/mssq/common/util/qzBase';
    import tag from '../../components/tag';
    export default {
        mixins: [qzBase],
        components: {tag},
        data(){
            var checkCode = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入编码'));
                } else{
                    var url = this.Config.baseContext + "/mssq/mssqLabel/verifyCode";
                    this.$http_post(url, {
                        code:value,
                        id:this.tagData.id || '',
                    }).then(ret => {
                        if (ret && !ret.state) {
                            callback();
                        }else if(!ret && !ret.state){
                            callback(new Error('编码重复'));
                        }else if(ret && ret.state == 0){
                            callback(new Error(ret.message));
                        }
                        rLoading.close();
                    });
                }
            };
            return{
                dataList: [],
                records: 1,
                params: {
                    code:'',
                    name:'',
                    page: 1,
                    rows: 9
                },
                dataArray: null,
                predefineColors: [
                    '#ff4500',
                    '#ff8c00',
                    '#ffd700',
                    '#90ee90',
                    '#00ced1',
                    '#1e90ff'
                ],
                tagData:{
                    color:'#1e90ff'
                },
                dialogVisible: false,
                dialogIsEdit: false,
                selectList: [],
                selectRow: {},
                tableHeight:100,
                rules:{
                    name: [
                        { required: true, message: '请输入标题', trigger: 'blur' }
                    ],
                    code:[ { required: true, validator: checkCode, trigger: 'blur' }],
                    color: [
                        { required: true, message: '请选择标签背景颜色', trigger: 'change' }
                    ]
                }
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
                this.tagData = {
                    id:'',
                    color:'#1e90ff',
                    name:'',
                    code:'',
                    description:''
                };
                this.dialogIsEdit = false;
                this.dialogVisible = true;
            },
            onEdit(row){
               this.tagData = {
                   id:row.id,
                   color:row.color,
                   name:row.name,
                   code:row.code,
                   description:row.description
               };
                // this.selectRow = row;
                this.dialogIsEdit = true;
                this.dialogVisible = true;
            },
            onEdittagItem(tagCode){
                this.$router.push({
                    path: '/tag/item_list',
                    query: {
                        tagCode: tagCode
                    }
                });
            },
            onDelete(row){
                var selectRow = row;
                var url = this.Config.baseContext + "/mssq/mssqLabel/delLabelById";
                this.$alert('一旦删除，将无法恢复', '确定删除该标签项?', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    showCancelButton: true,
                }).then(() => {
                    this.$http_post(url, {id: selectRow.id}).then(ret => {
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
                var url = this.Config.baseContext + "/mssq/mssqLabel/getLabelList";
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
            colorChange(val) {
                this.$set(this.tagData, 'color', val)
            },
            onSave(){
                this.$refs.form.validate((valid) => {
                    if(valid){
                        var url = this.Config.baseContext + "/mssq/mssqLabel/saveLabel";
                        this.$http_post(url, this.tagData,true).then(ret => {
                            if (ret.state == 1) {
                                this.$message.success(this.tagData.id?'标签编辑成功':'标签新增成功');
                                this.onQuery();
                                this.dialogVisible = false;
                            }else{
                                this.$message.error(ret.message)
                            }
                        });
                    }
                });

            },
        },
        mounted() {
            //表格高度自适应
            this.$nextTick(() => {
                this.tableHeight = this.$refs.tableH.offsetHeight - 135;
            });
            window.onresize = () => {
                return (() => {
                    this.tableHeight = this.$refs.tableH.offsetHeight - 135;
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
        padding: 20px;
        .el-form{
            .programme-btn{
                margin-right: 0;
            }
        }
        .block{
            text-align: right;
            position: absolute;
            left: 0;
            right: 20px;
            bottom: 20px;
            background: #fff;
        }
    }
    /deep/.el-form{
        .color{
            .el-form-item__content{
                display: flex;
                align-items: center;
            }
        }
    }
    .defaultColor{
        margin: 0 10px;
        width: 30px;
        height: 30px;
    }
</style>