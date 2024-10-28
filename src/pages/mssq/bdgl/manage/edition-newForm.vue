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
                        <el-form :model="editionNewForm" size="small" label-width="80px" v-if="showSearchBar">
                            <el-row style="position: relative;">
                                <el-col :span="8">
                                    <el-form-item label="表单名称">
                                        <el-input v-model="editionNewForm.name" placeholder="请输入表单名称"></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="8">
                                    <el-form-item label="表单ID">
                                        <el-input v-model="editionNewForm.formId" placeholder="请输入表单ID"></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="4">
                                    <el-form-item class="programme-btn">
                                        <el-button type="primary" icon="el-icon-search" @click="searchBtn">查询
                                        </el-button>
                                        <el-button type="primary" icon="el-icon-refresh-left" @click="revertNewForm">重置
                                        </el-button>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="8">
                                    <el-form-item label="部门">
                                        <el-input placeholder="请选择部门" v-model="editionNewForm.areaName" disabled>
                                            <el-button slot="append" class="iconfont icon-caidan"
                                                       @click="openOrgDialog"></el-button>
                                        </el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                        </el-form>
                        <div class="table-list">
                            <el-table :data="editionNewList"
                                      style="width: 100%"
                                      max-height="300px"
                                      row-key="id"
                                      lazy
                                      :load="loadNew"
                                      @selection-change="handleSelectionChange"
                                      ref="qingchu"
                                      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
                                      class="qz-table-hide">
                                <el-table-column type="selection" width="50" :selectable='selectInit'></el-table-column>
                                <el-table-column label="表单名称" prop="name" show-overflow-tooltip></el-table-column>
                                <el-table-column label="表单版本" prop="currentVersionName" width="90"
                                                 show-overflow-tooltip></el-table-column>
                                <el-table-column label="表单版本ID" prop="publishVersionId"
                                                 show-overflow-tooltip></el-table-column>
                                <el-table-column label="表单类型" prop="type" width="150" :formatter="typeFormatter"
                                                 show-overflow-tooltip></el-table-column>
                                <el-table-column label="表单状态" prop="status" width="70"
                                                 :formatter="statusFormatter"></el-table-column>
                                <el-table-column label="操作" width="90" align="right">
                                    <template slot-scope="scope">
                                        <el-button v-if="!!scope.row.formId" type="text" size="small"
                                                   @click="showFormDetail(scope.row)">查看表单
                                        </el-button>
                                    </template>
                                </el-table-column>
                            </el-table>
                            <div class="block" v-if="showPagination">
                                <el-pagination
                                        @current-change="handleCurrentChangeNew"
                                        :current-page.sync="editionNewParams.page"
                                        :page-size="editionNewParams.limit"
                                        layout="total,prev, pager, next, jumper"
                                        :total="editionNewParams.total">
                                </el-pagination>
                            </div>
                            <el-dialog
                                    width="50%"
                                    :visible.sync="detailDialog"
                                    :append-to-body="true">
                                <div style="height: 500px;padding: 20px;overflow-y: auto">
                                    <p style="padding: 20px">表单ID：{{formView.formId}} <span style="margin-left: 10px">版本ID：{{formView.formVid}}</span></p>
                                    <iframe id="formView" scrolling="none" :src="src" frameborder="0" height="100%" width="100%"></iframe>
                                </div>
                            </el-dialog>
                        </div>
                    </div>

                </div>
        <span slot="footer" class="dialog-footer" >
            <el-button @click="confirm" type="primary">确认</el-button>
        </span>
    </el-dialog>
</template>

