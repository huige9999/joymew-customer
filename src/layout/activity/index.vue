<template>
  <!-- 活动信息 -->
  <el-container class="main">
    <div class="top" :class="{ template: isTemplate }">
      <!-- 左侧边 -->
      <el-aside class="aside" style="width: 140px">
        <div class="aside-top">
          <h1>
            <a href="/"><img src="@/assets/image/logo.png" alt="logo图标" class="logo" /></a>
          </h1>
          <div class="back-btn" @click="goBack">
            <img src="@/assets/image/icon/menu/back_icon.png" alt="返回Icon" class="back-icon" />
            <span>返回</span>
          </div>
          <!-- <div class="back-container" @click="goBack">
            <img src="@/assets/image/icon/menu/back.png" alt="" />
          </div> -->
        </div>
        <div class="scroll-wrap">
          <vue-scroll :ops="scrollOption">
            <!-- 哈哈哈 -->
            <!-- <div class="userInfo" @click="goBack">
            <div class="avatarWrap">
              <div class="shade outer"></div>
              <div class="shade inner"></div>
              <img :src="avator" class="avatarImg" alt="" />
              <div class="badge-wrap" v-if="!isCompany">
                <div class="count">Lv {{ degree }}</div>
              </div>
            </div>
            <span class="name">{{ name }}</span>
          </div> -->
            <side-bar />
            <!-- <div class="back-container" @click="goBack">
            <img src="@/assets/image/icon/menu/back.png" alt="" />
          </div> -->
          </vue-scroll>
        </div>
      </el-aside>
      <!-- 右侧内容 -->
      <div class="right">
        <!-- 顶部工具栏 -->
        <toolBar />
        <!-- 内容区域 -->
        <div class="content">
          <InnerSideBar :menuInfo="getInnerMenusInfo" />
          <div class="route-wrap">
            <router-view />
          </div>
        </div>
      </div>
    </div>
    <!-- 底部内容 -->
    <div class="bottom" v-show="!isTemplate" :class="{ iframeEnv: isIframeEnv }">
      <div class="item" @click="toLargeScreen">
        <img src="@/assets/image/icon/screen.png" class="screenIcon" />
        <span>进入大屏</span>
      </div>
      <div class="item newHd" @click="toLargeScreenNew" v-if="sceneType === '0' || sceneType === '1'">
        <img src="@/assets/image/icon/activity/enterNew.png" class="screenIcon" />
        <span>进入新版大屏</span>
      </div>
      <div class="item" @click="showQRcode">
        <img src="@/assets/image/icon/mobile.png" class="mobileIcon" />
        <span>手机遥控</span>
      </div>
    </div>
    <!-- 显示遥控器二维码 -->
    <my-dialog :show="isShowControlDialog">
      <div class="qrcode-container">
        <img :src="controlQRcodeUrl" alt="" />
      </div>
      <div class="btn-container">
        <el-button type="primary" @click="closeQRcodeDialog">取消</el-button>
      </div>
    </my-dialog>
  </el-container>
</template>

<script>
// import sideBar from '@/layout/activity/components/sideBar';
import { Login } from '@/api/login';
import { getControlQRcode } from '@/api/setting/setting';
import myDialog from '@/components/myDialog';
import InnerSideBar from '@/layout/activity/components/innerSideBar';
import sideBar from '@/layout/activity/components/sideBar';
import toolBar from '@/layout/home/components/toolBar';
import { isIframeEnv } from '@/utils/index';
import { mapState } from 'vuex';

