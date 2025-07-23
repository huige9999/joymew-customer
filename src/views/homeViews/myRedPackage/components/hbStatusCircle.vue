<!-- 红包类型圆形标识 -->
<template>
  <div class="circle" :style="{ width: size + 'px', height: size + 'px' }" :class="classStyle">{{ text }}</div>
</template>
<script>
export default {
  name: 'hbStatusCircle',
  props: {
    text: {
      type: String,
      default: '新',
    },
    classStyle: {
      type: String,
      default: 'new',
    },
    size: {
      type: [String, Number],
      default: 40,
    },
  },
};
</script>
<style lang="less" scoped>
.circle {
  font-size: 17px;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 500;
  line-height: 40px;
  text-align: center;
  font-weight: bold;
  border-radius: 10px;
  &.new {
    background: #ff8c58;
    color: #ffddce;
  }
  &.liushui {
    background: #f76661;
    color: #fec9c7;
  }
  &.zuan {
    background: linear-gradient(-42deg, #ab9cfa, #d2c5fc);
    color: #6036a7;
  }
  &.bo {
    background: linear-gradient(-42deg, #a1bce0, #edf4fd);
    color: #4e516a;
  }
  &.jin {
    background: linear-gradient(-42deg, #ecc269, #fbe7a5);
    color: #8d4820;
  }
  &.yin {
    background: linear-gradient(-42deg, #9895e0, #cccae9);
    color: #5c5681;
  }
  &.invite {
    background: linear-gradient(-42deg, #ddaa7c, #f3d9bd);
    color: #4e4e4e;
  }
}
</style>
