<template>
    <!-- 复制表单 -->
    <el-dialog
            title="复制表单"
            :visible="show"
            :close-on-click-modal=false
            width="65%"
            @close="close"
            append-to-body
            class="qz-dialog-padding">
        <div class="dialog-content">
            <el-form :model="formInline" :inline="true" size="small">
                <el-form-item label="表单名称">
                    <el-input v-model="formInline.name" placeholder="请输入表单名称"></el-input>
                </el-form-item>
                <el-form-item label="部门">
                    <el-input placeholder="请选择部门" v-model="formInline.areaName" disabled>
                        <el-button slot="append" class="iconfont icon-caidan"
                                   @click="openOrgDialog"></el-button>
                    </el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" icon="el-icon-search" @click="getFormList">查询</el-button>
                </el-form-item>
            </el-form>
            <el-table :data="formList" style="width:100%" class="qz-table-hide">
                <el-table-column prop="name" label="表单名称" show-overflow-tooltip></el-table-column>
                <el-table-column prop="deptName" label="部门名称" show-overflow-tooltip></el-table-column>
                <el-table-column prop="lastModificationTime" label="修改时间"
                                 :formatter="formatterDateTime"></el-table-column>
                <el-table-column label="操作" width="130" align="right">
                    <template slot-scope="scope">
                        <el-button type="text" size="small" @click="showForm(scope.row)">查看表单</el-button>
                        <el-button type="text" size="small" @click="copyForm(scope.row)">复制</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="block">
                <el-pagination
                        @current-change="handleCurrentChange"
                        :current-page.sync="copyParams.page"
                        :page-size="copyParams.limit"
                        layout="total,prev, pager, next, jumper"
                        :total="copyParams.total">
                </el-pagination>
            </div>
        </div>
        <span slot="footer" class="dialog-footer">
            <el-button @click="closeCopy">取消</el-button>
        </span>
    </el-dialog>
</template>

<script>
    import qzBase from '@_src/pages/mssq/common/util/qzBase'
    import orgTree from '@_src/pages/mssq/common/components/organ'
    export default {

        name: "copy-form",

        mixins: [qzBase],

        components:{
            orgTree
        },

        data(){
            return{
                formInline:{
                    name:'',
                    area:'',
                    areaName:''
                },
                formList:[],
                copyParams:{
                    page:1,
                    limit:5,
                    total:0
                },
                form_url:''
            }
        },

        props:{
            show:{
                type:Boolean,
                default:false
            }
        },

        methods:{
            //打开部门选中弹窗
            openOrgDialog() {
                orgTree.show({
                    head:'部门选择',
                    isCheckbox:true,
                    //深圳市编码440301区划编码穿空字符串，不为440301就传区划编码
                    rootCode:  this.$store.getters.curUser.attrMap.REGION_CODE == '440301'?'':this.$store.getters.curUser.attrMap.REGION_CODE,
                    isRegion:false,
                    regionDisabled:true,
                    // removeCode:'160929095719',
                    onOkClick:res => {
                        this.checkChange(res)
                    }
                });
            },

            //部门选中回调
            checkChange(list){
                this.formInline.area = '';
                this.formInline.areaName = '';
                list.forEach(item=>{
                    let name = item.name;
                    let code = item.code;
                    if(this.formInline.area == '') {
                        this.formInline.areaName = name;
                        this.formInline.area = code;
                    } else {
                        this.formInline.areaName = this.formInline.areaName+','+item.name;
                        this.formInline.area = this.formInline.area+','+item.code;
                    }
                });
            },

            //翻页
            handleCurrentChange(val){
                this.copyParams.page = val;
                this.getFormList();
            },

            //点击关闭
            close() {
                this.$emit('close');
            },
            closeCopy(){
                this.$emit('closeCopy');
            },

            //获取表单列表
            getFormList() {
                let url = this.Config.baseContext + "/admin/qzqdForm/getFormList";
                let param = {
                    page: this.copyParams.page,
                    rows: this.copyParams.limit,
                    formName: this.formInline.name,
                    dept: this.formInline.area
                };
                this.$http_post(url, param).then(ret => {
                    if (ret.code == 1) {
                        this.copyParams.total = ret.data.total;
                        this.formList = ret.data.records;
                    } else {
                        this.$message.error(ret.message);
                    }
                }).catch(err => {
                    console.log(err);
                });
            },

            //刷新列表
            refreshFormList() {
                this.copyParams.page = 1;
                this.getFormList();
            },

            //查看表单
            showForm(row) {
                let url = "/cform/view?formId="+row.currentFormId;
                var url1=this.Config.baseContext+"/admin/pmi/formSSO";
                this.$http_post(url1,{"appUrl":this.form_url,"pageUrl":url}).then(ret => {
                    if(ret.state===1){
                        window.open(ret.message,'left=0,top=0,toolbar=no, menubar=no, scrollbars=yes, resizable=yes, location=yes, status=no,fullscreen=yes');
                    }else {
                        this.$message.error("新增表单失败");
                    }
                }).catch(err => {
                    this.$message.error(err.message);
                });
                },

            //复制表单
            copyForm(row) {
                let url = this.Config.baseContext + "/admin/qzqdForm/copyForm";
                let param = {
                    formId: row.currentFormId,
                    formName: row.formName
                };
                this.$http_post(url, param).then(ret => {
                    if (ret.code == 1) {
                        this.$message.success('复制表单成功');
                        this.refreshFormList();
                        this.$emit('copySuccess');
                    } else {
                        this.$message.error(ret.message);
                    }
                }).catch(err => {
                    console.log(err);
                });
            }
        },

        mounted() {
            //初始化url
            this.form_url = this.Config.form_url;
            //获取表单列表
            this.getFormList();
        }

    }
</script>

<style scoped>
    .block{
        text-align: right;
        margin-top: 15px;
    }
</style>