const TMPLATEHIDEMENUS = [
  'getPhone',
  'livePhoto',
  'qrcodeFixed',
  'hbkdRecharge',
  'signinLottery',
  'customUser',
  'listLottery',
  'giveMark',
  'giftAllFree',
  'launchCeremony',
  'seat',
  'custom3DSign',
  'messageVerify',
  'customMenu',
  'locationLimit',
  'songChoose',
  'shineAnywhere',
  'signinLottery',
  'listLottery',
  'vote',
  'guessStarSetting',
  'dragonBoatTeamShake',
  'photoLottery',
  'xydbCustom',
  'kbCustom',
  'cardDrawCustom',
  'guessCommonSetting',
  'happyQA',
  'mahjongSetting',
];
export default {
  components: {
    sideBar,
    toolBar,
    InnerSideBar,
    myDialog,
  },
  data() {
    return {
      scrollOption: {
        vuescroll: {},
        scrollPanel: {},
        rail: {},
        bar: {
          background: '#c1c1c1',
          opacity: 0.3,
        },
      },
      name: '',
      headerImg: '',
      basicUrl: '',
      isShowControlDialog: false,
      controlQRcodeUrl: '',
      isIframeEnv: false,
    };
  },
  computed: {
    ...mapState({
      degree: (state) => state.login.userInfo.vip_grade,
      sceneType: (state) => state.sceneType,
      isTemplate: (state) => state.isTemplate,
      sign_show_phone: (state) => state.login.userInfo.sign_show_phone,
      user_end_type: (state) => state.login.userInfo.config.user_end_type,
    }),
    isCompany() {
      return this.user_end_type === '1';
    },
    /**
     * 获取二级菜单信息
     * @returns Array
     */
    getInnerMenusInfo() {
      const { routes } = this.$router.options;
      const targetIndex = routes.findIndex((item) => item.path.indexOf('/app/activity') > -1);
      const menuRoutes = routes[targetIndex].children;
      const menuIndex = this.$route.matched[1].meta.index;
      // 存放只有婚礼版才展示的菜单
      // 含义：[谢幕,点歌]
      const ONLYWEDDING_MENUS = ['curtainCall', 'songChoose'];
      // 1、查找二级菜单列表
      // 2、根据"过滤规则"过滤二级菜单
      // 3、设置二级菜单列表的meta索引
      // 过滤规则：1、”模板模式“的情况下剔除该模式不需要展示的菜单
      // 2、非婚礼版剔除谢幕设置、点歌设置
      const tmpMenuRoutes = menuRoutes
        .find((e) => e.meta.index === menuIndex)
        .children.filter((item) => {
          let tmpFlag = true;
          if (this.isTemplate) {
            if (TMPLATEHIDEMENUS.includes(item.name)) {
              tmpFlag = false;
            }
          } else if (ONLYWEDDING_MENUS.includes(item.name) && this.sceneType !== '0') {
            tmpFlag = false;
          }

          // 只有15799887766该账号能显示：链接配置
          if (item.name === 'ConfigLink' && this.$store.state.login.userInfo.phonenumber !== '15799887766') {
            tmpFlag = false;
          }
          return tmpFlag;
        });
      const tempLen = tmpMenuRoutes.length;
      for (let i = 0; i < tempLen; i += 1) {
        tmpMenuRoutes[i].meta.index = `${i + 1}`;
      }
      return tmpMenuRoutes;
    },
    avator() {
      return this.$store.state.login.userInfo.avator;
    },
  },
  methods: {
    /* 返回首页 */
    goBack() {
      if (this.isCompany) {
        this.$router.replace('/app/cHome');
        return;
      }
      if (!this.isTemplate) {
        this.$router.replace('/app/home');
        return;
      }
      this.$router.replace('/app/templateConfig');
    },
    /* 请求遥控器二维码 */
    getControlQRcode() {
      getControlQRcode({
        splid: this.$store.state.liveId,
        page: 'pages/index/controller/controller',
        logoPath: this.$store.state.login.userInfo.headimg_url,
        request_from_page: 'layout/activity/index',
      }).then((res) => {
        console.log('control qrcode', res);
        this.controlQRcodeUrl = res.smallProgramCode;
      });
    },
    /* 显示遥控器二维码弹出框 */
    showQRcode() {
      this.isShowControlDialog = true;
    },
    /* 通过token请求用户相关信息 */
    requestUserInfo() {
      Login({ request_from_page: 'layout/activity/index' }).then((res) => {
        console.log('userinfo', res);
        this.name = res.emcee_name;
        this.basicUrl = res.qinNiu_prefix;
        this.headerImg = res.avator;
      });
    },
    /* 进入大屏 */
    toLargeScreen() {
      const { liveId } = this.$store.state;
      // 线上进入大屏地址
      let url = `https://screen.hudongmiao.com/#/?liveId=${liveId}`;
      if (window.location.origin.indexOf('wwwstage.hudongmiao.com') > -1) {
        // 测试环境进入大屏地址
        url = `https://screenstage.hudongmiao.com/#/?liveId=${liveId}`;
      }
      console.log('大屏', url);
      window.open(url);
    },
    toLargeScreenNew() {
      const { liveId } = this.$store.state;
      // 线上进入大屏地址
      const sceneTypeText = this.sceneType === '0' ? 'wedding' : 'enterprise';
      let url = `https://screen.hudongmiao.com/#/?liveId=${liveId}&screenType=${sceneTypeText}`;
      if (window.location.origin.indexOf('wwwstage.hudongmiao.com') > -1) {
        // 测试环境进入大屏地址
        url = `https://screenstage.hudongmiao.com/#/?liveId=${liveId}&screenType=${sceneTypeText}`;
      }
      console.log('大屏', url);
      window.open(url);
    },
    closeQRcodeDialog() {
      this.isShowControlDialog = false;
    },
  },
  created() {
    this.requestUserInfo();
    this.getControlQRcode();
    this.isIframeEnv = isIframeEnv();
  },
};
</script>

<style lang="less" scoped>
// @sloganHeight: 53px;
@breadcrumbHeight: 44px;

