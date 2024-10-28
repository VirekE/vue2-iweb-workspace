<template>
  <div class="cardView" ref="tableH">
    <div class="search-box">
      <Search :labelWidth="'120px'" :fieldData="fieldData" ref="srarch" @searchClick="searchClick">
        <template slot="footer">
          <div class="addCatalog">
            <el-upload class="upload" ref="material"
                       :action="uploadUrl"
                       :on-remove="modelRemove"
                       :before-upload="beforeUpload"
                       :before-remove="modelBeforeRemove"
                       :on-success="modelSuccess"
                       @change="openAddExport"
                       :on-preview="onPreview"
                       :on-progress="onProgress"
                       :data="{}"
                       :headers="uploadHeaders"
                       :on-error="modelError"
                       :file-list="[]">
              <!--    仅添加为当前版本数据              -->
              <el-button size="small" type="success"
                         icon="el-icon-plus">导入抄送职责清单
              </el-button>
            </el-upload>
            <el-button size="small" @click="exportList">下载模板</el-button>
            <el-button size="small" @click="sendCopyExport">导出抄送目录</el-button>
          </div>
        </template>
      </Search>
    </div>
    <div v-if="$store.getters.curUser.roleValue.indexOf('ZSJSH') != -1">
      <div class="choose_search flex flex-sb">
        <div class="content">
          <div class="title">区划：</div>
          <div class="cell-content" :class="brandFold?'sit-auto':'sit-hidden'">
            <template v-for="(item,index) in deptTree">
              <el-popover popper-class="popover-catalog" v-if="item.id != 'isAll'" class="popover" placement="bottom"
                          :visible-arrow="false" width="200" trigger="click">
                <div slot="reference" class="cell" :class="index == regionIndex?'active':''"
                     @click="showPopover(item.id,index)">
                  <el-tooltip class="item" effect="dark" :content="item.name" placement="top">
                    <span class="name">{{item.name}}</span>
                  </el-tooltip>
                  <div class="searchNums">{{item.value}}</div>
                  <span class="downIcon"><i class="el-icon-caret-bottom"></i></span>
                </div>
                <div class="inputSearch">
                  <el-input @input="searchDeptInfo" v-model="seachCatalog.second"
                            placeholder="请输入部门名称" size="mini">
                    <i slot="prefix" class="el-input__icon el-icon-search"></i>
                  </el-input>
                </div>
                <div class="popover">
                  <div class="deptInfo-all">
                    <template v-for="(org,index) in deptList">
                      <div class="deptInfo" @click="searchDept(org,index)"
                           :class="secondIndex == org.id?'active':''">
                        <el-tooltip class="item" effect="dark" :content="org.name" placement="top">
                          <div class="name">{{org.name}}</div>
                        </el-tooltip>
                        <div class="value">{{org.value}}</div>
                      </div>
                    </template>
                  </div>
                </div>

              </el-popover>
              <div v-if="item.id=='isAll'" class="isAll-cell" :class="index == regionIndex?'active':''"
                   @click="showPopover(item.id,index)">
                <el-tooltip class="item" effect="dark" :content="item.name" placement="top">
                  <span class="name">{{item.name}}</span>
                </el-tooltip>
                <div class="searchNums">{{item.value}}</div>
                <!--								<span class="downIcon"><i class="el-icon-caret-bottom"></i></span>-->
              </div>
            </template>
          </div>
        </div>
        <div v-if="deptTree.length > 6" class="shrink">
          <span @click="changeFoldState">{{brandFold?'收起':'展开'}}</span>
          <el-link type="primary" @click="changeFoldState"><i
              :class="!brandFold? 'el-icon-arrow-down':'el-icon-arrow-up'"></i></el-link>
        </div>
      </div>
    </div>
    <div class="view">
      <el-card class="box-card box-right" shadow="never">
        <div class="text item">
          <el-table :data="tableData" style="width: 100%" height="100%" class="qz-table-hide">
            <el-table-column type="index" label="序号" width="50"></el-table-column>
            <el-table-column prop="primaryIndexName" label="一级索引名称" width="120" show-overflow-tooltip></el-table-column>
            <el-table-column prop="parentName" label="二级索引名称" width="120" show-overflow-tooltip></el-table-column>
            <el-table-column prop="itemCode" label="事项编码" show-overflow-tooltip></el-table-column>
            <!--事项编码取用目录编码字段-->
            <el-table-column prop="itemName" label="事项名称" show-overflow-tooltip>
              <template slot-scope="scope">
                <div class="jump-title" @click="onEditItem(scope.row.itemVid,'view')">
                  {{scope.row.itemName}}
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="selfDeptName" label="职责部门名称" show-overflow-tooltip></el-table-column>
            <el-table-column prop="level" label="事项层级" :formatter="formatterPriority" show-overflow-tooltip
                             width="100px" align="center"></el-table-column>
            <el-table-column prop="manageType" label="管理类型" :formatter="formatterManage"
                             show-overflow-tooltip width="80px" align="center">
              <template slot-scope="scope">
                <el-tag type="success" v-if="scope.row.manageType">{{formatterManage(scope.row)}}
                </el-tag>
                <span v-else></span>
              </template>
            </el-table-column>
            <el-table-column prop="status" label="是否已配置抄送" align="center" width="120" show-overflow-tooltip>
              <template slot-scope="scope">
                <el-tag type="success" v-if="scope.row.isSend == '1'">是</el-tag>
                <el-tag type="danger" v-else-if="scope.row.isSend == '0'">否</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="right" width="150" show-overflow-tooltip>
              <template slot-scope="scope">
                <el-button type="text" @click="viewSendCopy(scope.row)">查看抄送</el-button>
                <el-button type="text" @click="sendDept(scope.row)">抄送部门</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div class="block">
            <el-pagination @current-change="handleCurrentChange" :current-page.sync="itemParams.page"
                           :page-size="itemParams.limit" layout="total,prev, pager, next, jumper"
                           :total="itemParams.total">
            </el-pagination>
          </div>
        </div>
      </el-card>
    </div>
    <el-dialog
        title="选择抄送部门"
        :visible.sync="chooseDeptDialog"
        width="90%"
        :before-close="beforeClose"
        :close-on-click-modal="false"
        class="qz-dialog-padding" append-to-body>
      <div class="dialog-content" v-if="chooseDeptDialog">
        <div class="left">
          <choose-dept :checkedKeys="checkedKeys" :isSzsType="true"  @cacel="cacelDept"
                       :isCheckBox="isCheckBox" :regionDisabled="regionDisabled" ref="chooseDept" :chooseData="chooseData"
                       :type="false" ></choose-dept>
        </div>
        <div class="center">
          <el-button @click="leftForRight">移动到右边</el-button>
        </div>
        <div class="right">
          <div class="choose">
            <div v-if="chooseData.length > 0" class="choose_content">
              <div class="choose-header">
                当前选中部门
                <div>
                  <el-checkbox v-model="isChacel">批量取消抄送部门</el-checkbox>
                  <el-checkbox v-if="isChacel" v-model="isAll" @change="allChoose">全选</el-checkbox>
                  <el-button v-if="isChacel" size="mini" type="text" @click="deleteAllDept">确定</el-button>
                </div>
              </div>
              <div class="deptName" v-if="!isChacel">
                <template  v-for="(item,index) in chooseData">
                  <div  class="cell">
                    {{item.name}}
                    <i class="el-icon-error" @click="deleteDept(item,index)"></i>
                  </div>
                </template>
              </div>
              <el-checkbox-group v-else v-model="checkedSendCopy">
                <el-checkbox v-for="(item,index) in chooseData" :label="item.id" :key="index">{{item.name}}</el-checkbox>
              </el-checkbox-group>
            </div>
            <no-data v-else :hText="'暂无抄送部门'"></no-data>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="saveSendCopy">确定</el-button>
        <el-button @click="chooseDeptDialog = false">取消</el-button>
      </span>
    </el-dialog>
    <el-dialog
        title="抄送"
        :visible.sync="sendCopyDialog"
        width="60%"
        :close-on-click-modal="false"
        class="qz-dialog-padding" append-to-body>
      <div class="">
        <copySend v-if="sendCopyDialog" :itemInfo="itemInfo"></copySend>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import qzBase from '@_src/pages/mssq/common/util/qzBase';
