import option from '../../common/components/option/index.js'
/**
 * 
 */
function agree(that) {
    option.show({
        head: '办理意见',
        msg: '同意',
        onOkClick: function(res){
            if(res==""){
                that.$message.error("请填写办理意见!")
                return;
            }
            const rLoading = that.openLoading("提交中");
            let url = that.Config.baseContext+'/mssq/mssqItemVersion/toPublish';
            var itemVid = that.$route.query.id;
            that.$http_post(url,{"itemVid":itemVid,"remark":res}).then(ret => {
                if(ret.state === 1){
                    that.$message.success(ret.message)
                    goBack(that)
                }else{
                    that.$message.error(ret.message);
                }
                rLoading.close();
            });
        }
    })
    //alert("初审通过")

}

function disAgree(that) {
    option.show({
        head: '办理意见',
        onOkClick: function(res){
            console.log(res)
            if(res==""){
                that.$message.error("请填写办理意见!")
                return;
            }
            let url = that.Config.baseContext+'/mssq/mssqItemVersion/toAcceptFail'
            var itemVid = that.$route.query.id;
            that.$http_post(url, {"itemVid":itemVid,"remark":res}).then(ret => {
                if(ret.state === 1){
                    that.$message.success(ret.message)
                    goBack(that)
                }else{
                    that.$message.error(ret.message);
                }
            });
        }
    })
    //alert("初审不通过")

}

function goBack(that){
    if(that.$route.query.jumpType == 'dandian'){
        that.$router.push('/item/todo-list')
    }else{
        that.$router.go(-1)
    }
}
export default {
    agree: agree,
    disAgree: disAgree,
    goBack: goBack
}

