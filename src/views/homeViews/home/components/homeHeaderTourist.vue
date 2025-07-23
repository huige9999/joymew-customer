<!--首页的头部-->
<template>
  <div class="homeInfo">
    <div class="leftSide">
      <p>亲爱的{{ userInfo.emcee_name }}，今天是{{ nowDateString }}</p>
      <p>上次登录时间：{{ lastLoginTime }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'homeHeader',
  created() {
    const d = new Date();
    this.nowDateString = `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日 ${
      ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'][d.getDay()]
    }`;
  },
  data() {
    return {
      nowDateString: '',
    };
  },
  computed: {
    userInfo() {
      return this.$store.state.login.userInfo;
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
  },
  methods: {},
};
</script>

<style lang="less" scoped>
.homeInfo {
  background-color: #ffffff;
  box-shadow: 0 3px 9px 0 rgba(119, 119, 119, 0.1);
  border-radius: 4px;
  height: 85px;
  padding-top: 5px;
  display: flex;
  .leftSide {
    margin-right: auto;
    width: 50%;
    height: 100%;
    padding-left: 22px;
    p {
      &:nth-child(1) {
        font-size: 18px;
        font-weight: 500;
        color: rgba(0, 0, 0, 0.85);
      }
      &:nth-child(2) {
        font-size: 13px;
        font-weight: 400;
        color: rgba(0, 0, 0, 0.45);
        margin-top: 7px;
      }
    }
  }
}
</style>
