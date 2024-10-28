<template>
    <!-- 查看版本 -->
    <el-dialog
            :title="title"
            :visible="show"
            :close-on-click-modal=false
            width="65%"
            @close="close"
            append-to-body
            class="qz-dialog-padding">
        <div class="dialog-content">
            <div class="edition">
                <el-form :model="editionForm" size="small" label-width="70px" v-if="showSearchBar">
                    <el-row style="position: relative;">
                        <el-col :span="10">
                            <el-form-item label="表单名称">
                                <el-input v-model="editionForm.name" placeholder="请输入表单名称"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="10">
                            <el-form-item label="表单id">
                                <el-input v-model="editionForm.formId" placeholder="请输入表单id"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="2">
                            <el-form-item class="programme-btn">
                                <el-button type="primary" icon="el-icon-search" @click="searchBtn">查询</el-button>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="10">
                            <el-form-item label="部门">
                                <el-input placeholder="请选择部门" v-model="editionForm.areaName" disabled>
                                    <el-button slot="append" class="iconfont icon-caidan"
                                               @click="openOrgDialog"></el-button>
                                </el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
                <div class="table-list">
                    <el-table :data="editionList"
                              style="width: 100%"
                              max-height="300px"
                              row-key="id"
                              lazy
                              :load="load"
                              @selection-change="handleSelectionChange"
                              :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
                              class="qz-table-hide">
                        <el-table-column type="selection" width="50" :selectable='selectInit' ></el-table-column>
                        <el-table-column label="表单名称" prop="formName" show-overflow-tooltip></el-table-column>
                        <el-table-column label="区划名称" prop="regionName" width="90" show-overflow-tooltip></el-table-column>
                        <el-table-column label="部门名称" prop="deptName" width="150" show-overflow-tooltip></el-table-column>
                        <el-table-column label="版本" prop="version" width="70"></el-table-column>
                        <el-table-column label="发布时间" prop="lastModificationTime"
                                         :formatter="formatterDateTime"></el-table-column>
                        <el-table-column label="操作" width="90" align="right">
                            <template slot-scope="scope">
                                <el-button v-if="!!scope.row.formId" type="text" size="small" @click="showForm(scope.row)">查看表单</el-button></template>
                        </el-table-column>
                    </el-table>
                    <div class="block" v-if="showPagination">
                        <el-pagination
                                @current-change="handleCurrentChange"
                                :current-page.sync="editionParams.page"
                                :page-size="editionParams.limit"
                                layout="total,prev, pager, next, jumper"
                                :total="editionParams.total">
                        </el-pagination>
                    </div>
                </div>
            </div>
        </div>
        <span slot="footer" class="dialog-footer">
            <el-button @click="confirm">确认</el-button>
        </span>
    </el-dialog>
</template>

