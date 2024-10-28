<template>
	<div>
		<div class="responsibilityStatic">
			<div class="responsibilityStatic-left" ref="itemLevel"></div>
			<div class="responsibilityStatic-right" ref="manageType"></div>
		</div>
		<div class="table">
			<template>
				<el-tabs v-model="activeStatus" @tab-click="onQuery('1')" 	v-if="$store.getters.curUser.attrMap.REGION_CODE == '440301' &&
      ($store.getters.curUser.roleValue.indexOf('ZSJSH') != -1 || $store.getters.curUser.roleValue.indexOf('ZSJBB') != -1)">
					<el-tab-pane label="市部门统计" name="0"></el-tab-pane>
					<el-tab-pane label="区划统计" name="1"></el-tab-pane>
				</el-tabs>
        <div v-if="chooseDeptName">当前部门：{{chooseDeptName}} <el-button size="mini" @click="reset" icon="el-icon-refresh">返回</el-button></div>
				<el-table :data="tableData" style="width: 100%">
					<el-table-column :key="Math.random()" v-if="activeStatus == 0" prop="deptName" align="center" label="单位名称">
            <template slot-scope="scope">
              <el-button v-if="chooseDeptId==''" type="text" @click="viewAgentData(scope.row)">{{scope.row.deptName}}</el-button>
              <span v-else type="text">{{scope.row.deptName}}</span>
            </template>
          </el-table-column>
					<el-table-column :key="1" v-if="activeStatus == 1" prop="regionName" label="区划" align="center">
					</el-table-column>
					<el-table-column :key="2" prop="total" label="事项数" align="center">
					</el-table-column>
					<el-table-column :key="3" v-if="$store.getters.curUser.attrMap.REGION_CODE=='440301'"  prop="totalA" label="A类事项数" align="center">
					</el-table-column>
					<el-table-column :key="4"  prop="totalB" label="B类事项数" align="center">
					</el-table-column>
          <el-table-column :key="5"  prop="totalC" label="C类事项数" align="center">
					</el-table-column>
				</el-table>
			</template>
			<div class="block">
				<el-pagination @current-change="handleCurrentChange" :current-page.sync="params.page"
											 :page-size="params.limit" layout="total,prev, pager, next, jumper"
											 :total="params.total">
				</el-pagination>
			</div>
		</div>
	</div>
</template>

