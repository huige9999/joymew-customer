<template>
  <div class="enter-activity" @click="intoLargeScreen" :class="{hasNew: sceneType === '0' || sceneType === '1'}">
    <img width="28" style="margin-bottom: 9px" src="@/assets/image/icon/activity/enter.png" alt="" />
    <span style="margin-bottom: 19px">进入互动</span>
  </div>
</template>

<script>
export default {
  name: 'enterActivity',
  props: {
    currentId: {
      type: String,
    },
    sceneType: {
      type: String,
    },
  },
  methods: {
    // 点击进入互动按钮跳转到大屏
    intoLargeScreen() {
      // 线上进入大屏地址
      let url = `https://screen.hudongmiao.com/#/?liveId=${this.currentId}`;
      if (window.location.origin.indexOf('wwwstage.hudongmiao.com') > -1) {
        // 测试环境进入大屏地址
        url = `https://screenstage.hudongmiao.com/#/?liveId=${this.currentId}`;
      }
      console.log('大屏', url);
      window.open(url);
    },
  },
};
</script>

<style lang="less" scoped>
.enter-activity {
  cursor: pointer;
  width: 74px;
  /* 挡住border */
  height: calc(100% + 2px);
  position: relative;
  top: -1px;
  left: 1px;
  background: linear-gradient(180deg, #46a0ce 0%, #1e73b2 100%);
  border-radius: 0 10px 10px 0;
  .multiHvCenter();
  &.hasNew {
    border-radius: 10px 0 0 10px;
  }
  span {
    cursor: pointer;
    height: 18px;
    font-size: 12px;
    font-weight: 500;
    color: #ffffff;
    line-height: 18px;
  }
}
</style>
