<template>
    <el-dialog :title="head" width="55%" :close-on-click-modal=false :visible.sync="visible" class="qz-dialog-padding">
      <el-input type="textarea" v-model="msg" width="80%" :rows="4"></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="__onCancelClick">{{btnCancelText}}</el-button>
        <el-button type="primary" @click="__onOkClick">{{btnOkText}}</el-button>
      </span>
    </el-dialog>
</template>
<script>
  const defaults = {
    // 标题
    head: '办理意见',
    // 内容
    msg: '',
    requiredMsg: false,
    // 确认按钮文字
    btnOkText: '确认',
    // 取消按钮文字
    btnCancelText: '取消',
    // 显示状态
    visible: false,
    // 确认按钮
    onOkClick: null,
    // 取消按钮
    onCancelClick: null,
    msgStyle: null
  };

  export default {
    props: {
    },
    components: {
    },
    data () {
      return {
        ...defaults,
      };
    },
    computed: {

    },
    methods: {
      show (options = {}) {
        if (typeof options === 'string') {
          options = { msg: options };
        }
        options = { ...defaults, ...options };
        const { head, msg, btnOkText, btnCancelText, withMask, onOkClick, onCancelClick, msgStyle,requiredMsg } = options;
        let that = this;
        this.visible = true;
        this.head = head;
        this.msg = msg;
        this.btnOkText = btnOkText;
        this.btnCancelText = btnCancelText;
        this.withMask = withMask;
        this.onOkClick = onOkClick;
        this.onCancelClick = onCancelClick;
        this.msgStyle = msgStyle;
        this.requiredMsg = requiredMsg
      },
      hide () {
        this.visible = false;
      },
      __onOkClick () {
          if(this.requiredMsg && (this.msg == null || this.msg == undefined || this.msg === '')){
              this.$message.error("请填写办理意见");
          }else{
              this.hide();
              this.onOkClick && this.onOkClick(this.msg);
          }


      },
      __onCancelClick () {
        this.hide();
        this.onCancelClick && this.onCancelClick();
      },
    },
  };
</script>
