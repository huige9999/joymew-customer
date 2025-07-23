<!-- 活动报表 -->
<template>
  <sub-page>
    <!-- 头部数据项 -->
    <main-card class="header-item">
      <report-data
        :exists="[
          'user',
          'giftTotalConsume',
          'danMuTotalConsume',
          'allScreenTotalConsume',
          'photoTotalConsume',
          'zyzTotalConsume',
          'redPackageConsume',
          'boxTotalConsume',
        ]"
        :sumDetail="sumDetail"
        :person="person"
      ></report-data>
    </main-card>
    <main-card>
      <!-- 红包提现弹出框 -->
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
            <!-- <div class="cashout-amount">
            <div class="title">提现金额</div>
            <div class="do-cashout">
              <el-input v-model="hbBalance" :disabled="true">
                <div slot="suffix" class="cashout-unit" style="margin-top: 10px;margin-right: 20px;">元</div>
              </el-input>
            </div>
          </div> -->
            <div class="get-money-time">
              <div class="title">到账时间</div>
              <div class="info">实时到账</div>
            </div>
            <div class="first-cashout-type">
              <div class="title">提现打款方式</div>
              <div class="info">微信钱包账户</div>
              <!-- <div class="tips">你还没有绑定微信,请先<a href="">绑定</a></div> -->
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
      <!-- 红包余额 -->
      <div class="redPackage-container">
        <div class="redPackage-info">
          <div class="redp-logo"><img src="@/assets/image/redPackageRain/redpackage-logo.png" alt="" width="40" height="40" /></div>
          <div class="redp-account">
            <div class="title-text">红包账户</div>
            <div class="account-num">{{ hbBalance }}</div>
          </div>
          <div class="btn-group" v-if="txVisible">
            <div class="cashout-btn" @click="showCashoutDialog">提现</div>
          </div>
        </div>
      </div>
      <!-- 表格项 -->
      <my-table style="height: auto">
        <el-table :data="tableData" style="width: 100%" header-row-class-name="table-header">
          <el-table-column type="index" label="编号" min-width="120"> </el-table-column>
          <el-table-column prop="earning_game" label="收入类型" min-width="120"> </el-table-column>
          <el-table-column prop="playercount" label="参与人数" min-width="120"> </el-table-column>
          <el-table-column prop="count" label="发送数量" min-width="120"></el-table-column>
          <el-table-column prop="allused" label="总消费" min-width="120"> </el-table-column>
          <el-table-column prop="everyone_count" label="人均发送数" min-width="120"> </el-table-column>
          <el-table-column prop="everyone_amount" label="人均消费" min-width="120"> </el-table-column>
          <!-- <el-table-column prop="earning_ratio" label="收益比例" min-width="120"> </el-table-column>
          <el-table-column prop="earning" label="收益" min-width="120"> </el-table-column> -->
        </el-table>
        <!-- 导出报表 -->
        <export-table :URL="downLoadURL" v-if="false"> </export-table>
      </my-table>
    </main-card>
  </sub-page>
</template>

<script>
import SubPage from '@/components/subPage';
import MainCard from '@/components/mainCard';
import MyTable from '@/components/myTable';
import ExportTable from '@/components/exportTable';
import { getReportData } from '@/api/setting/activityIncome/activityIncomeData';
import myDialog from '@/components/myDialog';
import { getActivityMsg } from '@/api/setting/activitySetting/gameSetting';
import ReportData from '@/views/activityViews/activityIncome/reportData';
import request from '@/utils/request';

import { getBindWXERCode, judgeIsBindWX } from '@/api/app/user';

let timer;

