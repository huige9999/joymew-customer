<!--左侧有蓝色粗边框的标题条-->
<!--样例：http://localhost/#/app/home-->
<template>
  <div class="card-top-info">
    <div class="title">{{ title }}</div>
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'cardTopInfo',
  props: {
    title: String,
  },
};
</script>

<style lang="less" scoped>
.card-top-info {
  height: 58px;
  .vCenter();
  .title {
    margin-right: 10px;
    padding-left: 18px;
    height: 26px;
    font-size: 19px;
    font-weight: 500;
    color: #3b3c3d;
    line-height: 26px;
    position: relative;
    &:before {
      content: '';
      position: absolute;
      left: 0;
      width: 6px;
      height: 100%;
      background: #1e87f0;
      border-radius: 3px;
    }
  }
}
</style>