<script>
    import qzBase from '@_src/pages/mssq/common/util/qzBase'
    import orgTree from '@_src/pages/mssq/common/components/organ'
    export default {

        name: "edition-form",

        mixins: [qzBase],

        components:{
            orgTree
        },

        props:{
            title:{
              type:String,
              default: '选择表单'
            },
            formBusiId:{
                type:String,
                default: ''
            },
            show:{
                type:Boolean,
                default:false
            },
            showSearchBar: {
                type:Boolean,
                default:true
            },
            showPagination: {
                type:Boolean,
                default:true
            }
        },

        watch:{
            formBusiId(newV,oldV) {
                this.subFormBusiId = newV;
                this.search();
            }
        },

        data(){
            return{
                isCheckbox: false,
                //部门弹窗显示标记
                orgDialog: false,
                //搜索入参
                editionForm:{
                    name:'',
                    formId:'',
                    area:'',
                    areaName:''
                },
                //列表数据
                editionList:[],
                //分页
                editionParams:{
                    page:1,
                    limit:10,
                    total:0
                },
                //登陆用户部门编码
                dept:'',
                //表单系统编辑界面url
                form_url:"",
                //
                subFormBusiId: '',
                //选中的行
                selectedRows: []
            }
        },

        mounted() {
            //初始化url
            this.form_url = this.Config.form_url;
            //初始化dept
            this.initDept();
            //搜索
            this.search();
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
                this.editionForm.area = '';
                this.editionForm.areaName = '';
                list.forEach(item=>{
                    let name = item.name;
                    let code = item.code;
                    if(this.editionForm.area == '') {
                        this.editionForm.areaName = name;
                        this.editionForm.area = code;
                    } else {
                        this.editionForm.areaName = this.editionForm.areaName+','+item.name;
                        this.editionForm.area = this.editionForm.area+','+item.code;
                    }
                });
            },
            selectInit(row,index){
                let formId=row.formId;
                if(this.isNotNull(formId)){
                    return true  //不可勾选
                }else{
                    return false  //可勾选
                }
            },
            //点击搜索按钮
            searchBtn() {
                this.editionParams.page = 1;
                this.search();
            },

            //搜索
            search() {
                let url = this.Config.baseContext + "/admin/qzqdForm/getFormList";
                let param = {
                    page: this.editionParams.page,
                    rows: this.editionParams.limit,
                    dept: this.editionForm.area,
                    formName: this.editionForm.name,
                    formBusiId: this.subFormBusiId,
                    formId: this.editionForm.formId
                };
                this.$http_post(url, param).then(ret => {
                    if (ret.code == 1) {
                        this.editionParams.total = ret.data.total;
                        this.editionList = ret.data.records;
                    } else {
                        this.$message.error(ret.message);
                    }
                }).catch(err => {
                    console.log(err);
                });
            },

            //懒加载，获取表单版本列表
            load(tree, treeNode, resolve) {
                let children = [];
                //动态获取children
                let url = this.Config.baseContext + "/admin/qzqdForm/getFormVersionList";
                let param = {
                    page: 1,
                    rows: 99999,
                    formBusiId: tree.id
                };
                this.$http_post(url, param).then(ret => {
                    if (ret.code == 1) {
                        children = ret.data.records;
                        setTimeout(() => {
                            resolve(children);
                        }, 100);
                    } else {
                        this.$message.error(ret.message);
                    }
                }).catch(err => {
                    console.log(err);
                });
            },

            //翻页回调
            handleCurrentChange(val){
                this.editionParams.page = val;
                this.search();
            },

            //初始化dept
            initDept() {
                let user = this.$store.getters.curUser;
                let roleValue = user.roleValue;
                if(roleValue.indexOf("REGION_FROM_SYSTEM") > -1){
                    this.dept = user.attrMap.REGION_CODE;
                }else{
                    this.dept = user.orgCode;
                }
            },

            //查看表单
            showForm(row) {
                let url = "/cform/view?formId="+row.formId;
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

            //选中行回调
            handleSelectionChange(rows){
                this.selectedRows = rows;
            },

            //点击确认
            confirm() {
                if(this.showSearchBar&&this.showPagination) {
                    if(this.selectedRows.length!=1) {
                        this.$message.error('请选择一行数据');
                        return;
                    }
                    if(this.selectedRows[0].hasChildren) {
                        this.$message.error('请选择一个表单');
                        return;
                    }
                }
                /*if(!(this.selectedRows.length!=1 & this.selectedRows[0].hasChildren)){
                    this.$message.success('选择版本成功');
                }*/
                this.$emit('confirm', this.selectedRows);
            },

            //点击关闭
            close() {
                this.$emit('close');
            }

        }
    }
</script>

<style scoped lang="less">
    .edition{
        .el-form{
            .el-cascader{
                width: 100%;
            }
            .programme-btn{
                /deep/ .el-form-item__content{
                    position: absolute;
                    right: 0;
                }
            }
        }
        .table-list{
            border: 1px solid #e2e2e2;
            .el-table{
                /deep/ th{
                    background-color: #f5f7fa;
                }
            }
        }
        .block{
            text-align: right;
            margin: 10px;
        }
    }
</style>