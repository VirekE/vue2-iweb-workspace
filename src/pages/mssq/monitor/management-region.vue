<template>
    <div>
			<div class="cardView">
				<page-header :subTitle="title">
				</page-header>
				<div class="view">
					<el-form ref="form" :model="info" label-width="180px">
						<div class="fromBox">
							<el-row>
								<el-col :span="12">
									<el-form-item label="系统名称">
										<el-input v-model="info.signName" readonly></el-input>
									</el-form-item>
								</el-col>
								<el-col :span="12">
									<el-form-item label="系统编码">
										<el-input v-model="info.signCode" readonly></el-input>
									</el-form-item>
								</el-col>
							</el-row>
							<el-row>
								<el-col :span="12">
									<el-form-item label="调用地址">
										<el-input v-model="info.targetUri" readonly></el-input>
									</el-form-item>
								</el-col>
								<el-col :span="12">
									<el-form-item label="调用状态">
										<el-input v-model="info.callStatus" readonly></el-input>
									</el-form-item>
								</el-col>
							</el-row>
							<el-row>
								<el-col :span="24">
									<el-form-item label="调用时间">
										<el-input v-model="info.callTime" readonly></el-input>
									</el-form-item>
								</el-col>
							</el-row>
							<el-row>
								<el-col :span="24">
									<el-form-item label="调用日志">
										<el-input type="textarea" v-model="info.callMessage" readonly></el-input>
									</el-form-item>
								</el-col>
							</el-row>
							<el-row>
								<el-col :span="24">
									<el-form-item label="请求参数">
										<el-input type="textarea" v-model="info.reqParam" readonly></el-input>
									</el-form-item>
								</el-col>
							</el-row>
							<el-row>
								<el-col :span="24">
									<el-form-item label="返回结果">
										<!-- <el-input type="textarea" v-model="row.resultContent" readonly></el-input> -->
										<el-button type="primary" size="small" @click="results = true">查看结果</el-button>
									</el-form-item>
								</el-col>
							</el-row>
						</div>
					</el-form>
				</div>
				<el-dialog title="返回结果" width="60%" :visible.sync="results" :close-on-click-modal=false >
					<div>
						<span>{{this.info.resultContent}}</span>
					</div>
					<span slot="footer" class="dialog-footer">
	          <el-button v-clipboard:copy="info.resultContent"
											 v-clipboard:success="onSuccess"
											 v-clipboard:error="onError">复制</el-button>
	          <el-button @click="results = false">关闭</el-button>
	        </span>
				</el-dialog>
			</div>
    </div>
</template>
<script>
import qzBase from '@_src/pages/mssq/common/util/qzBase'
import PageHeader from '@_src/pages/mssq/common/components/page-header'
export default {
    mixins: [qzBase],
	components:{
		PageHeader
	},
    data(){
        return {
            title:"",
            //类型
            type:"",
            id:"",
            info:{},
            results:false
        }
    },
    methods:{
        //点击复制
        onSuccess(e) {
            this.$message.success("复制到剪贴板成功！");
		},
		onError(e) {
            this.$message.error("复制到剪贴板失败！");
		},
        //获取详细数据
		getDetailInfo() {
            let url = this.Config.baseContext + "/mssq/mssqCall/getCallInfo";
            let param = {
							callId: this.id
            };
            const rLoading = this.openLoading();
            this.$http_post(url, param).then(ret => {
                rLoading.close();
                if (ret.state == 1) {
                    this.info = ret.row;
                    this.formatInfo();
                }else{
                    this.$message.error(ret.message);
                }
            }).catch(err => {
                rLoading.close();
                console.log(err);
            });
        },

        //格式化数据
        formatInfo() {
            if(this.info.callStatus==1) {
                this.info.callStatus = "成功";
            } else if(this.info.callStatus==0) {
                this.info.callStatus = "失败";
            }
            if(this.info.pullType==1) {
                this.info.pullType="增量"
            } else if(this.info.pullType==2){
                this.info.pullType="单条"
            }
            this.info.callTime = this.formatDate(this.info.callTime,'yyyy-MM-dd HH:mm:ss');
            this.info.lastParseTime = this.formatDate(this.info.lastParseTime,'yyyy-MM-dd HH:mm:ss');
            if(this.info.parseStatus==-1) {
                this.info.parseStatus = "解析失败";
            } else if(this.info.parseStatus==0) {
                this.info.parseStatus = "未解析";
            } else if(this.info.parseStatus==1) {
                this.info.parseStatus = "解析中";
            } else if(this.info.parseStatus==2) {
                this.info.parseStatus = "解析成功";
            }
        }
    },

    mounted(){
        this.type = this.$route.query.type;
        if(this.type=='dir') {
            this.title = "通用目录详情";
        } else if(this.type=='item') {
            this.title = "实施清单详情";
        }
        this.id = this.$route.query.id;
        //获取详细数据
        this.getDetailInfo();
    }

}
</script>
<!--<style lang="less" src="../css/form.less" scoped></style>-->
<style lang="less" scoped>
	.cardView{
		background: #fff !important;
		min-height: 100%;
		padding:10px 20px 10px 20px;
		.footer{
	        width:100%;
	        height:50px;
	        position:relative;
	        margin-top:30px;
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

	/*/deep/.el-textarea__inner{
		border:none;
	}*/
	/deep/.el-dialog__body{
		div{
			max-height:calc(100vh - 380px);
			overflow:auto;
		}
	}
</style>