<template>
	<div>
		<div class="choose_search flex flex-sb"
			v-if="$store.getters.curUser.attrMap.REGION_CODE === '440301' && ($store.getters.curUser.roleValue.indexOf('ZSJSH') != -1 ||$store.getters.curUser.roleValue.indexOf('ZSJBB') != -1)">
			<div class="content">
				<div class="title">区划：</div>
				<div class="cell-content" :class="brandFold?'sit-auto':'sit-hidden'">
					<template v-for="(item,index) in deptTree">
						<div class="popover">
							<div class="cell" :class="item.itemCode == regionsIndex?'active':''"
								@click="showPopover(item.itemCode)">
								<!--                <el-tooltip class="item" effect="dark" :content="item.itemValue" placement="top">-->
								<span class="name">{{item.itemValue}}</span>
								<!--                </el-tooltip>-->
							</div>
						</div>
					</template>
				</div>
			</div>
			<div v-if="deptTree.length > 6" class="shrink">
				<span @click="changeFoldState">{{!brandFold?'展开':'收起'}}</span>
				<el-link type="primary" @click="changeFoldState"><i
						:class="!brandFold? 'el-icon-arrow-down':'el-icon-arrow-up'"></i></el-link>
			</div>
		</div>
		<div class="label">
			<div class="item-view" v-for="(item,index) in cardList" :key="index">
				<div class="item" :class="bgColor(index)">

					<div class="left">
						<div class="name">{{item.name}}</div>
						<div class="num">{{item.value}}</div>
					</div>
					<div class="right">
						<img :src="item.icon">
					</div>
				</div>
			</div>
		</div>
		<div class="statistics">
			<div class="statistics-t">
				<div class="statistics-t-l">
					<div>