<script>
    import qzBase from '@_src/pages/mssq/common/util/qzBase'
    import orgTree from '@_src/pages/mssq/common/components/organ'

    export default {

        name: "edition-newForm",

        mixins: [qzBase],

        components: {
            orgTree
        },

        props: {
            formBusiId:{
                type:String,
                default: ''
            },
            title: {
                type: String,
                default: '选择表单'
            },
            formId: {
                type: String,
                default: ''
            },
            show: {
                type: Boolean,
                default: false
            },
            showSearchBar: {
                type: Boolean,
                default: true
            },
            showPagination: {
                type: Boolean,
                default: true
            }
        },

        watch: {
            formBusiId(newV,oldV) {
                this.subFormBusiId = newV;
            }
        },

        data() {
            return {
                //搜索入参
                editionForm:{
                    name:'',
                    formId:'',
                    area:'',
                    areaName:''
                },
                //搜索入参
                editionNewForm: {
                    name: '',
                    formId: '',
                    area: '',
                    areaName: ''
                },
                //新列表数据
                editionList:[],
                //旧列表数据
                editionNewList:[],
                isCheckbox: false,
                //部门弹窗显示标记
                orgDialog: false,
                //分页
                editionNewParams: {
                    page: 1,
                    limit: 10,
                    total: 0
                }, //分页
                editionParams: {
                    page: 1,
                    limit: 10,
                    total: 0
                },
                //登陆用户部门编码
                dept: '',
                //表单系统编辑界面url
                form_url: "",
                //新表单Url
                newform_url:"",
                //搜索id
                subFormBusiId: '',
                //选中的行
                selectedRows: [],
                //表单预览url
                src: "",
                //字典
                dictMap: {},
                //版本表单弹窗
                detailDialog: false,
                formView:{
                    formId:'',
                    formVid:'',
                }
            }
        },

        mounted() {
            this.queryDictMap("NEW_FORM_STATUS,NEW_FORM_TYPE", (res) => {
                this.dictMap = res;
            });
            //初始化url
            this.form_url = this.Config.form_url;
            this.newform_url = this.Config.newform_url;
            //初始化dept
            this.initDept();
            //搜索
            // this.search();
        },

        methods: {
            revertNewForm(){
                var editionNewForm={
                    name:'',
                    formId:'',
                    area:'',
                    areaName:''
                }
                this.editionNewForm=editionNewForm;
            },
            revert(){
                var editionForm={
                        name:'',
                        formId:'',
                        area:'',
                        areaName:''
                    }
                this.editionForm=editionForm;
            },
            //打开部门选中弹窗
            openOrgDialog() {
                orgTree.show({
                    head: '部门选择',
                    isCheckbox: true,
                    //深圳市编码440301区划编码穿空字符串，不为440301就传区划编码
                    rootCode:  this.$store.getters.curUser.attrMap.REGION_CODE == '440301'?'':this.$store.getters.curUser.attrMap.REGION_CODE,
                    isRegion: false,
                    regionDisabled: true,
                    // removeCode:'160929095719',
                    onOkClick: res => {
                        this.checkChange(res)
                    }
                });
            },
            //部门选中回调
            checkChange(list) {
                this.editionNewForm.area = '';
                this.editionNewForm.areaName = '';
                list.forEach(item => {
                    let name = item.name;
                    let code = item.code;
                    if (this.editionNewForm.area == '') {
                        this.editionNewForm.areaName = name;
                        this.editionNewForm.area = code;
                    } else {
                        this.editionNewForm.areaName = this.editionNewForm.areaName + ',' + item.name;
                        this.editionNewForm.area = this.editionNewForm.area + ',' + item.code;
                    }
                });
            },
            selectInit(row, index) {
                let formId = row.formId;
                if (this.isNotNull(formId)) {
                    return true  //不可勾选
                } else {
                    return false  //可勾选
                }
            },

            //新表单点击搜索按钮
            searchBtn() {
                this.editionNewParams.page = 1;
                // this.search();
            },
            //新表单搜索
            search() {
                let url = '';//this.Config.baseContext + "/mssq/pmi/getNewFormList";
                let dept = this.editionNewForm.area;
                let status = "2";
                let type = "1";
                let param = {
                    dept: dept,
                    status: status,
                    type: type,
                    name: this.editionNewForm.name,
                    page: this.editionNewParams.page,
                    rows: this.editionNewParams.limit,
                    formId: this.editionNewForm.formId
                };
                this.$http_post(url, param).then(ret => {
                    if (ret.state == 1) {
                        this.editionNewParams.total = ret.records;
                        this.editionNewList = ret.rows;
                    } else {
                        // this.$message.error(ret.message);
                    }
                }).catch(err => {
                    console.log(err);
                });
            },
            //新表单懒加载，获取表单版本列表
            loadNew(tree, treeNode, resolve) {
                let children = [];
                //动态获取children
                let url = this.Config.baseContext + "/mssq/pmi/getNewFormVersionList";
                let param = {
                    page: 1,
                    rows: 99999,
                    formId: tree.id
                };
                this.$http_post(url, param).then(ret => {
                    if (ret.state == 1) {
                        children = ret.rows;
                        var list = [];
                        for (let i = 0; i < children.length; i++) {
                            const childrenObj = {
                                formId: children[i].formId,
                                name: children[i].formName,
                                id:children[i].formVersionId,
                                currentVersionName: children[i].formVersionName,
                                publishVersionId: children[i].formVersionId,
                                currentVersionId: children[i].currentVersionId,
                                type: children[i].type,
                                status: "2",
                                form: "new"
                            }
                            list.push(childrenObj);
                        }
                        setTimeout(() => {
                            resolve(list);
                        }, 100);
                    } else {
                        this.$message.error(ret.message);
                    }
                }).catch(err => {
                    console.log(err);
                });
            },
            //新表单打开查看版本详情弹窗
            showFormDetail(row) {
                this.formView.formId= row.formId;
                this.formView.formVid= row.id
                this.showFormNew(row);
                this.detailDialog = true;
                this.$nextTick(function () {
                    var cfrom = new CFormSDK("formView");
                    cfrom.ready({
                        "success": function (ret) {
                            cfrom.setOptions({});//设置表单配置项，可不执行此方法，不配置
                            cfrom.setBaseData({
                                "data": {//常量值
                                    // "userId": "111"// 系统默认常量值,不能为空
                                },
                            });// 设置常量值，必须设置
                        },
                        "error": function (ret) {
                        }
                    })
                })
            },
            //查看新表单
            showFormNew(row) {
                var formId = row.formId;
                var versionId = row.id;
                var formUrl = this.newform_url;
                let url = this.Config.baseContext + "/admin/qzqdForm/getNewFormVersionDetail";
                let param = {
                    formId: formId,
                    versionId: versionId,
                    formUrl: formUrl
                };
                this.$http_post(url, param).then(ret => {
                    if (ret.state === 1) {
                        this.src = ret.row;
                    } else {
                        this.$message.error(ret.message);
                    }
                }).catch(err => {
                    console.log(err);
                })
            },
            //翻页回调
            handleCurrentChangeNew(val) {
                this.editionNewParams.page = val;
                // this.search();
            },
            //新表单状态
            statusFormatter(row) {
                var status = row.status;
                var busiDict = this.dictMap.NEW_FORM_STATUS;
                for (var i = 0; i < busiDict.length; i++) {
                    if (busiDict[i].itemCode == status) {
                        return busiDict[i].itemValue;
                    }
                }
                return '';
            },
            //新表单类型
            typeFormatter(row) {
                var type = row.type;
                var busiDict = this.dictMap.NEW_FORM_TYPE;
                for (var i = 0; i < busiDict.length; i++) {
                    if (busiDict[i].itemCode == type) {
                        return busiDict[i].itemValue;
                    }
                }
                return '';
            },
            //初始化dept
            initDept() {
                let user = this.$store.getters.curUser;
                let roleValue = user.roleValue;
                if (roleValue.indexOf("REGION_FROM_SYSTEM") > -1) {
                    this.dept = user.attrMap.REGION_CODE;
                } else {
                    this.dept = user.orgCode;
                }
            },
            //选中行回调
            handleSelectionChange(selection) {
                if (selection.length > 1) {
                    this.$refs.qingchu.clearSelection();
                    this.$refs.qingchu.toggleRowSelection(selection[selection.length - 1]);
                }
                let data = this.getSelect(this.$refs.qingchu);
                if (data.length != 0) {
                    this.selectedRows = data;
                } else {
                    this.selectedRows = [];
                }
                // this.selectedRows = rows;
            },
            getSelect(ref) {
                return ref.selection;
            },
            //点击确认
            confirm() {
                if (this.showSearchBar && this.showPagination) {
                    if (this.selectedRows.length != 1) {
                        this.$message.error('请选择一行数据');
                        return;
                    }
                    if (this.selectedRows[0].hasChildren) {
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
            },
            clearList(){
                this.$refs.qingchu.clearSelection();
                this.$refs.multipleTable.clearSelection();
            },
        }
    }
</script>

<style scoped lang="less">
    .edition {
        .el-form {
            .el-cascader {
                width: 100%;
            }

            .programme-btn {
                /deep/ .el-form-item__content {
                    position: absolute;
                    right: 0;
                }
            }
        }

        .table-list {
            border: 1px solid #e2e2e2;

            .el-table {
                /deep/ th {
                    background-color: #f5f7fa;
                }
            }
        }

        .block {
            text-align: right;
            margin: 10px;
        }
    }
    .dialog-footer{
        text-align: end;
    }
</style>
