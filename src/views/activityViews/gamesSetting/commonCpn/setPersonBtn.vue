<template>
<!-- 设置获奖人数的输入框 可以设置：数字变化幅度changeSize  输入框宽高  初始值initPerson-->
  <div class="set-person-btn" :changeSize="changeSize" :initPerson="initPerson" :style="{width: width + 'px', height: height + 'px'}">
    <div class="person">{{person}}&nbsp;&nbsp;<span>&nbsp;&nbsp;人</span></div>
    <div class="btn-group">
      <div class="up" @click="addPerson(changeSize)"><p class="el-icon-arrow-up"></p></div>
      <div class="down" @click="reducePerson(changeSize)"><p class="el-icon-arrow-down"></p></div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'setPersonBtn',
  data() {
    return {
      person: 0,
    };
  },
  watch: {
    initPerson(newVal) {
      this.person = newVal;
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
    /* 时间初始值 */
    initPerson: {
      type: Number,
      default() {
        return 0;
      },
    },
  },
  methods: {
    addPerson(changeSize) {
      this.person += changeSize;
      this.$emit('personBtnClick', this.person);
    },
    reducePerson(changeSize) {
      if (this.person > 0) {
        this.person -= changeSize;
        this.$emit('personBtnClick', this.person);
      } else {
        this.person = 0;
        this.$emit('personBtnClick', this.person);
      }
    },
  },
};
</script>
<style lang="less" scoped>
  .set-person-btn{
    display: flex;
    border-radius: 4px;
    border: 1px solid #D9D9D9;
    margin-left: 20px;
    .person{
      flex: 3;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 22px;
      color: #1E87F0;
      text-align: center;
      span{
        font-size: 13px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #1E87F0;
        margin-left: 6px;
      }
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
