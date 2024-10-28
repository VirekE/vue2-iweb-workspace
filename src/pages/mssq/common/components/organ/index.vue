<template>
  <el-dialog :title="head" width="30%" :close-on-click-modal=false :visible.sync="visible" v-if="visible" class="qz-dialog-padding">
    <el-tree v-loading="loading" lazy :load="loadNode" show-checkbox :props="defaultProps" ref="tree" :default-checked-keys="defulatChooseId"
             node-key="id" :check-strictly="checkStrictly" :default-expanded-keys="expanded"
             @check-change="handleCheckChange" @node-click="handleNodeClick"></el-tree>
    <span slot="footer" class="dialog-footer">
        <el-button @click="__onCancelClick">{{btnCancelText}}</el-button>
        <el-button type="primary" @click="__onOkClick">{{btnOkText}}</el-button>
      </span>
  </el-dialog>
  <!--  :data="treeData"-->
</template>
<script>
  import qzBase from '@_src/pages/mssq/common/util/qzBase';

  const defaults = {
    // 标题
    head: '办理意见',
    // 内容
    isCheckbox: false,
    // 确认按钮文字
    btnOkText: '确认',
    // 取消按钮文字
    btnCancelText: '取消',
    // 显示状态
    visible: false,
    // 确认按钮
    onOkClick: null,
    // 取消按钮
    onCancelClick: null,
    msgStyle: null,
    isRegion: false,
    regionDisabled: false,
    checkStrictly: true,
    expanded: [''],//默认选中值,
    rootCode: '',//默认获取深圳市的所有机构
    deptId: '',//部门id
    type: 'organ',
    removeCode: '',//移除哪个部门，逗号隔开
    removeks: '',//移除科室
    isRadio: '',//移除科室
    chooseId:'0',
    chooseList:[],//选中节点
    isKs:false,//选中节点
  };

  export default {
    mixins: [qzBase],
    props: {},
    components: {},
    data() {
      return {
        ...defaults,
        treeData: [],
        loading: false,
        defaultProps: {
          children: 'children',
          label: 'name',
          disabled: this.disabledFn,
        },
        selectRow: {},
        selectRows: [],
        regionData: [],
        defulatChooseId: [],
        arrList: [],
        // chooseId: 0,
      };
    },
    watch:{
      visible(val){
        if(val){
          console.log(this.chooseList)
          this.arrList = JSON.parse(JSON.stringify(this.chooseList));
        }
      }
    },
    computed: {

    },
    methods: {
      show(options = {}) {
        if (typeof options === 'string') {
          options = {msg: options};
        }
        if (this.isNotNull(options.rootCode) && this.isEmptyObject(options.expanded)) {
          options.expanded = [options.rootCode];//默认展开根节点
        }
        options = {...defaults, ...options};
        const {head, isCheckbox, btnOkText, btnCancelText, withMask, onOkClick, onCancelClick, msgStyle, expanded, rootCode, removeCode, removeks, isRegion, regionDisabled, checkStrictly, type,chooseId , chooseList,isKs} = options;
        let that = this;
        this.visible = true;
        this.head = head;
        this.isCheckbox = isCheckbox;
        this.btnOkText = btnOkText;
        this.btnCancelText = btnCancelText;
        this.withMask = withMask;
        this.onOkClick = onOkClick;
        this.onCancelClick = onCancelClick;
        this.msgStyle = msgStyle;
        this.expanded = expanded;
        this.rootCode = rootCode;
        this.type = type;
        this.removeCode = removeCode;
        this.removeks = removeks;
        this.isRegion = isRegion;
        this.regionDisabled = regionDisabled;
        this.checkStrictly = checkStrictly;
        this.chooseId = chooseId;
        this.chooseList = chooseList;
        this.isKs = isKs;
        // this.getOrganTree();
      },
      hide() {
        this.visible = false;
      },

      __onOkClick() {
        this.hide();
        if (this.isCheckbox) {
          var array = this.selectRows;
          var resultList = []
          for (var i = 0; i < array.length; i++) {
            var item = {};
            if(typeof array[i] != 'object'){
              item.id = array[i]
            }else{
              item = array[i]
            }
            var obj = {
              name: item.name,
              code: item.creditCode,
              id: item.id,
              regionName: item.areaName,
              regionCode: item.areaCode,
              type: item.deptType
            };
            resultList.push(obj)
          }
          this.onOkClick && this.onOkClick(resultList);
        } else {
          var item = this.selectRow;
          var obj = {
            name: item.name,
            code: item.creditCode,
            id: item.id,
            regionName: item.areaName,
            regionCode: item.areaCode,
            type: item.deptType
          };
          this.onOkClick && this.onOkClick(obj);
        }

      },
      __onCancelClick() {
        this.hide();
        this.onCancelClick && this.onCancelClick();
      },

      getOrganTree(callback) {
        var params = {'regionCode': this.rootCode, 'id': this.chooseId};
        this.loading = true;
        let type = this.type;
        // var url = this.Config.baseContext+'/mssq/pmi/getDeptList';
        var url = this.Config.baseContext + '/mssq/pmi/getDeptListNew';
        this.$http_post(url, params).then((ret) => {
          if (ret.state == 1) {
            for (let i = 0; i < ret.rows.length; i++) {
              // if(!ret.rows[i].creditCode){ret.rows[i].creditCode = ''};
            }
            callback(ret);
            // rLoading.close();
            this.loading = false;
          } else {
            this.loading = false;
            // rLoading.close();
            this.$message.error(ret.message);
          }
        });
      },
      loadNode(node, resolve) {
        if (node.data && node.data.id) {
          this.chooseId = node.data.id;
          this.rootCode = '';
        }
        if(!this.isKs){
          if(node.data &&((node.data.deptType == '2' && node.data.deptLevel == '4' && node.data.areaCode== '440301')||
            (node.data.deptType == '2' && node.data.deptLevel == '6' && node.data.areaCode !== '440301'))){resolve([]);return}
        }
        //440301为深圳市市辖区节点的区划编码，如果他的deptType为部门（2）并且级别为科室（4）点击下箭头不获取接口
        //当前点击部门的区划编码部位440301的时候，如果他的deptType为部门（2）并且级别为科室（6）点击下箭头不获取接口
        this.getOrganTree((res) => {
          if (res.state == 1) {
            // let regionData = res.rows;
            this.regionData = res.rows;
            this.chooseChange();
            resolve(this.regionData);
          } else {
            this.$message.error(res.message);
            resolve([]);
          }
        })
      },
      onQuery() {

      },
      chooseChange(){
        if(this.isNotNull(this.chooseList)){
          for (let i = 0; i < this.chooseList.length; i++) {
            this.defulatChooseId.push(this.chooseList[i]);
          }
        }else{
          this.defulatChooseId = [];
        }
      },
      disabledFn(data, node) {
        if (this.regionDisabled) {
          if (data.deptType === '2') {  //
            if(data.deptLevel == '2' || data.deptLevel == '4' ||data.deptLevel == '6'){
              return true
            }
            return false;
          } else {
            return true;
          }
        }
      },
      handleNodeClick(currentVal) {
        // this.selectRow = currentVal;
      },
      handleCheckChange(currentVal, checked, node) {
        if (!this.isCheckbox) {//单选
          if (checked) { //选中一个
            this.$refs.tree.setCheckedKeys([currentVal.id]);
          } else {//取消（反选）
            this.selectRow = {};
          }
          var selectDate = this.$refs.tree.getCheckedNodes(false, true)
          if (selectDate.length != 0) {
            this.selectRow = selectDate[0];
          }
        } else {
          let flag = -1;
          console.log(this.arrList)
          for (let i = 0; i < this.arrList.length; i++) {
            if(this.arrList[i].id == currentVal.id || this.arrList[i] == currentVal.id){
              flag = i
            }
          }
          console.log(flag)
          if(flag == -1){
            console.log(1111)
            this.arrList.push(currentVal);
          }else{
            this.arrList.splice(flag,1)
          }
          this.selectRows = this.arrList
         console.log(this.selectRows);
          // console.log(currentVal,this.chooseList)

          // this.selectRows = this.$refs.tree.getCheckedNodes(false, true);
        }
      }
    },
    mounted() {

    }
  };
</script>
