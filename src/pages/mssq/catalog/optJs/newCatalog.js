import option from '../../common/components/option/index.js'
/**
 *
 * @param {新增目录} that
 */
import merge from 'webpack-merge'

function save(that) {
    that.forSave((res,catalogType)=>{
        if(res){
            that.loading = true;
            let url = that.Config.baseContext+'/mssq/mssqCatalog/saveCatalog';
            var cataLogInfo = that.saveInfos;
            that.$http_post(url, cataLogInfo,true).then(ret => {
                that.loading = false;
                if(ret.state === 1){
                    const row = ret.row;
                    var id = row.vid;
                    that.cataLogInfo.id = id;
                    that.cataLogInfo.catalogId = row.catalogId;
                    that.$message.success("保存成功");
                    var type = that.$route.query.type;
                    if(that.isNotNull(id)){
                        if(catalogType==='major'){
                            that.$router.replace({query: merge(that.$route.query,{'id':id})})
                        }else{
                            that.$router.replace({query: merge(that.$route.query,{'id':id,catalogId:row.catalogId,type: type})})
                        }
                    }
                }else{
                    that.$message.error(ret.message);
                }
            });

        }
    });
}

function submit(that) {
	that.forSubmit(res=>{
        if(res){

            that.$confirm('是否确认提交当前目录信息?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                option.show({
                    head: '办理意见',
                    msg: '提交报审',
                    onOkClick: function (res) {
                        if (res == "") {
                            that.$message.error("请填写办理意见!")
                            return;
                        }
                        const rLoading = that.openLoading();
                        let url = that.Config.baseContext+'/mssq/mssqCatalog/submitCatalog';
                        var cataLogInfo = that.saveInfos;
                        cataLogInfo.remark = res;
                        that.$http_post(url, cataLogInfo,true).then(ret => {
                            rLoading.close();
                            if(ret.state === 1){
                                const row = ret.row;
                                that.$message.success(cataLogInfo.id?"目录变更成功":"目录保存成功");
                                var type = that.$route.query.type;
                                if(type==='todo'){
                                    that.$router.push({ path: '/catalog/todo-list'})
                                }else if(that.$route.query.jumpType == 'dandian'){
                                    that.$router.push('/catalog/edit')
                                }else{
                                    that.$router.go(-1)
                                }
                            }else{
                                that.$message.error(ret.message);
                            }
                        });
                    }
                })

            }).catch((e) => {
                console.log(e);
            });
        }
    });
}

function goBack(that){
	that.$router.go(-1)
}
export default {
    save: save,
  submit: submit,
  goBack: goBack
}

