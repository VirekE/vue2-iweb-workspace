<template>
    <div class="edit-dict">
        <el-form ref="dictInfo" :rules="rules" :model="dictInfo" status-icon label-position="right" label-width="100px">
            <el-row>
                <el-col :span="24">
                    <el-form-item label="字典名称:" prop="dictName">
                        <el-input v-model="dictInfo.dictName" placeholder="请输入字段名称"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="字典编码:" prop="dictCode">
                        <el-input v-model="dictInfo.dictCode" :disabled="isEdit" placeholder="请输入字典编码"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="是否使用" prop="status">
                        <el-select v-model="dictInfo.status">
                            <el-option label="是" value="1"></el-option>
                            <el-option label="否" value="0"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24">
                    <el-form-item label="描述" prop="description">
                        <el-input type="textarea" v-model="dictInfo.description" placeholder="请输入字典描述"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
    </div>
</template>
<script>
    import qzBase from '@_src/pages/mssq/common/util/qzBase';
    export default {
        mixins: [qzBase],
        components: {},
        data(){
        return{
            dialogVisible: false,
            dictInfo: {
                dictCode: "",
                dictName: "",
                node: "",
                isUse: "1",
            },
            rules: {
                    dictCode: [
                        { required: true, message: '请输入字典编码', trigger: 'blur' },
                    ],
                    dictName: [
                        { required: true, message: '请输入字典名称', trigger: 'blur' },
                    ]
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
                    this.dictInfo = val;
                    if(this.isEmptyObject(val)){
                        this.dictInfo.status = "1";
                    }
                },
                immediate: true
            }
        },
        computed: {
           isEdit(){
                 var dictInfo = this.dictInfo;
                 if(!this.isEmptyObject(dictInfo) && this.isNotNull(dictInfo.id)){
                     return true;
                 }else{
                     return false;
                 }
            },
        },
        methods:{
            setData(val){
                this.dictInfo = val;
            },
            onSave(){
                 this.$refs.dictInfo.validate((valid) => {
                    if (valid) {
                            var url = this.Config.baseContext + "/mssq/pubDict/editDict";
                            var dictInfo = JSON.parse(JSON.stringify(this.dictInfo));
                            dictInfo.createTime = this.formatDate(dictInfo.createTime,'yyyy-MM-dd HH:mm:ss')
                            delete dictInfo.createTime;
                            this.$http_post(url, dictInfo,true).then(ret => {
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
   .edit-dict{
       .el-form{
           .el-select{
               width:100%;
           }
       }
   }
</style>

