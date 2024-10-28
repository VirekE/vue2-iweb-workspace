<!--<style lang="less" src="@_src/pages/mssq/common/css/form.less" scoped></style>-->
<template>
  <div class="baseInfo">
    <h3 class="title"><p class="content">基本信息</p></h3>
    <el-form :model="itemInfo" :disabled="flag" label-width="170px" :rules="rules" ref="itemInfo">
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
              <el-input class="inputDisabled" v-model="itemInfo.itemName" disabled placeholder="请输入事项名称"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="事项编码">
              <template slot="label">
                <span>事项编码</span>
                <el-tooltip class="item" effect="dark" content="" placement="top-start">
                  <template slot="content">
                    指每一项民生诉求事项的唯一标识代码，同一事项应采用相同的事项编码，确保“同一事项，同一事项编码”。
                  </template>
                  <i class="el-icon-warning-outline"></i>
                </el-tooltip>
              </template>
              <el-input class="inputDisabled" v-model="itemInfo.itemCode" disabled></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="一级索引名称">
              <template slot="label">
                <span>一级索引名称</span>
                <el-tooltip class="item" effect="dark" content="" placement="top-start">
                  <template slot="content">
                    指对应民生诉求事项职责清单中的一级索引名称。
                  </template>
                  <i class="el-icon-warning-outline"></i>
                </el-tooltip>
              </template>
              <el-input class="inputDisabled" v-model="itemInfo.primaryIndexName" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="一级索引码">
              <template slot="label">
                <span>一级索引码</span>
                <el-tooltip class="item" effect="dark" content="" placement="top-start">
                  <template slot="content">
                    指对应民生诉求事项职责清单中的索引一级码。
                  </template>
                  <i class="el-icon-warning-outline"></i>
                </el-tooltip>
              </template>
              <el-input class="inputDisabled" v-model="itemInfo.primaryIndex" disabled></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="二级索引名称">
              <template slot="label">
                <span>二级索引名称</span>
                <el-tooltip class="item" effect="dark" content="" placement="top-start">
                  <template slot="content">
                    指对应民生诉求事项职责清单中的二级索引名称。
                  </template>
                  <i class="el-icon-warning-outline"></i>
                </el-tooltip>
              </template>
              <el-input class="inputDisabled" v-model="itemInfo.parentName" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="二级索引码">
              <template slot="label">
                <span>二级索引码</span>
                <el-tooltip class="item" effect="dark" content="" placement="top-start">
                  <template slot="content">
                    指对应民生诉求事项职责清单中的索引二级码。
                  </template>
                  <i class="el-icon-warning-outline"></i>
                </el-tooltip>
              </template>
              <el-input class="inputDisabled" v-model="itemInfo.parentCode" disabled></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="三级索引码">
              <template slot="label">
                <span>三级索引码</span>
                <el-tooltip class="item" effect="dark" content="" placement="top-start">
                  <template slot="content">
                    指对应民生诉求事项职责清单中的三级索引码。
                  </template>
                  <i class="el-icon-warning-outline"></i>
                </el-tooltip>
              </template>
              <el-input class="inputDisabled" v-model="itemInfo.catalogCode" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="职责部门" prop="selfDeptName">
              <template slot="label">
                <span>{{qzqd?'职责部门名称':'职责部门'}}</span>
                <el-tooltip class="item" effect="dark" content="" placement="top-start">
                  <template slot="content">
                    指民生诉求事项的职责部门名称，包括市、区两级党群机关，市、区两级政府部门。
                  </template>
                  <i class="el-icon-warning-outline"></i>
                </el-tooltip>
              </template>
              <el-input class="inputDisabled" v-model="itemInfo.selfDeptName" disabled placeholder="请输入实施部门名称"></el-input>
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
              <el-select class="inputDisabled" v-model="itemInfo.level" disabled>
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
              <el-select class="inputDisabled" v-model="itemInfo.manageType" disabled placeholder="请选择管理类型">
                <el-option :index="index" v-for="(item,index) in $store.getters.getDict['MANAGE_TYPE']" :key="index"
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
              <el-input type="textarea" disabled class="inputDisabled" :rows="3" v-model="itemInfo.catalogLaw" placeholder="请输入设立依据"></el-input>
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
          name: [
            {required: true, message: '请输入办理项名称', trigger: 'blur'}
          ],
        }
      }
    },
    mounted() {
    },
    props: {
      currentSituation: {
        type: Object,
        required: true,
      },
      itemInfo: {
        type: Object,
        required: true,
      },
      flag: {
        type: Boolean,
        default: false
      },
      qzqd:{
        type:Boolean,
        default: false,
      },
    },
    model: {
      prop: 'currentSituation',
      event: 'change'
    },
    methods: {
      validate(callback) {
        this.$refs.itemInfo.validate((valid) => {
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
    /*border-bottom: 1px solid #e2e2e2;*/

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
    .el-input{
      width: 58%;
    }
    .el-form-item__content .el-select{
      width: calc(42% - 10px)!important;
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
          //width: 100%;
        }
      }
    }
  }
</style>