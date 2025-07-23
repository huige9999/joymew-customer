<template>
    <div class="process-container">
        <div class="process-outer" :style="{ backgroundColor: bgC, height: cpnHeight + 'px' }">
            <div class="process-inner" :style="{ backgroundColor: activeBgc, width: widthData }"></div>
        </div>
    </div>
</template>

<script>
export default {
  name: 'JoymewCustomerProcess',
  props: {
    bgC: {
      type: String,
      default: 'rgba(129, 226, 255, .4)',
    },
    activeBgc: {
      type: String,
      default: '#81E2FF',
    },
    cpnHeight: {
      type: String,
      default: '12',
    },
    processData: {
      type: Object,
      default() {
        return {
          actual: 0,
          total: 30,
        };
      },
    },
  },
  data() {
    return {
      widthData: '0%',
    };
  },
  mounted() {
    let { actual } = this.$props.processData;
    let { total } = this.$props.processData;
    actual = Number(actual);
    total = Number(total);
    this.widthData = `${Math.floor((actual / total) * 100)}%`;
  },
  watch: {
    processData() {
      let { actual } = this.$props.processData;
      let { total } = this.$props.processData;
      actual = Number(actual);
      total = Number(total);
      this.widthData = `${Math.floor((actual / total) * 100)}%`;
    },
  },
  methods: {

  },
};
</script>

<style lang="less" scoped>
.process-container {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    overflow: hidden;

    .process-outer {
        width: 100%;
        border-radius: 19px;
        overflow: hidden;

        .process-inner {
            width: 100%;
            height: 100%;
            border-radius: 19px;
            transition: width .3s ease-in;
        }
    }
}
</style>
