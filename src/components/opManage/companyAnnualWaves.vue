<template>
  <div class="op" v-if="show">
    <div class="mask" @click.stop="attend"></div>
    <transition name="slide">
      <div class="main" style="transform: scale(0.5)" @click.stop="attend">
        <div class="close"></div>
        <div class="content">
          <div class="top-text">
            小悦悦年会季，为回馈老师们的大力支持，自2020-12-12起礼物收益提高到
            <sapn class="highlight">80% </sapn>，感谢各位老师的信任与厚爱。
          </div>
          <div class="notice-title">活动说明：</div>
          <div class="notice-text">1.活动截止日期为2021-01-31，让老师们赚个够。</div>
          <div class="notice-text">2.系统定时检测作弊、违规行为，如有发现，立即封号处理。</div>
        </div>
        <div class="attend">立即参加</div>
      </div>
    </transition>
  </div>
</template>

<script>
import request from '@/utils/request';

export default {
  data() {
    return {
      show: false,
    };
  },
  computed: {
    isCanJia90Profit() {
      return this.$store.state.login.userInfo.isCanJia90Profit || '1';
    },
  },
  watch: {
    isCanJia90Profit() {
      this.initModal();
    },
  },

  mounted() {
    console.log(this.$store.state.login.userInfo.isCanJia90Profit === 0);
    this.initModal();
  },
  methods: {
    initModal() {
      this.show = false || this.isCanJia90Profit === '0';
    },
    // true 为 跳转 false直接关闭
    close() {
      this.show = false;
    },
    attend() {
      this.show = false;
      this.$router.push({
        path: '/app/myActivity/create',
      });
      request
        .post('/host/canJia90Profit')
        .then((res) => {
          console.log(res);
          this.$store.commit('login/updateUserInfo', {
            isCanJia90Profit: '1',
          });
        })
        .catch((err) => {
          console.log(err);
        });
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
  width: 100%;
  min-height: 100%;
  position: absolute;
  z-index: 20;

  display: flex;
  align-items: center;
  justify-content: center;

  .mask {
    width: 100%;
    min-height: 100%;
    position: absolute;
    background: rgba(0, 0, 0, 0.6);
    overflow-y: scroll;
  }
  .main {
    width: 1016px;
    height: 972px;
    margin-top: -200px;
    // background-image: url(~@/assets/image/opManage/main.png);
    background-image: url(~@/assets/image/opManage/companyAnnualWaves.png);
    background-size: 100% 100%;
    .content {
      width: 1003px;
      height: 257px;
      position: absolute;
      left: 6px;
      bottom: 102px;
      .highlight {
        color: #ffac09;
      }
      .top-text {
        padding: 20px 50px;
        font-size: 18px;
        font-weight: bold;
        color: #666666;
        line-height: 1.6;
      }
      .notice-title {
        margin-top: 20px;
        padding: 0 50px;
        color: #fa6920;
      }
      .notice-text {
        padding: 0 50px;
        margin-top: 10px;
        font-size: 16px;
        font-family: PingFang SC;
        font-weight: bold;
        color: #999999;
        line-height: 32px;
      }
    }
    .close {
      width: 32px;
      height: 32px;
      position: absolute;
      right: 24px;
      top: 24px;
      background-image: url(~@/assets/image/opManage/close.png);
      background-size: 100% 100%;
      cursor: pointer;
      transform: rotate(90deg);
      &:hover {
        animation: rotate 0.2s ease;
        @keyframes rotate {
          0% {
            transform: rotate(90deg);
          }
          100% {
            transform: rotate(0deg);
          }
        }
      }
    }
    .attend {
      width: 284px;
      height: 76px;
      position: absolute;
      bottom: 30px;
      left: 50%;
      transform: translateX(-50%);
      background-image: url(~@/assets/image/opManage/attend.png);
      background-size: 100% 100%;
      cursor: pointer;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 30px;
      font-weight: bold;
      color: #ba271a;
    }
  }

  .card {
    background: #fff;
    border-radius: 20px;
    .card-title {
      height: 110px;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 32px;
      font-weight: bold;
      color: #eb2f2d;
    }
    .p {
      padding: 0 30px;
      // letter-spacing: 2px;
      font-size: 18px;
      line-height: 2;
      color: #333333;
    }
    .money {
      color: #ec4544;
    }

    .attend {
      width: 284px;
      height: 76px;
      position: absolute;
      bottom: 30px;
      left: 50%;
      transform: translateX(-50%);
      background-image: url(~@/assets/image/opManage/attend.png);
      background-size: 100% 100%;
      cursor: pointer;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 30px;
      font-weight: bold;
      color: #ba271a;
    }
  }
  .congratulations {
    width: 724px;
    height: 316px;
    background-size: 100% 100%;
  }
  .great {
    width: 724px;
    height: 522px;
    background-size: 100% 100%;
    .tips-start {
      padding-left: 20px;
      margin-top: 27px;
      margin-bottom: 21px;
      color: #ff6714;
      font-size: 18px;
    }
    .tips-example {
      padding-left: 20px;
      font-size: 18px;
      font-weight: bold;
      color: #333333;
      .highlight {
        color: #ffac09;
      }
    }
    .tips-ul {
      .tips-li {
        margin-top: 24px;
        padding-left: 30px;
        color: #666666;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        &:before {
          content: '';
          display: block;
          width: 8px;
          height: 8px;
          margin-right: 9px;

          background: #ffac09;
          border-radius: 50%;
        }
      }
    }
  }
}
</style>
