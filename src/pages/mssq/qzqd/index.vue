<template>
  <div class="cardView" ref="tableH">
    <div class="search-box">
      <Search :fieldData="fieldData" ref="srarch" @searchClick="searchClick">
        <template slot="footer">
          <div class="addCatalog">
            <el-button type="warning" size="small" icon="el-icon-download"
                       @click="exportList">导出职责清单
            </el-button>
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
          <span @click="changeFoldState">{{brandFold?'展开':'收起'}}</span>
          <el-link type="primary" @click="changeFoldState"><i
                  :class="!brandFold? 'el-icon-arrow-down':'el-icon-arrow-up'"></i></el-link>
        </div>
      </div>
    </div>
    <div class="view">
      <el-card class="box-card box-left" shadow="never">
        <div slot="header" class="clearfix">
          <div class="title">
            <div class="left">
              <div class="icon">
                <i class="el-icon-star-on"></i>
              </div>
              <span>目录清单</span>
            </div>
            <!--	<el-input class="search name" clearable v-model="catalogue" placeholder="请输入名称">
                <i slot="prefix" class="el-input__icon el-icon-search" style="cursor:pointer"></i>
              </el-input>-->
          </div>
        </div>
        <div class="text item">
          <el-tree :data="primaryIndex" ref="treeForm" :props="defaultProps" node-key="code" check-strictly
                   show-checkbox @node-click="choseNode" @check="handleCheck">
						<span class="custom-tree-node" slot-scope="{ node, data }">
							<div class="tree-node">
								<el-tooltip class="item" effect="dark" :content="node.label" placement="top-start">
									<div class="tree-label"><span>{{ node.label }}</span></div>
								</el-tooltip>
								<span style="padding-left: 5px" v-if="node.data.code.length<=5">{{node.data.value}}</span>
							</div>
						</span>
          </el-tree>
        </div>
      </el-card>
      <el-card class="box-card box-right" shadow="never">
        <div class="text item">
          <el-table :data="tableData" style="width: 100%" height="100%" class="qz-table-hide">
            <el-table-column type="index" label="序号" width="50"></el-table-column>
            <el-table-column prop="primaryIndexName" label="一级索引名称" show-overflow-tooltip></el-table-column>
            <el-table-column prop="parentName" label="二级索引名称" show-overflow-tooltip></el-table-column>
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
            <el-table-column prop="status" label="事项状态" align="center" width="80" show-overflow-tooltip
                             :formatter="formatterState">
              <template slot-scope="scope">
                <el-tag type="success"
                        v-if="scope.row.status == 'EXAMINE_SUCCESS' || scope.row.status == 'PUBLISH' || scope.row.status == 'DISCARD'">
                  {{formatterState(scope.row)}}</el-tag>
                <el-tag v-if="scope.row.status == 'DRAF'">{{formatterState(scope.row)}}</el-tag>
                <el-tag type="danger"
                        v-if="scope.row.status == 'EXAMINE_FAIL' || scope.row.status == 'ACCEPT_FAIL'">
                  {{formatterState(scope.row)}}</el-tag>
                <el-tag type="warning"
                        v-if="scope.row.status == 'EXAMINE_WAIT' || scope.row.status == 'ACCEPT_WAIT'">
                  {{formatterState(scope.row)}}</el-tag>
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

  export default {
    name: "index",
    mixins: [qzBase],
    components: {},
    data() {
      return {
        regionIndex: 0,
        brandFold: false,
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
          Button: {
            type: 'Button',
            span: 8
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
        catalogue: '',
        checked:false,
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
      if(this.$route.path != this.$store.getters.searchParams.path) this.$store.dispatch("setSearchParams", {});
      if (!this.isEmptyObject(this.$store.getters.searchParams.data)) {

        this.$nextTick(() => {
          this.deptList = this.$store.getters.deptList;
          this.activeName = this.$store.getters.searchParams.data.regionCode;
          this.$refs.srarch.update('level', this.$store.getters.searchParams.data.level, false);
          this.$refs.srarch.update('primaryIndexName', this.$store.getters.searchParams.data.primaryIndexName, false);
          this.$refs.srarch.update('parentName', this.$store.getters.searchParams.data.parentName, false);
          this.$refs.srarch.update('itemName', this.$store.getters.searchParams.data.itemName, false);
          this.$refs.srarch.update('catalogName', this.$store.getters.searchParams.data.catalogName, false);
          this.$refs.srarch.update('catalogCode', this.$store.getters.searchParams.data.catalogCode, false);
          this.$refs.srarch.update('regionCode', this.$store.getters.searchParams.data.regionCode, false);
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
      // this.getRegion();
      this.getCatalog();
      // this.showDept();
    },
    methods: {
      choseNode(data, node) {
        let name = JSON.parse(JSON.stringify(node.data.name));
        if(this.chooseNodeCode == data.code){
          name = '';
          this.$refs.treeForm.setCheckedKeys([])
        }else{
          this.$refs.treeForm.setCheckedKeys([data.code])
        }
        if (node.data.code.length == 2) {
          this.chooseNodeCode = node.data.code;
          this.$refs.srarch.update('primaryIndexName', name, false);
          this.$refs.srarch.update('parentName', '', false);
          this.$refs.srarch.update('catalogName', '', false);
          this.$refs.srarch.update('catalogCode', '', true);
        }
        if (node.data.code.length == 5) {
          this.chooseNodeCode = node.data.code;
          this.$refs.srarch.update('parentName', name, false);
          this.$refs.srarch.update('primaryIndexName', '', false);
          this.$refs.srarch.update('catalogName', '', false);
          this.$refs.srarch.update('catalogCode', '', true);
        }
        if (node.data.code.length == 8) {
          this.chooseNodeCode = node.data.code;
          this.$refs.srarch.update('catalogName', name, false);
          // this.$refs.srarch.update('catalogCode', node.data.code, true);
          this.$refs.srarch.update('primaryIndexName', '', false);
          this.$refs.srarch.update('parentName', '', true);
        }
        // node.checked = !(node.checked);
      },
      orgCodeList(pageParam, searchParam) {
        var url = this.Config.baseContext + "/admin/pmi/orgCodeList";
        var param = Object.assign({}, pageParam, searchParam);
        this.$http_get(url, param).then(ret => {
          console.log(ret);
        });
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
        var url = this.Config.baseContext + "/mssq/mssqItemIndex/getDutyItemList";
        var param = Object.assign({}, pageParam, searchParam);
        this.$http_post(url, param).then(ret => {
          if (ret.state == 1) {
            this.tableData = ret.rows;
            this.itemParams.total = ret.records;
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
        this.confirm({
          value: 1
        })
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
      searchClick(val) {
        this.formInline = {
          level: val.level.value,
          itemName: val.itemName.value,
          manageType:val.manageType.value,
          deptId: val.deptId.value,
          status:val.status.value,
          regionCode: val.regionCode.value,
          primaryIndexName: val.primaryIndexName.value,
          parentName: val.parentName.value,
          // catalogName: val.catalogName.value,
          // catalogCode: val.catalogCode.value,
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
        if(this.formInline.primaryIndexName == '' &&this.formInline.parentName == '' &&this.formInline.catalogName == ''){
          this.$refs.treeForm.setCheckedKeys([]);
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
      /*showChildren(row,index){
        this.firstIndex = index;
        this.parent = JSON.parse(JSON.stringify(row.children));
        this.$refs.srarch.update('primaryIndexName',row.name);

        this.parentList = JSON.parse(JSON.stringify(row.children));
      },
      showSecondChildren(row,index){
        this.secondIndex = index;
        this.$refs.srarch.update('parentName',row.name);
        this.catalog = JSON.parse(JSON.stringify(row.children));
        this.catalogList = JSON.parse(JSON.stringify(row.children));
      },
      searchChildChildren(row,index){
        this.thirdIndex = index;
        this.$refs.srarch.update('catalogName',row.name);
        this.$refs.srarch.update('catalogCode',row.code);
      },*/
      showChildren(row, index) {
        if (this.firstIndex == index) {
          this.firstIndex = -1;
          this.thirdIndex = -1;
          this.secondIndex = -1;
          this.$refs.srarch.update('primaryIndexName', '', true);
          this.parent = JSON.parse(JSON.stringify(this.parentList));
          this.catalog = JSON.parse(JSON.stringify(this.catalogThirdList));
        } else {
          this.thirdIndex = -1;
          this.secondIndex = -1;
          this.firstIndex = index;
          this.parent = JSON.parse(JSON.stringify(row.children));
          this.$refs.srarch.update('primaryIndexName', row.name, true);
          this.catalog = JSON.parse(JSON.stringify(this.catalogThirdList));
        }
        // this.parentList = JSON.parse(JSON.stringify(row.children));
      },
      showSecondChildren(row, index) {
        if (this.secondIndex == index) {
          this.secondIndex = -1;
          this.thirdIndex = -1;
          this.$refs.srarch.update('parentName', '', true);
          this.catalog = JSON.parse(JSON.stringify(this.catalogThirdList));
        } else {
          this.secondIndex = index;
          this.thirdIndex = -1;
          this.$refs.srarch.update('parentName', row.name, true);
          this.catalog = JSON.parse(JSON.stringify(row.children));
          // this.catalogThirdList = JSON.parse(JSON.stringify(row.children));
        }
      },
      searchChildChildren(row, index) {
        if (this.thirdIndex == index) {
          this.thirdIndex = -1;
          this.$refs.srarch.update('catalogName', '', true);
        } else {
          this.thirdIndex = index;
          this.$refs.srarch.update('catalogName', row.name, true);
        }
        // this.$refs.srarch.update('catalogCode',row.code);
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
      /*itemStatus() {
        let arr = [];
        if ((!this.isEmptyObject(this.dictMap)) && this.dictMap.ITEM_STATUS.length > 0) {
          for (let i = 0; i < this.dictMap.ITEM_STATUS.length; i++) {
            if (this.dictMap.ITEM_STATUS[i].itemCode == 'DRAF' ||
              this.dictMap.ITEM_STATUS[i].itemCode == 'ACCEPT_WAIT' ||
              this.dictMap.ITEM_STATUS[i].itemCode == 'PUBLISH' ||
              this.dictMap.ITEM_STATUS[i].itemCode == 'DISCARD' ||
              this.dictMap.ITEM_STATUS[i].itemCode == 'DISCARD_WAIT' ||
              this.dictMap.ITEM_STATUS[i].itemCode == 'DISCARD_FAIL') {
              arr.push(this.dictMap.ITEM_STATUS[i])
            }
          }
        }
        return arr;
      },*/
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

        /deep/ .el-card__body {
          padding: 0;
          height: calc(100% - 50px);
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
    padding-left: 10px;
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
</style>
