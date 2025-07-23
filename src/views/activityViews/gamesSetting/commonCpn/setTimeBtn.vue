<template>
<!-- 设置摇一摇时间的输入框 可以设置：数字变化幅度changeSize  输入框宽高  单位unit -->
  <div class="set-time-btn" :changeSize="changeSize" :initTime="initTime" :unit="unit" :style="{width: width + 'px', height: height + 'px'}">
    <div class="time">{{time}}&nbsp;&nbsp;{{unit}}</div>
    <div class="btn-group">
      <div class="up" @click="addTime(changeSize)"><p class="el-icon-arrow-up"></p></div>
      <div class="down" @click="reduceTime(changeSize)"><p class="el-icon-arrow-down"></p></div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'setTimeBtn',
  data() {
    return {
      time: 0,
    };
  },
  watch: {
    initTime(newVal) {
      this.time = newVal;
    },

  },
  props: {
    /* 按钮宽度 */
    width: {
      type: Number,
      default() {
        return 126;
      },
    },
    /* 按钮高度 */
    height: {
      type: Number,
      default() {
        return 45;
      },
    },
    /* 每点击数值变化的幅度 */
    changeSize: {
      type: Number,
      default() {
        return 1;
      },
    },
    /* 单位 */
    unit: {
      type: String,
      default() {
        return 's';
      },
    },
    /* 时间初始值 */
    initTime: {
      type: Number,
      default() {
        return 30;
      },
    },
  },
  methods: {
    addTime(changeSize) {
      this.time += changeSize;
      this.$emit('timeBtnClick', this.time);
    },
    reduceTime(changeSize) {
      if (this.time > 0) {
        this.time -= changeSize;
        // 将值传给父组件
        this.$emit('timeBtnClick', this.time);
      } else {
        this.time = 0;
        this.$emit('timeBtnClick', this.time);
      }
    },
  },
};
</script>
<style lang="less" scoped>
  .set-time-btn{
    display: flex;
    border-radius: 4px;
    border: 1px solid #D9D9D9;
    margin-left: 20px;
    .time{
      flex: 3;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 22px;
      color: #1E87F0;
      text-align: center;
    }
    .btn-group{
      flex: 1;
      display: flex;
      flex-direction: column;
      .up,.down{
        flex: 1;
        display: flex;
        align-items: center;
        font-weight: 700;
        justify-content: center;
        cursor: pointer;
      }
      .up:hover,.down:hover{
        color: #1E87F0;
      }
    }
  }
</style>
