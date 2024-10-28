import option from '../../common/components/option/index.js'
/**
 *
 * @param {新增事项} that
 */
function save(that) {
        const rLoading = that.openLoading();
	    let url = that.Config.baseContext+'/mssq/mssqItemVersion/saveItemQzqd';
        var itemInfo = that.getSaveInfo();
        that.$http_post(url, itemInfo,true).then(ret => {
        if(ret.state === 1){
            const row = ret.row;
            that.itemInfo.itemVid = row.itemVid;
            var paramVid = that.$route.query.itemVid;
            var catalogId = that.$route.query.catalogId;
            var type = that.$route.query.type;
            if(!that.isNotNull(paramVid) && that.isNotNull(catalogId)){
                that.$router.push({ path: '/item/info', query: { id: row.itemVid,catalogId: catalogId }})
            }else if(that.isNotNull(paramVid) && that.isNotNull(type)){
                that.$router.replace({ path: '/item/info', query: { id: row.itemVid,type: type }})
                that.queryInfo(row.itemVid);
                that.curTabTemp = '0';
                that.curTab = '0';
            }

            that.$message.success("保存成功")
        }else{
            that.$message.error(ret.message);
        }
           rLoading.close();
    });
}

function submit(that) {
    var itemInfo = that.getSaveInfo();
	that.validate(1,valid=>{
        if(valid){
            that.$confirm('是否确认提交该事项?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                option.show({
                    head: '办理意见',
                    msg: '提交报审',
                    onOkClick: function(res){
                        if(res==""){
                            that.$message.error("请填写办理意见!")
                            return;
                        }
                        const rLoading = that.openLoading();
                        let url = that.Config.baseContext+'/mssq/mssqItemVersion/submitItemInfo';
                        itemInfo.subRemark=res;
                        that.$http_post(url, itemInfo,true).then(ret => {
                            if(ret.state === 1){
                                const row = ret.row;
                                that.$message.success("提交成功")
                                var type = that.$route.query.type;
                                if(that.isNotNull(type) && (type === 'todo' || type === 'jumpType')){
                                    that.$router.push({ path: '/item/todo_list'})
                                }else{
                                    that.$router.push({ path: '/item/list'})
                                }
                            }else{
                                that.$message.error(ret.message);
                            }
                            rLoading.close();
                        });
                    }
                })

            }).catch((e) => {
                console.log(e);
            });
        }else{
            this.$message.error('请检查必填项');
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