.main {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f0f0f7;

  .top {
    display: flex;
    height: calc(100% - 61px);

    .my-breadcrumb {
      height: @breadcrumbHeight;
    }

    .aside {
      flex: 0 0 auto;
      height: 100%;
      background-color: #fff;
      display: flex;
      flex-direction: column;
      align-items: center;

      .aside-top {
        width: 124px;
        border-bottom: 1px solid #e5e6eb;
        display: flex;
        flex-direction: column;
        align-items: center;

        h1 {
          padding: 15px 32px 15px 31px;
          height: 59px;
          box-sizing: border-box;
          font-size: 0;
          flex: 0 0 auto;

          .logo {
            width: 61px;
            height: 29px;
          }

          &:hover {
            opacity: 0.6;
          }
        }

        .back-btn {
          width: 72px;
          height: 30px;
          border: 1px solid #333333;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 17px 0 19px 0;
          font-size: 14px;
          font-weight: 500;
          color: #333333;
          cursor: pointer;

          .back-icon {
            width: 14px;
            height: 14px;
            margin-right: 5px;
          }

          &:hover {
            opacity: 0.6;
          }
        }
      }

      .scroll-wrap {
        flex: 1;
        overflow: auto;
      }

      // .userInfo {
      //   width: 100%;
      //   height: 226px;
      //   padding: 60px 0 32px 0;
      //   border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      //   cursor: pointer;
      //   .multiHvCenterSide();
      //   .avatarWrap {
      //     width: 81px;
      //     height: 81px;
      //     position: relative;
      //     .shade {
      //       position: absolute;
      //       border-radius: 50%;
      //       background-color: rgba(255, 255, 255, 0.1);
      //       &.inner {
      //         width: 88px;
      //         height: 88px;
      //         left: -3.5px;
      //         top: -3.5px;
      //       }
      //       &.outer {
      //         width: 98px;
      //         height: 98px;
      //         left: -8.5px;
      //         top: -8.5px;
      //       }
      //     }
      //     .avatarImg {
      //       width: 100%;
      //       height: 100%;
      //       border-radius: 50%;
      //       position: absolute;
      //       top: 0;
      //       left: 0;
      //     }
      //     .badge-wrap {
      //       width: 110px;
      //       height: 43px;
      //       background-image: url('~@/assets/image/degree/badge.png');
      //       background-size: 100% 100%;
      //       position: absolute;
      //       transform: scale(0.6);
      //       left: 30px;
      //       top: -15px;
      //       .count {
      //         font-size: 16px;
      //         // font-family: sucaijishikufangti;
      //         font-weight: bold;
      //         color: #f8f8f8;
      //         width: 90px;
      //         height: 100%;
      //         position: absolute;
      //         top: 0;
      //         right: 0;
      //         display: flex;
      //         justify-content: center;
      //         align-items: center;
      //       }
      //     }
      //     .status {
      //       position: absolute;
      //       left: 58px;
      //       top: 1px;
      //       width: 56px;
      //       .hvCenter();
      //       .dot {
      //         width: 13px;
      //         height: 13px;
      //         background: #18d671;
      //         border-radius: 50%;
      //       }
      //       span {
      //         font-size: 11px;
      //         color: #18d671;
      //         margin-left: 5px;
      //       }
      //     }
      //   }
      //   .name {
      //     font-size: 18px;
      //     color: #ffffff;
      //   }
      //   .hightM {
      //     cursor: pointer;
      //     font-size: 15px;
      //     color: #f50a0a;
      //   }
      // }
    }

    .right {
      flex: 1 1 auto;
      height: 100%;
      display: flex;
      flex-direction: column;
      overflow: hidden;

      .content {
        width: 100%;
        flex: 1 1 auto;
        overflow: auto;
        display: flex;

        .route-wrap {
          padding: 10px 20px 0 36px;
          flex: 1;
          overflow: auto;
        }
      }
    }

    &.template {
      height: 100%;
    }
  }

  .bottom {
    height: 61px;
    background: #fb7b58;
    display: flex;
    justify-content: center;
    position: fixed;
    bottom: 0;
    width: 100%;

    .item {
      display: flex;
      align-items: center;
      margin: 0 90px;
      cursor: pointer;
      position: relative;

      &.newHd {
        background: linear-gradient(180deg, #ff7590 0%, #ff3d66 100%);
        width: 395px;
        justify-content: center;
      }

      .screenIcon {
        width: 27px;
        height: 23px;
      }

      .mobileIcon {
        width: 18px;
        height: 27px;
      }

      span {
        margin-left: 4px;
        color: #ffffff;
        font-size: 21px;
      }
    }

    &.iframeEnv {
      bottom: 50px;
    }
  }

  .btn-container {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 30px;
  }

  .qrcode-container {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 20px;
  }
}
</style>
