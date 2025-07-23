<!--内滚动表格的外层容器，slot传入el-table组件--->
<template>
  <div class="my-table">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'myTable',
};
</script>

<style lang="less" scoped>
.my-table::v-deep {
  flex: 1 1 auto;
  height: 100%;
  padding: 18px 36px;
  .table-header {
    th {
      color: rgba(0, 0, 0, 0.85);
      background-color: #fafafa;
    }
    .cell {
      font-size: 13px;
      color: rgba(0, 0, 0, 0.65);
    }
    .column-header {
      font-weight: bold;
    }
  }
  .padding-left {
    padding-left: 20px;
  }
}
</style>
