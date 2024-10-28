<template>
  <div class="cardView" ref="tableH">
    <div class="search-box">
      <Search :fieldData="fieldData" @chooseDept="chooseDept" v-if="activeName == 'municipal'" ref="srarch" @searchClick="searchClick">
        <template slot="footer">
          <div class="downLoad">
            <el-button size="small" type="warning" @click="exportCityData">导出</el-button>
          </div>
        </template>
      </Search>
      <Search :fieldData="fieldProData" v-else ref="srarch" @searchClick="searchProClick"></Search>
    </div>
    <div class="view">
      <el-card class="box-card box-right" shadow="never">
        <div class="text item">
          <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="市级事项" name="municipal">
              <el-table :data="tableData" style="width: 100%" :height="tableHeight" class="qz-table-hide">
                <el-table-column type="index" label="序号" width="50"></el-table-column>
                <el-table-column prop="deptName" label="实施部门名称" width="140" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="itemCode" label="事项编码" show-overflow-tooltip></el-table-column>
                <el-table-column prop="itemName" label="事项名称" show-overflow-tooltip>
                  <template slot-scope="scope">
                    <el-link type="primary" @click="onEditItem(scope.row.itemVid,'view')">{{scope.row.itemName}}</el-link>
                  </template>
                </el-table-column>
                <!--            <el-table-column prop="proCode" label="省事项编码" show-overflow-tooltip></el-table-column>-->
                <!--            <el-table-column prop="proName" label="省事项名称" show-overflow-tooltip></el-table-column>-->
                <el-table-column prop="status" label="事项状态" width="100px" align="center" show-overflow-tooltip>
                  <template slot-scope="scope">
                    <el-tag type="success"
                            v-if="scope.row.status == 'EXAMINE_SUCCESS' || scope.row.status == 'PUBLISH' || scope.row.status == 'DISCARD'">
                      {{ dicForValue(scope.row) }}
                    </el-tag>
                    <el-tag v-if="scope.row.status == 'DRAF'">{{ dicForValue(scope.row) }}</el-tag>
                    <el-tag type="danger" v-if="scope.row.status == 'EXAMINE_FAIL' || scope.row.status == 'ACCEPT_FAIL'">
                      {{ dicForValue(scope.row) }}
                    </el-tag>
                    <el-tag type="warning" v-if="scope.row.status == 'EXAMINE_WAIT' || scope.row.status == 'ACCEPT_WAIT'">
                      {{ dicForValue(scope.row) }}
                    </el-tag>
                  </template>
                </el-table-column>
                <el-table-column prop="version" label="事项版本" width="100px" align="center" show-overflow-tooltip>
                </el-table-column>
                <el-table-column label="是否已关联" width="100px" align="center" show-overflow-tooltip>
                  <template slot-scope="scope">
                    <el-tag type="success" v-if="scope.row.proCode">已关联</el-tag>
                    <el-tag type="warning" v-else-if="!scope.row.proCode">未关联</el-tag>
                  </template>
                </el-table-column>
                <el-table-column label="操作" align="right" width="300">
                  <template slot-scope="scope">
                    <el-button type="text" @click="relatedMainItems(scope.row)">关联省主事项</el-button>
                    <el-button type="text" v-if="scope.row.proCode" @click="relatedSubItems(scope.row)">关联省子事项</el-button>
                    <el-button type="text" v-if="scope.row.proCode" @click="delReItem(scope.row)">取消关联</el-button>
                  </template>
                </el-table-column>
              </el-table>
