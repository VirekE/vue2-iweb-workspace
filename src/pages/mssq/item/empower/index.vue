<template>
	<div class="cardView" ref="tableH">
		<div class="search-box">
			<Search @searchClick="searchClick" ref="srarch" :fieldData="fieldData"></Search>
		</div>
		<div class="view">
			<div class="text item">
				<el-tabs v-model="activeName" @tab-click="handleClick">
					<el-tab-pane label="可授权列表" name="0"></el-tab-pane>
					<el-tab-pane label="已授权列表" name="1"></el-tab-pane>
				</el-tabs>
				<el-table :data="tableData" style="width: 100%" height="100%" class="qz-table-hide">
					<el-table-column type="index" label="序号" width="50"></el-table-column>
					<el-table-column prop="selfAgentName" label="实施部门名称" width="140" show-overflow-tooltip></el-table-column>
					<el-table-column prop="itemCode" label="事项编码" show-overflow-tooltip></el-table-column>
					<el-table-column prop="itemName" label="事项名称" show-overflow-tooltip></el-table-column>
					<el-table-column prop="manageType" label="事项管理类型" width=160" show-overflow-tooltip>
					</el-table-column>
					<el-table-column prop="version" label="事项版本" width="100" align="center" show-overflow-tooltip>
					</el-table-column>
					<el-table-column prop="status" label="当前状态" align="center" width="120" show-overflow-tooltip
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
							<!--              可授权列表时展示授权按钮，一授权列表展示取消授权按钮-->
							<el-button type="text" v-if="activeName == '0'" @click="empower(scope.row)">授权</el-button>
							<el-button type="text" v-if="activeName == '1'" @click="cancle(scope.row)">取消授权</el-button>
						</template>
					</el-table-column>
				</el-table>
				<div class="block">
					<el-pagination @current-change="handleCurrentChange" :current-page.sync="itemParams.page"
						:page-size="itemParams.rows" layout="total,prev, pager, next, jumper" :total="itemParams.total">
					</el-pagination>
				</div>
			</div>
			<el-dialog title="授权" width="50%" :close-on-click-modal=false class="qz-dialog-padding qz-law"
				:visible.sync="empowerDialog" v-if="empowerDialog">
				<el-tree :data="empowerList" ref="treeForm" :props="defaultProps" node-key="id" show-checkbox
					@check="handleCheckChange"></el-tree>
				<span slot="footer" class="dialog-footer">
					<el-button @click="empowerDialog= false">取 消</el-button>
					<el-button @click="empowerConfirm" type="primary">确 定</el-button>
				</span>
			</el-dialog>
		</div>
	</div>
</template>

