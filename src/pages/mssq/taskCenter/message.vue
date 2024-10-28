<template>
	<!-- 材料管理 -->
	<div class="material" ref="tableH">
		<div>
			<div class="search-box">
				<Search :fieldData="fieldData" ref="srarch" @searchClick="searchClick">
          <template slot="footer">
            <div class="isRead">
              <el-button type="warning" size="small" @click="changeParamsStatus">标为已读</el-button>
              <el-button type="success" size="small" @click="changeAllStatus">全部已读</el-button>
            </div>
          </template>
        </Search>
			</div>
			<div class="tab-box">
				<el-table :data="catalogList" height="100%" @selection-change="handleSelectionChange">
          <el-table-column
              type="selection"
              width="55">
          </el-table-column>
					<el-table-column align="center" width="90" label="状态">
						<template slot-scope="scope">
							<el-tooltip class="item" effect="dark" :content="tooltip(scope.row)" placement="top">
								<i class="table-status" :class="formatStatus(scope.row)"></i>
							</el-tooltip>
						</template>
					</el-table-column>
					<el-table-column label="标题" prop="messageTitle" show-overflow-tooltip>
						<template slot-scope="scope">
							<div class="jump-title" @click="jumpCatalog(scope.row)">{{scope.row.messageTitle}}</div>
						</template>
					</el-table-column>
					<el-table-column label="消息类型" prop="messageType" width="120" show-overflow-tooltip>
						<template slot-scope="scope">
							<el-tag>{{formatterMessage(scope.row)}}</el-tag>
						</template>
					</el-table-column>
				</el-table>
				<div class="block">
					<el-pagination @current-change="handleCurrentChange" :current-page.sync="catalogParams.page"
												 :page-size="catalogParams.limit" layout="total,prev, pager, next, jumper"
												 :total="catalogParams.records">
					</el-pagination>
				</div>
			</div>
		</div>
		<el-dialog
						class="modify-pwd"
						title="查看消息"
						:close-on-click-modal="false"
						:visible.sync="viewMessageDialog"
						v-if="viewMessageDialog"
						width="55%">
			<el-form :model="messageData" label-position="left" ref="ruleForm" label-width="70px" class="demo-ruleForm">
				<el-form-item label="标题" prop="oldPwd">
					<el-tooltip class="item" effect="dark" :content="messageData.messageTitle" placement="top">
						<div class="title">{{messageData.messageTitle}}</div>
					</el-tooltip>
				</el-form-item>
				<el-form-item label="发送单位" prop="checkPass">
					<el-tag type="warning">{{messageData.sendDeptName}}</el-tag>
				</el-form-item>
				<el-form-item label="消息类型" prop="pass">
					<el-tag>{{formatterMessage(messageData)}}</el-tag>
				</el-form-item>
				<el-form-item label="消息内容" prop="pass">
					<el-input v-model="messageData.messageContent" readonly type="textarea" :rows="3"></el-input>
				</el-form-item>
			</el-form>
		</el-dialog>
	</div>
</template>

