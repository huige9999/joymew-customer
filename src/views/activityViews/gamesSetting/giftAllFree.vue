<!-- 礼物包场设置 -->
<template>
  <sub-page>
    <div class="card">
      <card-top-info title="礼物包场详情"></card-top-info>
      <div class="detailBox">
        <div class="textDescArea">
          <div class="intro">购买此功能，全场礼物、横幅霸屏、火箭弹幕、照片霸屏、全屏特效来宾全部<label>免费</label>发送</div>
          <div class="status" v-if="!hasPurchase && !isShowErweima">
            <div class="price">¥388</div>
            <div class="purchaseBtn" @click="confirmRecharge">立即购买</div>
          </div>
          <div class="status" v-if="hasPurchase"><div class="hasBuy">已购买</div></div>
          <div class="erweima-box" v-show="isShowErweima" v-loading="loadingQrcode">
            <div class="erweima">
              <div><iframe :srcdoc="erweimaHtml" frameborder="0"></iframe></div>
            </div>
            <el-button type="primary" @click="DoneRecharge" size="small" class="finishPayBtn">已完成支付</el-button>
          </div>
        </div>
        <div class="imgPreview">
          <div class="preview">
            <img src="@/assets/image/allFreeGift/giftAllFree1.gif" />
          </div>
          <div class="desc">效果展示</div>
        </div>
      </div>
      <card-top-info title="适用场景"></card-top-info>
      <div class="sceneBox">
        <div class="sceneLabels">
          <div class="labelItem">婚庆宴会</div>
          <div class="labelItem">企业年会</div>
          <div class="labelItem">校园活动</div>
          <div class="labelItem">生日宴</div>
        </div>
        <div class="previews">
          <div class="previewItem"><img src="@/assets/image/allFreeGift/giftAllFree2.gif" /></div>
          <div class="previewItem"><img src="@/assets/image/allFreeGift/giftAllFree3.gif" /></div>
          <div class="previewItem"><img src="@/assets/image/allFreeGift/giftAllFree4.gif" /></div>
        </div>
        <div class="benifits1">开通此功能，全场100多种祝福特效全部免费发送，让您的现场气氛嗨到爆！</div>
        <div class="benifits2">超炫的礼物特效、大屏裸眼3D效果，让你的活动科技范十足！</div>
        <div class="benifits3">（主持人开通此功能，第二天将获得288元收益奖励）</div>
      </div>
    </div>
  </sub-page>
</template>
<script>
import SubPage from '@/components/subPage';
import CardTopInfo from '@/components/cardTopInfo';
import { purchaseLivePhotoFunc2 } from '@/api/setting/activitySetting/activity';
import { getActivity } from '@/api/setting/activitySetting/theme';

export default {
  name: 'giftAllFree',
  components: {
    SubPage,
    CardTopInfo,
  },
  data() {
    return {
      hasPurchase: false,
      // 弹出框中支付二维码是否显示
      isShowErweima: false,
      // 支付二维码html标签
      erweimaHtml: '',
      loadingQrcode: false,
    };
  },
  computed: {},
  created() {
    this.initData();
  },
  methods: {
    DoneRecharge() {
      this.isShowErweima = false;
      this.initData();
    },
    initData() {
      getActivity({ splid: this.$store.state.liveId }).then((res) => {
        console.log('活动信息:', res.data);
        this.hasPurchase = res.data.is_free_send_gift === '1';
      });
    },
    confirmRecharge() {
      this.isShowErweima = true;
      this.loadingQrcode = true;
      this.requestErweima();
    },
    requestErweima() {
      const data = {
        splid: this.$store.state.liveId,
        type: '3',
        pay_type: 'zfb',
      };
      purchaseLivePhotoFunc2(data).then((res) => {
        console.log(res);
        this.erweimaHtml = `${res.data.order}`;
        this.loadingQrcode = false;
      });
    },
  },
};
</script>
<style lang="less" scoped>
.card {
  display: flex;
  flex-direction: column;
  width: 100%;
  margin: auto;
  margin-top: 18px;
  margin-bottom: 10px;
  padding-bottom: 22px;
  .detailBox {
    display: flex;
    padding: 0 20px;
    .textDescArea {
      .intro {
        font-size: 20px;
        font-weight: 400;
        color: #333333;
        width: 643px;
        line-height: 25px;
        label {
          color: #fb466c;
        }
      }
      .status {
        margin-top: 32px;
        .price {
          font-size: 28px;
          font-weight: 500;
          color: #f91b1b;
        }
        .purchaseBtn {
          width: 130px;
          height: 46px;
          background: #1890ff;
          border-radius: 4px;
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 18px;
          font-weight: 500;
          color: #ffffff;
          margin-top: 8px;
          cursor: pointer;
          &:hover {
            background: rgba(24, 144, 255, 0.6);
          }
        }
        .hasBuy {
          font-size: 28px;
          font-weight: 500;
          color: #f91b1b;
        }
      }
      .erweima-box {
        display: flex;
        align-items: center;
        padding-top: 20px;
        margin-bottom: 20px;
        position: relative;
        .finishPayBtn {
          left: 28%;
          position: absolute;
        }
      }
    }
    .imgPreview {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-left: 31px;
      .preview {
        width: 330px;
        height: 186px;
        background-color: #c4c4c4;
        img {
          width: 100%;
          height: 100%;
        }
      }
      .desc {
        font-size: 20px;
        font-weight: 400;
        color: #333333;
        margin-top: 20px;
      }
    }
  }
  .sceneBox {
    padding: 0 20px;
    .sceneLabels {
      display: flex;
      .labelItem {
        padding: 8px 24px;
        margin-right: 24px;
        font-size: 20px;
        font-weight: 500;
        color: #4ea0f3;
        background: rgba(78, 160, 243, 0.2);
        border-radius: 1px;
      }
    }
    .previews {
      display: flex;
      margin-top: 24px;
      .previewItem {
        width: 300px;
        height: 186px;
        background: #c4c4c4;
        margin-right: 52px;
        img {
          width: 100%;
          height: 100%;
        }
      }
    }
    .benifits1 {
      padding-left: 14px;
      font-size: 20px;
      font-weight: 400;
      color: #333333;
      margin-top: 24px;
    }
    .benifits2 {
      padding-left: 14px;
      margin-top: 16px;
      font-size: 20px;
      font-weight: 400;
      color: #333333;
    }
    .benifits3 {
      padding-left: 14px;
      margin-top: 12px;
      font-size: 14px;
      font-weight: 400;
      color: #fb466c;
    }
  }
}
</style>
