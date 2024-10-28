<template>
	<div class="cardBox">
		<div class="cardBody">
			<template v-if="qzqdType === 0">
				<base-info v-model="itemInfoData" :qzqd="qzqd" :flag="$route.query.type == 'view'"></base-info>
			</template>
			<template v-if="qzqdType === 1">
				<item-info v-model="itemInfoData" :qzqd="qzqd" ref="tab1" :type="$route.query.type"></item-info>
			</template>
			<template v-if="qzqdType === 2">
				<statistical ref="situationList" :qzqdSituationCode="qzqdSituationCode" v-model="itemInfoData">
				</statistical>
			</template>
			<div class="footer" style="text-align:center">
				<template v-for="(item, index) in optData">
					<el-popover v-if="item.name == '保存'" placement="top-start" title="说明" width="240" trigger="hover">
						<p> 1、点击“保存”，保存成功，则提示“保存成功”。</p>
						<p> 2、点击“保存”，保存失败，则提示“保存失败”。</p>
						<el-button slot="reference" :key="index" :icon="'iconfont '+item.icon" :type="item.type"
											 @click="optClick(item.method)">{{item.name}}</el-button>
					</el-popover>
					<el-button :key="index" v-else :icon="'iconfont '+item.icon" :type="item.type"
										 @click="optClick(item.method)">{{item.name}}</el-button>
				</template>
			</div>
		</div>
	</div>
</template>

<script>
  import itemApi from "../item/itemApi";
  import optData from "../item/optJs/opt-data";
  import OptObj from '../item/optJs/opt-data.js'
  import BaseInfo from "../item/components/info/components/base-info";

  import itemInfo from "../item/components/info/item-info";
  import statistical from "../item/components/statistical/item-statistical";


  export default {
		name: "info",
		components: {
			BaseInfo,
			itemInfo,
			statistical
		},
		mixins: [itemApi],
		data() {
			return {
				qzqd: true,
				tableData: [],
				tab4Visible: false,
				tab3Visible: false,
				curTab: '',
				itemInfoData: {},
				optData: [],
				qzqdType: 0,
				qzqdSituationCode: '',
			}
		},
		computed: {},
		mounted() {
			var itemVid = this.$route.query.itemVid;
			var catalogId = this.$route.query.catalogId;
			if (this.isNotNull(itemVid)) {
				//加载事项信息
				this.queryInfo(itemVid);
			} else if (this.isNotNull(catalogId)) {
				this.initOptMethod("editItem");
				this.catalogId = catalogId;
				//加载通用目录信息
				this.queryCatalogInfo(catalogId, 'Vid');
				this.editManageDialog = true;
			}
			//查询数据字典
			this.queryDictMap('BUSI_TYPE,SSCJ,MANAGE_TYPE,SSZTXZ,DAY_TYPE,CZPL', res => {
				this.$store.dispatch("setDict", res);
			});
		},
		methods: {
			queryInfo(itemVid) {
				var _this = this;
				if (this.isNotNull(itemVid)) {
					var url = this.Config.baseContext + "/mssq/mssqItemIndex/getItemInfoByItemVid";
					const rLoading = this.openLoading();
					this.$http_post(url, {
						"itemVid": itemVid
					}).then(ret => {
						if (ret.state == 1) {
							_this.itemInfoData = this.formatItemInfo(ret.row);
							console.log(_this.itemInfoData)
							_this.itemInfoData.canEdit = false;
							if (this.isNotNull(_this.itemInfoData.situationList)) {
								_this.tableData = _this.itemInfoData.situationList
							} else {
								_this.tableData.push({
									name: _this.itemInfoData.itemName,
									code: _this.itemInfoData.itemCode
								});
							}
							if (_this.itemInfoData.label) {
								// this.tagInfo(_this.itemInfoData.label);
							} else {
								this.itemInfoData.labelList = [];
							}
							if (_this.itemInfoData.version > 1) {
								this.tab3Visible = true;
								this.tab4Visible = true;
								if (_this.itemInfoData.regionCode === '440301' && (_this.itemInfoData
										.manageType === 'B' || _this.itemInfo.manageType === 'C')) {
									this.tab5Visible = true;
								}
							} else if (_this.itemInfoData.status != 'DRAF') {
								this.tab3Visible = true;
							}
							var status = _this.itemInfoData.status;
							var isNew = _this.itemInfoData.isNew;
							var curUser = this.$store.getters.curUser;
							this.itemInfoData.region = curUser.attrMap.REGION_CODE;
							var type = this.$route.query.type;
							this.queryCatalogInfo(_this.itemInfoData.catalogVid, 'Vid');
							if (isNew === '1') { //最新数据
								if (this.isNotNull(type) && type == 'view') {
									this.initOptMethod("defaultOpt");
									_this.itemInfoData.situations = this.proEditsituation(_this.itemInfoData
										.situations, type);
								} else {
									if (status === 'DRAF') {
										this.initOptMethod("editItem");
										_this.itemInfoData.canEdit = true;
									} else if (status === 'EXAMINE_WAIT') {
										if (this.isNotNull(type) && type == 'todo') {
											this.initOptMethod("examine")
										} else {
											this.initOptMethod("editItem")
											_this.itemInfoData.canEdit = true;
										}
									} else if (status === 'ACCEPT_WAIT') {
										if (this.isNotNull(type) && type == 'todo') {
											this.initOptMethod("accept")
										} else {
											this.initOptMethod("editItem")
											_this.itemInfoData.canEdit = true;
										}
									} else if (status === 'EXAMINE_FAIL' || status === 'ACCEPT_FAIL' || status ===
										'APPROVAL_FAIL' || status === 'PUBLISH') { //预审不通过
										this.initOptMethod("editItem")
										_this.itemInfoData.canEdit = true;
									} else {
										this.initOptMethod("defaultOpt")
									}
								}
							} else {
								if (this.isNotNull(type) && type == 'edit') {
									this.$message.info("当前版本非最新数据，不可编辑！");
								}
								this.initOptMethod("defaultOpt")
							}
						} else {
							this.$message.error(ret.message);
						}
						rLoading.close();
					}).catch(() => {
						rLoading.close();
					});
				}
			},
			jumpItemInfo(row) {
				if (this.isNotNull(this.itemInfoData.situationList)) {
					this.qzqdType = 2;
					this.qzqdSituationCode = row.code;
				} else {
					this.qzqdType = 1
				}

			},
			handleClick(tab, event) {
				this.curTab = tab.index;
				this.curTabTemp = tab.index;
				this.$refs.tab1.upDate();
				// this.$refs.tab2.setSelectItem(0,this.itemInfoData);

			},
			tagInfo(id) {
				var url = this.Config.baseContext + "/mssq/mssqLabel/getLabelInfo";
				this.$http_post(url, {
					labelIds: id
				}).then(ret => {
					if (ret.state == 1 && this.isNotNull(ret.rows)) {
						this.itemInfoData.label = this.formatCheckBoxKey(this.itemInfoData.label);
						this.itemInfoData.labelList = ret.rows;
					} else {
						this.$message.error('获取标签信息失败');
					}
				});
			},
			queryCatalogInfo(catalogId, type) {
				if (this.isNotNull(catalogId)) {
					var url = this.Config.baseContext + "/mssq/mssqCatalog/getCatalogByVid";
					let params = {
						"catalogVid": catalogId
					};
					if (type == 'id') {
						url = this.Config.baseContext + "/mssq/mssqCatalog/getCatalogByCatalogId";
						params = {
							"catalogId": catalogId
						};
					}
					this.$http_post(url, params).then(ret => {
						if (ret.state == 1) {
							this.catalogInfo = ret.row;
							this.itemInfoData.primaryIndexName = ret.row.primaryIndexName;
							this.itemInfoData.itemName = ret.row.catalogName;
							this.itemInfoData.primaryIndex = ret.row.primaryIndex;
							this.itemInfoData.catalogName = ret.row.catalogName;
							this.itemInfoData.catalogCode = ret.row.catalogCode;
							this.itemInfoData.catalogId = ret.row.catalogId;
							this.itemInfoData.parentName = ret.row.parentName;
							this.itemInfoData.parentCode = ret.row.parentCode;
							if (!this.itemInfo.level) {
								this.itemInfo.level = ret.row.level;
							}
							if (!this.itemInfo.catalogLaw) {
								this.itemInfo.catalogLaw = ret.row.catalogLaw;
							}
							if (!this.itemInfo.manageType) {
								this.itemInfo.manageType = ret.row.manageType;
							}
							if (!this.itemInfo.applyUserName) {
								this.itemInfo.applyUserName = 1;
							}
							if (!this.itemInfo.promiseHzUnit) {
								this.itemInfo.promiseHzUnit = '1'
							}
							this.itemInfoData.manageType = ret.row.manageType;
							// this.itemInfoData.deptName = this.$store.getters.curUser.orgName;
							// this.itemInfoData.deptCode = this.$store.getters.curUser.orgCode;
							if (!this.itemInfoData.bllc) {
								this.itemInfoData.bllc = {
									bllcNote: '',
									bllct: [],
								};
							}
						} else {
							this.$message.error('获取目录信息失败');
						}
					});
				}
			},

			initOptMethod(methodType) {
				var that = this;
				that.optData = OptObj[methodType].optData;
				// 加载方法
				Promise.all([import('../item/optJs/' + methodType), ]).then(([result]) => {
					const obj = result.default;
					that.optMethod = obj;
				}).catch((error) => {})
			},
			optClick(method) {
				// this.$refs.tab1.upDate();
				this.optMethod[method](this); //获取按钮
			},
		}
	}
