import option from '../../common/components/option/index.js'
/**
 * 
 * @param {新增事项} that 
 */
function save(that) {
	    let url = that.Config.baseContext+'/admin/itemQzqdVersion/saveProItem'
        var itemInfo = that.getSaveInfo();
        that.$http_post(url, itemInfo,true).then(ret => {
        if(ret.state === 1){
            const row = ret.row;
            that.itemInfo.itemVid = row.itemVid;
            var paramVid = that.$route.query.itemVid;
            var catalogId = that.$route.query.catalogId;
            if(!that.isNotNull(paramVid) && that.isNotNull(catalogId)){
                that.$router.push({ path: '/sxsl/item', query: { id: row.itemVid,catalogId: catalogId }})
            }
            that.$message.success("保存成功")
        }else{
            that.$message.error(ret.message);
        }
    });
}

function submit(that) {
	that.validate(0,valid=>{
        if(valid){
            that.$confirm('是否确认提交该事项?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                let url = that.Config.baseContext+'/admin/itemQzqdVersion/submitProItem'
                var itemInfo = that.getSaveInfo();
                that.$http_post(url, itemInfo,true).then(ret => {
                    if(ret.state === 1){
                        const row = ret.row;
                        console.log(row)
                        that.$message.success("提交成功")
                       // goBack(that);
                      //  that.$router.push({ path: '/sxsl/list'})
                        var type = that.$route.query.type;
                        if(that.isNotNull(type) && (type==='todo' || type === 'jumpType')){
                            that.$router.push({ path: '/item/todo_list'})
                        }else{
                            that.$router.push({ path: '/item/list'})
                        }
                    }else{
                        that.$message.error(ret.message);
                    }
                });
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

