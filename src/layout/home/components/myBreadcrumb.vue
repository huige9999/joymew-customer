<template>
  <el-breadcrumb class="my-breadcrumb">
    <el-breadcrumb-item v-for="(item ,index) in navList" :key="index">{{item}}</el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script>
export default {
  name: 'myBreadcrumb',
  computed: {
    navList() {
      const tmpMatchedList = this.$route.matched;
      const tmpNavList = [];
      tmpMatchedList.forEach((item) => {
        if (item.meta.title) {
          tmpNavList.push(item.meta.title);
        }
      });
      return tmpNavList;
    },
  },
};
</script>
<style lang="less" scoped>
  .my-breadcrumb::v-deep{
    background: #FFFFFF;
    font-weight: 400;
    color: rgba(0, 0, 0, 0.45);
    line-height: 20px;
    padding-left: 20px;
    .vCenter();
    .el-breadcrumb__inner{
      font-size: 13px;
      font-weight: 400;
      color: rgba(0, 0, 0, 0.45);
      line-height: 20px;
    }
  }
</style>
