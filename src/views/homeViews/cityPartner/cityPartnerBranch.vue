<!--判断是否为嗨喵合伙人-->
<template>
  <component :is="tem"></component>
</template>

<script>

import CityPartnerIndex from '@/views/homeViews/cityPartner/CityPartnerIndex';
import CityPartnerIntroduction from '@/views/homeViews/cityPartner/CityPartnerIntroduction';

export default {
  name: 'branch',
  components: { CityPartnerIndex, CityPartnerIntroduction },
  computed: {
    tem() {
      const { userInfo } = this.$store.state.login;
      if (userInfo // 已登录
        && userInfo.is_city_partner === '1' // 是嗨喵合伙人
      ) {
        return 'CityPartnerIndex';
      }
      return 'CityPartnerIntroduction';
    },
  },
};
</script>

<style scoped>

</style>
