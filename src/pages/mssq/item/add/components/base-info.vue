<!--<style lang="less" src="@_src/pages/mssq/common/css/form.less" scoped></style>-->
<template>
  <div class="baseInfo">
    <h3 class="title"><p class="content">{{$route.query.type.indexOf('overAll') == -1?'基本信息':'统筹要素'}}</p></h3>
    <el-form :model="itemInfoData" :disabled="$route.query.type === 'view'" label-width="170px" :rules="rules" ref="itemInfoData">
      <div class="base-info-content">
        <el-row>
          <el-col :span="12">
            <el-form-item label="事项名称" prop="itemName">
              <template slot="label">
                <span>事项名称</span>
                <el-tooltip class="item" effect="dark" content="" placement="top-start">
                  <template slot="content">
                    民生诉求事项优先使用法律法规、部门规章等规范性文件中规定或使用的名称，或者用法规条文的文字进行组合，对应职责清单中的事件描述。
                  </template>
                  <i class="el-icon-warning-outline"></i>
                </el-tooltip>
              </template>
              <el-input v-model="itemInfoData.itemName" placeholder="请输入事项名称"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="事项编码" prop="itemCode">
              <template slot="label">
                <span>事项编码</span>
                <el-tooltip class="item" effect="dark" content="" placement="top-start">
                  <template slot="content">
                    指每一项民生诉求事项的唯一标识代码，同一事项应采用相同的事项编码，确保“同一事项，同一事项编码”。
                  </template>
                  <i class="el-icon-warning-outline"></i>
                </el-tooltip>
              </template>
              <el-input  v-model="itemInfoData.itemCode"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="一级索引名称" prop="primaryIndexName">
              <template slot="label">
                <span>一级索引名称</span>
                <el-tooltip class="item" effect="dark" content="" placement="top-start">
                  <template slot="content">
                    指对应民生诉求事项职责清单中的一级索引名称。
                  </template>
                  <i class="el-icon-warning-outline"></i>
                </el-tooltip>
              </template>
              <el-input  v-model="itemInfoData.primaryIndexName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="一级索引码" prop="primaryIndex">
              <template slot="label">
                <span>一级索引码</span>
                <el-tooltip class="item" effect="dark" content="" placement="top-start">
                  <template slot="content">
                    指对应民生诉求事项职责清单中的索引一级码。
                  </template>
                  <i class="el-icon-warning-outline"></i>
                </el-tooltip>
              </template>
              <el-input  v-model="itemInfoData.primaryIndex"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="二级索引名称" prop="parentName">
              <template slot="label">
                <span>二级索引名称</span>
                <el-tooltip class="item" effect="dark" content="" placement="top-start">
                  <template slot="content">
                    指对应民生诉求事项职责清单中的二级索引名称。
                  </template>
                  <i class="el-icon-warning-outline"></i>
                </el-tooltip>
              </template>
              <el-input  v-model="itemInfoData.parentName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="二级索引码" prop="parentCode">
              <template slot="label">
                <span>二级索引码</span>
                <el-tooltip class="item" effect="dark" content="" placement="top-start">
                  <template slot="content">
                    指对应民生诉求事项职责清单中的索引二级码。
                  </template>
                  <i class="el-icon-warning-outline"></i>
                </el-tooltip>
              </template>
              <el-input  v-model="itemInfoData.parentCode"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="三级索引码" prop="catalogCode">
              <template slot="label">
                <span>三级索引码</span>
                <el-tooltip class="item" effect="dark" content="" placement="top-start">
                  <template slot="content">
                    指对应民生诉求事项职责清单中的三级索引码。
                  </template>
                  <i class="el-icon-warning-outline"></i>
                </el-tooltip>
              </template>
              <el-input  v-model="itemInfoData.catalogCode"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="实施部门名称" prop="selfDeptName">
              <template slot="label">
                <span>{{qzqd?'职责部门名称':'职责部门'}}</span>
                <el-tooltip class="item" effect="dark" content="" placement="top-start">
                  <template slot="content">
                    指民生诉求事项的职责部门名称，包括市、区两级党群机关，市、区两级政府部门。
                  </template>
                  <i class="el-icon-warning-outline"></i>
                </el-tooltip>
              </template>
              <el-input  v-model="itemInfoData.selfDeptName" placeholder=""></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="事项层级" prop="level">
              <template slot="label">
                <span>事项层级</span>
                <el-tooltip class="item" effect="dark" content="" placement="top-start">
                  <template slot="content">
                    指事项实施和处置部门的级别，包括市级、区级、街道级、社区级。
                  </template>
                  <i class="el-icon-warning-outline"></i>
                </el-tooltip>
              </template>
              <el-select  v-model="itemInfoData.level">
                <el-option v-for="item in $store.getters.getDict['SSCJ']" :key="item.itemCode"
                           :label="item.itemValue"
                           :value="item.itemCode"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="管理类型" prop="manageType">
              <template slot="label">
                <span>管理类型</span>
                <el-tooltip class="item" effect="dark" content="" placement="top-start">
                  <template slot="content">
                    指民生诉求事项按管理层级划分为A类（市级事项）、B类（区级通用事项）、C类（区级自有事项）。
                  </template>
                  <i class="el-icon-warning-outline"></i>
                </el-tooltip>
              </template>
              <el-select  v-model="itemInfoData.manageType" placeholder="请选择管理类型">
                <el-option :index="index" v-for="(item,index) in $store.getters.getDict['MANAGE_TYPE']" :key="index"
                           :value="item.itemCode" :label="item.itemValue"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="业务类型" prop="itemType">
              <template slot="label">
                <span>业务类型</span>
              </template>
              <el-select v-model="itemInfoData.itemType" placeholder="请选择业务类型">
                <el-option :index="index" v-for="(item,index) in $store.getters.getDict['BUSI_TYPE']" :key="index"
                           :value="item.itemCode" :label="item.itemValue"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="设立依据" prop="catalogLaw">
              <template slot="label">
                <span>设立依据</span>
                <el-tooltip class="item" effect="dark" content="" placement="top-start">
                  <template slot="content">
                    指民生诉求事项依据的国家法律法规、地方性法律法规、权责清单、部门规章等文件。
                  </template>
                  <i class="el-icon-warning-outline"></i>
                </el-tooltip>
              </template>
              <el-input type="textarea" :rows="3" v-model="itemInfoData.catalogLaw" placeholder="请输入设立依据"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </div>
    </el-form>
  </div>
