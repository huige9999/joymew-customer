// 活动提示 ，每天首次登陆弹出
<template>
  <div class="op" v-if="show" >
    <!-- <div class="mask"  @click.capture="close"></div> -->
    <div class="mask"></div>
    <!-- <transition name="slide">
      <div class="main" style="transform: scale(0.8)" v-if="type === -1">
        <div class="close" @click.stop="close"></div>
        <div class="attend" @click.stop="close">立即参加</div>
      </div>
    </transition> -->
    <transition name="slide">
      <div class="main" style="transform: scale(0.7)" v-if="type === 2"  >
        <div class="close" @click.stop="close(false)"></div>
        <div class="attend" @click.stop="close(true)">立即参加</div>
      </div>
    </transition>
    <transition name="slide">
      <div class="congratulations card" style="transform: scale(0.8)" v-if="type === 1">
        <div class="card-title">恭喜您!</div>
        <div class="p">
          成功完成一场有效活动，小悦悦已送您 <span class="money">28.8</span>元现金红包,请及时查看您的微信零钱。再完成一场有效互动， 即可获得 <span class="money">38.8</span>元红包,最高可获取 <span class="money">88.88</span>。
        </div>
        <div class="attend" @click.stop="close(true)">立即参加</div>
      </div>
    </transition>
    <transition name="slide">
      <div class="great card" style="transform: scale(0.8)" v-if="type === -1">
        <div class="card-title">太棒了！</div>
        <div class="p">
          您成功完成一场活动，还差一步就可以获得
          <span class="money">28.8</span>
          元现金红包券了。请继续加油！
        </div>

        <div class="tips-start">小窍门:</div>
        <div class="tips-example">
          请关注微信公众号 <span class="highlight">嗨喵悦动</span> 发送“<span class="highlight">666</span>”获取您的专属导师微信，您可以：
        </div>
        <ul class="tips-ul">
          <li class="tips-li">了解每日最新福利活动</li>
          <li class="tips-li">享受一对一专属导师</li>
          <li class="tips-li">开启税后收益增倍之旅</li>
          <li class="tips-li">互动收益暴增</li>
        </ul>
        <div class="attend" @click.stop="close(true)">立即参加</div>
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
      // type: 1, // -1 申请了未完成  0:未申请  1:完成一场  2:完成两场
      type: null, // -1 申请了未完成  0:未申请  1:完成一场  2:完成两场
    };
  },
  computed: {
    day_first_login() {
      // return '1'
      return this.$store.state.login.userInfo.isCurrdayFirstLogin || '0';
    },
    business_college() {
      // return '1'
      return this.$store.state.login.userInfo.business_college || '2';
    },
  },
  watch: {
    day_first_login() {
      this.initModal();
    },
    business_college() {
      this.initModal();
    },
  },

  mounted() {
    console.log(this.$store.state.login.userInfo.day_first_login === 0);
    this.initModal();
  },
  methods: {
    initModal() {
      this.show = this.day_first_login === '1';
      if (this.business_college === '-1') {
        this.type = -1;
      } else if (this.business_college === '0') {
        this.type = 2;
      } else if (this.business_college === '1') {
        this.type = 1;
      } else {
        this.show = false;
        this.type = null;
      }
    },
    // true 为 跳转 false直接关闭
    close(type) {
      if (type) {
        this.$router.push({
          path: '/app/myActivity/create',
        });
      }
      this.show = false;
      this.$store.commit('login/updateUserInfo', {
        isCurrdayFirstLogin: '0',
      });
      request.post('/host/isCurrdayFirstLogin').then((res) => {
        console.log(res);
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
  height: 100%;
  position: absolute;
  z-index: 20;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;

  .mask {
    width: 100%;
    height: 100%;
    position: absolute;
    background: rgba(0, 0, 0, 0.6);
  }
  .main {
    width: 1016px;
    height: 972px;
    // background-image: url(~@/assets/image/opManage/main.png);
    background-image: url(~@/assets/image/opManage/main2.png);
    background-size: 100% 100%;
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
      line-height: 2.0;
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
