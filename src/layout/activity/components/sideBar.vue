<template>
  <el-menu :default-active="activeMenuIndex" @select="handleSelect" text-color="#333333" class="menu-wrap">
    <div v-for="item in menus" :key="item.index" class="menus">
      <router-link :to="{ name: item.meta.defaultSubpage }">
        <el-menu-item :index="item.meta.index">
          <div class="menuItem">
            <img :src="item.meta.icon" class="menuIcon" />
            <span slot="title">{{ item.meta.title }}</span>
          </div>
        </el-menu-item>
      </router-link>
    </div>
  </el-menu>
</template>
<script>
import menus from '@/router/activity/index';
import { mapState } from 'vuex';

export default {
  name: 'sideBar',
  data() {
    return {
      activeMenuIndex: '0',
    };
  },
  computed: {
    ...mapState({
      sceneType: (state) => state.sceneType,
      isTemplate: (state) => state.isTemplate,
      user_end_type: (state) => state.login.userInfo.config.user_end_type,
      isInHMenuHidden: (state) => state.menu.isInHMenuHidden,
    }),
    isCompany() {
      return this.user_end_type === '1';
    },
    menus() {
      let resultMenus = [];
      if (this.isInHMenuHidden) {
        const highPrivilegeMenus = menus[0].children.filter((item) => {
          console.log(item);
          const topMenuSet = [
            'activityInfo', // 活动信息
            'gamesSetting', // 游戏设置
            'activityData', // 活动数据
          ];
          return topMenuSet.includes(item.path);
        });
        resultMenus = JSON.parse(JSON.stringify(highPrivilegeMenus));
      } else if (this.isCompany) {
        const companyMenus = menus[0].children.filter((item) => {
          console.log(item);
          const topMenuSet = [
            'activityInfo', // 活动信息
            'gamesSetting', // 游戏设置
            'activityData', // 活动数据
          ];

          return topMenuSet.includes(item.path);
        });
        resultMenus = JSON.parse(JSON.stringify(companyMenus));
      } else if (this.isTemplate) {
        resultMenus = JSON.parse(JSON.stringify(menus[0].children.slice(0, 2)));
        resultMenus[0].meta.defaultSubpage = 'activityEdit';
        resultMenus[1].meta.defaultSubpage = 'hby';
      } else {
        resultMenus = menus[0].children;
      }
      return resultMenus;
    },
  },
  created() {
    this.activeMenuIndex = this.$route.meta.parentIndex;
  },
  methods: {
    handleSelect(index, indexPath) {
      console.log(index, indexPath);
    },
  },
};
</script>
<style lang="less" scoped>
// .el-menu-item::v-deep {
//   height: 159px;
//   &.is-active {
//   }
// }
// .menuItem {
//   display: flex;
//   flex-direction: column;
//   align-items: center;
//   justify-content: center;
//   height: 100%;
//   .menuIcon {
//     width: 57px;
//     height: 57px;
//   }
// }
.menu-wrap::v-deep {
  width: 140px;

  .el-menu-item {
    .menuItem {
      .menuIcon {
        width: 28px;
        height: 28px;
        margin-right: 8px;
      }
    }

    &.is-active {
      background-color: #ecf5ff;
    }
  }
}
</style>
