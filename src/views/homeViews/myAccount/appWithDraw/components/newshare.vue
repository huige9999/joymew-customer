<template>
  <div class="giftToHbkdIntroduction">
    <div class="close" @click.stop="close"></div>
    <div class="main-wrap">
      <div class="header">
        <img src="@/assets/image/newshare/hostBenifit.jpg" alt="" class="titImg" />
      </div>
      <div class="tip">按照以下视频教程操作，开启主持获客功能，不错过任何意向直客 >></div>
      <video src="https://static.hudongmiao.com/joymewCustomer/hostBenifit.mp4" controls class="jcVideo" autoplay></video>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  mounted() {},
  methods: {
    close() {
      this.$emit('close');
    },
    confirm() {
      this.$emit('confirm');
    },
  },
};
</script>

<style lang="less" scoped>
.giftToHbkdIntroduction {
  width: 58.42vw;
  height: 44.26vw;
  position: relative;
  top: 2vw;
  .close {
    width: 1.67vw;
    height: 1.67vw;
    top: 2.64vw;
    right: 2.64vw;
    cursor: pointer;
    z-index: 9999;
    position: absolute;
    background-size: 100% 100%;
    background-image: url('~@/assets/image/opManage/app-close.png');
  }
  .main-wrap {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: #ffffff;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 40px;
    .header {
      height: 30%;
      text-align: center;
      .titImg {
        height: 100%;
      }
    }
    .tip {
      font-size: 18px;
      font-weight: 500;
      color: #333333;
      height: 10%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .jcVideo {
      height: 55%;
    }
  }
}
</style>
