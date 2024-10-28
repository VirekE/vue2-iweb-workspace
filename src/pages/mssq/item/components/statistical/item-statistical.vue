<template>
  <div class="statistical">
    <template v-if="itemInfo.situationList.length>0">
      <el-card class="box-card" shadow="never" v-if="$route.query.qzqdName !== 'qzqdName'">
        <div slot="header" class="clearfix">
          <span>办理项选择</span>
          <el-button type="text" style="margin-left: 10px" v-if="$route.query.type != 'view'&& $route.query.type != 'todo'" @click="addStatistical">
            添加办理项
          </el-button>
          <el-button style="float: right; padding: 3px 0" type="text">
            <span>已选择办理项：</span>{{currentSituation.name}}
          </el-button>
        </div>
        <div class="text item">
          <ul :class="brandFold?'sit-hidden':''">
            <li v-for="(item,index) in itemInfo.situationList" :key="index"
                :class="situationCode == item.situationCode?'selected':''"
                @click="selectItem(item,index)">
              <el-button :type="situationIndex == index?'primary':''" :title="item.name">
                <div class="chooseButton">
                  <p>{{item.name}}</p>
                  <i class="el-icon-error" v-if="$route.query.type != 'view' && $route.query.type != 'todo'" @click="deleteStatistical(index)"></i>
                </div>
              </el-button>
            </li>
          </ul>
          <div v-if="itemInfo.situationList.length > 4" class="shrink">
            <span @click="changeFoldState">{{brandFold?'展开':'收起'}}</span>
            <el-link type="primary" @click="changeFoldState"><i
                    :class="brandFold? 'el-icon-arrow-down':'el-icon-arrow-up'"></i></el-link>
          </div>
        </div>
      </el-card>
      <div class="item" :class="JSON.stringify(itemInfo) == '{}'?'spacing':''">
        <base-info v-if="!isEmptyObject(currentSituation)" ref="ref1" v-model="currentSituation" :itemInfo="itemInfo" :flag="flag"></base-info>
        <power-info v-if="!isEmptyObject(currentSituation)" ref="ref2" v-model="currentSituation" @powerData="powerData" :itemInfo="itemInfo"
                    :type="'statistical'" :flag="flag"></power-info>
        <!--                    <associated-form ref="ref3" v-model="currentSituation" :itemInfo="itemInfo" :type="'statistical'" :flag="flag"></associated-form>-->
      </div>
      <div v-if="JSON.stringify(itemInfo) == '{}'" class="footer">
        <template v-for="(item,index) in itemButton">
          <el-button :key="index" :icon="'iconfont '+item.icon" :type="item.type" @click="optClick(item.method)">
            {{item.name}}
          </el-button>
        </template>
      </div>
    </template>
    <template v-else>
      <no-data>
        <template v-slot>
          <div class="content">
            <div>
              <span style="opacity: 0.6">暂无办理项</span><span v-if="$route.query.type != 'view' && $route.query.type != 'todo'">,是否创建一个默认办理项</span>
            </div>
            <el-button type="text" v-if="$route.query.type != 'view' && $route.query.type != 'todo'" style="padding:0;font-size:16px;"
                       @click="addStatistical">立即创建
            </el-button>
          </div>
        </template>
      </no-data>
    </template>
    <el-dialog title="新增办理项" width="50%" :close-on-click-modal=false class="qz-dialog-padding qz-law"
               :visible.sync="addStatisticalDialog">
      <div class="name">
        <span>办理项名称:</span>
        <el-input v-model="statisticalName" placeholder="请输入办理项名称"></el-input>
      </div>
      <span slot="footer" class="dialog-footer">
              <el-button @click="addStatisticalDialog= false">取 消</el-button>
              <el-button type="primary" @click="addConfirm">确 定</el-button>
            </span>
    </el-dialog>
  </div>
</template>

