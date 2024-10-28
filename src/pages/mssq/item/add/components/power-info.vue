<!--<style lang="less" src="@_src/pages/mssq/common/css/form.less" scoped></style>-->
<template>
  <div class="baseInfo">
    <h3 class="title"><p class="content">{{type === 'item'?'实施信息':'办理项实施信息'}}</p>
    </h3>
    <el-form :disabled="$route.query.type === 'view'" :model="itemInfoData" label-width="170px" ref="formName" :rules="rules">
      <div class="base-info-content">
        <el-row>
          <el-col :span="24">
            <el-form-item label="事项是否下沉街道" prop="isStreet">
              <template slot="label">
                <span>事项是否下沉街道</span>
                <el-tooltip class="item" effect="dark" content="" placement="top-start">
                  <template slot="content">
                    指办理部门依据相关法规、规章纳入街道综合处置的民生诉求事项需下沉到街道办事处进行实施。
                  </template>
                  <i class="el-icon-warning-outline"></i>
                </el-tooltip>
              </template>
              <el-radio-group v-model="itemInfoData.isStreet"><!---->
                <el-radio label="1">是</el-radio>
                <el-radio label="0">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="办理部门名称" prop="applyDeptName">
              <template slot="label">
                <span>办理部门名称</span>
                <el-tooltip class="item" effect="dark" content="" placement="top-start">
                  <template slot="content">
                    指民生诉求事项实施的主要承办单位，包括市、区两级党群机关，市、区两级政府部门以及街道、社区。
                  </template>
                  <i class="el-icon-warning-outline"></i>
                </el-tooltip>
              </template>
              <el-input v-model="itemInfoData.applyDeptName"
                        placeholder="请输入办理部门名称"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="主办内（下）设机构" :prop="itemInfoData.isStreet == '0'?'applyAgentName':'empty'">
              <template slot="label">
                <span>主办内（下）设机构</span>
                <el-tooltip class="item" effect="dark" content="" placement="top-start">
                  <template slot="content">
                    民生诉求事项主办部门内（下）设的具体承办事项的机构名称，例如处室名称、科室名称。
                  </template>
                  <i class="el-icon-warning-outline"></i>
                </el-tooltip>
              </template>
              <el-input :class="flag?'':''" v-model="itemInfoData.applyAgentName"
                        placeholder="请选择主办内（下）设机构" readonly>
                <el-tooltip slot="append" class="item tree-view" effect="dark"  content="查看已选择主办内（下）设机构" placement="top-start">
                <el-button  icon="el-icon-view"
                           @click="viewDept"></el-button>
                </el-tooltip>
                <el-tooltip slot="append" class="item" effect="dark" content="选择主办内（下）设机构" placement="top-start">
                  <el-button  class="iconfont icon-caidan"
                             @click="chooseDep('ks')"></el-button>
                </el-tooltip>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="办理人员">
              <template slot="label">
                <span>办理人员</span>
                <el-tooltip class="item" effect="dark" content="" placement="top-start">
                  <template slot="content">
                    指民生诉求事项办理部门下具体承办处室或科室的办理人员姓名。
                  </template>
                  <i class="el-icon-warning-outline"></i>
                </el-tooltip>
              </template>
              <el-input v-model="itemInfoData.applyUserName" placeholder="请输入办理人员"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="实施类型" prop="taskType">
              <template slot="label">
                <span>实施类型</span>
                <el-tooltip class="item" effect="dark" content="" placement="top-start">
                  <template slot="content">
                    指治理事项在实施时为单部门事项，还是多部门的协同事项，包括单层级跨部门、跨层级、跨区域等。
                  </template>
                  <i class="el-icon-warning-outline"></i>
                </el-tooltip>
              </template>
              <el-select :class="flag?'':''" v-model="itemInfoData.taskType">
                <el-option v-for="(item,index) in $store.getters.getDict['TASK_TYPE']" :key="index"
                           :label="item.itemValue"
                           :value="item.itemCode"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="事项类型" prop="matterType">
              <template slot="label">
                <span>事项类型</span>
                <el-tooltip class="item" effect="dark" content="" placement="top-start">
                  <template slot="content">
                    治理事项属于巡查类、线索类、处置类、协助办理类、信息核采类的情况。
                  </template>
                  <i class="el-icon-warning-outline"></i>
                </el-tooltip>
              </template>
              <el-select :class="flag?'':''" v-model="itemInfoData.matterType">
                <el-option v-for="(item,index) in $store.getters.getDict['ITEM_TYPE']" :key="index"
                           :label="item.itemValue"
                           :value="item.itemCode"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="itemInfoData.taskType !== '1'">
          <el-col :span="24">
            <el-form-item label="协办部门" prop="assistDept">
              <template slot="label">
                <span>协办部门</span>
                <el-tooltip class="item" effect="dark" content="" placement="top-start">
                  <template slot="content">
                    指承担民生诉求事项实施的协助单位。
                  </template>
                  <i class="el-icon-warning-outline"></i>
                </el-tooltip>
              </template>
              <el-input :class="flag?'':''" readonly v-model="itemInfoData.assistDept"
                        placeholder="请选择协办部门">
                <el-button slot="append" class="iconfont icon-caidan"
                           @click="chooseDept('dept',itemInfoData.assistDeptId)"></el-button>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="实施对象" class="select"
                          :prop="(itemInfoData.matterType == 1 ||itemInfoData.matterType == 5)?'taskObject':''">
              <template slot="label">
                <span>实施对象</span>
                <el-tooltip class="item" effect="dark" content="" placement="top-start">
                  <template slot="content">
                    指治理事项的实施对象，包括部件、场所、企业等。巡查类、信息核采类事项必须填写。
                  </template>
                  <i class="el-icon-warning-outline"></i>
                </el-tooltip>
              </template>
              <!--<el-select :class="flag?'':''" v-model="itemInfoData.taskObject">
                <el-option v-for="(item,index) in $store.getters.getDict['TASK_OBJECT']" :key="index" :label="item.itemValue"
                           :value="item.itemCode"></el-option>
              </el-select>-->
              <el-input v-model="itemInfoData.taskObject" placeholder="请输入实施对象"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="实施频率" class="select"
                          :prop="(itemInfoData.matterType == 1 ||itemInfoData.matterType == 5||itemInfoData.matterType == 4)?'promiseFrequency':''">
              <template slot="label">
                <span>实施频率</span>
                <el-tooltip class="item" effect="dark" content="" placement="top-start">
                  <template slot="content">
                    指民生诉求事项中涉及巡查类、信息采集类业务的巡查/采集频次，包括定期、不定期等。
                  </template>
                  <i class="el-icon-warning-outline"></i>
                </el-tooltip>
              </template>
              <el-select :class="flag?'':''" v-model="itemInfoData.promiseFrequency">
                <el-option label="不定期" value="1"></el-option>
                <el-option label="定期" value="2"></el-option>
                <!--                <el-option v-for="(item,index) in $store.getters.getDict['CZPL']" :key="index" :label="item.itemValue" :value="item.itemCode"></el-option>-->
              </el-select>
            </el-form-item>
          </el-col>

        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="实施频率说明" class="timeDay">
              <template slot="label">
                <span>实施频率说明</span>
                <el-tooltip class="item" effect="dark" content="" placement="top-start">
                  <template slot="content">
                    指民生诉求事项中涉及巡查类、信息采集类业务的巡查/采集频次，包括定期、不定期等。
                  </template>
                  <i class="el-icon-warning-outline"></i>
                </el-tooltip>
              </template>
              <el-col :span="12">
                <el-form-item>
                  <!-- <el-select :class="flag?'':''" v-model="itemInfoData.promiseHz">
                     <el-option v-for="(item,index) in $store.getters.getDict['CZPLCS']" :key="index" :label="item.itemValue"
                                :value="item.itemCode"></el-option>
                   </el-select>-->
                  <el-input :class="flag?'':''" v-model="itemInfoData.promiseHz"
                            placeholder="请输入实施频率"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12" style="margin-left:10px;width: calc(50% - 10px)">
                <el-form-item>
                  <el-select :class="flag?'':''" v-model="itemInfoData.promiseHzUnit">
                    <el-option label="件/月" value="1"></el-option>
                    <!--                <el-option v-for="(item,index) in $store.getters.getDict['CZPL']" :key="index" :label="item.itemValue" :value="item.itemCode"></el-option>-->
                  </el-select>
                </el-form-item>
              </el-col>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="type == 'statistical'">
          <el-col :span="24">
            <el-form-item label="办理项说明">
              <template slot="label">
                <span>办理项说明</span>
                <el-tooltip class="item" effect="dark" content="" placement="top-start">
                  <template slot="content">
                    对办理项的文字描述
                  </template>
                  <i class="el-icon-warning-outline"></i>
                </el-tooltip>
              </template>
              <el-input :class="flag?'':''" v-model="itemInfoData.description" rows="3"
                        type="textarea"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-else>
          <el-col :span="24">
            <el-form-item label="事项说明" prop="itemExplain">
              <template slot="label">
                <span>事项说明</span>
                <el-tooltip class="item" effect="dark" content="" placement="top-start">
                  <template slot="content">
                    对事项的文字描述
                  </template>
                  <i class="el-icon-warning-outline"></i>
                </el-tooltip>
              </template>
              <el-input :class="flag?'':''" placeholder="请输入事项说明" v-model="itemInfoData.itemExplain"
                        rows="3" :readonly="!!itemInfoData.proCode"
                        type="textarea"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="职责说明" prop="dutyExplain">
              <template slot="label">
                <span>职责说明</span>
                <el-tooltip class="item" effect="dark" content="" placement="top-start">
                  <template slot="content">
                    明确主办单位、协办单位在治理事件实施过程中的责任。根据实际需求填写。
                  </template>
                  <i class="el-icon-warning-outline"></i>
                </el-tooltip>
              </template>
              <el-input :class="flag?'':''" v-model="itemInfoData.dutyExplain" type="textarea" :rows="5"
                        placeholder="请输入职责说明"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="type == 'item'">
          <el-col :span="24">
            <el-form-item label="受理标准" prop="acceptCondition">
              <template slot="label">
                <span>受理标准</span>
                <el-tooltip class="item" effect="dark" content="" placement="top-start">
                  <template slot="content">
                    指民生诉求事项触及何种标准即可判定问题发生需要受理，便于受理人员判定是否需受理并派单处置。
                  </template>
                  <i class="el-icon-warning-outline"></i>
                </el-tooltip>
              </template>
              <el-input :class="flag?'':''" v-model="itemInfoData.acceptCondition" type="textarea"
                        :rows="3" placeholder="请输入受理标准"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="处置流程" prop="promiseProcess.promiseProcessNote">
              <template slot="label">
                <span>处置流程</span>
                <el-tooltip class="item" effect="dark" content="" placement="top-start">
                  <template slot="content">
                    指民生诉求事项从开始接单到成功办结的全流程闭环所涉及的程序和环节要求。
                  </template>
                  <i class="el-icon-warning-outline"></i>
                </el-tooltip>
              </template>
              <el-input :class="flag?'':''" placeholder="请输入处置流程"
                        v-model="itemInfoData.promiseProcess.promiseProcessNote" :rows="3"
                        type="textarea"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="处置流程图" prop="promiseProcess.promiseProcesst">
              <template slot="label">
                <span>处置流程图</span>
                <el-tooltip class="item" effect="dark" content="" placement="top-start">
                  <template slot="content">
                    指民生诉求事项按处置流程绘制的流程图。
                  </template>
                  <i class="el-icon-warning-outline"></i>
                </el-tooltip>
              </template>
              <el-upload class="upload" ref="material"
                         :before-upload="beforeUpload"
                         :before-remove="modelBeforeRemove"
                         :action="uploadUrl"
                         :on-remove="modelRemove"
                         :on-success="modelSuccess"
                         :on-preview="onPreview"
                         :limit="3"
                         :headers="uploadHeaders"
                         :on-error="modelError"
                         :file-list="itemInfoData.promiseProcess.promiseProcesst">
                <el-button size="small" type="primary">上传附件</el-button>
              </el-upload>
              <p @click.stop>文件格式为jpg,jpeg,png,pdf格式，文件大小不超过5M</p>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="type == 'item'">
          <el-col :span="24">
            <el-form-item label="办结标准" prop="applyCondition">
              <template slot="label">
                <span>办结标准</span>
                <el-tooltip class="item" effect="dark" content="" placement="top-start">
                  <template slot="content">
                    指民生诉求事项实施到何种标准即可进行办结，便于审核员判定处置单位是否完成处置。
                  </template>
                  <i class="el-icon-warning-outline"></i>
                </el-tooltip>
              </template>
              <el-input :class="flag?'':''" v-model="itemInfoData.applyCondition" type="textarea" :rows="5"
                        placeholder="(一)办结标准。
