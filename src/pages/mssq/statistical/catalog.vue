<template>
  <div>
    <div class="year-select-echarts">
      <div class="year-select">
        <span>年份：</span>
        <el-select size="mini" v-model="yearCatalog" @change="changeYear">
          <el-option v-for="(val,index) in yearsData" :key="index" :label="val.label" :value="val.value"></el-option>
        </el-select>
      </div>
      <div class="year" ref="yearCatalog"></div>
    </div>

    <div class="catalogStatic">
      <div class="catalogStatic-left" @mouseout="goLeftMove" @mouseover="stopLeft">
        <div class="left btn" @click="autoMoveFirstLeft" v-show=" firstTotal != 1">
          <i class="el-icon-arrow-left"></i>
        </div>
        <div class="catalogStatic-title">
          <span>一级分类情况统计</span>
          <p class="fenye">当前页：<span>{{ firstPage }}</span>/{{ firstTotal }}</p>
        </div>
        <div class="catalogStatic-left-bottom">
          <div ref="primaryIndex" class="catalogStatic-left-content"></div>
        </div>
        <div class="right btn" @click="autoMoveFirst('click')" v-show="firstTotal != 1">
          <i class="el-icon-arrow-right"></i>
        </div>
      </div>
      <div class="catalogStatic-right" @mouseout="goMove" @mouseover="stop">
        <div class="left btn" @click="autoMoveLeft" v-show=" parentTotal != 1">
          <i class="el-icon-arrow-left"></i>
        </div>
        <div class="catalogStatic-title">
          <div class="left">
            <span>二级分类情况统计</span>
            <p class="fenye">当前页：<span>{{ parentPage }}</span>/{{ parentTotal }}</p>
          </div>
          <el-select v-model="chooseCode" @change="getNums" size="mini">
            <el-option v-for="item in firstData" :value="item.code" :label="item.name" :key="item.code">
            </el-option>
          </el-select>
        </div>
        <div class="catalogStatic-right-bottom">
          <div ref="parentCatalog" class="catalogStatic-right-content">
          </div>
        </div>
        <div class="right btn" @click="autoMoveRight('click')" v-show="parentTotal != 1">
          <i class="el-icon-arrow-right"></i>
        </div>
      </div>
    </div>
    <div class="catalogList">
      <el-table :data="tableData">
        <el-table-column prop="primaryIndexName" align="center" label="一级目录"></el-table-column>
        <!--				<el-table-column prop="primaryIndex" align="center" label="一级索引编码"></el-table-column>-->
        <el-table-column prop="parentTotal" align="center" label="二级目录数"></el-table-column>
        <el-table-column prop="catalogTotal" align="center" label="三级目录数"></el-table-column>
        <el-table-column prop="provinceTotal" align="center" label="省级事项数"></el-table-column>
        <el-table-column prop="cityTotal" align="center" label="市级事项数"></el-table-column>
        <el-table-column prop="regionTotal" align="center" label="区级事项数"></el-table-column>
      </el-table>
      <div class="block">
        <el-pagination @current-change="handleCurrentChange" :current-page.sync="catalogData.page"
                       :page-size="catalogData.limit" layout="total,prev, pager, next, jumper"
                       :total="catalogData.total">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import qzBase from '@_src/pages/mssq/common/util/qzBase';

