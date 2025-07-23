<!-- 现场照片设置 -->
<template>
  <sub-page v-loading="loading">
    <div class="card">
      <card-top-info title="现场照片"></card-top-info>
      <div class="tip">{{ tipText }}</div>
      <el-button type="primary" class="btn" v-if="!hasPurchase" @click="confirmRecharge">立即开启</el-button>
      <el-button type="primary" class="btn" v-else @click.capture="copyShareUrl">复制链接</el-button>
      <div class="erweima-box" v-show="isShowErweima" v-loading="loadingQrcode">
        <div class="erweima">
          <div><iframe :srcdoc="erweimaHtml" frameborder="0"></iframe></div>
        </div>
        <el-button type="primary" @click="DoneRecharge" size="small" class="finishPayBtn">已完成支付</el-button>
      </div>
    </div>
    <div class="card">
      <card-top-info title="图片管理"></card-top-info>
      <div class="unPurchaseStatus" v-if="!hasPurchase">
        <div class="unPTxt">未开启</div>
        <img src="@/assets/image/qs.png" class="qsImg" />
        <div class="uPTip">暂无权限查看</div>
      </div>
      <div class="PurchaseStatus" v-if="hasPurchase">
        <div class="unUpload" v-if="!hasUpload">
          <div class="imgModal">
            <img src="@/assets/image/imgIcon.png" class="imgIcon" />
          </div>
          <div class="noUdTip">暂无上传图片</div>
        </div>
        <div class="upload" v-if="hasUpload">
          <div class="imgItem" v-for="item in imgList" :key="item.id">
            <img :src="item.piclink_small" />
            <div class="closeBtn" v-show="closeIconVisible"><img src="@/assets/image/close.png" class="closeIcon" /></div>
          </div>
        </div>
      </div>
    </div>
  </sub-page>
</template>
<script>
import SubPage from '@/components/subPage';
import CardTopInfo from '@/components/cardTopInfo';
import { getLivePhotoInfo, purchaseLivePhotoFunc2 } from '@/api/setting/activitySetting/activity';

export default {
  name: 'curtainCall',
  components: {
    SubPage,
    CardTopInfo,
  },
  data() {
    return {
      hasPurchase: false,
      hasUpload: false,
      closeIconVisible: false,
      // 弹出框中支付二维码是否显示
      isShowErweima: false,
      // 支付二维码html标签
      erweimaHtml: '',
      loadingQrcode: false,
      loading: false,
      imgList: [],
    };
  },
  computed: {
    tipText() {
      let tmpTip = '本功能需付费188元，开启此功能，把上传链接发送给摄影师，同时可上传摄影师水印、婚庆公司水印、主持人水印，现场来宾都可以看到 增加品牌影响力。';
      if (this.hasPurchase) {
        tmpTip = '功能已开启，请把链接 发给摄影师。';
      }
      return tmpTip;
    },
  },
  created() {
    this.initData();
  },
  methods: {
    DoneRecharge() {
      this.isShowErweima = false;
      this.initData();
    },
    confirmRecharge() {
      this.isShowErweima = true;
      this.loadingQrcode = true;
      this.requestErweima();
    },
    requestErweima() {
      const data = {
        splid: this.$store.state.liveId,
        type: '2',
        pay_type: 'zfb',
      };
      purchaseLivePhotoFunc2(data).then((res) => {
        console.log(res);
        this.erweimaHtml = `${res.data.order}`;
        this.loadingQrcode = false;
      });
    },
    initData() {
      this.loading = true;
      getLivePhotoInfo({
        splid: this.$store.state.liveId,
        source: '0',
      })
        .then((res) => {
          console.log(res);
          this.hasPurchase = res.data.isPay !== '0';
          this.hasUpload = res.data.list1.length > 0;
          this.imgList = res.data.list1;
          this.loading = false;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    copyShareUrl() {
      this.$copyText(`http://www.hudongmiao.com/wx/method1?splid=${this.$store.state.liveId}`).then(
        (res) => {
          console.log(res);
          this.$message({
            message: '复制成功',
            type: 'success',
          });
        },
        (err) => {
          console.log(err);
          this.$message.error('复制失败');
        },
      );
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
  .tip {
    font-size: 16px;
    color: #000;
    padding: 0 20px;
  }
  .btn {
    width: 149px;
    margin: 12px auto;
    margin-top: 50px;
  }
  .unPurchaseStatus {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 40px;
    position: relative;
    .unPTxt {
      font-size: 32px;
      color: #fff;
      font-weight: 500;
      position: absolute;
      top: 17px;
    }
    .uPTip {
      font-size: 32px;
      color: #000;
      font-weight: 500;
      margin-top: 43px;
    }
    .qsImg {
      width: 549px;
      height: 344px;
    }
  }
  .PurchaseStatus {
    padding: 0 20px 40px 20px;
    .unUpload {
      .imgModal {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 240px;
        height: 240px;
        background: #f7f7f7;
        .imgIcon {
          width: 124px;
          height: 113px;
        }
      }
      .noUdTip {
        font-size: 32px;
        color: #000;
        font-weight: 500;
        text-align: center;
        margin-top: 37px;
      }
    }
    .upload {
      display: flex;
      flex-wrap: wrap;
      align-content: flex-start;
      .imgItem {
        width: 240px;
        height: 240px;
        margin-right: 1%;
        margin-bottom: 21px;
        flex: 0 0 19%;
        position: relative;
        img {
          width: 100%;
          height: 100%;
        }
        .closeBtn {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background-color: rgba(0, 0, 0, 0.5);
          border-radius: 50%;
          display: flex;
          justify-content: center;
          align-items: center;
          position: absolute;
          top: 5px;
          right: 5px;
          cursor: pointer;
          .closeIcon {
            width: 20px;
            height: 20px;
          }
        }
      }
    }
  }
  .erweima-box {
    display: flex;
    align-items: center;
    justify-content: center;
    padding-top: 20px;
    margin-bottom: 20px;
    position: relative;
    .finishPayBtn {
      left: 54%;
      position: absolute;
    }
  }
  &:nth-child(2) {
    flex: 1;
  }
}
</style>