<!--						<div class="level">
							<p class="view-title">事项级别分析</p>
							<div class="echart-view">
								<div class="itemPriority" ref="matter"></div>
								<div class="item-con">
									<template v-for="item in matterList">
										<div class="itemLevelInfo">
											<div class="infoColor" :style="{background:item.color}"></div>
											<div class="content">{{item.name + '事项'}}：<span
													:style="{color:item.color}">{{item.value}}</span></div>
											<div>总占比：<span
													:style="{color:item.color}">{{getProportion(item,priorityTotal)}}%</span>
											</div>
										</div>
									</template>
								</div>
							</div>

						</div>
						<div class="business">
							<p class="view-title">业务类型分析</p>
							<div class="echart-view">
								<div class="itemPriority" ref="busiType"></div>
								<div class="item-con">
									<template v-for="item in busiTypeList">
										<div class="itemLevelInfo">
											<div class="infoColor" :style="{background:item.color}"></div>
											<div class="content">{{item.name + '事项'}}：<span
													:style="{color:item.color}">{{item.value}}</span></div>
											<div>总占比：<span
													:style="{color:item.color}">{{getBusiTypeProport(item,busiTypeTotal)}}%</span>
											</div>
										</div>
									</template>
								</div>
							</div>
						</div>-->
            <div class="matter">
              <p class="view-title">已授权本科室事项统计</p>
              <div class="echart-view">
                <div class="itemPriority">
                  <el-progress :stroke-width="14" type="circle" :percentage="Proportion(roleData)"
                               color="#FD8E00"></el-progress>
                </div>
                <div class="item-con">
                  <div class="itemLevelInfo">
                    <div class="infoColor"></div>
                    <div class="content">已授权事项数：<span>{{roleData}}</span></div>
                  </div>
                  <div class="itemLevelInfo">
                    <div class="infoColor"></div>
                    <div class="content">已授权事项占比：<span>{{Proportion(roleData)}}%</span></div>
                  </div>
                </div>
              </div>
            </div>
					</div>
				</div>
				<div class="statistics-t-r">
					<div>
						<div class="dept">
							<p class="view-title">已废置事项统计</p>
							<div class="echart-view">
								<div class="itemPriority">
									<el-progress :stroke-width="14" type="circle" :percentage="Proportion(moreDeptData)"
										color="#3D91F7"></el-progress>
								</div>
								<div class="item-con">
									<div class="itemLevelInfo">
										<div class="infoColor"></div>
										<div class="content">已废置事项数：<span>{{moreDeptData}}</span></div>
									</div>
									<div class="itemLevelInfo">
										<div class="infoColor"></div>
										<div class="content">已废置事项占比：<span>{{Proportion(moreDeptData)}}%</span></div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div class="statistics-b">
				<div class="type">
					<div class="type-view">
						<p class="view-title">实施类型事项统计</p>
						<div class="itemPriority" ref="task"></div>
					</div>
				</div>
			</div>
		</div>
		<div class="table">
			<p class="view-title">实施部门清单</p>
			<div class="table-h">
				<el-table :data="tableData" ref="singleTable" style="width: 100%;" class="qz-table-hide">
					<el-table-column type="index" label="排序" width="50"></el-table-column>
					<el-table-column label="部门" prop="deptName" align="center" show-overflow-tooltip width="500"></el-table-column>
					<el-table-column label="实施清单事项数" prop="total" show-overflow-tooltip align="center">
					</el-table-column>
					<el-table-column label="未发布事项数" prop="notPublish" show-overflow-tooltip align="center">
					</el-table-column>
					<el-table-column label="已发布事项数" prop="publishCount" show-overflow-tooltip align="center">
					</el-table-column>
					<el-table-column label="已授权本科室事项统计" prop="agentCount" show-overflow-tooltip align="center">
					</el-table-column>
				</el-table>
				<div class="block">
					<el-pagination @current-change="handleCurrentChange" :current-page.sync="params.page"
						:page-size="params.limit" layout="total,prev, pager, next, jumper" :total="params.total">
					</el-pagination>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
  import qzBase from '@_src/pages/mssq/common/util/qzBase';

  export default {
		mixins: [qzBase],
		data() {
			return {
				busiTypeTotal: -1,
				priorityTotal: -1,
				params: {
					page: 1,
					limit: 10,
					total: 1
				},
				deptTree: [],
				moreDeptData: '',
				itemData: '',
				TCData: '',
				roleData: '',
				regionsIndex: '',
				deptIdIndex: '',
				copyList: ['#00CE8D', '#3D91F7', '#FF504B'],
				busiTypeColor: ['#3D91F7', '#00CE8D', '#FF504B', '#6E5DFF', '#00CDEF', '#FD8E00'],
				brandFold: true,
				cardList: [],
				matterList: [],
				busiTypeList: [],
				tableData: [],
				myChartMatter: {},
				myChartBusiType: {},
				myChartTask: {},
				myChartTime: {},
				getDict: {},
			}
		},
		mounted() {
			let curUser = this.$store.getters.curUser
			if (curUser.attrMap.REGION_CODE === '440301' && (curUser.roleValue.indexOf('ZSJSH') != -1 || curUser.roleValue
					.indexOf('ZSJBB') != -1)) {
				this.regionsIndex = '';
			} else if (curUser.attrMap.REGION_CODE !== '440301' && (curUser.roleValue.indexOf('ZSJSH') != -1 || curUser
					.roleValue.indexOf('ZSJBB') != -1)) {
				this.regionsIndex = curUser.attrMap.REGION_CODE;
			} else {
        this.regionsIndex = curUser.attrMap.REGION_CODE;
				this.deptIdIndex = curUser.attrMap.SELF_DEPT_ID;
			}
			this.getQuery();
			this.queryDict("REGION,ITEM_PRIORITY,BUSI_TYPE,TASK_TYPE,DAY_TYPE", res => {
				this.getDict = res;
				this.regionData();
				this.getItemData();
				// this.getBusiTypeValue(v => {
				// 	this.getBusiType(v);
				// });
			/*	this.getPriorityValue(v => {
					this.getMatter(v);
				});*/
				this.getTaskTypeValue(v => {
					this.getTaskType(v);
				});
			/*	this.getTimeValue(v => {
					this.getTime(v);
				});*/
			});
			window.addEventListener("resize", () => {
				this.$nextTick(() => {
					// this.myChartMatter && this.myChartMatter.resize();
					// this.myChartBusiType && this.myChartBusiType.resize();
					this.myChartTask && this.myChartTask.resize();
					// this.myChartTime && this.myChartTime.resize();
				})
			});
		},
		computed: {
			Proportion() {
				return function(val) {
					if (val.value == 0 || this.itemData == 0) {
						return 0;
					}
					return (Math.round(val / this.itemData * 10000) / 100.00); // 小数点后两位百分比
				}
			},
			getProportion() {
				return function(val, total) {
					if (val.value == 0 || total == 0) {
						return 0;
					}
					return (Math.round(val.value / this.priorityTotal * 10000) / 100.00); // 小数点后两位百分比
				}
			},
			getBusiTypeProport() {
				return function(val, total) {
					if (val.value == 0 || total == 0) {
						return 0;
					}
					return (Math.round(val.value / this.busiTypeTotal * 10000) / 100.00); // 小数点后两位百分比
				}
			},
			bgColor(){
				return (index)=>{
					let color='primary'
					if(index==1){
						color= 'success'
					}else if(index==2){
						color= 'warning'
					}
					return color;
				}
			}
		},
		methods: {
			getQuery() {
				let url = this.Config.baseContext + '/mssq/tj/itemVersion/mssqItemListByRegion';
				this.$http_get(url, {
					page: this.params.page,
					limit: this.params.limit,
					regionCode: this.regionsIndex,
					selfDeptId: this.deptIdIndex
				}).then(ret => {
					if (ret.state == 1) {
						this.tableData = ret.rows;
						this.params.total = ret.records;
					}
				});
			},
			handleCurrentChange(val) {
				this.params.page = val;
				this.getQuery();
			},
			regionData() {
				this.getDict.REGION.unshift({
					itemCode: '',
					itemValue: '全部'
				});
				this.deptTree = this.getDict.REGION;
			},
			getItemData() {
				let obj = {
					item: require('../../../images/analys_1.svg'),
					publish: require('../../../images/analys_2.svg'),
					role: require('../../../images/analys_3.svg'),
					taskType: require('../../../images/analys_4.svg'),
				};
				var url = this.Config.baseContext + "/mssq/tj/itemVersion/countItemList";
				this.$http_get(url, {
					regionCode: this.regionsIndex,
					selfDeptId: this.deptIdIndex
				}).then(ret => {
					if (ret.state == 1) {
						for (let i = 0; i < ret.rows.length; i++) {
							this.$set(ret.rows[i], 'icon', obj[ret.rows[i].code]);
							if (!ret.rows[i].value) {
								ret.rows[i].value = 0;
							}
							if (ret.rows[i].code == 'TC') {
								ret.rows.splice(i, 1);
								i--
								// this.TCData = ret.rows[i].value;
							}
							if (ret.rows[i].code == 'item') {
								this.itemData = ret.rows[i].value;
							}
							if (ret.rows[i].code == 'role') {
								this.roleData = ret.rows[i].value;
							}
							if (ret.rows[i].code == 'taskType') {
								this.moreDeptData = ret.rows[i].value;
							}
						}
						this.cardList = ret.rows;
					}
				});
			},
			changeFoldState() {
				this.brandFold = !this.brandFold
			},
			showPopover(code) {
				this.getQuery();
				this.regionsIndex = code;
				this.getItemData();
				// this.getBusiTypeValue(v => {
				// 	this.getBusiType(v);
				// });
				/*this.getPriorityValue(v => {
					this.getMatter(v);
				});*/
				this.getTaskTypeValue(v => {
					this.getTaskType(v);
				});
				/*this.getTimeValue(v => {
					this.getTime(v);
				});*/
			},
			getPriorityValue(callback) {
				var url = this.Config.baseContext + "/mssq/tj/listItemCountByPriority";
				this.$http_post(url, {
					regionCode: this.regionsIndex,
					selfDeptId: this.deptIdIndex
				}).then(ret => {
					if (ret.state == 1) {
						let arr = [];
						let num = 0;
						for (let i = 0; i < this.getDict['ITEM_PRIORITY'].length; i++) {
							let flag = -1;
							for (let j = 0; j < ret.rows.length; j++) {
								if (this.getDict['ITEM_PRIORITY'][i].itemCode == ret.rows[j].code) {
									flag = j
								}
							}
							if (flag != -1) {
								num += ret.rows[flag].value;
								arr.push({
									color: this.copyList[i],
									name: this.getDict['ITEM_PRIORITY'][i].itemValue,
									code: ret.rows[flag].code,
									value: ret.rows[flag].value
								})
							} else {
								arr.push({
									color: this.copyList[i],
									name: this.getDict['ITEM_PRIORITY'][i].itemValue,
									code: this.getDict['ITEM_PRIORITY'][i].itemCode,
									value: '0'
								})
							}
						}
						this.priorityTotal = num;
						this.matterList = JSON.parse(JSON.stringify(arr));
						callback({
							arr: arr,
							num: num
						})
					}
				});
			},
			countPercentage(countArray) {
				var j = eval(countArray.join('+'));
				var resultArray = [];
				for (var i = 0; i < countArray.length; i++) {
					var k = Math.floor((countArray[i] / j) * 100) + "%";
					resultArray.push(k);
				}
				return resultArray;
			},
			// getPriority(res) {
		/*	getMatter(res) {
				let _this = this;
				this.myChartMatter = this.$echarts.init(this.$refs.matter);
				let option = {
					title: {
						text: '',
						textStyle: {
							fontSize: 14,
							fontStyle: 'normal',
							fontWeight: '900',
						},
						x: 'left',
						y: 'top',
						textAlign: 'left',
					},
					tooltip: {
						trigger: 'item'
					},
					legend: {
						orient: 'vertical',
						show: false,
						left: 'left'
					},
					series: [{
						type: 'pie',
						radius: '75%',
						center: ['42%', '52%'],
						data: res.arr,
						emphasis: {
							itemStyle: {
								shadowBlur: 10,
								shadowOffsetX: 0,
								shadowColor: 'rgba(0, 0, 0, 0.5)'
							}
						},
						itemStyle: {
							normal: {
								color: function(params) {
									var colorList = ['#00CE8D', '#3D91F7', '#FF504B'];
									return colorList[params.dataIndex]
								},
								borderWidth: 1,
								borderColor: '#fff',
								label: {
									fontSize: 12,
									show: true,
									formatter: '{b} :\n {c}({d}%)'
								},
								labelLine: {
									show: true
								}
							},
						}
					}]
				};
				this.myChartMatter.setOption(option, true);
			},*/
			/*getBusiTypeValue(callback) {
				var url = this.Config.baseContext + "/mssq/tj/listItemCountByType";
				this.$http_post(url, {
					regionCode: this.regionsIndex,
					selfDeptId: this.deptIdIndex
				}).then(ret => {
					if (ret.state == 1) {
						let arr = [];
						let num = 0;
						for (let i = 0; i < this.getDict['BUSI_TYPE'].length; i++) {
							let flag = -1;
							for (let j = 0; j < ret.rows.length; j++) {
								if (this.getDict['BUSI_TYPE'][i].itemCode == ret.rows[j].code) {
									flag = j
								}
							}

							if (flag != -1) {
								num += ret.rows[flag].value;
								arr.push({
									color: this.busiTypeColor[i],
									name: this.getDict['BUSI_TYPE'][i].itemValue,
									code: ret.rows[flag].code,
									value: ret.rows[flag].value
								})
							} else {
								arr.push({
									color: this.busiTypeColor[i],
									name: this.getDict['BUSI_TYPE'][i].itemValue,
									code: this.getDict['BUSI_TYPE'][i].itemCode,
									value: '0'
								})
							}
							this.busiTypeTotal = num;
							this.busiTypeList = JSON.parse(JSON.stringify(arr));
						}
						callback({
							arr: arr,
							num: num
						})
					}
				});
			},
			getBusiType(row) {
				let _this = this;
				this.myChartBusiType = this.$echarts.init(this.$refs.busiType);
				let option = {
					title: {
						text: '',
						textStyle: {
							fontSize: 14,
							fontStyle: 'normal',
							fontWeight: '900',
						},
						x: 'left',
						y: 'top',
						textAlign: 'left',
					},
					tooltip: {
						trigger: 'item'
					},
					legend: {
						orient: 'vertical',
						show: false,
						left: 'left'
					},
					series: [{
						type: 'pie',
						radius: '75%',
						center: ['42%', '52%'],
						data: row.arr,
						emphasis: {
							itemStyle: {
								shadowBlur: 10,
								shadowOffsetX: 0,
								shadowColor: 'rgba(0, 0, 0, 0.5)'
							}
						},
						itemStyle: {
							normal: {
								color: function(params) {
									var colorList = ['#3D91F7', '#00CE8D', '#FF504B', '#6E5DFF', '#00CDEF',
										'#FD8E00'
									]
									return colorList[params.dataIndex];
								},
								borderWidth: 1,
								borderColor: '#fff',
								label: {
									fontSize: 12,
									show: true,
									formatter: '{b} :\n {c}({d}%)'
								},
								labelLine: {
									show: true
								}
							},
						}
					}]
				};
				this.myChartBusiType.setOption(option, true);
			},*/
			getTaskTypeValue(callback) {
				let isZsj = this.$store.getters.curUser.roleValue.indexOf('ZSJSH') != -1 || this.$store.getters.curUser
					.roleValue.indexOf('ZSJBB') != -1
				let name = [];
				let num = [];
				var url = this.Config.baseContext + "/mssq/tj/taskTypeCount";
				this.$http_post(url, {
					regionCode: this.regionsIndex,
					selfDeptId: this.deptIdIndex
				}).then(ret => {
					if (ret.state == 1) {
						this.maopao(ret.rows, 'value');
						this.taskTypeData = ret.rows;
						for (let j = 0; j < this.getDict.TASK_TYPE.length; j++) {
							let flag = -1;
							for (let i = 0; i < ret.rows.length; i++) {
								if (this.getDict.TASK_TYPE[j].itemCode == ret.rows[i].code) {
									flag = i
								}
							}
							if (flag != -1) {
								name.push(this.getDict.TASK_TYPE[j].itemValue);
								num.push(ret.rows[flag].value || 0)
							} else {
								name.push(this.getDict.TASK_TYPE[j].itemValue);
								num.push(0)
							}
						}
						callback({
							arr: num,
							name: name
						})
					} else {
						this.$message.error(ret.message);
					}
				});
			},
			maopao(arr, type) {
				for (var j = 0; j < arr.length - 1; j++) {
					// 这里要根据外层for循环的 j，逐渐减少内层 for循环的次数
					for (var i = 0; i < arr.length - 1 - j; i++) {
						if (arr[i][type] > arr[i + 1][type]) {
							var temp = arr[i];
							arr[i] = arr[i + 1];
							arr[i + 1] = temp;
						}
					}
				}
				return arr;
			},
			getTaskType(row) {
				console.log(row);
				let _this = this;
				this.$nextTick(() => {
					this.myChartTask = this.$echarts.init(this.$refs.task);
					let option = {
						title: {
							show: false, //显示策略，默认值true,可选为：true（显示） | false（隐藏）
							// text: '实施类型事项数统计(' + res.num + ')', //主标题文本，'\n'指定换行
							link: '', //主标题文本超链接,默认值true
							target: null, //指定窗口打开主标题超链接，支持'self' | 'blank'，不指定等同为'blank'（新窗口）
							x: 'left', //水平安放位置，默认为'left'，可选为：'center' | 'left' | 'right' | {number}（x坐标，单位px）
							y: 'top', //垂直安放位置，默认为top，可选为：'top' | 'bottom' | 'center' | {number}（y坐标，单位px）
							textAlign: null, //水平对齐方式，默认根据x设置自动调整，可选为： left' | 'right' | 'center
							backgroundColor: 'rgba(0,0,0,0)', //标题背景颜色，默认'rgba(0,0,0,0)'透明
							borderColor: '#ccc', //标题边框颜色,默认'#ccc'
							borderWidth: 0, //标题边框线宽，单位px，默认为0（无边框）
							padding: 5, //标题内边距，单位px，默认各方向内边距为5，接受数组分别设定上右下左边距
							itemGap: 10, //主副标题纵向间隔，单位px，默认为10
							/* textStyle: { //主标题文本样式{"fontSize": 18,"fontWeight": "bolder","color": "#333"}
							     fontFamily: 'Arial, Verdana, sans...',
							     fontSize: 20,
							     fontStyle: 'normal',
							     fontWeight: 'normal',
							 },*/
							textStyle: {
								fontSize: 14,
								fontStyle: 'normal',
								fontWeight: 'normal',
							},
							zlevel: 0, //一级层叠控制。默认0,每一个不同的zlevel将产生一个独立的canvas，相同zlevel的组件或图标将在同一个canvas上渲染。zlevel越高越靠顶层，canvas对象增多会消耗更多的内存和性能，并不建议设置过多的zlevel，大部分情况可以通过二级层叠控制z实现层叠控制。
							z: 6, //二级层叠控制，默认6,同一个canvas（相同zlevel）上z越高约靠顶层。
						},
						tooltip: {
							show: true, // 是否显示
							trigger: 'axis', // 触发类型  'item'图形触发：散点图，饼图等无类目轴的图表中使用； 'axis'坐标轴触发；'none'：什么都不触发。
							axisPointer: { // 坐标轴指示器配置项。
								type: 'shadow', // 'line' 直线指示器  'shadow' 阴影指示器  'none' 无指示器  'cross' 十字准星指示器。
								axis: 'auto', // 指示器的坐标轴。
								snap: true, // 坐标轴指示器是否自动吸附到点上
							},
							// showContent: true, //是否显示提示框浮层，默认显示。
							// triggerOn: 'mouseover', // 触发时机  'mouseover'鼠标移动时触发。     'click'鼠标点击时触发。  'mousemove|click'同时鼠标移动和点击时触发。
							// enterable: false, // 鼠标是否可进入提示框浮层中，默认为false，如需详情内交互，如添加链接，按钮，可设置为 true。
							renderMode: 'html', // 浮层的渲染模式，默认以 'html 即额外的 DOM 节点展示 tooltip；
							backgroundColor: 'rgba(50,50,50,0.7)', // 提示框浮层的背景颜色。
							borderColor: '#333', // 提示框浮层的边框颜色。
							borderWidth: 0, // 提示框浮层的边框宽。
							padding: 5, // 提示框浮层内边距，
							textStyle: { // 提示框浮层的文本样式。
								color: '#fff',
								fontStyle: 'normal',
								fontWeight: 'normal',
								fontFamily: 'sans-serif',
								fontSize: 14,
							},
							extraCssText: 'box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);', // 额外附加到浮层的 css 样式
							confine: false, // 是否将 tooltip 框限制在图表的区域内。
							// formatter: '{b} 的成绩是 {c}'
							/* formatter: function (arg) {
							   return arg[0].name + ':' + arg[0].data;
							 }*/
						},
						xAxis: {
							type: 'value',
							splitLine: { //网格线
								lineStyle: {
									color: '#ebebeb', //y轴颜色
									width: 1
								}
							},

						},
						yAxis: {
							type: 'category',
							data: row.name,
							axisLabel: {
								rotate: 45,
								margin: 8,
								formatter: function(params) {
									var val = "";
									if (params.length > 4) {
										val = params.substr(0, 4) + '...';
										return val;
									} else {
										return params;
									}
								}
							},
						},
						series: [{
							data: row.arr,
							type: 'bar',
							barWidth: 20, //柱状图粗细
							// showBackground: true,
							// backgroundStyle: {
							//   color: 'rgba(180, 180, 180, 0.08)'
							// },
							itemStyle: {
								normal: {
									color: ['#3D91F7'],
									label: {
										show: true, //开启显示
										position: 'right', //在上方显示
										textStyle: { //数值样式
											color: 'black',
											fontSize: 12
										}
									}
								}
							}
						}],
						grid: {
							left: '2%',
							top: '2%',
							right: '6%',
							bottom: '0%',
							containLabel: true //防止坐标轴标签溢出
						}
					};
					this.myChartTask.setOption(option, true);
					// this.$nextTick(() => {
					// 	setTimeout(() => {
					// 		this.myChartTask.resize();
					// 	}, 50)
					// })
				})

			},
			/*getTimeValue(callback) {
				let name = [];
				let num = [];
				let flag = -1;
				var url = this.Config.baseContext + "/mssq/tj/itemVersion/promiseLimitByRegion";
				this.$http_get(url, {
					regionCode: this.regionsIndex,
					selfDeptId: this.deptIdIndex
				}).then(ret => {
					if (ret.state == 1) {
						console.log(this.maopao(ret.rows, 'value').reverse());
						// let arr1 = [];
						// let arr2 = [];
						// let arr3 = [];
						for (let i = 0; i < this.getDict['DAY_TYPE'].length; i++) {
							for (let j = 0; j < ret.rows.length; j++) {
								if (this.getDict['DAY_TYPE'][i].itemCode == ret.rows[j].name) {
									ret.rows[j].nameText = this.getDict['DAY_TYPE'][i].itemValue;
						for (let k = 0; k < ret.rows.length; k++) {
							name.push(ret.rows[k].code + ret.rows[k].nameText + '处置时限事项')
							num.push(ret.rows[k].value)
						}
						callback({
							name: name,
							num: num
						});
						console.log(name, num);
					}
				}
            }
          }
        })
			},
			getTime(val) {
				let _this = this;
				this.myChartTime = this.$echarts.init(this.$refs.time);
				let option = {
					title: {
						text: '',
						textStyle: {
							fontSize: 14,
							fontStyle: 'normal',
							fontWeight: '900',
						},
						x: 'left',
						y: 'top',
						textAlign: 'left',
					},
					tooltip: {
						show: true, // 是否显示
						trigger: 'axis', // 触发类型  'item'图形触发：散点图，饼图等无类目轴的图表中使用； 'axis'坐标轴触发；'none'：什么都不触发。
						axisPointer: { // 坐标轴指示器配置项。
							type: 'shadow', // 'line' 直线指示器  'shadow' 阴影指示器  'none' 无指示器  'cross' 十字准星指示器。
							axis: 'auto', // 指示器的坐标轴。
							snap: true, // 坐标轴指示器是否自动吸附到点上
						},
						// showContent: true, //是否显示提示框浮层，默认显示。
						// triggerOn: 'mouseover', // 触发时机  'mouseover'鼠标移动时触发。     'click'鼠标点击时触发。  'mousemove|click'同时鼠标移动和点击时触发。
						// enterable: false, // 鼠标是否可进入提示框浮层中，默认为false，如需详情内交互，如添加链接，按钮，可设置为 true。
						renderMode: 'html', // 浮层的渲染模式，默认以 'html 即额外的 DOM 节点展示 tooltip；
						backgroundColor: 'rgba(50,50,50,0.7)', // 提示框浮层的背景颜色。
						borderColor: '#333', // 提示框浮层的边框颜色。
						borderWidth: 0, // 提示框浮层的边框宽。
						padding: 5, // 提示框浮层内边距，
						textStyle: { // 提示框浮层的文本样式。
							color: '#fff',
							fontStyle: 'normal',
							fontWeight: 'normal',
							fontFamily: 'sans-serif',
							fontSize: 16,
						},
						extraCssText: 'box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);', // 额外附加到浮层的 css 样式
						confine: false, // 是否将 tooltip 框限制在图表的区域内。
						// formatter: '{b} 的成绩是 {c}'
						/!* formatter: function (arg) {
             return arg[0].name + ':' + arg[0].data;
           }*!/
					},
					xAxis: {
						type: 'category',
						data: val.name,
						axisLabel: {
							rotate: 45,
							margin: 8,
							formatter: function(params) {
								var val = "";
								if (params.length > 4) {
									val = params.substr(0, 4) + '...';
									return val;
								} else {
									return params;
								}
							}
						},
					},
					yAxis: {
						type: 'value',
						splitLine: { //网格线
							lineStyle: {
								color: '#ebebeb', //y轴颜色
								width: 1
							}
						}
					},
					legend: {
						orient: 'vertical',
						show: false,
						left: 'left'
					},
					series: [{
						type: 'bar',
						barWidth: 20, //柱状图粗细
						// showBackground: true,
						// backgroundStyle: {
						//   color: 'rgba(180, 180, 180, 0.08)'
						// },
						itemStyle: {
							normal: {
								color: ['#3D91F7'],
								label: {
									show: true, //开启显示
									position: 'top', //在上方显示
									textStyle: { //数值样式
										color: 'black',
										fontSize: 12
									}
								}
							}
						},
						data: val.num,
					}],
					grid: {
						left: '2%',
						top: '8%',
						right: '6%',
						bottom: '0%',
						containLabel: true //防止坐标轴标签溢出
					}
				};
				this.myChartTime.setOption(option, true);
			},*/
		}
	}
