<template>
  <div class="op">
    <div class="mask"></div>
    <div class="giftToHbkdIntroduction">
      <div class="close" @click.stop="close"></div>
      <div class="title">{{ settingName }}</div>
      <div class="main-wrap">
        <div class="block" v-if="type === 'giftToHbkd'">
          <span class="label">礼物进入红包口袋比例：</span>
          <el-slider class="slider" v-model="giftToHbkdRateUI" :min="50" :max="100" :format-tooltip="dataFormat" show-input></el-slider>
          <span class="unit">%</span>
        </div>
        <div class="block" v-if="type === 'hbyRate'">
          <span class="label">全场红包雨扣点比例：</span>
          <el-slider class="slider" v-model="hbyRateUI" :min="8" :max="80" :format-tooltip="dataFormat" show-input></el-slider>
          <span class="unit">%</span>
        </div>
        <div class="btnGroup">
          <div class="btn" @click.stop="reset">设为默认</div>
          <div class="btn confirm" @click.stop="confirm">确定</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      giftToHbkdRateUI: undefined,
      hbyRateUI: undefined,
    };
  },
  props: {
    isGiftToHbkd: {
      type: String,
      default: '0',
    },
    giftToHbkdRate: {
      type: String,
      default: '100',
    },
    hbyRate: {
      type: String,
      default: '8',
    },
    type: {
      type: String,
      default: 'giftToHbkd',
    },
  },
  computed: {
    settingName() {
      return this.type === 'giftToHbkd' ? '礼物进红包口袋比例设置' : '红包雨扣点比例设置';
    },
    // hbyRateMaxUI() {
    //   return this.giftToHbkdRateUI === 0 ? 30 : 80;
    // },
  },
  created() {
    this.giftToHbkdRateUI = Math.floor(this.giftToHbkdRate * 100);
    this.hbyRateUI = +this.hbyRate;
    console.log(this.giftToHbkdRate, this.hbyRate);
  },
  mounted() {},
  methods: {
    close() {
      this.confirm();
    },
    confirm() {
      this.$emit('confirm', {
        giftToHbkdRate: String(this.giftToHbkdRateUI / 100),
        hbyRate: String(this.hbyRateUI),
        type: this.type,
      });
    },
    reset() {
      if (this.type === 'giftToHbkd') {
        this.giftToHbkdRateUI = 100;
      } else if (this.type === 'hbyRate') {
        this.hbyRateUI = 8;
      }
      this.confirm();
    },
    dataFormat(val) {
      return `${val}%`;
    },
  },
};
</script>

<style lang="less" scoped>
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
  width: 600px;
  background: #ffffff;
  border-radius: 10px;
  position: relative;
  padding: 10px 20px;
  .close {
    width: 20px;
    height: 20px;
    top: 10px;
    right: 20px;
    cursor: pointer;
    position: absolute;
    z-index: 9999;
    background-size: 100% 100%;
    background-image: url('~@/assets/image/opManage/app-close.png');
  }
  .title {
    font-size: 20px;
    font-weight: 500;
    color: rgba(0, 0, 0, 0.8);
    margin-bottom: 40px;
  }
  .main-wrap {
    display: flex;
    flex-direction: column;
    align-items: center;
    .block {
      display: flex;
      align-items: center;
      margin-bottom: 40px;
      label {
        font-size: 18px;
        font-weight: 500;
        color: #333333;
      }
      .unit {
        font-size: 20px;
        font-weight: 500;
        color: #333333;
        margin-left: 5px;
      }
      .slider {
        width: 380px;
      }
    }
    .btnGroup {
      display: flex;
      align-items: center;
      margin-top: 20px;
      .btn {
        width: 120px;
        height: 40px;
        opacity: 0.7;
        background: rgba(36, 154, 255, 0.7);
        border-radius: 10px;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 15px;
        font-weight: 400;
        color: #ffffff;
        cursor: pointer;
        &.confirm {
          margin-left: 20px;
          background: rgba(36, 154, 255, 1);
        }
        &:hover {
          opacity: 0.5;
        }
      }
    }
  }
}
</style>
