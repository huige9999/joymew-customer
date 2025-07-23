<!-- 弹出框组件 修改原生框架的样式 适用于表单提交 充值等复杂业务 -->
<template>
  <div class="my-dialog-container">
    <el-dialog
      :visible.sync="visible"
      :show="show"
      :show-close="false"
      :close-on-click-modal="false">
      <slot name="title"></slot>
      <slot></slot>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: 'myDialog',
  data() {
    return {
      visible: this.show,
    };
  },
  props: {
    show: {
      type: Boolean,
      default: false,
    },
  },
  watch: {
    show() {
      this.visible = this.show;
    },
  },
  methods: {
    closeDialog() {
      this.$emit('');
    },
  },
};
</script>
<style lang="less" scoped>
  .el-dialog__wrapper::v-deep{
    .el-dialog{
      border-radius: 21px 21px 0px 0px;
      .el-dialog__body{
        padding: 0 40px;
      }
    }
  }
</style>
