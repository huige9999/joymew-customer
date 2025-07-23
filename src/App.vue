<template>
  <div id="app">
    <keep-alive include="bindWechat_unbind">
      <router-view />
    </keep-alive>
  </div>
</template>
<script>
import { Login } from '@/api/login';
import messageBoxMixin from '@/mixins/messageBoxMixin';
import messageMixin from '@/mixins/messageMixin';
import { clearStorageDataInAppTempMode } from '@/utils/appTemp';
import { setToken, setTokenPartner } from '@/utils/request';
import showTeachPopup from '@/views/homeViews/videoReward/component/index';

export default {
  name: 'app',
  components: {},
  mixins: [messageMixin, messageBoxMixin],
  methods: {
    initHighLevelMode() {
      /**
       * 高级模式的情况下：
       * 上次如果设置了“高级模式隐藏状态”本次也要保持相同状态
       * hp_passwd 高级模式的密码 也代表是否开启了高级模式
       * hp_status 1表示隐藏菜单 0或不存在在表示显示菜单
       */
      const { hp_passwd, hp_status } = this.$store.state.login.userInfo;
      const currentHpStatus = hp_status || localStorage.getItem('hpStatus');
      if (hp_passwd && currentHpStatus === '1') {
        this.$store.commit('menu/hideMenuHighLevel');
        localStorage.setItem('hpStatus', 1);
      } else {
        this.$store.commit('menu/showMenuHighLevel');
        localStorage.removeItem('hpStatus');
      }
    },
  },
  created() {
    // 链接带参访问模式打开项目
    if (window.location.href.includes('appTemp')) {
      return;
    }
    clearStorageDataInAppTempMode();
    if (window.location.href.indexOf('partnerSystem') > -1) {
      setTokenPartner();
      return;
    }
    if (process.env.NODE_ENV === 'development') {
      setToken(process.env.VUE_APP_TOKEN);
    } else {
      setToken();
    }
    Login({ request_from_page: 'app' }).then((res) => {
      this.$store.commit('login/updateUserInfo', res);
      this.$store.commit('menu/initHomeMenus');
      this.initHighLevelMode();
      // 显示视频教程弹窗
      showTeachPopup();

      console.log('***res***', res);
    });
  },
};
</script>
<style lang="less">
/* 全局样式 */
* {
  margin: 0;
  padding: 0;
}

#app {
  position: relative;
  width: 100vw;
  height: 100vh;
}

a {
  text-decoration: none;
}

div {
  box-sizing: border-box;
}

.card {
  background: #ffffff;
  box-shadow: 2px 3px 9px 0 rgba(119, 119, 119, 0.1);
  border-radius: 4px;
}
</style>
