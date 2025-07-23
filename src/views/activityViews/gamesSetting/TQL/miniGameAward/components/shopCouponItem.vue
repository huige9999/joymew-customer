<template>
  <div class="editInfo-container-item award-info">
    <div class="title">优惠券{{ index + 1 }}详情:</div>
    <div class="input">
      <div class="coupon-detail" v-if="choosed">
        <div class="coupon-detail-info">
          <div class="coupon-detail-item">
            优惠券描述:
            <!-- {{choosed}} -->
            <span v-html="choosed.name"></span>
          </div>

          <div class="coupon-detail-item">简介: {{ choosed.descBrief }}</div>
          <div class="coupon-detail-item" v-if="choosed.threshold">最低门槛: {{ choosed.threshold }}</div>
          <div class="coupon-detail-item" v-else>最低门槛: 无限制</div>
          <div class="coupon-detail-item">领取说明: {{ choosed.descGet }}</div>
          <div class="coupon-detail-item">优惠说明: {{ choosed.descDiscount }}</div>
          <div class="coupon-detail-item">使用须知: {{ choosed.descUse }}</div>
          <div class="coupon-detail-item">使用时间段:【 {{ choosed.timeBegin }} - {{ choosed.timeEnd }}】</div>
          <div class="coupon-detail-item">创建日期: {{ choosed.createTime }}</div>
          <!-- <div class="coupon-detail-item">使用范围: {{ choosed.use_scope | scopeType }}</div> -->
          <div class="coupon-detail-item">面值: {{ choosed.amount }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'shopCouponItem',
  filters: {
    couponType(type) {
      if (type === 1) {
        return '代金券';
      }
      if (type === 2) {
        return '礼品劵';
      }
      return '';
    },
    scopeType(type) {
      if (type === 1) {
        return '门店消费';
      }
      if (type === 2) {
        return '商城消费';
      }
      if (type === 3) {
        return '外卖消费';
      }
      if (type === 4) {
        return '预定消费';
      }
      return '';
    },
  },
  props: {
    choosed: {
      type: [Object],
    },
    index: {
      type: [Number, String],
    },
  },
};
</script>

<style lang="less" scoped>
.award-info {
  .title {
    font-size: 15px;
    font-weight: 400;
    color: #6f7682;
  }
  .input {
    margin-left: 80px;
  }
  .tips {
    font-size: 13px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #c7cdd5;
    margin-left: 20px;
  }
}
.editInfo-container-item {
  display: flex;
  align-items: center;
  margin-top: 30px;
}
.coupon-detail-info {
  // position: absolute;
  width: 430px;
  // height: 102px;
  display: flex;
  justify-content: space-between;
  box-shadow: 0px 0px 5px #d5e1ff;
  flex-wrap: wrap;
  .coupon-detail-item {
    width: 50%;
  }
}
</style>
