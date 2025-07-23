<template>
  <div class="bind-container">
    <div class="bind-left">
      <div class="alipay item">
        <div class="item-header-bind" v-if="zfb_account">
          <div class="header-left">
            <div class="left-label left-label-alipay">已绑定支付宝：</div>
            <div class="zfb-account">{{ zfb_account }}</div>
          </div>
          <div class="header-right" @click="unBindZfb">解绑</div>
        </div>
        <div class="item-header" v-else>
          <div class="header-left">
            <div class="dis-bind">未绑定支付宝</div>
          </div>
          <div class="header-right" @click="showDialog('alipay')">立即绑定</div>
        </div>
        <div class="item-tip">
          <div class="tip-title">绑定<span>支付宝</span>，您可以：</div>
          <div class="tip" v-for="(tip, index) in alipayTips" :key="tip">{{ index + 1 + '.' + tip }}</div>
        </div>
      </div>
      <div class="wechat item">
        <div class="item-header-bind" v-if="wx_openid">
          <div class="header-left">
            <div class="left-label">已绑定微信</div>
          </div>
          <div class="header-right" @click="unBindWx">解绑</div>
        </div>
        <div class="item-header" v-else>
          <div class="header-left">
            <div class="dis-bind">未绑定微信</div>
          </div>
          <div class="header-right" @click="showDialog('wx')">立即绑定</div>
        </div>
        <div class="item-tip">
          <div class="tip-title">绑定<span>微信</span>，关注公众号，您可以：</div>
          <div class="tip" v-for="(tip, index) in wxTips" :key="tip">{{ index + 1 + '.' + tip }}</div>
        </div>
      </div>
    </div>
    <div class="download">
      <div class="container">
        <div class="ct-header">好消息！嗨喵APP手机提现来啦！</div>
        <div class="ct-middle">
          <div class="middle-content">提现步骤：<span>下载【嗨喵】APP → 嗨喵账号登录 → 我的 → 余额 → 右上角提现</span></div>
        </div>
        <div class="ct-bottom">
          <!-- <img src="@/assets/image/bind/download_app.jpg" alt=""> -->
          <img src="https://ustatic.joymew.com/%20miao/appDownload.png" alt="">
        </div>
      </div>
    </div>
    <el-dialog :visible.sync="dialogVisible" :close-on-click-modal="false" width="985px">
      <template #title>
        <div class="dialog-title">绑定微信/支付宝</div>
      </template>
      <div class="dialog-step">
        <div class="step1 step" :class="{ active: step === 1 }">
          <img src="@/assets/image/bind/double.png" v-if="step !== 1">
          <img src="@/assets/image/bind/double-active.png" v-else>
          <div class="step-label">1.绑定支付宝</div>
        </div>
        <div class="step2 step" :class="{ active: step === 2 }">
          <img src="@/assets/image/bind/double.png" v-if="step !== 2">
          <img src="@/assets/image/bind/double-active.png" v-else>
          <div class="step-label">2.绑定微信</div>
        </div>
        <div class="step3 step" :class="{ active: step === 3 }">
          <img src="@/assets/image/bind/one.png" v-if="step !== 3">
          <img src="@/assets/image/bind/one-active.png" v-else>
          <div class="step-label" v-if="step !== 3">3.下载APP</div>
        </div>
      </div>
      <div class="step-content bind-zfb" v-if="step === 1">
        <el-form :model="bindZfb" :rules="rules" class="zfbFormEl" ref="zfbForm" label-position="left"
          label-width="110px">
          <el-form-item label="支付宝账号：" prop="zfbAccount">
            <el-input v-model="bindZfb.zfbAccount" clearable></el-input>
          </el-form-item>
          <el-form-item label="真实姓名：" prop="realName">
            <el-input v-model="bindZfb.realName" clearable></el-input>
          </el-form-item>
        </el-form>
        <div class="next-btn" @click="bindZFB">绑定支付宝</div>
      </div>
      <div class="step-content bind-wx-step" v-else-if="step === 2">
        <div class="qrcode-container">
          <img :src="bindWxQrCode">
        </div>
        <div class="next-btn" @click="bindWxBtn">绑定微信</div>
      </div>
      <div class="step-content download-step" v-else>
        <div class="download-qrcode-container">
          <img src="https://ustatic.joymew.com/%20miao/appDownload.png" alt="">
        </div>
        <div class="download-tip">
          <div class="tip-content">提现步骤：<span>下载【嗨喵】APP → 嗨喵账号登录 → 我的 → 余额 → 右上角提现</span></div>
        </div>
        <div class="next-btn" @click="dialogVisible = false">已完成下载</div>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="tipDialogVisible" :close-on-click-modal="false" width="576px">
      <template #title>
        <div class="dialog-title">绑定微信/支付宝</div>
      </template>
      <div class="tip-dialog-container">
        <img src="@/assets/image/bind/tip-image.png">
        <div class="dialog-tip-content">
          <p>尊敬的嗨喵用户您好，根据业务开展的实际情况，嗨喵科技近期更新了提现规则。</p>
          <p><span class="take-wx">微信</span>到账金额最大<span class="num">500</span>元</p>
          <p><span class="take-alipay">支付宝</span>到账金额最大<span class="num">20000</span>元。推荐!!!</p>
        </div>
      </div>
      <template #footer>
        <div class="tip-dialog-footer">
          <div class="tip-foot-btn" @click="tipDialogVisible = false">暂不绑定</div>
          <div class="tip-foot-btn" @click="tipDialogVisible = false; dialogVisible = true">立即绑定</div>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { bindZfbFn, getBindWXERCode, judgeIsBindWX, unBIndWX } from '@/api/app/user';
