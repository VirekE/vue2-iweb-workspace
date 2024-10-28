<template>
  <div class="home">
    <div class="trend">
      <div class="header">
        <div class="overview">
          <div class="icon">{{ $store.getters.curUser.name[0] }}</div>
          <div class="dept">
            <h2 class="title">{{ $store.getters.curUser.name }}</h2>
            <span class="region">{{ $store.getters.curUser.attrMap.REGION_NAME }} -
							{{ $store.getters.curUser.orgName }}</span>
          </div>
        </div>
        <div class="right-click">
          <el-badge :value="readList.value" class="item">
            <div class="btn info" @click="willGoto('/taskCenter/message','')">
              <i class="el-icon-message"></i>
              <div>
                <p>我的消息</p>
              </div>
            </div>
          </el-badge>
          <template v-for="item in functionList">
            <div class="btn" :class="item.type" @click="willGoto(item.path,item.params)">
              <i :class="item.icon"></i>
              <div>
                <p>{{ item.title }}</p>
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>
    <div class="first-content">
      <div class="left">
        <div class="left-top" v-if="getIsShow">
          <div class="title">
            <div class="font"></div>
            <p class="list-cell">待办任务统计：<span class="statistics">{{ todoNum || 0 }}</span>项</p>
          </div>
          <div class="wait-div">
            <template v-for="item in waitList">
              <div :class="$store.getters.curUser.roleValue && $store.getters.curUser.roleValue.indexOf('ZSJSH') != -
          1 && $store.getters.curUser.attrMap.REGION_CODE == '440301'?'wait-list':'wait-order-list'">
                <div>{{ item.title }}</div>
                <div class="num-button">
                  <div class="num-cell">
                    <span class="num">{{ item.num }}</span>
                    <span>项</span>
                  </div>
                  <el-button size="mini" type="primary" @click="willGoto(item.path)">进入<i
                      class="el-icon-right"></i>
                  </el-button>
                </div>
              </div>
            </template>
          </div>
        </div>
        <div class="left-top" v-else-if="getBBIsShow"></div>
        <div class="left-top" v-else-if="getKSLR">
          <div class="title">
            <div class="font"></div>
            <p class="list-cell">事项待办统计：<span class="statistics">{{ itemTodoNum || 0 }}</span>项</p>
            <el-button type="text" class="show-detail" @click="willGoto('/item/todo-list')">查看详情 <i
                class="el-icon-right"></i></el-button>
          </div>
        </div>
        <div class="left-footer" :class="getIsShow?'':getBBIsShow?'left-bb-foot':getKSLR?'left-foot':''">
          <div class="title">
            <div class="font"></div>
            <p class="list-cell">目录清单统计：<span class="statistics">{{ catalogParams.records || 0 }}</span>项</p>
            <el-button type="text" class="show-detail" @click="willGoto('/catalog/list')">查看详情 <i
                class="el-icon-right"></i></el-button>
          </div>
          <div class="catalog">
            <div class="catalogDiv">
              <span style="margin-bottom:10px;font-weight: 900; font-size: 14px;">目录清单分布：</span>
              <div style="margin-bottom:10px;">
                <span>一级分类</span>
                <el-select class="margin-l-r" v-model="firstCatalog" clearable size="mini"
                           @change="changeFirstCatalog" @clear="changeFirstCatalog">
                  <el-option v-for="item in firstCatalogList" :label="item.name" :value="item.code">
                  </el-option>
                </el-select>
                <!--<span style="margin:0 10px 0 15px;">二级分类</span>
                <el-select v-model="secondCatalog" size="mini" clearable  @change="changeSecondCatalog" @clear="changeSecondCatalog">
                  <el-option v-for="item in secondCatalogList" :label="item.name" :value="item.code"></el-option>
                </el-select>-->
                <!--                <span style="margin:0 10px 0 15px;">显示数据</span>-->
                <!--                <el-switch style="padding-" v-model="isShow" @change="changeData"></el-switch>-->
                <el-button type="text" icon="el-icon-refresh-left" @click="reLoad">重置</el-button>
              </div>
            </div>
            <div class="catalogStatic" :class="getIsShow?'':getBBIsShow?'left-bb-catalog':getKSLR?'left-ks-catalog':''"
                 ref="catalogStatic" @mouseout="goMove" @mouseover="stop"></div>
          </div>
        </div>
      </div>
      <div class="right">
        <div class="title">
          <div class="font"></div>
          <p class="list-cell">职责清单统计：<span class="statistics">{{ zzqdParams.records || 0 }}</span>项</p>
          <el-button type="text" class="show-detail" @click="willGoto('/qzqd/list')">查看详情 <i
              class="el-icon-right"></i>
          </el-button>
        </div>
        <div class="right-con"
             v-if="$store.getters.curUser.roleValue.indexOf('ZSJSH') != -1 || $store.getters.curUser.roleValue.indexOf('ZSJBB') != -1">
          <div class="top">
            <div class="itemLevel" ref="itemLevel"></div>
            <div class="manageType" ref="manageType"></div>
          </div>
          <div class="bottom">
<!--            <div class="xcjdNum">
              <p>下沉街道事项数统计</p>
              <el-select class="margin-l-r" v-model="regionCode" size="mini"
                         v-if="($store.getters.curUser.roleValue.indexOf('ZSJSH') != -1 || $store.getters.curUser.roleValue.indexOf('ZSJBB') != -1) && $store.getters.curUser.attrMap.REGION_CODE == '440301'"
                         @change="changeRegion('change')" clearable @clear="changeRegion('clear')">
                <el-option v-for="item in this.getDict.REGION" :label="item.itemValue"
                           :value="item.itemCode">
                </el-option>
              </el-select>
              <template v-if="deptList.length>0">
                <div class="con" ref="xcjdNum"></div>
              </template>
              <no-data class="nodata" v-else :hText="'暂无数据'"></no-data>
            </div>-->
            <div class="zzqdNum">
              <p>部门职责清单数Top10</p>
              <el-select class="margin-l-r" v-model="deptId" size="mini" @change="changeDept('change')"
                         v-if="($store.getters.curUser.roleValue.indexOf('ZSJSH') != -1 || $store.getters.curUser.roleValue.indexOf('ZSJBB') != -1) && $store.getters.curUser.attrMap.REGION_CODE == '440301'"

                         clearable @clear="changeDept('clear')">
                <el-option v-for="item in this.getDict.REGION" :label="item.itemValue"
                           :value="item.itemCode">
                </el-option>
              </el-select>
              <template v-if="deptIdList.length>0">
                <div class="con" ref="zzqdNum"></div>
              </template>
              <no-data class="nodata" v-else :hText="'暂无数据'"></no-data>
            </div>
          </div>
        </div>
        <div class="region" v-else>
          <div class="top">
            <div class="itemLevel" ref="itemLevel"></div>
            <div class="manageType" ref="manageType"></div>
          </div>
        </div>
      </div>
    </div>
    <div class="second-content" style="margin-top:30px;">
      <div class="title" v-if="getBBIsShow">
        <div class="font"></div>
        <p class="list-cell">事项清单统计：<span class="statistics">{{ itemParams.records || 0 }}</span>项</p>
        <el-button type="text" class="show-detail" @click="willGoto('/item/search')">查看详情 <i
            class="el-icon-right"></i>
        </el-button>
      </div>
      <div class="title" v-else>
        <div class="font"></div>
        <p class="list-cell">实施清单统计：<span class="statistics">{{ itemParams.records || 0 }}</span>项</p>
        <el-button type="text" class="show-detail" @click="willGoto('/item/list')">查看详情 <i
            class="el-icon-right"></i>
        </el-button>
      </div>
      <div class="ssqdTj">
        <div class="left">
          <template v-if="publishData.length != 0">
           <div class="first" ref="firstCityItem"></div>
          </template>
          <div class="first" v-else>
            <span class="no-data-div">{{
                (this.$store.getters.curUser.roleValue.indexOf('ZSJSH') != -1 || this.$store.getters.curUser
                    .roleValue.indexOf('ZSJBB') != -1) && this.$store.getters.curUser.attrMap.REGION_CODE != '440301' ? '部门已发布事项数 Top10' : '已发布事项数统计'
              }}</span>
              <no-data class="nodata" :hText="'暂无数据'"></no-data>
          </div>
        </div>
        <div class="right">
          <div class="itemPriority" ref="busiType"></div>
          <div class="chooseRegion" v-if="isShowBusiRegion">
            <div class="title">选择区划
              <el-button type="text" @click="reloadRegion('busiType')"
                         icon="el-icon-refresh-left">重置
              </el-button>
            </div>
            <div class="region">
              <template v-for="item in getDict.REGION">
                <el-tooltip class="item" effect="dark" v-if="item.itemValue.length>=4"
                            :content="item.itemValue" placement="top">
                  <div class="region-value" :class="busiTypeIndex == item.itemCode?'active':''"
                       @click="changeRegionBusiType(item)">{{ item.itemValue }}
                  </div>
                </el-tooltip>
                <div class="region-value" v-else :class="busiTypeIndex == item.itemCode?'active':''"
                     @click="changeRegionBusiType(item)">{{ item.itemValue }}
                </div>
              </template>
            </div>
          </div>
          <div v-else class="chooseRegion-detail">
            <div class="title"
                 v-if="(this.$store.getters.curUser.roleValue.indexOf('ZSJSH')  != -1|| this.$store.getters.curUser.roleValue.indexOf('ZSJBB') != -1) && this.$store.getters.curUser.attrMap.REGION_CODE == '440301'">
              <el-button @click="isShowBusiTypeInfo = !isShowBusiTypeInfo" type="text"
                         icon="el-icon-back">返回
              </el-button>
              <em></em>
              <span>统计详情</span>
            </div>
            <div class="info">
              <div class="info-title"
                   :class="$store.getters.curUser.roleValue.indexOf('ZSJSH') == -1 && $store.getters.curUser.roleValue.indexOf('ZSJBB') == -1?'info-title-dept':''"
                   v-if="$store.getters.curUser.roleValue.indexOf('ZSJSH') != -1|| $store.getters.curUser.roleValue.indexOf('ZSJBB') != -1">
                <span>当前区划：</span>{{ thatRegion || $store.getters.curUser.attrMap.REGION_NAME }}
              </div>
              <div class="info-title"
                   :class="$store.getters.curUser.roleValue.indexOf('ZSJSH') == -1 && $store.getters.curUser.roleValue.indexOf('ZSJBB') == -1?'info-title-dept':''"
                   v-else><span>当前部门：
							</span>
                <el-tooltip class="item" effect="dark" :content="$store.getters.curUser.attrMap.SELF_DEPT_NAME"
                            placement="top">
                  <span>{{ $store.getters.curUser.attrMap.SELF_DEPT_NAME }}</span>
                </el-tooltip>
              </div>

              <div class="item-con">
                <template v-for="item in busiTypeList">
                  <div class="itemLevelInfo">
                    <div class="infoColor" :style="{background:item.color}"></div>
                    <div class="content">{{ item.name + '事项' }}：<span
                        :style="{color:item.color}">{{ item.value }}</span></div>
                    <div>总占比：<span
                        :style="{color:item.color}">{{ getProportion(item, busiTypeTotal) }}</span>
                    </div>
                  </div>
                </template>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="cityItem">
        <template v-if="secondList.length != 0">
          <div class="second" ref="secondCityItem"></div>
        </template>
        <div class="second" v-else>
          <span class="no-data-div">{{ getSecondItemName }}</span>
          <no-data class="nodata" :hText="'暂无数据'"></no-data>
        </div>
        <div class="third">
          <div style="display: flex;justify-content: space-between;padding-left: 5px;align-items: center;">
            <span class="no-data-div">实施类型事项数统计</span>
            <el-select v-if="($store.getters.curUser.roleValue.indexOf('ZSJSH') != -1 || $store.getters.curUser.roleValue
									.indexOf('ZSJBB') != -1) && $store.getters.curUser.attrMap.REGION_CODE == '440301'"
                       class="margin-l-r" v-model="taskType" size="mini" @change="changeTaskType" clearable
                       @clear="changeTaskType('clear')">
              <el-option v-for="item in this.getDict.REGION" :label="item.itemValue"
                         :value="item.itemCode">
              </el-option>
            </el-select>
          </div>
          <div v-if="taskTypeData.length>0" class="taskTypeSty">
            <div class="con" ref="thirdCityItem"></div>
          </div>
          <div v-if="taskTypeData.length<=0" class="taskTypeSty">
            <no-data class="nodata" :hText="'暂无数据'"></no-data>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import qzBase from '@_src/pages/mssq/common/util/qzBase';
