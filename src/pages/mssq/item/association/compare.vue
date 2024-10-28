<style lang="less" src="@_src/pages/mssq/item/css/form.less" scoped></style>
<template>
   <div>
       <h2 class="flex-sb flex-row" style="padding-bottom:0;">事项列表<el-button type="text" @click="showClick" v-if="isAssociation">关联省事项列表</el-button></h2>
       <el-form  :model="cityInfo" label-width="120px"  :disabled="true">
            <div class="fromBox">
                <el-row style="height:40px;min-height:40px;">
                    <el-col :span="12" style="border-right:1px solid #e2e2e2;text-align:center;line-height:40px;background:#f5f7fa;font-weight:bold;">
                        <div><span>市事项</span></div>
                    </el-col>
                    <el-col :span="12" style="border-right:1px solid #e2e2e2;text-align:center;line-height:40px;background:#f5f7fa;font-weight:bold;">
                        <div><span>省事项</span></div>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="事项名称">
                            <el-input v-model="cityInfo.itemName"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="事项名称">
                            <el-input v-model="cityInfo.proName"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="事项编码">
                            <el-input v-model="cityInfo.itemCode"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="事项编码">
                            <el-input v-model="cityInfo.proCode"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="事项版本">
                            <el-input v-model="cityInfo.version"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="版本">
                            <el-input v-model="cityInfo.proVersion"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </div>
        </el-form>

        <el-dialog
            title="关联省事项"
            :visible.sync="show"
            :close-on-click-modal=false
            width="70%"
            class="qz-dialog-padding" append-to-body>
            <ProvinceSelect :relatedData="relatedData" :radioData="cityInfo.proCode" :type="'main'" ref="relationItem" @getSelectInfo="getSelectInfo"></ProvinceSelect>
            <span slot="footer" class="dialog-footer">
                <template>
                     <el-button @click="show=false">取消</el-button>
                     <el-button type="primary" @click="submit">确定</el-button>
                </template>
            </span>
        </el-dialog>
   </div>
</template>

<script>
    import qzBase from '@_src/pages/mssq/common/util/qzBase';
    import ProvinceSelect  from './list-select'
    export default {
        name: "CityCompare",
        mixins: [qzBase],
        components:{
           ProvinceSelect
        },
        data(){
            return{
               formInline:{
                    itemCode:''
               },
               relationDialog:false,
               show:false,
               cityInfo:{},
              childItemData:[],
               selectInfo:{},
               isAssociation:''

            }
        },
        props:{
            id:{
                type:String,
                require:false
            },
            itemId:{
                type:String,
                require:false
            },
          relatedData:{
                type:Array,
                require:false
            }
        },
        mounted(){
            this.queryInfo();
            this.childList();
        },
        watch:{
           show(val){
               if(!val){
                   this.$refs.relationItem.revert();
               }
           }
        },
        methods:{
           showClick(){
             this.show=true;
           },
            getSelectInfo(val){
                this.selectInfo = val;
            },
            submit(){
                this.show = false;
                this.cityInfo.proName = this.selectInfo.name;
                this.cityInfo.proCode = this.selectInfo.code;
                this.cityInfo.proVersion = this.selectInfo.version;
                this.cityInfo.proId = this.selectInfo.id;
            },
            revert(){
                this.cityInfo.proName = '';
                this.cityInfo.proCode = '';
                this.cityInfo.catalogCode = '';
                this.cityInfo.id = '';
                this.cityInfo.deptCode = '';
                this.cityInfo.deptName = '';

            },
            queryInfo(){
                var id = this.id;
                var url = this.Config.baseContext + "/mssq/mssqItemIndex/getItemInfoByItemVid";
                this.$http_post(url, {"itemVid":id}).then(ret => {
                    if(ret.state == 1){
                        this.cityInfo = ret.row;
                        if(this.cityInfo.ssbm==""||this.cityInfo.ssbm==null){//为空则可关联
                            this.isAssociation=true;
                        }else{
                            this.isAssociation=false;
                        }
                    }else{
                        this.$message.error(ret.message);
                    }
                });
            },
          childList(){
            var url = this.Config.baseContext + "/mssq/mssqEtlItem/selectInfo";
            this.$http_post(url, {"itemId":this.itemId}).then(ret => {
              if(ret.state == 1){
                this.childItemData = ret.rows;
              }else{
                this.$message.error(ret.message);
              }
            });
          },
            associationItem(){
             let _this = this;
                if(this.cityInfo.proCode == ""||this.cityInfo.proCode==null){
                    this.$message.error("请选择一个省事项！");
                    return
                }
                this.$confirm('是否确认关联该省事项', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                  for (let i = 0; i < _this.childItemData.length; i++) {
                    if(_this.childItemData[i].proCode == _this.cityInfo.proCode){
                      var delPro = _this.Config.baseContext + "/mssq/mssqEtlItem/delPro";
                      _this.$http_post(delPro, {
                        icityProId:_this.childItemData[i].id
                      }).then(ret => {
                        if(ret.state == 1){
                         this.getSave();
                          return
                        }else{
                          this.$message.error(ret.message);
                          return;
                        }
                      });
                    }
                  }
                  this.getSave()
                }).catch(() => {
                });

            },
          getSave(){
             let _this = this;
            var param = {
              "etlId": _this.cityInfo.proId,
              "isMain": "1",
              "itemId":  _this.cityInfo.itemId,
              "itemVid":  _this.cityInfo.itemVid,
              "proCode":  _this.cityInfo.proCode,
              "proName":  _this.cityInfo.proName,
              "proVersion": _this.cityInfo.proVersion
            };
            var url = _this.Config.baseContext + "/mssq/mssqEtlItem/proIcityAssociation";
            _this.$http_post(url, param,true).then(ret => {
              if(ret.state == 1){
                _this.$emit('close')
                _this.$message.success("关联成功！");
                _this.$emit('reload')
              }else{
                _this.$message.error(ret.message);
              }
            });
          },
        }
    }
</script>

<style scoped lang="less">
    
</style>