<template>
  <div class="toolBar">
    <h1 v-show="isInHMenuHidden">
      <a href="/"><img src="@/assets/image/logo.png" alt="logo图标" class="logo" /></a>
    </h1>
    <div class="toolWrap">
      <el-popover placement="bottom" trigger="hover">
        <div class="hoverArea">
          <img src="@/assets/image/icon/dyHover.png" />
        </div>
        <div class="item" slot="reference">
          <img src="@/assets/image/icon/dyNumber.png" class="add-icon" />
          <div class="link">抖音号</div>
        </div>
      </el-popover>
      <el-popover placement="bottom" trigger="hover">
        <div class="hoverArea">
          <img style="height: 200px;width: 200px" src="@/assets/image/icon/redBookHover.png" />
        </div>
        <div class="item" slot="reference">
          <img src="@/assets/image/icon/lredbook.png" class="add-icon" />
          <div class="link">小红书</div>
        </div>
      </el-popover>
      <div class="item" @click="toActivity">
        <img src="@/assets/image/icon/add.png" class="add-icon" />
        <div class="link">创建活动</div>
      </div>
      <div class="item" @click="downloadPC" v-if="!isCompany">
        <img src="@/assets/image/icon/browser.png" />
        <div class="link">浏览器下载</div>
      </div>
      <div class="item" @click="contact" v-if="!isCompany">
        <img src="@/assets/image/icon/contact.png" class="contact-icon" />
        <span class="link">联系客服</span>
      </div>
      <div class="item" @click="toCourse" v-if="!isCompany">
        <i class="iconfont el-icon-joymew-shuji bookIcon" />
        <div class="link">主持课程</div>
      </div>
      <div class="item logout" @click="loginOut">
        <img src="@/assets/image/icon/exit_icon.png" class="exit-icon" />
        <span class="link">退出登录</span>
      </div>
      <div class="item user-item" v-if="!isCompany">
        <img :src="avator" alt="头像" class="avatar" />
        <div class="nickname">{{ name }}</div>
        <i class="el-icon-joymew-zelvxuanzefeiyongzhengsanjiaoxingzhichi arrow"></i>
        <div class="hover-box">
          <div class="user-info">
            <img :src="avator" alt="头像" class="avatar-img" />
            <p class="user-info-nickname">{{ name }}</p>
            <div class="high-privilege-mode" @click="highM">{{ ishigh }}</div>
            <p class="last-login-time">上次登录时间：{{ lastLoginTime }}</p>
            <div class="detail-info">
              <span class="detail-item" v-if="accountinfo_data.hltRoleName">角色：{{ accountinfo_data.hltRoleName }}</span>
              <span class="detail-item" v-if="!accountinfo_data.hltRoleName">等级：{{ accountinfo_data.level }}</span>
              <div class="detail-item">总互动：{{ accountinfo_data.hd_num }}</div>
              <div class="detail-item">总粉丝：{{ accountinfo_data.fan_num }}</div>
            </div>
          </div>
          <div class="bottom-operate">
            <div class="change-pwd-btn" @click="toChangePwd">修改密码</div>
          </div>
        </div>
      </div>
    </div>
    <!--切换为高级设置和首次设置高级模式密码  -->
    <el-dialog class="box" :visible.sync="box" width="500px" center>
      <template slot="title">
        <div class="titleZise">
          <span>{{ title }}</span>
        </div>
      </template>
      <!-- 切换高级模式部分 -->
      <div class="block" v-show="modelType === '1'">
        <span class="label" style="text-align: right">输入密码</span>
        <el-input type="password" placeholder="请输入密码" style="width: 300px" v-model="enterPassword"></el-input>
      </div>
      <!-- 设置高级模式部分 -->
      <div v-show="modelType === '2'">
        <div class="textT">设置高级模式后，将隐藏所有菜单(除我的互动 ）</div>
        <div class="block">
          <span class="label" style="text-align: right">设置密码</span>
          <el-input type="password" placeholder="请输入密码" style="width: 300px" v-model="setPassword"></el-input>
        </div>
        <div class="block">
          <span class="label" style="text-align: right">确认密码</span>
          <el-input type="password" placeholder="请输入密码" style="width: 300px" v-model="confirmPassword"></el-input>
        </div>
      </div>
      <span slot="footer" class="dialog-footer" center>
        <!-- 切换 -->
        <el-button v-show="modelType === '1'" type="primary" @click="cutSure">确 定</el-button>
        <!-- 设置 -->
        <el-button v-show="modelType === '2'" type="primary" @click="setSure">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { editNameAndHeadImg } from '@/api/app/user';
import { Login } from '@/api/login';
import messageBoxMixin from '@/mixins/messageBoxMixin';
import request from '@/utils/request';
import { mapState } from 'vuex';

const macUrl = 'https://ustatic.joymew.com/browsers/googlechromeSetupMacos.dmg';
const osUrl = 'https://ustatic.joymew.com/browsers/ChromeStandaloneSetup64.exe';
export default {
  mixins: [messageBoxMixin],
  name: 'toolBar',
  components: {},
  data() {
    return {
      logo: require('@/assets/image/logo.png'),
      downloadURL: osUrl,
      // 高级模式
      box: false,
      title: '切换高级模式', // 表头
      enterPassword: '', // 输入密码框
      setPassword: '', // 设置密码
      confirmPassword: '', // 确认密码
      modelType: '1', // 1 切换 2 设置
    };
  },
  computed: {
    ...mapState({
      isTemplate: (state) => state.isTemplate,
      user_end_type: (state) => state.login.userInfo.config.user_end_type,
      isInHMenuHidden: (state) => state.menu.isInHMenuHidden,
    }),
    userInfo() {
      return this.$store.state.login.userInfo;
    },
    name() {
      return this.userInfo.emcee_name || '';
    },
    avator() {
      return this.userInfo.avator;
    },
    ishigh() {
      const tmpHighPrivilege = this.$store.state.login.userInfo.high_privilege;
      return tmpHighPrivilege === 1 ? '高级模式' : '';
    },
    isCompany() {
      return this.user_end_type === '1';
    },
    lastLoginTime() {
      function renderTime(date) {
        const dateee = new Date(date).toJSON();
        return new Date(+new Date(dateee) + 8 * 3600 * 1000)
          .toISOString()
          .replace(/T/g, ' ')
          .replace(/\.[\d]{3}Z/, '');
      }

      return renderTime(this.userInfo.time_lastlogin);
    },
    accountinfo_data() {
      return {
        hltRoleName: this.userInfo?.hltRoleName ?? '',
        level: this.userInfo?.vip_grade ?? 0,
        hd_num: this.userInfo?.user_money?.spltotal ?? 0,
        fan_num: this.userInfo?.user_money?.funcount ?? 0,
      };
    },
  },
  methods: {
    contact() {
      console.log('concat 1');
      this.openInfoBox(
        '联系客服',
        this.$createElement('img', {
          attrs: { src: require('@/assets/image/assist.png') },
          style: 'width:100%; margin-bottom:-30px',
        }),
        { center: true },
      );
    },
    // 不同系统浏览器下载
    downloadPC() {
      const version = navigator.userAgent.toLowerCase();
      const mac = version.indexOf('mac');
      const os = version.indexOf('os');
      if (mac > 0 && os > 0) {
        // 苹果系统下执行的操作
        window.location.href = macUrl; // 这里的请求方式为get，如果需要认证，接口上需要带上token
      } else {
        window.location.href = osUrl; // 这里的请求方式为get，如果需要认证，接口上需要带上token
      }
    },
    // 桌面程序下载
    downloadExe() {
      const version = navigator.userAgent.toLowerCase();
      const mac = version.indexOf('mac');
      const os = version.indexOf('os');
      if (mac > 0 && os > 0) {
        window.location.href = 'https://ustatic.joymew.com/joymewDesk/release/Hudongmiao-0.0.0.dmg';
      } else {
        window.location.href = 'https://ustatic.joymew.com/joymewDesk/joymewDesk.exe';
      }
    },
    /**
     * 跳转课程
     */
    toCourse() {
      window.open('https://www.hudongmiao.com/hm-course/#/', '_blank');
    },
    toWxt() {
      let tmpUrl;
      if (process.env.VUE_APP_ENV === 'development') {
        tmpUrl = 'https://wwwstage.hudongmiao.com/#/wxt';
      } else {
        tmpUrl = `${window.origin}/#/wxt`;
      }
      window.open(tmpUrl, '_blank');
    },
    goBack() {
      if (!this.isTemplate) {
        this.$router.replace('/app/home');
      } else {
        this.$router.replace('/app/templateConfig');
      }
    },
    toActivity() {
      this.$router.push('/app/myActivity/create').catch(() => {
        // console.log('已在创建活动页面了');
      });
    },
    toTemplateConfig() {
      this.$router.push('/app/templateConfig');
    },
    toGiftFree() {
      this.$router.push('/app/activity/gamesSetting/giftAllFree');
    },
    // 退出按钮  退出到官网登录界面  清空token
    loginOut() {
      window.localStorage.clear();
      window.location.href = window.location.origin || 'https://www.hudongmiao.com/';
    },
    // 点击高级模式按钮
    highM() {
      this.box = true;
      const { hp_passwd } = this.$store.state.login.userInfo;
      // 首次开通高级模式 还没有设置密码
      if (!hp_passwd) {
        this.title = '设置高级模式密码';
        this.modelType = '2';
      } else if (hp_passwd) {
        this.title = '切换高级模式';
        this.modelType = '1';
      }
    },
    /**
     * 切换菜单状态
     * @returns {string} 当前隐私设置菜单显示/隐藏的状态
     */
    toggleMenu() {
      const hpStatus = localStorage.getItem('hpStatus');
      if (hpStatus === '1') {
        // 原来菜单是隐藏状态 现在要开启
        this.$store.commit('menu/showMenuHighLevel');
        localStorage.removeItem('hpStatus');
        return '0';
      }
      // 原来菜单是开启状态 现在要关闭
      this.$store.commit('menu/hideMenuHighLevel');
      localStorage.setItem('hpStatus', 1);
      return '1';
    },
    /**
     * 高级模式切换菜单显示/隐藏
     */
    cutSure() {
      if (!this.enterPassword) {
        this.$message({
          type: 'warning',
          message: '密码不能为空',
        });
        return;
      }
      const { hp_passwd } = this.$store.state.login.userInfo;
      if (hp_passwd === this.enterPassword) {
        const hpStatus = this.toggleMenu();
        // 调用接口保存状态
        console.log('保存隐私设置菜单状态：', hpStatus);
        editNameAndHeadImg({
          hp_status: hpStatus,
        });
        this.$message({
          message: '设置成功',
          type: 'success',
        });
        this.closeBoxAndresetForm();
      } else {
        this.$message.error('您输入的密码错误');
      }
    },
    /**
     * 设置高级模式密码
     */
    async setSure() {
      if (!this.setPassword) {
        this.$message({
          type: 'warning',
          message: '密码不能为空',
        });
        return;
      }
      if (!this.confirmPassword) {
        this.$message({
          type: 'warning',
          message: '密码不能为空',
        });
        return;
      }
      if (this.setPassword.trim() === this.confirmPassword.trim()) {
        await request.post('/host/updatePriPwd', {
          hp_passwd: this.setPassword,
        });
        this.$message({
          message: '设置成功',
          type: 'success',
        });
        const loginRes = await Login({ request_from_page: 'app' });
        this.$store.commit('login/updateUserInfo', loginRes);
        this.toggleMenu();
        this.closeBoxAndresetForm();
      } else {
        this.$message.error('前后密码不一致');
      }
    },
    toChangePwd() {
      this.$router.push('/app/userCenter/changingPasswords');
    },
    closeBoxAndresetForm() {
      this.box = false;
      this.enterPassword = '';
      this.setPassword = '';
      this.confirmPassword = '';
    },
  },
  created() {
    // this.generateDownloadURL();
  },
};
</script>

<style lang="less" scoped>
.toolBar {
  background-color: #ffffff;
  height: 56px;
  flex: 0 0 auto;
  padding: 0 18px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  position: relative;

  h1 {
    padding: 12px 0px 12px 0px;
    height: 56px;
    line-height: 56px;
    box-sizing: border-box;
    font-size: 0;
    position: absolute;
    left: 18px;

    .logo {
      width: 61px;
      height: 29px;
    }

    &:hover {
      opacity: 0.6;
    }
  }

  .toolWrap {
    display: flex;
    height: 100%;

    .hoverArea {
      width: 180px;
      height: 240px;
      // background-color: pink;
      background-size: cover;
    }

    .item {
      display: flex;
      align-items: center;
      margin: 0 20px;
      cursor: pointer;
      position: relative;
      height: 100%;

      img {
        width: 22px;
        height: 22px;

        &.exit-icon {
          width: 24px;
          height: 24px;
        }

        &.contact-icon {
          width: 19px;
          height: 21px;
        }

        &.add-icon {
          width: 20px;
        }

        &.avatar {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          margin-right: 8px;
        }
      }

      .bookIcon {
        color: #8ca0b3;
        font-size: 24px;
      }

      .link {
        font-size: 16px;
        font-weight: 400;
        color: #8ca0b3;
        margin-left: 6px;
      }

      &:hover {
        .link {
          color: rgba(140, 160, 179, 0.6);
        }

        &.logout {
          color: rgba(251, 70, 108, 0.6);
        }
      }

      &.logout {
        color: #fb466c;

        .exitIcon {
          margin-top: 2px;
        }

        .link {
          color: #fb466c;
          margin-left: 6px;
        }

        &:hover {
          .link {
            color: rgba(251, 70, 108, 0.6);
          }
        }
      }

      &.user-item {
        position: relative;

        .nickname {
          width: 42px;
          color: rgba(0, 0, 0, 0.65);
          font-size: 14px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          margin-right: 4px;
        }

        .arrow {
          color: #ffda8c;
          transition: all 0.1s;
        }

        .hover-box {
          width: 195px;
          background: #ffffff;
          box-shadow: 0px 3px 10px 0px rgba(119, 119, 119, 0.1);
          position: absolute;
          top: 56px;
          left: -84px;
          z-index: 9999;
          display: none;
        }

        &:hover {
          .arrow {
            transform: rotate(180deg);
          }

          .hover-box {
            padding-top: 8px;
            display: block;

            .user-info {
              display: flex;
              flex-direction: column;
              align-items: center;
              border-bottom: 1px solid #e5e6eb;
              padding-bottom: 7px;
              line-height: 1.5;
              width: 100%;

              .avatar-img {
                width: 48px;
                height: 48px;
                border-radius: 50%;
              }

              .user-info-nickname {
                font-size: 16px;
                font-weight: 600;
                color: #707070;
                line-height: 34px;
              }

              .high-privilege-mode {
                display: flex;
                justify-content: center;
                line-height: 23px;
                margin-bottom: 10px;
                cursor: pointer;
                font-size: 15px;
                color: #f50a0a;

                &:hover {
                  color: rgba(245, 10, 10, 0.6);
                }
              }

              .last-login-time {
                font-size: 10px;
                font-weight: 400;
                color: #828282;
                white-space: nowrap;
                margin-bottom: 7px;
              }

              .detail-info {
                font-size: 12px;
                font-weight: 400;
                color: #707070;
                width: 100%;
                padding: 0 12px 0 14px;
                display: flex;
                flex-wrap: wrap;

                .detail-item {
                  // display: inline-block;
                  margin-right: 5%;
                  white-space: nowrap;
                  flex-basis: 45%;
                  flex-grow: 1;
                }
              }
            }

            .bottom-operate {
              height: 49px;
              padding-left: 14px;
              display: flex;
              align-items: center;
              font-size: 14px;
              font-weight: 400;
              color: #333333;

              .change-pwd-btn {
                cursor: pointer;

                &:hover {
                  color: rgba(51, 51, 51, 0.6);
                }
              }
            }
          }
        }
      }
    }
  }

  .box /deep/ .el-dialog {
    border-radius: 8px !important;

    .block {
      margin-top: 30px;
      display: flex;
      align-items: center;

      span {
        font-size: 18px;
        font-family: PingFang SC;
        font-weight: bold;
        color: #666666;
      }

      .label {
        font-size: 15px;
        width: 100px;
        margin-right: 10px;

        &::after {
          content: ':';
          margin-left: 5px;
        }
      }
    }

    .titleZise {
      font-size: 24px;
      font-family: PingFang SC;
      font-weight: 500;
      color: #313131;
    }

    .textT {
      text-align: center;
      color: #999999;
    }
  }
}
</style>