import NoData from "../common/components/NoData";

const len = 18;
export default {
  name: "index",
  components: {
    NoData
  },
  mixins: [qzBase],

  data() {
    return {
      deptList: [],
      readList: {},
      isShowRegionInfo: false,
      isShowBusiTypeInfo: false,
      publishData: [],
      isShow: true,
      itemPriorityList: [],
      busiTypeList: [],
      busiTypeTotal: -1,
      itemPriorityIndex: -1,
      busiTypeIndex: -1,
      priorityTotal: -1,
      thatRegion: '',
      thisRegion: '',
      catalogParams: {
        records: 0
      },
      zzqdParams: {
        records: 0
      },
      itemParams: {
        records: 0
      },
      taskTypeData: [],
      getDict: {},
      firstCatalog: '',
      firstCatalogCopy: '',
      firstCatalogList: [],
      secondCatalog: '',
      secondCatalogCopy: '',
      secondCatalogList: [],
      thirdCatalogList: [],
      secondList: [],
      regionCode: "",
      deptId: "",
      deptIdList: [],
      copyList: ['#1DC538', '#41B2FF', '#FF504B', '#6E5DFF', '#00CDEF', '#FF913D'],
      waitList: [],
      todoNum: 0,
      itemTodoNum: 0,
      itemPriority: {},
      busiType: {},
      myChart: {},
      catalogOption: {},
      myChartLevel: {},
      myChartType: {},
      myChartSxxc: {},
      myChartZzqd: {},
      myChartPriority: {},
      myChartBusitype: {},
      myChartPublish: {},
      myChartOverall: {},
      myChartTask: {},
      taskType: '',
      timeOut: '',
      itemLevel: [],
      manageType: [],
    }
  },
  mounted() {
    let _this = this;
    this.getCatalogList();
    this.getItemList();
    this.getReadList();
    // this.getZzqdList();
    this.queryDict("REGION,ITEM_TYPE,BUSI_TYPE,SSCJ,MANAGE_TYPE,TASK_TYPE", res => {
      this.getDict = res;
      this.todoList();
      this.getCatalogValue(res => {
        this.getCatalog(res);
      }, '');
      this.getItemLevelValue(res => {
        this.getItemLevel(res);
      }, '');
      this.getManageTypeValue(res => {
        this.getManageType(res);
      }, '');
      if ((this.$store.getters.curUser.roleValue.indexOf('ZSJSH') != -1 || this.$store.getters.curUser.roleValue.indexOf('ZSJBB') != -1) && this.$store.getters.curUser.attrMap.REGION_CODE == '440301') {
        this.getSxxcValue(res => {
          this.getSxxc(res);
        }, '');
        this.getZzqdValue(res => {
          this.getZzqd(res);
        }, '');
      } else if ((this.$store.getters.curUser.roleValue.indexOf('ZSJSH') != -1 || this.$store.getters.curUser.roleValue.indexOf('ZSJBB') != -1) && this.$store.getters.curUser.attrMap.REGION_CODE != '440301') {
        this.regionCode = this.$store.getters.curUser.attrMap.REGION_CODE;
        this.deptId = this.$store.getters.curUser.attrMap.REGION_CODE;
        this.getSxxcDeptValue(res => {
          this.getSxxc(res);
        }, '');
        this.getZzqdValue(res => {
          this.getZzqd(res);
        }, this.$store.getters.curUser.attrMap.REGION_CODE)
      }
      _this.getPriorityValue(res => {
        _this.getPriority(res);
      }, _this.$store.getters.curUser.attrMap.REGION_CODE == '440301' ? '' : _this.$store.getters.curUser.attrMap.REGION_CODE);
      this.getBusiTypeValue(res => {
        this.getBusiType(res);
      }, _this.$store.getters.curUser.attrMap.REGION_CODE == '440301' ? '' : _this.$store.getters.curUser.attrMap.REGION_CODE);
      this.getPublishValue(res => {
        this.getPublish(res)
      });
      this.getOverallValue(res => {
        if (this.secondList.length > 0) {
          this.getOverall(res)
        }
      });
      this.getTaskTypeValue(res => {
        if (this.isNotNull(this.taskTypeData)) {
          this.getTaskType(res)
        }
      }, '')
    });
    let that = this
    window.addEventListener("resize", () => {
      this.$nextTick(() => {
        that.rese();
      })
    });
  },
  computed: {
    getIsShow() {
      let roleValue = this.$store.getters.curUser.roleValue;
      if (roleValue.indexOf('ZSJSH') != -1 || roleValue.indexOf('BMLR') != -1 ||
          roleValue.indexOf('QBMLR') != -1) {
        return true
      }
      return false
    },
    getBBIsShow() {
      let roleValue = this.$store.getters.curUser.roleValue;
      if (roleValue.indexOf('ZSJSH') == -1 && roleValue.indexOf('KSLR') == -1 && roleValue.indexOf('QKSLR') == -1 && roleValue.indexOf('BMLR') == -1 && roleValue.indexOf('QBMLR') == -1) {
        if (roleValue.indexOf('ZSJBB') != -1) {
          return true
        }
      }
      return false
    },
    getKSLR() {
      let roleValue = this.$store.getters.curUser.roleValue;
      if (roleValue.indexOf('ZSJSH') == -1 && roleValue.indexOf('BMLR') == -1 && roleValue.indexOf('QBMLR') == -1) {
        if (roleValue.indexOf('KSLR') != -1 || roleValue.indexOf('QKSLR') != -1) {
          return true
        }
      }
      return false
    },
    isShowRegion() {
      if ((this.$store.getters.curUser.roleValue.indexOf('ZSJSH') != -1 || this.$store.getters.curUser.roleValue.indexOf('ZSJBB') != -1) && this.$store.getters.curUser.attrMap.REGION_CODE == '440301' && !this.isShowRegionInfo) {
        return true
      } else {
        return false
      }
    },
    isShowBusiRegion() {
      if ((this.$store.getters.curUser.roleValue.indexOf('ZSJSH') != -1 || this.$store.getters.curUser.roleValue.indexOf('ZSJBB') != -1) && this.$store.getters.curUser.attrMap.REGION_CODE == '440301' && !this.isShowBusiTypeInfo) {
        return true
      } else {
        return false
      }
    },
    functionList() {
      if (this.$store.getters.curUser.roleValue && this.$store.getters.curUser.roleValue.indexOf('ZSJSH') != -1 && this.$store.getters.curUser.attrMap.REGION_CODE == '440301') {
        {
          return [{
            type: 'success',
            icon: 'el-icon-document-add',
            title: '目录新增',
            content: '跳转至目录新增页面',
            path: '/catalog/register',
            button: '前往',
          }, {
            type: 'danger',
            icon: 'el-icon-document-delete',
            title: '目录废置',
            path: '/catalog/disuse',
            params: {},
            content: '跳转至目录废置页面',
            button: '前往'
          }, {
            type: 'warning',
            icon: 'el-icon-edit-outline',
            title: '事项变更',
            path: '/item/list',
            content: '跳转至目录变更页面',
            params: {},
            button: '前往'
          }, {
            type: 'primary',
            icon: 'el-icon-search',
            title: '事项查询',
            path: '/item/search',
            params: {},
            content: '跳转至目录清单页面',
            button: '前往'
          }]
        }
      } else if (this.$store.getters.curUser.roleValue.indexOf('KSLR') != -1 || this.$store.getters.curUser.roleValue.indexOf('KSLR') != -1) {
        return [{
          type: 'warning',
          icon: 'el-icon-edit-outline',
          title: '事项变更',
          path: '/item/list',
          content: '跳转至目录变更页面',
          params: {},
          button: '前往'
        }, {
          type: 'primary',
          icon: 'el-icon-search',
          title: '事项查询',
          path: '/item/search',
          params: {},
          content: '跳转至目录清单页面',
          button: '前往'
        }]
      } else if (this.$store.getters.curUser.roleValue && this.$store.getters.curUser.roleValue.indexOf('ZSJSH') != -1 &&
          this.$store.getters.curUser.attrMap.REGION_CODE != '440301') {
        return [{
          type: 'success',
          icon: 'el-icon-document-add',
          title: '目录新增',
          content: '跳转至目录新增页面',
          path: '/catalog/register',
          button: '前往',
        }, {
          type: 'warning',
          icon: 'el-icon-edit-outline',
          title: '事项变更',
          path: '/item/list',
          content: '跳转至目录变更页面',
          params: {},
          button: '前往'
        }, {
          type: 'primary',
          icon: 'el-icon-search',
          title: '事项查询',
          path: '/item/search',
          params: {},
          content: '跳转至目录清单页面',
          button: '前往'
        }]
      }
      return [{
        type: 'success',
        icon: 'el-icon-document-add',
        title: '目录新增',
        content: '跳转至目录新增页面',
        path: '/catalog/register',
        button: '前往',
      }, {
        type: 'primary',
        icon: 'el-icon-search',
        title: '事项查询',
        path: '/item/search',
        params: {},
        content: '跳转至目录清单页面',
        button: '前往'
      },]
    },
    getProportion() {
      return function (val, total) {
        if (val.value == 0 || total == 0) {
          return 0 + '%';
        }
        return (Math.round(val.value / this.priorityTotal * 10000) / 100.00) + '%';// 小数点后两位百分比
      }
    },
    getSecondItemName() {
      if ((this.$store.getters.curUser.roleValue.indexOf('ZSJSH') != -1 || this.$store.getters.curUser.roleValue.indexOf('ZSJBB') != -1)
          && this.$store.getters.curUser.attrMap.REGION_CODE == '440301') {
        return '已统筹事项数统计'
      }/*else if((this.$store.getters.curUser.roleValue.indexOf('ZSJSH') != -1 || this.$store.getters.curUser.roleValue.indexOf('ZSJBB') != -1)
								&& this.$store.getters.curUser.attrMap.REGION_CODE != '440301'){
					return  '部门已统筹事项数 Top10'
				}*/ else {
        return '已授权科室事项数统计'
      }
    },
  },
  methods: {
    rese() {
      !this.isEmptyObject(this.myChart) && this.myChart.resize();
      !this.isEmptyObject(this.myChartLevel) && this.myChartLevel.resize();
      !this.isEmptyObject(this.myChartType) && this.myChartType.resize();
      !this.isEmptyObject(this.myChartSxxc) && this.myChartSxxc.resize();
      !this.isEmptyObject(this.myChartZzqd) && this.myChartZzqd.resize();
      !this.isEmptyObject(this.myChartPriority) && this.myChartPriority.resize();
      !this.isEmptyObject(this.myChartBusitype) && this.myChartBusitype.resize();
      !this.isEmptyObject(this.myChartPublish) && this.myChartPublish.resize();
      !this.isEmptyObject(this.myChartOverall) && this.myChartOverall.resize();
      !this.isEmptyObject(this.myChartTask) && this.myChartTask.resize();

    },
    Percentage(num, total) {

    },
    todoList() {
      var url = this.Config.baseContext + "/mssq/tj/todoListCount";
      this.$http_post(url, {}).then(ret => {
        if (ret.state == 1) {
          let arr = [];
          let count = 0;
          let obj = {
            catalog: {
              title: '目录待办',
              num: '0',
              path: '/catalog/examine'
            },
            item: {
              title: '事项待办',
              num: '0',
              path: '/item/todo-list'
            }
          };
          if (this.$store.getters.curUser.attrMap.REGION_CODE == '440301' && this.$store.getters
              .curUser.roleValue.indexOf('ZSJSH') != -1) {
            obj = {
              catalog: {
                title: '目录待办',
                num: '0',
                path: '/catalog/examine'
              },
              item: {
                title: '事项待办',
                num: '0',
                path: '/item/todo-list'
              },
              /*asWhole: {
                title: '统筹待办',
                num: '0',
                path: '/overAll/waitTodo'
              }*/
            };
          }
          for (let i = 0; i < ret.rows.length; i++) {
            if (obj[ret.rows[i].code]) {
              arr.push({
                title: ret.rows[i].name,
                num: ret.rows[i].value,
                path: obj[ret.rows[i].code].path || ''
              });
              if (ret.rows[i].code == 'item') {
                this.itemTodoNum = ret.rows[i].value
              }
              count += ret.rows[i].value
            }
          }
          this.waitList = arr;
          this.todoNum = count;
        }
      });
    },
    getCatalogValue(callback) {
      var url = this.Config.baseContext + "/mssq/tj/listCatalog";
      this.$http_post(url, {}).then(ret => {
        if (ret.state == 1) {
          let num = 0;
          let name = [];
          this.firstCatalogList = JSON.parse(JSON.stringify(ret.rows));
          this.firstCatalogCopy = JSON.parse(JSON.stringify(ret.rows));
          this.maopao(ret.rows).reverse();
          // this.firstCatalogList.unshift({name:'全部',value:ret.rows});
          for (let i = 0; i < ret.rows.length; i++) {
            num += ret.rows[i].value;
            name.push(ret.rows[i].name)
          }
          callback({
            arr: ret.rows,
            num: num,
            name: name
          })
        }
      });
    },
    getCatalog(res) {
      let _this = this;
      // let region = ['深圳市', '福田区', '罗湖区', '盐田区', '南山区', '宝安区', '龙岗区','深汕特别合作区', '坪山区', '光明区', '龙华区', '大鹏新区'];
      this.myChart = this.$echarts.init(this.$refs.catalogStatic);
      let option = {
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
          padding: [10, 0, 0, 0], //标题内边距，单位px，默认各方向内边距为5，接受数组分别设定上右下左边距
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
          type: 'category',
          data: res.name,
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
        dataZoom: [
          //滑动条
          {
            fillerColor: "rgba(170, 206, 255, 0.4)",
            height: 15,
            bottom: '0%',
            // right: "13%",
            // left: "13%",
            xAxisIndex: 0, //这里是从X轴的0刻度开始
            show: res.arr.length > len, //是否显示滑动条，不影响使用
            type: "slider", // 这个 dataZoom 组件是 slider 型 dataZoom 组件
            startValue: 0, // 从头开始。
            endValue: len, // 一次性展示6个。
            minValueSpan: len,
            maxValueSpan: len,
            textStyle: {
              fontSize: 1
            },
          },
        ],
        series: [{
          data: res.arr,
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
        }],
        grid: {
          left: '2%',
          top: '20px',
          right: '2%',
          bottom: res.arr.length <= len ? '0%' : '12%',
          containLabel: true //防止坐标轴标签溢出
        }
      };
      this.catalogOption = option;
      this.myChart.setOption(option, true);
      // this.myChart.on('mouseover',this.stop)
      // this.myChart.on('mouseout',this.goMove)
      this.$nextTick(() => {
        setTimeout(() => {
          this.autoMove()
        }, 50)
      })
    },
    //停止滚动
    stop() {
      clearInterval(this.timeOut)
    },
    //继续滚动
    goMove() {
      this.autoMove()
    },
    autoMove() {
      let end = len;
      let _this = this;
      let arr = [];
      /*if(this.isNotNull(_this.thirdCatalogList)){
				  arr = _this.thirdCatalogList
				}else*/
      if (this.isNotNull(_this.firstCatalog)) {
        arr = _this.secondCatalogList
      } else {
        arr = _this.firstCatalogList;
      }
      // let option = this.myChart.getOption();
      //this.dataList.seriesData为柱形图数据
      this.timeOut = setInterval(() => {
        // clearInterval(this.timeOut)
        // 每次向后滚动一个，最后一个从头开始。
        // if(this.stopMove){ return }
        if (Number(_this.catalogOption.dataZoom[0].endValue) === arr.length - 1) {
          _this.catalogOption.dataZoom[0].endValue = end;
          _this.catalogOption.dataZoom[0].startValue = 0;
        } else {
          _this.catalogOption.dataZoom[0].endValue = _this.catalogOption.dataZoom[0].endValue + 1;
          _this.catalogOption.dataZoom[0].startValue = _this.catalogOption.dataZoom[0].startValue +
              1;
        }
        if (_this.catalogOption.series[0].label) {
          _this.catalogOption.series[0].label.show = this.isShow;
        } else {
          _this.catalogOption.series[0].itemStyle.normal.label.show = this.isShow;
        }
        this.myChart.setOption(this.catalogOption)
      }, 1500);
    },
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
      let _this = this;
      this.myChartLevel = this.$echarts.init(this.$refs.itemLevel);
      let option = {
        title: {
          show: true, //显示策略，默认值true,可选为：true（显示） | false（隐藏）
          text: '事项层级分布', //主标题文本，'\n'指定换行
          link: '', //主标题文本超链接,默认值true
          target: null, //指定窗口打开主标题超链接，支持'self' | 'blank'，不指定等同为'blank'（新窗口）
          x: 'center', //水平安放位置，默认为'left'，可选为：'center' | 'left' | 'right' | {number}（x坐标，单位px）
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
            fontSize: 16,
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
          data: res.name,
          axisTick: { //刻度线
            show: false
          }
        },
        yAxis: {
          type: 'value',
          splitLine: { //网格线
            show: false
          },
          axisTick: { //刻度线
            show: false
          },
          show: false, //这里的show用于设置是否显示x轴那一条线 默认为true
        },
        series: [{
          data: res.num,
          type: 'line',
          type: 'pictorialBar',
          barCategoryGap: "5%",
          symbol: "path://M0,10 L10,10 C5.5,10 5.5,5 5,0 C4.5,5 4.5,10 0,10 z",
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
            }
          },
          lineStyle: {
            normal: {
              color: '#78c4ff', //折线的颜色
              width: '0' //折线粗细
            }
          },
          areaStyle: { //折线下面区块的颜色
            color: ['#78c4ff']
          },
        }]
      };
      this.myChartLevel.setOption(option, true);
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
            name: name,
            num: num
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
      let _this = this;
      this.myChartType = this.$echarts.init(this.$refs.manageType);
      let option = {
        title: {
          show: true, //显示策略，默认值true,可选为：true（显示） | false（隐藏）
          text: '管理类型分布', //主标题文本，'\n'指定换行
          link: '', //主标题文本超链接,默认值true
          target: null, //指定窗口打开主标题超链接，支持'self' | 'blank'，不指定等同为'blank'（新窗口）
          x: 'center', //水平安放位置，默认为'left'，可选为：'center' | 'left' | 'right' | {number}（x坐标，单位px）
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
            fontSize: 16,
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
          data: res.name,
          axisTick: { //刻度线
            show: false
          }
        },
        yAxis: {
          type: 'value',
          splitLine: { //网格线
            show: false
          },
          axisTick: { //刻度线
            show: false
          },
          show: false, //这里的show用于设置是否显示x轴那一条线 默认为true
        },
        series: [{
          data: res.num,
          type: 'line',
          type: 'pictorialBar',
          barCategoryGap: "5%",
          symbol: "path://M0,10 L10,10 C5.5,10 5.5,5 5,0 C4.5,5 4.5,10 0,10 z",
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
            }
          },
          lineStyle: {
            normal: {
              color: '#3d91f7', //折线的颜色
              width: '0' //折线粗细
            }
          },
          areaStyle: { //折线下面区块的颜色
            color: ['#3d91f7']
          },
        }]
      };
      this.myChartType.setOption(option, true);
    },
    getSxxcValue(callback) {
      var url = this.Config.baseContext + "/mssq/tj/listItemCountByRegionCode";
      this.$http_post(url, {}).then(ret => {
        if (ret.state == 1) {
          this.deptList = ret.rows;
          let list = [];
          let maopaoList = [];
          let arr = [];
          let num = [];
          for (let i = 0; i < this.getDict['REGION'].length; i++) {
            let flag = -1;
            for (let j = 0; j < ret.rows.length; j++) {
              // let list = this.maopao( ret.rows));
              if (this.getDict['REGION'][i].itemCode == ret.rows[j].code) {
                flag = j
              }
            }

            if (flag != -1) {
              list.push(ret.rows[flag])
            } else {
              list.push({
                name: this.getDict['REGION'][i].itemValue,
                value: 0,
              })
            }
          }
          maopaoList = this.maopao(list);
          for (let k = 0; k < maopaoList.length; k++) {
            arr.push(maopaoList[k].name);
            num.push(maopaoList[k].value)
          }
          this.regionList = arr;
          this.regionValue = num;

          callback({
            arr: arr,
            num: num
          })
        }
      });
    },
    maopao(arr) {
      for (var j = 0; j < arr.length - 1; j++) {
        // 这里 i < arr.length - 1 ，要思考思考合适吗？我们下面继续说
        for (var i = 0; i < arr.length - 1; i++) {
          if (arr[i].value > arr[i + 1].value) {
            var temp = arr[i];
            arr[i] = arr[i + 1];
            arr[i + 1] = temp;
          }
        }
      }
      return arr
    },
    getSxxcDeptValue(callback) {
      var url = this.Config.baseContext + "/mssq/tj/listIsStreetByDept";
      this.$http_post(url, {
        regionCode: this.regionCode
      }).then(ret => {
        if (ret.state == 1) {
          this.deptList = ret.rows;
          let arr = [];
          let num = [];
          let list = this.maopao(ret.rows);
          for (let j = 0; j < list.length; j++) {
            num.push(list[j].value)
            arr.push(list[j].name)
          }
          arr = this.maopao(arr);
          num = this.maopao(num);
          callback({
            arr: arr,
            num: num,
          })
        }
      });
    },
    getSxxc(res) {
      let _this = this;
      this.$nextTick(() => {
        this.myChartSxxc = this.$echarts.init(this.$refs.xcjdNum);
        let option = {
          xAxis: {
            type: 'category',
            data: res.arr,
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
            /* formatter: function (arg) {
                 return arg[0].name + ':' + arg[0].data;
               }*/
          },
          series: [{
            data: res.num,
            type: 'bar',
            barWidth: 14, //柱状图粗细
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
          }],
          grid: {
            left: '6%',
            top: '12%',
            right: '10%',
            bottom: '1%',
            containLabel: true //防止坐标轴标签溢出
          }
        };
        this.myChartSxxc.setOption(option, true);
      })

    },
    getZzqdValue(callback) {
      let arr = [];
      let num = [];
      var url = this.Config.baseContext + "/mssq/tj/listItemCountByDept";
      this.$http_post(url, {
        regionCode: this.deptId
      }).then(ret => {
        if (ret.state == 1) {
          this.deptIdList = ret.rows;
          for (let i = 0; i < ret.rows.length; i++) {
            arr.push(ret.rows[i].name);
            num.push(ret.rows[i].value);
          }
          arr = arr.reverse();
          num = num.reverse();
          callback({
            arr: arr,
            num: num
          })
        }
      });
    },
    getZzqd(res) {
      let _this = this;
      // let region = ['深圳市', '福田区', '罗湖区', '盐田区', '南山区', '宝安区', '龙岗区', '坪山区', '光明区', '龙华区', '大鹏新区'];
      this.$nextTick(() => {
        this.myChartZzqd = this.$echarts.init(this.$refs.zzqdNum);
        /*	let option = {
						title: [{
							x: 'center',
							y: 'top',
							textAlign: 'center',
							text: '',
							textStyle: {
								fontSize: 14,
								align: 'center'
							},
							subtextStyle: {
								align: 'center'
							},
						}],
						polar: {
							radius: [20, '100%']
						},
						angleAxis: {
							max: _this.getMaxNum(res.num),
							startAngle: 90,
							show: false
						},
						radiusAxis: {
							type: 'category',
							axisLine: {
								show: false
							},
							axisTick: {
								show: false
							},
							axisLabel: {
								interval: 0,
								textStyle: {
									color: '#333',
									fontSize: 6,
									lineHeight: 14,
									height: 14,
								},
							},

							data: res.arr,
						},
						tooltip: {},
						series: {
							type: 'bar',
							barWidth: 6,
							data: res.num,
							coordinateSystem: 'polar',
							itemStyle: {
								normal: {
									color: ['#78c4ff'],
									label: {
										show: true, //开启显示
										position: 'top', //在上方显示
										textStyle: { //数值样式
											color: 'black',
											fontSize: 14
										}
									}
								}
							},
							label: {
								show: true,
								// position: 'middle',
								// formatter: '{b}: {c}'
							}
						},

					};*/
        let option = {
          xAxis: {
            type: 'category',
            data: res.arr,
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
            /* formatter: function (arg) {
						   return arg[0].name + ':' + arg[0].data;
						 }*/
          },
          series: [{
            data: res.num,
            type: 'bar',
            barWidth: 14, //柱状图粗细
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
          }],
          grid: {
            left: '8%',
            top: '12%',
            right: '7%',
            bottom: '1%',
            containLabel: true //防止坐标轴标签溢出
          }
        };
        this.myChartZzqd.setOption(option, true);
      })
    },
    changeDept(type) {
      if (type == 'clear') {
        this.deptId = '';
      }
      let _this = this;
      this.getZzqdValue(res => {
        this.$nextTick(() => {
          let itemPriority = _this.myChartZzqd.getOption();
          itemPriority.series[0].data = res.num;
          itemPriority.xAxis[0].data = res.arr;
          this.$echarts.init(this.$refs.zzqdNum).setOption(itemPriority);
        })
      })
    },
    changeRegion(type) {
      let _this = this;
      if (type == 'clear') {
        this.getSxxcValue(res => {
          this.$nextTick(() => {
            if (!this.$refs.xcjdNum) return
            let itemPriority = _this.myChartSxxc.getOption();
            itemPriority.series[0].data = res.num;
            itemPriority.xAxis[0].data = res.arr;
            this.$echarts.init(this.$refs.xcjdNum).setOption(itemPriority);
          })
        })
      } else {
        this.getSxxcDeptValue(res => {
          this.$nextTick(() => {
            if (!this.$refs.xcjdNum) return
            let itemPriority = _this.myChartSxxc.getOption();
            itemPriority.series[0].data = res.num;
            itemPriority.xAxis[0].data = res.arr;
            this.$echarts.init(this.$refs.xcjdNum).setOption(itemPriority);
          })
        })
      }
    },
    getCatalogList() {
      let _this = this;
      var url = this.Config.baseContext + "/mssq/tj/tabListCount";
      this.$http_post(url, {}).then(ret => {
        if (ret.state == 1) {
          let obj = {
            catalog: 'catalogParams',
            item: 'itemParams',
            dutyItem: 'zzqdParams'
          };
          for (let i = 0; i < ret.rows.length; i++) {
            _this[obj[ret.rows[i].code]].records = ret.rows[i].value;
          }
        } else {
          this.$message.error(ret.message);
        }
      });
    },
    getReadList() {
      var url = this.Config.baseContext + "/mssq/tj/selectTodoSms";
      this.$http_post(url, {}).then(ret => {
        if (ret.state == 1) {
          this.readList = ret.row;
        } else {
          this.$message.error(ret.message);
        }
      });
    },
    getItemList() {
      var url = this.Config.baseContext + "/mssq/tj/itemListCount";
      this.$http_post(url, {
        page: 1,
        limit: 100000
      }).then(ret => {
        if (ret.state == 1) {
          this.itemParams.records = ret.row.value;
        } else {
          this.$message.error(ret.message);
        }
      });
    },
    getPriorityValue(callback, region) {
      var url = this.Config.baseContext + "/mssq/tj/listItemCountByType";
      this.$http_post(url, {
        regionCode: region
      }).then(ret => {
        if (ret.state == 1) {
          let arr = [];
          let num = 0;
          for (let i = 0; i < this.getDict['ITEM_TYPE'].length; i++) {
            let flag = -1;
            for (let j = 0; j < ret.rows.length; j++) {
              if (this.getDict['ITEM_TYPE'][i].itemCode == ret.rows[j].code) {
                flag = j
              }
            }
            if (flag != -1) {
              num += ret.rows[flag].value;
              arr.push({
                color: this.copyList[i],
                name: this.getDict['ITEM_TYPE'][i].itemValue,
                code: ret.rows[flag].code,
                value: ret.rows[flag].value
              })
            } else {
              arr.push({
                color: this.copyList[i],
                name: this.getDict['ITEM_TYPE'][i].itemValue,
                code: this.getDict['ITEM_TYPE'][i].itemCode,
                value: '0'
              })
            }
          }
          this.priorityTotal = num;
          this.itemPriorityList = JSON.parse(JSON.stringify(arr));
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
    getPriority(res) {
      let _this = this;
      this.myChartPriority = this.$echarts.init(this.$refs.itemPriority);
      let option = {
        title: {
          text: '事项级别分析',
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
          textStyle: {
            align: "left",
            baseline: "middle",
          },
          radius: '58%',
          center: ['52%', '55%'],
          labelLine: {
            normal: {
              length: 5
            }
          },
          data: res.arr, //,
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          },
          itemStyle: {
            normal: {
              color: function (params) {
                var colorList = ['#1DC538', '#41B2FF', '#FF504B', '#6E5DFF', '#00CDEF',
                  '#FF913D'
                ];
                if (params.dataIndex % colorList.length == 0) {
                  for (let i = 0; i < colorList.length; i++) {
                    _this.copyList.push(colorList[i])
                  }
                }
                return _this.copyList[params.dataIndex]
              },
              label: {
                fontSize: 12,
                show: true,
                formatter: '{b} :' + "\n" + ' {c} ({d}%)',
                rich: {
                  b: {
                    align: 'center'
                  },
                }
              },
              borderWidth: 1,
              borderColor: '#fff',
              labelLine: {
                show: true
              }
            },
          }
        }]
      };
      this.myChartPriority.setOption(option, true);
    },
    getBusiTypeValue(callback, region) {
      var url = this.Config.baseContext + "/mssq/tj/listItemCountByType";
      this.$http_post(url, {
        regionCode: region
      }).then(ret => {
        if (ret.state == 1) {
          let arr = [];
          let num = 0;
          for (let i = 0; i < this.getDict['ITEM_TYPE'].length; i++) {
            let flag = -1;
            for (let j = 0; j < ret.rows.length; j++) {
              if (this.getDict['ITEM_TYPE'][i].itemCode == ret.rows[j].code) {
                flag = j
              }
            }

            if (flag != -1) {
              num += ret.rows[flag].value;
              arr.push({
                color: this.copyList[i],
                name: this.getDict['ITEM_TYPE'][i].itemValue,
                code: ret.rows[flag].code,
                value: ret.rows[flag].value
              })
            } else {
              arr.push({
                color: this.copyList[i],
                name: this.getDict['ITEM_TYPE'][i].itemValue,
                code: this.getDict['ITEM_TYPE'][i].itemCode,
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
    getBusiType(res) {
      let _this = this;
      this.myChartBusitype = this.$echarts.init(this.$refs.busiType);
      let option = {
        title: {
          text: '事项类型分析',
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
          radius: '58%',
          center: ['52%', '52%'],
          data: res.arr, //,
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          },
          itemStyle: {
            normal: {
              color: function (params) {
                var colorList = ['#1DC538', '#41B2FF', '#FF504B', '#6E5DFF', '#00CDEF',
                  '#FF913D'
                ];
                if (params.dataIndex % colorList.length == 0) {
                  for (let i = 0; i < colorList.length; i++) {
                    _this.copyList.push(colorList[i])
                  }
                }
                return _this.copyList[params.dataIndex]
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
      this.myChartBusitype.setOption(option, true);
    },
    changeRegionValue(item) {
      let _this = this;
      this.isShowRegionInfo = !this.isShowRegionInfo
      if (this.itemPriorityIndex != -1 && this.itemPriorityIndex == item.itemCode) {
        this.thisRegion = '';
        this.itemPriorityIndex = -1;
        this.getPriorityValue(res => {
          let itemPriority = _this.myChartPriority.getOption();
          itemPriority.series[0].data = res.arr;
          _this.myChartPriority.setOption(itemPriority);
        }, '')
      } else {
        this.thisRegion = item.itemValue;
        this.itemPriorityIndex = item.itemCode;
        this.getPriorityValue(res => {
          let itemPriority = _this.myChartPriority.getOption();
          itemPriority.series[0].data = res.arr;
          _this.myChartPriority.setOption(itemPriority);
        }, item.itemCode)
      }
    },
    changeRegionBusiType(item) {
      let _this = this;
      this.isShowBusiTypeInfo = !this.isShowBusiTypeInfo
      if (this.busiTypeIndex != -1 && this.busiTypeIndex == item.itemCode) {
        this.busiTypeIndex = -1;
        this.thatRegion = '';
        this.getBusiTypeValue(res => {
          let busiType = _this.myChartBusitype.getOption();
          busiType.series[0].data = res.arr;
          _this.myChartBusitype.setOption(busiType);
        }, '')
      } else {
        this.thatRegion = item.itemValue;
        this.busiTypeIndex = item.itemCode;
        this.getBusiTypeValue(res => {
          let busiType = _this.myChartBusitype.getOption();
          busiType.series[0].data = res.arr;
          _this.myChartBusitype.setOption(busiType);
        }, item.itemCode)
      }
    },
    getEchartsDict(data) {
      let arr = [];
      for (let i = 0; i < data.length; i++) {
        arr.push(data[i].itemValue)
      }
      return arr
    },
    getPublishValue(callback) {
      var url = this.Config.baseContext + "/mssq/tj/listItemCountByDeptTop10";
      let isSzs = (this.$store.getters.curUser.roleValue.indexOf('ZSJSH') != -1 || this.$store.getters.curUser
          .roleValue.indexOf('ZSJBB') != -1) && this.$store.getters.curUser.attrMap.REGION_CODE == '440301'
      if (isSzs) {
        url = this.Config.baseContext + "/mssq/tj/listItemCountByRegion"
      }
      this.$http_post(url, {}).then(ret => {
        if (ret.state == 1) {
          let arr = [];
          let value = [];
          let list = [];
          let num = 0;
          this.publishData = ret.rows;
          if (isSzs) {
            for (let i = 0; i < this.getDict['REGION'].length; i++) {
              let flag = -1;
              for (let j = 0; j < ret.rows.length; j++) {
                if (this.getDict['REGION'][i].itemCode == ret.rows[j].code) {
                  flag = j
                }
              }
              if (flag != -1) {
                num += ret.rows[flag].value;
                list.push({
                  name: this.getDict['REGION'][i].itemValue,
                  value: ret.rows[flag].value
                })
              } else {
                list.push({
                  name: this.getDict['REGION'][i].itemValue,
                  value: 0
                })
              }
            }
            this.maopao(list);
            for (let j = 0; j < list.length; j++) {
              arr.push(list[j].name)
              value.push(list[j].value)
            }
          } else {
            for (let i = 0; i < ret.rows.length; i++) {
              arr.push(ret.rows[i].name);
              value.push(ret.rows[i].value);
            }
          }
          callback({
            arr: arr,
            num: num,
            value: value
          })
        } else {
          this.$message.error(ret.message);
        }
      });
    },
    getPublish(res) {
      let isSzs = (this.$store.getters.curUser.roleValue.indexOf('ZSJSH') != -1 || this.$store.getters.curUser
          .roleValue.indexOf('ZSJBB') != -1) && this.$store.getters.curUser.attrMap.REGION_CODE != '440301'
      let _this = this;
      // let region = ['深圳市', '福田区', '罗湖区', '盐田区', '南山区', '宝安区', '龙岗区', '深汕特别合作区', '坪山区', '光明区', '龙华区', '大鹏新区'];
      this.$nextTick(() => {
        this.myChartPublish = this.$echarts.init(this.$refs.firstCityItem);
        let option = {
          title: {
            show: true, //显示策略，默认值true,可选为：true（显示） | false（隐藏）
            text: isSzs ? '部门已发布事项数 Top10' : '已发布事项数统计', //主标题文本，'\n'指定换行
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
            data: res.arr,
            axisLabel: {
              rotate: 45,
              interval: 0,
              formatter: function (params) {
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
            barWidth: 14, //柱状图粗细
            data: res.value,
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
      });
      this.$nextTick(() => {
        setTimeout(() => {
          this.myChartPublish.resize();
        }, 50)
      })
    },
    getOverallValue(callback) {
      var url = this.Config.baseContext + "/mssq/tj/isRoleItemList";
      if ((this.$store.getters.curUser.roleValue.indexOf('ZSJSH') != -1 && this.$store.getters.curUser.roleValue
          .indexOf('ZSJBB') != -1) && this.$store.getters.curUser.attrMap.REGION_CODE == '440301') {
        url = this.Config.baseContext + "/mssq/tj/asWholeCount";
      }
      this.$http_post(url, {
        // taskType: this.taskType
      }).then(ret => {
        if (ret.state == 1) {
          let arr = [];
          let name = [];
          let num = 0;
          this.secondList = ret.rows;
          for (let i = 0; i < ret.rows.length; i++) {
            name.push(ret.rows[i].name);
            arr.push(ret.rows[i].value);
          }
          callback({
            arr: arr,
            num: num,
            name: name
          })
        } else {
          this.$message.error(ret.message);
        }
      });
    },
    getOverall(res) {
      this.$nextTick(() => {
        let _this = this;
        let isZsj = (this.$store.getters.curUser.roleValue.indexOf('ZSJSH') != -1 || this.$store.getters.curUser.roleValue
            .indexOf('ZSJBB') != -1) && this.$store.getters.curUser.attrMap.REGION_CODE == '440301';
        this.myChartOverall = this.$echarts.init(this.$refs.secondCityItem);
        let option = {
          // 已授权科室事项Top10
          title: {
            show: true, //显示策略，默认值true,可选为：true（显示） | false（隐藏）
            text: _this.getSecondItemName, //主标题文本，'\n'指定换行
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
          series: [{
            data: res.arr,
            barWidth: 14, //柱状图粗细
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
        this.myChartOverall.setOption(option, true);
      })

      this.$nextTick(() => {
        setTimeout(() => {
          this.myChartOverall.resize();
        }, 50)
      })
    },
    getTaskTypeValue(callback, data) {
      let isZsj = this.$store.getters.curUser.roleValue.indexOf('ZSJSH') != -1 || this.$store.getters.curUser.roleValue.indexOf('ZSJBB') != -1
      let name = [];
      let num = [];
      var url = this.Config.baseContext + "/mssq/tj/taskTypeCount";
      this.$http_post(url, {
        regionCode: isZsj ? this.$store.getters.curUser.attrMap.REGION_CODE != 440301 ? this.$store.getters.curUser.attrMap.REGION_CODE : data : '',
        selfDeptId: !isZsj ? this.$store.getters.curUser.attrMap.SELF_DEPT_ID : ''
      }).then(ret => {
        if (ret.state == 1) {
          this.maopao(ret.rows);
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
    getTaskType(res) {
      let _this = this;
      let region = ['深圳市', '福田区', '罗湖区', '盐田区', '南山区', '宝安区', '龙岗区', '深汕特别合作区', '坪山区', '光明区', '龙华区', '大鹏新区'];
      this.$nextTick(() => {
        this.myChartTask = this.$echarts.init(this.$refs.thirdCityItem);
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
            data: res.name,
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
          series: [{
            data: res.arr,
            type: 'bar',
            barWidth: 14, //柱状图粗细
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
            top: '7%',
            right: '6%',
            bottom: '0%',
            containLabel: true //防止坐标轴标签溢出
          }
        };
        this.myChartTask.setOption(option, true);
        this.$nextTick(() => {
          setTimeout(() => {
            this.myChartTask.resize();
          }, 50)
        })
      })

    },
    changeTaskType(type) {
      let _this = this;
      if (type == 'clear') {
        this.getTaskTypeValue(res => {
          this.$nextTick(() => {
            if (_this.$refs.thirdCityItem) {
              this.$echarts.init(_this.$refs.thirdCityItem).setOption(_this.myChartTask
                  .getOption());
              let myChartTask = this.$echarts.init(_this.$refs.thirdCityItem);
              let busiType = myChartTask.getOption();
              busiType.series[0].data = res.arr;
              busiType.yAxis[0].data = res.name;
              myChartTask.setOption(busiType);
            }
          })
        }, '')
      } else {
        this.getTaskTypeValue(res => {
          this.$nextTick(() => {
            if (_this.$refs.thirdCityItem) {
              this.$echarts.init(_this.$refs.thirdCityItem).setOption(_this.myChartTask
                  .getOption());
              let myChartTask = this.$echarts.init(_this.$refs.thirdCityItem);
              let busiType = myChartTask.getOption();
              busiType.series[0].data = res.arr;
              busiType.yAxis[0].data = res.name;
              myChartTask.setOption(busiType);
            }
          })
        }, this.taskType)
      }
    },
    willGoto(path, params) {
      if (path == '/') {
        this.$message.warning('此功能暂未开放');
        return
      }
      this.$router.push({
        path: path,
        query: params,
      });
    },
    reloadRegion(type) {
      let _this = this;
      let obj = {
        busiType: {
          methods: 'getBusiTypeValue',
          data: 'myChartBusitype',
          index: 'busiTypeIndex'
        },
        itemPriority: {
          methods: 'getPriorityValue',
          data: 'myChartPriority',
          index: 'itemPriorityIndex'
        }
      };
      this[obj[type].methods](res => {
        let itemPriority = _this[obj[type].data].getOption();
        itemPriority.series[0].data = res.arr;
        _this[obj[type].data].setOption(itemPriority);
      }, '');
      _this[obj[type].index] = 0
    },
    getMaxNum() {
      return function (arr) {
        /* let max = 0;
					 for (let i = 0; i <arr.length ; i++) {
					   if(arr[i] > max){
					     max = arr[i] + (arr[i] / 2)
					   }
					 }*/
        let max = arr.max + (arr.max / 2)
        return max
      }
    },
    changeFirstCatalog(val) {
      clearInterval(this.timeOut);
      let arr = [];
      let obj = {};
      let name = [];
      for (let i = 0; i < this.firstCatalogList.length; i++) {
        if (this.firstCatalogList[i].code == val) {
          obj = this.firstCatalogList[i]
        }
      }
      if (!this.isEmptyObject(obj)) {
        this.maopao(obj.children).reverse();
      } else {
        this.maopao(this.firstCatalogCopy).reverse();
      }
      if (obj.children) {
        this.secondCatalogList = obj.children;
        arr = obj.children;
        for (let i = 0; i < obj.children.length; i++) {
          name.push(obj.children[i].name)
        }
      } else {
        this.firstCatalogList = JSON.parse(JSON.stringify(this.firstCatalogCopy))
        arr = JSON.parse(JSON.stringify(this.firstCatalogCopy))
        for (let i = 0; i < arr.length; i++) {
          name.push(arr[i].name)
        }
      }
      let myChart = this.myChart.getOption();
      myChart.series[0].data = arr;
      myChart.xAxis[0].data = name;
      myChart.grid[0].bottom = arr.length <= len ? '0%' : '12%';
      myChart.dataZoom[0] = {
        xAxisIndex: 0, //这里是从X轴的0刻度开始
        show: name.length > len, //是否显示滑动条，不影响使用
        type: "slider", // 这个 dataZoom 组件是 slider 型 dataZoom 组件
        startValue: 0, // 从头开始。
        endValue: len, // 一次性展示18个。
      };
      this.myChart.setOption(myChart);
      this.catalogOption = myChart;
      this.autoMove();
    },
    changeSecondCatalog(val) {
      let obj = {};
      for (let i = 0; i < this.secondCatalogList.length; i++) {
        if (this.secondCatalogList[i].code == val) {
          obj = this.secondCatalogList[i]
        }
      }
      let arr = [];
      let name = [];
      if (obj.children) {
        // this.thirdCatalogList = obj.children;
        arr = obj.children;
        for (let i = 0; i < obj.children.length; i++) {
          name.push(obj.children[i].name)
        }
      } else {
        arr = this.secondCatalogList;
        for (let i = 0; i < this.secondCatalogList.length; i++) {
          name.push(this.secondCatalogList[i].name)
        }
      }
      let myChart = this.myChart.getOption();
      myChart.series[0].data = arr;
      myChart.xAxis[0].data = name;
      myChart.dataZoom[0] = {
        xAxisIndex: 0, //这里是从X轴的0刻度开始
        show: false, //是否显示滑动条，不影响使用
        type: "slider", // 这个 dataZoom 组件是 slider 型 dataZoom 组件
        startValue: 0, // 从头开始。
        endValue: 5, // 一次性展示6个。
      };
      this.myChart.setOption(myChart);
      this.catalogOption = myChart;
      this.autoMove();
    },
    changeData(val) {
      let myChart = this.myChart.getOption();
      myChart.series[0].label.show = val;
      this.myChart.setOption(myChart);
    },
    reLoad() {
      this.firstCatalog = '';
      this.secondCatalog = '';
      this.changeFirstCatalog('');
    },
  }
}
</script>

<style scoped lang="less">
.home {
  overflow: auto;
  background: #f8f8f8;
  height: 100%;

  .trend {
    padding: 20px;
    background: #fff;
    margin: 10px 0 10px 0;

    .header {
      background: #fff;
      display: flex;
      justify-content: space-between;
    }

    .overview {
      display: flex;
      align-items: center;

      .el-col {
        display: flex;
        justify-content: space-between;

        .change {
          height: 100px;
          justify-content: space-around;
          display: flex;
          margin: 14px 0;
          width: 100%;

          .flex-body {
            box-shadow: 0 2px 12px 0 #ccc;
          }

          & > div {
            width: 96.5%;
            border-radius: 8px;
            padding: 0 20px;
            color: #fff;

            .icon {
              width: 60px;
              height: 60px;
              border-radius: 50%;
              background: #fff;
              margin-right: 14px;
              justify-content: center;

              i {
                font-size: 40px;
              }

              .icon-xincanbaoshu {
                font-size: 42px;
              }
            }

            .num {
              display: flex;
              width: 75%;
              justify-content: space-around;

              .title {
                display: flex;
                align-items: center;
                font-size: 20px;
                /*justify-content: space-around;*/
                width: 100%;

                .itemNum {
                  border-bottom: 1px solid #fff;
                }
              }

              .num-style {
                .style-title {
                  font-size: 20px;
                }
              }
            }

            p {
              text-align: center;
              padding-left: 10px;
              font-size: 22px;
              /* display: flex; */
              /* align-items: center; */
              align-items: center;
              font-weight: 500;
            }
          }

          .detail1 {
            background: #f4b94a;

            i {
              color: #f4b94a;
            }
          }

          .detail2 {
            background: #69a4f6;

            i {
              color: #69a4f6;
            }
          }

          .detail3 {
            background: #ff787d;

            i {
              color: #ff787d;
            }
          }

          .detail4 {
            background: #49bff5;

            i {
              color: #49bff5;
            }
          }
        }
      }

      .icon {
        width: 56px;
        border-radius: 65px;
        height: 56px;
        background: var(--primary, #409eff);
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 20px;
        color: #fff;
      }

      .dept {
        padding-left: 20px;
        flex-direction: column;
        display: flex;
        height: 100%;
        justify-content: space-around;

        .title {
          margin-bottom: 0;
          font-size: 20px;
        }

        .region {
          color: #666;
        }
      }
    }

    .right-click {
      display: flex;
      align-items: center;

      .btn {
        margin-left: 20px;
        display: flex;
        align-items: center;
        padding: 12px 14px;
        cursor: pointer;
        border-radius: 4px;

        i {
          font-size: 20px;
          margin-right: 6px;
        }
      }

      & > div {
        line-height: 14px;

        p {
          font-size: 15px;
          font-weight: 500;
        }

        span {
          font-size: 12px;
          opacity: 0.8;
        }
      }

      .btn.success {
        background: #eff8f1;
        color: #57bd7c;
        border: 1px solid #bce5cb;

        &:hover {
          background: #57bd7c;
          color: #fff;
          border-color: #57bd7c;
        }
      }

      .btn.info {
        color: #12f2be;
        background: #effffb;;
        border: 1px solid #6af6d6;
        &:hover {
          background: #12f2be;
          border-color: #12f2be;
          color: #fff;
        }
      }

      .btn.warning {
        background: #fef5eb;
        color: #f19c39;
        border: 1px solid #ffdcb0;

        &:hover {
          background: #f19c39;
          color: #fff;
          border-color: #f19c39;
        }
      }

      .btn.primary {
        background: #eff7ff;
        color: #409eff;
        border: 1px solid #b3d8ff;

        &:hover {
          background: #409eff;
          color: #fff;
          border-color: #409eff;
        }
      }

      .btn.danger {
        background: #fee;
        color: #ff5454;
        border: 1px solid #ffcdcd;

        &:hover {
          background: #ff5454;
          color: #fff;
          border-color: #ff5454;
        }
      }

      // .describe {
      //   font-size: 12px;
      // }

      // span {
      //   padding-right: 10px;
      // }

      // /deep/ .el-button {
      //   padding: 10px 20px;
      // }
    }
  }

  .title {
    display: flex;
    align-items: center;
    margin-bottom: 14px;

    .font {
      width: 16px;
      height: 16px;
      border-radius: 2px;
      background: #59abff;
      position: relative;
      top: 1px;
    }

    .list-cell {
      font-weight: 900;
      padding: 0 10px;
      font-size: 16px;
      line-height: 16px;
    }

    :deep(.el-button--text) {
      padding: 0;
    }

    .show-detail {
      line-height: 16px;
      font-size: 16px;
      position: relative;
      top: 1px;
      margin-left: 10px;

      i {
        font-weight: bold;
      }
    }
  }

  .first-content {
    display: flex;
    padding-top: 10px;
    justify-content: space-between;


    .left {
      height: 550px;
      width: 49.5%;
      display: flex;
      flex-direction: column;
      justify-content: space-between;

      .left-top,
      .left-footer {
        .wait-div {
          display: flex;
          justify-content: space-between;

          .wait-list {
            font-size: 12px;
            background: #fff;
            border-bottom: 6px solid #3d91f7;
            padding: 10px;
            width: 49%;

            .num-button {
              display: flex;
              align-items: center;
              justify-content: space-between;

              .num-cell {
                .num {
                  font-size: 30px;
                }
              }
            }
          }

          .wait-order-list {
            font-size: 12px;
            background: #fff;
            border-bottom: 6px solid #3d91f7;
            padding: 10px;
            width: 49%;

            .num-button {
              display: flex;
              align-items: center;
              justify-content: space-between;

              .num-cell {
                .num {
                  font-size: 30px;
                }
              }
            }
          }
        }

        .catalog {
          padding: 10px;
          background: #fff;
          border-radius: 2px;
          height: calc(100% - 33px);

          .catalogDiv {
            display: flex;
            align-items: center;
            justify-content: space-between;
            flex-wrap: wrap;

            .margin-l-r {
              margin: 0 10px;
            }

            & > div {
              display: flex;
              align-items: center;
              flex-wrap: nowrap;

              span {
                font-size: 12px;
              }

              .el-select {
                max-width: 130px;
              }
            }
          }

          .catalogStatic {
            height: 280px;
            width: 100%;

            &.left-bb-catalog {
              height: calc(100% - 50px);
            }

            &.left-ks-catalog {
              height: calc(100% - 80px);

            }
          }

        }
      }

      .left-footer {
        &.left-foot {
          height: calc(100% - 30px);
        }

        &.left-bb-foot {
          height: 100%;
        }

        height: calc(100% - 146px);
      }

    }

    .right {
      height: 550px;
      width: 49%;

      .right-con {
        width: 100%;
        height: calc(100% - 33px);
        background: #fff;
        padding: 20px;

        .top,
        .bottom {
          display: flex;
          width: 100%;

          .itemLevel,
          .xcjdNum,
          .manageType,
          .zzqdNum {
            width: 100%;
            height: 100%;
          }

          .itemLevel {
            border-right: 1px solid #e7e7e7;
            border-bottom: 1px solid #e7e7e7;
          }

          .manageType {
            border-bottom: 1px solid #e7e7e7;
          }

          .xcjdNum,
          .zzqdNum {
            border-right: 1px solid #e7e7e7;
            display: flex;
            flex-direction: column;
            align-items: center;

            p {
              font-weight: 900;
              font-size: 14px;
              color: #333;
              margin: 20px 0 10px 0;
            }

            .el-select {
              width: 62%;
              margin-bottom: 10px;
            }

            & > div.con {
              width: 100%;
              height: calc(100% - 86px);
            }
          }

          .zzqdNum {
            border: none
          }

        }

        .top {
          height: 38%;
        }

        .bottom {
          height: 62%;
        }
      }

      .region {
        width: 100%;
        height: calc(100% - 33px);
        background: #fff;
        padding: 20px;

        .top {
          /*display: flex;*/
          width: 100%;

          .itemLevel,
          .xcjdNum,
          .manageType,
          .zzqdNum {
            width: 100%;
            height: 50%;
          }

          .itemLevel {
            /*border-right: 1px solid #e7e7e7;*/
            border-bottom: 1px solid #e7e7e7;
          }

          .manageType {
            padding-top: 20px;
            /*border-bottom: 1px solid #e7e7e7;*/
          }

          .xcjdNum,
          .zzqdNum {
            border-right: 1px solid #e7e7e7;
            display: flex;
            flex-direction: column;
            align-items: center;

            p {
              font-weight: 900;
              font-size: 16px;
              color: #333;
              margin: 20px 0 10px 0;
            }

            .el-select {
              width: 62%;
              margin-bottom: 10px;
            }

            & > div.con {
              width: 100%;
              height: calc(100% - 86px);
            }
          }

          .zzqdNum {
            border: none
          }

        }

        .top {
          height: 100%;
        }
      }
    }
  }

  .ssqdTj {
    display: flex;
    justify-content: space-between;

    .left,
    .right {
      padding: 10px;
      .first{
        width:100%
      }

      &:first-child {
        /*margin-right: 10px;*/
      }

      background: #fff;
      width: 49.5%;
      display: flex;
      justify-content: space-between;

      .itemPriority {
        width: 60%;
        height: 300px;
      }

      .chooseRegion {
        width: 35%;
        display: flex;
        flex-direction: column;
        /*align-items: center;*/
        justify-content: center;

        .title {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 16px;
          padding: 10px 0;

          .describe {
            color: #747474;
          }
        }

        .region {
          display: flex;
          flex-wrap: wrap;

          /*flex-direction: column;*/

          .region-value {
            cursor: pointer;
            border: 1px solid #e2e2e2;
            overflow: hidden; //超出的文本隐藏
            text-overflow: ellipsis; //溢出用省略号显示
            white-space: nowrap; //溢出不换行
            background: #fff;
            border-radius: 5px;
            width: 29%;
            text-align: center;
            padding: 5px;
            margin: 4px;
            margin-bottom: 10px;

            &:hover {
              background: #eff7ff;
              color: #409eff;
              border-color: #b3d8ff;
            }
          }

          .active {
            background: #3d91f7;
            border-color: #3d91f7;
            color: #fff;

            &:hover {
              background: #3d91f7;
              border-color: #3d91f7;
              color: #fff;
            }
          }
        }

        .info {
          display: flex;
          flex-wrap: wrap;
          flex-direction: column;

          .region-value {
            cursor: pointer;
            border: 1px solid #e2e2e2;
            overflow: hidden; //超出的文本隐藏
            text-overflow: ellipsis; //溢出用省略号显示
            white-space: nowrap; //溢出不换行
            background: #fff;
            border-radius: 5px;
            width: 29%;
            text-align: center;
            padding: 5px;
            margin: 4px;
            margin-bottom: 10px;

            &:hover {
              background: #eff7ff;
              color: #409eff;
              border-color: #b3d8ff;
            }
          }

          .active {
            background: #3d91f7;
            border-color: #3d91f7;
            color: #fff;

            &:hover {
              background: #3d91f7;
              border-color: #3d91f7;
              color: #fff;
            }
          }

          .itemLevelInfo {
            display: flex;
            padding: 10px 0;
            align-items: center;

            .infoColor {
              height: 30px;
              width: 30px;
            }

            .content {
              padding: 0 10px;
            }
          }
        }
      }
    }
    .left{
      justify-content: left;
    }
    .right {
      width: 49%;
    }
  }

  .cityItem {
    padding-top: 20px;
    display: flex;
    justify-content: space-between;

    .first,
    .second,
    .third {
      width: 49%;
      height: 330px;
      background: #fff;
      border-bottom: 6px solid #3d91f7;
      padding: 10px;

      .no-data-div {
        font-size: 14px;
        color: #333;
        font-weight: 900
      }

      .taskTypeSty {
        width: 100%;
        height: calc(100% - 28px);

        .con {
          height: 100%;
        }
      }
    }
  }
}

:deep(.nodata) {
  p {
    font-size: 14px;
    color: #999;
    margin: 20px 0 10px 0;
  }

  .imgClass {
    height: 108px;
  }
}

.chooseRegion-detail {
  width: 40%;
  height: 300px;
  display: flex;
  flex-direction: column;

  .title {
    margin: 34px 0 10px 0;
    display: flex;
    align-items: center;

    em {
      height: 14px;
      width: 1px;
      display: block;
      background: #dcdfe6;
      margin: 0 8px;
    }

    span {
      font-size: 14px;
      color: #333;
    }
  }

  .info {
    height: calc(100% - 100px);

    .info-title {
      width: 100%;
      overflow: hidden; //超出的文本隐藏
      text-overflow: ellipsis; //溢出用省略号显示
      white-space: nowrap; //溢出不换行
      margin: 20px 0 30px 0;
      font-size: 14px;

      span {
        color: #666;
      }
    }

    .info-title-dept {
      margin-top: 70px;
    }

    .item-con {
      height: calc(100% - 45px);
      overflow-y: auto;
    }

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
</style>
