<template>
  <div class="cardView" ref="tableH">
    <div class="search-box">
      <Search :fieldData="fieldData" ref="srarch" @searchClick="searchClick" @selectClick="selectClick">
        <template slot="footer" >
<!--  v-if="$store.getters.curUser.roleValue && $store.getters.curUser.roleValue.indexOf('MSA02RS06') != -1"        -->
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
                       :data="{isNew:'0'}"
                       :headers="uploadHeaders"
                       :on-error="modelError"
                       :file-list="[]">
<!--    仅添加为当前版本数据              -->
              <el-button size="small" type="success"
                         icon="el-icon-plus">新增导入
              </el-button>
            </el-upload>
            <el-upload class="upload" ref="material"
                       :action="uploadUrl"
                       :on-remove="modelRemove"
                       :before-upload="beforeUpload"
                       :before-remove="modelBeforeRemove"
                       :on-success="modelSuccess"
                       :on-preview="onPreview"
                       @change="openAddExport"
                       :on-progress="onProgress"
                       :data="{isNew:'1'}"
                       :headers="uploadHeaders"
                       :on-error="modelError"
                       :file-list="[]">
<!--   将当前数据变更为历史版本，导入数据设为最新版本且版本号加1           -->
              <el-button size="small" type="success"
                         icon="el-icon-plus">覆盖导入
              </el-button>
            </el-upload>
          </div>
        </template>
      </Search>
    </div>
    <div class="view">
      <el-card class="box-card box-left" shadow="never">
        <div slot="header" class="clearfix">
          <div class="title">
            <div class="left">
              <div class="icon">
                <i class="el-icon-star-on"></i>
              </div>
              <span>职责清单</span>
            </div>
            	<el-input class="search name" @input="changeStatis" clearable v-model="catalogue" placeholder="请输入名称">
                <i slot="prefix" class="el-input__icon el-icon-search" style="cursor:pointer"></i>
              </el-input>
          </div>
          <div class="index"><div>一级索引：{{ statisticsData[1] }}</div> <div>二级索引：{{ statisticsData[2] }}</div></div>
        </div>
        <div class="text item">
          <el-tree :data="primaryIndex" :filter-node-method="filterNode" ref="treeForm" :props="defaultProps" node-key="id" @node-click="choseNode">
						<span class="custom-tree-node" slot-scope="{ node, data }">
							<div class="tree-node">
								<el-tooltip class="item" effect="dark" :content="node.label" placement="top-start">
									<div class="tree-label">
                    <span v-if="!catalogue">{{ node.label }}</span>
                    <span v-if="catalogue" v-html="node.label.replace(new RegExp(catalogue,'g'),`<font style='background:#ff9632;color:#000'>${catalogue}</font>`)" />
                  </div>
								</el-tooltip>
                <span style="padding-left: 5px" v-if="node.level<3">{{ getNodeNum(node) }}</span>
							</div>
						</span>
          </el-tree>
        </div>
      </el-card>
      <el-card class="box-card box-right" shadow="never">
        <div class="text item">
          <el-table :data="tableData" style="width: 100%" height="100%" class="qz-table-hide">
            <el-table-column prop="indexNum" label="序号" width="100"></el-table-column>
            <el-table-column prop="indexLv1" label="一级索引名称" width="120px" show-overflow-tooltip></el-table-column>
            <el-table-column prop="indexLv2" label="二级索引名称" width="120px" show-overflow-tooltip></el-table-column>
            <el-table-column prop="indexLv3" label="三级分类（事件描述）" max-width="300" ></el-table-column>
            <el-table-column prop="sxcj" label="事项层级" show-overflow-tooltip width="100px" align="center"></el-table-column>
            <el-table-column prop="deptName" label="主办单位" max-width="300">
<!--              <template slot-scope="scope">-->
<!--                <div>{{ scope.row.deptName }}</div>-->
<!--              </template>-->
            </el-table-column>
            <el-table-column prop="itemSource" label="事项来源" align="center" width="80" show-overflow-tooltip></el-table-column>
            <el-table-column label="操作" align="right" width="120" show-overflow-tooltip v-if="$store.getters.curUser.roleValue && $store.getters.curUser.roleValue.indexOf('MSA02RS06') != -1">
              <template slot-scope="scope">
                <el-button type="text"  @click="edit(scope.row)">编辑</el-button>
                <el-button type="text" @click="delData(scope.row)">删除</el-button>
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
  </div>
