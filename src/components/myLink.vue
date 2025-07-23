<!--蓝色链接样式，不推荐使用，推荐使用class="blue-text"-->
<template>
  <div class="my-link">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'myLink',
};
</script>

<style scoped>
.my-link{
  display: inline-block;
  color: #1e87f0;
  margin-left: 15px;
  margin-right: 15px;
}
</style>
