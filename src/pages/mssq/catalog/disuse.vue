<template>
	<!-- 目录废置 -->
	<div class="material" ref="tableH">
		<div>

			<div class="search-box">
				<Search :fieldData="fieldData" ref="srarch" @searchClick="searchClick"></Search>
			</div>
			<div class="tab-box">
				<el-tabs v-model="activeStatus" @tab-click="onQuery">
					<el-tab-pane label="未废置目录" name="0">
						<span slot="label">未废置目录<span class="disUse" v-if="activeStatus == 0">{{catalogParams.records}}</span>
						</span>
					</el-tab-pane>
					<el-tab-pane label="已废置目录" name="1">
						<span slot="label">
							已废置目录<span class="disUse" v-if="activeStatus == 1">{{catalogParams.records}}</span>
						</span>
					</el-tab-pane>
				</el-tabs>
				<el-table :data="catalogList" style="width: 100%;" height="100%" class="qz-table-hide">
					<el-table-column type="index" label="排序" width="50"></el-table-column>
					<el-table-column label="一级索引名称" prop="primaryIndexName" show-overflow-tooltip></el-table-column>
					<el-table-column label="二级索引名称" prop="parentName" show-overflow-tooltip></el-table-column>
					<el-table-column label="三级索引码" prop="catalogCode" width="160"></el-table-column>
					<el-table-column label="三级分类（事件描述）" prop="catalogName" show-overflow-tooltip></el-table-column>
					<el-table-column label="事项层级" prop="level" align="center" width="100" :formatter="formatterLevel">
					</el-table-column>
					<el-table-column label="状态" prop="status" align="center" :formatter="formatterState" width="100">
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
					<el-table-column label="操作" width="160" fixed="right">
						<template slot-scope="scope">
							<!--只有发布状态才有创建事项和变更-->
							<el-button type="text" @click="viewMinor(scope.row)">查看</el-button>
							<el-button type="text" v-if="activeStatus == '0'"
								@click="editMinor(scope.row.id,scope.row.catalogId)">废置</el-button>
              <el-button type="text" v-if="activeStatus == '1'"
								@click="abandonedRestoration(scope.row.id)">废置还原</el-button>
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
  import option from '../common/components/option/index'

  export default {
		name: "register",
		mixins: [qzBase],
		data() {
			return {
				fieldData: {
					primaryIndexName: {
						label: '一级索引',
						type: 'Input',
						placeholder: '请输入一级索引名称',
						value: '',
						span: 8
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
					level: {
						label: '事项层级',
						type: 'Select', //类型
						placeholder: '请选择事项层级',
						value: '',
						span: 8, //布局比例
						selectList: []
					},
					Button: {
						type: 'Button',
						span: 8
					}
				},
				activeStatus: '',
				busiType: {},
				searchFiled: {
					catalogName: '', //目录名称
					catalogCode: '', //目录编码
					primaryIndexName: '', //类型
					level: '', //层级
					parentName: ''
				},
				tableHeight: 100,
				catalogList: [],
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
			}
		},
		computed: {
			level() {
				return this.busiType['SSCJ']
			},
		},
		watch: {
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
			}
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
			this.queryDict("BUSI_TYPE,SSCJ,ITEM_STATUS", res => {
				this.busiType = res;
			});
			//表格高度自适应
			this.$nextTick(() => {
				this.tableHeight = this.$refs.tableH.offsetHeight - 260;
			});
			window.onresize = () => {
				return (() => {
					this.tableHeight = this.$refs.tableH.offsetHeight - 260;
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
			onQuery() {
				var url = this.Config.baseContext + "/mssq/mssqCatalog/discardList";
				this.searchFiled.page = this.catalogParams.page;
				this.searchFiled.isDiscard = this.activeStatus;
				this.searchFiled.limit = this.catalogParams.limit;
				// this.searchFiled.deptNo = this.$store.getters.curUser.orgCode;
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
					level: val.level.value,
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
			//废置目录
			editMinor(id, catalogId) {
				let that = this;
				option.show({
					head: '废置原因',
					'requiredMsg': true,
					msg: '',
					onOkClick: function(res) {
						if (res == "") {
							that.$message.error("请填写废置原因!");
							return;
						}
            const rLoading = that.openLoading();
						let url = that.Config.baseContext + "/mssq/mssqCatalog/statusToDiscard";
						that.$http_post(url, {
							"catalogVid": id,
							"remark": res
						}).then(ret => {
							if (ret.state === 1) {
								that.onQuery();
								that.$message.success('废置目录成功')
							} else {
								that.$message.error(ret.message);
							}
              rLoading.close();
						});
					}
				})
			},
			viewMinor(row) {
				this.$store.dispatch("setSearchParams",{path:this.$route.path,data:Object.assign(this.searchFiled,{page:this.catalogParams.page,limit:this.catalogParams.limit})});
				this.$router.push({
					path: '/catalog/minor_edit',
					query: {
						id: row.id,
						catalogId: row.catalogId,
						type: 'view',
						pageType: 'edit',
					}
				});
			},
      abandonedRestoration(id){
        let that = this;
        option.show({
          head: '废置还原原因',
          'requiredMsg': true,
          msg: '',
          onOkClick: function(res) {
            if (res == "") {
              that.$message.error("请填写废置还原原因!");
              return;
            }
            const rLoading = that.openLoading();
            let url = that.Config.baseContext + "/mssq/mssqCatalog/statusBackDiscard";
            that.$http_post(url, {
              "catalogVid": id,
              "remark": res
            }).then(ret => {
              if (ret.state === 1) {
                that.onQuery();
                that.$message.success('废置目录还原成功')
              } else {
                that.$message.error(ret.message);
              }
              rLoading.close();
            });
          }
        })
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
				padding: 0 28px;
			}
		}

		.block {
			text-align: right;
			background: #fff;
		}
	}

	.programme-btn {
		display: flex;
		padding-left: 10px;
		justify-content: space-between;

		/deep/.el-popover__reference-wrapper {
			padding: 0 10px;
		}

	}
	.tab-box{
		// height: calc(100% - 200px);
		background:#fff;
		padding:0px 14px;
		.block{
			width:100%;
			padding:10px 0;
		}
	}
	
	.el-tabs{
		margin-top:6px;
		:deep(.el-tabs__header){
			margin: 0 0 10px !important;
		}
	}
	.disUse{
		margin-left: 5px;
		min-width: 30px;
		text-align: center;
		background: #f56c6c;
		color: #fff;
		border-radius: 20px;
		padding: 2px 8px;
		line-height: 14px;
		font-size: 12px;
		position: relative;
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
