<template>
  <div class="sideBar">
    <el-menu :default-active="activeMenuIndex" class="menu-wrap">
      <div v-for="item in menus" :key="item.meta.index">
        <!-- 有子菜单 -->
        <el-submenu :index="item.meta.index" v-if="item.children.length > 0" class="menu-has-sub">
          <template slot="title">
            <div class="menu-content">
              <i :class="item.meta.icon"></i>
              <span>{{ item.meta.title }}</span>
            </div>
          </template>
          <div v-for="subItem in item.children" :key="subItem.meta.index" class="submenu-wrap">
            <router-link :to="{ name: subItem.name }" v-if="!subItem.meta.notMenu">
              <el-menu-item :index="subItem.meta.index">
                <div class="submenu-title">{{ subItem.meta.title }}</div>
              </el-menu-item>
            </router-link>
          </div>
        </el-submenu>
        <!-- 没有子菜单 -->
        <router-link :to="{ name: item.name }" v-else>
          <el-menu-item :index="item.meta.index" class="menu-individual">
            <div class="menu-content">
              <i :class="item.meta.icon"></i>
              <span slot="title">{{ item.meta.title }}</span>
            </div>
          </el-menu-item>
        </router-link>
      </div>
    </el-menu>
  </div>
</template>

<script>
const { mapState } = require('vuex');

export default {
  name: 'sideBar',
  // data() {
  //   return {
  //     activeMenuIndex: '1',
  //   };
  // },
  computed: {
    ...mapState({
      menus: (state) => state.menu.homeMenus,
      activeMenuIndex: (state) => state.menu.activeMenuIndex,
    }),
  },
  mounted() {
    // this.activeMenuIndex = this.$route.meta.index;
    this.$store.commit('menu/setActiveMenu', this.$route.meta.index);
  },
  // watch: {
  //   $route: {
  //     handler(route) {
  //       console.log('route>>>', route);
  //     },
  //     deep: true,
  //   },
  // },
  methods: {},
};
</script>
<style lang="less" scoped>
.menu-wrap::v-deep {
  position: relative;

  // 没有子菜单
  .menu-individual {
    color: #333;

    .menu-content {
      i {
        color: #333;
        margin-right: 8px;
      }
    }

    &:hover {
      background-color: rgba(250, 173, 20, 0.2);
    }

    &.is-active {
      background-color: rgba(250, 173, 20, 0.2);
      color: #faad14;

      .menu-content {
        i {
          color: #faad14;
        }
      }

      &::after {
        content: '';
        display: block;
        width: 4px;
        height: 100%;
        background: #faad14;
        position: absolute;
        left: 0;
        top: 0;
      }
    }
  }

  // 有子菜单
  .menu-has-sub {
    .el-submenu__title {
      color: #333;

      .menu-content {
        i {
          color: #333;
          margin-right: 8px;
        }
      }

      &:hover {
        background-color: rgba(250, 173, 20, 0.2);
      }
    }

    &.is-active {
      .el-submenu__title {
        font-weight: 500;

        .menu-content {
          i {
            font-weight: 500;
          }
        }
      }
    }

    // 子菜单
    .submenu-wrap {
      .el-menu-item {
        color: #666;

        &:hover {
          background-color: rgba(250, 173, 20, 0.2);
        }

        &.is-active {
          background-color: rgba(250, 173, 20, 0.2);
          color: #faad14;

          &::after {
            content: '';
            display: block;
            width: 4px;
            height: 100%;
            background: #faad14;
            position: absolute;
            left: 0;
            top: 0;
          }
        }
      }
    }
  }
}
</style>
