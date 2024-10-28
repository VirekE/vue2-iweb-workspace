import qzBase from '@_src/pages/mssq/common/util/qzBase';

export default{
    mixins:[qzBase],
    data () {
        return {
            itemInfo:{
                promiseProcess:{
                    promiseProcessNote:'',
                    promiseProcesst:[],
                },
                matterType:'',
                taskType:'',
                promiseHz:'',
                // promiseHzUnit:'',
                label:[],
                labelList:[],
                primaryIndexName:'',
                primaryIndex:'',
                catalogName:'',
                catalogCode:'',
                parentName:'',
                parentCode:'',
                promiseFrequency:'',
                level:'',
                assistDept:'',
                assistDeptName:'',
                isStreet:'',
                situationList:[],
                promiseHzUnit:'1',
            }
        }
    },
    methods: {
        // 将数据库中查询后的事项信息进行格式化，渲染页面
        formatItemInfo(obj){
            let itemInfo = JSON.parse(JSON.stringify(obj))
            itemInfo.promiseProcess = this.changeObject( itemInfo.promiseProcess);
            if(!this.isNotNull(itemInfo.taskType)){
                this.$set(itemInfo,'taskType','');
            }
           // let arr = '[{"name":"受理分拨","deptCode":"","deptName":"","deptId":""},{"name":"办结","deptCode":"","deptName":"","deptId":""}]'
           //  itemInfo.promiseProcess.promiseProcessNote = JSON.parse(arr);
            if(!this.isNotNull(itemInfo.checkRequire)){
                this.$set(itemInfo,'checkRequire','无');
            }
            if(!this.isNotNull(itemInfo.matterType)){
                this.$set(itemInfo,'matterType','');
            }
            if(!this.isNotNull(itemInfo.promiseFrequency)){
                this.$set(itemInfo,'promiseFrequency','');
            }
            if(!this.isNotNull(itemInfo.taskObject)){
                this.$set(itemInfo,'taskObject','');
            }
            if(!itemInfo.applyDeptName){
                itemInfo.applyDeptName = itemInfo.selfDeptName;
                itemInfo.applyDeptNo = itemInfo.selfDeptNo;
            }

            itemInfo.fileList = this.formatCheckBoxKey( itemInfo.fileList);
            itemInfo.checkRequireFile = this.changeArr( itemInfo.checkRequireFile);
            // itemInfo.checkRequireFile = [];
            itemInfo.isStreet = this.forNum( itemInfo.isStreet);
            if(itemInfo.apllyAgentNo){
                itemInfo.apllyAgentNo = JSON.parse(itemInfo.apllyAgentNo);
            }
            var situations = itemInfo.situationList;
            if(!this.isEmptyObject(situations)){
                for(let i=0;i<situations.length;i++){
                    var situation = situations[i];
                    situation.promiseProcess = this.changeObject(situation.promiseProcess);
                    if(!situation.assistDeptName){
                        situation.assistDeptName = '';
                    }
                    if(situation.apllyAgentNo){
                        situation.apllyAgentNo = JSON.parse(situation.apllyAgentNo);
                    }
                    // situation.promiseProcess.promiseProcessNote = JSON.parse(arr);
                    if(!situation.applyDeptName){
                        situation.applyDeptName = itemInfo.selfDeptName;
                        situation.applyDeptNo = itemInfo.selfDeptNo;
                    }
                    situation.isStreet = Number(situation.isStreet);
                    situation.proEdit=true;
                    if(itemInfo.status =="DRAF" || itemInfo.status == "PUBLISH"){
                        situation.canEdit=true;
                    }else {
                        situation.canEdit=false;
                    }
                }
            }
            return itemInfo;
        },
        //获取页面数据，并转换为后台数据进行存贮
        getSaveInfo() { //暂存事项信息;
            let itemInfo =  JSON.parse(JSON.stringify(this.itemInfo));
            itemInfo.promiseProcess = this.formatObject( itemInfo.promiseProcess);
            itemInfo.checkRequireFile = this.formatObject( itemInfo.checkRequireFile);
            itemInfo.fileList = this.formatCheckBoxValue( itemInfo.fileList);
            itemInfo.label = this.formatCheckBoxValue(itemInfo.label);
            if(!this.isEmptyObject(itemInfo.apllyAgentNo) && this.isNotNull(itemInfo.apllyAgentNo)){
                itemInfo.apllyAgentNo = JSON.stringify(itemInfo.apllyAgentNo);
            }else{
                itemInfo.apllyAgentNo = '';
            }
            if(!this.isNotNull(itemInfo.checkRequire)){
                this.$set(itemInfo,'checkRequire','无');
            }
            var situations = itemInfo.situationList;
            if(!this.isEmptyObject(situations)){
                for(let i=0;i<situations.length;i++){
                    var situation = situations[i];
                    situation.promiseProcess = this.formatObject(situation.promiseProcess);
                    if(!this.isEmptyObject(situation.apllyAgentNo)&& this.isNotNull(itemInfo.apllyAgentNo)){
                        situation.apllyAgentNo = JSON.stringify(situation.apllyAgentNo);
                    }else{
                        situation.apllyAgentNo = '';
                    }
                    situation.proEdit=true;
                    if(itemInfo.status =="DRAF" || itemInfo.status == "PUBLISH"){
                        situation.canEdit=true;
                    }else {
                        situation.canEdit=false;
                    }
                }
            }
            return itemInfo;
        },
        formatCheckBoxKey(str){
            if(this.isNotNull(str)){
                let array=str.split(',');
                return array
            }else{
                return []
            }
        },
        forNum(val){
            return Number(val)
        },
        changeLabel(val){
            let str = '';
            for (let i = 0; i < val.length; i++) {
                if(str == ''){
                    str = val[i].id
                }else{
                    str += ','+ val[i].id
                }
            }
            return str;
        },
        formatCheckBoxLink(processLinks){
            if(this.isEmptyObject(processLinks)){
                processLinks =[
                    {untiLink:'applitAndAccept',step:'addressee',phone:'',transactor:'',checkStandard:'',transactResult:'',transactTimeLimit:''},
                    {untiLink:'applitAndAccept',step:'acceptance',phone:'',transactor:'',checkStandard:'',transactResult:'',transactTimeLimit:''},
                    {untiLink:'reviewAndDecision',step:'investigate',phone:'',transactor:'',checkStandard:'',transactResult:'',transactTimeLimit:''},
                    {untiLink:'reviewAndDecision',step:'decide',phone:'',transactor:'',checkStandard:'',transactResult:'',transactTimeLimit:''},
                    {untiLink:'ConfermentAndService',step:'accreditation',phone:'',transactor:'',checkStandard:'',transactResult:'',transactTimeLimit:''},
                    {untiLink:'ConfermentAndService',step:'delivery',phone:'',transactor:'',checkStandard:'',transactResult:'',transactTimeLimit:''}
                ]
            }
            return processLinks;
        },
        formatCheckBoxValue(array){
            if(this.isEmptyObject(array)){
                return ''
            }else{
                var val = '';
                for (var i = 0;i < array.length;i++) {
                    if (val != '') {
                        val+=',';
                    }
                    val+=array[i];
                }
                return val;
            }
        },
        formatObject(obj){
            if(this.isEmptyObject(obj)){
                return ''
            }else{
                obj = JSON.stringify(obj);
            }
            return obj
        },
        changeObject(str){
            if(this.isNotNull(str)){
                let obj = JSON.parse(str);
                return obj
            }else{
                return {}
            }
        },
        changeArr(str){
            if(this.isNotNull(str)){
                let arr = JSON.parse(str);
                return arr
            }else {
                return []
            }
        },
    },
    watch:{
        itemInfo: {
            handler(newVal) {
                // console.log(JSON.stringify(newVal));
            },
            immediate: true,
            deep: true
        }
    },
}
