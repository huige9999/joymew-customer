<!--判断是否绑定微信-->
<template>
  <component :is="tem"></component>
</template>

<script>

import BindWechat_bind from '@/views/homeViews/userCenter/bindWechat_bind';
import bindWechat_unbind from '@/views/homeViews/userCenter/bindWechat_unbind';

export default {
  name: 'branch',
  components: { bindWechat_unbind, BindWechat_bind },
  computed: {
    tem() {
      const { userInfo } = this.$store.state.login;
      console.log(userInfo);
      if (userInfo // 已登录
        && userInfo.wx_openid // 已绑定
      ) {
        console.log(`userInfo.wx_openid: ${userInfo.wx_openid}`);
        return 'BindWechat_bind';
      }
      return 'bindWechat_unbind';
    },
  },
};
</script>

<style scoped>

</style>
