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
            let url = that.Config.baseContext+'/mssq/mssqCatalog/statusToApprovalWait';
            var id = that.$route.query.id;
            that.$http_post(url,{"catalogVid":id,"remark":res}).then(ret => {
                if(ret.state === 1){
                    that.$message.success(ret.message)
                    goBack(that)
                }else{
                    that.$message.error(ret.message);
                }
            });
        }
    })

}

function disAgree(that) {
    option.show({
        head: '办理意见',
        'requiredMsg': true,
        onOkClick: function(res){
            console.log(res)
            if(res==""){
                that.$message.error("请填写办理意见!")
                return;
            }
            let url = that.Config.baseContext+'/mssq/mssqCatalog/statusToExamineFail';
            var id = that.$route.query.id;
            that.$http_post(url, {"catalogVid":id,"remark":res}).then(ret => {
                if(ret.state === 1){
                    that.$message.success(ret.message)
                    goBack(that)
                }else{
                    that.$message.error(ret.message);
                }
            });
        }
    })

}

function goBack(that){
    // that.$router.go(-1)
    if(that.$route.query.jumpType == 'dandian'){
        that.$router.push('/catalog/examine')
    }else{
        that.$router.go(-1)
    }

}
export default {
    agree: agree,
    disAgree: disAgree,
    goBack: goBack
}

