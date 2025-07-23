<template>
  <div class="have-not-activity">
    <img width="251" src="@/assets/image/icon/activity/noActivity.png" alt="" />
    <div class="text">您还没有活动，赶快创建一场吧～</div>
    <router-link class="button" to="myActivity/create">
      <img src="@/assets/image/icon/activity/creatActivity.png" alt="" />
      <span>创建互动</span>
    </router-link>
  </div>
</template>

<script>
export default {
  name: 'haveNotActivity',
};
</script>

<style lang="less" scoped>
.have-not-activity {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  & > img {
    margin-top: 30px;
  }
  .text {
    text-align: center;
    margin-top: 10px;
    margin-bottom: 20px;
    font-size: 14px;
    color: #999999;
    line-height: 19px;
  }
  .button {
    position: relative;
    width: 174px;
    height: 55px;
    margin-bottom: 30px;
    // 背景图
    img {
      z-index: 0;
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
    }
    // 文字
    span {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%,-50%);
      z-index: 1;
      font-size: 16px;
      font-weight: 500;
      color: #ffffff;
      line-height: 23px;
      margin-left: 10px;
    }
  }
}
</style>
