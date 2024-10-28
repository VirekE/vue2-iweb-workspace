<template>
	<!-- 材料管理 -->
	<div class="material" ref="tableH">
		<div>
			<div class="search-box">
				<Search :fieldData="fieldData" ref="srarch" @searchClick="searchClick"></Search>
			</div>
			<div class="tab-box">
				<el-table :data="catalogList" height="100%">
					<el-table-column type="index" label="排序" width="50"></el-table-column>
					<el-table-column label="一级索引名称" prop="primaryIndexName" show-overflow-tooltip width="160"
						min-width="160px"></el-table-column>
					<el-table-column label="二级索引名称" prop="parentName" show-overflow-tooltip width="220"
						min-width="160px"></el-table-column>
					<el-table-column label="三级索引码" prop="catalogCode" width="160"></el-table-column>
					<el-table-column label="三级分类（事件描述）" min-width="200" prop="catalogName" show-overflow-tooltip>
					</el-table-column>
					<el-table-column label="事项层级" prop="level" width="120" align="center" :formatter="formatterLevel">
					</el-table-column>
					<el-table-column label="状态" prolep="status" align="center" :formatter="formatterState" width="120">
						<template slot-scope="scope">
							<el-tag type="success"
								v-if="scope.row.status == 'EXAMINE_SUCCESS' || scope.row.status == 'PUBLISH' || scope.row.status == 'DISCARD'">
								{{formatterState(scope.row)}}</el-tag>
							<el-tag v-if="scope.row.status == 'DRAF'">{{formatterState(scope.row)}}</el-tag>
							<el-tag type="danger"
								v-if="scope.row.status == 'EXAMINE_FAIL' || scope.row.status == 'APPROVAL_FAIL'">
								{{formatterState(scope.row)}}</el-tag>
							<el-tag type="warning"
								v-if="scope.row.status == 'EXAMINE_WAIT' || scope.row.status == 'APPROVAL_WAIT'">
								{{formatterState(scope.row)}}</el-tag>
						</template>
					</el-table-column>
					<el-table-column label="报审部门名称" prop="deptName" min-width="200" show-overflow-tooltip></el-table-column>
					<el-table-column label="最后修改时间" prop="lastModifitionTime" :formatter="formatterDates" width="200"
						show-overflow-tooltip></el-table-column>
					<el-table-column label="操作" width="100" fixed="right">
						<template slot-scope="scope">
							<el-button type="text" @click="editMinor(scope.row,scope.row.status)" v-if="scope.row.status != 'EXAMINE_WAIT' && scope.row.status != 'APPROVAL_WAIT'">编辑</el-button>
							<el-button type="text" @click="editMinor(scope.row,scope.row.status)" v-else>审核</el-button>
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
	</div>
</template>