1.根据处置时效分为按期办结、超期办结及阶段性办结。
(1)按期办结。责任单位在规定时限内将事件处置完毕， 并详细告知诉求人处置时间、经过、结果，解决或回应了诉求人 实际诉求的。
(2)超期办结。责任单位在规定时限以外将事件处置完毕， 并详细告知诉求人处置时间、经过、结果，解决或回应了诉求人 实际诉求的。
(3)阶段性办结。事件处置难度大、周期长，在规定的时 限内仍无法处置完毕的，由责任单位提交必要的申请材料、明确 办结时间，向区民生诉求服务中心申请阶段性办结。区民生诉求服务中心审核通过后对事件进行阶段性办结。阶段性办结事件处 置完毕后申请办结的，依照按期办结、超期办结的要求执行。
2.根据事件类型可分为咨询类事件办结、建议类事件办结和 投诉类事件办结。
(1)咨询类事件办结。责任单位详细回复了诉求人咨询的 事件，能够解答诉求人的疑问的;责任单位暂时无法回复诉求人 咨询的事件，但向诉求人说明原因并做好了相关解释工作的。
(2)建议类事件办结。责任单位对诉求人提出的建议认真 研判，将采纳情况告知诉求人，并做好了相关解释工作的。
(3)投诉类事件办结。责任单位对诉求人反映的投诉事件 予以处置，并详细告知诉求人处置时间、经过、结果，解决或回 应了诉求人的实际诉求的。其中城市部件类投诉事件应当配有处 置前后对比图，对比图应当清晰明显。
(二)不予办结。
1.责任单位未进行处置。 2.责任单位未按要求给诉求人发送办理告知。 3.责任单位虽有处置但效果不佳，按事件类型主要如下: (1)咨询类事件:责任单位未针对诉求人咨询进行回复，
不能解答诉求人的疑问或无法准确回复也未做相关解释工作，回 复敷衍了事或答非所问的;
(2)建议类事件:责任单位对诉求人提出的建议不予采纳 也未向诉求人做任何解释工作的;
(3)投诉类事件:责任单位对诉求人反映的投诉事件予以 处置，城市部件类投诉事件无处置前后对比图，无法判断是否处 置完毕的，或责任单位虽有处置，但安全隐患未消除，仍需进一 步处置的。"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="是否重点事项">
              <template slot="label">
                <span>是否重点事项</span>
                <el-tooltip class="item" effect="dark" content="" placement="top-start">
                  <template slot="content">
                    指治理事项按照有关文件要求需重点关注，或有关领导特别关注，以及事项发生后需要紧急处置等。
                  </template>
                  <i class="el-icon-warning-outline"></i>
                </el-tooltip>
              </template>
              <el-radio-group v-model="itemInfoData.isFocus">
                <el-radio label="1">是</el-radio>
                <el-radio label="0">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="关联原业务系统">
              <template slot="label">
                <span>关联原业务系统</span>
                <el-tooltip class="item" effect="dark" content="" placement="top-start">
                  <template slot="content">
                    指治理事项当前实施的业务系统。填写业务系统的全称，如果没有，填写无。
                  </template>
                  <i class="el-icon-warning-outline"></i>
                </el-tooltip>
              </template>
              <el-input v-model="itemInfoData.unionSystem" placeholder="请输入关联原业务系统"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- <el-row>
           <el-col :span="12">
             <el-form-item label="关联原事项名称">
               <template slot="label">
                 <span>关联原事项名称</span>
                 <el-tooltip class="item" effect="dark" content="" placement="top-start">
                   <template slot="content">
                     指本次梳理前治理事项对应的名称。如果有业务系统，填写当前业务系统对应的事项名称；没有业务系统，填写业务部门使用的事项名称。
                   </template>
                   <i class="el-icon-warning-outline"></i>
                 </el-tooltip>
               </template>
               <el-input v-model="itemInfoData.unionItemName" placeholder="请输入关联原事项名称"></el-input>
             </el-form-item>
           </el-col>
           <el-col :span="12">
             <el-form-item label="映射原事项编码">
               <template slot="label">
                 <span>映射原事项编码</span>
                 <el-tooltip class="item" effect="dark" content="" placement="top-start">
                   <template slot="content">
                     指本次梳理前治理事项的事项编码。请填写具体编码，以便于做好映射。如果原来没有事项编码，填写无。
                   </template>
                   <i class="el-icon-warning-outline"></i>
                 </el-tooltip>
               </template>
               <el-input v-model="itemInfoData.unionItemCode" placeholder="请输入映射原事项编码"></el-input>
             </el-form-item>
           </el-col>
         </el-row>-->
        <el-row>
          <el-col :span="24">
            <el-form-item label="考核要求">
              <template slot="label">
                <span>考核要求</span>
                <el-tooltip class="item" effect="dark" content="" placement="top-start">
                  <template slot="content">
                    指现有的对治理事项实施的具体考核要求。填写具体考核文件名称、文号、考核条款和考核内容。如果有多项考核，请全部列明。
                  </template>
                  <i class="el-icon-warning-outline"></i>
                </el-tooltip>
              </template>
              <el-input :class="flag?'':''" v-model="itemInfoData.checkRequire" type="textarea" :rows="5"
                        placeholder="请输入考核要求"></el-input>

            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="考核要求附件">
              <template slot="label">
                <span>考核要求附件</span>
                <el-tooltip class="item" effect="dark" content="" placement="top-start">
                  <template slot="content">
                    指现有的对治理事项实施的具体考核要求。填写具体考核文件名称、文号、考核条款和考核内容。如果有多项考核，请全部列明。
                  </template>
                  <i class="el-icon-warning-outline"></i>
                </el-tooltip>
              </template>
              <el-upload class="upload" ref="material"
                         :before-upload="KHbeforeUpload"
                         :before-remove="KHmodelBeforeRemove"
                         :action="uploadUrl"
                         :on-remove="KHmodelRemove"
                         :on-success="KHmodelSuccess"
                         :on-preview="KHonPreview"
                         :limit="3"
                         :headers="uploadHeaders"
                         :on-error="KHmodelError"
                         :file-list="itemInfoData.checkRequireFile">
                <el-button size="small" type="primary">上传附件</el-button>
              </el-upload>
              <p @click.stop>文件格式为jpg,jpeg,png,pdf格式，文件大小不超过5M</p>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="备注">
              <el-input :class="flag?'':''" v-model="itemInfoData.remark" type="textarea" :rows="5"
                        placeholder="请输入备注"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
         <el-row>
           <el-col :span="24">
             <el-form-item label="办表单" class="statisticalForm">
               <template slot="label">
                 <span>{{type === 'item'?'事项表单':'办理项表单'}}</span>
                 <el-tooltip class="item" effect="dark" content="" placement="top-start">
                   <template slot="content">
                     指根据民生诉求事项具体需求绘制的业务表单。
                   </template>
                   <i class="el-icon-warning-outline"></i>
                 </el-tooltip>
               </template>
               <div @click="showFormDetail(itemInfoData)" v-if="itemInfoData.formId"><i
                       class="formName">{{itemInfoData.formName}}</i></div>
               <el-button class="linkButton" type="primary" size="small"
                          @click="association=true">关联表单
               </el-button>
               <el-button
                       v-if="(!isEmptyObject(itemInfoData.formName))&& (itemInfoData.formId!=='')"
                       class="linkButton" type="primary" size="small"
                       @click="formIndex=scope.$index;delFrom()">删除表单
               </el-button>
             </el-form-item>
           </el-col>
         </el-row>
      </div>
    </el-form>
    <association-dialog title="关联表单" :show="association" ref="associationbooen"
                        @close="association = false" @confirm="confirm" :showSearchBar="true"
                        :showPagination="true">
    </association-dialog>
    <el-dialog
            width="60%"
            :visible.sync="detailDialog">
      <p style="padding: 20px">表单ID：{{formsView.formId}} <span style="margin-left: 10px">版本号：{{formsView.newFormVersion}}</span>
      </p>
      <hr/>
      <div style="height: 500px;padding: 20px;overflow-y: auto">
        <div>
          <iframe id="formView" scrolling="none" :src="src" frameborder="0" height="100%" width="100%"></iframe>
        </div>
      </div>
    </el-dialog>
    <el-dialog
            title="主办内（下）设机构"
            width="30%"
            :visible.sync="ksDialog">
      <el-tree v-loading="loading" lazy :load="loadNode" show-checkbox :props="defaultProps" ref="tree"
               :default-checked-keys="defulatChooseId"
               node-key="id" check-strictly :default-expanded-keys="expanded"
               @check="handleCheckChange"></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="__onCancelClick">取 消</el-button>
        <el-button type="primary" @click="__onOkClick">确 认</el-button>
      </span>
    </el-dialog>
    <el-dialog
            title="查看已选择主办内（下）设机构"
            width="30%"
            :visible.sync="viewDeptDialog">
      <el-tree :data="itemInfoData.apllyAgentNo" :props="defaultProps" ref="tree"
               node-key="id" :default-expanded-keys="viewExpanded"></el-tree>
    </el-dialog>
  </div>
