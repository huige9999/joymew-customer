<template>
  <div class="op">
    <div class="mask"></div>
    <transition name="slide">
      <div class="giftToHbkdIntroduction">
        <div class="close" @click.stop="close"></div>
        <div class="title">请设置比例</div>
        <div class="main-wrap">
          <div class="block">
            <span class="label">礼物进入红包口袋比例：</span>
            <el-slider
              class="slider"
              v-model="is_gift_to_hbkd_real"
              :min="50"
              :max="100"
              :format-tooltip="dataFormat"
              show-input
            ></el-slider>
            <span class="unit">%</span>
          </div>
          <div class="block" v-if="!hideHbySlide">
            <span class="label">全场红包雨扣点比例：</span>
            <el-slider class="slider" v-model="hby_kd_rate_val" :min="8" :max="80" :format-tooltip="dataFormat" show-input></el-slider>
            <span class="unit">%</span>
          </div>
          <div class="btnGroup">
            <div class="btn" @click.stop="reset">设为默认</div>
            <div class="btn confirm" @click.stop="confirm">确定</div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  data() {
    return {
      is_gift_to_hbkd_real: 100,
      hby_kd_rate_val: 8,
    };
  },
  props: {
    giftToHbkdChild: Number,
    hbyKdRateChild: Number,
    hideHbySlide: {
      type: Boolean,
      default: false,
    },
  },
  created() {
    this.is_gift_to_hbkd_real = this.giftToHbkdChild;
    this.hby_kd_rate_val = this.hbyKdRateChild;
  },
  mounted() {},
  methods: {
    close() {
      this.$emit('close');
    },
    confirm() {
      this.$emit('confirm', {
        isGiftToHbkdReal: this.is_gift_to_hbkd_real,
        hbyKdRateVal: this.hby_kd_rate_val,
      });
    },
    reset() {
      this.is_gift_to_hbkd_real = 100;
      if (!this.hideHbySlide) {
        this.hby_kd_rate_val = 8;
      }
    },
    dataFormat(val) {
      return `${val}%`;
    },
  },
};
</script>

<style lang="less" scoped>
.slide-enter-active {
  animation-name: slideInUp;
  animation-duration: 0.2s;
  animation-fill-mode: both;
}
.slide-leave-active {
  animation-name: slideOutDown;
  animation-duration: 0.2s;
  animation-fill-mode: both;
}
@keyframes slideInUp {
  0% {
    transform: translate3d(0, 100%, 0);
    visibility: visible;
  }

  to {
    transform: translateZ(0);
  }
}
@keyframes slideOutDown {
  0% {
    transform: translateZ(0);
  }

  to {
    visibility: hidden;
    transform: translate3d(0, 100%, 0);
  }
}
.op {
  width: 100vw;
  min-height: 100vh;
  position: fixed;
  z-index: 200;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;

  .mask {
    width: 100vw;
    min-height: 100vh;
    position: fixed;
    background: rgba(0, 0, 0, 0.6);
    overflow-y: scroll;
  }
}
.giftToHbkdIntroduction {
  width: 54.58vw;
  height: 26.88vw;
  background: #ffffff;
  border-radius: 1.11vw;
  position: relative;
  .close {
    width: 1.67vw;
    height: 1.67vw;
    top: 2.64vw;
    right: 2.64vw;
    cursor: pointer;
    position: absolute;
    z-index: 9999;
    background-size: 100% 100%;
    background-image: url('~@/assets/image/opManage/app-close.png');
  }
  .title {
    font-size: 1.94vw;
    font-weight: 400;
    color: rgba(0, 0, 0, 0.4);
    position: absolute;
    left: 1.94vw;
    top: 1.46vw;
  }
  .main-wrap {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 8.5vw;
    .block {
      display: flex;
      align-items: center;
      margin-bottom: 3.2vw;
      label {
        font-size: 1.25vw;
        font-weight: 500;
        color: #333333;
      }
      .unit {
        font-size: 0.8vw;
        font-weight: 500;
        color: #333333;
        margin-left: 0.3vw;
      }
      .slider {
        width: 18vw;
      }
    }
    .btnGroup {
      display: flex;
      align-items: center;
      margin-top: 1.4vw;
      .btn {
        width: 8.19vw;
        height: 3.06vw;
        opacity: 0.7;
        background: rgba(36, 154, 255, 0.7);
        border-radius: 0.28vw;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 1.11vw;
        font-weight: 400;
        color: #ffffff;
        cursor: pointer;
        &.confirm {
          margin-left: 1.39vw;
        }
        &:hover {
          background: rgba(36, 154, 255, 1);
        }
      }
    }
  }
}
</style>
