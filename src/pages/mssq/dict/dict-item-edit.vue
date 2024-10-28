<template>
    <div class="dict-edit">
        <el-form ref="dictItemInfo" :rules="rules" :model="dictItemInfo" status-icon label-position="right" label-width="120px">
            <el-form-item label="字典项名称:" prop="itemValue">
                <el-input v-model="dictItemInfo.itemValue" placeholder="请输入字段名称"></el-input>
            </el-form-item>
             <el-form-item label="字典项编码:" prop="itemCode">
                <el-input v-model="dictItemInfo.itemCode" :disabled="isEdit" placeholder="请输入字典编码"></el-input>
            </el-form-item>
            <el-form-item label="字典编码:" prop="dictCode">
                <el-input v-model="dictItemInfo.dictCode" :disabled="true"></el-input>
            </el-form-item>
         <!--   <el-form-item label="职责v3字典项:" >
                <el-input v-model="dictItemInfo.qzqdCode"></el-input>
            </el-form-item>-->
            <el-form-item label="描述">
                <el-input type="textarea" v-model="dictItemInfo.description" placeholder=""></el-input>
            </el-form-item>
            <el-form-item label="排序" prop="sortOrder">
                <el-input-number v-model="dictItemInfo.sortOrder" :min="1" label="请输入序号"></el-input-number>
            </el-form-item>
            <el-form-item label="是否使用" prop="status">
                <el-select v-model="dictItemInfo.status">
                    <el-option label="是" value="1"></el-option>
                    <el-option label="否" value="0"></el-option>
                </el-select>
            </el-form-item>
        </el-form>
       
    </div>
</template>
<script>
  import qzBase from '@_src/pages/mssq/common/util/qzBase';

  export default {
        mixins: [qzBase],
        components: {},
        data(){
            var validateSortOrder = (rule, value, callback) => {
                var reg=/^[1-9][0-9]{0,1}$/;
                if(!reg.test(value)){
                    callback(new Error('请输入1-99的数字'));
                }else{
                    callback();
                }
            };
        return{
            dialogVisible: false,
            dictItemInfo: {
                dictCode: "",
                dictName: "",
                node: "",
                status: "1",
            },
            rules: {
                    itemCode: [
                        { required: true, message: '请输入字典项编码', trigger: 'blur' },
                    ],
                    itemValue: [
                        { required: true, message: '请输入字典项名称', trigger: 'blur' },
                    ],
                    sortOrder: [
                        { required: true, message: '请输入排序值', trigger: 'blur' },
                        {validator: validateSortOrder,trigger: 'blur'},
                    ],
                }
            }
        },
        props:{
            data:{
                type: Object,
                default: null,
            }
        },
        watch:{
            data:{
                handler(val){
                    this.dictItemInfo = val;
                    if(this.isEmptyObject(val)){
                        this.dictItemInfo.status = "1";
                    }
                },
                immediate: true
            }
        },
        computed: {
           isEdit(){
                 var dictItemInfo = this.dictItemInfo;
                 if(!this.isEmptyObject(dictItemInfo) && this.isNotNull(dictItemInfo.id)){
                     return true;
                 }else{
                     return false;
                 }
            },
        },
        methods:{
            setData(val){
                this.dictItemInfo = val;
            },
            onSave(){
                 this.$refs.dictItemInfo.validate((valid) => {
                    if (valid) {
                            var url = this.Config.baseContext + "/mssq/pubDict/editDictItem";
                            var dictItemInfo = JSON.parse(JSON.stringify(this.dictItemInfo));
                            dictItemInfo.lastModificationTime = this.formatDate(dictItemInfo.lastModificationTime,'yyyy-MM-dd HH:mm:ss')
                            delete dictItemInfo.lastModificationTime
                            this.$http_post(url, dictItemInfo,true).then(ret => {
                            if (ret.state == 1) {
                                this.$message.success(ret.message);
                                this.$emit("close");
                            }else{
                                this.$message.error(ret.message)
                            }
                        });
                    }
                 });
            },
            onQuery(){
               
            }
        },
        mounted() {
            this.onQuery();
        }
  };
</script>
<style lang="less" scoped>
    .dict-edit{
        .el-form{
            .el-select{
                width: 100%;
            }
        }
    }
</style>