<script>
  import qzBase from '@_src/pages/mssq/common/util/qzBase';

  export default {
		name: "message",
		mixins: [qzBase],
		data() {
			return {
				viewMessageDialog:false,
				fieldData: {
					messageTitle: {
						label: '标题',
						type: 'Input', //类型
						placeholder: '请输入标题',
						value: '',
						span: 8, //布局比例
						itemWidth: '50px',
					},
					status: {
						label: '状态',
						type: 'Select', //类型
						placeholder: '请选择状态',
						value: '',
						span: 8, //布局比例
						selectList: [{
							id:'',
							name:'全部'
						},{
							id:'0',
							name:'未读'
						},{
							id:'1',
							name:'已读'
						}]
					},
					messageType: {
						label: '消息类型',
						type: 'Select', //类型
						placeholder: '请选择消息类型',
						value: '',
						span: 8, //布局比例
						selectList: []
					},
					Button: {
						type: 'Button',
						span: 24
					}
				},
				messageData:{},
				catalogType: 1,
				getDict: {},
				searchFiled: {
				},
				tableHeight: 100,
				catalogList: [],
        chooseData: [],
				catalogParams: {
					page: 1,
					limit: 10,
					total: 0
				},
				title: '',
				dialogVisible: false,
				activeIndex: '1'
			}
		},
		computed: {
			messageType(){
				if(!this.isEmptyObject(this.getDict)){
					let list = JSON.parse(JSON.stringify(this.getDict['SMS_TYPE']	));
					list.unshift({itemCode:'',itemValue:'全部'})
					return list;
				}
				return [];
			},
		},
		watch: {
			messageType:{
				handler(val){
					let arr = [];
					for (let i = 0; i < val.length; i++) {
						arr.push({
							id:val[i].itemCode,
							name:val[i].itemValue
						})
					}
					this.fieldData.messageType.selectList = arr;
				}
			},
		},
		mounted() {
			if(this.$route.path != this.$store.getters.searchParams.path) this.$store.dispatch("setSearchParams", {});
			if (!this.isEmptyObject(this.$store.getters.searchParams.data)) {
				this.$nextTick(() => {
					this.$refs.srarch.update('messageTitle', this.$store.getters.searchParams.data.messageTitle,false);
					this.$refs.srarch.update('messageType', this.$store.getters.searchParams.data.messageType,false);
					this.$refs.srarch.update('status', this.$store.getters.searchParams.data.status,false);
					this.catalogParams = this.$store.getters.searchParams.data;
					this.searchFiled = this.$store.getters.searchParams.data;
					this.onQuery();
					this.$store.dispatch("setSearchParams", {});
				})
			}else{
				this.onQuery();
			}
			this.queryDict("SMS_TYPE", res => {
				this.getDict = res;
			});
			//表格高度自适应
			this.$nextTick(() => {
				this.tableHeight = this.$refs.tableH.offsetHeight - 210;
			});
			window.onresize = () => {
				return (() => {
					this.tableHeight = this.$refs.tableH.offsetHeight - 210;
				})();
			};
		},
		methods: {
			onQuery() {
				var url = this.Config.baseContext + "/mssq/mssqSms/selectSmsList"
				// this.searchFiled.type = this.catalogType
				this.searchFiled.page = this.catalogParams.page;
				this.searchFiled.limit = this.catalogParams.limit;
				this.$http_post(url, this.searchFiled).then(ret => {
					if (ret.state == 1) {
						this.catalogList = ret.rows;
						this.catalogParams.records = ret.records;
            window.getNums(ret.records);
					} else {
						this.$message.error(ret.message);
					}
				});
			},
			formatterMessage(row){
				let messageType = row.messageType;
				if (JSON.stringify(this.getDict) !== '{}') {
					for (let i = 0; i < this.getDict['SMS_TYPE'].length; i++) {
						if (this.getDict['SMS_TYPE'][i].itemCode == messageType) {
							return this.getDict['SMS_TYPE'][i].itemValue
						}
					}
				}
				return '-'
			},
			searchClick(val) {
				this.searchFiled = {
					messageType: val.messageType.value,
					messageTitle: val.messageTitle.value,
					status: val.status.value,
				};
				this.onQuery();
			},
			handleCurrentChange(val) {
				this.catalogParams.page = val;
				this.onQuery();
			},
			jumpCatalog(row){
				this.viewMessageDialog = true;
				this.getMessageInfo(row);
				if(row.status == '0') {this.changeStatus({ids:row.id,messageTitle:'',messageType:''},1,'read');}
			},
			formatStatus(row) {
				if (row.status == "1") {
					return "status-normal";
				}
				return "status-abnormal";
			},
			tooltip(row){
				let status = this.formatStatus(row);
				if(status == 'status-normal'){
					return '已读'
				}else if(status == 'status-abnormal'){
					return '未读'
				}
			},
			getMessageInfo(row){
				var url = this.Config.baseContext + "/mssq/mssqSms/selectSmsInfo";
				this.$http_post(url, {
					id:row.id
				}).then(ret => {
					if (ret.state == 1) {
						this.messageData = ret.row;
					} else {
						this.$message.error(ret.message);
					}
				});
			},
			changeTableStatus(row){
				this.$confirm('是否切换当前消息状态?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
          this.changeStatus({ids:row.id,messageTitle:'',messageType:''},1,'change')
        }).catch(()=>{
					this.onQuery();
				})
			},
      changeParamsStatus(){
        if(this.chooseData.length == 0){
          this.$confirm('将当前搜索条件'+this.catalogParams.records+'条数据切为已读?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.changeStatus({ids:'all',messageTitle:this.searchFiled.messageTitle,messageType:this.searchFiled.messageType},1,'change')
          })
        }else{
          this.$confirm('将当前选中'+this.chooseData.length+'条数据切为已读?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            let id = '';
            for (let i = 0; i < this.chooseData.length; i++) {
              if(id){
                id += ',' + this.chooseData[i].id
              }else{
                id = this.chooseData[i].id
              }
            }
            this.changeStatus({ids:id,messageTitle:'',messageType:''},1,'change')
          })
        }
      },
      changeAllStatus(){
          this.$confirm('将全部未读数据切为已读?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.changeStatus({ids:'all',messageTitle:'',messageType:''},1,'change')
          })
      },
      handleSelectionChange(val) {
        this.chooseData = val;
      },
			changeStatus(row,status,type){
				var url = this.Config.baseContext + "/mssq/mssqSms/editTypeRead";
				this.$http_post(url, {
					ids:row.ids,
					status:1
				}).then(ret => {
					if (ret.state == 1) {
						this.onQuery();
						if(type == 'change'){
							this.$message.success('状态修改成功');
						}
					} else {
						this.$message.error(ret.message);
					}
				});
			}
		}
	}
</script>

<style scoped lang="less">
	.material {
		position: relative;
		height: 100%;

		&>div {
			height: 100%;
			background: #f8f8f8;
			display: flex;
			flex-direction: column;

			.search-box {
				background: #fff;
				margin-bottom: 10px;
				width: 100%;
				padding: 10px 14px 0 14px;
        .isRead{
          position: absolute;
          right: 0;
        }
			}
		}
		&>.modify-pwd{
			background: none;
		}

		.el-menu-demo {
			margin-bottom: 15px;
			margin-top: -15px;

			.el-menu-item {
				margin-right: 20px;
				height: 52px;
				line-height: 52px;
			}
		}

		.block {
			text-align: right;
			height: 50px;
			z-index: 999;
			background: #fff;
		}
	}

	.programme-btn {
		text-align: center;
		padding-bottom: 10px;

		/deep/.el-popover__reference-wrapper {
			padding: 0 10px;
		}

	}

	.jump-title {
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
	.title{
		max-width: 100%;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	.status-normal {
		color: #67c23a
	}

	.status-abnormal {
		color: #f00
	}
	.table-status {
		font-style: normal;

		&:after {
			content: "\25CF";
			font-size: 26px;
			margin-top: -14px;
			display: inline-block;
			/*position: absolute;*/
		}
	}
	// table自适应
	.tab-box{
		flex:1;
		display: flex;
		flex-direction: column;
		height: calc(100% - 200px);
		background:#fff;
		padding:0px 14px;
		.block{
			padding:10px 0;
		}
	}
</style>