</template>

<script>
  import uploadUtil from '@_src/utils/upload';
  import qzBase from '@_src/pages/mssq/common/util/qzBase';
  import associationDialog from '@_src/pages/mssq/bdgl/manage/edition-newForm'; //关联表单
  import OrganTree from '@_src/pages/mssq/common/components/organ'

  export default {
    name: "power-info",
    mixins: [qzBase],
    components: {
      associationDialog,
    },
    data() {
      let validatePromise = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'));
        } else {
          if (this.ruleForm.checkPass !== '') {
            this.$refs.ruleForm.validateField('checkPass');
          }
          callback();
        }
      };
      return {
        expanded:[],
        treeName:'',
        viewExpanded:[],
        ksList:[],
        defulatChooseId:[],
        association: false,
        viewDeptDialog: false,
        defaultProps: {
          children: 'children',
          label: 'name',
          disabled: this.disabledFn,
        },
        ksDialog: false,
        actionUrl: '',
        formId: '',
        versionId: '',
        detailDialog: false,
        formsView: {
          formId: '',
          newFormVersion: '',
        },
        src: '',
        previewTitle: '图片',
        previewFileType: "jpg,png,gif",
        uploadHeaders: {},
        loading: false,
        uploadUrl: '',
        previewSrc: '',
        dialogVisible: false,
        rules: {
          dutyExplain: [
            {required: true, message: '请填写职责说明', trigger: 'blur'}
          ],
          itemExplain: [
            {required: true, message: '请填写事项说明', trigger: 'blur'}
          ],
          acceptCondition: [
            {required: true, message: '请填写受理标准', trigger: 'blur'}
          ],
          applyCondition: [
            {required: true, message: '请填写办结标准', trigger: 'blur'}
          ],
          taskType: [
            {required: true, message: '请选择实施类型', trigger: ['blur', 'change']}
          ],
          matterType: [
            {required: true, message: '请选择事项类型', trigger: 'change'}
          ],
          promiseFrequency: [
            {required: true, message: '请选择实施频率', trigger: 'change'}
          ],
          taskObject: [
            {required: true, message: '请输入实施对象', trigger: 'blur'}
          ],
          applyDeptName: [
            {required: true, message: '请输入办理部门名称', trigger: 'blur'}
          ],
          applyAgentName: [
            {required: true, message: '请输入主办内（下）设机构', trigger: 'blur'}
          ],
          applyUserName: [
            {required: true, message: '请输入办理人员', trigger: 'blur'}
          ],
          isStreet: [
            {required: true, message: '请选择事项是否下沉街道', trigger: 'change'}
          ],
          // promiseProcess:{
          'promiseProcess.promiseProcessNote': [
            {required: true, message: '请输入办理流程', trigger: 'blur'}
          ],
          'promiseProcess.promiseProcesst': [
            {required: true, message: '请上传办理流程图', trigger: 'blur'}
          ]
          // }
        }
      }
    },
    props: {
      itemInfoData: {
        type: Object,
        required: true,
      },
      itemInfo: {
        type: Object,
        default: () => {
          return {}
        }
      },
      flag: {
        type: Boolean,
        default: false,
      },
      type: {
        type: String,
        default: '',
      }
    },
    model: {
      prop: 'itemInfoData',
      event: 'change'
    },
    watch: {
      itemInfoData: {
        handler(val) {
          if(!this.isEmptyObject(val)){
            this.$emit('update:itemInfoData', val);
          }
        },
        deep: true,
        immediate: true
      }
    },
    mounted() {
      this.uploadUrl = this.Config.rcPath + "/upload";
      let headers = uploadUtil.setHeaders();
      headers['x-aep-token'] = this.$store.getters.token;
      this.uploadHeaders = headers;
      this.$nextTick(() => {
        /*if(this.$refs.formName.clearValidate){
          // this.$refs.formName.clearValidate();
        }*/
      });
    },
    methods: {
      ssxxData() {
        this.$emit('powerData')
      },
      modelRemove(file, fileList) {

      },
      modelBeforeRemove(file, fileList) {
        for (let i = 0; i < this.itemInfoData.promiseProcess.promiseProcesst.length; i++) {
          if (this.itemInfoData.promiseProcess.promiseProcesst[i].rcId == file.rcId) {
            this.itemInfoData.promiseProcess.promiseProcesst.splice(i, 1);
            return
          }
        }
      },
      modelSuccess(response, file, fileList) {
        if (response.state == 1) {
          this.$message({
            message: '上传成功',
            type: 'success'

          });
          var material = response.row;
          var fileObj = {
            name: material.fileName,
            rcId: material.rcId
          }
          this.itemInfoData.promiseProcess.promiseProcesst.push(fileObj);
        } else {
          this.$message.error('上传失败, 请稍后重试');
        }
      },
      getchooseDept(str) {
        if (str) {
          if (str.indexOf(',') != -1) {
            let arr = str.split(',');
            return arr;
          } else {
            return [str]
          }
        }
        return []
      },
      loadNode(node,resolve ){
        this.loading = true;
        let user = this.$store.getters.curUser.attrMap;
        let id = user.SELF_DEPT_ID
        if (node.data && node.data.id) {
          id = node.data.id;
        }
        var params = {'regionCode': '', 'id': id};
        var url = this.Config.baseContext + '/mssq/pmi/getDeptListNew';
        this.$http_post(url, params).then((ret) => {
          if (ret.state == 1) {
            let defulatTree = [];
            if(!this.isNotNull(this.ksList)){
               defulatTree = [{
                id: user.SELF_DEPT_ID,
                areaCode: user.REGION_CODE,
                areaName: user.REGION_NAME,
                name: user.SELF_DEPT_NAME,
                creditCode: user.SELF_DEPT_NO,
                parentId:'#',
                children:ret.rows,
              }];
              this.ksList = defulatTree;
            }else{
              defulatTree = ret.rows
              getTree(this.ksList,id,defulatTree);
            }
            resolve(defulatTree);
            this.loading = false;
          } else {
            this.loading = false;
            // rLoading.close();
            this.$message.error(ret.message);
          }
        });
        function getTree(arr,id,defulatTree) {
          for (let i = 0; i < arr.length; i++) {
            if(arr[i].id == id){
              arr[i].children = defulatTree;
              return true
            }else{
              if(arr[i].children){
                getTree(arr[i].children,id,defulatTree);
              }
            }
          }
        }
      },
      chooseDep(type, str) {
        let _this = this;
        this.ksDialog = true;
        this.defulatChooseId = [];
        getTree(this.itemInfoData.apllyAgentNo);
        function getTree(arr) {
          if(_this.isNotNull(arr)){
            for (let i = 0; i <arr.length ; i++) {
              if(_this.isNotNull(arr[i].children)){
                getTree(arr[i].children)
              }else{
                _this.$nextTick(()=>{
                  _this.defulatChooseId = [arr[i].id];
                  console.log(_this.defulatChooseId);
                });
              }
            }
          }
        }
      },
      viewDept(type, str) {
        let _this = this;
       this.viewDeptDialog = true;
        getTree(this.itemInfoData.apllyAgentNo);
        function getTree(arr) {
          if(_this.isNotNull(arr)){
            for (let i = 0; i <arr.length ; i++) {
              if(_this.isNotNull(arr[i].children)){
                getTree(arr[i].children)
              }else{
                _this.$nextTick(()=>{
                  _this.viewExpanded = [arr[i].id];
                });
              }
            }
          }
        }
      },
      chooseDept(type, str) {
        var _this = this;
        OrganTree.show({
          head: type == 'ks' ? '选择主办内（下）设机构' : '选择部门',
          isCheckbox: type != 'ks',
          'chooseId': type == 'ks' ? this.itemInfo.selfDeptId : '0',
          //深圳市编码440301区划编码穿空字符串，不为440301就传区划编码
          rootCode: '',
          isRegion: false,
          isKs: type == 'ks',
          chooseList: this.getchooseDept(str),
          // regionDisabled: true,
          //removeCode: '160929095719',
          // isRadio:true,
          onOkClick: function (res) {
            let newObj = {};
            if (res instanceof Array) {
              if (type == 'ks') {
                getName(res)
              } else {
                for (let i = 0; i < res.length; i++) {
                  if(!res[i].name){
                    newObj.code = _this.itemInfoData.assistDeptNo;
                    newObj.name = _this.itemInfoData.assistDept;
                    newObj.id = _this.itemInfoData.assistDeptId;
                  } else if (!newObj.name) {
                    newObj.code = res[i].code;
                    newObj.name = res[i].name;
                    newObj.id = res[i].id;
                  } else {
                    newObj.code += ',' + res[i].code;
                    newObj.name += ',' + res[i].name;
                    newObj.id += ',' + res[i].id;
                  }
                }
              }
            } else {
              newObj = res
            }
            if (type == 'dept') {
              _this.itemInfoData.assistDeptNo = newObj.code;
              _this.itemInfoData.assistDept = newObj.name;
              _this.itemInfoData.assistDeptId = newObj.id;
            } else {
              _this.itemInfoData.applyAgentName = newObj.name;
            }

          }
        });
        function getName(arr, type) {
          for (let i = 0; i < arr.length; i++) {
            str[type] = {[type]: arr[i][type]};
            if (arr.children) {
              getName(arr.children, 'name')
            }
          }
        }
      },
      modelError(err, file, fileList) {
        this.$message.error('上传失败, 请稍后重试');
      },
      beforeUpload(file) {
        const isLt5M = file.size / 1024 / 1024 < 5;
        let type = true;
        if (!isLt5M) {
          this.$message.error("上传文件大小不能超过 5MB!");
        }
        var testmsg = file.name.substring(file.name.lastIndexOf('.') + 1);
        const extension1 = testmsg === 'jpg';
        const extension2 = testmsg === 'jpeg';
        const extension3 = testmsg === 'png';
        const extension4 = testmsg === 'pdf';
        // const isLt2M = file.size / 1024 / 1024 < 10
        if (!extension1 && !extension2 && !extension3 && !extension4) {
          this.$message({
            message: '上传文件只能是.jpg,.jpeg,.png,.pdf!',
            type: 'warning'
          });
          type = false
        }
        return isLt5M && type;
      },
      onPreview(file) {
        var fileIndex = file.name.lastIndexOf(".");
        file.fileType = file.name.substring(fileIndex + 1, file.name.length);
        if(file.fileType === 'pdf'){
          const rLoading = this.openLoading();
          // var url = this.Config.rcPath + "/disk/" + file.rcId;
          var url = this.Config.baseContext + "/mssq/mssqRc/disk" + file.rcId;
          this.$get_blob(url, {}, null, 'blob').then(ret => {
            rLoading.close();
            if (ret.state == 0) {
              this.$message.error(ret.message);
              return
            }
            let a = document.createElement('a');
            let url = window.URL.createObjectURL(ret);
            a.href = url;
            //设置文件名称
            let fileName = file.name;
            a.download = fileName;
            a.click();
            this.$message.success('下载成功');
          })
        }else{
          if (file.rcId == "" || file.rcId == null) {
            let rcId = file.response.row.rcId;
            let fileType = file.response.row.fileType;
            file.rcId = rcId;
            file.fileType = fileType;
          } else {
            var index = file.name.lastIndexOf(".");
            file.fileType = file.name.substring(index + 1, file.name.length);
          }
          window.open(this.Config.rcPath + "/disk/" + file.rcId);
        }
      },
      KHmodelError(err, file, fileList) {
        this.$message.error('上传失败, 请稍后重试');
      },
      KHbeforeUpload(file) {
        const isLt5M = file.size / 1024 / 1024 < 5;
        let type = true;
        if (!isLt5M) {
          this.$message.error("上传文件大小不能超过 5MB!");
        }
        var testmsg = file.name.substring(file.name.lastIndexOf('.') + 1);
        const extension1 = testmsg === 'jpg';
        const extension2 = testmsg === 'jpeg';
        const extension3 = testmsg === 'png';
        const extension4 = testmsg === 'pdf';
        // const isLt2M = file.size / 1024 / 1024 < 10
        if (!extension1 && !extension2 && !extension3 && !extension4) {
          this.$message({
            message: '上传文件只能是.jpg,.jpeg,.png,.pdf!',
            type: 'warning'
          });
          type = false
        }
        return isLt5M && type;
      },
      KHonPreview(file) {
        var fileIndex = file.name.lastIndexOf(".");
        file.fileType = file.name.substring(fileIndex + 1, file.name.length);
        if(file.fileType === 'pdf'){
          const rLoading = this.openLoading();
          // var url = this.Config.rcPath + "/disk/" + file.rcId;
          var url = this.Config.baseContext + "/mssq/mssqRc/disk" + file.rcId;
          this.$get_blob(url, {}, null, 'blob').then(ret => {
            rLoading.close();
            if (ret.state == 0) {
              this.$message.error(ret.message);
              return
            }
            let a = document.createElement('a');
            let url = window.URL.createObjectURL(ret);
            a.href = url;
            //设置文件名称
            let fileName = file.name;
            a.download = fileName;
            a.click();
            this.$message.success('下载成功');
          })
        }else {
          if (file.rcId == "" || file.rcId == null) {
            let rcId = file.response.row.rcId;
            let fileType = file.response.row.fileType;
            file.rcId = rcId;
            file.fileType = fileType;
          } else {
            var index = file.name.lastIndexOf(".");
            file.fileType = file.name.substring(index + 1, file.name.length);
          }
          window.open(this.Config.rcPath + "/disk/" + file.rcId);
        }
      },
      KHmodelRemove(file, fileList) {

      },
      KHmodelBeforeRemove(file, fileList) {
        for (let i = 0; i < this.itemInfoData.checkRequireFile.length; i++) {
          if (this.itemInfoData.checkRequireFile[i].rcId == file.rcId) {
            this.itemInfoData.checkRequireFile.splice(i, 1);
            return
          }
        }
      },
      KHmodelSuccess(response, file, fileList) {
        if (response.state == 1) {
          this.$message({
            message: '上传成功',
            type: 'success'

          });
          var material = response.row;
          var fileObj = {
            name: material.fileName,
            rcId: material.rcId
          }
          this.itemInfoData.checkRequireFile.push(fileObj);
        } else {
          this.$message.error('上传失败, 请稍后重试');
        }
      },
      validate(callback) {
        this.$refs.formName.validate((valid) => {
          if(!this.itemInfoData.promiseFrequency && (this.itemInfoData.matterType == '1' || this.itemInfoData.matterType == '4' || this.itemInfoData.matterType == '5')){
            this.$message.warning('请选择实施频率')
            return
          }
          if(!this.itemInfoData.taskObject && (this.itemInfoData.matterType == '1' || this.itemInfoData.matterType == '5')){
            this.$message.warning('请选择实施对象')
            return
          }
          if (valid) {
            callback(true);
          } else {
            callback(false)
          }
        });
      },
      showFormDetail(row) {
        this.formId = row.formId;
        this.versionId = row.formVid;
        this.formsView.formId = row.formId;
        this.formsView.newFormVersion = row.formVersion;
        this.formDetail(row);
        this.detailDialog = true;
      },
      //查看表单
      formDetail(row) {
        var formId = row.formId;
        var versionId = row.formVid;
        var formUrl = this.Config.newform_url;
        let url = this.Config.baseContext + "/mssq/pmi/getNewFormVersionDetail";
        let param = {
          formId: formId,
          versionId: versionId,
          formUrl: formUrl,
        };
        this.$http_post(url, param).then(ret => {
          if (ret.state === 1) {
            this.src = ret.row;
          } else {
            this.$message.error(ret.message);
          }
        }).catch(err => {
          console.log(err);
        })
      },
      confirm(val) {
        this.$set(this.itemInfoData, 'formId', val[0].formId);
        this.$set(this.itemInfoData, 'formName', val[0].name);
        this.$set(this.itemInfoData, 'formVersionId', val[0].id);
        this.association = false;
      },
      delFrom() {
        let formId = "";
        let formName = "";
        let newFormId = "";
        let newFormVid = "";
        let newFormName = "";
        let formIndex = this.formIndex;
        if (formIndex === -1) {
          this.itemInfoData.formId = formId;
          this.itemInfoData.formName = formName;
          this.itemInfoData.newFormId = newFormId;
          this.itemInfoData.newFormVid = newFormVid;
          this.itemInfoData.newFormName = newFormName;
        } else {
          var situations = this.itemInfoData.situations;
          situations[formIndex].formId = formId;
          situations[formIndex].formName = formName;
          situations[formIndex].newFormId = newFormId;
          situations[formIndex].newFormVid = newFormVid;
          situations[formIndex].newFormName = newFormName;
        }
      },
      __onOkClick(){
        debugger
        let _this = this;
        let name = '';
        getTree(this.chooseTree);
        this.itemInfoData.applyAgentName = JSON.parse(JSON.stringify(this.treeName));
        this.itemInfoData.apllyAgentNo = this.chooseTree;
        this.ksDialog = false;
        function getTree(arr) {
          for (let i = 0; i <arr.length ; i++) {
            if(_this.isNotNull(arr[i].children)){
              getTree(arr[i].children)
            }else{
              name = arr[i].name
            }
          }
        }
      },
      __onCancelClick(){
        this.ksDialog = false;
      },
      handleNodeClick(){

      },
      handleCheckChange(data,node){
        let _this = this;
        let list = [];
        this.$refs.tree.setCheckedKeys([data.id]);
        console.log(JSON.parse(JSON.stringify(this.ksList)))
        console.log(JSON.parse(JSON.stringify(data)),'data')
        getTree(JSON.parse(JSON.stringify(this.ksList)));
        console.log(this.ksList);
        function getTree(arr) {
          for (let i = 0; i < arr.length; i++) {
            console.log(arr[i].id,'list',data.id,arr[i].name);
            if(arr[i].id == data.id){
              console.log('true');
              // arr[i].children = [];
              list.push({
                id: arr[i].id,
                areaCode: arr[i].areaCode,
                areaName: arr[i].areaName,
                name: arr[i].name,
                creditCode:arr[i].creditCode,
                parentId:arr[i].parentId,
                children:[],
              });
              return true
            }else{
              if(_this.isNotNull(arr[i].children)){
               let a = getTree(arr[i].children);
                console.log(a,'change',arr[i],arr[i].name);
                if(a){
                  console.log(JSON.parse(JSON.stringify(list)),'111');
                  // arr[i].children = [];
                  list.push({
                    id: arr[i].id,
                    areaCode: arr[i].areaCode,
                    areaName: arr[i].areaName,
                    name: arr[i].name,
                    creditCode:arr[i].creditCode,
                    parentId:arr[i].parentId,
                    children:[],
                  })
                  return a
                }
              }
            }
          }
        }
        console.log(list);
        list.reverse();
        this.treeName = '';
        for (let i = 0; i <list.length ; i++) {
         if(!this.treeName){
           this.treeName = list[i].name
         }else{
           this.treeName += '/' + list[i].name
         }
        }
        this.chooseTree = this.ListToTree(list,'id','parentId','children');
      },
      ListToTree(tableData, idKey, parentIdKey, childKey){
        let TreeData = []
        let map = new Map()
        let outputObj,parent
        for(let i=0;i<tableData.length;i++){
          parent = tableData[i][parentIdKey]
          if(map.has(parent)){
            if(!map.get(parent)[childKey]) {
              map.get(parent)[childKey] = []
            }
            let obj = new Object(tableData[i])
            if(!map.get(obj[idKey])){
              map.get(parent)[childKey].push(obj)
              map.set(tableData[i][idKey],obj)
            }
          }else {
            outputObj = new Object(tableData[i])
            TreeData.push(outputObj)
            map.set(tableData[i][idKey],outputObj)
          }
        }
        return TreeData
      }
    },
  }
