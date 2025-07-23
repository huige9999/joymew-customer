<!-- 活动收入头部数据组件 -->
<template>
  <div class="headerItem">
    <!-- 红包墙购买 -->
    <div class="item" v-if="exists.includes('buyWall')" :style="{ order: exists.indexOf('buyWall') }">
      <div class="left">
        <img src="@/assets/image/icon/headerData/buyBox.png" alt="" />
      </div>
      <div class="right">
        <div>红包数量</div>
        <div v-if="sumInfo[0]" :style="{ color: color.lightGreen }">{{ sumInfo[0].count }}</div>
      </div>
    </div>
    <!-- 红包墙消费 -->
    <div class="item" v-if="exists.includes('redConsume')" :style="{ order: exists.indexOf('redConsume') }">
      <div class="left">
        <img src="@/assets/image/icon/headerData/cost.png" alt="" />
      </div>
      <div class="right">
        <div>红包墙总消费</div>
        <div v-if="sumInfo[0]" :style="{ color: color.lightOrange }">{{ sumInfo[0].allused }}</div>
      </div>
    </div>
    <!-- 红包墙分成比例 -->
    <div class="item" v-if="exists.includes('redPercent')" :style="{ order: exists.indexOf('redPercent') }">
      <div class="left">
        <img src="@/assets/image/icon/headerData/shareNum.png" alt="" />
      </div>
      <div class="right">
        <div>分成比例</div>
        <div v-if="sumInfo[0]" :style="{ color: color.red }">{{ parseFloat(sumInfo[0].earning_ratio * 100) + '%' }}</div>
      </div>
    </div>
    <!-- 红包墙分成 -->
    <div class="item" v-if="exists.includes('redDivide')" :style="{ order: exists.indexOf('redDivide') }">
      <div class="left">
        <img src="@/assets/image/icon/headerData/boxDivide.png" alt="" />
      </div>
      <div class="right">
        <div>红包墙分成</div>
        <div v-if="sumInfo[0]" :style="{ color: color.orange }">{{ sumInfo[0].earning }}</div>
      </div>
    </div>

    <!-- 宝箱购买 -->
    <div class="item" v-if="exists.includes('buyBox')" :style="{ order: exists.indexOf('buyBox') }">
      <div class="left">
        <img src="@/assets/image/icon/headerData/buyBox.png" alt="" />
      </div>
      <div class="right">
        <div>宝箱购买</div>
        <div v-if="sumInfo[0]" :style="{ color: color.lightGreen }">{{ sumInfo[0].count }}</div>
      </div>
    </div>
    <!-- 宝箱消费 -->
    <div class="item" v-if="exists.includes('boxConsume')" :style="{ order: exists.indexOf('boxConsume') }">
      <div class="left">
        <img src="@/assets/image/icon/headerData/cost.png" alt="" />
      </div>
      <div class="right">
        <div>宝箱总消费</div>
        <div v-if="sumInfo[0]" :style="{ color: color.lightOrange }">{{ sumInfo[0].allused }}</div>
      </div>
    </div>
    <!-- 宝箱分成比例 -->
    <div class="item" v-if="exists.includes('boxPercent')" :style="{ order: exists.indexOf('boxPercent') }">
      <div class="left">
        <img src="@/assets/image/icon/headerData/shareNum.png" alt="" />
      </div>
      <div class="right">
        <div>分成比例</div>
        <div v-if="sumInfo[0]" :style="{ color: color.red }">{{ parseFloat(sumInfo[0].earning_ratio * 100) + '%' }}</div>
      </div>
    </div>
    <!-- 宝箱分成 -->
    <div class="item" v-if="exists.includes('boxDivide')" :style="{ order: exists.indexOf('boxDivide') }">
      <div class="left">
        <img src="@/assets/image/icon/headerData/boxDivide.png" alt="" />
      </div>
      <div class="right">
        <div>宝箱分成</div>
        <div v-if="sumInfo[0]" :style="{ color: color.orange }">{{ sumInfo[0].earning }}</div>
      </div>
    </div>

    <!-- 霸屏数量 -->
    <div class="item" v-if="exists.includes('allScreenAmount')" :style="{ order: exists.indexOf('allScreenAmount') }">
      <div class="left">
        <img src="@/assets/image/icon/headerData/allScreenAmount.png" alt="" />
      </div>
      <div class="right">
        <div>霸屏数量</div>
        <div v-if="sumInfo[0]" :style="{ color: color.lightGreen }">{{ sumInfo[0].count }}</div>
      </div>
    </div>
    <!-- 霸屏消费 -->
    <div class="item" v-if="exists.includes('allScreenConsume')" :style="{ order: exists.indexOf('allScreenConsume') }">
      <div class="left">
        <img src="@/assets/image/icon/headerData/cost.png" alt="" />
      </div>
      <div class="right">
        <div>霸屏总消费</div>
        <div v-if="sumInfo[0]" :style="{ color: color.lightOrange }">{{ sumInfo[0].allused }}</div>
      </div>
    </div>
    <!-- 霸屏分成比例 -->
    <div class="item" v-if="exists.includes('allScreenPercent')" :style="{ order: exists.indexOf('allScreenPercent') }">
      <div class="left">
        <img src="@/assets/image/icon/headerData/shareNum.png" alt="" />
      </div>
      <div class="right">
        <div>分成比例</div>
        <div v-if="sumInfo[0]" :style="{ color: color.red }">{{ parseFloat(sumInfo[0].earning_ratio * 100) + '%' }}</div>
      </div>
    </div>
    <!-- 霸屏分成 -->
    <div class="item" v-if="exists.includes('allScreenDivide')" :style="{ order: exists.indexOf('allScreenDivide') }">
      <div class="left">
        <img src="@/assets/image/icon/headerData/allScreenDivide.png" alt="" />
      </div>
      <div class="right">
        <div>霸屏分成</div>
        <div v-if="sumInfo[0]" :style="{ color: color.orange }">{{ sumInfo[0].earning }}</div>
      </div>
    </div>

    <!-- 弹幕数量 -->
    <div class="item" v-if="exists.includes('danMuNum')" :style="{ order: exists.indexOf('danMuNum') }">
      <div class="left">
        <img src="@/assets/image/icon/headerData/danMuNum.png" alt="" />
      </div>
      <div class="right">
        <div>弹幕数量</div>
        <div v-if="sumInfo[0]" :style="{ color: color.lightGreen }">{{ sumInfo[0].count }}</div>
      </div>
    </div>
    <!-- 弹幕消费 -->
    <div class="item" v-if="exists.includes('danMuConsume')" :style="{ order: exists.indexOf('danMuConsume') }">
      <div class="left">
        <img src="@/assets/image/icon/headerData/cost.png" alt="" />
      </div>
      <div class="right">
        <div>弹幕总消费</div>
        <div v-if="sumInfo[0]" :style="{ color: color.lightOrange }">{{ sumInfo[0].allused }}</div>
      </div>
    </div>
    <!-- 弹幕分成比例 -->
    <div class="item" v-if="exists.includes('danMuPercent')" :style="{ order: exists.indexOf('danMuPercent') }">
      <div class="left">
        <img src="@/assets/image/icon/headerData/shareNum.png" alt="" />
      </div>
      <div class="right">
        <div>分成比例</div>
        <div v-if="sumInfo[0]" :style="{ color: color.red }">{{ parseFloat(sumInfo[0].earning_ratio * 100) + '%' }}</div>
      </div>
    </div>
    <!-- 弹幕分成 -->
    <div class="item" v-if="exists.includes('danMuDivide')" :style="{ order: exists.indexOf('danMuDivide') }">
      <div class="left">
        <img src="@/assets/image/icon/headerData/danMuDivide.png" alt="" />
      </div>
      <div class="right">
        <div>弹幕分成</div>
        <div v-if="sumInfo[0]" :style="{ color: color.red }">{{ sumInfo[0].earning }}</div>
      </div>
    </div>

    <!-- 礼物数量 -->
    <div class="item" v-if="exists.includes('giftNum')" :style="{ order: exists.indexOf('giftNum') }">
      <div class="left">
        <img src="@/assets/image/icon/headerData/giftNum.png" alt="" />
      </div>
      <div class="right">
        <div>礼物数量</div>
        <div v-if="sumInfo[0]" :style="{ color: color.lightGreen }">{{ sumInfo[0].count }}</div>
      </div>
    </div>
    <!-- 礼物消费 -->
    <div class="item" v-if="exists.includes('giftConsume')" :style="{ order: exists.indexOf('giftConsume') }">
      <div class="left">
        <img src="@/assets/image/icon/headerData/cost.png" alt="" />
      </div>
      <div class="right">
        <div>礼物总消费</div>
        <div v-if="sumInfo[0]" :style="{ color: color.lightOrange }">{{ sumInfo[0].allused }}</div>
      </div>
    </div>
    <!-- 礼物分成比例 -->
    <div class="item" v-if="exists.includes('giftPercent')" :style="{ order: exists.indexOf('giftPercent') }">
      <div class="left">
        <img src="@/assets/image/icon/headerData/shareNum.png" alt="" />
      </div>
      <div class="right">
        <div>分成比例</div>
        <div v-if="sumInfo[0]" :style="{ color: color.red }">{{ parseFloat(sumInfo[0].earning_ratio * 100) + '%' }}</div>
      </div>
    </div>
    <!-- 礼物分成 -->
    <div class="item" v-if="exists.includes('giftDivided')" :style="{ order: exists.indexOf('giftDivided') }">
      <div class="left">
        <img src="@/assets/image/icon/headerData/giftDivided.png" alt="" />
      </div>
      <div class="right">
        <div>礼物分成</div>
        <div v-if="sumInfo[0]" :style="{ color: color.orange }">{{ sumInfo[0].earning }}</div>
      </div>
    </div>

    <!-- 照片数量照片分成通用 -->
    <div class="item" v-if="exists.includes('photoAmount')" :style="{ order: exists.indexOf('photoAmount') }">
      <div class="left">
        <img src="@/assets/image/icon/headerData/photoAmount.png" alt="" />
      </div>
      <div class="right">
        <div>照片数量</div>
        <div v-if="sumInfo[0]" :style="{ color: color.lightGreen }">{{ sumInfo[0].count }}</div>
      </div>
    </div>
    <!-- 照片消费 -->
    <div class="item" v-if="exists.includes('photoConsume')" :style="{ order: exists.indexOf('photoConsume') }">
      <div class="left">
        <img src="@/assets/image/icon/headerData/cost.png" alt="" />
      </div>
      <div class="right">
        <div>照片总消费</div>
        <div v-if="sumInfo[0]" :style="{ color: color.lightOrange }">{{ sumInfo[0].allused }}</div>
      </div>
    </div>
    <!-- 照片分成比例 -->
    <div class="item" v-if="exists.includes('photoPercent')" :style="{ order: exists.indexOf('photoPercent') }">
      <div class="left">
        <img src="@/assets/image/icon/headerData/shareNum.png" alt="" />
      </div>
      <div class="right">
        <div>分成比例</div>
        <div v-if="sumInfo[0]" :style="{ color: color.red }">{{ parseFloat(sumInfo[0].earning_ratio * 100) + '%' }}</div>
      </div>
    </div>
    <!-- 照片分成 -->
    <div class="item" v-if="exists.includes('photoDivide')" :style="{ order: exists.indexOf('photoDivide') }">
      <div class="left">
        <img src="@/assets/image/icon/headerData/photoDivide.png" alt="" />
      </div>
      <div class="right">
        <div>照片分成</div>
        <div v-if="sumInfo[0]" :style="{ color: color.orange }">{{ sumInfo[0].earning }}</div>
      </div>
    </div>

    <!-- 扭一扭参与人数 -->
    <div class="item" v-if="exists.includes('paticipate')" :style="{ order: exists.indexOf('paticipate') }">
      <div class="left">
        <img src="@/assets/image/icon/headerData/paticipate.png" alt="" />
      </div>
      <div class="right">
        <div>参与人数</div>
        <div v-if="sumInfo[0]" :style="{ color: color.lightGreen }">{{ sumInfo[0].count }}</div>
      </div>
    </div>
    <!-- 扭一扭总消费 -->
    <div class="item" v-if="exists.includes('zyzTotalConsume')" :style="{ order: exists.indexOf('zyzTotalConsume') }">
      <div class="left">
        <img src="@/assets/image/icon/headerData/cost.png" alt="" />
      </div>
      <div class="right">
        <div>总消费</div>
        <div v-if="sumInfo[0]" :style="{ color: color.lightOrange }">{{ sumInfo[0].allused }}</div>
      </div>
    </div>
    <!-- 扭一扭分成比例 -->
    <div class="item" v-if="exists.includes('zyzPercent')" :style="{ order: exists.indexOf('zyzPercent') }">
      <div class="left">
        <img src="@/assets/image/icon/headerData/shareNum.png" alt="" />
      </div>
      <div class="right">
        <div>分成比例</div>
        <div v-if="sumInfo[0]" :style="{ color: color.red }">{{ parseFloat(sumInfo[0].earning_ratio * 100) + '%' }}</div>
      </div>
    </div>
    <!-- 扭一扭分成 -->
    <div class="item" v-if="exists.includes('zyzDivide')" :style="{ order: exists.indexOf('zyzDivide') }">
      <div class="left">
        <img src="@/assets/image/icon/headerData/zyzDivide.png" alt="" />
      </div>
      <div class="right">
        <div>扭一扭分成</div>
        <div v-if="sumInfo[0]" :style="{ color: color.orange }">{{ sumInfo[0].earning }}</div>
      </div>
    </div>

    <!-- 红包口袋充值人数 -->
    <div class="item" v-if="exists.includes('topUpNum')" :style="{ order: exists.indexOf('topUpNum') }">
      <div class="left">
        <img src="@/assets/image/icon/headerData/user.png" alt="" />
      </div>
      <div class="right">
        <div>充值人数</div>
        <div v-if="sumInfo[0]" :style="{ color: color.lightGreen }">{{ sumInfo[0].count }}</div>
      </div>
    </div>
    <!-- 充值金额 -->
    <div class="item" v-if="exists.includes('topUpAmount')" :style="{ order: exists.indexOf('topUpAmount') }">
      <div class="left">
        <img src="@/assets/image/icon/headerData/cost.png" alt="" />
      </div>
      <div class="right">
        <div>总消费</div>
        <div v-if="sumInfo[0]" :style="{ color: color.lightOrange }">{{ sumInfo[0].allused }}</div>
      </div>
    </div>
    <!-- 红包口袋剩余金额 -->
    <div class="item" v-if="exists.includes('remainAmount') && txVisible" :style="{ order: exists.indexOf('remainAmount') }">
      <div class="left">
        <img src="@/assets/image/icon/headerData/totalProfit.png" alt="" />
      </div>
      <div class="right">
        <div>剩余金额</div>
        <div :style="{ color: color.red }">{{ hbBalance }}</div>
        <div @click="showCashoutDialog">提现</div>
      </div>
    </div>
    <my-dialog :show="cashoutDialogIsShow">
      <div class="cashoutTitle" slot="title">
        <img src="@/assets/image/redPackageRain/hbyrecharge-logo.png" alt="" width="26" height="31" />
        <div class="title-text">红包提现</div>
      </div>
      <!-- 用户绑定情况下显示提现具体信息界面 -->
      <div class="cashout-info" v-show="isShowWXQRcode">
        <div class="balance-box">
          <div class="title">红包账户余额</div>
          <div class="info">{{ hbBalance }}</div>
        </div>
        <div class="cashout-box">
          <div class="get-money-time">
            <div class="title">到账时间</div>
            <div class="info">实时到账</div>
          </div>
          <div class="first-cashout-type">
            <div class="title">提现首款方式</div>
            <div class="info">微信钱包账户</div>
          </div>
          <div class="cashout-tips">
            <div class="title">提现金额</div>
            <div class="info">每次提现金额1-2000元，大于2000请使用支付宝提现</div>
          </div>
          <div class="cashout-extra-amount">
            <div class="title">提现费用</div>
            <div class="info">8%</div>
          </div>
          <div class="agreement">
            <el-checkbox v-model="isAgree"></el-checkbox>
            <div class="agreeTxt">已阅读并同意<label @click="toReadAgreement">嗨喵红包提现服务协议</label></div>
          </div>
          <div class="btn-group">
            <el-button type="primary" @click="confirmCashout">确认提现</el-button>
            <el-button type="info" @click="cancelCashout">取消</el-button>
          </div>
        </div>
      </div>
      <!-- 用户未绑定微信 显示二维码轮询 -->
      <div class="cashout-info2" v-show="!isShowWXQRcode">
        <div class="qrcode-container">
          <img :src="officialAccountQRCode" alt="" />
          <!-- <img
            src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1605693055488&di=3f5f2b90219f5a1ab838cd849d7f3089&imgtype=0&src=http%3A%2F%2Fbpic.588ku.com%2Felement_origin_min_pic%2F25%2F04%2F20%2F16571d91951a416.jpg"
            alt=""
          /> -->
        </div>
        <div class="test">请扫码绑定公众号，提现自动到账微信零钱</div>
        <div class="btn-group">
          <el-button type="primary" @click="cancelWXCashout">关闭</el-button>
        </div>
      </div>
    </my-dialog>
  </div>
