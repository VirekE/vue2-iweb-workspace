<template>
	<!-- 材料管理 -->
	<div class="material" ref="tableH">
		<div>
	  <div class="search-box">
	  	<Search :fieldData="fieldData" ref="srarch" @searchClick="searchClick">
	  	  <template slot="footer">
	  	    <div class="downLoad">
	  	      <el-button type="primary" class="firstDownLoad"
	  	                 v-if="$store.getters.curUser.roleValue.indexOf('ZSJSH') != -1 && $store.getters.curUser.attrMap.REGION_CODE == '440301'"
	  	                 size="small" icon="el-icon-link" @click="downLoad">下载导入模板
	  	      </el-button>
	  	      <el-upload class="upload" ref="material"
	  	                 :action="uploadUrl"
	  	                 :on-remove="modelRemove"
	  	                 :before-upload="beforeUpload"
	  	                 :before-remove="modelBeforeRemove"
	  	                 :on-success="modelSuccess"
	  	                 :on-preview="onPreview"
	  	                 :on-progress="onProgress"
	  	                 :headers="uploadHeaders"
	  	                 :on-error="modelError"
	  	                 :file-list="fileList">
	  	        <el-button size="small" type="success"
	  	                   v-if="$store.getters.curUser.roleValue.indexOf('ZSJSH') != -1 && $store.getters.curUser.attrMap.REGION_CODE == '440301'"
	  	                   icon="el-icon-plus">导入目录清单
	  	        </el-button>
	  	      </el-upload>
	  	      <!--<el-popover
	  	              v-if="catalogParams.records > 1000"
	  	              placement="bottom"
	  	              title="请选择导出数"
	  	              ref="gridTable"
	  	              width="240"
	  	              trigger="click">
	  	        <div style="height: 150px;overflow: auto">
	  	          <div>
	  	            <template v-for="(item,index) in exportData" v-if="exportData.length !== 0">
	  	              <el-button @click="confirm(item,index)" :loading="loading" class="buttonIcon">
	  	                <div v-if="exportIndex.indexOf(index) !== -1" class="buttons"><i class="el-icon-check"></i>
	  	                </div>
	  	                {{item.label}}
	  	              </el-button>
	  	            </template>
	  	            <div style="text-align: center" v-else>
	  	              暂无导出的目录清单数据
	  	            </div>
	  	          </div>
	  	        </div>
	  	        <template>
	  	          <el-button slot="reference" type="warning" size="small" icon="el-icon-download" class="uploadButton" @click="exportList">
	  	            导出目录清单
	  	          </el-button>
	  	        </template>
	  	      </el-popover>-->
	  	      <el-button class="uploadButton" type="warning" size="small"
	  	                 icon="el-icon-download" @click="exportList">导出目录清单
	  	      </el-button>
	  	    </div>
	  	  </template>
	  	</Search>
	  </div>
			<div class="choose_search flex flex-sb">
				<div class="content">
					<div class="title">分类查询：</div>
					<div class="cell-content" :class="brandFold?'sit-auto':'sit-hidden'">
						<template v-for="(item,index) in primaryIndex">
							<el-popover v-if="item.id !== 'isAll'" popper-class="popover-catalog" class="popover" placement="bottom"
								:visible-arrow="false" width="200" trigger="click">
								<div slot="reference" class="cell" :class="index == firstIndex?'active':''"
									@click="showChildren(item,index)">
									<el-tooltip class="item" effect="dark" :content="item.name" placement="top">
										<span class="name">{{item.name}}</span>
									</el-tooltip>
									<div class="searchNums">{{item.value}}</div>
									<span class="downIcon"><i class="el-icon-caret-bottom"></i></span>
								</div>
								<div class="inputSearch">
									<el-input @input="inputSearch(parentList,'parent')" v-model="seachCatalog.second"
										placeholder="请输入二级索引名称" size="mini">
										<i slot="prefix" class="el-input__icon el-icon-search"></i>
									</el-input>
								</div>
								<div class="deptInfo-all">
									<template v-for="(org,index) in parent">
										<div class="deptInfo" @click="showSecondChildren(org,index)"
											:class="secondIndex == org.code?'active':''">
											<el-tooltip class="item" effect="dark" :content="org.name" placement="top">
												<div class="name">{{org.name}}</div>
											</el-tooltip>
											<div class="value">{{org.value}}</div>
										</div>
									</template>
								</div>
							</el-popover>
              <div v-if="item.id==='isAll'" class="popover cell" :class="firstIndex === -1?'active':''"
                   @click="resetParams">
                <el-tooltip class="item" effect="dark" :content="item.name" placement="top">
                  <span class="name">{{item.name}}</span>
                </el-tooltip>
                <div class="searchNums">{{item.value}}</div>
                <!--								<span class="downIcon"><i class="el-icon-caret-bottom"></i></span>-->
              </div>
						</template>
					</div>
				</div>
				<div v-if="primaryIndex.length > 6" class="shrink">
					<span @click="changeFoldState">{{!brandFold?'展开':'收起'}}</span>
					<el-link type="primary" @click="changeFoldState"><i
							:class="!brandFold? 'el-icon-arrow-down':'el-icon-arrow-up'"></i></el-link>
				</div>
			</div>
			
			<div class="view">
				<div class="text item">
					<el-table :data="catalogList" ref="singleTable" style="width: 100%;" :height="tableHeight"
						class="qz-table-hide">
						<el-table-column type="index" label="排序" width="50"></el-table-column>
						<el-table-column label="一级索引名称" prop="primaryIndexName" show-overflow-tooltip width="160"></el-table-column>
						<el-table-column label="二级索引名称" prop="parentName" show-overflow-tooltip width="320"></el-table-column>
						<el-table-column label="三级索引码" prop="catalogCode" width="170" ></el-table-column>
						<el-table-column label="三级分类（事件描述）" min-width="200px" prop="catalogName" show-overflow-tooltip>
							<template slot-scope="scope">
								<div class="jump-title" @click="viewMinor(scope.row)">{{scope.row.catalogName}}</div>
							</template>
						</el-table-column>
						<el-table-column label="事项层级" prop="level" width="100"
							:formatter="levelFormatter"></el-table-column>