let len = 10;
let page = 1;
let firstPage = 1;
export default {
  name: "catalog",
  mixins: [qzBase],
  data() {
    return {
      yearCatalog:2024,
      parentPage: -1,
      firstPage: 1,
      chooseCode: '',
      myChart: {},
      myChartFirst: {},
      myChartSecond: {},
      timeLeftOut: {},
      timeRightOut: {},
      setSecondOption: {},
      setFirstOption: {},
      changeFirstData: {},
      chooseNum: 0,
      firstData: [],
      tableData: [],
      catalogData: {
        page: 1,
        limit: 30,
        total: 0
      },
      yearsData:[],
      nowYears:0,
      smallYears:2022,
    }
  },
  mounted() {
    this.getCatalogStatistical();
    let that = this;
    window.addEventListener("resize", () => {
      this.$nextTick(() => {
        that.rese();
      })
    });
    this.parentPage = page;
    this.getTableData();
    //获取当前时间
    var date = new Date;
    this.nowYears = date.getFullYear()
    var Years = this.nowYears - this.smallYears
    var arrYear = [];
    for (var i = 0; i <= Years; i++) {
      arrYear.push(this.nowYears--)
    }
    arrYear.forEach(v=> {
      //下拉框的数组
      this.yearsData.push({
        value: v,
        label: v+ '年'
      })
    });
  },
  computed: {
    parentTotal() {
      let num = 0;
      if (this.isNotNull(this.firstData)) {
        num = this.firstData[this.chooseNum].children.length / len;
        return Math.trunc(num) + 1
      }
    },
    firstTotal() {
      let num = 0;
      if (this.isNotNull(this.firstData)) {
        num = this.firstData.length / len;
        return Math.trunc(num) + 1
      }
    },
    getXAxis() {
      return function (pageNo) {
        let arr = [];
        for (let i = 0; i < this.firstData[this.chooseNum].children.length; i++) {
          arr.push(this.firstData[this.chooseNum].children[i].name)
        }
        var offset = (pageNo - 1) * len;
        return (offset + len >= arr.length) ? arr.slice(offset, arr.length) : arr.slice(offset, offset +
            len);
        // return arr[len]
      }
    },
    getSecondData() {
      return function (pageNo) {
        let arr = [];
        for (let i = 0; i < this.firstData[this.chooseNum].children.length; i++) {
          arr.push(this.firstData[this.chooseNum].children[i].value)
        }
        var offset = (pageNo - 1) * len;
        if (((offset + len >= arr.length) ? arr.slice(offset, arr.length) : arr.slice(offset, offset +
            len)).length == 0) {
          page = 1;
          return this.getSecondData(page)
        }
        return (offset + len >= arr.length) ? arr.slice(offset, arr.length) : arr.slice(offset, offset +
            len);
        // return arr[len]
      }
    },
    getFirstXAxis() {
      return function (pageNo) {
        let arr = [];
        for (let i = 0; i < this.firstData.length; i++) {
          arr.push(this.firstData[i].name)
        }
        var offset = (pageNo - 1) * len;
        return (offset + len >= arr.length) ? arr.slice(offset, arr.length) : arr.slice(offset, offset +
            len);
        // return arr[len]
      }
    },
    getFirstData() {
      return function (pageNo) {
        let arr = [];
        for (let i = 0; i < this.firstData.length; i++) {
          arr.push(this.firstData[i].value)
        }
        var offset = (pageNo - 1) * len;
        if (((offset + len >= arr.length) ? arr.slice(offset, arr.length) : arr.slice(offset, offset +
            len)).length == 0) {
          page = 1;
          return this.getFirstData(page)
        }
        return (offset + len >= arr.length) ? arr.slice(offset, arr.length) : arr.slice(offset, offset +
            len);
        // return arr[len]
      }
    },
  },
  methods: {
    changeYear(){
      this.getYearData((v) => {
        this.firstStatistical(v);
      });
    },
    rese() {
      !this.isEmptyObject(this.myChart) && this.myChart.resize();
      !this.isEmptyObject(this.myChartFirst) && this.myChartFirst.resize();
      !this.isEmptyObject(this.myChartSecond) && this.myChartSecond.resize();
    },
    getTableData() {
      let url = this.Config.baseContext + '/mssq/tj/catalog/listCatalogItemCount';
      this.$http_get(url, {
        page: this.catalogData.page,
        limit: this.catalogData.limit,
      }).then(ret => {
        if (ret.state == 1) {
          this.tableData = ret.rows;
          this.catalogData.total = ret.records;
        }
      });
    },
    handleCurrentChange(val) {
      this.catalogData.page = val;
      this.getTableData();
    },
    getCatalogStatistical() {
      this.getYearData((v) => {
        this.firstStatistical(v);
      });
      this.getPrimaryIndexData({
        type: '1',
        parentCode: ''
      }, res => {
        this.changeFirstData = res;
        this.secondStatistical(res);
        this.thirdStatistical();
      })
    },
    getYearData(callBack) {
      let url = this.Config.baseContext + '/mssq/tj/catalog/listCatalogChangeCountByYearTime';
      let year = ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"];
      let add = [];
      let edit = [];
      let del = [];
      this.$http_get(url, {yearStr: this.yearCatalog}).then(ret => {
        if (ret.state == 1) {
          edit = xunhuan(ret.rows.creation);
          add = xunhuan(ret.rows.publish);
          del = xunhuan(ret.rows.withdraw);
          callBack({
            edit: edit,
            add: add,
            del: del,
            year: year
          })
        }
      });

      function xunhuan(row) {
        let arr = [];
        for (let j = 0; j < 12; j++) {
          let index = -1;
          for (let i = 0; i < row.length; i++) {
            if (Number(j) + 1 == row[i].code) {
              index = i;
            }
          }

          if (index == -1) {
            arr.push(0);
          } else {
            arr.push(row[index].value);
          }
        }
        return arr;
      }
    },
    firstStatistical(obj) {
      let _this = this;
      this.myChart = this.$echarts.init(this.$refs.yearCatalog);
      let option = {
        title: {
          show: true, //显示策略，默认值true,可选为：true（显示） | false（隐藏）
          text: '本年度目录增减情况统计', //主标题文本，'\n'指定换行
          link: '', //主标题文本超链接,默认值true
          target: null, //指定窗口打开主标题超链接，支持'self' | 'blank'，不指定等同为'blank'（新窗口）
          x: 'left', //水平安放位置，默认为'left'，可选为：'center' | 'left' | 'right' | {number}（x坐标，单位px）
          y: 'top', //垂直安放位置，默认为top，可选为：'top' | 'bottom' | 'center' | {number}（y坐标，单位px）
          textAlign: null, //水平对齐方式，默认根据x设置自动调整，可选为： left' | 'right' | 'center
          backgroundColor: 'rgba(0,0,0,0)', //标题背景颜色，默认'rgba(0,0,0,0)'透明
          borderColor: '#ccc', //标题边框颜色,默认'#ccc'
          borderWidth: 0, //标题边框线宽，单位px，默认为0（无边框）
          padding: [14, 10, 10, 14], //标题内边距，单位px，默认各方向内边距为5，接受数组分别设定上右下左边距
          itemGap: 10, //主副标题纵向间隔，单位px，默认为10
          textStyle: {
            fontSize: 16,
            color: '#222',
            fontWeight: 'bold',
          },
          zlevel: 0, //一级层叠控制。默认0,每一个不同的zlevel将产生一个独立的canvas，相同zlevel的组件或图标将在同一个canvas上渲染。zlevel越高越靠顶层，canvas对象增多会消耗更多的内存和性能，并不建议设置过多的zlevel，大部分情况可以通过二级层叠控制z实现层叠控制。
          z: 6, //二级层叠控制，默认6,同一个canvas（相同zlevel）上z越高约靠顶层。
        },
        legend: {
          data: ['新增', '废置'/*, '变更'*/],
          right: '14px',
          top: '14px'
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
          type: 'category',
          data: obj.year,
          axisLabel: {
            rotate: 0,
            margin: 8,
            formatter: function (params) {
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
        series: [
          {
            name: '废置',
            type: 'line',
            axisTick: {
              alignWithLabel: true
            },
            lineStyle: {
              normal: {
                color: '#FF2C25',//折线的颜色
                width: '1'//折线粗细
              }
            },
            color: ['#FF2C25'],
            itemStyle: {
              normal: {
                color: ['#3d91f7'],
                label: {
                  show: false, //开启显示
                  position: 'top', //在上方显示
                  textStyle: { //数值样式
                    color: 'black',
                    fontSize: 12,
                    // top:30
                  },
                },
                borderColor: '#FF2C25',//拐点边框颜色
                borderWidth: 1//拐点边框大小
              },
              emphasis: {
                color: ''//hover拐点颜色定义
              }
            },
            axisPointer: {
              label: {
                formatter: function (params) {
                  return (
                      'Precipitation  ' +
                      params.value +
                      (params.seriesData.length ? '：' + params.seriesData[0].data :
                          '')
                  );
                }
              }
            },
            // prettier-ignore
            data: obj.del
          },
          /*	{
              name: '变更',
              type: 'line',
              axisTick: {
                alignWithLabel: true
              },
              color: ['#1DC538'],
              lineStyle: {
                normal: {
                  color: '#1DC538',//折线的颜色
                  width: '1'//折线粗细
                }
              },
              itemStyle: {
                normal: {
                  borderColor: '#1DC538',//拐点边框颜色
                  borderWidth: 1//拐点边框大小
                },
                emphasis: {
                  color: ''//hover拐点颜色定义
                }
              },
              areaStyle: { //折线下面区块的颜色
                color: {
                  type: 'linear',
                  x: 0,
                  y: 0,
                  x2: 0,
                  y2: 1,
                  colorStops: [{
                    offset: 0,
                    color: 'rgba(0,206,141,0.3)' // 0% 处的颜色
                  }, {
                    offset: 1,
                    color: '#fff' // 100% 处的颜色
                  }],
                  globalCoord: false // 缺省为 false
                }
              },
              axisPointer: {
                label: {
                  formatter: function(params) {
                    return (
                      'Precipitation  ' +
                      params.value +
                      (params.seriesData.length ? '：' + params.seriesData[0].data :
                        '')
                    );
                  }
                }
              },
              data: obj.edit
            },*/
          {
            name: '新增',
            data: obj.add,
            type: 'bar',
            barWidth: 35, //柱状图粗细
            itemStyle: {
              normal: {
                color: ['#3D91F7'],
                label: {
                  show: false, //开启显示
                  position: 'bottom', //在上方显示
                  textStyle: { //数值样式
                    color: 'black',
                    fontSize: 12
                  },
                  // offset: [0, -15]
                }
              },

            }
          }

        ],
        grid: {
          left: '2%',
          top: '17%',
          right: '2%',
          bottom: '6%',
          containLabel: true //防止坐标轴标签溢出
        }
      };
      this.myChart.setOption(option, true);
    },
    getPrimaryIndexData(obj, callBack) {
      let url = this.Config.baseContext + '/mssq/tj/listCatalog';
      let list = [];
      let arr = [];
      this.$http_post(url, {
        parentCode: obj.parentCode,
      }).then(ret => {
        if (ret.state == 1) {
          this.firstData = ret.rows;
          for (let i = 0; i < ret.rows.length; i++) {
            this.chooseCode = ret.rows[0].code;
            list.push(ret.rows[i].name);
            arr.push(ret.rows[i].value);
          }
          callBack({
            list: list,
            arr: arr
          })
        }
      });
    },
    secondStatistical(res) {
      let data = this.getFirstData(page);
      let xAxis = this.getFirstXAxis(page);
      this.myChartFirst = this.$echarts.init(this.$refs.primaryIndex);
      this.setFirstOption = {
        title: {
          show: true, //显示策略，默认值true,可选为：true（显示） | false（隐藏）
          text: '', //主标题文本，'\n'指定换行
          link: '', //主标题文本超链接,默认值true
          target: null, //指定窗口打开主标题超链接，支持'self' | 'blank'，不指定等同为'blank'（新窗口）
          x: 'left', //水平安放位置，默认为'left'，可选为：'center' | 'left' | 'right' | {number}（x坐标，单位px）
          y: 'top', //垂直安放位置，默认为top，可选为：'top' | 'bottom' | 'center' | {number}（y坐标，单位px）
          textAlign: null, //水平对齐方式，默认根据x设置自动调整，可选为： left' | 'right' | 'center
          backgroundColor: 'rgba(0,0,0,0)', //标题背景颜色，默认'rgba(0,0,0,0)'透明
          borderColor: '#ccc', //标题边框颜色,默认'#ccc'
          borderWidth: 0, //标题边框线宽，单位px，默认为0（无边框）
          padding: [10, 10, 10, 10], //标题内边距，单位px，默认各方向内边距为5，接受数组分别设定上右下左边距
          itemGap: 10, //主副标题纵向间隔，单位px，默认为10
          textStyle: {
            fontSize: 16,
            fontStyle: 'normal',
            fontWeight: '999',
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
          type: 'category',
          data: xAxis,
          axisLabel: {
            rotate: 45,
            margin: 8,
            formatter: function (params) {
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
        series: [{
          name: '',
          data: data,
          type: 'bar',
          barWidth: 28, //柱状图粗细
          itemStyle: {
            normal: {
              color: ['#3d91f7'],
              label: {
                show: true, //开启显示
                position: 'top', //在上方显示
                textStyle: { //数值样式
                  color: 'black',
                  fontSize: 12
                }
              }
            },
          }
        },],
        grid: {
          left: '4%',
          top: '12%',
          right: '4%',
          bottom: '0%',
          containLabel: true //防止坐标轴标签溢出
        }
      };
      this.myChartFirst.setOption(this.setFirstOption, true);
      setTimeout(() => {
        this.autoMoveFirst('scroll');
      }, 50)
    },
    thirdStatistical() {
      let data = this.getSecondData(page);
      let xAxis = this.getXAxis(page);
      this.myChartSecond = this.$echarts.init(this.$refs.parentCatalog);
      this.setSecondOption = {
        title: {
          show: true, //显示策略，默认值true,可选为：true（显示） | false（隐藏）
          text: '', //主标题文本，'\n'指定换行
          link: '', //主标题文本超链接,默认值true
          target: null, //指定窗口打开主标题超链接，支持'self' | 'blank'，不指定等同为'blank'（新窗口）
          x: 'left', //水平安放位置，默认为'left'，可选为：'center' | 'left' | 'right' | {number}（x坐标，单位px）
          y: 'top', //垂直安放位置，默认为top，可选为：'top' | 'bottom' | 'center' | {number}（y坐标，单位px）
          textAlign: null, //水平对齐方式，默认根据x设置自动调整，可选为： left' | 'right' | 'center
          backgroundColor: 'rgba(0,0,0,0)', //标题背景颜色，默认'rgba(0,0,0,0)'透明
          borderColor: '#ccc', //标题边框颜色,默认'#ccc'
          borderWidth: 0, //标题边框线宽，单位px，默认为0（无边框）
          padding: [10, 10, 10, 10], //标题内边距，单位px，默认各方向内边距为5，接受数组分别设定上右下左边距
          itemGap: 10, //主副标题纵向间隔，单位px，默认为10
          textStyle: {
            fontSize: 16,
            fontStyle: 'normal',
            fontWeight: '999',
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
          type: 'category',
          data: xAxis,
          axisLabel: {
            rotate: 45,
            margin: 8,
            formatter: function (params) {
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
        series: [{
          name: '新增',
          data: data,
          type: 'bar',
          barWidth: 28, //柱状图粗细
          itemStyle: {
            normal: {
              color: ['#3d91f7'],
              label: {
                show: true, //开启显示
                position: 'top', //在上方显示
                textStyle: { //数值样式
                  color: 'black',
                  fontSize: 12
                }
              }
            },

          }
        },],
        grid: {
          left: '4%',
          top: '12%',
          right: '4%',
          bottom: '0%',
          containLabel: true //防止坐标轴标签溢出
        }
      };
      this.myChartSecond.setOption(this.setSecondOption, true);
      setTimeout(() => {
        this.autoMoveRight('scroll');
      }, 50)
    },
    //停止滚动
    stop() {
      clearInterval(this.timeRightOut)
    },
    //继续滚动
    goMove() {
      this.autoMoveRight('scroll')
    },
    stopLeft() {
      clearInterval(this.timeLeftOut)
    },
    //继续滚动
    goLeftMove() {
      this.autoMoveFirst('scroll')
    },
    autoMoveLeft() {
      page--;
      if (page <= 0) {
        page = 1;
      }
      if (this.parentTotal < page) {
        this.parentPage = 1;
      } else {
        this.parentPage = page;
      }
      this.setSecondOption.series[0].data = this.getSecondData(page);
      this.setSecondOption.xAxis.data = this.getXAxis(page);
      this.myChartSecond.setOption(this.setSecondOption);
    },
    autoMoveRight(type) {
      if (type == 'scroll') {
        this.timeRightOut = setInterval(() => {
          page++;
          if (this.parentTotal < page) {
            this.parentPage = 1;
          } else {
            this.parentPage = page;
          }
          this.setSecondOption.series[0].data = this.getSecondData(page);
          this.setSecondOption.xAxis.data = this.getXAxis(page);
          this.myChartSecond.setOption(this.setSecondOption);
        }, 3000)
      } else {
        page++;
        if (this.parentTotal < page) {
          this.parentPage = 1;
        } else {
          this.parentPage = page;
        }
        this.setSecondOption.series[0].data = this.getSecondData(page);
        this.setSecondOption.xAxis.data = this.getXAxis(page);
        this.myChartSecond.setOption(this.setSecondOption);
      }
    },
    autoMoveFirst(type) {
      let _this = this;
      if (type == 'scroll') {
        _this.timeLeftOut = setInterval(() => {
          firstPage++;
          if (_this.firstTotal < firstPage) {
            _this.firstPage = 1;
            firstPage = 1;
          } else {
            _this.firstPage = firstPage;
          }
          _this.setFirstOption.series[0].data = _this.getFirstData(firstPage);
          _this.setFirstOption.xAxis.data = _this.getFirstXAxis(firstPage);
          _this.myChartFirst.setOption(_this.setFirstOption);
        }, 3000)
      } else {
        firstPage++;
        if (this.firstTotal < firstPage) {
          this.firstPage = 1;
          firstPage = 1;
        } else {
          this.firstPage = firstPage;
        }
        this.setFirstOption.series[0].data = this.getFirstData(firstPage);
        this.setFirstOption.xAxis.data = this.getFirstXAxis(firstPage);
        this.myChartFirst.setOption(this.setFirstOption);
      }
    },
    autoMoveFirstLeft() {
      firstPage--;
      if (firstPage <= 0) {
        firstPage = 1;
      }
      if (this.firstTotal < firstPage) {
        this.firstPage = 1;
      } else {
        this.firstPage = firstPage;
      }
      this.setFirstOption.series[0].data = this.getFirstData(firstPage);
      this.setFirstOption.xAxis.data = this.getFirstXAxis(firstPage);
      this.myChartFirst.setOption(this.setFirstOption);
    },
    getNums(val) {
      for (let i = 0; i < this.firstData.length; i++) {
        if (val == this.firstData[i].code) {
          this.chooseNum = i;
        }
      }
      page = 2;
      this.autoMoveLeft();
    },
  },
}
</script>

<style scoped lang="less">
.year {
  background: #fff;
  height: 300px;
  width: 100%;
}

.catalogStatic {
  padding-top: 10px;
  display: flex;
  width: 100%;
  justify-content: space-between;
  height: 300px;

  .catalogStatic-left,
  .catalogStatic-right {
    background: #fff;
    width: 50%;
    height: 100%;

    .catalogStatic-title {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-weight: 900;
      font-size: 16px;

      .left {
        display: flex;
        align-items: center;
      }

      .fenye {
        font-size: 12px;
        font-weight: 500;
        padding-left: 20px;
        color: #666;

        span {
          color: #3d91f7;
        }
      }
    }
  }

  .catalogStatic-left {
    padding: 14px;
    position: relative;
    margin-right: 5px;

    .btn {
      width: 24px;
      height: 56px;
      display: flex;
      justify-content: center;
      align-items: center;
      background: #D8E0EA;
      color: #fff;
      cursor: pointer;

      i {
        font-weight: bold;
      }

      &:hover {
        background: #C0C7D0;
      }
    }

    .btn.left {
      position: absolute;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
      border-radius: 0 4px 4px 0;
    }

    .btn.right {
      position: absolute;
      right: 0;
      top: 50%;
      transform: translateY(-50%);
      border-radius: 4px 0 0 4px;
    }

    .catalogStatic-title {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-weight: 900;
      font-size: 16px;

      .left {
        display: flex;
        align-items: center;
      }

      .fenye {
        font-size: 12px;
        font-weight: 500;
        padding-left: 20px;
        color: #666;

        span {
          color: #3d91f7;
        }
      }
    }

    .catalogStatic-left-bottom {
      width: 100%;
      height: calc(100% - 22px);

      .catalogStatic-left-content {
        height: 100%;
      }
    }
  }

  .catalogStatic-right {
    padding: 14px;
    margin-left: 5px;
    position: relative;

    .btn {
      width: 24px;
      height: 56px;
      display: flex;
      justify-content: center;
      align-items: center;
      background: #D8E0EA;
      color: #fff;
      cursor: pointer;

      i {
        font-weight: bold;
      }

      &:hover {
        background: #C0C7D0;
      }
    }

    .btn.left {
      position: absolute;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
      border-radius: 0 4px 4px 0;
    }

    .btn.right {
      position: absolute;
      right: 0;
      top: 50%;
      transform: translateY(-50%);
      border-radius: 4px 0 0 4px;
    }

    .catalogStatic-right-bottom {
      width: 100%;
      height: calc(100% - 22px);
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .catalogStatic-right-content {
      height: 100%;
      width: 100%;
    }
  }
}

.catalogList {
  display: flex;
  flex-direction: column;
  min-height: 400px;
  margin-top: 10px;
  padding: 6px 14px 14px 14px;
  background: #fff;

  .block {
    text-align: end;
    background: #fff;
    padding: 10px 0 0 0;
  }
}

.year-select-echarts {
  position: relative;

  .year-select {
    position: absolute;
    z-index: 99999;
    top: 13px;
    right: 150px;
    :deep(.el-select){
      .el-input{
        width: 90px;
      }
    }
  }
}

</style>
