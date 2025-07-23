<template>
  <sub-page class="introduction">
    <main-card>
      <div class="content">
        <img src="@/assets/image/icon/cityPartner/bg.png" class="bg" />
        <img src="@/assets/image/icon/cityPartner/tit.png" class="title" />
        <div class="benifitTip">加入嗨喵合伙人永久享受一、二级团队分成</div>
        <div class="cBox">
          <img src="@/assets/image/icon/cityPartner/cBg.png" class="cBg" />
          <div class="bTitle">申请条件</div>
          <div class="ctList">
            <div class="ctItem">1.立志于主持行业，长期发展</div>
            <div class="ctItem">2.积极使用嗨喵悦动大屏产品（注：有场次要求）</div>
            <div class="ctItem">3.踊跃邀请新主持并实名认证（注：有人数要求）</div>
          </div>
          <div class="getMore" @click="openInfoBox('', windowWeChat, { center: true })">点击了解更多</div>
          <div class="qrcodeBox">
            <img src="@/assets/image/assist.png" class="qrcodeImg" />
            <div class="qrcodeTip">微信扫码，添加专属客服</div>
          </div>
        </div>
      </div>
    </main-card>
  </sub-page>
</template>

<script>
import SubPage from '@/components/subPage';
import MainCard from '@/components/mainCard';
import messageBoxMixin from '@/mixins/messageBoxMixin';

export default {
  mixins: [messageBoxMixin],
  name: 'cityPartnerIntroduction',
  components: { MainCard, SubPage },
  computed: {
    windowWeChat() {
      const c = this.$createElement;
      const img = require('../../../assets/image/assist.png');
      console.log(img);
      return c('div', null, [
        c('img', {
          attrs: { src: img },
          style: 'width:100%',
        }),
        c('span', null, '立即加入'),
      ]);
    },
  },
  data() {
    return {
      tableData: [],
    };
  },
};
</script>

<style lang="less" scoped>
.content {
  width: 100%;
  position: relative;
  .bg {
    width: 100%;
  }
  .title {
    width: 1037px;
    height: 122px;
    position: absolute;
    top: 0;
    left: 20px;
  }
  .benifitTip {
    font-size: 40px;
    font-weight: 600;
    color: #ffffff;
    position: absolute;
    top: 100px;
    left: 20px;
  }
  .cBox {
    width: 95%;
    position: absolute;
    top: 170px;
    left: 20px;
    .cBg {
      width: 100%;
    }
    .bTitle {
      width: 418px;
      height: 52px;
      background-image: url('../../../assets/image/icon/cityPartner/btnBg.png');
      background-size: 100% 100%;
      position: absolute;
      top: 32%;
      left: 50%;
      text-align: center;
      line-height: 44px;
      font-size: 24px;
      color: #000;
      font-weight: 500;
      transform: translateX(-50%);
    }
    .ctList {
      width: 100%;
      position: absolute;
      top: 42%;
      .ctItem {
        font-size: 20px;
        color: #000;
        font-weight: 400;
        line-height: 50px;
        text-align: center;
      }
    }
    .getMore {
      width: 161px;
      height: 37px;
      background: #fddc03;
      border-radius: 4px;
      box-shadow: 0px 1px 4px 0px rgba(255, 255, 255, 0.25) inset;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 17px;
      font-weight: 400;
      position: absolute;
      top: 78%;
      left: 50%;
      transform: translateX(-50%);
      cursor: pointer;
    }
    .qrcodeBox {
      position: absolute;
      width: 200px;
      height: 200px;
      right: 2%;
      bottom: 19%;
      padding-top: 10px;
      background: #fe5777;
      box-shadow: 0px 4px 4px 0px rgba(224, 48, 82, 0.25);
      .qrcodeImg {
        width: 90%;
        height: 90%;
        position: absolute;
        left: 9px;
      }
      .qrcodeTip {
        font-size: 14px;
        font-weight: 400;
        color: #000;
        position: absolute;
        width: 100%;
        text-align: center;
        bottom: -25px;
      }
    }
  }
}
// .introduction {
//   .join-button {
//     margin: auto;
//     margin-bottom: 26px;
//     width: 136px;
//     height: 40px;
//     border-radius: 4px;
//     .hvCenter();
//     font-weight: 500;
//     font-size: 19px;
//     cursor: pointer;
//   }
//   .content-header {
//     padding: 20px;
//     img {
//       width: 100%;
//     }
//   }
//   .main-card {
//     .example {
//       .hvCenter();
//       margin-left: 21px;
//       width: 82px;
//       height: 26px;
//       border-radius: 0 0 5px 5px;
//       font-size: 13px;
//       font-weight: 500;
//       color: #ffffff;
//       line-height: 19px;
//     }
//   }
// }
</style>
