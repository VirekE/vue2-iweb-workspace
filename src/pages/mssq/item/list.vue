<template>
	<div class="cardView" ref="tableH">
		<div class="search-box">
			<Search :fieldData="fieldData" ref="srarch" @searchClick="searchClick">
				<template slot="footer">
					<div class="addCatalog">
					<!--	<el-popover v-if="itemParams.total > 1000" placement="bottom" ref="gridTable" title="请选择导出数"
							width="240" trigger="click">
							<div style="height: 150px;overflow: auto">
								<div>
									<template v-for="(item,index) in exportData" v-if="exportData.length !== 0">
										<el-button @click="confirm(item,index)" :loading="loading" class="buttonIcon">
											<div v-if="exportIndex.indexOf(index) !== -1" class="buttons"><i
													class="el-icon-check"></i></div>
											{{item.label}}
										</el-button>
									</template>
									<div style="text-align: center" v-else>
										暂无导出的实施清单数据
									</div>
								</div>
							</div>
							<template>
								<el-button slot="reference" type="warning" size="small" icon="el-icon-download"
									class="export" @click="exportList">
									导出实施清单
								</el-button>
							</template>
						</el-popover>-->
						<el-button type="warning" size="small" icon="el-icon-download"
							@click="exportList">导出实施清单
						</el-button>
					</div>
				</template>
			</Search>
		</div>
		<div class="view">
			<el-card class="box-card box-right" shadow="never">
				<div class="text item">
					<el-table :data="tableData" style="width: 100%" height="100%" class="qz-table-hide">
						<el-table-column type="index" label="序号" width="50"></el-table-column>
						<el-table-column prop="selfAgentName" label="实施部门名称" width="140" show-overflow-tooltip>
						</el-table-column>
						<el-table-column prop="itemCode" label="事项编码" show-overflow-tooltip></el-table-column>
						<el-table-column prop="itemName" label="事项名称" show-overflow-tooltip></el-table-column>
						<el-table-column prop="version" label="事项版本" width="100" align="center" show-overflow-tooltip>
						</el-table-column>
						<el-table-column prop="status" label="当前状态" align="center" width="140" show-overflow-tooltip
							:formatter="formatterState">
							<template slot-scope="scope">
								<el-tag type="success"
									v-if="scope.row.status == 'EXAMINE_SUCCESS' || scope.row.status == 'PUBLISH' || scope.row.status == 'DISCARD'">
									{{formatterState(scope.row)}}</el-tag>
								<el-tag v-if="scope.row.status == 'DRAF'">{{formatterState(scope.row)}}</el-tag>
								<el-tag type="danger"
									v-if="scope.row.status == 'EXAMINE_FAIL' || scope.row.status == 'ACCEPT_FAIL'">
									{{formatterState(scope.row)}}</el-tag>
								<el-tag type="warning"
									v-if="scope.row.status == 'EXAMINE_WAIT' || scope.row.status == 'ACCEPT_WAIT'">
									{{formatterState(scope.row)}}</el-tag>
							</template>
						</el-table-column>
						<el-table-column label="操作" align="right" width="140px">
							<template slot-scope="scope">
								<!--都有查看-->
								<el-button type="text" @click="onEditItem(scope.row.itemVid,'view')">查看</el-button>
								<!--只有草稿才能编辑-->
								<el-button type="text"
									v-if="scope.row.status==='DRAF' || scope.row.status==='EXAMINE_FAIL' || scope.row.status==='ACCEPT_FAIL'"
									@click="onEditItem(scope.row.itemVid,'edit')">编辑
								</el-button>
								<!--只有发布才有变更-->
								<el-button type="text" v-if="scope.row.status==='PUBLISH'"
									@click="onEditItem(scope.row.itemVid,'edit')">变更
								</el-button>
							</template>
						</el-table-column>
					</el-table>
					<div class="block">
						<el-pagination @current-change="handleCurrentChange" :current-page.sync="itemParams.page"
							:page-size="itemParams.limit" layout="total,prev, pager, next, jumper"
							:total="itemParams.total">
						</el-pagination>
					</div>
				</div>
			</el-card>
		</div>
	</div>
