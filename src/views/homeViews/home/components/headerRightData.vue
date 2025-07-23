<template>
  <div class="header-right-data">
    <div class="item" v-for="(d, index) in data" :key="index" @click="clickTap(d.action)" :style="d.action ? 'cursor:pointer;' : ''">
      <div class="multiHRight">
        <div class="text">
          {{ d.text }}
        </div>
        <div class="number">
          <span v-if="d.action === 'level'" :class="d.action">LV</span>
          <count-up :count="d.number" :element-id="`headerNumber${index}`" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import CountUp from '@/components/countUp';

export default {
  name: 'headerRightData',
  components: { CountUp },
  props: {
    data: Array,
  },
  methods: {
    clickTap(action) {
      console.log(action);
      switch (action) {
        case 'level':
          console.log('level');
          this.$router.push('/app/userCenter/userDegree');
          break;
        default:
          break;
      }
    },
  },
};
</script>

<style lang="less" scoped>
.header-right-data {
  .hCenter();
  .item {
    width: 240px;
    position: relative;
    .hvCenter();
    .text {
      margin-bottom: 4px;
      color: rgba(0, 0, 0, 0.45);
      font-size: 13px;
    }
    .number {
      font-weight: 500;
      color: rgba(27, 84, 197, 0.85);
      line-height: 35px;
      font-size: 28px;
      .level{
        font-size: 16px;
        margin-right: 5px;
      }
    }
    &:nth-child(1):after,  &:nth-child(2):after {
      content: '';
      display: block;
      position: absolute;
      right: 0;
      height: 37px;
      width: 1px;
      background-color: rgba(233, 233, 233, 1);
    }

  }
}
</style>