</template>

<script>
import qzBase from '@_src/pages/mssq/common/util/qzBase';
import OrganTree from '@_src/pages/mssq/common/components/organ'
import uploadUtil from '@_src/utils/upload';

export default {
  name: "index",
  mixins: [qzBase],
  components: {},
  data() {
    return {
      statisticsData:{},
      regionIndex: 0,
      brandFold: false,
      defaultProps: {
        children: 'children',
        value: 'id',
        label: 'name'
      },
      seachCatalog: {
        first: '',
        second: '',
        third: ''
      },
      fieldData: {
        indexLv1: {
          label: '一级索引',
          type: 'Input',
          placeholder: '请输入一级索引名称',
          value: '',
          span: 8
        },
        indexLv2: {
          label: '二级索引',
          type: 'Input',
          placeholder: '请输入二级索引名称',
          value: '',
          span: 8
        },
        indexLv3: {
          label: '三级分类',
          type: 'Input',
          placeholder: '三级分类（事件描述）',
          value: '',
          span: 8
        },
        sxcj: {
          label: '事项层级',
          type: 'Input', //类型
          placeholder: '请输入事项层级',
          value: '',
          span: 8, //布局比例
          selectList: []
        },
        itemSource: {
          label: '事项来源',
          type: 'Input', //类型
          placeholder: '请输入事项来源',
          value: '',
          span: 8, //布局比例
          selectList: []
        },
        deptName: {
          label: '主办单位',
          type: 'Input', //类型
          placeholder: '请输入主办单位',
          value: '',
          span: 8, //布局比例
          selectList: []
        },
        version: {
          label: '版本',
          type: 'Select', //类型
          placeholder: '请选择版本',
          value: '',
          span: 8, //布局比例
          selectList: []
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
        indexLv2: '',
        indexLv1: '',
        itemCode: '',
        status: '',
        manageType: '',
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
      showIndex1: [],
      thirdIndex: -1,
      catalogThirdList: [],
      catalogue: '',
      checked:false,
      fileList: [],
      uploadHeaders: {},
      uploadUrl: '',
      versionData: [{
        name:'最新',
        id:''
      }],
    }
  },
  watch: {
    catalogue(value){
      this.$refs.treeForm.filter(value)
    },
    versionData: {
      handler(val) {
        this.fieldData.version.selectList = val;
      },
      deep:true,
      immediate: true
    },
  },
  mounted() {
    let _this = this;
    this.uploadUrl = this.Config.base_url + this.Config.baseContext + '/mssq/mssqDutyExt/dutyImport';
    let headers = uploadUtil.setHeaders();
    headers['x-aep-token'] = this.$store.getters.token;
    this.uploadHeaders = headers;
    if(this.$route.path != this.$store.getters.searchParams.path) this.$store.dispatch("setSearchParams", {});
    if (!this.isEmptyObject(this.$store.getters.searchParams.data)) {
      this.$nextTick(() => {
        this.$refs.srarch.update('sxcj', this.$store.getters.searchParams.data.sxcj, false);
        this.$refs.srarch.update('itemSource', this.$store.getters.searchParams.data.itemSource, false);
        this.$refs.srarch.update('indexLv1', this.$store.getters.searchParams.data.indexLv1, false);
        this.$refs.srarch.update('indexLv2', this.$store.getters.searchParams.data.indexLv2, false);
        this.$refs.srarch.update('itemName', this.$store.getters.searchParams.data.itemName, false);
        this.$refs.srarch.update('indexLv3', this.$store.getters.searchParams.data.indexLv3, false);
        this.$refs.srarch.update('deptName', this.$store.getters.searchParams.data.deptName, false);
        this.$refs.srarch.update('version', this.$store.getters.searchParams.data.version, false);
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
    this.getVersion();
  },
  methods: {
    getNodeNum(node){
      let flag = 0;
      for (let i = 0; i < node.childNodes.length; i++) {
        if(node.childNodes[i].visible){
          flag++
        }
      }
      let a = flag;
      return flag;
    },
    getIndexLv1Value(){
      let flag = 0
      this.showIndex1 = [];
      let arr2 = this.$refs.treeForm&&this.$refs.treeForm.store.root.childNodes;
      if(!arr2){return 0}
      for (let i = 0; i <arr2.length ; i++) {
        if(arr2[i].visible){
          // this.showIndex1.push(arr2[i])
          flag ++
        }
      }
      return flag;
    },
    getIndexLv2Value(){
      let _this = this;
      let arr2 = [];
      arr2 = _this.$refs.treeForm&&_this.$refs.treeForm.store.root.childNodes;
      if(!arr2){return 0}
      const count = {}
      step1(arr2);
      function step1(data) {
        for (let i = 0; i < data.length; i++) {
          if(data[i].visible){
            if(typeof count[data[i].level] !== 'number'){
              count[data[i].level] = 0
            }
            count[data[i].level]++
            if(data[i].level === 2){
              console.log(data[i].visible,data[i].label,data[i]);
            }
            step1(data[i].childNodes)
          }
        }
      }
      this.statisticsData = count
    },
    changeStatis(){
      this.$nextTick(()=>{
        this.getIndexLv2Value();
      })
    },
    search(value) {
      this.$refs.treeForm.filter(node => {
        if (node.label.includes(value)) {
          node.highlight = true;
        } else {
          node.highlight = false;
        }
      });
    },
    filterNode(value, data, node) {
      // 在这里定义如何过滤节点。例如，你可以根据节点的 label 属性来过滤。
      // 如果返回 true，则节点会被显示；如果返回 false，则节点会被隐藏。
      node.text = "";
      if(!value) return true;
      if(data.name.indexOf(value) !== -1){
        node.text = "red"
      }
      // data.visible = data.name.indexOf(value) !== -1;
      return data.name.indexOf(value) !== -1
    },
    edit(row){
      localStorage.setItem('catalogZzqd',JSON.stringify(row));
      this.$router.push('info')
    },
    getVersion(){
      var url = this.Config.baseContext + "/mssq/mssqDutyExt/getVersion";
      this.$http_post(url, {}).then(ret => {
        if (ret.state == 1) {
          let arr = this.bubbleSort(ret.rows)
          for (let i = 0; i < arr.length; i++) {
            this.versionData.push({
              name:arr[i],
              id:arr[i],
            })
          }
        } else {
          this.$message.error(ret.message);
        }
      });
    },
     bubbleSort(arr) {
      let len = arr.length;
      for (let i = 0; i < len - 1; i++) {
        for (let j = 0; j < len - 1 - i; j++) {
          if (arr[j] > arr[j + 1]) {
            // 交换 arr[j] 和 arr[j+1]
            let temp = arr[j];
            arr[j] = arr[j + 1];
            arr[j + 1] = temp;
          }
        }
      }
      return arr;
    },
    delData(row){
      this.$confirm('是否删除三级索引【'+row.indexLv3+'】?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        var url = this.Config.baseContext + "/mssq/mssqDutyExt/delById";
        this.$http_post(url, {
          id:row.id,
        }).then(ret => {
          if (ret.state == 1) {
            this.$message.success('删除成功');
            var pageParam = this.itemParams
            var searchParam = this.formInline
            this.onQuery(pageParam, searchParam)
          } else {
            this.$message.error(ret.message);
          }
        });
      }).catch((e) => {
        console.log(e)
      });
    },
    choseNode(data, node) {
      let name = JSON.parse(JSON.stringify(node.data.name));
      switch (node.data.code) {
        case '1':
          this.$refs.srarch.update('indexLv2', '', false);
          this.$refs.srarch.update('indexLv3', this.catalogue, false);
          this.$refs.srarch.update('indexLv1', name, true);
          break;
        case '2':
          this.$refs.srarch.update('indexLv1', '', false);
          this.$refs.srarch.update('indexLv3', this.catalogue, false);
          this.$refs.srarch.update('indexLv2', name, true);
          break;
        case '3':
          this.$refs.srarch.update('indexLv1', '', false);
          this.$refs.srarch.update('indexLv2', '', false);
          this.$refs.srarch.update('indexLv3', name, true);
          break;
        default:
          this.$refs.srarch.update('indexLv1', '', false);
          this.$refs.srarch.update('indexLv2', '', false);
          this.$refs.srarch.update('indexLv3', '', false);
      }
     /* if( === '1'){
        name = '';
        this.$refs.treeForm.setCheckedKeys([])
      }else{
        this.$refs.treeForm.setCheckedKeys([data.code])
      }*/
    /*  if (node.data.code.length == 2) {
        this.chooseNodeCode = node.data.code;

      }
      if (node.data.code.length == 5) {

      }
      if (node.data.code.length == 8) {
        this.chooseNodeCode = node.data.code;

      }*/
      // node.checked = !(node.checked);
    },
    orgCodeList(pageParam, searchParam) {
      var url = this.Config.baseContext + "/admin/pmi/orgCodeList";
      var param = Object.assign({}, pageParam, searchParam);
      this.$http_get(url, param).then(ret => {
        console.log(ret);
      });
    },
    getCatalog() {
      var url = this.Config.baseContext + "/mssq/mssqDutyExt/getIndexTree";
      // var param = Object.assign({}, pageParam, searchParam);
      this.$http_post(url, {
        version:this.formInline.version,
      }).then(ret => {
        let data = ret.rows;
        let arrData =  reloadTree(data,[],'');
        this.primaryIndex = arrData;
        this.$nextTick(()=>{
          this.getIndexLv2Value();
        })
        function reloadTree(list,arr,index) {
          for(let key in list){
            let type = Object.prototype.toString.call(list[key])
            switch (type) {
              case '[object Array]':
                let keyList2 = Object.keys(list[key])
                arr.push({
                  name:key,
                  code:'2',
                  visible:true,
                  id:key,
                  value:keyList2.length,
                  children:[],
                })
                reloadTree(list[key],arr[arr.length - 1].children, index + key);
                break;
              case '[object Object]':
                let keyList = Object.keys(list[key])
                arr.push({
                  value:keyList.length,
                  name:key,
                  visible:true,
                  id:key,
                  code:'1',
                  children:[],
                });
                reloadTree(list[key],arr[arr.length - 1].children,index + key);
                break;
              default:
                arr.push({
                  name:list[key],
                  code:'3',
                  visible:true,
                  id:index +key,
                })
            }
          }
          return arr;
        }
      });
    },
    merge(list, callback) {
      let arr = [];
      for (let i = 0; i < list.length; i++) {
        arr = arr.concat(list[i].children)
      }
      callback(arr)
    },
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    },
    onQuery(pageParam, searchParam) {
      var url = this.Config.baseContext + "/mssq/mssqDutyExt/getList";
      var param = Object.assign({}, pageParam, searchParam);
      this.$http_post(url, param).then(ret => {
        if (ret.state == 1) {
          this.tableData = ret.rows;
          this.itemParams.total = ret.records;
          if (this.clickType == 'region') {
            this.clickType = '';
            return
          };
        } else {
          this.$message.error(ret.message);
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
      /*this.confirm({
        value: 1
      })*/
    },
    confirm() {
      let _this = this;
      const rLoading = this.openLoading('职责清单导出中，请稍等');
      this.loading = true;
      var url = this.Config.baseContext + "/mssq/mssqItemIndex/qzqdExport";
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
    handleCheck(data, list) {
      if (list.checkedKeys.length == 2) {
        //单选实现
        this.$refs.treeForm.setCheckedKeys([data.code]);
      }
      this.chooseNodeCode = '';
      if(list.checkedKeys.length == 0){
        this.choseNode(data, {data: {code:data.code,name:''}, checked: true})
      }else{
        this.choseNode(data, {data: data, checked: false})
      }
    },
    changeFoldState() {
      this.brandFold = !this.brandFold
    },
    selectClick(val){
      this.formInline.version = val.version.value;
      this.getCatalog()
    },
    searchClick(val) {
      this.formInline = {
        sxcj: val.sxcj.value,
        itemSource: val.itemSource.value,
        deptName: val.deptName.value,
        version: val.version.value,
        indexLv1: val.indexLv1.value,
        indexLv2: val.indexLv2.value,
        indexLv3: val.indexLv3.value,
      };
      this.reload();
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
    formatterState(row) {
      if ((!this.isEmptyObject(this.dictMap)) && this.dictMap.ITEM_STATUS.length > 0) {
        for (let i = 0; i < this.dictMap.ITEM_STATUS.length; i++) {
          if (this.dictMap.ITEM_STATUS[i].itemCode == row.status) {
            return this.dictMap.ITEM_STATUS[i].itemValue
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
      if (this.firstIndex == index) {
        this.firstIndex = -1;
        this.thirdIndex = -1;
        this.secondIndex = -1;
        this.$refs.srarch.update('indexLv1', '', true);
        this.parent = JSON.parse(JSON.stringify(this.parentList));
        this.catalog = JSON.parse(JSON.stringify(this.catalogThirdList));
      } else {
        this.thirdIndex = -1;
        this.secondIndex = -1;
        this.firstIndex = index;
        this.parent = JSON.parse(JSON.stringify(row.children));
        this.$refs.srarch.update('indexLv1', row.name, true);
        this.catalog = JSON.parse(JSON.stringify(this.catalogThirdList));
      }
      // this.parentList = JSON.parse(JSON.stringify(row.children));
    },
    showSecondChildren(row, index) {
      if (this.secondIndex == index) {
        this.secondIndex = -1;
        this.thirdIndex = -1;
        this.$refs.srarch.update('indexLv2', '', true);
        this.catalog = JSON.parse(JSON.stringify(this.catalogThirdList));
      } else {
        this.secondIndex = index;
        this.thirdIndex = -1;
        this.$refs.srarch.update('indexLv2', row.name, true);
        this.catalog = JSON.parse(JSON.stringify(row.children));
        // this.catalogThirdList = JSON.parse(JSON.stringify(row.children));
      }
    },
    searchChildChildren(row, index) {
      if (this.thirdIndex == index) {
        this.thirdIndex = -1;
        this.$refs.srarch.update('indexLv3', '', true);
      } else {
        this.thirdIndex = index;
        this.$refs.srarch.update('indexLv3', row.name, true);
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
        if (!response.row) {
          this.$message.warning(response.row);
          return
        }
        /*this.$notify({
          title: '目录导入详情',
          dangerouslyUseHTMLString: true,
          duration: 0,
          customClass: 'importCatalog',
          message: `<p class="successNum">当前导入成功<span class="num">${response.row.successNum}</span>条,</p>
                    <p class="errorNum">导入失败<span class="num">${response.row.errorNum}</span>条,</p>
                     <p class="notifyLink"><span onClick="getError('${response.row.erorrLogId}')">点击获取导入失败清单</span></p>`
        });*/
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

    .box-left {
      font-size: 12px;
      width: 240px;
      border: none;
      height: 100%;
      background: #fff;
      margin-right: 10px;

      /deep/ .el-card__header {
        padding: 14px 10px;

      }

      .title {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;

        .left {
          display: flex;
          align-items: center;

          .icon {
            width: 14px;
            height: 14px;
            border-radius: 50%;
            background: #3D91F7;
            display: flex;
            justify-content: center;
            align-items: center;
            margin-right: 4px;

            i {
              color: #fff;
              font-size: 12px;
            }
          }

          span {
            font-size: 14px;
          }
        }

        .search {
          width: 120px;
        }

        :deep(.name.el-input) {
          position: relative;

          input::placeholder {
            font-size: 12px !important;
            color: #999;
          }

          .el-input__inner {
            width: 120px;
            height: 28px !important;
            border-radius: 100px;
            line-height: 28px !important;
            font-size: 12px;
            background: #f5f5f5;
            border: none;
            color: #333;
          }

          .el-input__prefix {
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
          }

          .el-input__suffix {
            position: absolute;
            top: -6px;
          }

          .el-icon-search {
            font-size: 12px;
            line-height: 28px;
            color: #666;
          }

        }
      }
      .index{
        padding-top: 10px;
        display: flex;
        width: 100%;
        justify-content: space-between;
        div{
          &:last-child{
            width: 120px;
            //padding-left: 10px;
          }
        }
      }

      /deep/ .el-card__body {
        padding: 0;
        height: calc(100% - 110px);
        overflow-y: auto;

        .item {
          height: 100%;
          display: flex;
          flex-direction: column;
          height: 100%;
          background: #fff;

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
              /*padding: 5px;*/
              display: flex;
              justify-content: space-between;
              /*!*padding: 5px 0;*!*/
              /* border-bottom: 1px solid #c2c2c2;*/


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
          }
        }
      }
    }

    .box-right {
      border: none;
      border-radius: 0;
      display: inline-block;
      width: calc(100% - 250px);
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
          .el-table{
            .cell{
              white-space: pre-line;
            }
          }

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
  .upload{
    padding-left: 10px;
  }
  /*position: absolute;*/
  /*right: 0;*/
}
.custom-tree-node{
  width: 100%;
  .tree-node {
    width: 100%;
    display: flex;
    //&.active{
    //  background: #ff9632;
    //  color: #000;
    //}

    .tree-label {
      span {
        &.spanActive{
          background: #ff9632;
          color: #000;
        }
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
</style>
