<template>
  <div class="innerSideBar">
    <div class="pMenu">{{ pMenuName }}</div>
    <el-menu style="overflow: auto" :default-active="activeMenuIndex" @select="handleSelect" background-color="#F3F5FE"
      text-color="#333333" active-text-color="#ffffff">
      <div v-for="item in menuInfo" :key="item.index" class="menus">
        <router-link :to="{ name: item.name }">
          <el-menu-item :index="item.meta.index">
            <div class="menuItem">
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
export default {
  name: 'innerSideBar',
  props: {
    menuInfo: Array,
  },
  data() {
    return {
      activeMenuIndex: '',
    };
  },
  computed: {
    pMenuName: function pMenuName() {
      return this.$route.matched[1].meta.title;
    },
  },
  watch: {
    $route() {
      this.activeMenuIndex = this.$route.meta.index;
    },
  },
  created() {
    this.activeMenuIndex = this.$route.meta.index;
  },
  methods: {
    handleSelect(index, indexPath) {
      console.log(index, indexPath);
    },
  },
};
</script>

<style lang="less" scoped>
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

.innerSideBar {
  width: 202px;

  /* element-ui table的去除右侧滚动条的样式 */
  ::-webkit-scrollbar {
    width: 10px;
    height: 1px;
  }

  /* 滚动条的滑块 */
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
</style>
