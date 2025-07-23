<!--主题设置-->
<template>
  <sub-page>
    <main-card>
      <card-top-info title="基本内容"></card-top-info>
      <div class="base-info-container">
        <div class="left">
          <div class="line">
            <div class="title">名称</div>
            <div class="info">{{ activityInfo.theme }}</div>
          </div>
          <div class="line">
            <div class="title">日期</div>
            <div class="info">{{ activityInfo.using_date }}</div>
          </div>
        </div>
        <!--  -->
        <div class="center">
          <div class="line">
            <div class="title">类型</div>
            <div class="info">{{ activityType }}</div>
          </div>
          <div class="line">
            <div class="title">地点</div>
            <div class="info">{{ activityInfo.hotel_name }}</div>
          </div>
        </div>
        <div class="right">
          <div class="line">
            <div class="title">签到</div>
            <div class="info">0人</div>
          </div>
          <div class="line">
            <div class="title">红包</div>
            <div class="info">{{ hbBalance }}元</div>
            <div class="recharge-btn" @click="showRechargeDialog">充值</div>
          </div>
        </div>
      </div>
      <!-- 红包充值弹出框 -->
      <my-dialog :show="rechargeDialogIsShow">
        <div class="rechargeTitle" slot="title">
          <img src="@/assets/image/redPackageRain/hbyrecharge-logo.png" alt="" width="26" height="31" />
          <div class="title-text">红包账户充值:</div>
        </div>
        <div class="recharge-info">
          <div class="balance-box">
            <div class="title" style="width: 100px">红包账户余额</div>
            <div class="info">{{ hbBalance }}</div>
          </div>
          <div class="recharge-box">
            <div class="title" style="width: 100px">充值金额</div>
            <div class="do-recharge">
              <el-input v-model="rechargeAmount" style="margin-bottom: 10px" @input="reChargeInputChange">
                <div slot="suffix" class="recharge-unit" style="margin-top: 10px; margin-right: 20px">元</div>
              </el-input>
              <span v-show="activityInfo.isNotD">红包账户充值手续费为充值金额的8%</span>
              <div class="btn-group">
                <el-button type="primary" @click="confirmRecharge">确认充值</el-button>
                <el-button type="info" @click="cancelRecharge">取消</el-button>
              </div>
              <div class="erweima-container" v-show="isShowErweima">
                <div class="text1" style="padding: 15px">支付宝支付</div>
                <div class="text2" style="padding-left: 15px; padding-bottom: 10px">
                  红包充值金额&nbsp;&nbsp;
                  <span>￥{{ rechargeAmount }}</span>
                </div>
                <div class="erweima-box" style="margin-left: 17px">
                  <div class="erweima">
                    <div><iframe :srcdoc="erweimaHtml" frameborder="0"></iframe></div>
                  </div>
                  <el-button
                    type="primary"
                    @click="DoneRecharge"
                    size="small"
                    style="height: 40px;position:absolute;left:185px;bottom:90px;"
                  >
                    已完成支付
                  </el-button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </my-dialog>
    </main-card>
    <main-card>
      <card-top-info title="桌面主题"></card-top-info>
      <div class="theme-bg-info">
        <screen-theme @mobileThemeRefresh="onMobileThemeRefresh"></screen-theme>
        <mobile-theme ref="mobileThemeRef"></mobile-theme>
      </div>
    </main-card>
    <main-card v-if="shareCardVisible">
      <card-top-info title="自定义小程序分享卡片"></card-top-info>
      <div class="shareCardInfo">
        <shareCardTheme :sceneType="sceneType" />
      </div>
    </main-card>
    <el-dialog class="newUserRechargeTipDialog" :visible.sync="newUserRechargeTipDialogVisible" width="780px" center>
      <template slot="title">
        <div class="newUserRechargeTitle">充值失败</div>
      </template>
      <div class="newUserRechargeMain">
        <img src="https://ustatic.hudongmiao.com/miao/app/cp-qrcode.png" class="kefuImg" />
        <div class="tipText">
          新手
          <label>暂无红包充值权限</label>
          ，请添加客服微信申请开通
        </div>
        <el-button type="primary" class="getItBtn" @click="newUserRechargeTipDialogVisible = false">
          我知道了
        </el-button>
      </div>
    </el-dialog>
  </sub-page>
