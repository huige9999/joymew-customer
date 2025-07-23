<template>
  <!-- 切换轮次组件  传入参数：总轮次 -->
  <div class="toggle-bar" :totleSort="totleSort">
    <div class="toggle-bar-item" @click="clickBarItem(item)" v-for="(item, index) in totleSort" :key="index">
      {{ `第${item}轮` }}
      <div :class="{ underLine: currentSort == item }"></div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'changeSort',
  data() {
    return {
      currentSort: 1,
    };
  },
  props: {
    totleSort: {
      type: Number,
      default() {
        return 1;
      },
    },
  },
  methods: {
    clickBarItem(item) {
      this.currentSort = item;
      this.$emit('sortClick', item);
    },
  },
};
</script>
<style lang="less" scoped>
.toggle-bar {
  margin-top: 20px;
  display: flex;
  border-bottom: 1px solid #eeeeee;
  .toggle-bar-item {
    position: relative;
    flex-basis: 100px;
    justify-content: flex-start;
    padding: 10px 0;
    text-align: center;
    font-size: 15px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #666666;
    cursor: pointer;
    .underLine {
      position: absolute;
      width: 20px;
      height: 5px;
      background: #1e87f0;
      bottom: 0;
      left: 40px;
      border-radius: 2px;
    }
  }
}
</style>
