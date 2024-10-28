/*
 * Date: 2020-08-15   sheen
  具有的属性：
  cForm.ua       当前浏览器环境
  cForm.state    存放数据容器
  具有方法总览：
  cForm.ready(obj)               SDK准备函数，调用SDK其他的方法前，先调取此函数
  cForm.getFormData(obj)         获取表单数据(组件id)
  cForm.setFormData(obj)         设置表单数据(组件id)
  cForm.getFormDataToCode(obj)   获取表单数据(组件编码)
  cForm.setFormDataToCode(obj)   设置表单数据(组件编码)
  cForm.setBaseData(obj)         设置常量
  cForm.saveForm(obj)            保存表单数据
  cForm.submitForm(obj)          提交表单数据
  cForm.getPages(obj)            获取表单分页数
  cForm.pageChange(obj)          表单翻页
  cForm.pagePrev(obj)            表单翻页，上一页
  cForm.pageNext(obj)            表单翻页，下一页
  cForm.pageTo(obj)              表单翻页，跳转到指定页
  cForm.verifyFormData(obj)      表单数据验证
  cForm.setOptions(obj)          表单配置项
*/
(function (g, f) {
  if (typeof exports === 'object' && typeof module !== 'undefined') {
    // 可通过 import 引入
    module.exports = f();
  } else {
    if (typeof define === 'function' && define.amd) {
      define(f);
    } else {
      //浏览器环境 通过script标签引入
      g = (g && g.alert) ? g : self;
      g.CFormSDK = f();
      //获取浏览器信息
      if (g.navigator && g.navigator.userAgent) {
        var ua = {
          navigator: g.navigator.userAgent,
          isWeiXin: false, // 微信
          isApp: false, // App
          isAndroid: false, //当前环境为Android
          isIOS: false, //当前环境为ios
          isWeb: false
        };
        if (/micromessenger/i.test(ua.navigator)) ua.isWeiXin = true;
        if (/isapp/i.test(ua.navigator)) ua.isApp = true;
        if (/android/i.test(ua.navigator)) ua.isAndroid = true;
        if (/(iPhone|iPad|iPod|iOS)/i.test(ua.navigator)) ua.isIOS = true;
        if (!ua.isWeiXin && !ua.isApp && !ua.isAndroid && !ua.isIOS) ua.isWeb = true;
        g.CFormSDK.ua = ua;
      }
    }
  }
}(this, function () {
  var CFormSDK = function (id) {

    this.state = {
      formView: null, // iframe实例
      el: '',
      onload: false,
      pageTotal: 1,
      _postMessageResolve: ['ready'] // 函数集
    };
    this.ua = {};
    this.init({
      data: id
    });
  };
  CFormSDK.prototype = {
    _postMessage (action, params, success, error) {
      let that = this;
      if (this.state._postMessageResolve[action] != null) {
        success && success({
          state: 0,
          message: '上一个请求未结束'
        });
        return;
      }
      this.state._postMessageResolve[action] = function (data) {
        if (data.type == 'suc') {
          success && success(data.data);
        } else {
          error && error(data.data);
        }
      };
      this.state.formView.contentWindow.postMessage({
        action: action,
        params: params
      },
        '*'
      );
      setTimeout(function () {
        if (action == 'saveForm' || 'submitForm') {

        } else {
          if (that.state._postMessageResolve[action] != null) {
            success && success({
              state: 0,
              message: '请求' + action + '超时'
            });
            that.state._postMessageResolve[action] = null;
          }
        }

      }, 1000 * 10);
    },
    autoHeight (data) {
      if (data && data.state === 1) {
        if (data.row.height > 0) {
          this.state.formView.style.height = data.row.height + 'px';
        }

      }
    },
    init (o) {
      let that = this;
      window.addEventListener('message', function (e) {
        const message = e.data;
        const action = message.action;
        if (action != null && action.length > 0) {
          if (action == 'onload') {
            that.state.onload = true;
            that.state.pageTotal = message.data.row.pageTotal;
          } else if (action == 'autoHeight') {
            that.autoHeight(message.data);
          } else {
            if (that.state._postMessageResolve[action] != null) {
              that.state._postMessageResolve[action](message.data);
              that.state._postMessageResolve[action] = null;
            }
          }
        }
      });
      this.state.el = o.data;
      if (o.data.constructor === String) {
        this.state.formView = document.getElementById(o.data);
        if (!this.state.formView) {
          let obj = {
            state: 0,
            message: '表单实例化失败，请传递需要实例化的元素id属性值'
          };
          throw obj;
        }
      } else {
        let obj = {
          state: 0,
          message: '表单实例化失败，请传递需要实例化的元素id属性值'
        };

        throw obj;
      }
    },
    ready (obj) {
      let that = this;
      let n = 0;
      let t = null;
      t = setInterval(function () {
        n++;
        if (that.state.onload === true) {
          obj.success && obj.success({
            state: 1,
            message: '表单加载成功',
            row: {
              pageTotal: that.state.pageTotal
            }
          });
          clearInterval(t);
        } else {
          if (n / 50 >= 30) {
            clearInterval(t);
            obj.error && obj.error({
              state: 1,
              message: '表单加载超时',
              row: ''
            });
          }
        }
      }, 20);
    },
    getFormData (obj) {

      // 获取表单数据（最后提交的数据）封装三种不同的数据格式
			/*
			 *id: 组件id，
			 *code: 组件编码，
			 *mean: 组件预含义。
			 */
      this._postMessage('getFormData', obj.data || '', obj.success, obj.error);
    },
    getFormDataToCode (obj) {
      // 获取表单数据（最后提交的数据）封装三种不同的数据格式
			/*
			 *id: 组件id，
			 *code: 组件编码，
			 *mean: 组件预含义。
			 */
      this._postMessage('getFormDataToCode', obj.data || '', obj.success, obj.error);
    },
    setFormData (obj) {
      // 设置表单数据（数据类型，需要与getFormData一致）
      this._postMessage('setFormData', obj.data || '', obj.success, obj.error);
    },
    setFormDataToCode (obj) {
      // 设置表单数据（数据类型，需要与getFormData一致）
      this._postMessage('setFormDataToCode', obj.data || '', obj.success, obj.error);
    },
    setBaseData (obj) {
      // 设置基础信息（）
      this._postMessage('setBaseData', obj.data || '', obj.success, obj.error);
    },
    saveForm (obj) {
      // 保存表单
      this._postMessage('saveForm', obj.data || '', obj.success, obj.error);
    },
    submitForm (obj) {
      // 提交表单
      this._postMessage('submitForm', obj.data || '', obj.success, obj.error);
    },
    getPages (obj) {
      // 获取表单页数
      this._postMessage('getPages', obj.data || '', obj.success, obj.error);
    },
    pageChange (obj) {
      // 表单翻页
      this._postMessage('pageChange', obj.data || '', obj.success, obj.error);
    },
    pagePrev (obj) {
      // 上一页
      this._postMessage('pagePrev', obj.data || '', obj.success, obj.error);
    },
    pageNext (obj) {
      // 下一页
      this._postMessage('pageNext', obj.data || '', obj.success, obj.error);
    },
    pageTo (obj) {
      // 跳转到指定页面
      this._postMessage('pageTo', obj.data || '', obj.success, obj.error);
    },
    setOptions (obj) {
      // 设置表单配置项
      this._postMessage('setOptions', obj.data || '', obj.success, obj.error);
    },
    verifyFormData (obj) {
      // 表单验证
      this._postMessage('verifyFormData', obj.data || '', obj.success, obj.error);
    }
  };
  return CFormSDK;
}));