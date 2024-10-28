<template>
    <div class="cardBox">
        <el-tabs type="border-card" v-model="curTab" @tab-click="handleClick">
            <el-tab-pane label="事项信息">
                <item-info v-if="isShow" v-model="itemInfo" ref="tab1" :type="$route.query.type"></item-info>
            </el-tab-pane>
            <el-tab-pane label="业务办理项">
                <item-statistical v-if="isShow" v-model="itemInfo" ref="tab2" :curTab="curTabTemp"></item-statistical>
            </el-tab-pane>
            <el-tab-pane label="流转过程" v-if="tab3Visible" >
                <circulation v-if="isShow" :itemCode="itemInfo.itemCode"></circulation>
            </el-tab-pane>
            <el-tab-pane label="历史版本" v-if="tab4Visible ">
                <history-version v-if="isShow" :itemCode="itemInfo.itemCode"></history-version>
            </el-tab-pane>
        </el-tabs>
        <div class="footer" style="text-align:center">
            <template v-for="(item, index) in optData">
                <el-popover
                        v-if="item.name == '保存'"
                        placement="top-start"
                        title="说明"
                        width="240"
                        trigger="hover">
                    <p>  1、点击“保存”，保存成功，则提示“保存成功”。</p>
                    <p>  2、点击“保存”，保存失败，则提示“保存失败”。</p>
                    <el-button slot="reference" :key="index" :icon="'iconfont '+item.icon" :type="item.type" @click="optClick(item.method)">{{item.name}}</el-button>
                </el-popover>
                <el-button :key="index" v-else :icon="'iconfont '+item.icon" :type="item.type" @click="optClick(item.method)">{{item.name}}</el-button>
            </template>
        </div>
    </div>
</template>