export default {
  name: 'reportList',
  components: {
    SubPage,
    MainCard,
    MyTable,
    ExportTable,
    ReportData,
    myDialog,
  },
  data() {
    return {
      tableData: [],
      sumDetail: [],
      person: 30,
      hbBalance: 0,
      cashoutDialogIsShow: false,

      // 绑定微信二维码图片地址
      officialAccountQRCode: '',
      downLoadURL: '#',
      isAgree: false,
    };
  },
  created() {
    this.getReportList();
    this.getWXbindQRcode();
    this.getBalance();
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
  methods: {
    /* 显示提现弹框 */
    showCashoutDialog() {
      // 判断是否绑定微信
      this.checkIsBindWX();
      console.log('提现弹框');
      this.cashoutDialogIsShow = true;
    },
    /* 确认提现 */
    confirmCashout() {
      if (!this.isAgree) {
        this.$message.error('请先阅读并同意嗨喵红包提现服务协议!');
        return;
      }
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
    /* 取消提现 */
    cancelCashout() {
      this.cashoutDialogIsShow = false;
    },
    /* 获取账户余额 */
    getBalance() {
      const data = {
        id: this.$store.state.liveId,
      };
      getActivityMsg(data).then((res) => {
        console.log('余额', res);
        this.hbBalance = res.data.balance;
      });
    },
    /* 关闭提现框微信绑定二维码 */
    cancelWXCashout() {
      this.cashoutDialogIsShow = false;
      clearInterval(timer);
    },
    /* 请求绑定微信二维码 */
    getWXbindQRcode() {
      getBindWXERCode({
        request_from_page: 'app/activity/activityIncome/report',
      })
        .then((img) => {
          this.officialAccountQRCode = img;
        })
        .catch(() => {});
    },
    /* 判断是否绑定微信 */
    checkIsBindWX() {
      // 判断是否绑定微信

      if (this.isShowWXQRcode) {
        // 已绑定微信
      } else {
        // 未绑定微信 显示绑定二维码  做轮询请求

        // 重复轮询请求
        timer = setInterval(() => {
          judgeIsBindWX({
            request_from_page: 'app/activity/activityIncome/report',
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
    getReportList() {
      const data = {
        // liveId: this.$store.state.liveId,
        splid: this.$store.state.liveId,
      };
      getReportData(data).then((res) => {
        console.log('报表数据', res);
        this.tableData = res.data.list;
        this.sumDetail = res.data.list;
        // this.person = parseInt(res.data.person, 10);
        this.person = parseInt(res.data.pcu, 10);
      });
    },
    toReadAgreement() {
      window.open('https://www.hudongmiao.com/agreement/index.html', '_blank');
    },
  },
};
</script>

<style lang="less" scoped>
.redPackage-container {
  display: flex;
  padding-top: 30px;
  .redPackage-info {
    padding: 13px 0px 35px 20px;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    .redp-logo {
    }
    .redp-account {
      margin: 0 20px;
      .title-text {
        position: relative;
        font-size: 13px;
        font-family: MicrosoftYaHei;
        color: #666666;
        line-height: 18px;
        &:after {
          content: '明细';
          font-size: 11px;
          font-family: MicrosoftYaHei;
          color: #ffffff;
          line-height: 18px;
          text-align: center;
          position: absolute;
          top: -14px;
          right: -37px;
          width: 37px;
          height: 19px;
          background: #f4c15b;
          border-radius: 10px 10px 10px 0px;
        }
      }
      .account-num {
        font-size: 28px;
        font-family: DIN-Medium, DIN;
        font-weight: 500;
        color: #fb466c;
        line-height: 33px;
        letter-spacing: 1px;
      }
    }
    .btn-group {
      height: 50px;
      display: flex;
      align-items: flex-end;
      padding-bottom: 5px;
      .recharge-btn {
        margin-left: 25px;
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
      .cashout-btn {
        margin-left: 25px;
        color: #ffffff;
        font-size: 13px;
        width: 51px;
        height: 26px;
        line-height: 26px;
        background: #1e87f0;
        border-radius: 4px;
        text-align: center;
        cursor: pointer;
      }
    }
    .tips {
      margin-left: 30px;
      height: 50px;
      align-items: flex-end;
      display: flex;
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