<script>
  import BaseInfo from "./components/base-info";
  import associatedForm from "../info/components/associated-form";
  import qzBase from '@_src/pages/mssq/common/util/qzBase';
  import PowerInfo from "../info/components/power-info";
  import optData from "../../optJs/opt-data";
  import NoData from "../../../common/components/NoData";

  export default {
    name: "item-statistical",
    mixins: [qzBase],
    components: {NoData, PowerInfo, BaseInfo, associatedForm},
    data() {
      return {
        flag: false,
        addStatisticalDialog: false,
        statisticalName: '',
        itemInfoData: {
          bllc: {
            bllcNote: '',
            bllct: [],
          }
        },
        itemButton: [],
        brandFold: false,
        currentSituation: {},
        situationCode: '',
        situationIndex: 0,
        rules: {
          name: [
            {required: true, message: '请输入办理项名称', trigger: 'blur'}
          ],
          isExpress: [
            {required: true, message: '请选择是否支持物流快递', trigger: 'blur'}
          ]
        },
      }
    },
    props: {
      itemInfo: {
        type: Object,
        default: () => {
          return {}
        }
      },
      type: {
        type: String,
        default: ''
      },
      curTab: {
        type: String,
        required: false,
      },
      qzqdSituationCode: {
        type: String,
        default: ''
      }
    },
    model: {
      prop: 'itemInfo',
      event: 'change'
    },
    watch: {
      itemInfo: {
        handler(val) {
          this.itemInfoData = JSON.parse(JSON.stringify(val));
          val.situationList.forEach((item, index) => {
            if (item.code && item.code == this.situationCode) {
              this.situationIndex = index
            }
          });
          if (this.$route.query.type == 'view' || this.$route.query.type == 'todo') {
            this.flag = true;
          } else {
            this.flag = false;
          }
        },
        deep: true,
        immediate: true
      },
      qzqdSituationCode: {
        handler(val) {
          if (val) {
            for (let i = 0; i < this.itemInfo.situationList.length; i++) {
              console.log(this.itemInfo.situationList[i].code, val);
              if (this.itemInfo.situationList[i].code == val) {
                this.currentSituation = this.itemInfo.situationList[i];
              }
            }
          }
        },
        deep: true,
        immediate: true
      },
      currentSituation: {
        handler(val) {
          if (JSON.stringify(val) != '{}') {
            this.$set(this.itemInfo.situationList, this.situationIndex, this.currentSituation);
          }
        },
        deep: true,
        immediate: true
      },
      curTab(val) {
        if (val === '1') {
          this.selectItem(this.itemInfoData.situationList[0], 0);
        }
      },
    },
    mounted() {
      if (this.qzqdSituationCode) {
        this.situationCode = this.qzqdSituationCode;
      }
      this.getButton();
    },
    methods: {
      selectItem(item, index) {
        this.currentSituation = item || {};
        this.situationIndex = index;
        if (!this.isEmptyObject(item)) {
          this.situationCode = item.code;
        }
        // }
      },
      getButton() {
        this.itemButton = optData['editItemStatistical'].optData
      },
      optClick(item) {
        this[item]();
      },
      setSelectItem(index, item) {
        this.currentSituation = this.itemInfo.situationList[index];
        this.situationIndex = index;
        this.situationCode = item.situationList[index].situationCode;
      },
      goBack() {
        this.$router.go(-1);
      },
      changeFoldState() {
        this.brandFold = !this.brandFold
      },
      addStatistical() {
        this.statisticalName = '';
        this.addStatisticalDialog = true;
      },
      powerData() {//实施信息数据填充
        this.currentSituation = JSON.parse(JSON.stringify({
          applyAgentName: this.itemInfo.applyAgentName,
          apllyAgentNo: this.itemInfo.apllyAgentNo,
          dutyExplain: this.itemInfo.dutyExplain,
          formId: this.itemInfo.formId,
          applyDeptNo: this.itemInfo.applyDeptNo,
          name:this.itemInfo.situationList[this.situationIndex].name,
          formVersionId: this.itemInfo.formVersionId,
          formName: this.itemInfo.formName,
          applyDeptName: this.itemInfo.applyDeptName,
          applyNorm: this.itemInfo.applyNorm,
          applyUserName: this.itemInfo.applyUserName,
          assistDept: this.itemInfo.assistDept,
          assistDeptName: this.itemInfo.assistDeptName,
          assistDeptId: this.itemInfo.assistDeptId,
          assistDeptNo: this.itemInfo.assistDeptNo,
          acceptCondition: this.itemInfo.acceptCondition,
          applyCondition: this.itemInfo.applyCondition,
          promiseHzUnit: this.itemInfo.promiseHzUnit,
          promiseHz: this.itemInfo.promiseHz,
          isStreet: this.itemInfo.isStreet,
          description: this.itemInfo.description,
          promiseFrequency: this.itemInfo.promiseFrequency,
          checkRequireFile: this.itemInfo.checkRequireFile,
          promiseProcess: {
            promiseProcessNote: this.itemInfo.promiseProcess.promiseProcessNote,
            promiseProcesst: this.itemInfo.promiseProcess.promiseProcesst
          },
          remark:this.itemInfo.remark,
          checkRequire:this.itemInfo.checkRequire,
          unionItemCode:this.itemInfo.unionItemCode,
          unionItemName:this.itemInfo.unionItemName,
          unionSystem:this.itemInfo.unionSystem,
          isFocus:this.itemInfo.isFocus,
          taskObject:this.itemInfo.taskObject,
          matterType:this.itemInfo.matterType,
          taskType:this.itemInfo.taskType,
        }));
      },
      addConfirm() {
        if (this.statisticalName) {
          this.itemInfo.situationList.push({
            applyAgentName: this.itemInfo.applyAgentName,
            apllyAgentNo: this.itemInfo.apllyAgentNo,
            dutyExplain: this.itemInfo.dutyExplain,
            formId: this.itemInfo.formId,
            applyDeptNo: this.itemInfo.applyDeptNo,
            name:this.statisticalName,
            formVersionId: this.itemInfo.formVersionId,
            formName: this.itemInfo.formName,
            applyDeptName: this.itemInfo.applyDeptName,
            applyNorm: this.itemInfo.applyNorm,
            applyUserName: this.itemInfo.applyUserName,
            assistDept: this.itemInfo.assistDept,
            assistDeptName: this.itemInfo.assistDeptName,
            assistDeptId: this.itemInfo.assistDeptId,
            assistDeptNo: this.itemInfo.assistDeptNo,
            acceptCondition: this.itemInfo.acceptCondition,
            applyCondition: this.itemInfo.applyCondition,
            promiseHzUnit: this.itemInfo.promiseHzUnit,
            promiseHz: this.itemInfo.promiseHz,
            isStreet: this.itemInfo.isStreet,
            description: this.itemInfo.description,
            promiseProcess: {
              promiseProcessNote: this.itemInfo.promiseProcess.promiseProcessNote,
              promiseProcesst: this.itemInfo.promiseProcess.promiseProcesst
            },
            remark:this.itemInfo.remark,
            checkRequire:this.itemInfo.checkRequire,
            unionItemCode:this.itemInfo.unionItemCode,
            unionItemName:this.itemInfo.unionItemName,
            unionSystem:this.itemInfo.unionSystem,
            isFocus:this.itemInfo.isFocus,
            taskObject:this.itemInfo.taskObject,
            matterType:this.itemInfo.matterType,
            taskType:this.itemInfo.taskType,
          });
          this.addStatisticalDialog = false;
        } else {
          this.$message.warning('请输入办理项名称');
        }
        if (!this.situationIndex) {
          this.situationIndex = 0
        }
        this.selectItem(this.itemInfo.situationList[this.situationIndex], this.situationIndex);
      },
      deleteStatistical(index) {
        this.itemInfo.situationList.splice(index, 1)
      },
      validate(index, callback) {
        if (this.itemInfo.situationList.length > 0) {
          this.$refs['ref' + index].validate(e => {
            if (e) {
              if (index == 2) {
                callback(e);
              } else {
                this.validate(++index, callback)
              }
            }else{
              this.$message.error('请检查必填项');
            }
          })
        } else {
          callback(true);
        }
      },
    }
  }