<script>
  import qzBase from '@_src/pages/mssq/common/util/qzBase';
  import OrganTree from '@_src/pages/mssq/common/components/organ'

  export default {
		name: "index",
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
						span: 8
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
						selectList: []
					},
					Button: {
						type: 'Button',
						span: 24
					}
				},
				empowerDialog: false,
				empowerData: {},
				empowerList: [],
				defaultProps: {
					children: 'children',
					label: 'name'
				},
				activeName: '0',
				dictMap: {},
				tableData: [],
				tabPosition: 'top',
				itemParams: {
					page: 1,
					rows: 10,
					total: 0
				},
				formInline: {
					itemName: '',
					itemCode: '',
					status: '',
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
			var curUser = this.$store.getters.curUser;
			// this.formInline.deptNo = curUser.orgCode;
			// this.formInline.deptName = curUser.orgName;
			this.$nextTick(() => {
				this.tableHeight = this.$refs.tableH.offsetHeight - 220;
			});
			window.onresize = () => {
				return (() => {
					this.tableHeight = this.$refs.tableH.offsetHeight - 220;
				})();
			};
			//加载字典
			this.queryDictMap("BUSI_TYPE,BUSI_GROUP,ITEM_STATUS,MANAGE_TYPE,REGION", (res) => {
				this.dictMap = res
				// this.itemCount();
			});
			//加载列表
			if(this.$route.path != this.$store.getters.searchParams.path) this.$store.dispatch("setSearchParams", {});
			if (!this.isEmptyObject(this.$store.getters.searchParams.data)) {
				this.$nextTick(() => {
					// this.activeName = this.$store.getters.searchParams.regionCode;
				  this.$refs.srarch.update('status', this.$store.getters.searchParams.data.status, false);
					this.$refs.srarch.update('itemCode', this.$store.getters.searchParams.data.itemCode, false);
					this.$refs.srarch.update('itemName', this.$store.getters.searchParams.data.itemName, false);
					this.formInline = {
						itemCode: this.$store.getters.searchParams.data.itemCode,
						itemName: this.$store.getters.searchParams.data.itemName,
					};
					this.itemParams = {
						page: this.$store.getters.searchParams.data.page,
						rows: this.$store.getters.searchParams.data.rows,
						total: this.$store.getters.searchParams.data.total
					};
					this.onQuery(this.formInline , this.itemParams);
					this.$store.dispatch("setSearchParams", {});
				})
			}else{
				var pageParam = this.itemParams
				var searchParam = this.formInline
				this.onQuery(pageParam, searchParam);
			}
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
				var url = this.Config.baseContext + "/mssq/mssqItemVersion/getAccreditList";
				// searchParam.deptNo = this.$store.getters.curUser.orgCode;
				var param = Object.assign({}, pageParam, searchParam);
				param.isAgent = this.activeName;
				this.$http_post(url, param).then(ret => {
					if (ret.state == 1) {
						this.tableData = ret.rows;
						this.itemParams.total = ret.records;
					} else {
						this.$message.error(ret.message);
					}
				});
			},
			onEditItem(id, type) {
				this.$store.dispatch("setSearchParams",{path:this.$route.path,data:Object.assign(this.formInline,{page:this.itemParams.page,rows:this.itemParams.rows})});
				//转跳事项梳理页面
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
			handleClick() {
				var pageParam = this.itemParams;
				var searchParam = this.formInline;
				this.onQuery(pageParam, searchParam);
			},
			handleCurrentChange(val) {
				this.itemParams.page = val;
				var pageParam = this.itemParams;
				var searchParam = this.formInline;
				this.onQuery(pageParam, searchParam)
			},
			queryByBusiType(val) {
				this.reload(); //重新加载表单
			},
			reload() {
				this.itemParams = {
					page: 1,
					total: 0,
					rows: 10
				};
				var pageParam = this.itemParams
				var searchParam = this.formInline
				this.onQuery(pageParam, searchParam);
				// this.itemCount()
			},
			searchClick(val) {
				this.formInline = {
					status: val.status.value,
					itemCode: val.itemCode.value,
					itemName: val.itemName.value,
				}
				this.reload();
			},
			formatterState(row) {
				if ((!this.isEmptyObject(this.dictMap)) && this.dictMap.ITEM_STATUS.length > 0) {
					for (let i = 0; i < this.dictMap.ITEM_STATUS.length; i++) {
						if (this.dictMap.ITEM_STATUS[i].itemCode == row.status) {
							return this.dictMap.ITEM_STATUS[i].itemValue
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
			chooseDep() {
				var _this = this
				OrganTree.show({
					head: '部门选择',
					isCheckbox: false,
					//深圳市编码440301区划编码穿空字符串，不为440301就传区划编码
					rootCode: this.$store.getters.curUser.attrMap.REGION_CODE == '440301' ? '' : this.$store
						.getters.curUser.attrMap.REGION_CODE,
					isRegion: false,
					regionDisabled: true,
					//removeCode: '160929095719',
					//isRadio:true,
					onOkClick: function(res) {
						_this.formInline.deptId = res.id;
						_this.formInline.deptName = res.name;
					}
				});
			},
			empower(row) {
				// this.$store.dispatch("setSearchParams",Object.assign(this.formInline,this.itemParams));
				let arr = [];
				this.empowerDialog = true;
				this.empowerData = row;
				var params = {
					'regionCode': '',
					'id': this.$store.getters.curUser.attrMap.SELF_DEPT_ID
				};
				this.loading = true;
				var url = this.Config.baseContext + '/mssq/pmi/getDeptListNew';
				this.$http_post(url, params).then((ret) => {
					if (ret.state == 1) {
						// for (let i = 0; i < ret.rows.length; i++) {
						// 	if (ret.rows[i].creditCode) {
						// 		arr.push(ret.rows[i])
						// 	}
						// }
						this.empowerList = ret.rows;
						this.loading = false;
					} else {
						this.loading = false;
						// rLoading.close();
						this.$message.error(ret.message);
					}
				});

				/* var _this = this;
				 OrganTree.show({
				   head: '授权',
				   isCheckbox: false,
				   //深圳市编码440301区划编码穿空字符串，不为440301就传区划编码
				   rootCode:  this.$store.getters.curUser.attrMap.REGION_CODE == '440301'?'':this.$store.getters.curUser.attrMap.REGION_CODE,
				   isRegion: false,
				   regionDisabled: false,
				   chooseId:this.$store.getters.curUser.attrMap.DEPT_ID,
				   //removeCode: '160929095719',
				   //isRadio:true,
				   onOkClick: function (res) {
				     var url = this.Config.baseContext + "/mssq/mssqItemVersion/toKslr";
				     _this.formInline.deptId = res.id;
				     _this.formInline.deptName = res.name;
				     this.$http_post(url, {
				       deptId:res.id,
				       deptName:res.name,
				       deptNo:res.code,
				       isAccredit:'1',
				       itemVid:row.itemVid
				     }).then(ret => {
				       if (ret.state == 1) {
				         this.$message.success('授权成功');
				         var pageParam = _this.itemParams
				         var searchParam = _this.formInline
				         _this.onQuery(pageParam, searchParam);
				       } else {
				         _this.$message.error(ret.message);
				       }
				     });
				     //
				   }
				 });*/
			},
			empowerConfirm() {
				var url = this.Config.baseContext + "/mssq/mssqItemVersion/toKslr";
				this.$http_post(url, {
					deptId: this.chooseData.id,
					deptName: this.chooseData.name,
					deptNo: this.chooseData.creditCode,
					isAccredit: '1',
					itemVid: this.empowerData.itemVid
				}).then(ret => {
					if (ret.state == 1) {
						this.$message.success('授权成功');
						this.empowerDialog = false;
						var pageParam = this.itemParams;
						var searchParam = this.formInline;
						this.onQuery(pageParam, searchParam);
					} else {
						this.$message.error(ret.message);
					}
				});
			},
			handleCheckChange(node, list) {
				if (list.checkedKeys.length == 2) {
					//单选实现
					this.$refs.treeForm.setCheckedKeys([node.id]);
				}
				this.chooseData = node;
			},
			cancle(row) {
				this.$alert('是否取消该事项授权', '提示?', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					showCancelButton: true,
				}).then(() => {
					var url = this.Config.baseContext + "/mssq/mssqItemVersion/toKslr";
					this.$http_post(url, {
						isAccredit: '0',
						itemVid: row.itemVid
					}).then(ret => {
						if (ret.state == 1) {
							this.$message.success('取消授权成功');
							var pageParam = this.itemParams;
							var searchParam = this.formInline;
							this.onQuery(pageParam, searchParam);
						} else {
							this.$message.error(ret.message);
						}
					});
				})
			}
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
			busiType() {
				return this.dictMap.BUSI_TYPE
			},
			itemStatus() {
				let arr = [];
				if ((!this.isEmptyObject(this.dictMap)) && this.dictMap.ITEM_STATUS.length > 0) {
					for (let i = 0; i < this.dictMap.ITEM_STATUS.length; i++) {
						if (this.dictMap.ITEM_STATUS[i].itemCode == 'DRAF' ||
							this.dictMap.ITEM_STATUS[i].itemCode == 'ACCEPT_WAIT' ||
							this.dictMap.ITEM_STATUS[i].itemCode == 'PUBLISH' ||
							this.dictMap.ITEM_STATUS[i].itemCode == 'DISCARD' ||
							this.dictMap.ITEM_STATUS[i].itemCode == 'EXAMINE_WAIT' ||
							this.dictMap.ITEM_STATUS[i].itemCode == 'EXAMINE_SUCCESS' ||
							this.dictMap.ITEM_STATUS[i].itemCode == 'EXAMINE_FAIL' ||
							this.dictMap.ITEM_STATUS[i].itemCode == 'DISCARD_WAIT' ||
							this.dictMap.ITEM_STATUS[i].itemCode == 'ACCEPT_FAIL' ||
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
		padding: 20px;
		position: relative;
		height: 100%;
		display:flex;
		flex-direction: column;
		.search-box {
			background: #fff;
			margin-bottom: 10px;
			width: 100%;
			padding: 10px 14px 0 14px;
		}
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
			/*display: flex;*/
			/*border: 1px solid #e2e2e2;*/
			flex:1;
			height: calc(100% - 200px);
			background:#fff;
			.item{
				padding:0 14px;
				display: flex;
				flex-direction: column;
				height:100%;
				.el-table{
					flex:1;
					height:calc(100% - 200px);
				}
				.block{
					padding:10px 0;
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
</style>