</template>

<script>
import { getActivityMsg } from '@/api/setting/activitySetting/gameSetting';
import myDialog from '@/components/myDialog';
import request from '@/utils/request';

import { getBindWXERCode, judgeIsBindWX } from '@/api/app/user';

let timer;

export default {
  name: 'headerDatas',
  props: {
    exists: Array,
    sumInfo: Array,
  },
  created() {
    this.getBalance();
    this.getWXbindQRcode(); // 显示二维码
  },
  components: {
    myDialog,
  },
  computed: {
    // 是否显示二维码
    isShowWXQRcode() {
      const { userInfo } = this.$store.state.login;
      if (userInfo && userInfo.wx_openid) {
        return true;
      }

      return false;
    },
    txVisible() {
      const { is_hide_tx } = this.$store.state.login.userInfo.config;
      return !is_hide_tx;
    },
  },
  data() {
    return {
      color: {
        lightOrange: '#FFB97E',
        lightGreen: '#3BCACD',
        red: '#FB466C',
        orange: '#FF7F74',
      },
      hbBalance: 0,
      cashoutDialogIsShow: false,
      officialAccountQRCode: '',
      isAgree: false,
    };
  },
  methods: {
    /* 显示提现弹框 */
    showCashoutDialog() {
      // 判断是否绑定微信
      this.checkIsBindWX();
      console.log('提现弹框');
      this.cashoutDialogIsShow = true;
    },
    /* 获取账户余额 */
    getBalance() {
      getActivityMsg({
        id: this.$store.state.liveId,
      }).then((res) => {
        console.log('余额', res);
        this.hbBalance = res.data.balance;
      });
    },
    confirmCashout() {
      if (!this.isAgree) {
        this.$message.error('请先阅读并同意嗨喵红包提现服务协议!');
        return;
      }
      // 判断提现金额不小于0.4
      if (this.hbBalance < 0.4) {
        this.$message.error('提现金额不能小于0.4元!');
        return;
      }
      // 已绑定微信  请求提现接口
      request.post('/newHuoDongHm/moneyTiXian', { splid: this.$store.state.liveId }).then((res) => {
        console.log('提现信息', res);
        this.hbBalance = 0;
        this.$message({
          type: 'success',
          message: '微信提现成功请注意查收',
        });
      });
      this.cashoutDialogIsShow = false;
    },
    cancelCashout() {
      this.cashoutDialogIsShow = false;
    },
    cancelWXCashout() {
      this.cashoutDialogIsShow = false;
      clearInterval(timer);
    },
    /* 请求绑定微信二维码 */
    getWXbindQRcode() {
      getBindWXERCode({
        request_from_page: 'app/activity/activityIncome/redpackageRain',
      })
        .then((img) => {
          this.officialAccountQRCode = img;
          console.log('wxbindcode-url', img);
        })
        .catch(() => {});
    },
    /* 判断是否绑定微信 */
    checkIsBindWX() {
      // 判断是否绑定微信
      if (!this.isShowWXQRcode) {
        // 已绑定微信
        // 未绑定微信 显示绑定二维码  做轮询请求

        // 重复轮询请求
        timer = setInterval(() => {
          judgeIsBindWX({
            request_from_page: 'app/activity/activityIncome/redpackageRain',
          })
            .then((res) => {
              console.log('提现轮询结果', res);
              if (res.success) {
                // 关注成功 切换到提现详情
                clearInterval(timer);
                if (res.data.wx_openid) {
                  this.$store.commit('login/updateUserInfo', {
                    wx_openid: res.data.wx_openid,
                  });
                }
              }
            })
            .catch((err) => {
              console.log(err);
            });
        }, 2000);
      }
    },
    toReadAgreement() {
      window.open('https://www.hudongmiao.com/agreement/index.html', '_blank');
    },
  },
};
</script>