</script>

<style scoped lang="less">
	.cardBox {
		padding: 10px;
		position: relative;
		/*height:100%;*/
		&>div{
			background:#fff;
			/*height:100%;*/
			padding:0 14px;
		}
		.title {
			.content {
				padding: 10px 0;
				border-bottom: 1px solid #ccc;
			}
		}

		.el-tabs--border-card {
			padding-bottom: 60px;
			height: 100%;

			/deep/ .el-tabs__content {
				padding: 0 15px;
				height: calc(100% - 39px);
				overflow: auto;

				.el-tab-pane {
					padding-bottom: 10px;
					height: 100%;
				}
			}
		}

		.footer {
			height: 60px;
			/*position: fixed;*/
			/*left: 225px;*/
			/*right: 15px;*/
			display: flex;
			align-items: center;
			justify-content: center;
			/*z-index: 9999;*/
			/*bottom: 15px;*/
			/*margin-top: 30px;*/

			div {
				position: absolute;
				left: 50%;
				top: 0;
				transform: translateX(-50%);

				/deep/ button {
					width: 120px !important;
				}
			}

			/deep/.el-popover__reference-wrapper {
				padding: 0 10px;
			}

		}

		/* .footer {
      width: 100%;
      height: 50px;
      position: absolute;
      left: 0;
      bottom: 0px;
      margin-top: 30px;

      div {
        position: absolute;
        left: 50%;
        top: 0;
        transform: translateX(-50%);

        /deep/ button {
          width: 120px !important;
        }
      }
      /deep/.el-popover__reference-wrapper{padding:0 10px;}

    }*/
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
</style>
