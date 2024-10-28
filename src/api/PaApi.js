import  data from "./demo/pa/data.js"
export default {
    initStorage(type){
        //初始化storage
        var arr = ["schemeList","summaryList","schemeInfo","schemeItemList","todoList","itemInfo","scoreList","scoreInfo","paList","paInfo","appealList","appealTempList","appealInfo"]
        for(var i=0;i<arr.length;i++){
            var key = arr[i];
            if(type=="1"){
                this.setStorage(key,data[key]);
            }else if(type=="0"){
                if(null==this.getStorage(key)||undefined==this.getStorage(key)||"undefined"==this.getStorage(key)){
                    this.setStorage(key,data[key]);
                }
            }

        }

    },
    setStorage(key,data){
        localStorage.setItem(key,JSON.stringify(data));
    },
    getStorage(key){
        return JSON.parse(localStorage.getItem(key));
    },
    getSummaryList(){
        return this.getStorage("summaryList");
    },
    //获取方案列表
    getSchemeList(){
        return this.getStorage("schemeList");
    },
    setSchemeList(scheme){
        var obj = this.getStorage("schemeList");
        obj.push(scheme);
        this.setStorage("schemeList",obj);
    },
    //获取方案制定
    getSchemeInfo(id){
        var obj = this.getStorage("schemeInfo");
        return obj[id]
    },
    //删除方案
    delScheme(id){
        var arr = [id];
        var allArr = this.getSchemeList();
        var finalArr = allArr.filter((item) => !arr.includes(item.id));
        this.setStorage("schemeList",finalArr);
    },
    //发布方案
    publishScheme(id){
        var allArr = this.getSchemeList();
        var schemeList = []
        for(var i=0;i<allArr.length;i++){
            var scheme = allArr[i];
            if(scheme.id==id){
                scheme.status = "1";
                //指标分解插入一条数据
                this.setSchemeItemList(getSchemeInfo(id))
            }
            schemeList.push(scheme);
        }
        this.setStorage("schemeList",schemeList);
    },
    //方案制定
    setSchemeInfo(scheme){
        //往方案列表赋值
        var obj = this.getStorage("schemeList");
        obj.push(scheme.instance);
        this.setStorage("schemeList",obj);
        //往方案详情赋值
        data.schemeInfo[scheme.instance.id] = scheme;
        var schemeInfo = this.getStorage("schemeInfo");
        this.setStorage("schemeInfo",data.schemeInfo);
        //如果是发布状态，往指标分解赋值
        if(scheme.instance.status=="1"){
            this.setSchemeItemList(scheme)
        }

    },
    setSchemeItemList(scheme){
        var instanctTypes = scheme.instanceType;
        for(var i=0;i<instanctTypes.length;i++){
            //维度
            var levelZero = instanctTypes[i];
            //一级指标
            var levelOnes = levelZero.levelOne;
            for(var j=0;j<levelOnes.length;j++){
                var levelOne = levelOnes[j];
                var levelTwos = levelOne.levelTwo;
                for(var k=0;k<levelTwos.length;k++){
                    var levelTwo = levelTwos[k];
                    var schemeItemListInfo = {};
                    schemeItemListInfo.id = this.guid();
                    schemeItemListInfo.instanceName = scheme.instance.name;
                    schemeItemListInfo.instanceType = scheme.instance.type;
                    schemeItemListInfo.levelOneName = levelOne.name;
                    schemeItemListInfo.levelTwoName = levelTwo.name;
                    schemeItemListInfo.splitStartTime = scheme.instance.splitStartTime;
                    schemeItemListInfo.splitEndTime = scheme.instance.splitEndTime;

                    //指标分解列表
                    data.schemeItemList.push(schemeItemListInfo);
                    this.setStorage("schemeItemList",data.schemeItemList);
                    //指标分解详情
                    data.itemInfo[schemeItemListInfo.id] = schemeItemListInfo;
                    this.setStorage("itemInfo",data.itemInfo);
                }
            }
        }
    },
    //获取指标分解方案列表
    getSchemeItemList(deptCode){
        var obj = this.getStorage("schemeItemList");
        var res = this.getDataByDept(obj,deptCode);
        return res;
    },
    //通过部门编码查询数据
    getDataByDept(arr,deptCode){
        if(null==deptCode || undefined==deptCode){
            return arr;
        }else{
            var res = []
            for(var i=0;i<arr.length;i++){
                var obj = arr[i];
                if(obj.deptCode ==deptCode){
                    res.push(obj);
                }
            }
            return res;
        }
    },
    //获取指标分解
    getItemInfo(id){
        var obj = this.getStorage("itemInfo");
        return obj[id];
    },
    //指标分解
    setItemInfo(info){
        data.itemInfo[info.id] = info;
        this.setStorage("itemInfo",data.itemInfo);
        //如果是提交，就要加入待审核
        if(info.status=="1"){
            this.setTodo(info,"zbfj")
        }
    },
    //推送待办
    setTodo(info,type){
        if(type=="zbfj"){
            var todoInfo = {};
            todoInfo.id = this.guid();
            todoInfo.name = info.levelTwoName;
            todoInfo.type=type;//指标分解
            todoInfo.creationTime = new Date();
            todoInfo.creator="";
            todoInfo.status="0";
            todoInfo.busiId=info.id;
            todoInfo.path="/pa/";
            data.todoList.push(todoInfo);
        }else if(type=="kpdf"){
            var todoInfo = {};
            todoInfo.id = this.guid();
            todoInfo.name = info.name;
            todoInfo.type="kpdf";//考评打分
            todoInfo.creationTime = new Date();
            todoInfo.creator="";
            todoInfo.status="0";
            todoInfo.busiId=info.id;
            todoInfo.path="/pa/";
            data.todoList.push(todoInfo);
        }else if(type=="kpss"){
            var todoInfo = {};
            todoInfo.id = this.guid();
            todoInfo.name = info.itemName;
            todoInfo.type="kpss";//考评申诉
            todoInfo.creationTime = new Date();
            todoInfo.creator="";
            todoInfo.status="0";
            todoInfo.busiId=info.id;
            todoInfo.path="/pa/";
            data.todoList.push(todoInfo);
        }
        this.setStorage("todoList",data.todoList);
    },
    //提交指标分解
    submitItem(id){
        var allArr = this.getSchemeItemList();
        var schemeItemList = []
        for(var i=0;i<allArr.length;i++){
            var item = allArr[i];
            if(item.id==id){
                item.status = "1";
                var info = data.itemInfo[id];
                info.status = "1";
                data.itemInfo[id] = info;
                this.setStorage("itemInfo",data.itemInfo);
                //加入待审核
                this.setTodo(info,"zbfj");
            }
            schemeItemList.push(item);
        }
        data.schemeItemList = schemeItemList;
        this.setStorage("schemeItemList",data.schemeItemList);
    },
    //获取待办列表
    getTodoList(type,deptCode){
        var arr = this.getStorage("todoList");
        var res = [];
        for(var i=0;i<arr.length;i++){
            var info = arr[i];
            if(null!=type && undefined!=type ){
                if(type.indexOf(info.type)>-1){
                    if(null!=deptCode && undefined!=deptCode){
                        if(info.deptCode==deptCode){
                            res.push(info);
                        }
                    }else{
                        res.push(info);
                    }
                }
            }else{
                if(null!=deptCode && undefined!=deptCode){
                    if(info.deptCode==deptCode){
                        res.push(info);
                    }
                }else{
                    res.push(info);
                }
            }

        }
        return res;
    },
    getScoreList(deptCode){
        var obj = this.getStorage("scoreList");
        var res = this.getDataByDept(obj,deptCode);
        return res;
    },
    //获取打分详情
    getScoreInfo(id){
        var obj = this.getStorage("scoreInfo");
        return obj[id];
    },
    //保存打分
    setScoreInfo(info){
        data.scoreInfo[info.id] = info;
        this.setStorage("scoreInfo",data.scoreInfo);
        //如果是提交，就要加入待审核
        if(info.status=="1"){
            //加入待审核
            this.setTodo(info,"kpdf");
        }
    },
    //提交打分
    submitScore(id){
        var allArr = this.getSchemeItemList();
        var schemeItemList = []
        for(var i=0;i<allArr.length;i++){
            var item = allArr[i];
            if(item.id==id){
                item.status = "1";
                var info = data.itemInfo[id];
                info.status = "1";
                data.itemInfo[id] = info;
                this.setStorage("itemInfo",data.itemInfo);
                //加入待审核
                this.setTodo(info,"kpdf");
            }
            schemeItemList.push(item);
        }
        data.schemeItemList = schemeItemList;
        this.setStorage("schemeItemList",data.schemeItemList);
    },
    //获取绩效列表
    getPaList(deptCode){
        var obj = this.getStorage("paList");
        var res = this.getDataByDept(obj,deptCode);
        return res;
    },
    //插入到绩效列表
    setPaList(info){
        var obj = this.getStorage("paList");
        obj.push(info);
        this.setStorage("paList",obj);
    },
    getPaInfo(id,deptCode){
        var obj = this.getStorage("paInfo");
        if(null!=obj[id]){
            return obj[id][deptCode];
        }
        return null;
    },
    //获取申诉列表
    getAppealList(deptCode){
        var obj = this.getStorage("appealList");
        var res = this.getDataByDept(obj,deptCode);
        return res;
    },
    //获取申诉列表
    getAppealListObj(id){
        var obj = this.getStorage("appealList");
        var res = this.getDataById(obj,id);
        var arr = [];
        arr.push(res);
        return arr;
    },
    //获取申诉列表
    getAppealTempList(){
        var obj = this.getStorage("appealTempList");
        return obj;
    },
    //获取申诉列表
    setAppealTempList(arr){
        this.setStorage("appealTempList",arr);
    },
    setAppealInfo(info){
        data.appealInfo[info.id] = info;
        this.setStorage("appealInfo",data.scoreInfo);
    },
    //获取申诉详情
    getAppealInfo(id){
        var obj = this.getStorage("appealInfo");
        return obj[id];
    },
    //审核
    audit(info){
        var todoList = this.getTodoList();
        var res = [];
        for(var i=0;i<todoList.length;i++){
            var todo = todoList[i];
            if(todo.id == info.id){
                todo = info;
            }
            res.push(todo);
        }
        data.todoList = res;
        this.setStorage("todoList",data.todoList);

        if(info.type=="sqgz"){
            //申请公章
            this.auditSQGZ(info);
        }else if(info.type=="kpdf"){
            //考评打分
            this.auditKPDF(info);
        }else if(info.type=="kpss"){
            //考评申诉
            this.auditKPSS(info);
        }
    },
    //获取待办列表制定id对象
    getTodoListObj(id){
        return this.getDataById(this.getStorage("todoList"),id);
    },
    getDataById(arr,id){
        if(null==id || undefined==id){
            return null;
        }else{
            for(var i=0;i<arr.length;i++){
                var obj = arr[i];
                if(obj.id ==id){
                  return obj;
                }
            }
            return null;
        }
    },
    //审核申请公章
    auditSQGZ(info){
        var busiId = info.busiId;
        var arr = this.getSchemeItemList();
        var resArr = [];
        var schemeItemObj = {};
        for(var i=0;i<arr.length;i++){
            var obj = arr[i];
            if(obj.id ==busiId){
               obj.status = info.status;
                schemeItemObj = obj;
            }
            resArr.push(obj);
        }
        var schemeObj = this.getDataById(this.getStorage("schemeList"),schemeItemObj.schemeId);
        //修改指标分解列表状态
        this.setStorage("schemeItemList",resArr);
        if(info.status=="2"){
            //通过
            //往打分列表插入数据
            var obj  = {};
            obj.id = this.guid();
            obj.levelTwoId = schemeItemObj.levelTwoId;
            obj.instanceName = schemeItemObj.instanceName;
            obj.instanceType = schemeItemObj.instanceType;
            obj.year = schemeItemObj.year;
            obj.levelOneName = schemeItemObj.levelOneName;
            obj.levelTwoName = schemeItemObj.levelTwoName;
            obj.assessStartTime = schemeObj.assessStartTime;
            obj.assessEndTime = schemeObj.assessEndTime;
            obj.status = "";
            obj.deptCode = schemeItemObj.deptCode;
            obj.deptName = schemeItemObj.deptName;
            data.scoreList.push(obj);
            this.setStorage("scoreList",data.scoreList);

            var scoreInfoObj = {};
            scoreInfoObj.id = schemeItemObj.id;
            scoreInfoObj.status = "0";
            scoreInfoObj.name = schemeItemObj.levelTwoName;
            var levelTwos = {};
            levelTwos.id = schemeItemObj.id;
            levelTwos.name = schemeItemObj.levelTwoName;
            levelTwos.score = schemeItemObj.score;
            var items = [];
            var depts = [];
            for(var i=0;i<levelTwos.items.length;i++){
                var a = levelTwos.items[i];
                var item = {};
                item.id=a.id
                item.name=a.name;
                item.score=a.score;
                items.push(item);
                var itemDepts = item.itemDepts;
                for(var j=0;j<itemDepts.length;j++){
                    var itemDept = itemDepts[j];
                    var dept = {};
                    var flag = false;
                    for(var k=0;k<depts.length;k++){
                        if(depts[k].deptCode==itemDept.deptCode){
                            dept = depts[k];
                            dept[itemDept.id]="";
                            flag = true;
                        }
                    }
                    if(!flag){
                        dept.deptCode =itemDept.deptCode;
                        dept.deptName =itemDept.deptName;
                        dept[itemDept.id]="";
                        depts.push(dept);
                    }
                }
            }
            levelTwos.items = items;
            scoreInfoObj.levelTwos = levelTwos;
            scoreInfoObj.depts = depts;
            data.itemInfo[scoreInfoObj.id] = scoreInfoObj;
            this.setStorage("itemInfo",data.itemInfo);
        }
    },
    //审核考评打分
    auditKPDF(info){
        var busiId = info.busiId;
        var arr = this.getScoreList();
        var resArr = [];
        var scoreObj = {};
        for(var i=0;i<arr.length;i++){
            var obj = arr[i];
            if(obj.id ==busiId){
                obj.status = info.status;
                scoreObj = obj;
            }
            resArr.push(obj);
        }
        //修改指标分解列表状态
        this.setStorage("scoreList",resArr);
    },
    //审核考评申诉
    auditKPSS(info){
        var busiId = info.busiId;
        var arr = this.getAppealList();
        var resArr = [];
        var scoreObj = {};
        for(var i=0;i<arr.length;i++){
            var obj = arr[i];
            if(obj.id ==busiId){
                obj.status = info.status;
                scoreObj = obj;
            }
            resArr.push(obj);
        }
        //修改指标分解列表状态
        this.setStorage("appealList",resArr);
    },
    //用于生成uuid
    S4() {
        return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    },
    guid() {
        return (this.S4()+this.S4()+"-"+this.S4()+"-"+this.S4()+"-"+this.S4()+"-"+this.S4()+this.S4()+this.S4());
    }
}