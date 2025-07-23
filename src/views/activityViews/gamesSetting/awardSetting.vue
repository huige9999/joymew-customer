<!--判断是否为嗨喵合伙人-->
<template>
  <component :is="tem"></component>
</template>

<script>
import awardTQLSetting from './awardTQLSetting';
import awardCommonSetting from './awardCommonSetting';
import awardShopSetting from './awardShopSetting';

export default {
  name: 'branch',
  components: { awardTQLSetting, awardCommonSetting, awardShopSetting },
  computed: {
    tem() {
      const highPrivilege = this.$store.state.login.userInfo.high_privilege;
      let isTql = false;
      let isShop = false;
      let tmpResultStr = 'awardCommonSetting';
      if (highPrivilege === 3 || highPrivilege === 4) {
        isTql = true;
      }
      if (highPrivilege === 6) {
        isShop = true;
      }

      if (isTql) {
        tmpResultStr = 'awardTQLSetting';
      }
      if (isShop) {
        tmpResultStr = 'awardShopSetting';
      }
      return tmpResultStr;
    },
  },
};
</script>

<style scoped></style>
