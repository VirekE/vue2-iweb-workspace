<template>
    <!-- 服务对象分类 -->
    <div class="theme-tree">
        <el-tree :data="data"
                 :props="defaultProps"
                 :show-checkbox="isCheckbox"
                 ref="tree"
                 @check-change="handleCheckChange"
                 node-key="code"
                 :default-expanded-keys="expanded"
                 :default-checked-keys="value"
                 v-if="show"></el-tree>
    </div>
</template>
<script>
    import qzBase from '@_src/pages/mssq/common/util/qzBase';
    export default {
        mixins: [qzBase],
        data() {
            return {
                data: [],
                defaultProps: {
                    children: 'children',
                    label: 'name'
                },
                themeList: [],
                show: true//刷新内容
            }
        },
        props: {
            expanded: {//默认展开值
                type: Array,
                default: () => {
                    return []
                }
            },
            isCheckbox: {
                type: Boolean,
                default: true//true为多选，false为单选
            },
            value: {//已选中值
                type: Array,
                default: () => {
                    return []
                }
            },
            fwType: {
                type:String,
                default: ""
            }
        },
        watch: {
            expanded() {//默认展开数据改变就刷新组件
                this.show = false;
                this.$nextTick(() => {
                    this.show = true;
                });
            },
            fwType(val){
                this.getThemeData();
            }
        },
        mounted() {
            this.getThemeData();
        },
        computed: {
        },
            methods: {
                getThemeData() {
                    const rLoading = this.openLoading();
                    let that = this;
                    let url = this.Config.baseContext + '/admin/themeClassify/getThemeClassifyTreeList';
                    this.$http_post(url, null).then((ret) => {
                        if (ret.state == 1) {
                            var list=[];
                            if(this.fwType==='all'){
                                that.data =ret.rows;
                            }else if(that.fwType==='gr'){
                                for(let i=0;i<ret.rows.length;i++){
                                    if(ret.rows[i].code==='001'){
                                        list.push(ret.rows[i]);
                                    }
                                }
                                that.data =list;
                            }else if(that.fwType==='fr'){
                                for(let i=0;i<ret.rows.length;i++){
                                    if(ret.rows[i].code==='002'){
                                        list.push(ret.rows[i]);
                                    }
                                }
                                that.data =list;
                            }
                            rLoading.close();
                        } else {
                            rLoading.close();
                            this.$message.error(ret.message);
                        }
                    });
                },
                handleCheckChange(currentVal) {
                    console.log(this.$refs.tree.getCheckedNodes(true, false));
                    this.themeList = this.$refs.tree.getCheckedNodes(true, false);
                    this.$emit('checkChange', this.themeList, currentVal);
                }
            }
        }
</script>
<style lang="less" scoped>
    /deep/ .el-checkbox__inner{
        margin-right: 5px;
    }
</style>