</template>
<script>
import { getActivityMsg, getHbyErweima2 } from '@/api/setting/activitySetting/gameSetting';
import { getActivity } from '@/api/setting/activitySetting/theme';
import { SCENE_TYPE } from '@/assets/constant/theme';
import CardTopInfo from '@/components/cardTopInfo';
import MainCard from '@/components/mainCard';
import myDialog from '@/components/myDialog';
import SubPage from '@/components/subPage';
import { judgeIsHttps } from '@/utils/index';
import mobileTheme from './theme/mobileTheme';
import ScreenTheme from './theme/screenTheme';
import shareCardTheme from './theme/shareCardTheme';

export default {
  name: 'themeSetting',
  components: {
    SubPage,
    MainCard,
    CardTopInfo,
    ScreenTheme,
    mobileTheme,
    myDialog,
    shareCardTheme,
  },
  data() {
    return {
      activityInfo: {},
      // 红包账户余额
      hbBalance: 0,
      rechargeDialogIsShow: false,
      erweimaHtml: '',
      isShowErweima: false,
      // 充值金额
      rechargeAmount: 0,
      shareCardVisible: false,
      sceneType: '0',
      newUserRechargeTipDialogVisible: false,
    };
  },
  computed: {
    // 活动类型
    activityType() {
      return SCENE_TYPE[this.activityInfo.scenario];
    },
    isNewUser() {
      const { is_hide_tx } = this.$store.state.login.userInfo.config;
      return is_hide_tx;
    },
  },
  created() {
    this.getActivityInfo();
    this.getBalance();
  },
  methods: {
    onMobileThemeRefresh() {
      this.$refs.mobileThemeRef.getMoblieList();
    },
    showRechargeDialog() {
      if (this.isNewUser) {
        this.newUserRechargeTipDialogVisible = true;
        return;
      }
      this.rechargeDialogIsShow = true;
    },
    /* 确认充值 显示二维码 */
    confirmRecharge() {
      if (!/^\d+(?=\.{0,1}\d+$|$)/.test(this.rechargeAmount) || this.rechargeAmount === 0 || this.rechargeAmount === '0') {
        this.$message.error('请输入合法的金额');
        return;
      }
      this.isShowErweima = true;
      this.requestErweima(this.rechargeAmount);
    },
    /* 金额输入框改变触发 */
    reChargeInputChange() {
      // 隐藏二维码相关区域
      this.isShowErweima = false;
    },
    /* 取消充值 关闭弹框 */
    cancelRecharge() {
      this.rechargeDialogIsShow = false;
      this.isShowErweima = false;
      this.rechargeAmount = 0;
    },
    /* 已经完成支付 关闭弹框 */
    DoneRecharge() {
      // 及时更新账户余额
      this.getBalance();
      this.rechargeDialogIsShow = false;
      this.isShowErweima = false;
      this.rechargeAmount = 0;
    },
    /* 请求支付二维码 */
    requestErweima(rechargeAmount) {
      const data = {
        splid: this.$store.state.liveId,
        money: rechargeAmount,
        // USER_ID: this.$store.state.liveId,
        pay_type: 'alipay',
        isHttps: judgeIsHttps(),
      };
      getHbyErweima2(data).then((res) => {
        this.erweimaHtml = `${res.data.order}`;
      });
    },
    // 获取活动的信息
    getActivityInfo() {
      const splid = this.$store.state.liveId;
      getActivity({ splid }).then((res) => {
        console.log(res);
        this.activityInfo = res.data;
        this.sceneType = this.activityInfo.scenario;
        if (res.data.wx_qrurl !== '0') {
          this.shareCardVisible = true;
        }
      });
    },
    /* 获取账户余额 */
    getBalance() {
      const id = this.$store.state.liveId;

      getActivityMsg({ id }).then((res) => {
        console.log('余额', res);
        this.hbBalance = res.data.balance;
      });
    },
  },
};
</script>
<style scoped lang="less">
.button-group {
  margin-right: 20px;
}
.base-info-container {
  display: flex;
  margin: 20px;
  margin-top: -10px;
  & > div {
    height: 100px;
    display: flex;
    flex-direction: column;
    .line {
      display: flex;
      flex: 1;
      align-items: center;
      font-size: 14px;
      font-weight: 400;
      .recharge-btn {
        margin-right: 115px;
        color: #ffffff;
        font-size: 13px;
        width: 51px;
        height: 26px;
        line-height: 26px;
        background: #fb466d;
        border-radius: 4px;
        text-align: center;
        cursor: pointer;
      }
      .title {
        font-family: SourceHanSansSC-Regular, SourceHanSansSC;
        color: #262626;
        width: 23%;
      }
      .info {
        flex: 1;
        font-family: SourceHanSansSC-Normal, SourceHanSansSC;
        color: #6f7682;
      }
    }
    // &>div{
    //   display: flex;
    //   padding: 20px;
    //   box-sizing: border-box;
    //   .title{
    //     font-size: 14px;
    //     font-family: SourceHanSansSC-Regular, SourceHanSansSC;
    //     font-weight: 400;
    //     color: #262626;
    //   }
    //   .info{
    //     font-size: 14px;
    //     font-family: SourceHanSansSC-Normal, SourceHanSansSC;
    //     font-weight: 400;
    //     color: #6F7682;
    //   }
    // }
  }
  .left {
    width: 28%;
  }
  .center {
    flex: 1;
    position: relative;
    border-right: 1px solid #eeeeee;
    border-left: 1px solid #eeeeee;
    padding-left: 3%;
  }
  .right {
    width: 31%;
    padding-left: 3%;
  }
}
.theme-bg-info {
  width: 100%;
  display: flex;
  padding: 0 20px;
  display: flex;
  padding: 0 20px;
  justify-content: center;
  .pc-bg {
    flex: 3;
    text-align: center;
  }
  .mc-bg {
    flex: 2;
    text-align: center;
    .text {
      margin-top: 26px;
    }
  }
  .text {
    font-size: 15px;
  }
  .select-bg-button {
    cursor: pointer;
    font-size: 13px;
    color: #3694f1;
    text-align: center;
    width: 67px;
    height: 26px;
    line-height: 26px;
    border-radius: 3px;
    border: dashed 1px #3694f1;
    margin: 10px auto;
  }
}
.shareCardInfo {
  padding-left: 20px;
  padding-bottom: 20px;
}
/* 红包充值弹出框 */
.rechargeTitle {
  display: flex;
  .title-text {
    margin-left: 20px;
    font-size: 25px;
    font-family: SourceHanSansSC-Regular, SourceHanSansSC;
    font-weight: 400;
    color: #42474e;
  }
}
.recharge-info {
  display: flex;
  flex-direction: column;
  justify-content: center;
  .balance-box {
    display: flex;
    align-items: center;
    margin-top: 40px;
    .title {
      font-size: 14px;
      font-family: SourceHanSansSC-Normal, SourceHanSansSC;
      font-weight: 400;
      color: #6f7682;
    }
    .info {
      margin-left: 40px;
      font-size: 27px;
      font-family: DIN-Medium, DIN;
      font-weight: 500;
      color: #fb466c;
      letter-spacing: 1px;
    }
  }
  .recharge-box {
    display: flex;
    margin-top: 40px;
    padding-bottom: 30px;
    .title {
      font-size: 14px;
      font-family: SourceHanSansSC-Normal, SourceHanSansSC;
      font-weight: 400;
      color: #6f7682;
    }
    .do-recharge {
      margin-left: 40px;
      .btn-group {
        display: flex;
        align-items: center;
        margin-top: 30px;
      }
      .erweima-container {
        margin-top: 30px;
        width: 449px;
        border: 1px solid #eeeeee;
        position: relative;
        .text1 {
          font-size: 14px;
          font-family: SourceHanSansSC-Medium, SourceHanSansSC;
          font-weight: 500;
          color: #249aff;
        }
        .text2 {
          font-size: 14px;
          font-family: SourceHanSansSC-Normal, SourceHanSansSC;
          font-weight: 400;
          color: #6f7682;
          span {
            font-size: 18px;
            font-family: DIN-Medium, DIN;
            font-weight: 500;
            color: #fb466c;
          }
        }
        .erweima-box {
          display: flex;
          align-items: center;
          .erweima {
            width: 311px;
            height: 184px;
            margin-right: 20px;
          }
        }
      }
    }
  }
}
.newUserRechargeTipDialog {
  .newUserRechargeTitle {
    font-size: 28px;
    font-weight: 400;
    color: rgba(0, 0, 0, 0.4);
  }
  .newUserRechargeMain {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    .kefuImg {
      width: 194px;
      height: 189px;
    }
    .tipText {
      font-size: 24px;
      font-weight: 400;
      color: #000000;
      margin-top: 50px;
      label {
        color: #fb466c;
      }
    }
    .getItBtn {
      margin-top: 40px;
    }
    &::after {
      content: '';
      display: block;
      width: 780px;
      height: 1px;
      background-color: rgba(0, 0, 0, 0.1);
      position: absolute;
      top: 200px;
    }
  }
}
</style>
