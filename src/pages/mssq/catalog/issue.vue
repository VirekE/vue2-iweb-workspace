<template>
	<!-- 材料管理 -->
	<div class="material" ref="tableH">
		<div class="box">
			<div class="search-box">
				<Search :fieldData="fieldData" ref="srarch" @searchClick="searchClick"></Search>
			</div>
			<div class="tab-box">
				<el-table height="100%" :data="catalogList" style="width: 100%;"  class="qz-table-hide">
					<el-table-column type="index" label="序号" width="50"></el-table-column>
					<el-table-column label="一级索引名称" prop="primaryIndexName" show-overflow-tooltip></el-table-column>
					<el-table-column label="二级索引名称" prop="parentName" show-overflow-tooltip></el-table-column>
					<el-table-column label="三级索引码" prop="catalogCode" width="160"></el-table-column>
					<el-table-column label="三级分类（事件描述）" prop="catalogName" show-overflow-tooltip>
						<template slot-scope="scope">
							<div class="jump-title" @click="jumpCatalog(scope.row)">{{scope.row.catalogName}}</div>
						</template>
					</el-table-column>
					<el-table-column label="管理类型" prop="manageType" width="100" align="center" :formatter="manageFormat"
						show-overflow-tooltip>
						<template slot-scope="scope">
							<el-tag type="success" v-if="scope.row.manageType">{{manageFormat(scope.row)}}</el-tag>
							<span v-else></span>
						</template>
					</el-table-column>
					<!--                <el-table-column label="已下发部门数" prop="catalogName" show-overflow-tooltip></el-table-column>-->
					<el-table-column label="操作" width="150">
						<template slot-scope="scope">
							<!--都有查看-->
							<el-button type="text" @click="distri(scope.row)">下发区划</el-button>
							<el-button type="text" @click="cancel(scope.row)">取消下发</el-button>
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
		<el-dialog title="下发区划" width="50%" :close-on-click-modal=false class="qz-dialog-padding qz-law"
			:visible.sync="issueDialog">
			<p class="iusse">已下发区划</p>
			<div class="top-list">
				<span v-for="(item,index) in issueList" class="top-list-item choose">
					{{ item.regionName }}
				</span>
			</div>
      <p class="iusse">已选择区划</p>
      <div class="top-list">
				<span v-for="(item,index) in chooseList" class="top-list-item choose">
					{{ item.regionName }}
				</span>
			</div>
			<p class="iusse">未选择下发区划</p>
			<div class="top-list">
				<template class="top-list-item" v-for="(item,index) in configRegion">
					<el-button class="top-list-item noChoose" @click="choose(item,index)">{{ item.itemValue }}
					</el-button>
				</template>
			</div>
			<span slot="footer" class="dialog-footer">
				<el-button @click="issueDialog= false">取 消</el-button>
				<el-button type="primary" @click="saveIssue">确 定</el-button>
			</span>
		</el-dialog>
		<el-dialog title="已下发区划" width="50%" :close-on-click-modal=false class="qz-dialog-padding qz-law"
			:visible.sync="distributionDialog">
			<el-button @click="fbShow = !fbShow" size="small" type="primary" v-if="issueList.length>0">批量取消下发
			</el-button>
			<div class="top-list">
				<span v-for="(item,index) in issueList" class="top-list-item choose" v-if="!fbShow">
					{{ item.regionName }}
					<el-button @click="remove(item,index)" type="text" icon="el-icon-error"></el-button>
				</span>
				<el-checkbox-group v-model="checkList" v-if="fbShow">
					<el-checkbox v-for="(item,index) in issueList" :label="item">{{item.regionName}}</el-checkbox>
				</el-checkbox-group>
			</div>
			<span slot="footer" class="dialog-footer">
				<el-button @click="distributionDialog= false">取 消</el-button>
				<el-button type="primary" v-if="fbShow" @click="remove">确 定</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
  import qzBase from '@_src/pages/mssq/common/util/qzBase';

  export default {
		name: "issue",
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
					catalogCode: {
						label: '三级索引码',
						type: 'Input',
						placeholder: '请输入三级索引码',
						value: '',
						span: 8
					},
					catalogName: {
						label: '三级分类',
						type: 'Input',
						placeholder: '三级分类（事件描述）',
						value: '',
						span: 8
					},
					manageType: {
						label: '管理类型',
						type: 'Select', //类型
						placeholder: '请选择管理类型',
						value: '',
						span: 8, //布局比例
						selectList: []
					},
					Button: {
						type: 'Button',
						span: 8
					}
				},
				checkList: [],
				fbShow: false,
				configRegion: [],
				busiType: {},
				issuseData: {},
				issueDialog: false,
				searchFiled: {
					catalogName: '', //目录名称
					catalogCode: '', //目录编码
					primaryIndexName: '', //类型
					manageType: '', //层级
					parentName: ''
				},
				tableHeight: 100,
				catalogList: [],
				deptList: [],
				statusList: [{
					label: '全部',
					value: ''
				}, {
					label: '发布',
					value: '3'
				}, {
					label: '草稿',
					value: 'DRAF'
				}, {
					label: '待审核',
					value: 'APPROVAL_WAIT'
				}, {
					label: '废置',
					value: 'DISCARD'
				}], //调接口时删除
				catalogParams: {
					page: 1,
					limit: 10,
					total: 0
				},
				title: '',
				dialogVisible: false,
				activeIndex: '1',
				issueList: [],
        chooseList: [],
				defaultData: [],
				cancleList: {},
				distributionDialog: false,
			}
		},
		watch: {
			manageTypeData: {
				handler(list) {
					if (list) {
						let res = [];
						list.forEach((item) => {
							res.push({
								id: item.itemCode,
								name: item.itemValue
							})
						});
						this.fieldData.manageType.selectList = res
					}
				}
			},
		},
		mounted() {
			if(this.$route.path != this.$store.getters.searchParams.path) this.$store.dispatch("setSearchParams", {});
			if (!this.isEmptyObject(this.$store.getters.searchParams.data)) {
				this.$nextTick(() => {
					this.$refs.srarch.update('manageType', this.$store.getters.searchParams.data.manageType, false);
					this.$refs.srarch.update('primaryIndexName', this.$store.getters.searchParams.data.primaryIndexName, false);
					this.$refs.srarch.update('parentName', this.$store.getters.searchParams.data.parentName, false);
					this.$refs.srarch.update('catalogName', this.$store.getters.searchParams.data.catalogName, false);
					this.$refs.srarch.update('catalogCode', this.$store.getters.searchParams.data.catalogCode, false);
					this.catalogParams = this.$store.getters.searchParams.data;
					this.searchFiled = this.$store.getters.searchParams.data;
					this.onQuery();
					this.$store.dispatch("setSearchParams", {});
				})
			}else{
				this.onQuery();
			}
			this.queryDict("BUSI_TYPE,SSCJ,ITEM_STATUS,ITEM_STATUS,REGION,MANAGE_TYPE", res => {
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
		computed: {
			manageTypeData() {
				if (this.$store.getters.curUser.attrMap.REGION_CODE == '440301') { //通过440301判断是否展示列表
					if (JSON.stringify(this.busiType) !== '{}') {
						/*for (let i = 0; i < this.busiType.MANAGE_TYPE.length; i++) {
							if (this.busiType.MANAGE_TYPE[i].itemCode == 'C') {
								this.busiType.MANAGE_TYPE.splice(i, 1)
							}
						}*/
						return this.busiType.MANAGE_TYPE;
					}
				}
			},
		},
		methods: {
			manageFormat(row) {
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
			jumpCatalog(row) {
				this.$store.dispatch("setSearchParams", {path:this.$route.path,data:Object.assign(this.searchFiled,{page:this.catalogParams.page,limit:this.catalogParams.limit})});
				this.$router.push({
					path: '/catalog/minor_edit',
					query: {
						id: row.id,
						catalogId: row.catalogId,
						type: 'view',
						pageType: 'issue',
					}
				});
			},
			onQuery() {
				var url = this.Config.baseContext + "/mssq/mssqCatalog/getXfCatalogList";
				// this.searchFiled.type = '0';
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
			formatterState(row) {
				if ((!this.isEmptyObject(this.busiType)) && this.busiType.ITEM_STATUS.length > 0) {
					for (let i = 0; i < this.busiType.ITEM_STATUS.length; i++) {
						if (this.busiType.ITEM_STATUS[i].itemCode == row.status) {
							return this.busiType.ITEM_STATUS[i].itemValue
						}
					}
				}
			},
			searchClick(val) {
				this.searchFiled = {
					manageType: val.manageType.value,
					primaryIndexName: val.primaryIndexName.value,
					parentName: val.parentName.value,
					catalogName: val.catalogName.value,
					catalogCode: val.catalogCode.value,
				}
				this.onQuery();
			},
			handleCurrentChange(val) {
				this.catalogParams.page = val;
				this.onQuery();
			},
			remove(item) {
				let arr = [];
				if (!this.fbShow) {
					arr.push({
						regionCode: item.regionCode,
						regionName: item.regionName,
					})
				} else {
					if (this.checkList.length <= 0) {
						this.$message.error('请选择区划');
						return
					}
					for (let i = 0; i < this.checkList.length; i++) {
						arr.push({
							regionCode: this.checkList[i].regionCode,
							regionName: this.checkList[i].regionName,
						});
					}
				}
				let params = {
					catalogCode: this.cancleList.catalogCode,
					catalogId: this.cancleList.catalogId,
					catalogVid: this.cancleList.id,
					xfRegionDTOS: arr,
				};
				this.$confirm('是否取消下发当前区划，取消下发后当前区划已分拨事项将会变更废置状态?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					var url = this.Config.baseContext + "/mssq/mssqCatalog/deleteXfDeptByCatalogCode";
					this.$http_post(url, params, true).then(ret => {
						if (ret.state == 1) {
							this.getIssueList(this.cancleList);
              this.checkList = [];
						} else {
							this.$message.error(ret.message);
						}
					});
				})
			},
			saveIssue() {
				let xfRegionDTOS = this.chooseList;
				/*for (let i = 0; i < this.issueList.length; i++) {
					let flag = i;
					for (let j = 0; j < this.defaultData.length; j++) {
						if (this.issueList[i].regionCode == this.defaultData[j].regionCode) {
							flag = -1;
							break;
						}
					}
					if (flag != -1) {
						xfRegionDTOS.push(this.issueList[flag])
					}
				}*/
        if(!this.isNotNull(this.chooseList)){
          this.$message.error('请选择需要下发的区划');
          return
        }
				let url = this.Config.baseContext + '/mssq/mssqCatalog/saveXfDeptByCatalogCode';
				this.$http_post(url, {
					"catalogCode": this.issuseData.catalogCode,
					"catalogId": this.issuseData.catalogId,
					"catalogVid": this.issuseData.id,
					"xfRegionDTOS": this.chooseList
				}, true).then(ret => {
					if (ret.state == 1) {
						this.$message.success('下发成功');
						this.onQuery();
            this.chooseList = [];
						this.issueDialog = false;
					} else {
						this.$message.error(ret.message);
					}
				});
			},
			distri(row) {
				this.configRegion = [];
				this.issueDialog = true;
				this.issuseData = row;
				this.getIssueList(row);
			},
			cancel(row) {
				this.distributionDialog = true;
				this.cancleList = row;
				this.getIssueList(row);
			},
			getIssueList(row) {
				let url = this.Config.baseContext + '/mssq/mssqCatalog/selectXfListByCatalogId';
				this.$http_post(url, {
					limit: 10000,
					page: 1,
					catalogId: row.catalogId
				}).then(ret => {
					if (ret.state == 1) {
						this.defaultData = ret.rows;
						for (let i = 0; i < this.busiType['REGION'].length; i++) {
							let flag = i;
							for (let j = 0; j < ret.rows.length; j++) {
								this.$set(ret.rows[j], 'isShow', false);
								if (this.busiType['REGION'][i].itemCode == ret.rows[j].regionCode) {
									flag = -1;
									break;
								}
							}
							if (flag != -1 && this.busiType['REGION'][flag].itemCode !== '440301') {
								this.configRegion.push(this.busiType['REGION'][flag])
							}
						}
						this.issueList = JSON.parse(JSON.stringify(ret.rows));
					} else {
						this.$message.error(ret.message);
					}
				});
			},
			choose(val, index) {
				this.chooseList.push({
					regionCode: val.itemCode,
					regionName: val.itemValue,
					isShow: true,
				});
				this.configRegion.splice(index, 1);
			},
			removeIssuse(val, index) {
				this.configRegion.push({
					itemCode: val.regionCode,
					itemValue: val.regionName
				});
				this.issueList.splice(index, 1);
			},
			createItem(info) {
				this.$router.push({
					path: '/item/info',
					query: {
						catalogId: info.id,
						type: "edit",
					}
				});
			},
		},
		destroyed() {
			window.onresize = null;
		},
	}
</script>

<style scoped lang="less">
	.material {
		position: relative;
		height: 100%;

		&>div.box {
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
				padding: 0 28px;
			}
		}

		.block {
			text-align: right;
			background: #fff;
		}
	}

	.programme-btn {
		/deep/.el-popover__reference-wrapper {
			padding: 0 10px;
		}
	}

	.iusse {
		padding: 10px 0;
	}

	.top-list {
		margin-top: 10px;
		padding: 10px;
		overflow-y: auto;
		max-height: 200px;
		text-align: start;
		border: 1px #ccc dashed;

		.top-list-item {
			display: inline-block;
			line-height: 30px;
			margin: 5px 0 0 5px;
			padding: 0 10px;
			border-radius: 1px;
		}

		.choose {
			background: #F3F6FC;

			.el-button {
				padding: 0;
			}
		}

		.noChoose {
			width: 24%;
			margin: 5px 3px;
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