<script>
  import qzBase from '@_src/pages/mssq/common/util/qzBase';

  export default {
		name: "catalog-list",
		mixins: [qzBase],
		data() {
			return {
				fieldData: {
					primaryIndexName: {
						label: '一级索引',
						type: 'Input',
						placeholder: '请输入一级索引名称',
						value: '',
						span: 8,
					},
					parentName: {
						label: '二级索引',
						type: 'Input',
						placeholder: '请输入二级索引名称',
						value: '',
						span: 8
					},
					level: {
						label: '事项层级',
						type: 'Select', //类型
						placeholder: '请选择事项层级',
						value: '',
						span: 8, //布局比例
						selectList: []
					},
					catalogCode: {
						label: '三级索引码',
						type: 'Input',
						placeholder: '请输入三级索引码',
						value: '',
            itemWidth: '120px',
						span: 8
					},
					catalogName: {
						label: '三级分类',
						type: 'Input',
						labelWidth: '160px',
						placeholder: '请输入三级分类（事件描述）',
						value: '',
						span: 8,
					},
					/*manageType: {
						label: '管理类型',
						type: 'Select', //类型
						placeholder: '请选择管理类型',
						value: '',
						span: 6, //布局比例
						selectList: []
					},*/
					Button: {
						type: 'Button',
						span: 8
					}
				},
				catalogType: 1,
				busiType: {},
				searchFiled: {
					level: '',
					primaryIndexName: '',
					itemSource: '',
					catalogName: '', //目录名称
					catalogCode: '', //目录编码
					parentName: '' //类型
				},
				tableHeight: 100,
				catalogList: [],
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
			level() {
				return this.busiType['SSCJ']
			},
			manageType() {
				return this.busiType['MANAGE_TYPE']
			},
		},
		watch: {
			$route: {
				handler(val) {
					this.onQuery();
				},
				deep: true,
				immediate: true
			},
			level: {
				handler(list) {
					if (list) {
						let res = [];
						list.forEach((item) => {
							res.push({
								id: item.itemCode,
								name: item.itemValue
							})
						});
						this.fieldData.level.selectList = res
					}
				}
			},
		},
		mounted() {
			if(this.$route.path != this.$store.getters.searchParams.path) this.$store.dispatch("setSearchParams", {});
			if (!this.isEmptyObject(this.$store.getters.searchParams.data)) {
				this.$nextTick(() => {
					this.$refs.srarch.update('primaryIndexName', this.$store.getters.searchParams.data.primaryIndexName,false);
					this.$refs.srarch.update('parentName', this.$store.getters.searchParams.data.parentName,false);
					this.$refs.srarch.update('catalogName', this.$store.getters.searchParams.data.catalogName,false);
					this.$refs.srarch.update('catalogCode', this.$store.getters.searchParams.data.catalogCode,false);
					this.$refs.srarch.update('level', this.$store.getters.searchParams.data.level,false);
					this.catalogParams = this.$store.getters.searchParams.data;
					this.searchFiled = this.$store.getters.searchParams.data;
					this.onQuery();
					this.$store.dispatch("setSearchParams", {});
				})
			}else{
				this.onQuery();
			}
			// this.onQuery();
			this.queryDict("BUSI_TYPE,SSCJ,ITEM_STATUS,MANAGE_TYPE", res => {
				this.busiType = res;
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
			formatterLevel(row) {
				let level = row.level;
				if (JSON.stringify(this.busiType) !== '{}') {
					for (let i = 0; i < this.busiType['SSCJ'].length; i++) {
						if (this.busiType['SSCJ'][i].itemCode == level) {
							return this.busiType['SSCJ'][i].itemValue
						}
					}
				}
				return '-'
			},
			formatterManageType(row) {
				let manageType = row.manageType;
				if (JSON.stringify(this.busiType) !== '{}') {
					for (let i = 0; i < this.busiType['MANAGE_TYPE'].length; i++) {
						if (this.busiType['MANAGE_TYPE'][i].itemCode == manageType) {
							return this.busiType['MANAGE_TYPE'][i].itemValue
						}
					}
				}
				return '-'
			},
			formatterOrigin(row) {
				if (row.origin === 'shenzhen') {
					return '深圳'
				} else if (row.origin === 'pro') {
					return '省系统'
				} else {
					return '--'
				}
			},
			catalogTypes(v) {
				this.catalogType = v;
				this.onQuery();
			},
			onQuery() {
				var url = this.Config.baseContext + "/mssq/mssqCatalog/todoAuditList"
				// this.searchFiled.type = this.catalogType
				this.searchFiled.page = this.catalogParams.page
				this.searchFiled.limit = this.catalogParams.limit
				this.searchFiled.isAudit = this.$route.path == '/catalog/examine'?'0':'1';
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
			formatterState(row) {
				var status = row.status;
				var statusDict = this.busiType.ITEM_STATUS;
				if ((!this.isEmptyObject(this.busiType)) && this.busiType.ITEM_STATUS.length) {
					for (var i = 0; i < statusDict.length; i++) {
						if (statusDict[i].itemCode == status) {
							return statusDict[i].itemValue;
						}
					}
				}
				return "";
			},
			formatterDates(row) {
				return this.formatDate(row.lastModifitionTime, "yyyy-MM-dd HH:mm:ss");
			},
			search(type) {
				if (type == 'cz') {
					this.searchFiled.level = '';
					this.searchFiled.catalogName = '';
					this.searchFiled.catalogCode = '';
					this.searchFiled.parentName = '';
					this.searchFiled.primaryIndexName = '';
					this.searchFiled.itemSource = '';
					this.searchFiled.manageType = '';
				}
				this.onQuery();
			},
			searchClick(val) {
				this.searchFiled = {
					level: val.level.value,
					// manageType: val.manageType.value,
					primaryIndexName: val.primaryIndexName.value,
					parentName: val.parentName.value,
					catalogName: val.catalogName.value,
					catalogCode: val.catalogCode.value,
				};
				this.onQuery();
			},
			handleCurrentChange(val) {
				this.catalogParams.page = val;
				this.onQuery();
			},
			//编辑小项（审批小项(待审核),编辑小项）
			editMinor(row, status) {
				this.$store.dispatch("setSearchParams",{path:this.$route.path,data:Object.assign(this.searchFiled,{page:this.catalogParams.page,limit:this.catalogParams.limit})});
				var type = 'edit';
				if (status === 'APPROVAL_WAIT' || status == 'EXAMINE_WAIT') { //如果是待审核，从待办页面进入 type类型为todo 进行审核，否则则是编辑页面提供暂存和提交按钮
					type = 'todo';
				}
				this.$router.push({
					path: '/catalog/minor_edit',
					query: {
						id: row.id,
						catalogId: row.catalogId,
						type: type,
						pageType: 'todo'
					}
				});

			},
			//编辑大项
			editMajor(id, status) {
				console.log(status);
				var type = 'edit';
				if (status === 'APPROVAL_WAIT') { //如果是待审核，从待办页面进入 type类型为todo 进行审核，否则则是编辑页面提供暂存和提交按钮
					type = 'todo';
				}
				this.$router.push({
					path: '/catalog/major_edit',
					query: {
						id: id,
						type: 'todo'
					}
				});

			},
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
			}
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