import OrganTree from '@_src/pages/mssq/common/components/organ'
// import OrganTreeShow from "../common/components/organ/organ-tree";
import NoData from "../common/components/NoData";
import chooseDept from "../components/chooseDept";
import copySend from "./copySend";
import uploadUtil from '@_src/utils/upload';

export default {
  name: "index",
  components: {copySend,NoData,/*OrganTreeShow*/chooseDept},
  mixins: [qzBase],
  data() {
    return {
      itemInfo: {},
      regionIndex: 0,
      brandFold: false,
      uploadUrl: '',
      fileList:[],
      uploadHeaders: {},
      regionDisabled:false,
      isChacel:false,
      isAll:false,
      checkedSendCopy:[],
      defaultProps: {
        children: 'children',
        value: 'value',
        label: 'name'
      },
      seachCatalog: {
        first: '',
        second: '',
        third: ''
      },
      fieldData: {
        primaryIndexName: {
          label: '一级索引名称',
          type: 'Input',
          placeholder: '请输入一级索引名称',
          value: '',
          span: 8
        },
        parentName: {
          label: '二级索引名称',
          type: 'Input',
          placeholder: '请输入二级索引名称',
          value: '',
          span: 8
        },
        itemCode: {
          label: '事项编码',
          type: 'Input', //类型
          placeholder: '请输入事项编码',
          value: '',
          span: 8, //布局比例
        },
        itemName: {
          label: '事项名称',
          type: 'Input', //类型
          placeholder: '请输入事项名称',
          value: '',
          span: 8, //布局比例
        },
        level: {
          label: '事项层级',
          type: 'Select', //类型
          placeholder: '请选择事项层级',
          value: '',
          span: 8, //布局比例
          selectList: []
        },
        manageType: {
          label: '管理类型',
          type: 'Select', //类型
          placeholder: '请选择管理类型',
          value: '',
          span: 8, //布局比例
          selectList: []
        },
        status: {
          label: '事项状态',
          type: 'Select', //类型
          placeholder: '请选择事项状态',
          value: '',
          span: 8, //布局比例
          selectList: []
        },
        regionCode: {
          label: '区划',
          type: 'Select', //类型
          placeholder: '请选择事项层级',
          value: '',
          span: 0, //布局比例
          selectList: []
        },
        deptId: {
          label: '部门',
          type: 'Select', //类型
          placeholder: '请选择事项层级',
          value: '',
          span: 0, //布局比例
          selectList: []
        },
        isSend: {
          label: '是否已配置抄送',
          type: 'Select', //类型
          placeholder: '请选择是否已配置抄送',
          value: '',
          span: 8, //布局比例
          selectList: [{
            name:'全部',
            id:''
          },{
            id:'0',
            name:'否'
          },{
            id:'1',
            name:'是'
          }]
        },
        Button: {
          type: 'Button',
          span: 16
        }
      },
      deptIndex: -1,
      deptList: [],
      defulatValue: [],
      activeName: 'isAll',
      dictMap: {},
      tableData: [],
      tabPosition: 'top',
      itemParams: {
        page: 1,
        limit: 10,
        total: 0
      },
      item_menu: {
        height: ''
      },
      formInline: {
        isSzs: 1,
        itemName: '',
        regionCode: '',
        parentName: '',
        primaryIndexName: '',
        itemCode: '',
        status: '',
        manageType: '',
        selfDeptName: '',
      },
      tableHeight: 100,
      bgC: '',
      textC: '',
      itemLimit: 1000,
      clickType: '',
      exportData: [],
      loading: false,
      exportIndex: [],
      regionList: [],
      catalogList: [],
      primaryIndex: [],
      parent: [],
      parentList: [],
      catalog: [],
      firstIndex: -1,
      secondIndex: -1,
      thirdIndex: -1,
      catalogThirdList: [],
      sendCopyDialog:false,
      chooseDeptDialog:false,
      isCheckBox:true,
      checkedKeys:[],
      chooseData:[],
    }
  },
  watch: {
    deptTree: {
      handler(val) {
        this.fieldData.regionCode.selectList = val;
      }
    },
    deptList: {
      handler(val) {
        this.fieldData.deptId.selectList = val;
      }
    },
    itemLevel(val) {
      let arr = [];
      for (let i = 0; i < val.length; i++) {
        arr.push({
          name: val[i].itemValue,
          id: val[i].itemCode,
        })
      }
      this.fieldData.level.selectList = arr;
    },
    manageType(val) {
      let arr = [];
      for (let i = 0; i < val.length; i++) {
        arr.push({
          name: val[i].itemValue,
          id: val[i].itemCode,
        })
      }
      this.fieldData.manageType.selectList = arr;
    },
    itemStatus(val) {
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
  mounted() {
    let _this = this;
    if (this.$store.getters.curUser.attrMap.REGION_CODE == '440301') {
      this.formInline.isSzs = 1
    } else {
      this.formInline.isSzs = 0
    }
    this.uploadUrl = this.Config.base_url + this.Config.baseContext + '/mssq/mssqItemSendCopy/sendCopyImport';
    let headers = uploadUtil.setHeaders();
    headers['x-aep-token'] = this.$store.getters.token;
    this.uploadHeaders = headers;
    if(this.$route.path != this.$store.getters.searchParams.path) this.$store.dispatch("setSearchParams", {});
    if (!this.isEmptyObject(this.$store.getters.searchParams.data)) {

      this.$nextTick(() => {
        this.deptList = this.$store.getters.deptList;
        this.activeName = this.$store.getters.searchParams.data.regionCode;
        this.$refs.srarch.update('level', this.$store.getters.searchParams.data.level, false);
        this.$refs.srarch.update('primaryIndexName', this.$store.getters.searchParams.data.primaryIndexName, false);
        this.$refs.srarch.update('parentName', this.$store.getters.searchParams.data.parentName, false);
        this.$refs.srarch.update('itemName', this.$store.getters.searchParams.data.itemName, false);
        this.$refs.srarch.update('regionCode', this.$store.getters.searchParams.data.regionCode, false);
        // this.showPopover('',0)
        this.$refs.srarch.update('deptId', this.$store.getters.searchParams.data.deptId, false);
        this.formInline = this.$store.getters.searchParams.data;
        this.itemParams = this.$store.getters.searchParams.data;
        this.onQuery(this.formInline , this.itemParams);
        this.$store.dispatch("setSearchParams", {});
      })
    }else{
      var pageParam = this.itemParams
      var searchParam = this.formInline
      this.onQuery(pageParam, searchParam);
    }
    //表格高度自适应

    if (this.$store.getters.curUser.roleValue.indexOf('ZSJSH') != -1 && this.$store.getters.curUser.attrMap.REGION_CODE == '440301') {
      this.fieldData.regionCode.value = this.activeName;
    } else if (this.$store.getters.curUser.roleValue.indexOf('ZSJSH') != -1 && this.$store.getters.curUser.attrMap.REGION_CODE != '440301') {
      this.fieldData.regionCode.value = this.$store.getters.curUser.attrMap.REGION_CODE;
      this.regionIndex = 0;
    }
    this.$nextTick(() => {
      _this.tableHeight = _this.$refs.tableH.offsetHeight - 280;
    });
    window.onresize = () => {
      return (() => {
        _this.tableHeight = _this.$refs.tableH.offsetHeight - 280;
      })();
    };
    //加载字典
    this.queryDictMap("BUSI_TYPE,BUSI_GROUP,ITEM_STATUS,MANAGE_TYPE,SSCJ,REGION", (res) => {
      this.dictMap = res
    });
    if (this.$store.getters.curUser.roleValue.indexOf('ZSJSH') != -1) {
      this.formInline.region = this.$store.getters.curUser.attrMap.REGION_CODE;
    }
    //加载列表
    this.getCatalog();
  },
  methods: {
    viewSendCopy(row){
      this.itemInfo = row
      this.sendCopyDialog = true;
    },
    getRegion() {
      let param = JSON.parse(JSON.stringify(this.formInline));
      param.regionCode = '';
      param.deptId = '';
      var url = this.Config.baseContext + "/mssq/mssqItemIndex/getDutyItemListCount";
      // var param = Object.assign({}, pageParam, searchParam);
      this.$http_post(url, param).then(ret => {
        this.regionList = ret.rows;
      });
    },
    getCatalog() {
      var url = this.Config.baseContext + "/mssq/tj/listCatalog";
      // var param = Object.assign({}, pageParam, searchParam);
      this.$http_post(url, this.formInline).then(ret => {
        this.catalogList = ret.rows;
        this.primaryIndex = JSON.parse(JSON.stringify(ret.rows));
        this.merge(ret.rows, (callback) => {
          this.parent = callback;
          this.parentList = JSON.parse(JSON.stringify(callback))
        });
        this.merge(this.parentList, (callback) => {
          this.catalog = callback;
          this.catalogThirdList = JSON.parse(JSON.stringify(callback))
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
    onQuery(pageParam, searchParam) {
      var url = this.Config.baseContext + "/mssq/mssqItemSendCopy/getItemList";
      var param = Object.assign({}, pageParam, searchParam);
      this.$http_post(url, param).then(ret => {
        if (ret.state == 1) {
          this.tableData = ret.rows;
          this.itemParams.total = ret.records;
          // this.handleClick({name:''},)
          if (this.clickType == 'region') {
            this.clickType = '';
            return
          };
          this.getRegion();
          // this.getCatalog();
        } else {
          this.$message.error(ret.message);
        }
      });
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
        isRadio: true,
        onOkClick: function (res) {
          if (res.id) {
            _this.formInline.selfDeptName = res.name;
            _this.formInline.deptId = res.id;
          } else {
            _this.formInline.deptNo = res.code;
            _this.formInline.selfDeptName = res.name;
          }
        }
      });
    },
    onEditItem(id, type) {
      this.$store.dispatch("setSearchParams",{path:this.$route.path,data: Object.assign(this.formInline,{page:this.itemParams.page,limit:this.itemParams.limit})});
      //转跳事项梳理页面
      this.$router.push({
        path: '/qzqd/info',
        query: {
          itemVid: id,
          type: 'view',
          qzqdName: 'qzqdName'
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
          "id": itemVid
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
    handleCurrentChange(val) {
      this.itemParams.page = val;
      var pageParam = this.itemParams;
      var searchParam = this.formInline;
      this.onQuery(pageParam, searchParam)
    },
    exportList() {
      let rLoading = this.openLoading('下载导入抄送职责清单模板中，请稍等');
      let url = '/qz-mssq/static/template/导入抄送职责清单模板.xlsx';
      let link = document.createElement("a");
      link.style.display = "none";
      link.href = url;
      link.download = "导入抄送职责清单模板.xlsx" || ""; // HTML5新增的属性
      document.body.appendChild(link);
      link.click(); // 点击下载
      document.body.removeChild(link); // 下载完成移除元素
      window.URL.revokeObjectURL(url); //释放掉blob对象
      rLoading.close();
     /* let _this = this;
      const rLoading = this.openLoading('职责清单导出中，请稍等');
      this.loading = true;
      var url = this.Config.baseContext + "/mssq/mssqItemSendCopy/sendCopyImport";
      this.$http_post(url, Object.assign({}, {}, this.formInline), null, 'blob').then(ret => {
        rLoading.close();
        if (ret.type == 'application/json') {
          const reader = new FileReader(); //创建一个FileReader实例
          reader.readAsText(ret, 'utf-8'); //读取文件,结果用字符串形式表示
          reader.onload = function () { //读取完成后,**获取reader.result**
            const msg = JSON.parse(reader.result);
            _this.$message.error(msg.message); //弹出错误提示
          };
          return;
        }
        if (ret.state == 0) {
          this.$message.error(ret.message);
          return
        }
        let a = document.createElement('a');
        let url = window.URL.createObjectURL(ret);
        a.href = url;
        //设置文件名称
        var t = this.formatDate(new Date().getTime(), 'yyyyMMddHHmmss');
        let fileName = '职责清单' + t + '.xlsx';
        a.download = fileName;
        a.click();
        this.visible = false;
        this.$message.success('导出成功');
        this.loading = false;
      });*/
    },
    sendCopyExport(){
      this.confirm({
        value: 1
      })
    },
    confirm() {
      let _this = this;
      const rLoading = this.openLoading('抄送记录导出中，请稍等');
      this.loading = true;
      var url = this.Config.baseContext + "/mssq/mssqItemSendCopy/sendCopyExport";
      this.$http_post(url, Object.assign({}, {}, this.formInline), null, 'blob').then(ret => {
        rLoading.close();
        if (ret.type == 'application/json') {
          const reader = new FileReader(); //创建一个FileReader实例
          reader.readAsText(ret, 'utf-8'); //读取文件,结果用字符串形式表示
          reader.onload = function () { //读取完成后,**获取reader.result**
            const msg = JSON.parse(reader.result);
            _this.$message.error(msg.message); //弹出错误提示
          };
          return;
        }
        if (ret.state == 0) {
          this.$message.error(ret.message);
          return
        }
        let a = document.createElement('a');
        let url = window.URL.createObjectURL(ret);
        a.href = url;
        //设置文件名称
        var t = this.formatDate(new Date().getTime(), 'yyyyMMddHHmmss');
        let fileName = '抄送记录' + t + '.xlsx';
        a.download = fileName;
        a.click();
        this.visible = false;
        this.$message.success('导出成功');
        this.loading = false;
      });
    },
    reload() {
      this.itemParams = {
        page: 1,
        total: 0,
        limit: 10
      };
      var pageParam = this.itemParams
      var searchParam = this.formInline
      this.onQuery(pageParam, searchParam);
      // this.itemCount()
    },
    changeFoldState() {
      this.brandFold = !this.brandFold
    },
    searchClick(val) {
      this.formInline = {
        level: val.level.value,
        itemName: val.itemName.value,
        itemCode: val.itemCode.value,
        manageType:val.manageType.value,
        deptId: val.deptId.value,
        status:val.status.value,
        regionCode: val.regionCode.value,
        primaryIndexName: val.primaryIndexName.value,
        parentName: val.parentName.value,
        isSend: val.isSend.value,
      };
      console.log(this.formInline)
      if (val.regionCode.value == 'isAll') {
        this.formInline.regionCode = '';
        this.formInline.isSzs = 1
      }else if(val.regionCode.value == ''){
        this.formInline.isSzs = 0;
        this.regionIndex = -1;
      } else {
        this.formInline.isSzs = 0
      }
      this.reload();
    },
    formatterPriority(row) {
      if ((!this.isEmptyObject(this.dictMap)) && this.dictMap.SSCJ.length > 0) {
        for (let i = 0; i < this.dictMap.SSCJ.length; i++) {
          if (this.dictMap.SSCJ[i].itemCode == row.level) {
            return this.dictMap.SSCJ[i].itemValue
          }
        }
      }
    },
    formatterManage(row) {
      if ((!this.isEmptyObject(this.dictMap)) && this.dictMap.MANAGE_TYPE.length > 0) {
        for (let i = 0; i < this.dictMap.MANAGE_TYPE.length; i++) {
          if (this.dictMap.MANAGE_TYPE[i].itemCode == row.manageType) {
            return this.dictMap.MANAGE_TYPE[i].itemValue
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
        // return sColorChange.join(',')
        return 'rgba(' + sColorChange.join(',') + ',' + alpha + ')'
      } else {
        return sColor
      }
    },
    handleClick(val) {
      this.$refs.srarch.update('regionCode', val.name, true);
    },
    showPopover(val, index) {
      this.$refs.srarch.update('deptId', '', false);
      this.regionIndex = index;
      this.deptIndex = -1;
      let _this = this;
      this.clickType = 'region';
      this.activeName = val;
      var url = this.Config.baseContext + "/mssq/mssqItemIndex/getDutyDeptListCount";
      let params = JSON.parse(JSON.stringify(this.formInline));
      params.regionCode = this.activeName;
      params.deptId = '';
      this.$http_post(url, params).then(ret => {
        this.$store.dispatch("setDeptList", ret.rows);
        let arr = [];
        for (let i = 0; i < ret.rows.length; i++) {
          if (_this.formInline.deptId == ret.rows[i].code) {
            this.deptIndex = i
          }
          arr.push({
            name: ret.rows[i].name,
            id: ret.rows[i].code,
            value: ret.rows[i].value
          })
        }
        this.$refs.srarch.update('regionCode', val, true);
        this.deptList = arr;
        this.defulatValue = JSON.parse(JSON.stringify(arr));
      });
    },
    searchDept(val, index) {
      this.secondIndex = val.id;
      this.deptIndex = index;
      this.$refs.srarch.update('deptId', val.id, true);
      this.getRegion();
    },
    searchDeptInfo(val) {
      let arr = [];
      for (let i = 0; i < this.defulatValue.length; i++) {
        if (this.defulatValue[i].name.indexOf(val) != -1) {
          arr.push(this.defulatValue[i])
        }
      }
      this.deptList = arr;
    },
    sendDept(row){
      this.itemInfo = row;
      this.chooseDeptDialog = true;
      let url =this.Config.baseContext + '/mssq/mssqItemSendCopy/getItemSendCopyInfo';
      var param = {};
      param.itemCode = row.itemCode
      this.$http_post(url, param).then(ret => {
        if (ret.state == 1) {
          if(ret.row && ret.row.sendCopyDept){
            let sendCopyDept = JSON.parse(ret.row.sendCopyDept);
            for (let i = 0; i < sendCopyDept.length; i++) {
              sendCopyDept[i].creationTime = ret.row.creationTime
            }
            let arr = []
            for (let i = 0; i < sendCopyDept.length; i++) {
              arr.push({
                id:sendCopyDept[i].deptId,
                name:sendCopyDept[i].deptName,
                code:sendCopyDept[i].deptCode
              })
              this.checkedKeys.push(sendCopyDept[i].deptId)
            }
            this.copyData = JSON.parse(JSON.stringify(arr))
            this.chooseData = JSON.parse(JSON.stringify(arr))
          }else{
            this.chooseData = [];
          }

        } else {
          this.$message.error(ret.message);
        }
      });
    },
    deleteDept(data,index){
      this.chooseData.splice(index,1)
    },
    beforeClose(){
      this.chooseDeptDialog = false;
      this.chooseData = []
    },
    leftForRight(){
      let arr1 = []
      if(this.$refs.chooseDept.activeName === 'first'){
        arr1 = this.$refs.chooseDept.$refs.organTree.$refs.tree.getCheckedNodes();
      }else{
        arr1 = this.$refs.chooseDept.organTreeArr;
      }
      console.log(arr1)
      for (let j = 0; j < arr1.length; j++) {
       let flag = true
        for (let i = 0; i < this.chooseData.length; i++) {
          if(arr1[j].id === this.chooseData[i].id){
            flag = false;
          }
        }
        if(flag){
          this.chooseData.push(arr1[j])
        }
      }
    },
    saveSendCopy(){
      let url =this.Config.baseContext + '/mssq/mssqItemSendCopy/saveSendCopy';
      var param = {
        id:'',
        itemCode:this.itemInfo.itemCode,
        itemId:this.itemInfo.itemId,
        sendCopyDept:[],
      };
      for (let i = 0; i < this.chooseData.length; i++) {
        param.sendCopyDept.push({
          "deptId":this.chooseData[i].id,
          "deptName":this.chooseData[i].name,
          "deptCode":this.chooseData[i].code
        })
      }
      if(param.sendCopyDept.length > 0){
        param.sendCopyDept = JSON.stringify(param.sendCopyDept)
      }else{
        param.sendCopyDept = ''
      }
      this.$http_post(url, param,true).then(ret => {
        if (ret.state == 1) {
          this.$message.success('抄送部门保存成功')
          this.chooseDeptDialog = false;
          this.checkedKeys = [];
          this.handleClick({index:this.showIndex})
        } else {
          this.$message.error(ret.message);
        }
      });
    },
    cacelDept(data){
      for (let i = 0; i < this.chooseData.length; i++) {
        if(this.chooseData[i].id === data.id){
          this.deleteDept(data,i)
        }
      }
    },
    allChoose(val){
      if(!val){
        this.checkedSendCopy = [];
        return
      }
      for (let i = 0; i < this.chooseData.length; i++) {
        this.checkedSendCopy.push(this.chooseData[i].id);
      }
    },
    deleteAllDept(){
      for (let i = 0; i < this.chooseData.length; i++) {
        for (let j = 0; j < this.checkedSendCopy.length; j++) {
          if(this.chooseData[i].id ===  this.checkedSendCopy[j]){
            this.chooseData.splice(i,1)
            i--;
            this.isChacel = false;
            this.isAll = false;
            break;
          }
        }
      }
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
        this.$message.success(response.row || '抄送职责清单导入成功');
        var pageParam = this.itemParams
        var searchParam = this.formInline
        this.onQuery(pageParam, searchParam);
      } else {
        this.$message.error(response.message);
      }
    },
    modelError(err, file, fileList) {
      this.$message.error(error.message);
    },
    openAddExport(){},

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
    getColNum() {
      if (this.$store.getters.curUser.roleValue.indexOf('ZSJSH') != -1 && this.$store.getters.curUser.attrMap
          .REGION_CODE == '440301') {
        return 8
      } else if (this.$store.getters.curUser.roleValue.indexOf('ZSJSH') != -1 && this.$store.getters.curUser
          .attrMap.REGION_CODE != '440301') {
        return 16
      } else {
        return 24
      }
    },
    deptTree() {
      let arr = [];
      let index = -1;
      if (!this.isEmptyObject(this.dictMap) && this.$store.getters.curUser.attrMap.REGION_CODE == '440301') {
        for (let j = 0; j < this.dictMap.REGION.length; j++) {
          let flag = -1;
          for (let i = 0; i < this.regionList.length; i++) {
            if (this.dictMap.REGION[j].itemCode == this.regionList[i].code) {
              flag = i;
            }
            if (this.regionList[i].code == 'isAll') {
              index = i
            }
          }
          if (flag != -1) {
            arr.push({
              name: this.regionList[flag].name,
              id: this.regionList[flag].code,
              value: this.regionList[flag].value
            })
          } else {
            arr.push({
              name: this.dictMap.REGION[j].itemValue,
              id: this.dictMap.REGION[j].itemCode,
              value: 0,
            })
          }
        }
        if (index != -1) {
          arr.unshift({
            name: this.regionList[index].name,
            id: this.regionList[index].code,
            value: this.regionList[index].value || 0
          })
        }
      } else if (!this.isEmptyObject(this.dictMap) && this.$store.getters.curUser.attrMap.REGION_CODE != '440301') {
        let num = 0;
        for (let i = 0; i < this.regionList.length; i++) {
          if (this.regionList[i].code == this.$store.getters.curUser.attrMap.REGION_CODE) {
            num = this.regionList[i].value
          }
        }
        arr.push({
          name: this.$store.getters.curUser.attrMap.REGION_NAME,
          id: this.$store.getters.curUser.attrMap.REGION_CODE,
          value: num
        })
      }
      return arr;
    },
    itemLevel() {
      return this.dictMap.SSCJ
    },
    manageType(){
      return this.dictMap.MANAGE_TYPE
    },
    itemStatus(){
      return this.dictMap.ITEM_STATUS
    }
  },
  destroyed() {
    window.onresize = null;
  }
}
</script>
<style lang='less' scoped>
.cardView {
  position: relative;
  /*overflow: hidden;*/
  height: 100%;
  background: #f8f8f8;
  display: flex;
  flex-direction: column;

  /deep/ .el-tabs {
    .el-tabs__header {
      .el-tabs__nav-wrap {
        .el-tabs__nav-scroll {
          .el-tabs__nav {
            .el-tabs__item {
              padding: 0px 5px;
              font-size: 13px;
            }
          }
        }
      }
    }
  }

  .el-col {
    .form-btn {
      /deep/ .el-form-item__content {
        text-align: center;
        margin-left: 20px !important;
      }
    }

    .form-btn-right {
      /deep/ .el-form-item__content {
        text-align: end;
        margin-left: 20px !important;
      }
    }

    .el-select {
      width: 100%;
    }
  }

  .view {
    display: flex;
    flex: 1;
    height: calc(100% - 200px);

    .box-right {
      border: none;
      border-radius: 0;
      display: inline-block;
      width: 100%;
      height: 100%;

      /deep/ .el-card__body {
        padding: 0;
        height: calc(100%);
        padding: 4px;

        & > .item {
          height: 100%;
          display: flex;
          flex-direction: column;
          height: calc(100%);
          background: #fff;

          .block {
            padding: 10px 0;
          }
        }
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

  /deep/ .el-menu-item.is-active {
  }
}

/deep/ .el-radio-button__inner {
  padding: 7px 22px !important;
  margin-right: 10px;
  border-radius: 0 !important;
}

.block {
  text-align: right;
  margin: 10px;
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

.export {
  margin-left: 10px;
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

.tabPane {
  font-size: 12px;
  padding: 5px 0;
}

.nums {
  color: #409eff;
}

.deptInfo-all {
  height: 200px;
  overflow: auto;
}

.deptInfo {
  display: flex;
  cursor: pointer;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid #ccc;

  .name {
    width: 80%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}

.addCatalog {
  display: flex;
  padding-left: 10px;
  align-items: center;
  .el-button{
    margin-left: 10px;
  }
  /*position: absolute;*/
  /*right: 0;*/
}

.tree-node {
  width: 100%;
  display: flex;

  .tree-label {
    span {
      max-width: 135px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }

    /*max-width: 100px;*/
    /*white-space: nowrap;*/
    /*overflow: hidden;*/
    /*text-overflow: ellipsis;*/
  }
}

/*:deep(.el-tree){
  .el-tree-node__content{
    align-items: flex-start;
    height: auto;
  }
}*/

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
        margin-bottom: 14px;
      }

      .cell {
        display: flex;
        /*width: 16%;*/
        align-items: center;
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
      color: #666;
    }
  }
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

.search-box {
  background: #fff;
  margin-bottom: 10px;
  width: 100%;
  /*display: flex;*/
  padding: 10px 14px 0 14px;

}
.dialog-content{
  display: flex;
  .left{
    width: 50%;
    //border-right: 1px solid #c2c2c2;
  }
  .right{
    min-height: 300px;
    padding: 10px;
    width: 50%;
    .deptName{
      display: flex;
      flex-wrap: wrap;
      .cell{
        display: inline-block;
        line-height: 30px;
        margin: 5px 0 0 5px;
        padding: 0 10px;
        border-radius: 1px;
        background: #F3F6FC;
        i{
          cursor: pointer;
          color: #909399;
        }
      }
    }
    .choose{
      height: 100%;
      &_content{
        height: 400px;
        overflow: auto;
      }
      &-header{
        display: flex;
        justify-content: space-between;
      }
      .no-data{
        :deep(p){
          color: #909399;
          font-size: 15px;
        }
      }
    }
  }
  .center{
    display: flex;
    align-items: center;
    border-left: 1px solid #c2c2c2;
    border-right: 1px solid #c2c2c2;
    padding: 0 15px;
    margin: 0 10px;
  }
}
</style>
