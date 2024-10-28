<style lang="less" src="@_src/pages/mssq/common/css/form.less" scoped></style>
<template>
    <div class="cardView">
		<div>
			<page-header subTitle="目录清单">
			</page-header>
			<div class="view" ref="getHeight">
				<el-tabs v-model="activeName">
					<el-tab-pane label="主项信息" name="info">
						<el-form ref="form" :model="cataLogInfo" :rules="rules" :disabled="!canEdit" label-width="180px" v-if="cataLogInfo.parentId =='self'">
							<div class="fromBox">
								<el-row>
									<el-col :span="24">
										<el-form-item label="注册类型" class="select">
											<el-radio-group v-model="cataLogInfo.parentId">
												<el-radio label="self">主项</el-radio>
											</el-radio-group>
										</el-form-item>
									</el-col>
								</el-row>
								<el-row>
									<el-col :span="24">
										<el-form-item label="一级索引名称" prop="primaryIndexName" class="select">
											<template slot="label">
												<span>一级索引名称</span>
												<el-tooltip class="item" effect="dark" content="" placement="top-start">
													<template slot="content">
														一级索引名称
													</template>
													<i class="el-icon-warning-outline"></i>
												</el-tooltip>
											</template>
											<el-input v-model="cataLogInfo.primaryIndexName" placeholder="请输入一级索引名称"></el-input>
										</el-form-item>
									</el-col>
								</el-row>
								<el-row>
									<el-col :span="24">
										<el-form-item label="一级索引码" prop="primaryIndex" class="select">
											<template slot="label">
												<span>一级索引码</span>
												<el-tooltip class="item" effect="dark" content="" placement="top-start">
													<template slot="content">
														一级索引码
													</template>
													<i class="el-icon-warning-outline"></i>
												</el-tooltip>
											</template>
											<el-input v-model="cataLogInfo.primaryIndex" placeholder="请输入一级索引码"></el-input>
										</el-form-item>
									</el-col>
								</el-row>
								<el-row>
									<el-col :span="24">
										<el-form-item label="主项名称" prop="catalogName" class="select">
											<template slot="label">
												<span>主项名称</span>
												<el-tooltip class="item" effect="dark" content="" placement="top-start">
													<template slot="content">
														政务服务诉求事项的具体名称，依据法律法规、部门规章等规范性文件进行梳理。名称中不能加入实施机关或实施主体的名称、地名和数字。国家省市县四级不同级别或同级别间相同事项名称应保持一致
													</template>
													<i class="el-icon-warning-outline"></i>
												</el-tooltip>
											</template>
											<el-input v-model="cataLogInfo.catalogName" placeholder="请输入主项名称"></el-input>
										</el-form-item>
									</el-col>
								</el-row>
								<el-row>
									<el-col :span="24">
										<el-form-item label="主项编码" class="select" prop="catalogCode">
											<template slot="label">
												<span>主项编码</span>
												<el-tooltip class="item" effect="dark" content="" placement="top-start">
													<template slot="content">
														主项编码为一级索引码+任意三个字符
													</template>
													<i class="el-icon-warning-outline"></i>
												</el-tooltip>
											</template>
											<div class="catalog">
												<p :class="$route.query.type == 'edit'?'':'catalogCodeDisabled'">{{cataLogInfo.primaryIndex}}</p>
												<el-input v-model="cataLogInfo.catalogCode" placeholder="请输入主项编码"></el-input>
											</div>
										</el-form-item>
									</el-col>
								</el-row>
								<el-row>
									<el-col :span="24">
										<el-form-item label="事项层级" prop="level">
											<template slot="label">
												<span>事项层级</span>
												<el-tooltip class="item" effect="dark" content="" placement="top-start">
													<template slot="content">
														可行使的层级，包括：市级、区（县）级、街（镇、乡）级、村（社区）级
													</template>
													<i class="el-icon-warning-outline"></i>
												</el-tooltip>
											</template>
											<el-select v-model="cataLogInfo.level" placeholder="请选择事项层级">
												<el-option :index="index" v-for="(item,index) in dictionary.SSCJ" :key="index" :value="item.itemCode" :label="item.itemValue"></el-option>
											</el-select>
										</el-form-item>
									</el-col>
								</el-row>
								<el-row>
									<el-col :span="24">
										<el-form-item label="设立依据" prop="catalogLaw">
											<template slot="label">
												<span>设立依据</span>
												<el-tooltip class="item" effect="dark" content="" placement="top-start">
													<template slot="content">
														创建事项的法律法规、地方性法律法规、职责清单、部门规章等规范性文件，按照国家、省、市的顺序写入
													</template>
													<i class="el-icon-warning-outline"></i>
												</el-tooltip>
											</template>
											<el-input type="textarea" :rows="3" v-model="cataLogInfo.catalogLaw" placeholder="请输入设立依据"></el-input>
										</el-form-item>
									</el-col>
								</el-row>
							</div>
						</el-form>
					</el-tab-pane>
					<el-tab-pane label="流转过程" name="circulation" v-if="$route.query.catalogId">
						<circulation-process v-if="activeName == 'circulation'" :parentHeight="parentHeight" @childHeight="childHeight"></circulation-process>
					</el-tab-pane>
					<el-tab-pane label="历史版本" name="history" v-if="$route.query.catalogId">
						<history-version></history-version>
					</el-tab-pane>
				</el-tabs>
			</div>
			<div class="footer" style="text-align:center">
				<template v-for="(item, index) in optData">
					<el-popover
						   :disabled="!item.popover"
							placement="top-start"
							title="说明"
							width="240"
							trigger="hover">
						<template v-for="val in item.content">
							<p>{{val}} </p>
						</template>
						<el-button slot="reference" :key="index" :icon="'iconfont '+item.icon" :type="item.type" @click="optClick(item.method)">{{item.name}}</el-button>
					</el-popover>
				</template>
			</div>
		</div>
    </div>