</script>

<style lang="less" scoped>
	.choose_search {
		background: #fff;
		margin-bottom: 10px;
		width: 100%;
		/*display: flex;*/
		padding: 14px 10px 6px 16px;
		box-sizing: border-box;

		.content {
			display: flex;
			width: 90%;

			.cell-content {
				width: calc(100% - 70px);
				flex-wrap: wrap;
				display: flex;

				.popover {
					width: 10%;
					margin-bottom: 14px;
					display: flex;
					justify-content: center;
				}

				.cell {
					display: flex;
					align-items: center;
					cursor: pointer;
					padding: 6px 25px;
					border-radius: 100px;
					box-sizing: border-box;

					.name {
						overflow: hidden; //超出的文本隐藏
						text-overflow: ellipsis; //溢出用省略号显示
						white-space: nowrap; //溢出不换行
					}

					&:hover {
						color: #208fff;
					}
				}

				.active {
					background: #208fff;
					color: #fff;

					&:hover {
						color: #fff;
					}
				}

			}

			.sit-hidden {
				height: 40px;
				overflow: hidden;
			}

			.title {
				width: 70px;
				height: 20px;
				color: #5E5E5E;
				display: flex;
				align-items: center;
				margin-top: 6px;
			}
		}

		.shrink {
			width: 70px;
			text-align: center;
			font-size: 14px;
			margin-top: 6px;

			.is-underline:hover:after {
				border: none;
			}

			span {
				cursor: pointer;
			}

			.el-link {
				margin-left: 5px;
				font-size: 14px;
				color: #666;
			}
		}
	}

	.label {
		display: flex;
		align-items: center;
		justify-content: space-between;

		.item-view {
			height: 124px;
			width: 25%;
			padding: 0 8px;
			box-sizing: border-box;
			.item {
				border:2px solid #fff;
				padding: 10px 35px 10px 20px;
				width: 100%;
				height: 100%;
				display: flex;
				align-items: center;
				justify-content: space-between;
				box-sizing: border-box;
				.right {
					img {
						height: 124px;
					}
				}

				.left {
					padding-left: 5px;
				}

				.name {
					font-size: 14px;
					margin-bottom: 4px;
				}

				.num {
					font-size: 40px;
					font-weight: 500;
					line-height: 40px;
				}
			}
			.primary{
				background:linear-gradient(to right,#fff,#C9E0FB);
				.num{
					color: #3D91F7;
				}
				.name{
					color:#4F607B;
				}
			}
			.warning{
				background:linear-gradient(to right,#fff,#FFDFCD);
				.num{
					color: #FD8E00;
				}
				.name{
					color:#7D6556;
				}
			}
			.success{
				background:linear-gradient(to right,#fff,#C3EED7);
				.num{
					color: #00CE8D;
				}
				.name{
					color:#5A806D;
				}
			}
		}
		

		.item-view:first-child {
			padding-left: 0;
		}

		.item-view:last-child {
			padding-right: 0;
		}
	}

	.statistics {
		margin-top: 16px;

		.statistics-t {
			display: flex;
			justify-content: space-between;

			.statistics-t-l {
				width: 60%;
				padding-right: 8px;
				box-sizing: border-box;
        .matter {
          // height: 323px;
          height: 260px;
          margin-bottom: 16px;
          background: #fff;
          padding: 14px;

          :deep(.el-progress) {
            .el-progress-circle__track {
              stroke: #FFEDD5;
            }
          }

          .itemLevelInfo {
            .infoColor {
              background: #FD8E00;
            }

            .content {
              span {
                color: #FD8E00;
              }
            }
          }
        }

        &>div {
          width: 100%;
          height: 100%;

          .echart-view {
            height: calc(100% - 40px);
            margin-top: 14px;
            display: flex;
            align-items: center;
            justify-content: space-between;

            .itemPriority {
              height: 100%;
              width: 50%;
              display: flex;
              justify-content: center;
              align-items: center;

              .el-progress {
                transform: scale(1.1);
              }
            }

            .item-con {
              width: 50%;
              height: 100%;
              display: flex;
              flex-direction: column;
              justify-content: center;

              .itemLevelInfo {
                display: flex;
                align-items: center;
                margin-bottom: 20px;

                .infoColor {
                  width: 14px;
                  height: 14px;
                  margin-right: 6px;
                }

                .content {
                  margin-right: 10px;
                }
              }
            }
          }
        }

			}

			.statistics-t-r {
				width: 40%;
				padding-left: 8px;
				box-sizing: border-box;

				&>div {
					width: 100%;
					height: 100%;

					.echart-view {
						height: calc(100% - 40px);
						margin-top: 14px;
						display: flex;
						align-items: center;
						justify-content: space-between;

						.itemPriority {
							height: 100%;
							width: 50%;
							display: flex;
							justify-content: center;
							align-items: center;

							.el-progress {
								transform: scale(1.1);
							}
						}

						.item-con {
							width: 50%;
							height: 100%;
							display: flex;
							flex-direction: column;
							justify-content: center;

							.itemLevelInfo {
								display: flex;
								align-items: center;
								margin-bottom: 20px;

								.infoColor {
									width: 14px;
									height: 14px;
									margin-right: 6px;
								}

								.content {
									margin-right: 10px;
								}
							}
						}
					}
				}

				.planning {
					height: 323px;
					/*height: 210px;*/
					margin-bottom: 16px;
					background: #fff;
					padding: 14px;

					:deep(.el-progress) {
						.el-progress-circle__track {
							stroke: #FFE7E2;
						}
					}

					.itemLevelInfo {
						.infoColor {
							background: #FF504B;
						}

						.content {
							span {
								color: #FF504B;
							}
						}
					}
				}


				.dept {
					// height: 323px;
					height: 260px;
					background: #fff;
					padding: 14px;

					:deep(.el-progress) {
						.el-progress-circle__track {
							stroke: #DBF1FC;
						}
					}

					.itemLevelInfo {
						.infoColor {
							background: #3D91F7;
						}

						.content {
							span {
								color: #3D91F7;
							}
						}
					}
				}
			}
		}

		.statistics-b {
			margin: 16px 0;
			display: flex;
			justify-content: space-between;

			.type {
				height: 323px;
				padding-right: 8px;
				width: 100%;

				.type-view {
					background: #fff;
					width: 100%;
					height: 100%;
					padding: 14px;

					.itemPriority {
						height: calc(100% - 40px);
						margin-top: 14px;
					}
				}
			}

			.time {
				height: 323px;
				padding-left: 8px;
				width: 40%;

				.time-view {
					background: #fff;
					width: 100%;
					height: 100%;
					padding: 14px;

					.itemPriority {
						height: calc(100% - 40px);
						margin-top: 14px;
					}
				}
			}
		}
	}

	.table {
		width: 100%;
		min-height: 200px;
		background: #fff;
		padding: 14px;

		.table-h {
			min-height: 400px;
			display: flex;
			flex-direction: column;

			.el-table {
				flex: 1;
			}
		}
	}

	.view-title {
		font-size: 16px;
	}

	.block {
		text-align: right;
		/*position: absolute;*/
		background: #fff;
		padding: 10px 0 0 0;
	}
</style>
