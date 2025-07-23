<template>
  <div class="appIntroduction" :style="'transform: translate(-50%, -52%) scale(' + scale + ');'">
    <div class="close" @click.stop="close"></div>
    <div class="main-wrap">
      <div class="title">好消息：嗨喵APP手机提现来啦！</div>
      <div class="content">
        <div class="top">尊敬的各位主持人老师：</div>
        <div class="else">
          为给您提供更加便捷的<label>提现服务</label>，即日起<span class="highlinght">下载嗨喵APP-个人中心-我的余额</span>
          当日活动即可<label>手动提现</label>，无需等待，快去试试吧！还有更多功能等你发现哦～
        </div>

        <div class="qrcode">
          <div class="qr">
            <div class="code"></div>
            <div class="name">立即扫码下载体验</div>
          </div>
        </div>

        <div class="btn" @click.stop="close">我知道了</div>
      </div>
    </div>
  </div>
</template>

<script>
const width = 1064;
const height = 968;
export default {
  data() {
    return {
      scale: 0.8,
    };
  },
  mounted() {
    let expectScale = 0.8;
    if (window.innerWidth * 0.8 < width) {
      const scale = window.innerWidth / width;
      expectScale = scale - 0.2;
    }

    if (window.innerHeight * 0.8 < height) {
      const scale = window.innerHeight / height;

      if (expectScale > scale - 0.2) {
        expectScale = scale - 0.2;
      }
    }
    this.scale = expectScale;
    console.log(expectScale);
  },
  methods: {
    close() {
      this.$emit('close');
    },
  },
};
</script>

<style lang="less" scoped>
.appIntroduction {
  width: 1064px;
  height: 968px;
  background-image: url('~@/assets/image/opManage/app-modal.png');
  background-size: 100% 100%;
  position: absolute;
  top: 50%;
  left: 50%;
  .close {
    width: 32px;
    height: 32px;
    top: 185px;
    right: 50px;
    cursor: pointer;
    position: absolute;
    background-size: 100% 100%;
    background-image: url('~@/assets/image/opManage/app-close.png');
  }
  .main-wrap {
    position: absolute;
    bottom: 0;
    left: 8px;
    width: 1048px;
    height: 668px;
    background: #fff;
    box-shadow: 0px -8px 8px 0px rgba(86, 167, 216, 0.3);
    display: flex;
    justify-content: flex-start;
    align-items: center;
    flex-direction: column;
  }
  .title {
    padding-top: 30px;
    font-size: 48px;
    color: #333;
    font-weight: 500;
  }
  .content {
    margin-top: 20px;
    color: rgba(51, 51, 51, 0.8);

    padding: 0 56px;
    font-size: 26px;
    .top {
    }
    .else {
      margin-top: 10px;
      text-indent: 2em;
      line-height: 1.6;
      .highlinght {
        color: rgba(51, 51, 51, 1);
      }
      label {
        color: #5AA8FF;
      }
      // padding-left: 80px;
    }
  }
  .qrcode {
    margin: 0 auto;
    margin-top: 30px;

    display: flex;
    justify-content: center;
    .qr {
      display: flex;
      justify-content: center;
      flex-direction: column;
      align-items: center;
      .code {
        width: 200px;
        height: 200px;
        background-image: url('https://ustatic.joymew.com/%20miao/appDownload.png');
        background-size: 100% 100%;
      }
      .name {
        margin-top: 5px;
        color: rgba(51, 51, 51, 1);
        font-size: 24px;
        font-weight: 500;
      }
    }
  }
  .btn {
    cursor: pointer;
    margin: 0 auto;
    margin-top: 50px;
    width: 157.33px;
    height: 58.67px;
    background: rgba(36, 154, 255, 0.7);
    border-radius: 5.33px;
    font-size: 22px;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #fff;
  }
}
</style>
