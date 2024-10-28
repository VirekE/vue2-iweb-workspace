<!--<style lang="less" src="@_src/pages/mssq/common/css/form.less" scoped></style>-->
<template>
    <div class="baseInfo">
        <h3 class="title">
            <p class="content">关联业务表单</p>
            <el-button type="text" v-if="type == 'statistical'" @click="servicesData" :disabled="flag">
                <i class="iconfont icon-morenzhitianchong"></i>数据填充
            </el-button>
        </h3>
        <el-form :disabled="flag" :model="itemInfo" label-width="140px" :rules="rules" ref="itemInfoData">
            <div class="base-info-content">
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="办表单" class="statisticalForm">
                            <template slot="label">
                                <span>{{type === 'item'?'事项表单':'办理项表单'}}</span>
                                <el-tooltip class="item" effect="dark" content="" placement="top-start">
                                    <template slot="content">
                                        仅能关联一张表单
                                    </template>
                                    <i class="el-icon-warning-outline"></i>
                                </el-tooltip>
                            </template>
                            <div @click="showFormDetail(itemInfoData)" v-if="itemInfoData.formId"><i
                                    class="formName">{{itemInfoData.formName}}</i></div>
                            <el-button class="linkButton" type="primary" size="small"
                                       @click="association=true">关联表单
                            </el-button>
                            <el-button
                                    v-if="(!isEmptyObject(itemInfoData.formName))&& (itemInfoData.formId!=='')"
                                    class="linkButton" type="primary" size="small"
                                    @click="formIndex=scope.$index;delFrom()">删除表单
                            </el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
            </div>
        </el-form>
        <association-dialog title="关联表单" :show="association" ref="associationbooen"
                            @close="association = false" @confirm="confirm" :showSearchBar="true"
                            :showPagination="true">
        </association-dialog>
        <el-dialog
                width="60%"
                :visible.sync="detailDialog">
            <p style="padding: 20px">表单ID：{{formsView.formId}} <span style="margin-left: 10px">版本号：{{formsView.newFormVersion}}</span>
            </p>
            <hr/>
            <div style="height: 500px;padding: 20px;overflow-y: auto">
                <div>
                    <iframe id="formView" scrolling="none" :src="src" frameborder="0" height="100%" width="100%"></iframe>
                </div>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import qzBase from '@_src/pages/mssq/common/util/qzBase';
    import associationDialog from '@_src/pages/mssq/bdgl/manage/edition-newForm';//关联表单

    export default {
        name: "associated-form",
        mixins: [qzBase],
        components: {
            associationDialog,
        },
        data() {
            return {
                association: false,
                actionUrl: '',
                rules: {},
                formId: '',
                versionId: '',
                detailDialog:false,
                formsView: {
                    formId: '',
                    newFormVersion: '',
                },
                src:''
            }
        },
        props: {
            type:{
                type: String,
                default: '',
            },
            itemInfoData: {
                type: Object,
                required: true,
            },
            flag: {
                type: Boolean,
                required: true,
            },
            itemInfo:{
                type: Object,
                default:()=>{
                    return {}
                }
            },
        },
        model: {
            prop: 'itemInfoData',
            event: 'change'
        },
        mounted(){
        },
        methods: {
            validate(callback) {
                this.$refs.itemInfoData.validate((valid) => {
                    if (valid) {
                        callback(true);
                    } else {
                        callback(false)
                    }
                });
            },
            servicesData(){
                this.itemInfoData.formId =  this.itemInfo.formId;
                this.itemInfoData.formVersionId =  this.itemInfo.formVersionId;
                this.itemInfoData.formName =  this.itemInfo.formName;
            },
            showFormDetail(row) {
                this.formId = row.formId;
                this.versionId = row.formVid;
                this.formsView.formId = row.formId;
                this.formsView.newFormVersion = row.formVersion;
                this.formDetail(row);
                this.detailDialog = true;
            },
            //查看表单
            formDetail(row) {
                var formId = row.formId;
                var versionId = row.formVid;
                var formUrl = this.Config.newform_url;
                let url = this.Config.baseContext + "/mssq/pmi/getNewFormVersionDetail";
                let param = {
                    formId: formId,
                    versionId: versionId,
                    formUrl: formUrl,
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
            confirm(val) {
                this.$set(this.itemInfoData, 'formId', val[0].formId);
                this.$set(this.itemInfoData, 'formName', val[0].name);
                this.$set(this.itemInfoData, 'formVersionId', val[0].id);
                this.association = false;
            },
            delFrom() {
                let formId = "";
                let formName = "";
                let newFormId = "";
                let newFormVid = "";
                let newFormName = "";
                let formIndex = this.formIndex;
                if (formIndex === -1) {
                    this.itemInfoData.formId = formId;
                    this.itemInfoData.formName = formName;
                    this.itemInfoData.newFormId = newFormId;
                    this.itemInfoData.newFormVid = newFormVid;
                    this.itemInfoData.newFormName = newFormName;
                } else {
                    var situations = this.itemInfoData.situations;
                    situations[formIndex].formId = formId;
                    situations[formIndex].formName = formName;
                    situations[formIndex].newFormId = newFormId;
                    situations[formIndex].newFormVid = newFormVid;
                    situations[formIndex].newFormName = newFormName;
                }
            },
        }
    }
</script>

<style scoped lang="less">
    .baseInfo {
        .title {
            .content {
                padding: 10px 0;
            }
            display: flex;
            justify-content: space-between;
            border-bottom: 1px solid #ccc;
        }

        .base-info-content {
            padding: 10px 0 0px;
            /*border-bottom: 1px solid #e2e2e2;*/

            .el-row {
                border-right: 1px solid #e2e2e2;
                border-bottom: none;
                min-height: 48px;
            }
        }
    }

    .statisticalForm {
        /deep/ .el-form-item__content {
            display: flex;
            .formName{
                min-height: 10px;
                min-width: 50px;
                display: inline-block;
                max-width: 100%;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                color: var(--primary, #409eff);
                cursor: pointer;
                vertical-align: middle;
            }
            .el-input {
                .el-input__inner {
                    border: 1px solid #dcdfe6 !important;
                }
            }
        }
    }
</style>