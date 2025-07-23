<!--卡片样式（自动占满页面，基本每个页面都用）-->
<template>
  <div class="main-card card"  >
    <slot></slot>
  </div>
</template>

<script>
// const mainModule = {
//   home: 'minHeight',
//   myActivity: 'minHeight',
//   userCenter: 'minHeight',
//   myAccount: 'minHeight',
//   xifen: 'minHeight',
//   cityPartner: 'minHeight',
// };
export default {
  name: 'mainCard',
  // props: {
  //   cusClass: {
  //     type: String,
  //     default: '',
  //   },
  // },
  // data() {
  //   return {
  //     cusClass: '',
  //   };
  // },
  // mounted() {
  //   // const module = this.$router.history.current.fullPath.split('/')[2];
  //   // if (mainModule[module]) {
  //   //   this.cusClass = mainModule[module];
  //   // }
  // },
};
</script>

<style scoped>
.main-card {
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
  width: 100%;
  /* min-height: 700px; */
  margin: auto;
  margin: 10px 0 10px 0;
}
/* .minHeight {
  min-height: 700px;
} */
</style>
