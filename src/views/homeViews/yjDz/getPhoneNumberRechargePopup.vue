<!-- 获取手机号页面充值弹窗 -->
<template>
  <el-dialog :visible.sync="dialogVisible" width="60%" center :show-close="false" custom-class="dialog">
    <div class="dialog-content">
      <div class="swiper" :style="{ transform: `translateX(-${50 * swiperIndex}%)` }">
        <div class="swiper-item select-amount">
          <div class="header">
            <div class="title">获取手机号充值</div>
            <div class="el-icon-close close-btn" @click="closeDialog"></div>
          </div>
          <div class="content">
            <div class="remain-count">
              剩余使用次数：<span class="red">{{ remainCount }}</span>
            </div>
            <div class="recharge-amount">
              <div class="recharge-amount-title">充值金额</div>
              <div class="recharge-amount-select">
                <div
                  v-for="(item, index) in rechargeAmountList"
                  :key="index"
                  class="recharge-amount-select-item"
                  :class="selectedItemIndex === index ? 'selected' : ''"
                  @click="selectRechargeAmount(index)"
                >
                  ¥{{ item.price.toFixed(2) }}（{{ item.count }}条）
                </div>
              </div>
            </div>
          </div>
          <hr class="hr" />
          <div class="due-amount">
            应付金额：<span class="red">¥{{ selectedRechargeItemPrice.toFixed(2) }}</span>
          </div>
          <el-button type="primary" class="btn" @click="clickSubmitOrder">
            提交订单
          </el-button>
        </div>
        <div class="swiper-item scan-to-pay">
          <div class="header">
            <div class="left" @click="backToSelectAmount">
              <img src="@/assets/icons/yj-dz/left-arrow-circle.png" class="icon" />
              <span class="text">返回上一层</span>
            </div>
            <div class="title">请扫码充值</div>
            <div class="el-icon-close close-btn" @click="closeDialog"></div>
          </div>
          <div class="qr-code" v-loading="isQrCodeLoading">
            <iframe class="qr-code-iframe" width="150" height="150" :srcdoc="qrCodeHtml" frameborder="0"></iframe>
          </div>
          <hr class="hr" />
          <div class="due-amount">
            应付金额：<span class="red">¥{{ selectedRechargeItemPrice.toFixed(2) }}</span>
          </div>
          <el-button type="primary" class="btn" @click="closeDialog">
            已完成支付
          </el-button>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import { reqAlipay } from '@/api/getPhoneNumber';

export default {
  props: {
    /** 剩余使用次数 */
    remainCount: {
      type: Number,
      default: 0,
    },
    /** 充值金额列表 */
    rechargeAmountList: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      dialogVisible: false,
      selectedItemIndex: 0,
      swiperIndex: 0,
      qrCodeHtml: '',
      isQrCodeLoading: true,
      isPaying: false,
    };
  },
  computed: {
    /** 选中的充值金额 */
    selectedRechargeItemPrice() {
      return this.rechargeAmountList.find((item, index) => index === this.selectedItemIndex)?.price || 0;
    },
  },
  methods: {
    init() {
      this.selectedItemIndex = 0;
      this.swiperIndex = 0;
      this.qrCodeHtml = '';
      this.isQrCodeLoading = true;
      this.isPaying = false;
    },
    openDialog() {
      this.dialogVisible = true;
    },
    closeDialog() {
      if (this.isPaying) {
        this.$emit('completePay');
      }
      this.dialogVisible = false;
      this.init();
    },
    backToSelectAmount() {
      this.swiperIndex = 0;
      this.qrCodeHtml = '';
      this.isQrCodeLoading = true;
    },
    selectRechargeAmount(index) {
      this.selectedItemIndex = index;
    },
    async clickSubmitOrder() {
      this.swiperIndex = 1;
      this.isPaying = true;
      const res = await reqAlipay(this.selectedRechargeItemPrice.toString());
      this.isQrCodeLoading = false;
      this.qrCodeHtml = res.data.order;
    },
  },
};
</script>