<script>
    import ItemInfo from "./components/info/item-info";
    import itemApi from "./itemApi";
    import optData from "./optJs/opt-data";
    import ItemStatistical from "./components/statistical/item-statistical";
    import Circulation from "./components/circulation";
    import HistoryVersion from "./components/history-version";
    import OptObj from './optJs/opt-data.js'


    export default {
        name: "info",
        components: {HistoryVersion, Circulation, ItemStatistical, ItemInfo},
        mixins: [itemApi],
        data(){
            return{
                tab4Visible:false,
                tab3Visible:false,
                isShow:true,
                curTab:'',
                itemInfo:{},
                optData: [],
                curTabTemp:'0',
            }
        },
        mounted(){
            var itemVid = this.$route.query.id;
            if (this.isNotNull(itemVid)) {
                //加载事项信息
                this.queryInfo(itemVid);
            } else if (this.isNotNull(catalogId)) {
                this.initOptMethod("editItem");
                this.catalogId = catalogId;
                //加载通用目录信息

                this.queryCatalogInfo(catalogId,'Vid');
                this.editManageDialog = true;
            }
            //查询数据字典
            this.queryDictMap('BUSI_TYPE,SSCJ,MANAGE_TYPE,SSZTXZ,DAY_TYPE,CZPL,CZPLCS,TASK_TYPE,ITEM_TYPE,TASK_OBJECT', res => {
                this.$store.dispatch("setDict", res);
            });
        },
        methods:{
            queryInfo(itemVid) {
              let type = this.$route.query.type;
              var _this = this;
                if (this.isNotNull(itemVid)) {
                    var url = this.Config.baseContext + "/mssq/mssqItemIndex/getItemInfoByItemVid";
                    const rLoading = this.openLoading();
                    this.$http_post(url, {"itemVid": itemVid}).then(ret => {
                        if (ret.state == 1) {
                          rLoading.close();
                          _this.itemInfo = this.formatItemInfo(ret.row);
                            _this.itemInfo.canEdit = false;
                            if(_this.itemInfo.assistDept){

                            }
                            if( _this.itemInfo.label){
                                // this.tagInfo( _this.itemInfo.label);
                            }else{
                                this.itemInfo.labelList = [];
                            }
                            if (_this.itemInfo.version > 1) {
                                this.tab3Visible = true;
                                this.tab4Visible = true;
                                if(_this.itemInfo.regionCode==='440301' && (_this.itemInfo.manageType==='B' || _this.itemInfo.manageType==='C')){
                                    this.tab5Visible = true;
                                }
                            } else if (_this.itemInfo.status != 'DRAF') {
                                this.tab3Visible = true;
                            }
                            var status = _this.itemInfo.status;
                            var isNew = _this.itemInfo.isNew;
                            var curUser = this.$store.getters.curUser;
                            this.itemInfo.region = curUser.attrMap.REGION_CODE;
                            this.queryCatalogInfo(_this.itemInfo.catalogVid,'Vid');
                            if(!type && (status == 'ACCEPT_WAIT' || status == 'EXAMINE_WAIT')){
                              this.$router.replace({
                                path:'/item/info',
                                query:{
                                  id:this.$route.query.id,
                                  jumpType:this.$route.query.jumpType,
                                  type:'todo'
                                }
                              });
                            }else if(!type && (status === 'EXAMINE_FAIL' || status === 'ACCEPT_FAIL' || status === 'DRAF')){
                              this.$router.replace({
                                path:'/item/info',
                                query:{
                                  id:this.$route.query.id,
                                  jumpType:this.$route.query.jumpType,
                                  type:'edit'
                                }
                              });
                            }
                          type = _this.$route.query.type
                            if (isNew === '1') { //最新数据
                              if(_this.$route.query.type == 'todo' && status == 'PUBLISH'){_this.$router.go(-1)}
                                if (this.isNotNull(type) && (type == 'view' || type == 'overAllView')) {
                                    this.initOptMethod("defaultOpt");
                                    _this.itemInfo.situations = this.proEditsituation(_this.itemInfo.situations, type);
                                } else {
                                    if (status === 'DRAF') {
                                        if(type == 'overAll'){
                                            this.initOptMethod("overAllEditItem");
                                        }else{
                                            this.initOptMethod("editItem");
                                            _this.itemInfo.canEdit = true;
                                        }
                                    } else if (status === 'EXAMINE_WAIT') {
                                        if (this.isNotNull(type) && type == 'todo') {
                                            this.initOptMethod("examine")
                                        } else {
                                            this.initOptMethod("defaultOpt")
                                            _this.itemInfo.canEdit = true;
                                        }
                                    } else if (status === 'ACCEPT_WAIT') {
                                        if (this.isNotNull(type) && type == 'todo') {
                                            this.initOptMethod("accept")
                                        } else if(type == 'overAllTodo'){
                                            this.initOptMethod("overAll");
                                        } else {
                                            this.initOptMethod("defaultOpt")
                                            _this.itemInfo.canEdit = true;
                                        }
                                    } else if (status === 'EXAMINE_FAIL' || status === 'ACCEPT_FAIL' || status === 'APPROVAL_FAIL' || status === 'PUBLISH') {  //预审不通过
                                        if(type == 'overAll'){
                                            this.initOptMethod("overAllEditItem");
                                        }else{
                                            this.initOptMethod("editItem")
                                            _this.itemInfo.canEdit = true;
                                        }
                                    } else {
                                        this.initOptMethod("defaultOpt")
                                    }
                                }
                            } else {
                                if (this.isNotNull(type) && type == 'edit') {
                                    this.$message.info("当前版本非最新数据，不可编辑！");
                                }
                                this.initOptMethod("defaultOpt")
                            }
                        } else {
                            this.$message.error(ret.message);
                        }
                    }).catch(()=>{
                        rLoading.close();
                    });
                }
            },
            handleClick(tab, event) {
                this.curTab = tab.index;
                this.curTabTemp = tab.index;
                this.$refs.tab1.upDate();
                // this.$refs.tab2.setSelectItem(0,this.itemInfo);
            },
            tagInfo(id){
                var url = this.Config.baseContext + "/mssq/mssqLabel/getLabelInfo";
                this.$http_post(url, {
                    labelIds:id
                }).then(ret => {
                    if (ret.state == 1 && this.isNotNull(ret.rows)) {
                        this.itemInfo.label = this.formatCheckBoxKey( this.itemInfo.label);
                        this.itemInfo.labelList = ret.rows;
                    } else {
                        this.$message.error('获取标签信息失败');
                    }
                });
            },
            queryCatalogInfo(catalogId,type) {
                if (this.isNotNull(catalogId)) {
                    var url = this.Config.baseContext + "/mssq/mssqCatalog/getCatalogByVid";
                    let params = {"catalogVid": catalogId};
                    if(type == 'id'){
                        url = this.Config.baseContext + "/mssq/mssqCatalog/getCatalogByCatalogId";
                        params = {"catalogId": catalogId};
                    }
                    let _this = this;
                    this.$http_post(url, params).then(ret => {
                        if (ret.state == 1) {
                            this.catalogInfo = ret.row;
                            this.itemInfo.primaryIndexName = ret.row.primaryIndexName;
                            // this.itemInfo.itemName = ret.row.catalogName;
                            this.itemInfo.primaryIndex = ret.row.primaryIndex;
                            this.itemInfo.catalogName = ret.row.catalogName;
                            this.itemInfo.catalogCode = ret.row.catalogCode;
                            this.itemInfo.catalogId = ret.row.catalogId;
                            this.itemInfo.catalogVid  = ret.row.id;
                            this.itemInfo.parentName = ret.row.parentName;
                            this.itemInfo.parentCode = ret.row.parentCode;
                            if(!this.itemInfo.level){
                                this.itemInfo.level = ret.row.level;
                            }
                            if(!this.itemInfo.isStreet){
                                this.itemInfo.isStreet = 0;
                            }
                           if(!this.itemInfo.manageType){
                               this.itemInfo.manageType = ret.row.manageType;
                           }
                            if(!this.itemInfo.applyUserName){
                                this.itemInfo.applyUserName = '';
                            }
                            if(!this.itemInfo.promiseHzUnit){
                                this.itemInfo.promiseHzUnit = '1'
                            }
                            this.itemInfo.deptCode = this.$store.getters.curUser.orgCode;
                            if(this.isEmptyObject(this.itemInfo.promiseProcess) || !this.itemInfo.promiseProcess){
                                this.itemInfo.promiseProcess = {
                                    promiseProcessNote:'',
                                    promiseProcesst:[],
                                };
                            }
                            this.itemInfo.assistDeptName = '';
                            if(this.itemInfo.assistDept){
                                this.isShow = false;
                                this.getDeptName(this.itemInfo.assistDept,(v)=>{
                                    this.itemInfo.assistDeptName = v;
                                    this.isShow = true;
                                });
                            }
                            for (let i = 0; i <  this.itemInfo.situationList.length; i++) {
                                if(this.itemInfo.situationList[i].assistDept){
                                    this.isShow = false;
                                    this.getDeptName(this.itemInfo.situationList[i].assistDept,(v)=>{
                                        this.itemInfo.situationList[i].assistDeptName = v;
                                        this.isShow = true;
                                    });
                                }
                            }
                        } else {
                            this.$message.error('获取目录信息失败');
                        }
                    });
                }
            },
            getDeptName(row,callback){
                let str = '';
                var url = this.Config.baseContext + "/mssq/pmi/getDeptListToPage";
                this.$http_post(url,  {
                    deptNo:row,
                    deptName: '',
                    regionCode:this.$store.getters.curUser.attrMap.REGION_CODE,
                    page:1,
                    limit:100000
                }).then(ret => {
                    if(ret.state == 1){
                        for (let i = 0; i < ret.rows.length; i++) {
                            if(str == ''){
                                str = ret.rows[i].name
                            }else{
                                str += ',' + ret.rows[i].name
                            }
                        }
                        callback(str);
                    }
                })
            },

            initOptMethod(methodType) {
                var that = this;
                that.optData = OptObj[methodType].optData;
                // 加载方法
                Promise.all([import('./optJs/' + methodType),]).then(([result]) => {
                    const obj = result.default;
                    that.optMethod = obj;
                }).catch((error) => {
                })
            },
            optClick(method) {
                this.$refs.tab1.upDate();
                this.optMethod[method](this);//获取按钮
            },
            validate(index,callback){
                this.$refs['tab' + index].validate(1,valid => {
                    if (valid) {
                        if (index >= 2) {
                            callback(true)
                        } else {
                            if (index == 1 && this.$route.query.type != 'overAll') {
                                this.handleClick({index:'1'});
                                this.$nextTick(()=>{
                                    this.validate(++index, callback);
                                });
                            }else{
                                callback(true)
                            }
                        }
                    } else {
                        this.curTab = index + "";
                        callback(false);
                        this.$message.error("校验不通过,请检查");
                    }
                })
            },
        }
    }
</script>

<style scoped lang="less">
    .cardBox {
        position: relative;
        height: 100%;

        :deep(.el-tabs--border-card)  {
            padding-bottom: 70px;
            height: 100%;
            border: none;
            box-shadow: none;
            .el-tabs__header{
                background: #e2eaf3;
                .is-top{
                    color: #666666;
                }
            }
            .el-tabs__content {
                padding: 0 15px;
                height: calc(100% - 39px);
                overflow: auto;
                .el-tab-pane {
                    padding-bottom: 10px;
                    height: 100%;
                }
            }
        }

        .footer {
            width: 100%;
            height: 50px;
            position: absolute;
            left: 0;
            bottom: 20px;
            margin-top: 30px;

            div {
                position: absolute;
                left: 50%;
                top: 0;
                transform: translateX(-50%);

                /deep/ button {
                    width: 120px !important;
                }
            }
            /deep/.el-popover__reference-wrapper{padding:0 10px;}

        }
    }
</style>