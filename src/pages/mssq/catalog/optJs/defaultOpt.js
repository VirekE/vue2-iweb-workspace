/**
 * 
 */
function goBack(that){
    if(!that.$route.query.version){
        that.$router.go(-1);
        return
    }
    window.close();
}
export default {
    goBack: goBack
}