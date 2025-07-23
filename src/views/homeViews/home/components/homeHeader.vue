<!--首页的头部-->
<template>
  <div class="homeInfo">
    <div class="leftSide">
      <p>亲爱的{{ userInfo.emcee_name }}，今天是{{ nowDateString }}</p>
      <p>上次登录时间：{{ lastLoginTime }}</p>
    </div>
    <header-right-data :data="infoData" class="right-side" />
  </div>
</template>

<script>
import HeaderRightData from './headerRightData';

export default {
  name: 'homeHeader',
  components: { HeaderRightData },
  created() {
    const d = new Date();
    this.nowDateString = `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日 ${
      ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'][d.getDay()]
    }`;
    // 跟新vuex中的数据
    // Login({ request_from_page: '/view/home/components/homeHeader' }).then((res) => {
    //   console.log(res);
    //   this.$store.commit('login/updateUserInfo', res);
    // });
  },
  data() {
    return {
      nowDateString: '',
    };
  },
  mounted() {
    // this.init();
  },
  watch: {
    userInfo() {
      // this.init();
    },
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
    infoData() {
      return [
        {
          text: '等级',
          number: this.userInfo.vip_grade || 0,
          action: 'level',
        },
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
.homeInfo {
  background-color: #ffffff;
  box-shadow: 0 3px 9px 0 rgba(119, 119, 119, 0.1);
  border-radius: 4px;
  height: 85px;
  padding-top: 10px;
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
  .right-side {
    align-items: start;
  }
}
</style>