</template>
<script>
import qzBase from '@_src/pages/mssq/common/util/qzBase';
import PageHeader from '@_src/pages/mssq/common/components/page-header';
import BusinessCode from './business-code';
import OptObj from './optJs/opt-data.js'
import CirculationProcess from "./circulationProcess";
import HistoryVersion from "./history-version";
export default {
    mixins: [qzBase],
	components:{
        HistoryVersion,
        CirculationProcess,
		    PageHeader,
        // regulationList,
        BusinessCode
	},
    data(){
        let checkCatalogCode = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请输入任意三位'));
            } else if((value + this.cataLogInfo.primaryIndex).length !== 5){
              callback(new Error('主项编码为一级索引 + 3位字符组成的五位数'))
            }else{
                let url = this.Config.baseContext + '/mssq/mssqCatalog/verifyCatalogCode';
                this.$http_post(url, {
                    catalogCode: this.cataLogInfo.primaryIndex + value,
                    catalogId:this.$route.query.catalogId || '',
                }).then(ret => {
                    if(ret){
                        if(ret.state == 0){callback(new Error(ret.message));return;}
                        callback();
                    }else {
                        callback(new Error('编码重复'))
                    }
                });
            }
        };
        return {
            activeName:'info',
            uploadUrl:'',
            fltype:1,
            select:[],
            guidance:[],
            canEdit:false,
            dictionary:{

			},
			id:'',
            optData: [],
            parentId:'',
            cataLogInfo:{
                primaryIndexName:'',
                id:'',//主键id
				cataLogId:'',//目录唯一标识
                name:'',//目录名称
				code:'',//目录编码
				useLevel:[],//行使层级
				useAreaCode:'',//行使地域
				agentCode:'',
              agentName:'',
				businessCode:'',//行业指导部门
				businessName:'',//行业指导部门
				sysType:'',//系统类型
				planeStart:'',//计划生效日期
				planeCancle:'',//计划取消日期
				versionData:'',//目录版本创建时间
				version:'',//目录版本
				status:'',//状态
				origin:'shenzhen',//来源
				parentId:'self',//父项编码
                isYsqbl:'0',
				fileObj:[],//内部审批文件附件结构体
                addReason:'',
                cataLogQzqdList:[] //法律依据
            },
            parentHeight:0,
            rules: {
                catalogName: [
                    { required: true, message: '请填写主项名称', trigger: 'blur' }
                ],
                catalogCode: [
                    // { required: true, message: '请输入主项编码', trigger: 'blur' },
                    {required: true, validator: checkCatalogCode, trigger: 'blur' },
                ],
                primaryIndexName: [
                    { required: true, message: '请填写一级索引名称', trigger: 'blur' }
                ],
                primaryIndex: [
                    { required: true, message: '请填写一级索引码', trigger: 'blur' },
                    {min: 2, max: 2, message: '一级索引码长度必须为2位数', trigger: 'blur' }
                ],
                cataLogQzqdList: [
                    { required: true, message: '请添加设立依据', trigger: 'blur' }
                ],
				isYsqbl: [
                    { required: true, message: '请选择是否依申请办理', trigger: 'blur' }
                ],
            }
        }
    },
    computed:{
        /*canEdit(){
            var canEdit = false;
            const type = this.$route.query.type;
            if(this.isNotNull(type) && (type === 'edit')){
                const status = this.cataLogInfo.status;
                var curUser = this.$store.getters.curUser;
                var orgCode = curUser.orgCode;
                var deptNo = this.cataLogInfo.orgCode;
                if(!this.isNotNull(status)){// 为空可编辑
                    canEdit = true;
                }else if(status === 'DRAF' || status === 'APPROVAL_FAIL' || status === 'PUBLISH'){// 草稿状态，审核不通过状态 发布状态可编辑
					if(orgCode === deptNo){//事项部门和登录是同一部门才可编辑
                        canEdit = true;
                    }
                }
            }
            return canEdit;
		}*/
	},
    watch:{
        cataLogInfo:{
            handler : function (){

            },
            immediate:true
        }
    },
    methods:{
        initOptMethod(methodType){
            var that = this;
            that.optData = OptObj[methodType].optData;

            // 加载方法
            Promise.all([import('./optJs/'+methodType)]).then(([result]) => {
                const obj = result.default;
                that.optMethod = obj;
            }).catch((error) => {})
        },
        optClick(method){
            this.optMethod[method](this);//获取按钮
        },
		//文件上传
		handleRemove(file, fileList) {
            for(var i = 0;i<this.cataLogInfo.fileObj.length;i++){
                if(file.rcId == this.cataLogInfo.fileObj[i].rcId){
                    this.cataLogInfo.fileObj.splice(i,1);
                }
            }
		},
        handlePreview(file) {
            //下载
            var url = this.Config.rcPath+"/disk/"+file.rcId
            window.open(url);
        },
        onError(file){
            this.$message.error("文件上传失败!"+file.message);
		},
		handleExceed(files, fileList) {
            this.$message.warning('当前限制选择 3 个文件,共选择了 '+ fileList.length +' 个文件');
		},
        uploadSuccess(file) {
			//this.cataLogInfo.fileObj.push(file.row);
            var fileObj = this.cataLogInfo.fileObj;
			if (file.state == 1) {
                var tempFile = {};
                tempFile.name = file.row.fileName;
                tempFile.rcId = file.row.rcId;

                fileObj.push(tempFile);
                this.cataLogInfo.fileObj = fileObj;
			} else {
				fileObj = this.cataLogInfo.fileObj;
				fileObj.splice(fileObj.length-1,1);
                this.cataLogInfo.fileObj = fileObj;
                this.$message.error("文件上传失败!");
			}

		},
        uploadError() {
            this.$message.error("文件上传失败!");
		},
		beforeRemove(file) {
            return this.$confirm(`确定移除 ${ file.name }？`);
		},
        forSubmit(callback){
            let _this=this;
            this.$refs.form.validate((valid) => {
                if (valid) {
                    var fileObj = _this.cataLogInfo.fileObj;
                    var useLevel = _this.cataLogInfo.useLevel;
                    var paramuseLevel = '';
                    for (var i = 0;i < useLevel.length;i++) {
                        if (paramuseLevel != '') {
                            paramuseLevel+=',';
                        }
                        paramuseLevel += useLevel[i];
                    }
                    //this.cataLogInfo.useLevel = JSON.stringify(this.cataLogInfo.useLevel);
                    _this.cataLogInfo.useLevel = paramuseLevel;

                    //组装fileObj,去除不必要元素
                    var fileList = [];
                    for (var j = 0;j < _this.cataLogInfo.fileObj.length;j++) {
                        var fi = {};
                        fi.name = _this.cataLogInfo.fileObj[j].name;
                        fi.rcId = _this.cataLogInfo.fileObj[j].rcId;
                        fileList.push(fi);
                    }
                    _this.cataLogInfo.catalogCode = _this.cataLogInfo.primaryIndex + _this.cataLogInfo.catalogCode;
                    _this.cataLogInfo.fileObj =fileList;
					_this.saveInfos = JSON.parse(JSON.stringify(_this.cataLogInfo));
                    _this.saveInfos.fileObj = JSON.stringify(fileList);
                    callback(true);
                }else{
                    //弹框提示
                    if(this.cataLogInfo.name==""){
                        this.$message.error("主项名称不能为空!");
                    }else if(this.cataLogInfo.level==""){
                        this.$message.error("请选择行使层级!");
                    }
				}
            });
		},
        forSave(callback){
            var cataLogInfo=this.cataLogInfo;
            cataLogInfo=Object.assign({},cataLogInfo);
			//只校验部分
			if(this.cataLogInfo.catalogName==""){
				this.$message.error("主项名称不能为空!");
			}else {
				var fileObj = cataLogInfo.fileObj;
				var useLevel = cataLogInfo.useLevel;
				var paramuseLevel = '';
				for (var i = 0;i < useLevel.length;i++) {
					if (paramuseLevel != '') {
						paramuseLevel+=',';
					}
					paramuseLevel += useLevel[i];
				}
				//this.cataLogInfo.useLevel = JSON.stringify(this.cataLogInfo.useLevel);
				cataLogInfo.useLevel = paramuseLevel;
				//组装fileObj,去除不必要元素
				var fileList = [];
				for (var j = 0;j < cataLogInfo.fileObj.length;j++) {
					var fi = {};
					fi.name = cataLogInfo.fileObj[j].name;
					fi.rcId = cataLogInfo.fileObj[j].rcId;
					fileList.push(fi);
				}
                cataLogInfo.catalogCode = cataLogInfo.primaryIndex + cataLogInfo.catalogCode;
                cataLogInfo.fileObj = JSON.stringify(fileList);
                this.saveInfos=cataLogInfo;
				callback(true,'major');
			}
        },
        setDictionary(val){
            var dictionary = {};
            dictionary.SSCJ = val.SSCJ;
            dictionary.busiType = val['BUSI_TYPE'];
            dictionary.BUSINESS_CODE = val.BUSINESS_CODE;
            dictionary.SUB_TASK_TYPE = val.SUB_TASK_TYPE;
			this.dictionary =dictionary;
		},
        remove(type,index){
            if(type == "setUp"){
                this.$confirm('确定删除此项设立依据吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.cataLogInfo.cataLogQzqdList.splice(index,1);
                }).catch((e) => {
                    console.log(e)
                });
            }
            if(type == "implement"){
                this.$confirm('确定删除此项实施依据吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.ssyjTable.splice(index,1);
                }).catch((e) => {
                    console.log(e)
                });
            }
        },
        childHeight(){
            //获取父级高度传递给子级
            this.parentHeight = this.$refs.getHeight.offsetHeight;
        },
    },
    mounted(){
		//获取数据字典
        this.uploadUrl = this.Config.rcPath+'/upload';
        this.queryDictMap('BUSI_TYPE,SSCJ',this.setDictionary);
		const id = this.$route.query.id;
		if (this.isNotNull(id)) {
			var _this=this;
			var url = this.Config.baseContext+'/mssq/mssqCatalog/getCatalogByVid';
            this.cataLogInfo.id  = this.$route.query.id;
            var type = this.$route.query.type;
            this.$http_post(url,{
                catalogVid:id
            }).then(ret => {
               const cataLogInfo = ret.row;

               if (this.isNotNull(cataLogInfo.useLevel)) {
                   cataLogInfo.useLevel = JSON.parse('['+cataLogInfo.useLevel+']');
                   for (var i = 0;i < cataLogInfo.useLevel.length;i++) {
                       cataLogInfo.useLevel[i] =  ''+cataLogInfo.useLevel[i] ;
                   }
				} else {
                   cataLogInfo.useLevel = [];
				}
                cataLogInfo.catalogCode =  cataLogInfo.catalogCode.substring(cataLogInfo.primaryIndex.length,cataLogInfo.catalogCode.length);
				if (this.isNotNull(cataLogInfo.fileObj)) {
					cataLogInfo.fileObj = JSON.parse(cataLogInfo.fileObj);
				} else {
                    cataLogInfo.fileObj = [];
				}

                _this.cataLogInfo = cataLogInfo;
              /*  if(_this.cataLogInfo.status == 'APPROVAL_WAIT'){
                    this.initOptMethod("catalogAccept")
                }*/
                /*-----------------------加载底部按钮----------------------*/
                var status = _this.cataLogInfo.status;
               // var deptNo = _this.cataLogInfo.agentCode;
                //var curUser = this.$store.getters.curUser;
               // var agentCode = curUser.agentCode //部门权限的判断在后台接口限制
                var type = this.$route.query.type;
                //查看,加载返回按钮
                if(this.isNotNull(type) && type=='view'){
                    this.initOptMethod("defaultOpt")
                }else if(this.isNotNull(type) && type=='todo'){
					if(status === 'APPROVAL_WAIT'){//待办页面进入时，待审核状态type=todo加载审批按钮
                            this.initOptMethod("accept")
					}else if(status === 'DRAF'||status === 'APPROVAL_FAIL'){
                        this.initOptMethod("newCatalog")
						this.canEdit=true;
					}else{
                        this.initOptMethod("defaultOpt")
					}
				}else{//edit(包含新增大项，添加小项，变更，编辑)
					this.canEdit = true;
                    if(!this.isNotNull(status)||status==='DRAF'||status === 'APPROVAL_FAIL'||status === 'PUBLISH') {//状态为空是新增
                        this.initOptMethod("newCatalog")
                    }else{
                        this.initOptMethod("defaultOpt")
                    }
                }

            });
            //删除
            if(this.isNotNull(type) && type=='view'){
                this.initOptMethod("defaultOpt")
            }else if(this.isNotNull(type) && type=='todo'){
                if(status === 'APPROVAL_WAIT'){//待办页面进入时，待审核状态type=todo加载审批按钮
                    this.initOptMethod("accept")
                }else if(status === 'DRAF'||status === 'APPROVAL_FAIL'){
                    this.initOptMethod("newCatalog")
                    this.canEdit=true;
                }else{
                    this.initOptMethod("defaultOpt")
                }
            }else{//edit(包含新增大项，添加小项，变更，编辑)
                this.canEdit = true;
                if(!this.isNotNull(status)||status==='DRAF'||status === 'APPROVAL_FAIL'||status === 'PUBLISH') {//状态为空是新增
                    this.initOptMethod("newCatalog")
                }else{
                    this.initOptMethod("defaultOpt")
                }
            }
		} else {
            this.cataLogInfo.id  = '';
            this.canEdit = true;
            this.initOptMethod("newCatalog")

		}
    }
}
</script>
<style lang="less" scoped>
	.cardView{
		padding:10px 20px 10px 20px;
		&>div{
			background:#fff;
			height:100%;
			padding:0 14px;
		}
		.view{
			height:calc(100vh - 270px);
			overflow:auto;
           /deep/ .el-tabs{
                height: 100%;
                .el-tabs__content{
                    height: calc(100% - 60px);
                    overflow: auto;
                    .el-tab-pane{
                        height: 100%;
                    }
                }
            }
		}
		.el-form{
			.linkButton{
				float: right;
				font-size: 14px;
			}
		}
		.footer{
	        width:100%;
	        height:50px;
	        position:relative;
	        margin-top:30px;
            /deep/.el-popover__reference-wrapper{padding:0 10px;}
	        div{
	          position:absolute;
	          left:50%;
	          top:0;
	          transform: translateX(-50%);
	          /deep/button{
	            width:120px!important;
	          }
	        }
	    }
	}
	.page-header.divider{
		border:none;
	}
	.page-header{
		margin-bottom:10px;
	}
	.icon-tishi{
		color:#999;
		position:relative;
		top:3px;
	}
	.qz-dialog-padding{
		/deep/ .el-dialog__body{
			.laws{
				padding: 0;
				/deep/.el-table{
					.el-table__body-wrapper{
						max-height: calc(100vh - 400px)!important;
					}
				}
			}
		}
	}
    .select{

        /deep/.el-form-item__content{
            .catalog{
                display: flex;
                .catalogCodeDisabled{
                    background-color: #f5f7fa;
                    color: #c0c4cc;
                }
                .el-input{
                    .el-input__inner{
                       border: none;
                    }
                }
            }
            .el-input{
                .el-input__inner{
                    padding: 0;
                }
            }
            .el-radio-group{
                margin: 0!important;
            }
        }

    }
</style>
