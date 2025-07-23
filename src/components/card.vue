<!--卡片样式（无自动占满，要靠内部元素撑开）-->
<!--样例：http://localhost/#/app/userCenter/myInvite-->
<template>
  <div class="main-card card">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'card',
};
</script>

<style scoped>
.main-card {
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
  width: 100%;
  margin: auto;
  margin-top: 18px;
}
</style>
