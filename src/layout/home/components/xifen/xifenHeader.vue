<template>
  <content-header class="xifenHeader">
    <div class="item item1 vCenter">
      <el-avatar v-show="!avatar" :size="65" src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png"></el-avatar>
      <el-avatar v-show="avatar" :size="65" :src="avatar"></el-avatar>
    </div>
    <div class="item item2 multiHLeft">
      <div class="name">{{ name }}</div>
      <div class="info text">当前吸粉公众号</div>
    </div>
    <header-right-data :data="infoData" />
  </content-header>
</template>

<script>
import HeaderRightData from '@/views/homeViews/home/components/headerRightData';
import ContentHeader from '@/layout/home/components/header/contentHeader';

export default {
  name: 'xifenHeader',
  components: { ContentHeader, HeaderRightData },
  data() {
    return {};
  },
  props: {
    avatar: String,
    name: String,
  },
  computed: {
    userInfo() {
      return this.$store.state.login.userInfo;
    },
    infoData() {
      return [
        {
          text: '总互动',
          number: (this.userInfo.user_money || {}).spltotal || 0,
        },
        {
          text: '总粉丝数',
          number: this.userInfo.user_money.funcount,
        },
      ];
    },
  },
  methods: {},
};
</script>

<style lang="less" scoped>
.xifenHeader {
  .item {
    position: relative;
    .hCenter();
    .name {
      font-weight: 500;
      color: rgba(0, 0, 0, 0.85);
      line-height: 26px;
      font-size: 19px;
      padding-bottom: 10px;
    }
    .text {
      color: rgba(0, 0, 0, 0.45);
      font-size: 13px;
    }
  }
  .item1 {
    width: 109px;
  }
  .item2 {
    width: 200px;
    margin-right: auto;
  }
}
</style>