<style lang="scss" scoped>
.red {
  color: #fb466c;
}
::v-deep .el-dialog {
  .el-dialog__header {
    display: none;
  }
  .el-dialog__body {
    border-radius: 16px;
  }
  .el-dialog__footer {
    display: none;
  }
}
.dialog-content {
  overflow: hidden;
  position: relative;
  height: 480px;
  width: 100%;
  .swiper {
    position: absolute;
    height: 100%;
    width: 200%;
    display: flex;
    transition: transform 0.3s ease-in-out;

    .swiper-item {
      height: 100%;
      width: 50%;
      display: grid;
      grid-template:
        'header' min-content
        'content' max-content
        'hr' min-content
        'tip' min-content
        'btn' min-content
        / 1fr;
      color: #333;

      &.select-amount {
        .header {
          grid-area: header;
          display: grid;
          grid-template:
            '. title close-btn' min-content
            / 24px 1fr 24px;
          place-items: center;
          margin-bottom: 16px;

          .title {
            grid-area: title;
            font-size: 28px;
            color: #a6a6a6;
          }

          .close-btn {
            grid-area: close-btn;
            font-size: 24px;
            color: #cacaca;
            cursor: pointer;
          }
        }

        .content {
          grid-area: content;

          .remain-count {
            font-size: 20px;
            margin-bottom: 35px;
          }

          .recharge-amount {
            display: flex;
            flex-direction: column;

            .recharge-amount-title {
              font-size: 24px;
              margin-bottom: 24px;
            }

            .recharge-amount-select {
              display: grid;
              grid-template-columns: repeat(3, 1fr);
              row-gap: 24px;
              place-items: center;

              .recharge-amount-select-item {
                width: 173px;
                height: 42px;
                background: #f7f7f7;
                border-radius: 33px;

                display: flex;
                align-items: center;
                justify-content: center;

                line-height: 42px;
                text-align: center;
                font-size: 16px;
                cursor: pointer;

                &.selected {
                  background: #eecad2;
                  color: #fb466c;
                  border: 1px solid #fb466c;
                }
              }
            }
          }
        }
      }

      &.scan-to-pay {
        .header {
          grid-area: header;
          display: grid;
          grid-template:
            'left title close-btn' min-content
            / 1fr 3fr 1fr;
          place-items: center;
          margin-bottom: 16px;

          .title {
            grid-area: title;
            font-size: 28px;
            color: #a6a6a6;
          }

          .close-btn {
            grid-area: close-btn;
            justify-self: end;
            font-size: 24px;
            color: #cacaca;
            cursor: pointer;
          }

          .left {
            grid-area: left;
            justify-self: start;

            display: flex;
            column-gap: 8px;
            align-items: center;
            justify-content: center;
            text-align: center;
            cursor: pointer;

            .icon {
              width: 24px;
              height: 24px;
            }

            .text {
              font-size: 14px;
              line-height: 14px;
              color: #d9d9d9;
            }
          }

          .title {
            grid-area: title;
            font-size: 28px;
            color: #a6a6a6;
          }

          .close-btn {
            grid-area: close-btn;
            font-size: 24px;
            color: #cacaca;
            cursor: pointer;
          }
        }

        .qr-code {
          width: 190px;
          height: 190px;

          margin: 0 auto;

          display: flex;
          align-items: center;
          justify-content: center;

          overflow: hidden;

          .qr-code-iframe {
            transform: scale(1.26);
          }
        }
      }

      .hr {
        grid-area: hr;
        width: 100%;
        margin: 24px 0 40px;
        background-color: #e6e6e6;
        height: 1px;
        border: none;
      }

      .due-amount {
        grid-area: tip;
        justify-self: center;
        font-size: 24px;
      }

      .btn {
        grid-area: btn;
        display: flex;
        justify-self: center;
        margin-top: 48px;
        height: 38px;
        background: #249aff;
        border-radius: 2px;
      }
    }
  }
}
</style>
