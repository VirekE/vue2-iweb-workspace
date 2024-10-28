<template>
    <div class="page-header" :class="divider?'divider':''">
        <el-popover
                v-if="$route.query.pageType == 'history'"
                placement="top-start"
                title="说明"
                width="240"
                trigger="hover">
            <p> 点击“返回”，将会关闭本页面。</p>
            <template slot="reference">
                <el-button type="text" icon="el-icon-back" @click="goBack">
                    {{backText}}
                </el-button>
            </template>
        </el-popover>
        <el-button v-if="$route.query.pageType !== 'history'" type="text" icon="el-icon-back" @click="goBack">{{backText}}</el-button>
        <el-divider direction="vertical" v-if="subTitle.length > 0"></el-divider>
        <span>{{subTitle}}</span>
        <div class="opt">
            <slot>

            </slot>
        </div>
    </div>
</template>
<script>
export default {
    props:{
        backText:{
            type: String,
            default: '返回'
        },
        subTitle:{
            type:String,
            default: ''
        },
        divider:{
            type:Boolean,
            default: true
        }
    },
    methods:{
        goBack() {
            if(this.$route.query.pageType == 'history'){
                window.close();
            }else{
                this.$router.go(-1);
            }
        }
    }
}
</script>
<style lang="less" scoped>
 .page-header{
     margin-bottom:20px;
    .opt{
        float:right;
        margin-right:20px;
    }
}
.page-header.divider{
    border-bottom:1px solid #DBDFE6;
}
</style>


