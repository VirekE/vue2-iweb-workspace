<template>
  <div class="item" :class="JSON.stringify(itemInfo) == '{}'?'spacing':''">
    <base-info v-model="itemInfoData"  ref="ref1" :flag="flag" :type="'item'"></base-info>
    <power-info v-model="itemInfoData" ref="ref2" :type="'item'"></power-info>
    <div class="footer" style="text-align:center">
      <el-button @click="$router.go(-1)">返回</el-button>
      <el-button @click="save" type="primary">保存</el-button>
    </div>
  </div>
</template>

<script>
import BaseInfo from "./components/base-info";
import PowerInfo from "./components/power-info";
import qzBase from '@_src/pages/mssq/common/util/qzBase';


export default {
  name: "addItemInfo",
  components: {PowerInfo, BaseInfo},
  mixins: [qzBase],

  data(){
    return{
      isShow:false,
      flag:false,
      itemInfoData:{
        bllc:{
          bllcNote:'',
          bllct:[],

        },
        promiseProcess:{
          promiseProcessNote:'',
          promiseProcesst:[],
        }
      },
      itemButton:[],
      tagList:[],
      tagOptions:{
        url: '',
        method: "post",
        label: "name",
        value: 'id',
        search:'name',
        data:{
          rows: 100000
        }
      },
      chooseTagList:[],
    }
  },
  props:{
    itemInfo:{
      type: Object,
      default: () => {
        return {}
      }
    },
    type:{
      type:String,
      default:''
    },
  },
  watch:{
  },
  mounted(){
    this.queryDictMap('BUSI_TYPE,SSCJ,MANAGE_TYPE,SSZTXZ,DAY_TYPE,CZPL,CZPLCS,TASK_TYPE,ITEM_TYPE,TASK_OBJECT', res => {
      this.$store.dispatch("setDict", res);
    });
    if(this.$route.query.id){
      this.getData();
    }
    this.tagOptions.url = this.Config.baseContext + "/mssq/mssqLabel/getLabelList";
  },
  methods:{
    getData(){
      var url = this.Config.baseContext + "/check/mssqCheckIndex/getInfoById";
      // var param = Object.assign({}, pageParam, searchParam);
      this.$http_post(url, {
        id:this.$route.query.id
      }).then(ret => {
        if (ret.state == 1) {
          this.itemInfoData = ret.row;
          if(this.itemInfoData){
            this.itemInfoData.promiseProcess = JSON.parse(this.itemInfoData.promiseProcess);
            if(!this.itemInfoData.checkRequireFile){
              this.itemInfoData.checkRequireFile = [];
            }else{
              this.itemInfoData.checkRequireFile = JSON.parse(this.itemInfoData.checkRequireFile)
            }
          }
        } else {
          this.$message.error(ret.message);
        }
      });
    },
    getLabelInfo(row){
      let flag = -1;
      for (let i = 0; i <this.itemInfo.labelList.length ; i++) {
        if(this.itemInfo.labelList[i].id == row.id){
          flag = i;
        }
      }
      if(flag == -1){
        this.itemInfo.labelList.push(row);
      }else{
        this.itemInfo.labelList.splice(flag,1)
      }
    },
    goBack(){
      this.$router.go(-1);
    },
    upDate(){
      this.$emit('itemInfoData', this.itemInfoData)
    },
    validate(index,callback){
      this.$refs['ref' + index].validate(e=>{
        if (e) {
          if(index == 2 || this.$route.query.type== 'overAll'){
            callback(e);
          }else{
            this.validate(++index ,callback)
          }
        }else{
          this.$message.error('请检查必填项');
        }
      })
    },
    clickListener(e) {
      let dom = this.$refs.editArea
      if (dom && !dom.contains(e.target)) {
        this.blur()
      }
    },
    changeSelect(){
      if(!this.flag){
        this.isShow = !this.isShow;
        document.addEventListener('click', this.clickListener, true)
      }
    },
    blur(){
      if (typeof this.$listeners.blur === "function") {
        this.$emit("blur", () => {
          this.isShow = false
        }, this.value)
      } else {
        this.isShow = false
      }
    },
    remove(val){
      for (let i = 0; i <this.itemInfo.labelList.length ; i++) {
        if(this.itemInfo.labelList[i].id == val){
          this.itemInfo.labelList.splice(i,1);
          return
        }
      }
    },
    // 颜色反差计算
    colorRgb(color) {
      if (!color) {
        return ""
      }
      let reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-F]{6})$/;
      let arr = [];
      let sColor = color.toLowerCase();
      if (sColor && reg.test(sColor)) {
        if (sColor.length === 4) {
          let sColorNew = "#";
          for (let i = 1; i < 4; i += 1) {
            sColorNew += sColor.slice(i, i + 1).concat(sColor.slice(i, i + 1));
          }
          sColor = sColorNew;
        }
        //处理六位的颜色值
        for (let i = 1; i < 7; i += 2) {
          arr.push(parseInt("0x" + sColor.slice(i, i + 2)));
        }
      } else {
        let str = sColor.slice(sColor.indexOf('(') + 1, sColor.indexOf(')'));
        arr = str.split(',');
      }
      let num = arr[0] * 0.299 + arr[1] * 0.587 + arr[2] * 0.114;
      if (num >= 170) {
        return "#000"
      }
      return '#fff';
    },
    save(){
      let ref1Params = this.$refs.ref1.itemInfoData || {};
      let ref2Params = this.$refs.ref2.itemInfoData || {};
      let obj = Object.assign(ref1Params,ref2Params);
      var url = this.Config.baseContext + "/check/mssqCheckIndex/saveItemQzqd";
      this.$refs.ref1.validate((ref1)=>{
        if(ref1){
          this.$refs.ref2.validate((ref2)=>{
            if(ref2){
              obj.promiseProcess = JSON.stringify(obj.promiseProcess)
              if(!obj.checkRequireFile){
                obj.checkRequireFile = '';
              }else{
                obj.checkRequireFile = JSON.stringify(obj.checkRequireFile)
              }
              this.$http_post(url, obj,true).then(ret => {
                if(ret.state == '1'){
                  this.$message.success('保存成功')
                  this.$router.go(-1)
                }else{
                  obj.promiseProcess = JSON.parse(obj.promiseProcess)
                  obj.bllc = JSON.parse(obj.bllc)
                }
              })
            }
          })
        }
      })
    }
  },
  beforeDestroy() {
    document.removeEventListener('click', this.clickListener, false)
  }
}
</script>

<style scoped lang="less">
.item{
  //margin: 10px;
  padding: 10px;
  /*border-bottom: 1px solid #e2e2e2;*/
  /*margin: 10px;*/
  &.spacing{
    //padding-bottom: 60px;
  }
}
.footer {
  text-align: center;
  width: 100%;
  height: 50px;
  position: absolute;
  left: 0;
  bottom: 10px;
  margin-top: 30px;

  div {
    position: absolute;
    left: 50%;
    top: 0;
    transform: translateX(-50%);

    /deep/ button {
      width: 120px !important;
    }
  }
  /deep/.el-popover__reference-wrapper{padding:0 10px;}

}

.tag {
  align-items: center;
  margin: 5px;
  padding: 7px 5px;
  text-align: center;
  min-width: 95px;
  max-width: 150px;
  font-size: 14px;
  display: inline-block;
  border-radius: 30px;
  background: var(--primary, #409eff);
  color: white;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
}
.tag-content{
  display: flex;
  align-items: center;
  .addTag{
    height: 32px;
    line-height: 32px;
    width: 32px;
    border-radius: 30px;
    text-align: center;
    color: #fff;
    background: var(--primary,#409eff);
  }
}
.addLabel{
  display: flex;
  align-content:center;
}
</style>