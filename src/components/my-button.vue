<!--蓝色按钮，需传入宽高-->
<!--样例：http://localhost/#/app/myActivity/create-->
<template>
  <el-button :type="type" class="my-button" :style="{ width: width + 'px', height: height + 'px' }">
    <slot></slot>
  </el-button>
</template>

<script>
export default {
  name: 'my-button',
  props: {
    type: String,
    width: [String, Number],
    height: [String, Number],
  },
};
</script>

<style lang="less" scoped>
.my-button::v-deep {
  background: #1890ff;
  border-color: #1890ff;
  .hvCenter();
  padding: 0;
  span {
    font-size: 13px;
    font-weight: 400;
    color: #ffffff;
    line-height: 20px;
  }
}
</style>
