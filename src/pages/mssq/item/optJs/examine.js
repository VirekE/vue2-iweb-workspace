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
            const rLoading = that.openLoading();
            let url = that.Config.baseContext+'/mssq/mssqItemVersion/toAcceptWait'
            var itemVid = that.$route.query.id;
            that.$http_post(url, {"itemVid":itemVid,"remark":res}).then(ret => {
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
            const rLoading = that.openLoading();
            let url = that.Config.baseContext+'/mssq/mssqItemVersion/toExamineFail'
            var itemVid = that.$route.query.id;
            that.$http_post(url, {"itemVid":itemVid,"remark":res}).then(ret => {
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
    //alert("预审不通过")
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

