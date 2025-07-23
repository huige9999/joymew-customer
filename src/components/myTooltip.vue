<!--灰色对话框，已废弃-->
<template>
  <div class="my-tooltip">
    <el-tooltip
        :content="content"
        :placement="placement"
    >
      <slot></slot>
    </el-tooltip>
  </div>
</template>

<script>
export default {
  name: 'myTooltip',
  props: {
    content: String,
    placement: String,
  },
};
</script>

<style lang="less">
@tipColor: #8b8b8b;
.el-tooltip__popper.is-dark{
  background: @tipColor;
  font-size: 13px;
  font-weight: 500;
  color: #FFFFFF;
  line-height: 19px;
  width: 283px;
  padding: 17px;
  &[x-placement^=top] .popper__arrow{
    border-top-color: @tipColor;//箭头边框
  }
  &[x-placement^=top] .popper__arrow:after{
    border-top-color: @tipColor;//箭头
  }
}
</style>
