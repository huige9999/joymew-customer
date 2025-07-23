<!--数字变化效果-->
<!--需要传入数字以及elementId用于区分-->
<!--样例：http://localhost/#/app/home-->
<!--https://github.com/inorganik/countUp.js-->
<template>
  <span :id="elementId"></span>
</template>

<script>
import { CountUp } from 'countup.js';

export default {
  name: 'countUp',
  props: {
    count: [Number, String],
    elementId: String,
  },
  computed: {
    countObj() {
      // 处理小数
      const a = (this.count || 0).toString().split('.');
      const decimalPlaces = a.length > 1 ? a[1].length : 0;
      // 参数
      const options = { duration: 1.3, decimalPlaces };
      return new CountUp(this.elementId, this.count || 0, options);
    },
  },
  mounted() {
    if (!this.countObj.error) {
      this.countObj.start();
    } else if (this.count !== null && this.count !== undefined) {
      // 出错则原样填入
      if (document.getElementById(this.elementId)) {
        document.getElementById(this.elementId).innerText = this.count;
      }
    } else if (document.getElementById(this.elementId)) {
      document.getElementById(this.elementId).innerText = 0;
    }
  },
  watch: {
    count(newValue) {
      this.countObj.update(newValue);
    },
  },
};
</script>

<style scoped>
</style>