</template>

<script>
  export default {
    name: "base-info",
    data() {
      return {
        rules: {
          itemName: [
            {required: true, message: '请输入事项名称', trigger: 'blur'}
          ],
          itemCode: [
            {required: true, message: '请输入事项编码', trigger: 'blur'}
          ],
          primaryIndex: [
            {required: true, message: '请输入一级索引码', trigger: 'blur'}
          ],
          primaryIndexName: [
            {required: true, message: '请输入一级索引名称', trigger: 'blur'}
          ],
          parentCode: [
            {required: true, message: '请输入一级索引码', trigger: 'blur'}
          ],
          parentName: [
            {required: true, message: '请输入二级索引名称', trigger: 'blur'}
          ],
          catalogCode: [
            {required: true, message: '请输入三级索引码', trigger: 'blur'}
          ],
          selfDeptName: [
            {required: true, message: '请输入职责部门', trigger: 'blur'}
          ],
          deptNo: [
            {required: true, message: '请输入实施主体编码', trigger: 'blur'}
          ],
          deptType: [
            {required: true, message: '请选择实施主体性质', trigger: 'change'}
          ],
          level: [
            {required: true, message: '请选择事项层级', trigger: 'blur'}
          ],

          proHostDept: [
            {required: true, message: '请填写市级主管部门', trigger: 'blur'}
          ],
          catalogLaw: [
            {required: true, message: '请填写设立依据', trigger: 'blur'}
          ],
          manageType: [
            {required: true, message: '请选择管理类型', trigger: 'change'}
          ],
        }
      }
    },
    props: {
      qzqd:{
        type:Boolean,
        default: false,
      },
      itemInfoData: {
        type: Object,
        required: true,
      },
      flag: {
        type: Boolean,
        default: false,
      },
    },
    mounted(){
    },
    model: {
      prop: 'itemInfoData',
      event: 'change'
    },
    computed:{
     /* disabledItem(){
        return function (val) {
          let type = this.$route.query.type;
          if(type === 'view' || type === 'overAllView'){return true}
        }
      }*/
    },
    methods: {
      validate(callback) {
        this.$refs.itemInfoData.validate((valid) => {
          if (valid) {
            callback(true);
          } else {
            callback(false)
          }
        });
      },
    }
  }
</script>

<style scoped lang="less">
  .baseInfo {
    background: #fff;
    padding: 10px;

    .title {
      .content {
        padding: 10px 0;
      }

      border-bottom: 1px solid #ccc;
    }

    .base-info-content {
      padding: 10px 0 0px;

      .el-row {
        /*border-right: 1px solid #e2e2e2;*/
        border-bottom: none;
        min-height: 48px;
      }
    }
  }

  .timeDay{
    /*border-right: 1px solid #e2e2e2;*/
    flex-direction: row;
    justify-content: space-between;
    .el-input{
      width: 56%!important;
    }
    .el-form-item__content .el-select{
      width: calc(44% - 10px)!important;
      //padding: 0;
      /deep/ .el-input{
        width: 100%;
      }
    }
  }
  .inputDisabled{
    /deep/.el-input__inner,/deep/.el-textarea__inner{
      background: #f5f5f5;
      color: #606266!important;
    }
  }
  .el-form{
    /deep/.el-form-item{
      .el-form-item__content {
        .el-select{
          width: 100% ;
          //padding: 0 10px;
        }

        .el-input {
          width: 100%;
        }
      }
    }
  }
</style>