</template>

<script>
	import qzBase from '@_src/pages/mssq/common/util/qzBase';

	export default {
		name: "list",
		mixins: [qzBase],
		components: {},
		data() {
			return {
				fieldData: {
					itemName: {
						label: '事项名称',
						type: 'Input',
						placeholder: '请输入事项名称',
						value: '',
						span: 8,
						itemWidth: '100px',
					},
					itemCode: {
						label: '事项编码',
						type: 'Input',
						placeholder: '请输入事项编码',
						value: '',
						span: 8
					},
					status: {
						label: '事项状态',
						type: 'Select', //类型
						placeholder: '请选择事项状态',
						value: '',
						span: 8, //布局比例
						selectList: [],
					},
					isPublish: {
						label: '是否发布',
						type: 'Select',
						placeholder: '请选择是否发布',
						value: '',
						span: 8,
            itemWidth: '100px',
						selectList: [{
							name:'全部',
							id:''
						},{
							name:'是',
							id:'1'
						},{
							name:'否',
							id:'0'
						}]
					},
          isDiscard: {
						label: '是否废置',
						type: 'Select',
						placeholder: '请选择是否废置',
						value: '',
						span: 8,
						selectList: [{
							name:'全部',
							id:''
						},{
							name:'是',
							id:'1'
						},{
							name:'否',
							id:'0'
						}]
					},
					Button: {
						type: 'Button',
						span: 8
					}
				},
				dictMap: {},
				busiType: [],
				tableData: [],
				tabPosition: 'top',
				itemParams: {
					page: 1,
					limit: 10,
					total: 0
				},
				formInline: {
					itemName: '',
					itemCode: '',
					status: '',
					manageType: '',
				},
				tableHeight: 100,
				item_menu: {
					height: ''
				},
				bgC: '',
				textC: '',
				itemLimit: 1000,
				exportData: [],
				loading: false,
				exportIndex: [],
			}
		},
		watch: {
			itemStatus: {
				handler(val) {
					let arr = [];
					for (let i = 0; i < val.length; i++) {
						arr.push({
							name: val[i].itemValue,
							id: val[i].itemCode,
						})
					}
					this.fieldData.status.selectList = arr;
				}
			},
		},
		mounted() {
			//表格高度自适应
			// let _this = this;
			if(this.$route.path != this.$store.getters.searchParams.path) this.$store.dispatch("setSearchParams", {});
			if (!this.isEmptyObject(this.$store.getters.searchParams.data)) {
				this.$nextTick(() => {
					// this.activeName = this.$store.getters.searchParams.regionCode;
					this.$refs.srarch.update('isPublish', this.$store.getters.searchParams.data.isPublish,false);
          this.$refs.srarch.update('isDiscard', this.$store.getters.searchParams.data.isDiscard, false);
          this.$refs.srarch.update('status', this.$store.getters.searchParams.data.status,false);
					this.$refs.srarch.update('itemName', this.$store.getters.searchParams.data.itemName,false);
					this.$refs.srarch.update('itemCode', this.$store.getters.searchParams.data.itemCode,false);
					this.formInline = this.$store.getters.searchParams.data;
					this.itemParams = this.$store.getters.searchParams.data;
					this.onQuery(this.formInline , this.itemParams);
					this.$store.dispatch("setSearchParams", {});
				})
			}else{
				var pageParam = this.itemParams
				var searchParam = this.formInline
				this.onQuery(pageParam, searchParam);
			}
			this.$nextTick(() => {
				this.tableHeight = this.$refs.tableH.offsetHeight - 220;
			});
			window.onresize = () => {
				return (() => {
					this.tableHeight = this.$refs.tableH.offsetHeight - 220;
				})();
			};
			//加载字典
			this.queryDictMap("BUSI_TYPE,BUSI_GROUP,ITEM_STATUS,MANAGE_TYPE,REGION,ITEM_TYPE", (res) => {
				this.dictMap = res
			});
			/* if(this.$store.getters.curUser.attrMap.DEPT_ID){
			     this.formInline.deptId = this.$store.getters.curUser.attrMap.DEPT_ID;
			 }else{
			     this.formInline.deptNo = this.$store.getters.curUser.orgCode;
			 }*/
			//加载列表
			// var pageParam = this.itemParams
			// var searchParam = this.formInline
			// this.onQuery(pageParam, searchParam);
		},

		methods: {
			orgCodeList(pageParam, searchParam) {
				var url = this.Config.baseContext + "/admin/pmi/orgCodeList";
				var param = Object.assign({}, pageParam, searchParam);
				this.$http_get(url, param).then(ret => {
					console.log(ret);
				});
			},
			handleOpen(key, keyPath) {
				console.log(key, keyPath);
			},
			handleClose(key, keyPath) {
				console.log(key, keyPath);
			},
			onQuery(pageParam, searchParam) {
				var url = this.Config.baseContext + "/mssq/mssqItemIndex/getItemList";
				// searchParam.deptNo = this.$store.getters.curUser.orgCode;
				var param = Object.assign({}, pageParam, searchParam);
				this.$http_post(url, param).then(ret => {
					if (ret.state == 1) {
						this.tableData = ret.rows;
						this.itemParams.total = ret.records;
						localStorage.setItem('total', ret.records);
					} else {
						this.$message.error(ret.message);
					}
				});
			},
			onEditItem(id, type) {
				//转跳事项梳理页面
				this.$store.dispatch("setSearchParams",{path:this.$route.path,data:Object.assign(this.formInline,
									{page:this.itemParams.page,limit:this.itemParams.limit})});
				this.$router.push({
					path: '/item/info',
					query: {
            id: id,
						type: type
					}
				});
			},
			onDelItem(itemVid) {
				this.$confirm('是否确认撤销当前事项变更？,撤回后将删除该变更记录！', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					let url = this.Config.baseContext + '/mssq/mssqItemVersion/toDelete';
					let param = {
						"itemVid": itemVid
					};
					this.$http_post(url, param).then(ret => {
						if (ret.state === 1) {
							this.$message.success(ret.message);
							this.reload();
						} else {
							this.$message.error(ret.message);
						}
					});
				}).catch((e) => {
					console.log(e);
				});
			},
			handleCurrentChange(val) {
				this.itemParams.page = val;
				var pageParam = this.itemParams;
				var searchParam = this.formInline;
				this.onQuery(pageParam, searchParam)
			},
			reload() {
				this.itemParams = {
					page: 1,
					total: 0,
					limit: 10
				};
				var pageParam = this.itemParams
				var searchParam = this.formInline
				this.onQuery(pageParam, searchParam);
			},
			searchClick(val) {
				this.formInline = {
					isPublish: val.isPublish.value,
          isDiscard: val.isDiscard.value,
					status: val.status.value,
					itemName: val.itemName.value,
					itemCode: val.itemCode.value,
				};
				this.reload();
			},
			exportList() {
					this.confirm({
						value: 1
					})
			},
			confirm(item, index) {
				let _this = this;
				const rLoading = this.openLoading('实施清单导出中，请稍等');
				this.loading = true;
				var url = this.Config.baseContext + "/mssq/mssqItemIndex/implementExport";
				this.$http_post(url, Object.assign({}, {}, this.formInline), null, 'blob').then(ret => {
					rLoading.close();
					if (ret.type == 'application/json') {
						const reader = new FileReader(); //创建一个FileReader实例
						reader.readAsText(ret, 'utf-8'); //读取文件,结果用字符串形式表示
						reader.onload = function() { //读取完成后,**获取reader.result**
							const msg = JSON.parse(reader.result);
							_this.$message.error(msg.message); //弹出错误提示
						};
						return;
					}
					let a = document.createElement('a');
					let url = window.URL.createObjectURL(ret);
					console.log(url)
					a.href = url;
					//设置文件名称
					var t = this.formatDate(new Date().getTime(), 'yyyyMMddHHmmss');
					let fileName = '实施清单' + t + '.xlsx';
					a.download = fileName;
					a.click();
					this.visible = false;
					this.$message.success('导出成功');
					this.loading = false;
				});
			},
			formatterState(row) {
				if ((!this.isEmptyObject(this.dictMap)) && this.dictMap.ITEM_STATUS.length > 0) {
					for (let i = 0; i < this.dictMap.ITEM_STATUS.length; i++) {
						if (this.dictMap.ITEM_STATUS[i].itemCode == row.status) {
							if(row.version > 1.0){
								return this.dictMap.ITEM_STATUS[i].itemCode == 'DRAF'? this.dictMap.ITEM_STATUS[i].itemValue+'（变更中）':this.dictMap.ITEM_STATUS[i].itemValue
							}
							return this.dictMap.ITEM_STATUS[i].itemCode == 'DRAF'? this.dictMap.ITEM_STATUS[i].itemValue:this.dictMap.ITEM_STATUS[i].itemValue
						}
					}
				}
			},
			colorCompute(sHex, alpha) {
				var reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
				/* 16进制颜色转为RGB格式 */
				let sColor = sHex.toLowerCase()
				if (sColor && reg.test(sColor)) {
					if (sColor.length === 4) {
						var sColorNew = '#'
						for (let i = 1; i < 4; i += 1) {
							sColorNew += sColor.slice(i, i + 1).concat(sColor.slice(i, i + 1))
						}
						sColor = sColorNew
					}
					// 处理六位的颜色值
					var sColorChange = []
					for (let i = 1; i < 7; i += 2) {
						sColorChange.push(parseInt('0x' + sColor.slice(i, i + 2)))
					}
					return 'rgba(' + sColorChange.join(',') + ',' + alpha + ')'
				} else {
					return sColor
				}
			},
		},
		computed: {
			themeStyle() {
				var style = {
					color: this.$store.getters.globalSetting.themeStyle,
					borderColor: this.$store.getters.globalSetting.themeStyle,
					backgroundColor: this.colorCompute(this.$store.getters.globalSetting.themeStyle, 0.1)
				};
				this.bgC = style.backgroundColor;
				this.textC = style.color;
				return style;
			},
			itemStatus() {
				let arr = [];
				if ((!this.isEmptyObject(this.dictMap)) && this.dictMap.ITEM_STATUS.length > 0) {
					for (let i = 0; i < this.dictMap.ITEM_STATUS.length; i++) {
						if (this.dictMap.ITEM_STATUS[i].itemCode == 'DRAF' ||
							this.dictMap.ITEM_STATUS[i].itemCode == 'ACCEPT_WAIT' ||
							this.dictMap.ITEM_STATUS[i].itemCode == 'PUBLISH' ||
							this.dictMap.ITEM_STATUS[i].itemCode == 'DISCARD' ||
							this.dictMap.ITEM_STATUS[i].itemCode == 'DISCARD_WAIT' ||
							this.dictMap.ITEM_STATUS[i].itemCode == 'ACCEPT_FAIL' ||
							this.dictMap.ITEM_STATUS[i].itemCode == 'EXAMINE_WAIT' ||
							this.dictMap.ITEM_STATUS[i].itemCode == 'EXAMINE_SUCCESS' ||
							this.dictMap.ITEM_STATUS[i].itemCode == 'EXAMINE_FAIL' ||
							this.dictMap.ITEM_STATUS[i].itemCode == 'DISCARD_FAIL') {
							arr.push(this.dictMap.ITEM_STATUS[i])
						}
					}
				}
				return arr;
			},
		},
		destroyed() {
			window.onresize = null;
		}
	}
