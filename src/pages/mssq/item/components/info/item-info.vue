<template>
    <div class="item" :class="JSON.stringify(itemInfo) == '{}'?'spacing':''">
      <!--  <div  class="tag" ref="editArea">
            <template v-for="item in itemInfo.label">
                <tag :content="item.name" :bgColor="item.color"></tag>
            </template>
            <el-button icon="el-icon-plus" type="primary" style="padding: 3px!important;" @click="changeSelect"></el-button>
        </div>
        <el-select
                v-if="isShow"
                v-model="itemInfo.label"
                multiple
                value-key="id"
                collapse-tags
                style="margin-left: 20px;"
                placeholder="请选择">
            <el-option
                    v-for="item in tagList"
                    :key="item.id"
                    :label="item.name"
                    :value="{id:item.id,name:item.name,color:item.color}">
            </el-option>
        </el-select>-->
     <!-- <div>
        <div ref="editArea" v-if="isShow">
          <select-panel  v-model="itemInfo.label" multiple placeholder="选择添加标签" :options="tagOptions" @remove="remove">
            <template slot-scope="scope">
              <el-option
                      @click.native="getLabelInfo(scope.row)"
                      :key="scope.row.id"
                      :label="scope.row.name"
                      :value="scope.row.id">
                <div class="addLabel" valign="center">
                    <span :style="{width: '20px',height:'20px',color: colorRgb(scope.row.color),
                                  background: scope.row.color,'margin-right':'10px'}"></span>
                  {{scope.row.name}}
                </div>
              </el-option>
            </template>
          </select-panel>
        </div>
        <template v-else>
          <div class="tag-content">
            <el-tooltip effect="dark" v-for="item in itemInfo.labelList" :key="item.id" :content="item.description||item.title">
              <div :disabled="flag" class="tag" :style="{background: item.color,color: colorRgb(item.color)}">
                {{ item.name }}
              </div>
            </el-tooltip>
            <div class="addTag pointer" @click="changeSelect" v-if="itemInfo.labelList&&itemInfo.labelList.length>0" ><i class="el-icon-edit"></i></div>
          </div>
          <span :disabled="flag" v-if="itemInfo.labelList&&itemInfo.labelList.length==0" @click="changeSelect" class="pointer" style="font-size:14px;color:#999;">未设置标签</span>
        </template>
      </div>-->
        <base-info v-model="itemInfoData"  ref="ref1" :flag="flag" :type="'item'"></base-info>
        <power-info v-model="itemInfoData" :itemInfo="itemInfoData" ref="ref2" :flag="flag" :type="'item'" v-if="$route.query.type.indexOf('overAll') == -1"></power-info>
<!--        <associated-form ref="ref3" v-model="itemInfoData" :flag="flag" :type="'item'"></associated-form>-->
    </div>
</template>

<script>
  import BaseInfo from "./components/base-info";
  import PowerInfo from "./components/power-info";
  import optData from "../../optJs/opt-data";
  import tag from '../../../components/tag';
  import selectPanel from '../../../components/select';
  import qzBase from '@_src/pages/mssq/common/util/qzBase';
  import AssociatedForm from "./components/associated-form";


  export default {
        name: "item-info",
        components: {AssociatedForm, PowerInfo, BaseInfo,tag,selectPanel},
        mixins: [qzBase],

        data(){
            return{
                isShow:false,
                flag:false,
                itemInfoData:{
                    bllc:{
                        bllcNote:'',
                        bllct:[],

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
        model:{
            prop:'itemInfo',
            event:'itemInfoData'
        },
        watch:{
            itemInfo:{
                handler(val){
                    this.itemInfoData = JSON.parse(JSON.stringify(val));
                    if(this.$route.query.type == 'view' ||this.$route.query.type == 'todo' || this.$route.query.type == 'overAllView' || this.$route.query.type == 'overAllTodo'){
                        this.flag = true;
                    }else{
                        this.flag = false;
                    }
                },
                deep:true,
                immediate: true
            },
        },
        mounted(){
          this.tagOptions.url = this.Config.baseContext + "/mssq/mssqLabel/getLabelList";
            this.getButton();
            // this.getTagList();
        },
        methods:{
            getButton(){
                this.itemButton = optData['editItemStatistical'].optData
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
            optClick(item){
                this[item]();
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
          }
        },
        beforeDestroy() {
            document.removeEventListener('click', this.clickListener, false)
        }
    }
</script>

<style scoped lang="less">
    .item{
      margin: 10px;
        padding: 10px;
        /*border-bottom: 1px solid #e2e2e2;*/
        /*margin: 10px;*/
        &.spacing{
            padding-bottom: 60px;
        }
    }
    .footer {
        text-align: center;
        width: 100%;
        height: 50px;
        position: absolute;
        left: 0;
        bottom: 20px;
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