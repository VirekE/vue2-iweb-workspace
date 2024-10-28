<template>
    <!-- 表单管理 -->
    <div class="form-manage" ref="tableH">
        <!-- 查询条件 -->
        <el-form :model="formInline" :inline="true" size="small">
            <div class="flex-sb">
                <div>
                    <el-form-item label="表单名称">
                        <el-input v-model="formInline.name" placeholder="请输入表单名称"></el-input>
                    </el-form-item>
                    <el-form-item label="表单ID">
                        <el-input v-model="formInline.formId" placeholder="请输入表单ID"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" icon="el-icon-search" @click="searchBtn">查询</el-button>
                    </el-form-item>
                </div>
                <el-form-item class="programme-btn">
                    <el-button icon="el-icon-plus" @click="submit()">新增</el-button>
                </el-form-item>
            </div>
        </el-form>
        <div class="tab-box">
            <!-- 列表 -->
            <el-table :data="formList" style="width: 100%" :height="tableHeight"
                      class="qz-table-hide">
                <el-table-column label="表单ID" prop="id"></el-table-column>
                <el-table-column label="表单名称" prop="name"></el-table-column>
                <el-table-column label="表单版本" prop="currentVersionName" width="110"></el-table-column>
    <!--            <el-table-column label="表单类型" prop="type" width="110" :formatter="typeFormatter"></el-table-column>-->
    <!--            <el-table-column label="表单状态" prop="status" width="80" :formatter="statusFormatter"></el-table-column>-->
                <el-table-column label="操作" width="200" align="right">
                    <template slot-scope="scope">
                        <el-button type="text" size="small" @click="versionDetail(scope.row,'current')">查看</el-button>
                        <el-button type="text" size="small" @click="release(scope.row.id)">编辑</el-button>
                        <el-popover
                                placement="bottom-end"
                                width="100"
                                trigger="hover">
                            <div class="flex-column down-btn">
                                <el-button v-if="scope.row.status==='0'" type="text" size="small"
                                           @click="DelOrUndo(scope.row.id,'del')">删除
                                </el-button>
                                <el-button v-if="scope.row.status==='1'" type="text" size="small"
                                           @click="DelOrUndo(scope.row.id,'undo')">撤销
                                </el-button>
                                <el-button type="text" size="small" @click="editionDetail(scope.row)">查看版本</el-button>
                            </div>
                            <el-button class="more-btn" size="small" icon="el-icon-more-outline" type="text"
                                       slot="reference">更多
                            </el-button>
                        </el-popover>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 分页 -->
            <div class="block">
                <el-button type="text" icon="el-icon-refresh" @click="refreshForm">刷新</el-button>
                <el-pagination
                        @current-change="handleCurrentChange"
                        :current-page.sync="formParams.page"
                        :page-size="formParams.limit"
                        layout="total,prev, pager, next, jumper"
                        :total="formParams.total">
                </el-pagination>
            </div>
        </div>
        <el-dialog
                title="修改表单"
                :visible.sync="editionDialog"
                :close-on-click-modal=false
                width="80%"
                class="qz-dialog-padding">
            <el-table :data="versionFormList" style="width: 100%" height="500px"
                      class="qz-table-hide">
                <el-table-column label="表单版本ID" prop="formVersionId"></el-table-column>
                <el-table-column label="表单名称" prop="formName"></el-table-column>
                <el-table-column label="表单版本" prop="formVersionName"></el-table-column>
                <el-table-column label="发布时间" prop="lastModifitionTime"></el-table-column>
                <el-table-column label="表单状态" prop="status" :formatter="typeFormatter"></el-table-column>
                <el-table-column label="操作" width="160" align="right">
                    <template slot-scope="scope">
                        <el-button type="text" size="small" @click="versionDetail(scope.row,'version')">查看</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 分页 -->
            <div class="block">
                <el-pagination
                        @current-change="handleVersionChange"
                        :current-page.sync="versionParams.page"
                        :page-size="versionParams.limit"
                        layout="total,prev, pager, next, jumper"
                        :total="versionParams.total">
                </el-pagination>
            </div>
        </el-dialog>

        <el-dialog
                width="60%"
                :visible.sync="detailDialog"
                :append-to-body="true"
                class="qz-dialog-padding">
            <div style="height: 500px;padding: 20px;overflow-y: auto">
                <iframe id="formView" scrolling="none" :src="src" frameborder="0" height="100%" width="100%"></iframe>
            </div>
        </el-dialog>
        <el-dialog
                title="操作须知"
                :visible.sync="formTip"
                :close-on-click-modal=false
                width="40%"
                class="qz-dialog-padding">
            <div class="dialog-content edit-tit">
                <div class="warnCon">
                    <p style="text-indent:1em;"><i class="el-icon-warning-outline"></i>为保证业务正常办理，正式环境关联新表单前，请在测试联调环境进行联调测试，测试完成后再关联发布新表单系统表单。
                    </p>
                </div>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="addForm">已完成联调测试</el-button>
                <el-button @click="formTip = false">未联调测试</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import editionForm from './edition-form'
    import qzBase from "../../common/util/qzBase";
    import copyForm from './copy-form'

    export default {
        name: "form-manage",
        mixins: [qzBase],
        data() {
            return {
                //搜索条件
                formInline: {
                    name: '',
                    formId: '',
                    area: ''
                },
                //表单分页
                formParams: {
                    page: 1,
                    limit: 10,
                    total: 0
                },
                versionParams: {
                    page: 1,
                    limit: 10,
                    total: 0
                },
                dialogForm: {
                    name: ''
                },
                formTip: false,//表单提示
                detailDialog: false,//表单详情弹窗
                editionDialog: false,//版本表单弹窗
                copyDialog: false,//复制表单
                //字典
                dictMap: {},
                //列表数据
                formList: [],
                //版本列表
                versionFormList: [],
                //表单高
                tableHeight: 500,
                //登陆用户dept
                dept: '',
                //表单系统编辑界面url
                newform_url: "",
                //表单系统回调接口url
                domain_url: "",
                //选中的行
                editRow: "",
                //回去版本的预览
                src: ''
            }
        },
        components: {
            editionForm,
            copyForm
        },
        mounted() {
            this.queryDictMap("NEW_FORM_STATUS,NEW_FORM_TYPE", (res) => {
                this.dictMap = res;
            });
            //表格高度自适应
            this.$nextTick(() => {
                this.tableHeight = this.$refs.tableH.offsetHeight - 155;
            });
            window.onresize = () => {
                return (() => {
                    this.tableHeight = this.$refs.tableH.offsetHeight - 155;
                })();
            };
            //初始化url
            this.newform_url = this.Config.newform_url;
            this.domain_url = this.Config.domain_url;
            //初始化dept
            this.initDept();
            //获取列表数据
            this.search();
        },
        methods: {
            //复制表单成功回调
            copySuccess() {
                this.refreshForm();
            },
            //点击搜索按钮
            searchBtn() {
                this.formParams.page = 1;
                this.search();
            },
            //搜索
            search() {
                let url = this.Config.baseContext + "/mssq/pmi/getNewFormList";
                let dept = this.dept;
                let param = {
                    page: this.formParams.page,
                    rows: this.formParams.limit,
                    dept: dept,
                    status: "",
                    type: "1",
                    name: this.formInline.name,
                    formId: this.formInline.formId
                };
                this.$http_post(url, param).then(ret => {
                    if (ret.state === 1) {
                        this.formParams.total = ret.records;
                        this.formList = ret.rows;
                    } else {
                        this.$message.error(ret.message);
                    }
                }).catch(err => {
                    console.log(err);
                });
            },
            //新增
            submit() {
                this.formTip = true;
            },
            addForm() {
                this.formTip = false;
                let url = this.newform_url + "/formEdit?id=";
                let postFormUrl = "";
                let callback = postFormUrl;
                var url1 = this.Config.baseContext + "/mssq/pmi/newFormSSO";
                this.$http_post(url1, {
                    "appUrl": this.newform_url,
                    "redirectUrl": Base64.encode(url),
                    "callback": Base64.encode(callback)
                }).then(ret => {
                    if (ret.state === 1) {
                        window.open(ret.message, 'left=0,top=0,toolbar=no, menubar=no, scrollbars=yes, resizable=yes, location=yes, status=no,fullscreen=yes');
                    } else {
                        this.$message.error("当前用户未添加新增表单权限");
                    }
                }).catch(err => {
                    this.$message.error(err.message);
                });
            },
            //修改
            release(id) {
                let url = this.newform_url + "/formEdit?id=" + id;
                let postFormUrl = "";
                let callback = postFormUrl;
                var url1 = this.Config.baseContext + "/mssq/pmi/newFormSSO";
                this.$http_post(url1, {
                    "appUrl": this.newform_url,
                    "redirectUrl": Base64.encode(url),
                    "callback": Base64.encode(callback)
                }).then(ret => {
                    if (ret.state === 1) {
                        window.open(ret.message, 'left=0,top=0,toolbar=no, menubar=no, scrollbars=yes, resizable=yes, location=yes, status=no,fullscreen=yes');
                    } else {
                        this.$message.error("当前用户未添加修改表单权限");
                    }
                }).catch(err => {
                    this.$message.error(err.message);
                });
            },
            //删除或撤回
            DelOrUndo(id, type) {
                let tops = "";
                let url = "";
                let message = ''
                if (type === 'del') {
                    tops = "是否删除该表单,删除后无法还原！";
                    url = this.Config.baseContext + "/mssq/pmi/delNewFormById";
                    message = '删除'
                } else {
                    tops = "是否撤回审核,取消发布！";
                    url = this.Config.baseContext + "/mssq/pmi/undoNewFormById";
                    message = '撤销'
                }
                this.$confirm(tops, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let param = {
                        formId: id
                    };
                    this.$http_post(url, param).then(ret => {
                        if (ret.state === 1) {
                            this.$message.success(message + '成功');
                        } else {
                            this.$message.error(ret.message);
                        }
                        this.search();
                    }).catch(err => {
                        console.log(err);
                    });

                });
            },
            //打开查看版本弹窗
            editionDetail(row) {
                this.formId = row.id;
                this.versionSearch();
                this.editionDialog = true;
            },
            versionSearch() {
                var formId = this.formId;
                let url = this.Config.baseContext + "/mssq/pmi/getNewFormVersionList";
                let param = {
                    page: this.versionParams.page,
                    rows: this.versionParams.limit,
                    formId: formId
                };
                this.$http_post(url, param).then(ret => {
                    if (ret.state === 1) {
                        this.versionParams.total = ret.records;
                        this.versionFormList = ret.rows;
                    } else {
                        this.$message.error(ret.message);
                    }
                }).catch(err => {
                    console.log(err);
                });
            },
            //打开版本查看详情的弹窗
            versionDetail(row, type) {
                this.versionView(row, type);
                this.detailDialog = true;
                this.$nextTick(function () {
                    var cform = new CFormSDK("formView");
                    cform.ready({
                        "success": function (ret) {
                            cform.setOptions({});//设置表单配置项，可不执行此方法，不配置
                            cform.setBaseData({
                                "data": {//常量值
                                    "userId": "111"// 系统默认常量值,不能为空
                                },
                            });// 设置常量值，必须设置
                        },
                        "error": function (ret) {
                        }
                    })
                })
            },
            //表单版本数据
            versionView(row, type) {
                var formUrl = this.newform_url;
                var formId = "";
                var versionId = "";
                if (type === 'current') {
                    formId = row.id;
                    versionId = row.currentVersionId;
                } else {
                    formId = row.formId;
                    versionId = row.formVersionId;
                }
                let url = this.Config.baseContext + "/mssq/pmi/getNewFormVersionDetail";
                let param = {
                    formUrl: formUrl,
                    versionId: versionId,
                    formId: formId
                };
                this.$http_post(url, param).then(ret => {
                    if (ret.state === 1) {
                        this.src = ret.row;
                    } else {
                        this.$message.error(ret.message);
                    }
                }).catch(err => {
                    console.log(err);
                });
            },
            //翻页回调
            handleCurrentChange(val) {
                this.formParams.page = val;
                this.search();
            },
            handleVersionChange(val) {
                this.versionParams.page = val;
                this.versionSearch();
            },
            //类型格式
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
            //状态格式
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
            //关闭查看版本弹窗
            close() {
                this.editionDialog = false;
            },
            //打开查看版本弹窗
            confirm(val) {
                this.editionDialog = false;
                this.$emit("confirm", val);
            },
            //刷新表单
            refreshForm() {
                this.formParams.page = 1;
                this.search();
            },
            //复制
            closeCopy() {
                this.copyDialog = false;
            },
            copy() {
                this.copyDialog = true;
            },
            clcikClose() {
                this.copyDialog = false;
            }
        }
    }
</script>


<style scoped lang="less">
    .edit-tit {
        i, span {
            color: #999;
        }

        .warnCon {
            margin: 10px 0;
        }
    }

    .form-manage {
        position: relative;
        height: 100%;
        display: flex;
        flex-direction: column;
        background: #f8f8f8;
        .el-form {
            background: #fff;
            margin-bottom: 10px;
            width: 100%;
            /*display: flex;*/
            padding: 10px 14px 0 14px;
            .programme-btn {
                margin-right: 0;
            }
        }

        .edit-tit {
            i, span {
                color: #999;
            }

            .warnCon {
                margin: 10px 0;
            }
        }

        .block {
            text-align: right;
            /*position: absolute;*/
            /*left: 0;*/
            /*right: 20px;*/
            /*bottom: 40px;*/
            background: #fff;

            .el-button {
                position: absolute;
                left: 25px;
            }
        }
    }

    .down-btn {
        .el-button {
            margin: 5px 0px;
        }
    }

    .more-btn {
        margin-left: 10px;
    }

    .el-dialog {
        /deep/ .el-form-item {
            margin-bottom: 20px !important;
        }
    }
    .qz-table-hide{
        /deep/.el-table__body-wrapper{
            overflow-y: auto;
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