</script>

<style scoped lang="less">
  .statistical {
    height: 100%;
    padding-top:20px;
    .content {
      display: flex;
      flex-direction: column;
    }
  }

  .item {
    padding: 10px;
    /*border-bottom: 1px solid #e2e2e2;*/
    /*margin: 10px;*/

    &.spacing {
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

    /deep/ .el-popover__reference-wrapper {
      padding: 0 10px;
    }

  }

  /deep/ .el-card {
    border-top: 1px solid #e2e2e2 !important;

    .item {
      background: #f5f7fa;
      padding: 15px 20px 0 20px;

      .sit-hidden {
        height: 55px;
        overflow: hidden;
      }

      ul {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;

        li {
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 15px;
          margin-bottom: 15px;

          .el-button {
            width: 268px;
            display: inline-block;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
          }

          &:nth-child(4n) {
            margin-right: 0;
          }
        }
      }

      .shrink {
        text-align: center;
        font-size: 15px;
        padding-bottom: 10px;

        .is-underline:hover:after {
          border: none;
        }

        span {
          cursor: pointer;
        }

        .el-link {
          margin-left: 5px;
          font-size: 20px;
        }
      }
    }
  }

  .name {
    display: flex;
    justify-content: center;
    align-items: center;

    span {
      width: 100px;
    }
  }

  .chooseButton {
    display: flex;
    justify-content: space-between;

    p {
      width: 100%;
      overflow: hidden;
    }
  }

</style>