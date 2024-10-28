<template>
    <div class=" material" ref="tableH">
        <div class="material-form opera">
            <el-form :model="formInline"  label-width="80px" size="small">
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="事项名称">
                            <el-input v-model="formInline.name" placeholder="请输入事项名称"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="事项编码">
                            <el-input v-model="formInline.code" placeholder="请输入事项编码"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item class="form-btn">
                          <el-button type="primary" icon="el-icon-search" @click="search()">查询</el-button>
                          <el-button type="primary" plain icon="el-icon-refresh-left" @click="revert">重置</el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </div>
            <el-table :data="tableData"
                      style="width: 100%;height:100%"
                      ref="cerTable"
                      class="qz-table-hide"
                      row-key="id"
                      @selection-change="handleSelectionChange">
              <el-table-column v-if="type == 'children'" :selectable='selectEnable' :reserve-selection="true" type="selection"></el-table-column>
            <el-table-column label="" width="65" v-else-if="type == 'main'">
                <template scope="scope">
                    <el-radio :label="scope.row.code" v-model="selectId" @change.native="getTemplateRow(scope.$index,scope.row)">&nbsp</el-radio>
                </template>
            </el-table-column>
            <el-table-column label="事项名称" prop="name" show-overflow-tooltip></el-table-column>
            <el-table-column label="事项编码" prop="code" show-overflow-tooltip></el-table-column>
            <el-table-column label="事项状态" prop="status" width="100px" :formatter="formatterStatus"></el-table-column>
        </el-table>
        <div class="block">
            <el-pagination
                    @current-change="handleCurrentChange"
                    :current-page.sync="itemParams.page"
                    :page-size="itemParams.limit"
                    layout="total,prev, pager, next, jumper"
                    :total="itemParams.total">
            </el-pagination>
        </div>
    </div>
</template>

<script>
    import qzBase from '@_src/pages/mssq/common/util/qzBase';
    import OrganTree from '@_src/pages/mssq/common/components/organ';
    export default {
        name: "ProvinceSelect",
        mixins: [qzBase],
        data(){
            return{
                outerVisible:false,
                innerVisible:false,
                brandFold:true,
                relationDialog:false,
                formInline:{
                    name:'',
                    code:'',
                },
                selectId:'',
                orgForSearch:'',
                tableHeight:300,
                tableData: [],
                itemParams:{
                    page:1,
                  limit:10,
                    total:0
                },
                provinceInfo:{},
                selectInfo:'',
              selectRows:[],
            }
        },
        props:{
            dictMap:{//默认展开值
                type: Object,
                require:false
            },
            type:{//默认展开值
                type: String,
                require:''
            },
          relatedData:{
            type: Array ,
            require:false
          },
          radioData:{
            type: String ,
            require:''
          }
        },
        watch:{

        },
        mounted(){
            this.tabH();
            if(this.radioData){
              this.selectId = this.radioData
            }
            //获取用户
            var curUser = this.$store.getters.curUser;
            var roleValue = curUser.roleValue

            var roleArr = roleValue.split(",");
            for(var i = 0 ;i<roleArr.length;i++){
                if(roleArr[i] == "ZSJSH"){
                    this.orgForSearch = true;
                }else{
                    this.orgForSearch = false;
                }
            }
        },
      computed:{
        selectEnable(){
          let _this = this;
         return function (val){
           for (let i = 0; i < _this.relatedData.length; i++) {
             console.log(_this.relatedData[i] , val.id,'test')
             if(_this.relatedData[i].proCode == val.code){
               return false
             }
           }
           return true
         }
        },
      },
        methods:{
            //表格高度自适应
            tabH(){
                let _this=this;
                this.$nextTick(() => {
                    _this.tableHeight = _this.$refs.tableH.offsetHeight - 200;
                });
                window.onresize = () => {
                    return (() => {
                        _this.tableHeight = _this.$refs.tableH.offsetHeight - 200;
                    })();
                };
                // //加载事项类型字典
                // this.queryDictMap("TASK_TYPE,BUSI_GROUP,ITEM_STATUS",(res) =>{
                //     this.dictMap = res
                // });
                //加载列表
                var pageParam = this.itemParams
                var searchParam = this.formInline
                this.onQuery(pageParam,searchParam);

            },
            //展开收起
            changeFoldState(){
                this.brandFold = !this.brandFold;
                this.tabH();
            },
            handleOpen(key, keyPath) {
                console.log(key, keyPath);
            },
            handleClose(key, keyPath) {
                console.log(key, keyPath);
            },
            onQuery(pageParam,searchParam){
                var url = this.Config.baseContext + "/mssq/mssqEtlItem/selectProList";
                var param = Object.assign({},pageParam,searchParam);
                this.$http_post(url, param).then(ret => {
                    if(ret.state == 1){
                      this.tableData = ret.rows;
                      this.itemParams.total = ret.records;
                      for (let i = 0; i < this.relatedData.length; i++) {
                        for (let j = 0; j < this.tableData.length; j++) {
                          if(this.relatedData[i].proCode == this.tableData[j].code){
                            this.$nextTick(()=>{
                              this.$refs.cerTable.toggleRowSelection(this.tableData[j],true);
                            })
                          }
                        }
                      }
                    }else{
                        this.$message.error(ret.message);
                    }
                });
            },
          handleSelectionChange(val) {//多选条款结果
            this.selectRows = val;
            // this.$emit("selectChange",val);
          },
            handleCurrentChange(val){
                this.itemParams.page = val;
                var pageParam = this.itemParams;
                var searchParam = this.formInline;
                this.onQuery(pageParam,searchParam)
            },
            reload(){
                this.itemParams={page:1, total:0,  limit:10};
                var pageParam = this.itemParams
                var searchParam = this.formInline
                this.onQuery(pageParam,searchParam);
            },
            search(){
                this.reload();
            },
            chooseDep(){
                var _this = this
                OrganTree.show({
                    head: '部门选择',
                    isCheckbox: false,
                    rootCode: '440300',
                    isRegion: false,
                    regionDisabled: true,
                    removeCode: '160929095719',
                    //isRadio:true,
                    onOkClick: function(res){
                        console.log(res)
                        if(!this.isEmptyObject(res)  && res.code!=undefined){
                            _this.formInline.deptNo = res.code
                            _this.formInline.deptName = res.name
                        }
                    }
                });
            },
            revert(){
                this.formInline={
                    taskName:'',
                    taskCode:'',
                    catalogCode:'',
                    deptNo:'',
                    deptName:'',
                    isAssociation:'0'
                }
                this.reload()
            },
            getTemplateRow(val,row){
                this.$emit("getSelectInfo",row)
            },
            formatterStatus(){
                 return "发布";
            },
          save(data,callback){
            var url = this.Config.baseContext + "/mssq/mssqEtlItem/correlationInfo";
            var param = [];
            for (let i = 0; i < this.selectRows.length; i++) {
              let flag = true;
              if(this.selectRows[i].code == data.proCode){
                this.$message.warning(this.selectRows[i].name+'主事项已选择')
                return
              }
              for (let j = 0; j < this.relatedData.length; j++) {
                if(this.relatedData[j].proCode == this.selectRows[i].code){
                  flag = false;
                  this.selectRows.splice(i,1)
                  i--
                  break;
                }
              }
              if(flag){
                param.push({
                  "etlId": this.selectRows[i].id,
                  "isMain": "0",
                  "itemId": data.itemId,
                  "itemVid": data.itemVid,
                  "proCode": this.selectRows[i].code,
                  "proName": this.selectRows[i].name,
                  "proVersion": this.selectRows[i].version
                })
              }
            }
            this.$http_post(url, param,true).then(ret => {
              if(ret.state == 1){
                callback(true)
              }else{
                callback(ret.message)
                this.$message.error(ret.message);
              }
            });
          }
        }
    }