</script>

<style scoped lang="less">
  .baseInfo {
    background: #fff;
    padding: 10px;
    padding-bottom: 30px;
    .title {
      .content {
        padding: 10px 0;
      }

      display: flex;
      justify-content: space-between;
      border-bottom: 1px solid #ccc;
    }

    .base-info-content {
      padding: 10px 0 0px;
      /*border-bottom: 1px solid #e2e2e2;*/

      .el-row {
        /*border-right: 1px solid #e2e2e2;*/
        border-bottom: none;
        min-height: 48px;
      }
    }
  }

  .timeDay {
    /*border-right: 1px solid #e2e2e2;*/
    flex-direction: row;

    .el-input {
      width: 58%;
    }

    .el-form-item__content .el-select {
      /*width: 49% !important;*/
      /*padding: 0 10px;*/

      /deep/ .el-input {
        width: 100%;
      }
    }
  }

  .upload {
    /deep/ .el-upload {
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: flex-start;
    }
  }

  .el-form {
    /deep/ .el-form-item {
      .el-form-item__content {
        .el-select {
          width: 100%;
          //padding: 0 0px 0 10px;
        }

        .el-input {
          width: 100%;
        }
      }
    }
  }
  .tree-view{
    margin-right: -13px!important;
    border-right: 1px solid #dcdfe6;
    border-color: #dcdfe6!important;
    border-left: none;
  }
</style>