<template>
  <el-container class="main">
    <!-- 左侧边 -->
    <el-aside class="aside" style="width: 210px" v-show="!isInHMenuHidden">
      <h1>
        <a href="/"><img src="@/assets/image/logo.png" alt="logo图标" class="logo" /></a>
      </h1>
      <div class="scroll-wrap">
        <vue-scroll :ops="leftScrollOption">
          <sideBar />
        </vue-scroll>
      </div>
    </el-aside>
    <!-- 右侧内容 -->
    <div class="right">
      <!-- 顶部工具栏 -->
      <toolBar />
      <!-- 面包屑导航栏 -->
      <my-breadcrumb class="my-breadcrumb" />
      <!-- 内容区域 -->
      <div class="content">
        <router-view />
      </div>
    </div>
    <AppIntroductionModal></AppIntroductionModal>
  </el-container>
</template>

<script>
import MyBreadcrumb from '@/layout/home/components/myBreadcrumb';
import sideBar from '@/layout/home/components/sideBar';
import toolBar from '@/layout/home/components/toolBar';
import { mapState } from 'vuex';
import AppIntroductionModal from '../../views/homeViews/myAccount/appWithDraw/components/AppIntroductionModal';

export default {
  computed: {
    ...mapState({
      isInHMenuHidden: (state) => state.menu.isInHMenuHidden,
    }),
  },
  components: {
    MyBreadcrumb,
    sideBar,
    toolBar,
    AppIntroductionModal,
  },
  data() {
    return {
      leftScrollOption: {
        vuescroll: {},
        scrollPanel: {},
        rail: {},
        bar: {
          background: '#c1c1c1',
          opacity: 0.3,
        },
      },
      rightScrollOption: {
        vuescroll: {},
        scrollPanel: {},
        rail: {},
        bar: {
          background: '#c1c1c1',
          opacity: 0.8,
        },
      },
    };
  },
  methods: {
    // 退出按钮  退出到官网登录界面  清空token
    loginOut() {
      window.localStorage.clear();
      window.location.href = window.location.origin || 'https://www.hudongmiao.com/';
    },
  },
};
</script>

<style lang="less" scoped>
@sloganHeight: 53px;
@breadcrumbHeight: 44px;

.main::v-deep {
  .el-table .cell span {
    vertical-align: middle;
  }

  .el-dialog {
    margin-top: 0 !important;
    margin-bottom: 0;
    top: 50%;
    transform: translateY(-50%);

    .el-form {
      width: 460px;
      margin: auto;
    }
  }
}

.main {
  width: 100%;
  height: 100vh;
  display: flex;
  background-color: #f0f0f7;

  .my-breadcrumb {
    height: @breadcrumbHeight;
    background-color: unset;
    padding-left: 0;
    flex: 0 0 auto;
    padding: 0 20px;
  }

  .aside {
    flex-shrink: 0;
    height: 100%;
    background-color: #fff;
    display: flex;
    flex-direction: column;

    h1 {
      padding: 12px 81px 12px 68px;
      height: 61px;
      line-height: 61px;
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

    .scroll-wrap {
      flex: 1;
      overflow-y: auto;
    }

    .loginOut {
      padding: 18px 0px 20px 23px;
      color: #909399;
      font-size: 14px;
      cursor: pointer;

      i {
        margin-right: 10px;
      }
    }

    .loginOut:hover {
      color: rgb(144, 147, 153);
      background-color: rgb(15, 61, 95);
    }
  }

  .right {
    flex: 1 1 auto;
    height: 100vh;
    display: flex;
    flex-direction: column;
    overflow: hidden;

    .content {
      width: 100%;
      flex: 1 1 auto;
      overflow: auto;
      padding: 0 20px;

      .slogan {
        font-size: 13px;
        font-weight: 500;
        color: #b3b3b3;
        height: @sloganHeight;
        .hvCenter();
      }

      .sub-page {
        min-height: calc(100% - @breadcrumbHeight - @sloganHeight);
      }
    }
  }
}
</style>
