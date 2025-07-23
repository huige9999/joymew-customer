<!--子页面，每个页面都用-->
<template>
  <div class="sub-page">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'subPage',
};
</script>

<style lang="less" scoped>
.sub-page{
  overflow: auto;
  display: flex;
  flex-direction: column;
  font-size: 13px;
  flex: 1;
}
.sub-page::v-deep{
  .el-table{
    font-size: 13px;
  }
}
</style>
