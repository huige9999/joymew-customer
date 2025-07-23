<!--弹出的窗口（仅适用于弹出表格等场景，弹出提示、说明、图片等推荐使用 src/mixins/messageBoxMixin.js的openInfoBox ）-->
<template>
  <div class="my-info-dialog">
    <el-dialog :title="title" :visible.sync="visible" :show="show">
      <span slot="footer" class="dialog-footer"> </span>
      <slot></slot>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'myInfoDialog',
  data() {
    return {
      visible: this.show,
      // handleDialogClose: false
    };
  },
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    message: String,
    title: String,
  },
  watch: {
    show() {
      this.visible = this.show;
    },
  },
  methods: {},
};
</script>
<style lang="less" scoped>
.el-dialog__wrapper::v-deep {
  .el-dialog {
    margin-top: 0 !important;
    margin-bottom: 0;
    top: 50%;
    transform: translateY(-50%);
  }
}
</style>
