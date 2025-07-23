<template>
  <div class="scan-data" @click="toScanData">
    <img width="28" style="margin-bottom: 9px" src="@/assets/image/icon/activity/scanData.png" alt="" />
    <span style="margin-bottom: 19px">查看数据</span>
  </div>
</template>

<script>
export default {
  name: 'scanData',
  props: {
    currentId: {
      type: String,
    },
  },
  methods: {
    /* 跳转到查看数据页面 */
    toScanData() {
      console.log('***emit toScanData***');
      this.$emit('toSeeData');
    },
  },
};
</script>

<style lang="less" scoped>
.scan-data {
  cursor: pointer;
  width: 74px;
  /* 挡住border */
  height: calc(100% + 2px);
  position: relative;
  top: -1px;
  left: 1px;
  background: linear-gradient(180deg, #abb7c7 0%, #c0cad6 100%);
  border-radius: 0 10px 10px 0;
  .multiHvCenter();
  span {
    height: 18px;
    font-size: 12px;
    font-weight: 500;
    color: #ffffff;
    line-height: 18px;
  }
}
</style>