<style lang="less" scoped>
.headerItem {
  width: 100%;
  display: flex;
}
.item {
  width: 25%;
  margin-top: 28px;
  display: flex;
  justify-content: center;
  flex: none;
  // 分割线
  border-right: solid 2px #eeeeee;
  &:last-child {
    border-right: none;
  }
  // 左侧图片
  .left {
    width: 40px;
    height: 40px;
    img {
      width: 100%;
      height: 100%;
    }
  }
  // 右侧文字
  .right {
    margin-left: 8px;
    white-space: nowrap;
    position: relative;
    div:first-of-type {
      font-size: 12px;
      color: #666666;
    }
    div:nth-of-type(2) {
      font-size: 18px;
      padding-top: 2px;
    }
    div:nth-of-type(3) {
      position: absolute;
      top: 20px;
      left: 60px;
      width: 40px;
      height: 20px;
      text-align: center;
      line-height: 20px;
      font-size: 12px;
      color: #ffffff;
      background: #61aaf4;
      border-radius: 4px;
      cursor: pointer;
    }
  }
}
/* 红包提现弹出框 */
.cashoutTitle {
  display: flex;
  align-items: center;
  .title-text {
    margin-left: 20px;
    font-size: 25px;
    font-family: SourceHanSansSC-Regular, SourceHanSansSC;
    font-weight: 400;
    color: #42474e;
  }
}
.cashout-info2 {
  .qrcode-container {
    display: flex;
    justify-content: center;
    align-items: center;
    img {
      width: 250px;
      height: 250px;
    }
  }
  .test {
    padding: 30px 20%;
    text-align: center;
  }
  .btn-group {
    display: flex;
    justify-content: center;
    align-items: center;
    padding-bottom: 20px;
  }
}
.cashout-info {
  .balance-box {
    display: flex;
    align-items: center;
    margin-top: 40px;
    .title {
      width: 150px;
      font-size: 14px;
      font-family: SourceHanSansSC-Normal, SourceHanSansSC;
      font-weight: 400;
      color: #6f7682;
    }
    .info {
      font-size: 27px;
      font-family: DIN-Medium, DIN;
      font-weight: 500;
      color: #fb466c;
      letter-spacing: 1px;
    }
  }
  .cashout-box {
    & > div {
      display: flex;
      align-items: center;
      margin-top: 40px;
      .title {
        font-size: 14px;
        font-family: SourceHanSansSC-Normal, SourceHanSansSC;
        font-weight: 400;
        color: #6f7682;
        width: 150px;
      }
      .info {
        font-size: 14px;
        font-family: SourceHanSansSC-Normal, SourceHanSansSC;
        font-weight: 400;
        color: #6f7682;
      }
    }
    .first-cashout-type {
      .tips {
        font-size: 13px;
        font-family: SourceHanSansSC-Normal, SourceHanSansSC;
        font-weight: 400;
        color: #fb466c;
        margin-left: 20px;
        a {
          font-size: 13px;
          font-family: SourceHanSansSC-Normal, SourceHanSansSC;
          font-weight: 400;
          color: #249aff;
        }
      }
    }
    .agreement {
      label {
        color: #1e87f0;
        cursor: pointer;
      }
      .agreeTxt {
        margin-left: 10px;
      }
    }
    .btn-group {
      display: flex;
      padding-left: 150px;
      padding-bottom: 30px;
    }
  }
}
</style>
