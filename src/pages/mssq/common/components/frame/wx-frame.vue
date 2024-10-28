<style lang="less" src="@_src/components/frame/admin/index.less" scoped></style>
<template>
    <router-view></router-view>
</template>
<script>
    export default {
        name: "wx-frame",
        components: {
            //组件

        },
        data() {
            return {}
        },
        watch: {},
        computed: {},
        mounted() {
//初始化皮肤
            this.theme = this.$store.getters.globalSetting.themeStyle;
            this.tooggleClass("custom-"+this.$store.getters.globalSetting.themeStyle.substr(1));
        },
        methods: {
            //换肤
            tooggleClass(className){
                if(!className){
                    return
                }
                document.body.className = className;
            },
        }
    }
</script>

<style scoped lang="less">

</style>