<!--              <div class="block">-->
<!--                <el-pagination @current-change="handleCurrentChange" :current-page.sync="itemParams.page"-->
<!--                               :page-size="itemParams.limit" layout="total,prev, pager, next, jumper"-->
<!--                               :total="itemParams.total">-->
<!--                </el-pagination>-->
<!--              </div>-->
            </el-tab-pane>
            <el-tab-pane label="省级事项" name="provincial">
              <el-table :data="proData" style="width: 100%" :height="tableHeight" class="qz-table-hide">
                <el-table-column type="index" label="序号" width="50"></el-table-column>
                <el-table-column prop="code" label="事项编码" show-overflow-tooltip></el-table-column>
                <el-table-column prop="name" label="事项名称" show-overflow-tooltip></el-table-column>
                <el-table-column prop="affairStatus" label="事项状态" width="100px" align="center" show-overflow-tooltip>
                  <template slot-scope="scope">
                    <el-tag v-if="scope.row.affairStatus == '6'">在用</el-tag>
                  </template>
                </el-table-column>
                <el-table-column prop="version" label="事项版本" width="100px" align="center" show-overflow-tooltip>
                </el-table-column>
                <el-table-column label="关联状态" width="100px" align="center" show-overflow-tooltip>
                  <template slot-scope="scope">
                    <el-tag type="success" v-if="scope.row.status == '2'">已关联</el-tag>
                    <el-tag type="warning" v-else>未关联</el-tag>
                  </template>
                </el-table-column>
                <el-table-column label="操作" align="right" width="100">
                  <template slot-scope="scope">
                    <el-button type="text" @click="viewItem(scope.row)">查看省事项</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-tab-pane>
          </el-tabs>
          <div class="block">
            <el-pagination @current-change="handleCurrentChange" :current-page.sync="itemParams.page"
                           :page-size="itemParams.limit" layout="total,prev, pager, next, jumper"
                           :total="itemParams.total">
            </el-pagination>
          </div>
        </div>
      </el-card>
    </div>
    <el-dialog title="市省对比"
               :visible="relatedMainItemsDialog"
               :close-on-click-modal=false
               @close="handleClose"
               width="65%"
               append-to-body
               class="qz-dialog-padding">
      <CityCompare :relatedData="relatedData" v-if="relatedMainItemsDialog"  ref="cityCompare" :id="id" :itemId="itemId" @close="close" @reload="reload"></CityCompare>
      <span slot="footer" class="dialog-footer">
        <template>
          <el-button @click="relatedMainItemsDialog=false">取消</el-button>
          <el-button type="primary" @click="submit">确定</el-button>
        </template>
      </span>
    </el-dialog>
    <el-dialog
        title="关联子事项"
        :visible.sync="relatedSubItemsDialog"
        :close-on-click-modal=false
        width="70%"
        class="qz-dialog-padding" append-to-body>
      <div class="reChild">
        <div>已关联省主事项名称：{{proName}}</div>
        <el-button size="mini" @click="show = true">关联子事项</el-button>
      </div>
      <el-table :data="relatedData" style="width: 100%" height="300px" class="qz-table-hide">
        <el-table-column type="index" label="序号" width="50"></el-table-column>
        <el-table-column prop="proName" label="事项名称" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="proCode" label="事项编码" show-overflow-tooltip></el-table-column>
        <el-table-column label="操作" align="right" width="100">
          <template slot-scope="scope">
            <el-button type="text" @click="remove(scope.row)">取消关联</el-button>
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <template>
          <el-button @click="relatedSubItemsDialog=false">取消</el-button>
        </template>
      </span>
    </el-dialog>
    <el-dialog
        title="子事项"
        :visible.sync="show"
        :close-on-click-modal=false
        width="70%"
        class="qz-dialog-padding" append-to-body>
