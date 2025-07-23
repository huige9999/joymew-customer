<!--信息条，多为蓝色-->
<!--样例：http://localhost/#/app/cityPartner/index-->
<template>
  <div class="info-bar">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'infoBar',
};
</script>

<style lang="less" scoped>
.info-bar::v-deep {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 14px;
  // 样式
  background-color: #e6f7ff;
  border: 1px solid #bae7ff;
}
</style>
