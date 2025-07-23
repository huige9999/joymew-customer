<template>
  <div class="enter-activity" @click="intoLargeScreen">
    <img width="30" style="margin-bottom: 10px" src="@/assets/image/icon/activity/enterNew.png" alt="" />
    <span style="margin-bottom: 19px">进入新版</span>
    <img src="@/assets/image/icon/activity/arrow.png" class="arrowImg" />
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
      const sceneTypeText = this.sceneType === '0' ? 'wedding' : 'enterprise';
      let url = `https://screen.hudongmiao.com/#/?liveId=${this.currentId}&screenType=${sceneTypeText}`;
      if (window.location.origin.indexOf('wwwstage.hudongmiao.com') > -1) {
        // 测试环境进入大屏地址
        url = `https://screenstage.hudongmiao.com/#/?liveId=${this.currentId}&screenType=${sceneTypeText}`;
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
  background: linear-gradient(180deg, #ff7590 0%, #ff3d66 100%);
  border-radius: 0 10px 10px 0;
  .multiHvCenter();
  span {
    cursor: pointer;
    height: 18px;
    font-size: 12px;
    font-weight: 500;
    color: #ffffff;
    line-height: 18px;
  }
  .arrowImg {
    width: 16px;
    height: 16px;
    position: absolute;
    bottom: 10px;
  }
}
</style>
