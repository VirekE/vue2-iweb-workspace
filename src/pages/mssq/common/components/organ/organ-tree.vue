<template>
    <div>
        <el-tree v-loading="loading" :style="treeStyle" lazy :load="loadNode" :expand-on-click-node="clickNodeExpand" :show-checkbox="isCheck" :props="defaultProps" ref="tree"
      node-key="id" :check-strictly="isCheckStrictly" :default-expanded-keys="expandKeys" :default-checked-keys="checkedKeys"
      @check-change="handleCheckChange" @node-click="handleNodeClick"></el-tree>
    </div>
</template>
<script>
  import qzBase from '@_src/pages/mssq/common/util/qzBase';

  export default {
    mixins: [qzBase],
    components: {
    },
    props: {
        type:{
            type: String,
            default: "",
        },
        treeStyle:{
            type: String,
            default: "",
        },
        clickNodeExpand:{
            type: Boolean,
            default: true,
        },
        isCheck: {
            type: Boolean,
            default: true,
        },
        isCheckbox: {
            type: Boolean,
            default: false,
        },
        isCheckStrictly: {
            type: Boolean,
            default: true,
        },
        isRegion: {
            type: Boolean,
            default: false,
        },
        regionDisabled: {
            type: Boolean,
            default: false,
        },
      //禁用类型
      disabledType: {
            type: String,
            default: '',
        } ,
        //禁用的项
        regionDisabledCode:{
            type:Array,
            default:()=>{
                return []
            }
        },
        //可办理区划禁用
        applyRegionDisabled:{
            type: Boolean,
            default: false
        },
        //区划为深圳市（440301）时是否展示区
        isSzsType:{
            type: Boolean,
            default: false
        },
        expanded:{//默认展开值
            type: Array,
            default:()=>{
                return []
            }
        },
        checkedKeys:{//默认选中
            type:Array,
            default:()=>{
                return []
            }
        },
        rootCode: {//默认获取深圳市的所有机构
            type: String,
            default: '',
        },
        removeCode: {
            type: String,
            default: ''
        },//移除哪个部门，逗号隔开
        flag:{
            type:Boolean,
            default:false
        },
        cityType:{//判断是否需要只展示市级要素
            type:Boolean,
            default:false
        },
      disabledNum:{//禁用的级别
            type:String,
            default:''
        },
      chooseData:{//选择数据
            type:Array,
            default:()=>[]
        }
    },
    data () {
      return {
          chooseId:0,
        treeData: [],
        defaultProps: {
          children: 'children',
          label: 'name',
          disabled: this.disabledFn,
        },
        selectRow: {},
        selectRows: [],
        loading:false,
      };
    },
    watch:{
      /*chooseData:{
        handler(val){
          this.$nextTick(()=>{
            this.$refs.tree.setCheckedKeys([])
            for (let i = 0; i < val.length; i++) {
            }
            console.log(val,123123123)
          })
        },
        deep:true,
        immediate: true
      }*/
    },
    computed: {
        expandKeys(){
            var rootCode = this.rootCode;
            var expanded = this.expanded;
            if(!this.isEmptyObject(this.expanded)){
                return expanded;
            }else if(this.isNotNull(rootCode)){
                return [rootCode]
            }else{
                return []
            }
        }
    },
    methods: {
      getOrganTree(callback,params){
            this.loading = true;
            // var url = this.Config.baseContext+'/mssq/pmi/getDeptList';
            var url = this.Config.baseContext+'/mssq/pmi/getDeptListNew';
            this.$http_post(url,params).then((ret)=>{
                this.loading = false;
                if(ret.state == 1){
                    callback(ret);
                    this.$emit('treeLoad');//一件事事项大厅列表初始化需要
                } else{
                    this.$message.error(ret.message);
                }
            });
        },
        loadNode(node, resolve) {
          let params = {'regionCode': this.rootCode,'id': this.chooseId}
            if (node.data && node.data.id) {
                this.chooseId = node.data.id;
                // this.rootCode = '';
                params={regionCode:'','id': this.chooseId}
            } else {
                this.getTreeParams = { parentId: '#' };
            }
            //440301为深圳市市辖区节点的区划编码，如果他的deptType为部门（2）并且级别为科室（4）点击下箭头不获取接口
            //当前点击部门的区划编码部位440301的时候，如果他的deptType为部门（2）并且级别为科室（6）点击下箭头不获取接口
            if(node.data &&((node.data.deptType == '2' && node.data.deptLevel == '4' && node.data.areaCode== '440301')||(node.data.deptType == '2' && node.data.deptLevel == '6' && node.data.areaCode !== '440301'))){resolve([]);return}
            this.getOrganTree((res) => {
                if (res.state == 1) {
                    let regionData = res.rows;
                    if(this.$store.getters.curUser.attrMap.REGION_CODE == '440301' && !this.isSzsType){
                        for (let i = 0; i < regionData.length; i++) {
                            if(regionData[i].name == '区'){
                                regionData.splice(i,1);
                            }
                        }
                    }
                    resolve(regionData);
                  // this.$nextTick(()=>{
                  //   for (let i = 0; i < this.chooseData.length; i++) {
                  //     this.$refs.tree.setChecked(this.chooseData[i].id,true)
                  //   }
                  // })
                } else {
                    this.$message.error(res.message);
                    resolve([]);
                }
            },params)
        },
        disabledFn(data, node) {
            if(this.regionDisabled){//是否开启禁用
                if (data.deptType === '2') {//数据为2，部门时不禁用
                    if(data.deptLevel == '2' || data.deptLevel == '4' ||data.deptLevel == '6'){
                        return true
                    }
                  return false;
                } else {//数据为1，区划时禁用区划
                  return true;
                }
            }else if(this.disabledType == '0'){
              if (data.deptType === '2') {//数据为2，部门时不禁用
                if(data.deptLevel == '3' || data.deptLevel == '5'){
                  return false
                }
                return true;
              } else {//数据为1，区划时禁用区划
                return true;
              }
            }else if(this.disabledType == '1'){
              if (data.deptType === '2') {//数据为2，部门时不禁用
                if((data.areaCode == '440301'&& data.deptLevel == '4') || data.deptLevel == '6'){
                  return false
                }
                return true;
              } else {//数据为1，区划时禁用区划
                return true;
              }
            }
        },
       formatResult(item){
         var obj = {
             name: item.name,
             code: item.creditCode,
             regionCode: item.areaCode,
             regionName: item.areaName,
             id: item.id,
             type: item.deptType
            };
           return obj;
       },
       getSelected(){
         if(this.isCheckbox){
            var array = this.selectRows;
            var resultList = []
            for(var i=0;i<array.length;i++){
                var item = array[i];
                var obj = {
                    name: item.name,
                    code: item.code,
                    shortName: item.shortName,
                    shortCode: item.shortCode,
                    parentCode: item.parentCode,
                    parentName: item.parentName,
                    regionCode: item.regionCode,
                    regionName: item.regionName,
                    topRegionCode: item.topRegionCode,
                    topRegionName: item.topRegionName,
                    type: item.type,
                    grade: item.grade
                }
                resultList.push(obj)
            }
            return resultList;
        }else{
           var item = this.selectRow;
            var obj = {
                name: item.name,
                code: item.code,
                shortName: item.shortName,
                shortCode: item.shortCode,
                parentCode: item.parentCode,
                parentName: item.parentName,
                regionCode: item.regionCode,
                regionName: item.regionName,
                topRegionCode: item.topRegionCode,
                topRegionName: item.topRegionName,
                type: item.type,
                grade: item.grade
            }
            return obj;
        }
       },
       handleNodeClick(currentVal){
           this.selectRow = currentVal;
           var item = currentVal;
           var obj = this.formatResult(currentVal);
           this.$emit('clickNode', obj);
           this.$emit('currentNode', currentVal);
       },

       handleCheckChange(currentVal,checked, node) {
           if(!this.isCheckbox){//单选
               if(checked){ //选中一个
                   this.$refs.tree.setCheckedKeys([currentVal.id]);
               }else{//取消（反选）
                   this.selectRow={};
               }
               var selectDate =  this.$refs.tree.getCheckedNodes(false,true)
               if(selectDate.length!=0){
                   var item = selectDate[0];
                   this.selectRow = item;
                   var obj = this.formatResult(item);
                   this.$emit('currentNode', item);
                   this.$emit('checkChange', obj,obj,item,checked);
               }
           }else{
                this.selectRow = currentVal;
                this.selectRows = this.$refs.tree.getCheckedNodes(false,true);
                var array = this.selectRows;

                var obj = this.formatResult(currentVal);
                var resultList = []
                for(var i=0;i<array.length;i++){
                    var item = array[i];
                    var obj = this.formatResult(item)
                    resultList.push(obj)
                }
               this.$emit('currentNode', currentVal);
               this.$emit('checkChange', resultList,obj,currentVal,checked);
           }
        },
        getAllParentData(data){
            let tree = this.$refs.tree;
            this.breadList = []; //初始化记录选中节点的所有父节点
            for(let i=0,len=data.length;i<len;i++){
                this.getTreeNode(tree.getNode(data[i]));
            }
            return this.breadList;
        },
        getTreeNode(node){
            if (node) {
                if (node.label !== undefined) {
                    this.breadList.unshift(node.data);
                    this.getTreeNode(node.parent);
                }
            }
        },
        checkAllSqOrgan(){
            var targetList = []
            this.getAllSqOrgan(this.treeData,targetList);
             this.$refs.tree.setCheckedNodes(targetList);
        },
        getAllSqOrgan(organList,targetList){
            for(var i=0;i<organList.length;i++){
                var item = organList[i];

                if(item.type == 'organ' && item.grade=='5'){
                    targetList.push(item)
                }else{
                    if(item.hasOwnProperty("children")){
                        var children = item.children
                        this.getAllSqOrgan(children,targetList)
                    }
                }

            }
        },
        clearSelect(){
            this.$refs.tree.setCheckedNodes([]);
        }
    },
    mounted(){
         // this.getOrganTree();
    }
  };
</script>
