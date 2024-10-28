import option from '../../common/components/option/index.js'

/**
 *
 * @param {新增事项} that
 */

function submit(that) {
  var itemInfo = that.getSaveInfo();
  that.validate(1,valid=> {
    if (valid) {
      that.$confirm('是否确认提交该事项?', '提示', {
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
            let url = that.Config.baseContext + '/mssq/mssqItemVersion/submitItemInfo';
            itemInfo.remark = res;
            that.$http_post(url, itemInfo, true).then(ret => {
              if (ret.state === 1) {
                that.$message.success("提交成功");
                var type = that.$route.query.type;
                // if (that.isNotNull(type) && type === 'overAll') {
                //   that.$router.push({path: '/overAll/todo'})
                // } else {
                that.$router.push({path: '/overAll/list'})
                // }
              } else {
                that.$message.error(ret.message);
              }
              rLoading.close();
            });
          }
        })

      }).catch((e) => {
        console.log(e);
      });
    }
  });
}

function goBack(that) {
  that.$router.go(-1)
}

export default {
  submit: submit,
  goBack: goBack
}

