<!--提示条，暂时只有蓝色和黄色，之后可以加-->
<!--样例：http://localhost/#/app/myActivity/create （下方两种颜色的提示条）-->
<template>
  <div class="my-tip-bar">
    <div class="container" :class="colorStyle" :style="{width: width + 'px'}">
      <div class="message">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'myTipBar',
  props: {
    colorStyle: {
      type: String,
      default: 'blue',
    },
    width: {
      type: String,
      default: 'auto',
    },
  },
};
</script>

<style lang="less" scoped>
.my-tip-bar{
  display: flex;
  flex: 0 0 auto;
  margin-left: 5px;
  margin-bottom: 6px;
  margin-top: 6px;
  .container{
    position: relative;
    padding-left: 5px;
    padding-right: 10px;
    .message{
      font-size: 11px;
      font-weight: 400;
      color: rgba(0, 0, 0, 0.65);
      line-height: 20px;
      padding-top: 3px;
      padding-bottom: 3px;
    }
    &.blue{
      background-color: #DAECFF;
    }
    &.blue:after{
      background-color: #649FE5;
    }
    &.yellow{
      background-color: #FFF5DA;
    }
    &.yellow:after{
      background-color: #EACC78;
    }
    &:after{
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      margin-left: -5px;
      height: 100%;
      width: 5px;
    }
  }
}
</style>