</script>
<style scoped lang="less">
    .material{
        position: relative;
        height: 100%;
        padding: 20px;
        .el-menu-demo{
            margin-bottom: 15px;
            margin-top: -15px;
            .el-menu-item{
                margin-right: 20px;
                height: 52px;
                line-height: 52px;
                padding: 0 28px;
            }
        }
        .block{
            text-align: right;
            //position: absolute;
            left: 0;
            right: 20px;
            bottom: 0px;
            background: #fff;
        }
        .view{
            display: flex;
            border: 1px solid #e2e2e2;
            .box-left{
                width: 200px;
                border: none;
                /deep/ .el-card__header{
                    padding: 13.3px 20px;
                    background: #f5f7fa;
                }
                /deep/ .el-card__body{
                    padding: 0;
                    .item{
                        overflow: auto;
                    }
                }
            }
            .box-right{
                border: none;
                position:relative;
                border-left: 1px solid #e2e2e2;
                border-radius: 0;
                display: inline-block;
                width: calc(100% - 200px);
                /deep/ .el-card__body{
                    padding: 0;
                }
            }
        }
        .el-menu{
            border-right: none;
            height: 100%;
        }
        /deep/.el-menu-item{
            height:40px;
            line-height:40px;
        }
        /deep/.el-menu-item.is-active{

        }
    }
    /deep/.el-radio-button__inner{
        padding: 7px 22px!important;
        margin-right: 10px;
        border-radius: 0!important;
    }
    .block{
        text-align: right;
        margin: 10px;
    }
    .el-menu-vertical-demo{
        .el-menu-item.is-active{
            color:#303133;
        }
        .el-menu-item{
            border-left:3px solid transparent;

        }

    }
    .view{
        margin-top:15px;
    }
    .searchCon{
        position:absolute;
        left:0;
        top:62px;
        width:100%;
        min-height:60px;
        z-index:222;
        background:#fff;
        box-shadow: 0 0px 20px rgba(0, 0, 0, 0.175);
        padding:20px;
        .el-row{
            padding: 6px 0;
        }
        /deep/.el-form-item{
            width:100% !important;
            .el-form-item__content{
                width:100%;
                margin:0!important;
            }
        }
        .el-col-2{
            text-align:right;
            padding:0 14px;
        }
        .searCheck{
            .el-col-2{
                margin-top:16px;
            }
        }
        /deep/.programme-btn{
            .el-form-item__content{
                display:flex;
                justify-Content:center;
            }
        }
    }
    .searchCon-view{
        /deep/ .el-form-item{
            .el-col{
                padding-left:0!important;
            }
        }
    }
    /deep/ .el-select{
        width:100%;
    }
    .el-table{

    }


    .el-dialog{
        /deep/ .el-form-item{
            margin-bottom:20px !important;
        }
    }
</style>