<!--      @getSelectInfo="getSelectInfo"-->
      <ProvinceSelect ref="relationItem" v-if="show" :relatedData="relatedData" :type="'children'" @selectChange="selectChange"></ProvinceSelect>
      <span slot="footer" class="dialog-footer">
        <template>
          <el-button @click="show=false">取消</el-button>
          <el-button type="primary" @click="subConfirm">确定</el-button>
        </template>
      </span>
    </el-dialog>
    <el-dialog
        title="省事项已关联事项"
        :visible.sync="provincialDialog"
        :close-on-click-modal=false
        width="70%"
        class="qz-dialog-padding" append-to-body>
      <div class="proTitle">
        主事项关联市事项列表
      </div>
      <el-table :data="provincialInfoData.main" style="width: 100%" height="300px" class="qz-table-hide">
        <el-table-column type="index" label="序号" width="50"></el-table-column>
        <el-table-column prop="itemName" label="事项名称" show-overflow-tooltip></el-table-column>
        <el-table-column prop="itemCode" label="事项编码" show-overflow-tooltip></el-table-column>
        <el-table-column prop="status" label="事项状态" width="100px" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <el-tag type="success"
                    v-if="scope.row.status == 'EXAMINE_SUCCESS' || scope.row.status == 'PUBLISH' || scope.row.status == 'DISCARD'">
              {{ dicForValue(scope.row) }}
            </el-tag>
            <el-tag v-if="scope.row.status == 'DRAF'">{{ dicForValue(scope.row) }}</el-tag>
            <el-tag type="danger" v-if="scope.row.status == 'EXAMINE_FAIL' || scope.row.status == 'ACCEPT_FAIL'">
              {{ dicForValue(scope.row) }}
            </el-tag>
            <el-tag type="warning" v-if="scope.row.status == 'EXAMINE_WAIT' || scope.row.status == 'ACCEPT_WAIT'">
              {{ dicForValue(scope.row) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="version" label="事项版本" width="100px" align="center" show-overflow-tooltip>
        </el-table-column>
      </el-table>
      <div class="proTitle">
        子事项关联市事项列表
      </div>
      <el-table :data="provincialInfoData.minor" style="width: 100%" height="300px" class="qz-table-hide">
        <el-table-column type="index" label="序号" width="50"></el-table-column>
        <el-table-column prop="itemName" label="事项名称" show-overflow-tooltip></el-table-column>
        <el-table-column prop="itemCode" label="事项编码" show-overflow-tooltip></el-table-column>
        <el-table-column prop="status" label="事项状态" width="100px" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <el-tag type="success"
                    v-if="scope.row.status == 'EXAMINE_SUCCESS' || scope.row.status == 'PUBLISH' || scope.row.status == 'DISCARD'">
              {{ dicForValue(scope.row) }}
            </el-tag>
            <el-tag v-if="scope.row.status == 'DRAF'">{{ dicForValue(scope.row) }}</el-tag>
            <el-tag type="danger" v-if="scope.row.status == 'EXAMINE_FAIL' || scope.row.status == 'ACCEPT_FAIL'">
              {{ dicForValue(scope.row) }}
            </el-tag>
            <el-tag type="warning" v-if="scope.row.status == 'EXAMINE_WAIT' || scope.row.status == 'ACCEPT_WAIT'">
              {{ dicForValue(scope.row) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="version" label="事项版本" width="100px" align="center" show-overflow-tooltip>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <template>
          <el-button @click="provincialDialog=false">取消</el-button>
        </template>
      </span>
    </el-dialog>
    <search-dept :chooseDeptDialog="chooseDeptDialog" :isSzsType="true" :isCheckbox="false" :regionDisabled="false" :chooseDeptData="{}" :type="false" @closeDialog="closeDialog" @confirm="chooseConfirm"></search-dept>

  </div>
</template>

<script>
import qzBase from '@_src/pages/mssq/common/util/qzBase';
import CityCompare from './compare';
import ProvinceSelect from './list-select';
import SearchDept from "../../components/searchDept";

export default {
  name: "list",
  mixins: [qzBase],
  components: {CityCompare,ProvinceSelect,SearchDept},
  data() {
    return {
      activeName:'municipal',
      fieldData: {
        itemName: {
          label: '事项名称',
          type: 'Input',
          placeholder: '请输入事项名称',
          value: '',
          span: 8,
          itemWidth: '100px',
        },
        itemCode: {
          label: '事项编码',
          type: 'Input',
          placeholder: '请输入事项编码',
          value: '',
          span: 8
        },
        status: {
          label: '事项状态',
          type: 'Select', //类型
          placeholder: '请选择事项状态',
          value: '',
          span: 8, //布局比例
          selectList: [],
        },
        deptId: {
          label: '实施部门名称',
          type: 'inputSelect', //类型
          placeholder: '请选择实施部门名称',
          value: '',
          span: 0, //布局比例
          selectList: []
        },
        deptName: {
          label: '实施部门',
          type: 'inputSelect', //类型
          placeholder: '请选择实施部门名称',
          value: '',
          notSearch:true,
          span: 8, //布局比例
          selectList: []
        },
        isGl: {
          label: '关联状态',
          type: 'Select',
          placeholder: '请选择关联状态',
          value: '1',
          span: 8,
          itemWidth: '100px',
          selectList: [{
            name:'全部',
            id:''
          },{
            name:'未关联',
            id:'0'
          },{
            name:'已关联',
            id:'1'
          }]
        },
        Button: {
          type: 'Button',
          span: 8
        }
      },
      fieldProData: {
        name: {
          label: '事项名称',
          type: 'Input',
          placeholder: '请输入事项名称',
          value: '',
          span: 8,
          itemWidth: '100px',
        },
        code: {
          label: '事项编码',
          type: 'Input',
          placeholder: '请输入事项编码',
          value: '',
          span: 8
        },
        Button: {
          type: 'Button',
          span: 8
        }
      },
      chooseDeptDialog:false,
      dictMap: {},
      id: '',
      itemId: '',
      relatedMainItemsDialog: false,
      provincialDialog: false,
      relatedSubItemsDialog: false,
      relatedData: [],
      show: false,
      busiType: [],
      tableData: [],
      tabPosition: 'top',
      proName: '',
      proData:[],
      itemParams: {
        page: 1,
        limit: 10,
        total: 0
      },
      page: 1,
      limit: 10,
      total: 0,
      formInline: {
        isGl: 1,
        itemName: '',
        itemCode: '',
        status: '',
        manageType: '',
      },
      tableHeight: 100,
      item_menu: {
        height: ''
      },
      bgC: '',
      itemData: {},
      textC: '',
      itemLimit: 1000,
      exportData: [],
      provincialInfoData: {
        main:[],
        minor:[]
      },
      loading: false,
      exportIndex: [],
    }
  },
  watch: {
    itemStatus: {
      handler(val) {
        let arr = [];
        if(val.length < 0)return
        for (let i = 0; i < val.length; i++) {
          arr.push({
            name: val[i].itemValue,
            id: val[i].itemCode,
          })
        }
        this.fieldData.status.selectList = arr;
      }
    },
  },
  mounted() {
    //表格高度自适应
    // let _this = this;
    if(this.$route.path != this.$store.getters.searchParams.path) this.$store.dispatch("setSearchParams", {});
    if (!this.isEmptyObject(this.$store.getters.searchParams.data)) {
      this.$nextTick(() => {
        this.fieldData.deptId.selectList.push({
          name: this.$store.getters.searchParams.data.deptName,
          id: this.$store.getters.searchParams.data.deptId
        });
        console.log(this.$store.getters.searchParams.data.deptName)
        debugger
        // this.activeName = this.$store.getters.searchParams.regionCode;
        this.$refs.srarch.update('isGl', this.$store.getters.searchParams.data.isGl,false);
        this.$refs.srarch.update('status', this.$store.getters.searchParams.data.status,false);
        this.$refs.srarch.update('itemName', this.$store.getters.searchParams.data.itemName,false);
        this.$refs.srarch.update('deptId', this.$store.getters.searchParams.data.deptId,false);
        this.$refs.srarch.update('deptName', this.$store.getters.searchParams.data.deptName,false);
        this.$refs.srarch.update('itemCode', this.$store.getters.searchParams.data.itemCode,false);
        this.formInline = this.$store.getters.searchParams.data;
        this.itemParams = this.$store.getters.searchParams.data;
        this.onQuery(this.formInline , this.itemParams);
        this.$store.dispatch("setSearchParams", {});
      })
    }else{
      var pageParam = this.itemParams
      var searchParam = this.formInline
      this.onQuery(pageParam, searchParam);
      this.fieldData.deptId.selectList.push({
        name: this.$store.getters.curUser.attrMap.SELF_DEPT_NAME,
        id: this.$store.getters.curUser.attrMap.SELF_DEPT_ID
      });
    }
    this.$nextTick(() => {
      this.tableHeight = this.$refs.tableH.offsetHeight - 280;
    });
    window.onresize = () => {
      return (() => {
        this.tableHeight = this.$refs.tableH.offsetHeight - 280;
      })();
    };
    //加载字典
    this.queryDictMap("BUSI_TYPE,BUSI_GROUP,ITEM_STATUS,MANAGE_TYPE,REGION,ITEM_TYPE", (res) => {
      this.dictMap = res
    });
  },
  methods: {
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      this.relatedMainItemsDialog = false
    },
    onQuery(pageParam, searchParam) {
      var url = this.Config.baseContext + "/mssq/mssqItemIndex/integratedQuery";
      var param = Object.assign({}, pageParam, searchParam);
      this.$http_post(url, param).then(ret => {
        if (ret.state == 1) {
          this.tableData = ret.rows;
          this.itemParams.total = ret.records;
          localStorage.setItem('total', ret.records);
        } else {
          this.$message.error(ret.message);
        }
      });
    },
    getProData(pageParam,searchParam){
      var url = this.Config.baseContext + "/mssq/mssqEtlItem/selectProIcityList";
      var param = Object.assign({}, pageParam, searchParam);
      this.$http_post(url, param).then(ret => {
        if (ret.state == 1) {
          this.proData = ret.rows;
          this.itemParams.total = ret.records;
          localStorage.setItem('total', ret.records);
        } else {
          this.$message.error(ret.message);
        }
      });
    },
    handleClick(val){
      this.itemParams= {
        page: 1,
        limit: 10,
        total: 0,
        deptId: '',
        deptName: '',
      }
      var pageParam = this.itemParams;
      var searchParam = this.formInline;
      if(val.name == 'provincial'){
          this.getProData(pageParam,searchParam);
      }else{
        this.onQuery(pageParam,searchParam);
      }
    },
    remove(row){
      this.$confirm('是否取消省事项【'+row.proName+'】子关联', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        var delPro = this.Config.baseContext + "/mssq/mssqEtlItem/delPro";
        this.$http_post(delPro, {
          icityProId: row.id
        }).then(ret => {
          if (ret.state == 1) {
            this.relatedList(row);
            this.$message.success('取消关联成功')
          }
        })
      })
    },
    onEditItem(id, type) {
      //转跳事项梳理页面
      console.log(this.formInline)
      this.$store.dispatch("setSearchParams",{path:this.$route.path,data:Object.assign(this.formInline,
            {page:this.itemParams.page,limit:this.itemParams.limit})});
      this.$router.push({
        path: '/item/info',
        query: {
          id: id,
          type: type
        }
      });
    },
    chooseDept() {
      this.chooseDeptDialog = true;
    },
    exportCityData(){
      var pageParam = this.itemParams;
      var searchParam = this.formInline;
      var url = this.Config.baseContext + "/mssq/mssqItemIndex/icityProExport";
      var param = Object.assign({}, pageParam, searchParam);
      this.$http_post(url, Object.assign({}, {}, param), null, 'blob').then(ret => {
        if (ret.type == 'application/json') {
          const reader = new FileReader(); //创建一个FileReader实例
          reader.readAsText(ret, 'utf-8'); //读取文件,结果用字符串形式表示
          reader.onload = function () { //读取完成后,**获取reader.result**
            const msg = JSON.parse(reader.result);
            this.$message.error(msg.message); //弹出错误提示
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
        let fileName = '省市关联清单' + t + '.xlsx';
        a.download = fileName;
        a.click();
        this.visible = false;
        this.$message.success('导出成功');
        this.loading = false;
      });
    },
    chooseConfirm(val){
      let arr = [];
      arr.push(val);
      this.fieldData.deptId.selectList = arr;
      this.fieldData.deptName.selectList = arr;
      this.$refs.srarch.update('deptId', val.id, true);
      this.$refs.srarch.update('deptName', val.name, false);
      this.closeDialog();
    },
    closeDialog(){
      this.chooseDeptDialog = false;
    },
    submit() {
      this.$refs.cityCompare.associationItem();
    },
    handleCurrentChange(val) {
      this.itemParams.page = val;
      var pageParam = this.itemParams;
      var searchParam = this.formInline;
      if(this.activeName == 'provincial'){
        this.getProData(pageParam,searchParam);
      }else{
        this.onQuery(pageParam,searchParam);
      }
    },
    selectChange(){

    },
    reload() {
      this.itemParams = {
        page: 1,
        total: 0,
        limit: 10
      };
      var pageParam = this.itemParams
      var searchParam = this.formInline
      if(this.activeName == 'provincial'){
        this.getProData(pageParam,searchParam);
      }else{
        this.onQuery(pageParam,searchParam);
      }
    },
    searchClick(val) {
      this.formInline = {
        isGl: val.isGl.value,
        status: val.status.value,
        itemName: val.itemName.value,
        itemCode: val.itemCode.value,
        isDiscard: 0,
      };
      if(this.activeName === 'municipal'){
        this.formInline.deptId = val.deptId.value;
        for (let i = 0; i < val.deptId.selectList.length; i++) {
          if( val.deptId.value === val.deptId.selectList[i].id){
            this.formInline.deptName = val.deptId.selectList[i].name
          }
        }
      }
      this.reload();
    },
    searchProClick(val) {
      this.formInline = {
        name: val.name.value,
        code: val.code.value,
      };
      this.reload();
    },
    exportList() {
      this.confirm({
        value: 1
      })
    },
    confirm(item, index) {
      let _this = this;
      const rLoading = this.openLoading('实施清单导出中，请稍等');
      this.loading = true;
      var url = this.Config.baseContext + "/mssq/mssqItemIndex/implementExport";
      this.$http_post(url, Object.assign({}, {}, this.formInline), null, 'blob').then(ret => {
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
        console.log(url)
        a.href = url;
        //设置文件名称
        var t = this.formatDate(new Date().getTime(), 'yyyyMMddHHmmss');
        let fileName = '实施清单' + t + '.xlsx';
        a.download = fileName;
        a.click();
        this.visible = false;
        this.$message.success('导出成功');
        this.loading = false;
      });
    },
    formatterState(row) {
      if ((!this.isEmptyObject(this.dictMap.ITEM_STATUS)) && this.dictMap.ITEM_STATUS.length > 0) {
        for (let i = 0; i < this.dictMap.ITEM_STATUS.length; i++) {
          if (this.dictMap.ITEM_STATUS[i].itemCode == row.status) {
            if(row.version > 1.0){
              return this.dictMap.ITEM_STATUS[i].itemCode == 'DRAF'? this.dictMap.ITEM_STATUS[i].itemValue+'（变更中）':this.dictMap.ITEM_STATUS[i].itemValue
            }
            return this.dictMap.ITEM_STATUS[i].itemCode == 'DRAF'? this.dictMap.ITEM_STATUS[i].itemValue:this.dictMap.ITEM_STATUS[i].itemValue
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
        return 'rgba(' + sColorChange.join(',') + ',' + alpha + ')'
      } else {
        return sColor
      }
    },
    //事项状态展示
    dicForValue(row) {
      var status = row.status;
      var statusDict = this.dictMap['ITEM_STATUS'];
      for (var i = 0; i < statusDict.length; i++) {
        if (statusDict[i].itemCode == status) {
          return statusDict[i].itemValue;
        }
      }
      return "";
    },
    //关联省主事项
    relatedMainItems(row){

      this.relatedMainItemsDialog = true;
      this.id = row.itemVid
      this.itemId = row.itemId
    },
    close(){
      this.relatedMainItemsDialog = false;
      this.id = '';
    },
    //关联省子事项
    relatedSubItems(row){
      this.proName = row.proName
      this.itemData = row
      this.relatedSubItemsDialog = true;
      this.relatedList(row);
    },
    delReItem(row){
      var url = this.Config.baseContext + "/mssq/mssqEtlItem/selectInfo";
      this.$http_post(url, {
        itemId:row.itemId
      }).then(ret => {
        if(ret.state == 1){
          if(ret.rows.length<=0){
            this.$confirm('是否取消关联主事项【'+row.proName+'】', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              var delPro = this.Config.baseContext + "/mssq/mssqEtlItem/proIcityCancelAssociat";
              this.$http_post(delPro, {
                itemVid: row.itemVid
              }).then(ret => {
                if (ret.state == 1) {
                  var pageParam = this.itemParams
                  var searchParam = this.formInline
                  this.onQuery(pageParam,searchParam);
                  this.$message.success('取消关联成功')
                }
              })
            })
          } else{
            this.$message.warning('当前事项已关联省子事项，请先取消省子事项关联再取消省主事项关联')
          }
        }else{
          this.$message.error(ret.message)
        }
      });
    },
    relatedList(row){
      var url = this.Config.baseContext + "/mssq/mssqEtlItem/selectInfo";
      this.$http_post(url, {
        itemId:row.itemId
      }).then(ret => {
        if(ret.state == 1){
          this.relatedData = ret.rows;
        }
      });
    },
    subConfirm(){
      this.$refs.relationItem.save( this.itemData,(v)=>{
        if(v === true){
          this.relatedList(this.itemData);
          this.show = false;
          this.$message.success('子事项关联成功')
        }else{
          this.$message.error(v)
        }
      });
    },
    viewItem(row){
      this.provincialDialog = true;
      this.provincialInfo(row)
    },
    provincialInfo(row){
      var url = this.Config.baseContext + "/mssq/mssqEtlItem/selectProIcityInfo";
      this.$http_post(url, {
        proCode:row.code
      }).then(ret => {
        if(ret.state == 1){
          this.provincialInfoData = ret.row;
        }
      });
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
    itemStatus() {
      let arr = [];
      if ((!this.isEmptyObject(this.dictMap.ITEM_STATUS)) && this.dictMap.ITEM_STATUS.length > 0) {
        for (let i = 0; i < this.dictMap.ITEM_STATUS.length; i++) {
          if (this.dictMap.ITEM_STATUS[i].itemCode == 'DRAF' ||
              this.dictMap.ITEM_STATUS[i].itemCode == 'ACCEPT_WAIT' ||
              this.dictMap.ITEM_STATUS[i].itemCode == 'PUBLISH' ||
              this.dictMap.ITEM_STATUS[i].itemCode == 'DISCARD' ||
              this.dictMap.ITEM_STATUS[i].itemCode == 'DISCARD_WAIT' ||
              this.dictMap.ITEM_STATUS[i].itemCode == 'ACCEPT_FAIL' ||
              this.dictMap.ITEM_STATUS[i].itemCode == 'EXAMINE_WAIT' ||
              this.dictMap.ITEM_STATUS[i].itemCode == 'EXAMINE_SUCCESS' ||
              this.dictMap.ITEM_STATUS[i].itemCode == 'EXAMINE_FAIL' ||
              this.dictMap.ITEM_STATUS[i].itemCode == 'DISCARD_FAIL') {
            arr.push(this.dictMap.ITEM_STATUS[i])
          }
        }
      }
      return arr;
    },
  },
  destroyed() {
    window.onresize = null;
  }
}
</script>
<style lang='less' scoped>
.cardView {
  position: relative;
  height: 100%;
  background: #f8f8f8;
  display: flex;
  flex-direction: column;

  .el-col {
    .form-btn {
      padding-left: 20px;
      text-align: end;

      /deep/ .el-form-item__content {
        /*display: flex;*/
        text-align: center;
        /*justify-content: end;*/
        /*justify-content: space-between;*/

        div {
          margin-right: 20px;
        }
      }
    }

    .el-select {
      width: 100%;
    }
  }

  .view {
    //display: flex;
    //flex: 1;
    //height:calc(100% - 200px);
    .box-left {
      width: 200px;
      border: none;
      height: 100%;
      background: #fff;
      margin-right: 10px;
      /deep/ .el-card__header {
        padding: 14px 10px;
      }
      .title {
        width:100%;
        display:flex;
        align-items: center;
        justify-content: space-between;
        .left{
          display: flex;
          align-items: center;
          .icon {
            width:14px;
            height:14px;
            border-radius:50%;
            background:#3D91F7;
            display:flex;
            justify-content: center;
            align-items: center;
            margin-right:4px;
            i{
              color:#fff;
              font-size:12px;
            }
          }
          span{
            font-size:14px;
          }
        }
      }
      /deep/ .el-card__body {
        padding: 0;
        height:calc(100% - 50px);
        overflow-y: auto;
        .item {
          overflow: auto;
          /*overflow: auto;*/
          height:100%;
          display: flex;
          flex-direction: column;
          height: 100%;
          background:#fff;
        }
      }
    }

    .box-right {
      border: none;
      border-radius: 0;
      display: inline-block;
      width: 100%;

      /deep/ .el-card__body {
        padding: 0;
        height:calc(100%);
        &>.item{
          overflow: auto;
          height:calc(100% + 2px);
          display: flex;
          flex-direction: column;
          //height: calc(100%);
          background:#fff;
          padding:0px 14px;
          .el-tabs{
            height: 100%;
          }
          .block{
            padding:10px 0;
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

  /deep/ .el-menu-item.is-active {}
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

.export {
  margin-left: 10px;
}

.addCatalog {
  padding-left: 10px;
  /*position: absolute;*/
  /*right: 0;*/
}
.search-box {
  background: #fff;
  margin-bottom: 10px;
  width: 100%;
  /*display: flex;*/
  padding: 10px 14px 0 14px;
}
.popover{
  padding-left: 10px;
}
.reChild{
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 10px;
}
.proTitle{
  font-size: 16px;
  font-weight: 700;
  text-decoration: none;
  padding: 10px 0;
  color: #303133;
}
.downLoad {
  padding-left: 10px;
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
</style>
