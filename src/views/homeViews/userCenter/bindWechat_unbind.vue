<!--绑定微信-未绑定-->
<template>
  <sub-page class="bindWechat">
    <main-card>
      <div class="main-content">
        <div class="phone" :style="{ backgroundImage: 'url(' + require('../../../assets/image/icon/userCenter/phone.png') + ')' }">
          <div class="QRCode-container">
            <!--背景四角-->
            <div class="bg-container">
              <div class="background">
                <div class="column">
                  <div></div>
                  <div></div>
                </div>
                <div class="column">
                  <div></div>
                  <div></div>
                </div>
              </div>
            </div>
            <div class="QRCode">
              <img v-show="officialAccountQRCode" :src="officialAccountQRCode" alt="公众号" />
            </div>
          </div>
          <div class="message">扫码绑定嗨喵微信服务号，可以通过微信介绍消息，使用微信登录嗨喵</div>
          <img src="@/assets/image/icon/userCenter/hand.png" alt="" class="hand" />
        </div>

        <div class="tip">
          <!-- <div style="text-align: center;margin-bottom: 20px;"><el-button type="primary" @click="wxIsLogin">已扫码绑定 点击确认</el-button></div> -->
          <el-tag color="#E6F7FF">可接受的消息：账户余额提现到账，上榜通知，活动消息提前接收</el-tag>
        </div>
      </div>
    </main-card>
  </sub-page>
</template>

<script>
import SubPage from '@/components/subPage';
import MainCard from '@/components/mainCard';

import messageMixin from '@/mixins/messageMixin';
import messageBoxMixin from '@/mixins/messageBoxMixin';
import { Login } from '@/api/login';
import { getBindWXERCode, judgeIsBindWX } from '@/api/app/user';

let timer;
export default {
  mixins: [messageMixin, messageBoxMixin],
  name: 'bindWechat_unbind',
  components: { MainCard, SubPage },
  data() {
    return {
      officialAccountQRCode: '',
    };
  },
  beforeDestroy() {
    console.log('离开了');
    clearInterval(timer);
  },
  activated() {
    console.log('激活');
  },
  deactivated() {
    console.log('休眠');
  },
  created() {
    getBindWXERCode({ request_from_page: 'bindWechat' })
      .then((img) => {
        if (!img) {
          this.alertError('获取二维码失败！请稍后再试');
        } else {
          this.officialAccountQRCode = img;
          // console.log(img);
        }
      })
      .catch(() => {});
    // 重复轮询请求
    timer = setInterval(() => {
      this.wxIsLogin();
    }, 2000);
  },
  methods: {
    wxIsLogin() {
      judgeIsBindWX({
        request_from_page: 'bindWechat',
      })
        .then((res) => {
          console.log('轮询结果', res);
          if (res.success) {
            // 关注成功
            clearInterval(timer);
            if (res.data.wx_openid) {
              this.$store.commit('login/updateUserInfo', {
                wx_openid: res.data.wx_openid,
              });
            } else {
              Login({ request_from_page: 'bindWechat_unbind' }).then((res) => {
                this.$store.commit('login/updateUserInfo', res);
              });
            }
          }
        })
        .catch((err) => {
          //  this.alertError('绑定失败！请稍后再试');
          console.log(err);
        });
    },
  },
};
</script>

<style lang="less" scoped>
.bindWechat {
  .main-content {
    display: flex;
    justify-content: center;
    margin-top: 30px;
    .phone {
      flex: 0 0 auto;
      width: 287px;
      height: 542px;
      background-repeat: no-repeat;
      background-size: 100% 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      position: relative;
      //二维码容器
      .QRCode-container {
        margin-top: 81px;
        margin-bottom: 19px;
        position: relative;
        .bg-container {
          height: 100%;
          width: 100%;
          position: absolute;
          //背景四个角
          .background {
            display: flex;
            flex-wrap: wrap;
            align-content: space-between;
            width: 100%;
            height: 100%;
            .column {
              flex-basis: 100%;
              display: flex;
              justify-content: space-between;
              div {
                width: 40px;
                height: 40px;
                border-radius: 3px;
                border: solid 5px #ffffff;
              }
            }
            //上方
            .column:nth-of-type(1) {
              div {
                border-bottom: none;
              }
            }
            //下方
            .column:nth-of-type(2) {
              div {
                border-top: none;
              }
            }
            //左侧
            .column {
              div:nth-of-type(1) {
                border-right: none;
              }
            }
            //右侧
            .column {
              div:nth-of-type(2) {
                border-left: none;
              }
            }
          }
        }
        .QRCode {
          height: 200px;
          width: 200px;
          //内边距
          padding: 16px;
          img {
            width: 100%;
            height: 100%;
          }
        }
      }
      .message {
        text-align: center;
        letter-spacing: 1px;
        width: 221px;
        font-size: 16px;
        font-weight: 400;
        color: #ffffff;
        line-height: 32px;
      }
      //手势图片
      .hand {
        position: absolute;
        right: -19px;
        bottom: 0;
        width: 88px;
      }
    }
    .tip::v-deep {
      flex: 0 1 auto;
      margin-top: 430px;
      margin-left: 21px;
      .el-tag {
        font-size: 13px;
        font-weight: 400;
        color: rgba(0, 0, 0, 0.65);
      }
    }
  }
}
</style>