<!--            <el-table-column label="所属平台" prop="owningPlatform" align="center" width="100" :formatter="formatterOwning">-->
<!--            </el-table-column>-->
						<el-table-column label="事项来源" prop="itemSource" width="150"></el-table-column>
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
	</div>
</template>

<script>
	import qzBase from '@_src/pages/mssq/common/util/qzBase';
	import uploadUtil from '@_src/utils/upload';

	export default {
		name: "catalog-list",
		mixins: [qzBase],
		data() {
			return {
				isSearch: false,
				isShowAll: false,
				brandFold: false,
				dynamicTags: [],
				busiType: {},
				fieldData: {
					primaryIndexName: {
						label: '一级索引名称',
						type: 'Input',
						placeholder: '请输入一级索引名称',
						value: '',
						span: 0
					},
					parentName: {
						label: '二级索引名称',
						type: 'Input',
						placeholder: '请输入二级索引名称',
						value: '',
						span: 0
					},
					catalogCode: {
						label: '三级索引码',
						type: 'Input',
						placeholder: '请输入三级索引码',
						value: '',
						span: 8,
						itemWidth: '110px'
					},
					catalogName: {
						label: '三级分类（事件描述）',
						type: 'Input',
						placeholder: '三级分类（事件描述）',
						value: '',
						span: 8,
						itemWidth:'175px',
					},
					level: {
						label: '事项层级',
						type: 'Select', //类型
						placeholder: '请选择事项层级',
						value: '',
						span: 8, //布局比例
						selectList: [],
					},
					itemSource: {
						label: '事项来源',
						type: 'Input', //类型
						placeholder: '请输入事项来源',
						value: '',
						span: 8, //布局比例
						selectList: [],
						itemWidth: '90px'
					},
          wordKey : {
						label: '全文检索',
						type: 'Input', //类型
						placeholder: '请输入全文检索',
						value: '',
						span: 0, //布局比例
						selectList: [],
						itemWidth: '90px'
					},
          owningPlatform: {
            label: '所属平台',
            type: 'Select', //类型
            placeholder: '请选择所属平台',
            value: '',
            span: 0, //布局比例
            selectList: [],
            itemWidth: '90px'
          },
					Button: {
						type: 'Button',
						span: 24
					}
				},
				searchFiled: {
					catalogName: '', //目录名称
					catalogCode: '', //目录编码
					primaryIndexName: '',
					parentName: '',
					itemSource: '',
					level: '', //类型
					isAll: '1', //是否全部
          wordKey: '' //全文检索
				},
				tableHeight: 100,
				catalogChooseList: [],
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
				fileList: [],
				uploadUrl: '',
				uploadHeaders: {},
				catalogLimit: 1000,
				catalogPage: '',
				exportData: [],
				exportCatalogDialog: false,
				loading: false,
				exportIndex: [],
				rLoading: false,
				seachCatalog: {
					first: '',
					second: '',
					third: ''
				},
				catalogThirdList: [],
				regionList: [],
				catalogList: [],
				primaryIndex: [],
				parent: [],
				parentList: [],
				catalog: [],
				firstIndex: -1,
				secondIndex: -1,
				thirdIndex: -1,
			}
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
			},
      owningPlatform: {
        handler(list) {
          if (list) {
            let res = [];
            list.forEach((item) => {
              res.push({
                id: item.itemCode,
                name: item.itemValue
              })
            });
            this.fieldData.owningPlatform.selectList = res
          }
        }
      }
		},
		mounted() {
      if(this.$route.path != this.$store.getters.searchParams.path) this.$store.dispatch("setSearchParams", {});
      if (!this.isEmptyObject(this.$store.getters.searchParams.data)) {
				this.$nextTick(() => {
					this.$refs.srarch.update('primaryIndexName', this.$store.getters.searchParams.data.primaryIndexName,false);
					this.$refs.srarch.update('wordKey', this.$store.getters.searchParams.data.wordKey,false);
					this.$refs.srarch.update('parentName', this.$store.getters.searchParams.data.parentName,false);
					this.$refs.srarch.update('catalogName', this.$store.getters.searchParams.data.catalogName,false);
					this.$refs.srarch.update('catalogCode', this.$store.getters.searchParams.data.catalogCode,false);
					this.$refs.srarch.update('level', this.$store.getters.searchParams.data.level,false);
					this.$refs.srarch.update('itemSource', this.$store.getters.searchParams.data.itemSource,false);
					this.catalogParams = this.$store.getters.searchParams.data;
					this.searchFiled = this.$store.getters.searchParams.data;
					this.onQuery();
					this.$store.dispatch("setSearchParams", {});
				})
			}else{
				this.onQuery();
			}
			window.getError = this.getError;
			this.queryDict("BUSI_TYPE,SSCJ,ITEM_STATUS,REGION,OWNING_PLATFORM", res => {
				this.busiType = res;
			});
			this.getCatalog();
			this.uploadUrl = this.Config.base_url + this.Config.baseContext + '/mssq/mssqCatalog/catalogImport';
			let headers = uploadUtil.setHeaders();
			headers['x-aep-token'] = this.$store.getters.token;
			this.uploadHeaders = headers;
			//表格高度自适应
			this.$nextTick(() => {
				this.tableHeight = this.$refs.tableH.offsetHeight - 500;
			});
			window.onresize = () => {
				return (() => {
					this.tableHeight = this.$refs.tableH.offsetHeight - 500;
				})();
			};
		},
		computed: {
			level() {
				return this.busiType['SSCJ']
			},
      owningPlatform() {
        return this.busiType['OWNING_PLATFORM']
      },
		},
		methods: {
			levelFormatter(row) {
				var type = row.level;
				if (JSON.stringify(this.busiType) !== '{}') {
					for (var i = 0; i < this.busiType['SSCJ'].length; i++) {
						if (this.busiType['SSCJ'][i].itemCode == type) {
							return this.busiType['SSCJ'][i].itemValue
						}
					}
				}
				return '-';
			},
      formatterOwning(row){
        let owningPlatform = row.owningPlatform;
        if (JSON.stringify(this.busiType) !== '{}') {
          for (let i = 0; i < this.busiType['OWNING_PLATFORM'].length; i++) {
            if (this.busiType['OWNING_PLATFORM'][i].itemCode == owningPlatform) {
              return this.busiType['OWNING_PLATFORM'][i].itemValue
            }
          }
        }
        return '-'
      },
			onQuery() {
				var url = this.Config.baseContext + "/mssq/mssqCatalog/selectCatalogList";
				this.searchFiled.page = this.catalogParams.page;
				this.searchFiled.limit = this.catalogParams.limit;
				this.$http_post(url, this.searchFiled).then(ret => {
					if (ret.state == 1) {
						// this.getCatalog();
						this.catalogList = ret.rows;
						this.catalogParams.records = ret.records;
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
					itemSource: val.itemSource.value,
          wordKey: val.wordKey.value,
					primaryIndexName: val.primaryIndexName.value,
					parentName: val.parentName.value,
					catalogName: val.catalogName.value,
					catalogCode: val.catalogCode.value,
          owningPlatform: val.owningPlatform.value,
				};
				this.seachCatalog.second = '';
				this.onQuery();
			},
			handleCurrentChange(val) {
				this.catalogParams.page = val;
				this.onQuery();
			},
			exportList() {
				// if (this.catalogParams.records < 1000 && this.catalogParams.records > 0) {
					this.confirm({
						value: 1
					})
				/*} else if (this.catalogParams.records == 0) {
					this.$message.warning('目录清单暂无数据，导出失败');
				} else {
					this.exportData = [];
					let num = '-1';
					// let obj = {};
					// this.exportCatalogDialog = true;
					if (this.catalogParams.records / this.catalogLimit !== 0) {
						num = JSON.stringify((this.catalogParams.records / this.catalogLimit) + 1)
					}
					let counstNum = this.catalogParams.records % this.catalogLimit;
					let numParams = Number(num.substring(0, num.indexOf('.')));
					for (let i = 0; i < numParams; i++) {
						this.exportData.push({
							value: i + 1,
							label: (i * this.catalogLimit + 1) + '-' + (i + 1 === numParams ? counstNum === 0 ?
								this.catalogLimit * (i + 1) : i * this.catalogLimit + counstNum : this
								.catalogLimit * (i + 1))
						});
					}
				}*/
			},
			confirm(item, index) {
				let _this = this;
				const rLoading = this.openLoading();
				// this.exportIndex.push(index);
				this.loading = true;
				var url = this.Config.baseContext + "/mssq/mssqCatalog/catalogExport";
				let params = JSON.parse(JSON.stringify(this.searchFiled));
				params.page = item.value;
				params.limit = this.catalogLimit;
				this.$http_post(url, params, null, 'blob').then(ret => {
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
					a.href = url;
					//设置文件名称
					var t = this.formatDate(new Date().getTime(), 'yyyyMMddHHmmss');
					let fileName = '目录清单' + t + '.xlsx';
					a.download = fileName;
					a.click();
					this.visible = false;
					this.$message.success('导出成功');
					this.loading = false;
				});
			},
			//编辑小项
			editMinor(id, val) {
				if ('addChildCata' == val) { //添加子项
					this.$router.push({
						path: '/catalog/minor_edit',
						query: {
							id: id,
							type: 'addChildCata',
							pageType: 'view',
						}
					});
				} else {
					this.$router.push({
						path: '/catalog/minor_edit',
						query: {
							id: id,
							type: 'edit',
							pageType: 'view',
						}
					});
				}

			},
			//查看子项
			viewMinor(row) {
				this.$store.dispatch("setSearchParams", {path:this.$route.path,data:Object.assign(this.searchFiled,{page:this.catalogParams.page,limit:this.catalogParams.limit})});
				this.$router.push({
					path: '/catalog/minor_edit',
					query: {
						id: row.id,
						catalogId: row.catalogId,
						type: 'view',
						pageType: 'catalogList',
					}
				});
			},
			//编辑主项
			editMajor(id) {
				if (this.isNotNull(id)) {
					this.$router.push({
						path: '/catalog/major_edit',
						query: {
							id: id,
							type: 'edit'
						}
					});
				} else {
					this.$router.push({
						path: '/catalog/major_edit',
						query: {
							type: 'edit'
						}
					});
				}

			},
			//查看主项
			viewMajor(row) {
				this.$router.push({
					path: '/catalog/major_edit',
					query: {
						id: row.id,
						catalogId: row.catalogId,
						type: 'view'
					}
				});
			},

			createItem(info) {
				let _this = this;
				var url = this.Config.baseContext + "/admin/itemQzqdVersion/verifyItem"
				this.$http_get(url, {
					"baseCode": info.code
				}).then(ret => {
					if (ret.state == 1) {
						_this.$router.push({
							path: '/sxsl/item',
							query: {
								catalogId: info.id,
								type: "edit",
							}
						});
					} else {
						this.$message.error(ret.message);
					}
				});
			},
			downLoad() {
        let rLoading = this.openLoading('目录清单模板下载中，请稍等');
				let url = '/qz-mssq/static/template/目录清单导入模板.xlsx';
				let link = document.createElement("a");
				link.style.display = "none";
				link.href = url;
				link.download = "目录清单导入模板.xlsx" || ""; // HTML5新增的属性
				document.body.appendChild(link);
				link.click(); // 点击下载
				document.body.removeChild(link); // 下载完成移除元素
				window.URL.revokeObjectURL(url); //释放掉blob对象
        rLoading.close();
			},
			modelRemove(file, fileList) {},
			modelBeforeRemove(file, fileList) {
				for (let i = 0; i < this.fileList.length; i++) {
					if (this.fileList[i].rcId == file.rcId) {
						this.fileList.splice(i, 1);
						return
					}
				}
			},
			modelSuccess(response, file, fileList) {
				this.rLoading.close();
				if (response.state == 1) {
					if (!response.row) {
						this.$message.warning(response.row);
						return
					}
					this.$notify({
						title: '目录导入详情',
						dangerouslyUseHTMLString: true,
						duration: 0,
						customClass: 'importCatalog',
						message: `<p class="successNum">当前导入成功<span class="num">${response.row.successNum}</span>条,</p>
                    <p class="errorNum">导入失败<span class="num">${response.row.errorNum}</span>条,</p>
                     <p class="notifyLink"><span onClick="getError('${response.row.erorrLogId}')">点击获取导入失败清单</span></p>`
					});
					this.onQuery();
				} else {
					this.$message.error(response.message);
				}
			},
			modelError(err, file, fileList) {
				this.$message.error(error.message);
			},
			onPreview(file) {

			},
			beforeUpload(file) {
				if (file.name.indexOf('.') != -1) {
					const Xls = file.name.split(".");
					if (Xls[Xls.length - 1] === "xls" || Xls[Xls.length - 1] === "xlsx" || Xls[Xls.length - 1] === "csv") {
						return file;
					} else {
						this.$message.error("请上传excel格式的文件!");
						return false;
					}
				}
				this.$message.error("请上传excel格式的文件!");
			},
			onProgress(file) {
				this.rLoading = this.openLoading();
			},
			getError(erorrLogId) {
				const rLoading = this.openLoading();
				var url = this.Config.baseContext + '/mssq/mssqCatalog/catalogExcel/' + erorrLogId;
				this.$http_post(url, {}, null, 'blob').then(ret => {
					rLoading.close();
					if (ret.state == 0) {
						this.$message.error(ret.message);
						return
					}
					let a = document.createElement('a');
					let url = window.URL.createObjectURL(ret);
					a.href = url;
					//设置文件名称
					var t = this.formatDate(new Date().getTime(), 'yyyyMMddHHmmss');
					let fileName = '导入失败目录清单' + t + '.xlsx';
					a.download = fileName;
					a.click();
					this.$message.success('导出成功');
				});
			},
			getCatalog() {
				var url = this.Config.baseContext + "/mssq/tj/listCatalog";
				// var param = Object.assign({}, pageParam, searchParam);
				let param = JSON.parse(JSON.stringify(this.searchFiled));
				delete param.primaryIndexName;
				delete param.parentName;
				delete param.page;
				delete param.limit;
				this.$http_post(url, param).then(ret => {
					this.catalogChooseList = ret.rows;
					this.primaryIndex = JSON.parse(JSON.stringify(ret.rows));
          this.primaryIndex.unshift({
            name: '全部',
            id:'isAll',
            value: this.catalogParams.records
          })
				});
			},
			merge(list, callback) {
				let arr = [];
				for (let i = 0; i < list.length; i++) {
					arr = arr.concat(list[i].children)
				}
				callback(arr)
			},
			inputSearch(list, type) {
				let obj = {
					primaryIndex: this.seachCatalog.first,
					parent: this.seachCatalog.second,
					catalog: this.seachCatalog.third,
				};
				let arr = [];
				for (let i = 0; i < list.length; i++) {
					if (list[i].name.indexOf(obj[type]) != -1) {
						arr.push(list[i])
					}
				}
				this.$set(this, type, arr)
				this[type] = arr;
			},
			showChildren(row, index) {
				this.firstIndex = index;
				this.parent = JSON.parse(JSON.stringify(row.children))
				this.parentList = JSON.parse(JSON.stringify(row.children))
				this.$refs.srarch.update('primaryIndexName', row.name,true);
        this.$refs.srarch.update('parentName', '',false);
			},
      resetParams(){
        this.firstIndex = -1
        this.$refs.srarch.resetForm('searchformData')
      },
			showSecondChildren(row, index) {
				if (this.secondIndex == row.code) {
					this.secondIndex = -1;
					this.thirdIndex = -1;
					this.$refs.srarch.update('parentName', '',true);
					this.catalog = JSON.parse(JSON.stringify(this.catalogThirdList));
				} else {
					this.secondIndex = row.code;
					this.thirdIndex = -1;
					this.$refs.srarch.update('parentName', row.name,true);
					this.catalog = JSON.parse(JSON.stringify(row.children));
					// this.catalogThirdList = JSON.parse(JSON.stringify(row.children));
				}
			},
			searchChildChildren(row, index) {
				if (this.thirdIndex == index) {
					this.thirdIndex = -1;
					this.$refs.srarch.update('catalogName', '',true);
				} else {
					this.thirdIndex = index;
					this.$refs.srarch.update('catalogName', row.name,true);
				}
				// this.$refs.srarch.update('catalogCode',row.code);
			},
			changeFoldState() {
				this.brandFold = !this.brandFold
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
		background: #f8f8f8;
		height: 100%;
		&>div{
			height:100%;
			display: flex;
			flex-direction: column;
		}
		.material-form {
			.el-col {
				.form-btn {
					/deep/ .el-form-item__content {
						margin-left: 20px !important;
					}
				}

				.el-select {
					width: 100%;
				}
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
			/*position: absolute;*/
			background: #fff;
			padding:10px 0;
		}
	}

	.buttons {
		text-align: end;

		div {
			display: inline-block;

			&.search {
				padding-right: 15%;
			}

			&.searchList {
				padding-right: 35%;
			}
		}
	}

	.programme-btn {
		/deep/ .el-popover__reference-wrapper {
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

	.downLoad {
		/*padding-left: 10px;*/
		display: flex;
		/*position: absolute;*/
		/*right: 0;*/
		align-items: center;
		/*justify-content: end;*/
		/*padding-bottom: 10px;*/
		.firstDownLoad{
			margin-left: 10px;
		}
		.upload {
			padding: 0 5px;

			/deep/ .el-upload-list {
				display: none;
			}
		}
		/deep/.uploadButton{
			width: 120px;
		}
	}

	.view {
		/*border: 1px solid #e2e2e2;*/
		flex:1;
		background:#fff;
		height: calc(100% - 200px);
		.item{
			height:100%;
			display: flex;
			flex-direction: column;
			padding:6px 14px;
		}
		.tree-left {
			font-size: 12px;
			width: 20%;
			border: none;
			/* &.tree-left{
         width: 15px;
       }*/

			/deep/ .el-card__header {
				position: relative;
				padding: 10px 20px;
				background: #f5f7fa;
				text-align: center;

				.title {
					font-weight: bold;
				}

				.showBoth {
					position: absolute;
					top: 0;
					right: 0;
				}
			}

			/deep/ .el-card__body {
				padding: 0;

				.item {
					display: flex;
					height: 100%;
					overflow: hidden;

					.first {
						padding: 5px;
						text-align: center;
						width: 100%;

						.primaryIndex {
							height: 100%;
							overflow: auto;
							padding-bottom: 55px;

							.auto {
								margin: 5px 0;
								cursor: pointer;
								padding: 5px;
								box-shadow: 0 2px 12px 0 #0000001a;

								&:hover {
									background: #eff7ff;
								}
							}
						}

						.cell {
							padding: 5px;
							display: flex;
							justify-content: space-between;
							border-bottom: 1px solid #c2c2c2;

							.content {
								white-space: nowrap;
								overflow: hidden;
								text-overflow: ellipsis;
							}
						}

						.el-input {
							.el-input__inner {
								height: 18px;
							}
						}

						.active {
							background: #eff7ff !important;
						}
					}
				}
			}
		}

		.box-left {
			font-size: 12px;
			width: 33%;
			border: none;
			/* &.tree-left{
         width: 15px;
       }*/

			/deep/ .el-card__header {
				padding: 10px 20px;
				position: relative;
				background: #f5f7fa;
				text-align: center;
				/*font-weight: bold;*/

				.title {
					font-weight: bold;
				}

				.showBoth {
					position: absolute;
					top: 0;
					right: 0;
				}
			}

			/deep/ .el-card__body {
				padding: 0;

				.item {
					display: flex;
					height: 100%;
					overflow: hidden;

					.third {
						width: 46% !important;
					}

					.first,
					.second,
					.third {
						padding: 5px;
						text-align: center;
						width: 27%;

						.primaryIndex {
							height: 100%;
							overflow: auto;
							padding-bottom: 55px;

							.auto {
								margin: 5px 0;
								cursor: pointer;
								padding: 5px;
								box-shadow: 0 2px 12px 0 #0000001a;

								&:hover {
									background: #eff7ff;
								}
							}
						}

						.cell {
							padding: 5px;
							display: flex;
							justify-content: space-between;
							/*padding: 5px 0;*/
							border-bottom: 1px solid #c2c2c2;

							.content {
								white-space: nowrap;
								overflow: hidden;
								text-overflow: ellipsis;
							}
						}

						.el-input {
							.el-input__inner {
								height: 18px;
							}
						}

						.active {
							background: #eff7ff;
						}
					}
				}
			}
		}

		.box-right {
			border: none;
			border-left: 1px solid #e2e2e2;
			border-radius: 0;
			display: inline-block;
			width: calc(100% - 33%);

			/deep/ .el-card__body {
				padding: 0;
			}
		}

		.tree-right {
			border: none;
			border-left: 1px solid #e2e2e2;
			border-radius: 0;
			display: inline-block;
			width: 100%;

			/deep/ .el-card__body {
				padding: 0;
			}
		}
	}

	.nums {
		color: #409eff;
	}

	// 选择区域
	.choose_search {
		position: relative;
		background: #fff;
		margin-bottom: 10px;
		width: 100%;
		/*display: flex;*/
		padding: 20px 10px 6px 16px;

		.content {
			display: flex;
			width: 90%;
			.cell-content {
				width: calc(100% - 90px);
				flex-wrap: wrap;
				display: flex;

				.popover {
					width: 16%;
					margin-bottom:14px;
				}
        .isAll{
          display: flex;
        }

				.cell {
					display: flex;
					/*width: 16%;*/
					align-items: center;
					cursor: pointer;
					.name{
						overflow:hidden; //超出的文本隐藏
						text-overflow:ellipsis; //溢出用省略号显示
						white-space:nowrap; //溢出不换行
					}
					&:hover {
						color: #208fff;

						.searchNums {
							background: #208fff;
							color: #fff;
						}

						.downIcon {
							color: #208fff;
						}
					}
          .isAll-cell {
            display: flex;
            width: 16%;
            align-items: flex-start;
            cursor: pointer;

            .name {
              overflow: hidden; //超出的文本隐藏
              text-overflow: ellipsis; //溢出用省略号显示
              white-space: nowrap; //溢出不换行
            }

            &:hover {
              color: #208fff;

              .searchNums {
                background: #208fff;
                color: #fff;
              }

              .downIcon {
                color: #208fff;
              }
            }

            .searchNums {
              margin-left: 5px;
              min-width: 30px;
              text-align: center;
              background: #E0E0E0;
              color: #050505;
              border-radius: 20px;
              padding: 2px 5px;
              line-height: 14px;
              font-size: 12px;
              position: relative;
              top: 1px;
            }

            .downIcon {
              padding-left: 5px;
            }

            &.active {
              .name {
                color: #208fff;
              }

              .searchNums {
                background: #208fff;
                color: #fff;
              }

              .downIcon {
                color: #208fff;
              }
            }
          }
					.searchNums {
						margin-left: 5px;
						min-width: 30px;
						text-align: center;
						background: #E0E0E0;
						color: #050505;
						border-radius: 20px;
						padding: 2px 5px;
						line-height: 14px;
						font-size: 12px;
						position: relative;
						top: 1px;
					}

					.downIcon {
						padding-left: 5px;
					}

					&.active {
						.name {
							color: #208fff;
						}

						.searchNums {
							background: #208fff;
							color: #fff;
						}

						.downIcon {
							color: #208fff;
						}
					}
				}

			}

			.sit-hidden {
				height: 30px;
				overflow: hidden;
			}

			.title {
				width: 90px;
				height: 20px;
				color: #5E5E5E;
				display: flex;
				align-items: center;
			}
		}

		.shrink {
			width: 70px;
			text-align: center;
			font-size: 14px;
			padding-bottom: 10px;

			.is-underline:hover:after {
				border: none;
			}

			span {
				cursor: pointer;
			}

			.el-link {
				margin-left: 5px;
				font-size: 14px;
				color:#666;
			}
		}
	}
	.search-box{
		position: relative;
		background: #fff;
		margin-bottom: 10px;
		width: 100%;
		/*display: flex;*/
		padding: 10px 14px 0 14px;
		
	}

	.deptInfo-all {
		height: 200px;
		overflow: auto;
	}

	.inputSearch {
		padding: 10px;
	}

	.deptInfo {
		display: flex;
		cursor: pointer;
		justify-content: space-between;
		align-items: center;
		padding: 10px 5px;

		/*border-bottom: 1px solid #ccc;*/
		.name {
			width: 80%;
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
		}

		&.active {
			background: #E3F1FF;
			color: #3D91F7;
		}

		&:hover {
			background: #E3F1FF;
			color: #3D91F7;
		}
	}

	.el-popover {
		padding: 0;
	}
</style>