</script>
<style lang='less' scoped>
	.cardView {
		position: relative;
		height: 100%;
		background: #f8f8f8;
		display: flex;
		flex-direction: column;

		.el-col {
			.form-btn {
				padding-left: 20px;
				text-align: end;

				/deep/ .el-form-item__content {
					/*display: flex;*/
					text-align: center;
					/*justify-content: end;*/
					/*justify-content: space-between;*/

					div {
						margin-right: 20px;
					}
				}
			}

			.el-select {
				width: 100%;
			}
		}

		.view {
			display: flex;
			flex: 1;
			height:calc(100% - 200px);
			.box-left {
				width: 200px;
				border: none;
				height: 100%;
				background: #fff;
				margin-right: 10px;
				/deep/ .el-card__header {
					padding: 14px 10px;
				}
				.title {
					width:100%;
					display:flex;
					align-items: center;
					justify-content: space-between;
					.left{
						display: flex;
						align-items: center;
						.icon {
							width:14px;
							height:14px;
							border-radius:50%;
							background:#3D91F7;
							display:flex;
							justify-content: center;
							align-items: center;
							margin-right:4px;
							i{
								color:#fff;
								font-size:12px;
							}
						}
						span{
							font-size:14px;
						}
					}
				}
				/deep/ .el-card__body {
					padding: 0;
					height:calc(100% - 50px);
					overflow-y: auto;
					.item {
						/*overflow: auto;*/
						height:100%;
						display: flex;
						flex-direction: column;
						height: 100%;
						background:#fff;
					}
				}
			}

			.box-right {
				border: none;
				border-radius: 0;
				display: inline-block;
				width: 100%;

				/deep/ .el-card__body {
					padding: 0;
					height:calc(100%);
					&>.item{
						height:100%;
						display: flex;
						flex-direction: column;
						height: calc(100%);
						background:#fff;
						padding:0px 14px;
						.block{
							padding:10px 0;
						}
					}
				}
			}
		}

		.el-menu {
			border-right: none;
			height: 100%;
		}

		/deep/ .el-menu-item {
			height: 40px;
			line-height: 40px;
		}

		/deep/ .el-menu-item.is-active {}
	}

	/deep/ .el-radio-button__inner {
		padding: 7px 22px !important;
		margin-right: 10px;
		border-radius: 0 !important;
	}

	.block {
		text-align: right;
		margin: 10px;
	}

	.el-menu-vertical-demo {
		.el-menu-item.is-active {
			color: #303133;
		}

		.el-menu-item {
			border-left: 3px solid transparent;

		}

	}

	.treeMenu {
		position: relative;

		.num {
			position: absolute;
			right: 20px;
			font-weight: 400;
			color: #999;
		}
	}

	.buttonIcon {
		position: relative;
		overflow: hidden;
		display: inline-block;
		height: 40px;
		line-height: 40px;
		width: 47.2%;
		padding: 0 10px;
		border: 1px solid #eee;
		margin: 5px;
		cursor: pointer;
		max-width: 100%;
		margin-left: 0 !important;
		text-overflow: ellipsis;
		white-space: nowrap;

		/deep/ .buttons {
			position: absolute;
			top: -20px;
			background: #67c23a;
			height: 40px;
			width: 40px;
			text-align: end;
			padding-left: 18px;
			padding-top: 4px;
			transform: rotate(45deg) translateY(1px);
			left: -20px;
			color: #fff;

			.el-icon-check {
				transform: rotate(-45deg);
				padding-left: 10px;
			}
		}

	}

	.export {
		margin-left: 10px;
	}

	.addCatalog {
		padding-left: 10px;
		/*position: absolute;*/
		/*right: 0;*/
	}
	.search-box {
		background: #fff;
		margin-bottom: 10px;
		width: 100%;
		/*display: flex;*/
		padding: 10px 14px 0 14px;
	
	}
</style>
