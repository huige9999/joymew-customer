<template>
  <el-container class="main">
    <div class="innerSideBar">
      <div class="pMenu">团队管理</div>
      <el-menu
        style="overflow: auto"
        background-color="#F3F5FE"
        text-color="#333333"
        active-text-color="#ffffff"
        :default-active="activeMenuIndex"
      >
        <div v-for="item in menus" :key="item.teamManageIndex" class="menus">
          <router-link :to="{ name: item.name }">
            <el-menu-item :index="item.teamManageIndex">
              <div class="menuItem">
                <i :class="item.icon"></i>
                <span slot="title">{{ item.title }}</span>
              </div>
            </el-menu-item>
          </router-link>
        </div>
      </el-menu>
      <div class="back-btn" @click="goBack">
        <img src="@/assets/image/icon/menu/back_icon.png" alt="返回Icon" class="back-icon" />
        <span>返回</span>
      </div>
    </div>
    <div class="routeWrap">
      <router-view />
    </div>
  </el-container>
</template>

<script>
import teamManageRoutes from '@/router/teamManage/index';

export default {
  components: {},
  created() {
    this.generateMenusByRoutes();
    this.activeMenuIndex = this.$route.meta.teamManageIndex;
  },
  mounted() {},
  data() {
    return {
      menus: [],
      activeMenuIndex: '',
    };
  },
  computed: {},
  methods: {
    generateMenusByRoutes() {
      this.menus = teamManageRoutes[0].children.map((route) => {
        return {
          path: route.path,
          name: route.name,
          teamManageIndex: route.meta.teamManageIndex,
          title: route.meta.title,
          icon: route.meta.icon,
        };
      });
    },
    goBack() {
      this.$router.replace('/app/home');
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
    position: relative;
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
      position: absolute;
      top: 300px;
      left: 0;
      right: 0;
      margin: 0 auto;
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
  // 右侧页面内容
  .routeWrap {
    overflow: auto;
    flex: 1;
    padding: 0 20px;
  }
}
</style>