import { Login } from '@/api/login';

export default {
  name: 'branch',
  data() {
    return {
      wx_name: '',
      wx_openid: '',
      zfb_account: '',
      zfb_realname: '',
      wxTips: [
        '活动收益通知及时接收',
        '网页个人账户微信扫码快捷登录',
        '嗨喵产品新功能活动先人一步体验',
        '嗨喵APP个人账户快捷访问',
      ],
      alipayTips: [
        '活动收益大额提现',
        '嗨喵产品新功能活动快人一步',
      ],
      dialogVisible: false,
      tipDialogVisible: false,
      step: 1,
      wxPollingTimer: '',
      bindZfb: {
        zfbAccount: '',
        realName: '',
      },
      rules: {
        zfbAccount: [
          { required: true, message: '请输入支付宝账号' },
        ],
        realName: [
          { required: true, message: '请输入支付宝账户对应的真实姓名' },
        ],
      },
      bindWxQrCode: '',
    };
  },
  created() {
    const { userInfo } = this.$store.state.login;
    console.log('绑定微信页面：', userInfo);
    this.wx_name = userInfo.wx_name;
    this.wx_openid = userInfo.wx_openid;
    this.zfb_account = this.$store.state.login.userInfo.zfb_account;
    this.zfb_realname = this.$store.state.login.userInfo.zfb_realname;
    if (!this.zfb_account) {
      setTimeout(() => {
        this.tipDialogVisible = true;
      }, 1000);
    }
  },
  methods: {
    showDialog(type) {
      this.dialogVisible = true;
      this.bindZfb = {
        zfbAccount: '',
        realName: '',
      };

      if (type === 'wx' && this.zfb_account) {
        if (this.wxPollingTimer) {
          clearInterval(this.wxPollingTimer);
        }
        this.wxPollingTimer = setInterval(() => {
          this.wxPolling();
        }, 2000);
        this.getBindWXQrCode();
        this.step = 2;
      } else {
        this.step = 1;
      }
    },
    //  解绑微信
    unBindWx() {
      this.$confirm('确定解绑当前微信账号吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        //  调用解绑接口
        unBIndWX({
          request_from_page: 'app/userCenter/bindWechat',
        }).then((res) => {
          console.log('解绑', res);
          this.$store.commit('login/updateUserInfo', {
            wx_openid: '',
          });
          this.$message({
            type: 'success',
            message: '解除绑定成功！',
          });
          this.wx_openid = '';
          this.wx_name = '';
        });
      });
    },
    //  微信轮询
    wxPolling() {
      judgeIsBindWX({
        request_from_page: 'bindWechat',
      })
        .then((res) => {
          console.log('轮询结果', res);
          if (res.success) {
            // 关注成功
            clearInterval(this.wxPollingTimer);
            if (res.data.wx_openid) {
              this.$store.commit('login/updateUserInfo', {
                wx_openid: res.data.wx_openid,
              });
            } else {
              Login({ request_from_page: 'bindWechat_unbind' }).then((res) => {
                this.$store.commit('login/updateUserInfo', res);
              });
            }
            this.wx_name = this.$store.state.login.userInfo.wx_name;
            this.wx_openid = this.$store.state.login.userInfo.wx_openid;
            this.step = 3;
          }
        })
        .catch((err) => {
          //  this.alertError('绑定失败！请稍后再试');
          console.log(err);
        });
    },
    //  绑定支付宝
    bindZFB() {
      //  调用绑定接口
      bindZfbFn({
        zhiFuBaoPhone: this.bindZfb.zfbAccount,
        realName: this.bindZfb.realName,
      }).then(() => {
        //  重新请求用户数据
        Login({ request_from_page: 'bindWechat_unbind' }).then((res) => {
          this.$store.commit('login/updateUserInfo', res);
          this.zfb_account = this.$store.state.login.userInfo.zfb_account;
          this.zfb_realname = this.$store.state.login.userInfo.zfb_realname;
        });
      });

      //  判断是否绑定微信，如果已绑定微信，直接跳转到第三步
      if (this.wx_openid) {
        this.step = 3;
      } else {
        if (this.wxPollingTimer) {
          clearInterval(this.wxPollingTimer);
        }
        this.wxPollingTimer = setInterval(() => {
          this.wxPolling();
        }, 2000);
        this.getBindWXQrCode();
        this.step = 2;
      }
    },
    //  解绑支付宝
    unBindZfb() {
      this.$confirm('确定解绑当前支付宝账号吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        //  调用绑定接口
        bindZfbFn({
          zhiFuBaoPhone: '',
          realName: '',
        }).then(() => {
          //  重新请求用户数据
          Login({ request_from_page: 'bindWechat_unbind' }).then((res) => {
            this.$store.commit('login/updateUserInfo', res);
            this.zfb_account = this.$store.state.login.userInfo.zfb_account;
            this.zfb_realname = this.$store.state.login.userInfo.zfb_realname;
            this.$message({
              type: 'success',
              message: '解绑成功!',
            });
          });
        });
      });
    },
    //  获取绑定wx的二维码
    getBindWXQrCode() {
      getBindWXERCode({ request_from_page: 'bindWechat' })
        .then((img) => {
          if (!img) {
            this.alertError('获取二维码失败！请稍后再试');
          } else {
            this.bindWxQrCode = img;
          }
        })
        .catch(() => { });
    },
    //  绑定微信
    bindWxBtn() {
      if (this.wx_openid) {
        this.step = 3;
      } else {
        this.$message({
          type: 'error',
          message: '微信还未绑定成功~',
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.bind-container {
  width: 100%;
  min-width: 1150px;
  padding: 20px;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  align-items: center;

  .bind-left {
    width: 416px;
    height: 514px;
    margin-right: 20px;
    display: flex;
    flex-direction: column;

    .item {
      width: 100%;
      flex: 1;
      margin-bottom: 20px;
      padding: 20px;
      box-sizing: border-box;
      background-color: #FFFFFF;
      border-radius: 4px;
      font-size: 16px;
      box-shadow: 2px 3px 10px 0 rgba(119, 119, 119, .1);

      .item-header-bind {
        height: 43px;
        margin-bottom: 24px;
        display: flex;
        justify-content: space-between;
        align-items: center;

        .header-left {
          display: flex;
          align-items: center;

          .left-label {
            color: #28C445;
          }

          .left-label-alipay {
            color: #06B4FD;
          }
        }

        .header-right {
          color: #F53F3F;
          text-decoration: underline;
          cursor: pointer;
        }
      }

      &:last-of-type {
        margin-bottom: 0;
      }

      .item-header {
        width: 100%;
        height: 43px;
        margin-bottom: 24px;
        display: flex;
        justify-content: space-between;
        align-items: center;

        .header-right {
          width: 118px;
          height: 43px;
          background-color: #28C445;
          border-radius: 4px;
          color: #FFFFFF;
          text-align: center;
          line-height: 43px;
          cursor: pointer;
        }
      }

      .item-tip {
        .tip-title {
          margin-bottom: 5px;

          span {
            color: #28C445;
            font-weight: bold;
          }
        }

        .tip {
          width: 100%;
          height: 25px;
          font-size: 15px;
          line-height: 25px;
        }
      }
    }

    .alipay {
      .item-header {
        .header-right {
          background-color: #06B4FD;
        }
      }

      .item-tip {
        .tip-title {
          span {
            color: #06B4FD;
          }
        }
      }
    }
  }

  .download {
    flex: 1;
    min-width: 650px;
    height: 514px;
    padding: 42px 40px 20px 40px;
    box-sizing: border-box;
    background: url("~@/assets/image/bind/download-bg.png") #FFFFFF no-repeat;
    background-size: 110% 100%;
    background-position: -12px -10px;
    border-radius: 4px;
    position: relative;
    overflow: hidden;
    box-shadow: 2px 3px 10px 0 rgba(119, 119, 119, .1);

    .container {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      background-color: #FFFFFF;
      border-radius: 4px;
      z-index: 2;
      box-shadow: 2px 3px 10px 0 rgba(0, 102, 255, .1);

      .ct-header {
        width: 367px;
        height: 50px;
        margin-bottom: 20px;
        background: url("~@/assets/image/bind/download-header-bg.png") no-repeat center;
        background-size: 100% 100%;
        color: #FFFFFF;
        font-size: 20px;
        text-align: center;
        line-height: 50px;
        text-indent: 12px;
      }

      .ct-middle {
        width: 530px;
        margin-bottom: 24px;
        padding: 16px;
        box-sizing: border-box;
        background-color: #BAE7FF;
        color: rgba(0, 0, 0, .65);
        font-size: 14px;
        line-height: 22px;

        .middle-content {
          span {
            color: #3B3C3D;
            font-weight: bold;
            margin: 4px;
          }
        }
      }

      .ct-bottom {
        width: 212px;
        height: 234px;
        background: url("~@/assets/image/bind/qr-code-bg.png") no-repeat center;
        background-size: 100%;
        position: relative;

        img {
          width: 144px;
          height: 141px;
          position: absolute;
          top: 33px;
          left: 50%;
          transform: translateX(-50%);
          -webkit-user-drag: none;
        }
      }
    }
  }

  .dialog-title {
    font-size: 20px;
    font-weight: bold;
  }

  .dialog-step {
    width: 100%;
    height: 40px;
    line-height: 40px;
    display: flex;
    justify-content: center;
    align-items: center;

    .step {
      width: 240px;
      height: 100%;
      margin-right: 12px;
      position: relative;
      color: #4E5969;
      cursor: default;

      img {
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        z-index: -1;
      }

      .step-label {
        padding-left: 40px;
        box-sizing: border-box;
      }

      &:last-of-type {
        width: 220px;
        margin-right: 0;
      }
    }

    .active {
      color: #FFFFFF;
    }
  }

  .step-content {
    width: 100%;

    .next-btn {
      width: 110px;
      height: 38px;
      background-color: #1890FF;
      border-radius: 2px;
      color: #FFFFFF;
      line-height: 38px;
      text-align: center;
      margin: 0 auto;
      cursor: pointer;
    }
  }

  .bind-zfb {
    .zfbFormEl {
      margin-top: 76px !important;
      margin-bottom: 218px !important;
    }
  }

  .bind-wx-step {
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    .qrcode-container {
      width: 212px;
      height: 283px;
      margin: 0 auto;
      margin-top: 24px;
      margin-bottom: 71px;
      background-image: url('~@/assets/image/bind/bindwx-qrcode-bg.png');
      background-size: 100%;
      position: relative;

      img {
        width: 141px;
        height: 141px;
        position: absolute;
        top: 34px;
        left: 50%;
        transform: translateX(-50%);
      }
    }
  }

  .download-step {
    display: flex;
    flex-direction: column;
    align-items: center;

    .download-qrcode-container {
      width: 212px;
      height: 234px;
      background-image: url('~@/assets/image/bind/qr-code-bg.png');
      background-size: 100%;
      margin-top: 24px;
      margin-bottom: 16px;
      position: relative;

      img {
        width: 150px;
        height: 150px;
        position: absolute;
        top: 30px;
        left: 50%;
        transform: translateX(-50%);
      }
    }

    .download-tip {
      width: 530px;
      margin-bottom: 13px;
      padding: 11px;
      box-sizing: border-box;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: #E6F7FF;
      color: rgba(0, 0, 0, .65);
      font-size: 14px;
      line-height: 22px;

      .tip-content {
        text-align: center;

        span {
          color: #3B3C3D;
          font-weight: bold;
        }
      }
    }
  }

  .tip-dialog-container {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    img {
      width: 270px;
      height: 270px;
      margin-bottom: 23px;
    }
    .dialog-tip-content {
      width: 418px;
      color: #1D2129;
      font-size: 16px;
      line-height: 29px;
      span {
        color: #FB466C;
        margin: 0 2px;
      }
      .take-wx {
        color: #28C445;
      }
      .take-alipay {
        color: #06B4FD;
      }
    }
  }
  .tip-dialog-footer {
    width: 100%;
    height: 38px;
    display: flex;
    justify-content: center;
    align-items: center;
    .tip-foot-btn {
      width: 96px;
      height: 100%;
      margin-right: 8px;
      background-color: #F2F3F5;
      border-radius: 2px;
      color: #1D2129;
      font-size: 14px;
      text-align: center;
      line-height: 38px;
      cursor: pointer;
      &:last-of-type {
        margin-right: 0;
        background-color: #249AFF;
        color: #FFFFFF;
      }
    }
  }
}
</style>
