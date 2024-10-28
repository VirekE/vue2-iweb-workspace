<template>
  <!-- 材料管理 -->
  <div class="material" ref="tableH">
    <div>
      <div class="search-box">
        <Search :fieldData="fieldData" @searchClick="searchClick">
          <template slot="footer">
            <div class="addClass">
              <el-button type="success" size="small" @click="edit({})">新增</el-button>
              <el-button type="warning" size="small" @click="clear">清除缓存</el-button>
            </div>
          </template>
        </Search>
      </div>
      <div class="tab-box">
        <el-table :data="catalogList" height="100%">
          <el-table-column type="index" label="排序" width="50"></el-table-column>
          <el-table-column label="编码" prop="code" show-overflow-tooltip width="160" min-width="160px"></el-table-column>
          <el-table-column label="授权类型" prop="authType" align="center" :formatter="formatterAuthType"></el-table-column>
          <el-table-column label="状态" prop="status" show-overflow-tooltip>
            <template slot-scope="scope">
              <el-tag type="success" v-if="scope.row.status == '1'">使用</el-tag>
              <el-tag type="danger" v-if="scope.row.status == '0'">禁用</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="备注" prop="remark" show-overflow-tooltip></el-table-column>
          <el-table-column label="操作" width="200">
            <template slot-scope="scope">
              <el-button type="text" @click="edit(scope.row)">编辑</el-button>
              <el-button type="text" @click="remove(scope.row)">删除</el-button>
              <el-button type="text" @click="addSign(scope.row)">生成签名</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="block">
          <el-pagination @current-change="handleCurrentChange" :current-page.sync="signData.page"
                         :page-size="signData.limit" layout="total,prev, pager, next, jumper"
                         :total="signData.records">
          </el-pagination>
        </div>
      </div>
    </div>
    <el-dialog
            title="配置签名"
            :visible.sync="signDialog"
            v-if="signDialog"
            width="45%"
            append-to-body
            class="qz-dialog-padding">
      <el-form :model="signObj" label-width="80px" :rules="rules" ref="signForm">
        <el-form-item label="编码" prop="code">
          <el-input v-model="signObj.code" :disabled="!!signObj.id"></el-input>
        </el-form-item>
        <el-form-item label="密钥">
          <el-input v-model="signObj.secret" disabled></el-input>
        </el-form-item>
        <el-form-item label="权限类型" prop="authType">
          <el-select v-model="signObj.authType" @change="changeType">
            <el-option v-for="item in signAuthTypes" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="权限过滤" prop="authDataId" v-if="signObj.authType == 'region'">
          <el-select v-model="signObj.authDataId">
            <el-option v-for="item in getDict['REGION']" :label="item.itemValue" :value="item.itemCode"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="权限过滤" prop="authDataName" v-if="signObj.authType == 'dept'">
          <el-input v-model="signObj.authDataName">
            <el-button slot="append" class="iconfont icon-caidan"
                       @click="chooseDept(signObj.authDataId)"></el-button>
          </el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-switch v-model="signObj.status" active-value="1" inactive-value="0"></el-switch>
        </el-form-item>
        <el-form-item label="备注">
          <el-input type="textarea" :rows="4"  v-model="signObj.remark"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
            <el-button @click="signDialog = false">取 消</el-button>
            <el-button @click="confirm" type="primary">确 认</el-button>
        </span>
    </el-dialog>
    <el-dialog
            title="生成签名"
            :visible.sync="addSignDialog"
            v-if="addSignDialog"
            width="45%"
            append-to-body
            class="qz-dialog-padding">
      <el-form :model="addSignData" label-width="80px">
        <el-form-item label="编码">
          <el-input v-model="addSignData.code" readonly></el-input>
        </el-form-item>
        <el-form-item label="随机数">
          <el-input v-model="addSignData.nonce" readonly></el-input>
        </el-form-item>
        <el-form-item label="签名">
          <el-input v-model="addSignData.sign" readonly></el-input>
        </el-form-item>
        <el-form-item label="时间戳">
          <el-input v-model="addSignData.timestamp" readonly></el-input>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
  import qzBase from '@_src/pages/mssq/common/util/qzBase';
  import OrganTree from '@_src/pages/mssq/common/components/organ'

  export default {
    name: "key",
    mixins: [qzBase],
    data() {
      let checkCode = (rule, value, callback) => {
        if(!this.signObj.id){
          let url = this.Config.baseContext + '/mssq/sign/validateSignCode';
          this.$http_post(url, {
            code: value,
          }).then(ret => {
            if (ret) {
              if (ret.state == 0) {
                callback(new Error(ret.message));
                return;
              }
              this.getSecret();
              callback();
            } else {
              callback(new Error('当前编码已存在'))
            }
          });
        }else{
          callback();
        }
      };
      return {
        signDialog: false,
        addSignDialog: false,
        addSignData: {},
        fieldData: {
          signCode: {
            label: '编码',
            type: 'Input',
            placeholder: '请输入编码',
            value: '',
            span: 8,
            itemWidth: '50px',
          },
          Button: {
            type: 'Button',
            span: 16
          }
        },
        signAuthTypes: [{
          label: '全部',
          value: 'all'
        }, {
          label: '区划',
          value: 'region'
        }, {
          label: '部门',
          value: 'dept'
        }],
        catalogType: 1,
        getDict: {},
        searchFiled: {
          signCode: '',
        },
        tableHeight: 100,
        catalogList: [],
        signData: {
          page: 1,
          limit: 10,
          total: 0
        },
        rules: {
          code: [
            {required: true, message: '请输入编码', trigger: 'blur'},
            {
              required: true,
              validator: checkCode,
              trigger: 'blur'
            },
          ],
          authType: [
            {required: true, message: '请选择权限类型', trigger: ['blur', 'change']}
          ],
          authDataId: [
            {required: true, message: '请选择权限', trigger: ['blur', 'change']}
          ],
          authDataName: [
            {required: true, message: '请选择权限', trigger: ['blur', 'change']}
          ]
        },
        title: '',
        dialogVisible: false,
        activeIndex: '1',
        signObj: {
          authDataName: '',
          authDataId: '',
          secret: '',
          authType: '',
          code: '',
          remark: '',
          status: 1
        },
      }
    },
    computed: {},
    watch: {
      $route: {
        handler(val) {
          this.onQuery();
        },
        deep: true,
        immediate: true
      },
      level: {
        handler(list) {
          if (list) {
            let res = [];
            list.forEach((item) => {
              res.push({
                id: item.itemCode,
                name: item.itemValue
              })
            });
            this.fieldData.level.selectList = res
          }
        }
      },
    },
    mounted() {
      // this.onQuery();
      this.queryDict("REGION", res => {
        this.getDict = res;
      });
      //表格高度自适应
      this.$nextTick(() => {
        this.tableHeight = this.$refs.tableH.offsetHeight - 210;
      });
      window.onresize = () => {
        return (() => {
          this.tableHeight = this.$refs.tableH.offsetHeight - 210;
        })();
      };
    },

    methods: {
      onQuery() {
        var url = this.Config.baseContext + "/mssq/sign/selectSignList";
        // this.searchFiled.type = this.catalogType
        this.searchFiled.page = this.signData.page
        this.searchFiled.limit = this.signData.limit
        this.$http_post(url, this.searchFiled).then(ret => {
          if (ret.state == 1) {
            this.catalogList = ret.rows;
            this.signData.records = ret.records;
            window.getNums(ret.records);
          } else {
            this.$message.error(ret.message);
          }
        });
      },
      searchClick(val) {
        this.searchFiled = {
          signCode: val.signCode.value,
        };
        this.onQuery();
      },
      handleCurrentChange(val) {
        this.signData.page = val;
        this.onQuery();
      },
      formatterAuthType(row){
        for (let i = 0; i < this.signAuthTypes.length; i++) {
          if(this.signAuthTypes[i].value == row.authType){
            return this.signAuthTypes[i].label
          }
        }
      },
      edit(row) {
        this.signObj = {
          id: row.id,
          authDataName: row.authDataName,
          authDataId: row.authDataId,
          secret: row.secret,
          authType: row.authType,
          code: row.code,
          remark: row.remark,
          status: row.status
        };
        this.signDialog = true;
      },
      clear() {
        this.$confirm('清理后，签名更改将立即生效', '确认清理签名缓存?', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          showCancelButton: true,
        }).then(() => {
          var url = this.Config.baseContext + "/mssq/sign/clearCache";
          this.$http_post(url, {}).then(ret => {
            if (ret.state == 1) {
              this.$message.success(ret.message);
            } else {
              this.$message.error(ret.message);
            }
          });
        })
      },
      remove(row) {
        this.$confirm('是否删除【' + row.code + '】签名', '提示?', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          showCancelButton: true,
        }).then(() => {
          var url = this.Config.baseContext + "/mssq/sign/deleteSign";
          this.$http_post(url, {id: row.id}).then(ret => {
            if (ret.state == 1) {
              this.$message.success('删除成功');
              this.onQuery();
            } else {
              this.$message.error(ret.message);
            }
          });
        })
      },
      addSign(row) {
        this.addSignDialog = true;
        var url = this.Config.baseContext + "/mssq/sign/genSignResult";
        this.$http_get(url, {id: row.id}).then(ret => {
          if (ret.state == 1) {
            this.addSignData = ret.row;
          } else {
            this.$message.error(ret.message);
          }
        });
      },
      chooseDept(str) {
        var _this = this;
        OrganTree.show({
          head: '选择部门',
          isCheckbox: false,
          'chooseId': '0',
          //深圳市编码440301区划编码穿空字符串，不为440301就传区划编码
          rootCode: '',
          isRegion: false,
          chooseList: this.getchooseDept(str),
          regionDisabled: true,
          //removeCode: '160929095719',
          // isRadio:true,
          onOkClick: function (res) {
            _this.$set(_this.signObj, 'authDataId', res.id);
            _this.$set(_this.signObj, 'authDataName', res.name);
          }
        })
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
      getSecret() {
        var url = this.Config.baseContext + "/mssq/sign/genSignSecret";
        this.$http_post(url, {}).then(ret => {
          if (ret.state == 1) {
            this.signObj.secret = ret.row;
          } else {
            this.$message.error(ret.message);
          }
        });
      },
      changeType() {
        this.signObj.authDataId = '';
        this.signObj.authDataName = '';
      },
      confirm() {
        this.$refs.signForm.validate(valid => {
          if (valid) {
            var url = this.Config.baseContext + "/mssq/sign/saveSign";
            if (this.signObj.id) {
              url = this.Config.baseContext + "/mssq/sign/updateSign";
            }
            this.$http_post(url, this.signObj, true).then(ret => {
              if (ret.state == 1) {
                this.$message.success('保存成功');
                this.onQuery();
                this.signDialog = false;
              } else {
                this.$message.error(ret.message);
              }
            });
          }
        })
      },
    }
  }
</script>

<style scoped lang="less">
  .material {
    position: relative;
    height: 100%;

    & > div {
      height: 100%;
      background: #f8f8f8;
      display: flex;
      flex-direction: column;

      .search-box {
        background: #fff;
        margin-bottom: 10px;
        width: 100%;
        padding: 10px 14px 0 14px;
      }
    }

    .el-menu-demo {
      margin-bottom: 15px;
      margin-top: -15px;

      .el-menu-item {
        margin-right: 20px;
        height: 52px;
        line-height: 52px;
      }
    }

    .block {
      text-align: right;
      height: 50px;
      z-index: 999;
      background: #fff;
    }
  }

  .programme-btn {
    text-align: center;
    padding-bottom: 10px;

    /deep/ .el-popover__reference-wrapper {
      padding: 0 10px;
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

  // table自适应
  .tab-box {
    flex: 1;
    display: flex;
    flex-direction: column;
    height: calc(100% - 200px);
    background: #fff;
    padding: 0px 14px;

    .block {
      padding: 10px 0;
    }
  }

  .addClass {
    padding-left: 10px;
  }
</style>
