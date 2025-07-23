<template>
  <div class="dianfengsai-modal">
    <!-- 关闭按钮 -->
    <div class="close" @click.stop="close"></div>
    <!-- 顶部标题 -->
    <div class="title">添加福利官</div>
    <div class="modal-content">
      <div class="start">尊敬的各位主持人老师：</div>
      <div class="main-content">
        即日起添加嗨喵福利官，领主持人专享红包补贴
      </div>
      <div class="award-container">
        <img src="https://ustatic.joymew.com/joymewAssistant/hb/qyWeixin.jpg" class="award-item"/>
      </div>
    </div>

    <div class="btns">
      <div class="btn" @click.stop="close">取消</div>
      <div class="btn" @click.stop="close">我知道了</div>
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
  },
};
</script>

<style lang="less" scoped>
.dianfengsai-modal {
  width: 786px;
  box-sizing: border-box;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  background-color: #fff;
  border-radius: 20px;
  padding-bottom: 20px;
  .close {
    width: 24px;
    height: 24px;
    top: 20px;
    right: 20px;
    cursor: pointer;
    z-index: 9999;
    position: absolute;
    background-size: 100% 100%;
    background-image: url('~@/assets/image/opManage/app-close.png');
  }
  .title {
    color: #fff;
    font-size: 40px;
    font-weight: 500;
    text-align: center;
    width: 100%;
    height: 115px;
    line-height: 115px;
    background: linear-gradient(90deg,#fd517a 0%, #7dd3fd 100%);
    border-top-left-radius: 20px;
    border-top-right-radius: 20px;
  }
  .modal-content {
    width: 100%;
    font-size: 20px;
    line-height: 29px;
    padding: 40px 20px 0 20px;
    .main-content {
      text-indent: 2em;
      margin-bottom: 40px;
      .special {
        color: #6b74ff;
      }
    }
    .award {
      margin-bottom: 12px;
    }
    .award-container {
      width: 100%;
      margin-bottom: 22px;
      display: flex;
      justify-content: center;
      align-items: center;
      .award-item {
        width: 138px;
        height: 138px;
        display: flex;
        flex-direction: column;
        align-items: center;
        .award-img {
          width: 100%;
          height: 100%;
        }
        .mp-code {
          width: 100px;
          height: 100px;
          margin-bottom: 2px;
        }
        .scan-tip {
          font-size: 16px;
        }
        &:nth-child(3) {
          border: 2px solid #ff4400;
          border-radius: 20px;
        }
      }
    }
  }
  .btns {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    .btn {
      width: 118px;
      height: 44px;
      text-align: center;
      line-height: 44px;
      color: #249aff;
      font-size: 16px;
      cursor: pointer;
      &:last-of-type {
        border-radius: 4px;
        background-color: rgba(36, 154, 255, 0.7);
        color: #fff;
      }
    }
  }
}
</style>
