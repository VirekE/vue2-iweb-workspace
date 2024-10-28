import base from '@_src/core/base.js';
export default{
    mixins:[base],
    methods: {
        formatterDateTime(row,col){
            var property = col.property;
            var val = row[property]
            return this.formatDate(val,'yyyy-MM-dd HH:mm:ss')
        },
        formatterDate(row,col){
            var property = col.property;
            var val = row[property]
            return this.formatDate(val,'yyyy-MM-dd')
        },
        /**
         * checkbox获取到的为[1,2] 数组类型，数据库中存的数据为逗号分隔的字符串
         * @param {*} array checkBox value值，数组类型
         * @param {*} callback 回调方法
         */
        formatCheckBoxVal(array,callback){
            var val = '';
            for (var i = 0;i < array.length;i++) {
                if (val != '') {
                    val+=',';
                }
                val+=array[i];
            }
            callback(val)
        },
        queryDictMap(dictCodes,callback){
            var url = this.Config.baseContext + "/mssq/pubDict/queryDictMap";
            this.$http_get(url, {dictCodes: dictCodes}).then(ret => {
                if(ret.state === 1){
                    callback(ret.row)
                }else{
                    callback({})
                }
                
            });
        },
        queryDict(dictCode,callback){
            var url = this.Config.baseContext + "/mssq/pubDict/queryDictMap";
            this.$http_get(url, {dictCodes: dictCode}).then(ret => {
                if(ret.state === 1){
                    callback(ret.row)
                }else{
                    callback([])
                }
            });
        },
        formatterUpload(val){
            let materialGS=[];
            if(this.isNotNull(val)){
                for(var i=0;i<val.length;i++){  //数据格式化
                    var material={};
                    material.fileSize=val[i].fileSize
                    material.fileType=val[i].fileType
                    material.name=val[i].fileName
                    material.rcId=val[i].rcId
                    materialGS.push(material)
                }
                return materialGS;
            }else {
                return materialGS;
            }
        }
    }
}