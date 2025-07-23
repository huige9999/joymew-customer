<template>
  <div class="page">
    <!-- 新增奖项弹出框 -->
    <my-dialog :show="addAwardDialogVisible" style="width: 700px">
      <div class="editTitle" slot="title">
        <div class="title-text">添加奖项:</div>
      </div>
      <div class="awardClassTypes">
        <div class="awardClassType" :class="[{ active: awardClassType === 0 }]" @click="awardClassType = 0">
          优惠券
          <div class="award-line"></div>
        </div>
        <div class="awardClassType" :class="[{ active: awardClassType === 1 }]" @click="awardClassType = 1">
          实物
          <div class="award-line"></div>
        </div>
      </div>
      <div class="coupon" v-if="awardClassType === 0">
        <div class="editInfo-container">
          <div class="editInfo-container-item award-info">
            <div class="title">名次:</div>
            <div class="input">
              <el-select v-model="chooseRank" placeholder style="width: 300px">
                <el-option v-for="item in remainedRanks" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </div>
          </div>
          <div class="editInfo-container-item award-info">
            <div class="title">奖品名称:</div>
            <div class="input">
              <el-input v-model="prizeName" placeholder="请输入内容" type="textarea"></el-input>
            </div>
            <div class="tips"></div>
          </div>
          <div class="editInfo-container-item award-info">
            <div class="title">优惠券类目:</div>
            <div class="input">
              <el-select v-model="chooseCoupon" placeholder style="width: 300px" multiple>
                <el-option v-for="item in coupons" :key="item.couponId" :label="item.name" :value="item.couponId"></el-option>
              </el-select>
            </div>
          </div>

          <div class="coupon-list-wrap">
            <div class="editInfo-container-item award-info" v-for="(choosed, index) in chooseCouponObjList" :key="index">
              <div class="title">优惠券{{ index + 1 }}详情:</div>
              <div class="input">
                <div class="coupon-detail" v-if="choosed">
                  <div class="coupon-detail-info">
                    <div class="coupon-detail-item">
                      优惠券描述:
                      <span v-html="choosed.summary"></span>
                    </div>
                    <div class="coupon-detail-item">启用金额: {{ choosed.enable_amount }} （分）</div>
                    <div class="coupon-detail-item">优惠券类型: {{ choosed.type | couponType }}</div>
                    <div class="coupon-detail-item">使用时间段:【 {{ choosed.use_week_day.join(',') }}】</div>
                    <div class="coupon-detail-item">创建日期: {{ choosed.created }}</div>
                    <div class="coupon-detail-item">使用范围: {{ choosed.use_scope | scopeType }}</div>
                    <div class="coupon-detail-item">面值: {{ choosed.deno }}（分）</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="editBtn-group" style="margin-top: 80px">
          <el-button type="primary" class="save-btn" @click="keepAddShop">&nbsp;&nbsp;保存&nbsp;&nbsp;</el-button>
          <el-button type="info" class="cancel-btn" @click="cancelAdd">&nbsp;&nbsp;取消&nbsp;&nbsp;</el-button>
        </div>
      </div>

      <div class="coupon" v-else>
        <div class="editInfo-container">
          <div class="editInfo-container-item award-info">
            <div class="title">名次:</div>
            <div class="input">
              <el-select v-model="chooseRank" placeholder style="width: 300px">
                <el-option v-for="item in remainedRanks" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </div>
          </div>
          <div class="editInfo-container-item award-info">
            <div class="title">实物名:</div>
            <div class="input">
              <el-input v-model="awardType" placeholder="请输入内容"></el-input>
            </div>
          </div>
        </div>
        <div class="editBtn-group" style="margin-top: 80px">
          <el-button type="primary" class="save-btn" @click="keepAddShop">&nbsp;&nbsp;保存&nbsp;&nbsp;</el-button>
          <el-button type="info" class="cancel-btn" @click="cancelAdd">&nbsp;&nbsp;取消&nbsp;&nbsp;</el-button>
        </div>
      </div>
    </my-dialog>
  </div>
</template>

<script>
export default {
  name: 'addCusAward',
  data() {
    return {
      awardClassType: 0, // 0优惠卷  1 实物
    };
  },
  props: {
    addAwardDialogVisible: {
      type: Boolean,
    },
  },
  methods: {
    keepAddShop() {},
  },
};
</script>

<style lang="less" scoped>
.page {
  width: 100vw;
  height: 100vh;
  position: absolute;
  top: 0;
  left: 0;
}
.coupon-list-wrap {
  max-height: 400px;
  overflow-y: scroll;
}
.btn-position {
  margin-right: 40px;
}
.awardClassTypes {
  width: 80%;
  margin: 0 auto;
  height: 35px;
  font-size: 24px;
  display: flex;
  .awardClassType {
    width: 50%;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    &.active {
      color: #249aff;
      font-weight: bold;
      .award-line {
        background: #249aff;
        position: absolute;
        width: 23px;
        height: 3px;
        left: 50%;
        transform: translateX(-50%);
        bottom: -5px;
      }
    }
  }
}
.editTitle {
  display: flex;
  .title-text {
    font-size: 26px;
    font-family: SourceHanSansSC-Regular, SourceHanSansSC;
    font-weight: 400;
    color: #42474e;
  }
}
.editInfo-container {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  .editInfo-container-item {
    display: flex;
    align-items: center;
    margin-top: 30px;
  }
  .uploadImg {
    .uploadImg-input-box {
      width: 129px;
      height: 77px;
      border-radius: 4px;
      border: 1px dashed #cccccc;
      text-align: center;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-left: 80px;
    }
    .uploadImg-btn {
      margin-left: 20px;
      .tips {
        margin-top: 10px;
        font-size: 11px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #333333;
      }
    }
  }
  .award-info {
    .title {
      font-size: 15px;
      font-family: SourceHanSansSC-Normal, SourceHanSansSC;
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
}
.editBtn-group {
  padding-left: 143px;
  margin-top: 30px;
  margin-bottom: 40px;
  padding-bottom: 40px;
  .save-btn,
  .cancel-btn {
    padding: 10px 40px;
  }
  .cancel-btn {
    margin-left: 30px;
  }
}

.coupon-detail {
  // margin-left: 10px;
  position: relative;
  width: 632px;
  //   height: 51px;
  .coupon-detail-bg {
    // position: absolute;
    width: 532px;
    // height: 102px;
    .bg {
      position: absolute;
      left: 0;
      top: 0;
      width: 532px;
      height: 102px;
    }
    .logo {
      position: absolute;
      right: 0;
      width: 102px;
      height: 102px;
    }
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
}
</style>
