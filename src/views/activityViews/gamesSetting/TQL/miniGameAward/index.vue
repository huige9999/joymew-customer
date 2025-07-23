<template>
  <component :is="tem" :title="kindTitle" :kind="kind"></component>
</template>

<script>
import TQLAndCommonGameAward from './TQLGameAward';
import SixGameAward from './SixGameAward';

export default {
  name: 'miniGameAward',
  components: {
    TQLAndCommonGameAward,
    SixGameAward,
  },
  computed: {
    tem() {
      const CUSTOMER = this.$store.state.login.userInfo.high_privilege === 6; // 定制
      if (CUSTOMER) {
        return SixGameAward;
      }
      return TQLAndCommonGameAward;
    },
    kindTitle() {
      const { kind } = this;
      let title = '奖品设置';
      if (kind === '2') {
        title = `摇一摇${title}`;
      } else if (kind === '3') {
        title = `划一划${title}`;
      }

      return title;
    },
    splid() {
      return this.$store.state.liveId;
    },
  },
  props: {
    //   kind  2:摇一摇  3:划一划
    kind: {
      type: String,
    },
  },
};
</script>