<script>
	import qzBase from '@_src/pages/mssq/common/util/qzBase';

	export default {
		name: "responsibility",
		mixins: [qzBase],
		data() {
			return {
        chooseDeptId:'',
        chooseDeptName:'',
        isDept:"1",
				params:{
					page:1,
					limit:20,
					total:0
				},
				activeStatus: '0',
				myChartPublish: {},
				myChartItem: {},
				tableData: [],
			}
		},
		mounted() {
			this.onQuery({});
			this.queryDict("SSCJ,MANAGE_TYPE", res => {
				this.getDict = res;
				this.getItemLevelValue((val) => {
					this.getItemLevel(val);
				});
				this.getManageTypeValue((val) => {
					this.getManageType(val);
				});
			});
			window.addEventListener("resize", () => {
				this.$nextTick(() => {
					this.myChartPublish && this.myChartPublish.resize();
					this.myChartItem && this.myChartItem.resize();
				})
			});
		},
		methods: {
			getItemLevelValue(callback) {
				let num = [];
				let name = [];
				var url = this.Config.baseContext + "/mssq/tj/listItemCountByLevel";
				this.$http_post(url, {}).then(ret => {
					if (ret.state == 1) {
						this.itemLevel = ret.rows;
						for (let j = 0; j < this.getDict.SSCJ.length; j++) {
							let index = -1;
							if (this.getDict.SSCJ[j].itemCode < 5) {
								for (let i = 0; i < ret.rows.length; i++) {
									if (ret.rows[i].code == this.getDict.SSCJ[j].itemCode) {
										index = i
									}
								}
								if (index != -1) {
									num.push(ret.rows[index].value);
									name.push(this.getDict.SSCJ[j].itemValue);
								} else {
									num.push(0);
									name.push(this.getDict.SSCJ[j].itemValue);
								}
							}
						}
						callback({
							name: name,
							num: num
						})
					} else {
						for (let j = 0; j < this.getDict.SSCJ.length; j++) {
							if (this.getDict.SSCJ[j].itemCode < 5) {
								name.push(this.getDict.SSCJ[j].itemValue)
							}
						}
						callback({
							name: name,
							num: 0
						})
					}
				});
			},
			getItemLevel(res) {
				this.myChartItem = this.$echarts.init(this.$refs.itemLevel);
				let option = {
					title: {
						show: true, //显示策略，默认值true,可选为：true（显示） | false（隐藏）
						text: '事项层级分布', //主标题文本，'\n'指定换行
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
							fontSize: 16,
							fontStyle: 'normal',
							fontWeight: '900',
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
						}
					},
					yAxis: {
						type: 'category',
						data: res.name,
						axisLabel: {
							rotate: 45,
							interval: 0,
							formatter: function(params) {
								var val = "";
								if (params.length > 4) {
									val = params.substr(0, 4) + '...';
									return val;
								} else {
									return params;
								}
							}
						}
					},
					series: [{
						barWidth: 20, //柱状图粗细
						data: res.num,
						type: 'bar',
						// showBackground: true,
						// backgroundStyle: {
						//   color: 'rgba(180, 180, 180, 0.08)'
						// },
						itemStyle: {
							normal: {
								color: ['#3d91f7'],
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
						left: '0%',
						top: '15%',
						right: '4%',
						bottom: '2%',
						containLabel: true //防止坐标轴标签溢出
					}
				};
				this.myChartItem.setOption(option, true);
			},
			getManageTypeValue(callback) {
				let _this = this;
				let num = [];
				let name = [];
				var url = this.Config.baseContext + "/mssq/tj/listItemCountByManageType";
				this.$http_post(url, {}).then(ret => {
					if (ret.state == 1) {
						// this.manageType = res.rows;
						for (let j = 0; j < this.getDict.MANAGE_TYPE.length; j++) {
							let index = -1;
							for (let i = 0; i < ret.rows.length; i++) {
								if (ret.rows[i].code == this.getDict.MANAGE_TYPE[j].itemCode) {
									index = i
								}
							}
							if (index != -1) {
								num.push(ret.rows[index].value);
								name.push(this.getDict.MANAGE_TYPE[j].itemValue);
							} else {
								num.push(0);
								name.push(this.getDict.MANAGE_TYPE[j].itemValue);
							}
						}
						callback({
							name: name.reverse(),
							num: num.reverse()
						})
					} else {
						for (let i = 0; i < _this.getDict.MANAGE_TYPE.length; i++) {
							name.push(_this.getDict.MANAGE_TYPE[i].itemValue);
							num.push(0);
						}
						callback({
							name: name,
							num: num
						})
					}
				});
			},
			getManageType(res) {
				this.myChartPublish = this.$echarts.init(this.$refs.manageType);
				let option = {
					title: {
						show: true, //显示策略，默认值true,可选为：true（显示） | false（隐藏）
						text: '管理类型分布', //主标题文本，'\n'指定换行
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
							fontSize: 16,
							fontStyle: 'normal',
							fontWeight: '900',
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
						}
					},
					yAxis: {
						type: 'category',
						data: res.name,
						axisLabel: {
							rotate: 45,
							interval: 0,
							formatter: function(params) {
								var val = "";
								if (params.length > 4) {
									val = params.substr(0, 4) + '...';
									return val;
								} else {
									return params;
								}
							}
						}
					},
					series: [{
						barWidth: 20, //柱状图粗细
						data: res.num,
						type: 'bar',
						// showBackground: true,
						// backgroundStyle: {
						//   color: 'rgba(180, 180, 180, 0.08)'
						// },
						itemStyle: {
							normal: {
								color: ['#3d91f7'],
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
						left: '0%',
						top: '15%',
						right: '4%',
						bottom: '2%',
						containLabel: true //防止坐标轴标签溢出
					}
				};
				this.myChartPublish.setOption(option, true);
			},
      viewAgentData(row){
        this.chooseDeptId = row.deptId;
        this.chooseDeptName = row.deptName;
        this.onQuery({})
      },
      reset(){
        this.chooseDeptId = '';
        this.chooseDeptName = '';
        this.onQuery({})
      },
      // onSelect(v){
      //   this.isDept=v;
      //   this.onQuery({});
      // },
			onQuery(type) {
			  if(!this.isEmptyObject(type)){
          this.params.page = 1;
        }
        let params = {
          page:this.params.page,
          limit:this.params.limit,
        }
				var url = this.Config.baseContext + "/mssq/tj/dutyItem/listDutyItemCountByRegion";
				if (this.activeStatus == 0) {
					url = this.Config.baseContext + "/mssq/tj/dutyItem/listDutyItemCountBySzOrgan"
          params = {
            page:this.params.page,
            limit:this.params.limit,
            isDept:this.chooseDeptId?0:1,
            agentId:this.chooseDeptId,
          }
        }
				this.$http_get(url, params).then(ret => {
					if (ret.state == 1) {
						this.tableData = ret.rows;
						this.params.total = ret.records
					}
				});
			},
      handleCurrentChange(data){
			  this.params.page = data;
			  this.onQuery({});
      }
		}
	}
</script>

<style scoped lang="less">

	.responsibilityStatic {
		display: flex;
		width: 100%;
		justify-content: space-between;
		height: 300px;

		.responsibilityStatic-left,
		.responsibilityStatic-right {
			padding: 10px;
			background: #fff;
			width: 50%;
			height: 100%;
		}

		.responsibilityStatic-left {
			margin-right: 5px;
		}

		.responsibilityStatic-right {
			padding: 10px;
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin-left: 5px;

			.el-button {
				width: 30px;
			}

			.responsibilityStatic-right-content {
				height: 100%;
				width: calc(100% - 60px);
			}
		}
	}

	.table {
		display: flex;
		flex-direction: column;
		background: #fff;
		padding: 6px 14px 14px 14px;
		margin-top: 10px;
		flex: 1;
		min-height: calc(100% - 310px);
		.block{
			text-align: end;
			background: #fff;
			padding: 10px 0 0 0;
		}
	}

	:deep(.el-tabs__header) {
		.el-tabs__nav-wrap {
			.el-tabs__nav-scroll {
				.el-tabs__nav {
					.el-tabs__item {
						font-size: 16px;
					}
				}
			}
		}
	}
</style>
