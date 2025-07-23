<template>
  <el-container class="main">
    <div class="innerSideBar">
      <div class="pMenu">活动设置</div>
      <el-menu
        style="overflow: auto"
        background-color="#F3F5FE"
        text-color="#333333"
        active-text-color="#ffffff"
        :default-active="activeMenuIndex"
      >
        <div v-for="item in menus" :key="item.meta.appTempIndex" class="menus">
          <router-link :to="{ name: item.name }">
            <el-menu-item :index="item.meta.appTempIndex">
              <div class="menuItem">
                <i :class="item.meta.icon"></i>
                <span slot="title">{{ item.meta.title }}</span>
              </div>
            </el-menu-item>
          </router-link>
        </div>
      </el-menu>
    </div>
    <div class="routeWrap">
      <router-view />
    </div>
  </el-container>
</template>

<script>
import { Login } from '@/api/login';
import { getMenusByFuncsAndRoutes, init } from '@/utils/appTemp';

export default {
  components: {},
  created() {
    // const storageSceneType = localStorage.getItem('sceneType');
    // const storageFuncs = localStorage.getItem('funcs');
    // const storageToken = localStorage.getItem('token');
    // const storageLiveId = localStorage.getItem('liveId');
    // if (storageSceneType && storageFuncs && storageLiveId && storageToken) {
    //   this.menus = getMenusByFuncsAndRoutes();
    //   console.log('菜单列表:', this.menus);
    //   // 重定向到跳转到第一个菜单页面
    //   this.redirectHome();
    //   // 设置当前菜单active项
    //   this.activeMenuIndex = this.$route.meta.appTempIndex;
    // } else {
    init().then(() => {
      this.$store.commit('initLiveInfo', {
        liveId: localStorage.getItem('liveId'),
        sceneType: localStorage.getItem('sceneType'),
        isTemplate: false,
      });
      Login({ request_from_page: 'app' }).then((res) => {
        this.$store.commit('login/updateUserInfo', res);
      });
      this.menus = getMenusByFuncsAndRoutes();
      console.log('菜单列表:', this.menus);
      // 重定向到跳转到第一个菜单页面
      this.redirectHome();
      // 设置当前菜单active项
      this.activeMenuIndex = this.$route.meta.appTempIndex;
    });
    // }
  },
  mounted() {},
  data() {
    return {
      menus: [],
      activeMenuIndex: '',
    };
  },
  watch: {
    $route(to, from) {
      console.log(to, from);
      this.authRoute(to);
    },
  },
  computed: {
    defaultPageName() {
      return this.menus.length > 0 ? this.menus[0].name : '';
    },
  },
  methods: {
    authRoute(route) {
      const routeVisible = this.getRouteVisible(route);
      if (!routeVisible) {
        // 无权限访问当前页面
        this.$message.error('无权限访问当前页面');
        // 重定向到首页
        this.redirectHome();
        return false;
      }
      this.activeMenuIndex = route.meta.appTempIndex;
      return true;
    },
    getRouteVisible(currentRoute) {
      const cRoute = currentRoute || this.$route;
      return !cRoute.meta.hidden;
    },
    initLiveInfo() {
      this.$store.dispatch('appTemp/getLiveInfo');
    },
    redirectHome() {
      if (!this.defaultPageName) {
        return;
      }
      this.$router.replace({
        name: this.defaultPageName,
      });
    },
  },
};
</script>

<style lang="less" scoped>
.main {
  width: 100%;
  height: 100vh;
  display: flex;
  background-color: #f0f0f7;
  // 左侧菜单框架默认样式修改
  .el-menu::v-deep {
    height: calc(100% - 69px);
    .el-menu-item {
      &.is-active {
        background-color: #4ea0f3 !important;
      }
      .menuItem {
        padding-left: 40px;
        i {
          font-size: 20px;
        }
      }
    }
  }
  // 左侧菜单样式
  .innerSideBar {
    width: 202px;
    ::-webkit-scrollbar {
      width: 1px;
      height: 1px;
    }
    ::-webkit-scrollbar-thumb {
      background-color: #a1a3a9;
      border-radius: 0px;
    }
    .pMenu {
      height: 69px;
      background: #ffffff;
      box-shadow: 2px 3px 10px 0px rgba(119, 119, 119, 0.1);
      font-size: 20px;
      font-weight: 700;
      color: #333333;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
  // 右侧页面内容
  .routeWrap {
    overflow: auto;
    flex: 1;
    padding: 0 20px;
  }
}
</style>
