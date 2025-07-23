<template>
<div class="id-card" :style="{backgroundImage: 'url(' + backgroundImage + ')'}">
  <!--  标志-->
  <div class="head-text">嗨喵悦动</div>
  <div class="container">
  <!--  左侧头像区-->
    <div class="left">
      <slot name="left"></slot>
    </div>
  <!--  右侧内容区-->
    <div class="right">
      <slot name="right"></slot>
    </div>
  </div>
</div>
</template>

<script>
export default {
  name: 'idCard',
  data() {
    return {
      backgroundImage: require('../../../../assets/image/idCard/saved.png'),
    };
  },
};
</script>

<style lang="less" scoped>
.id-card{
  width: 580px;
  height: 483px;
  background-repeat: no-repeat;
  background-size: 100% 100%;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 14px;
  position: relative;
  .head-text{
    position: absolute;
    top: 77px;
    left: 261px;
    font-size: 15px;
    font-weight: 400;
    color: #FFFFFF;
    line-height: 20px;
  }
  .container{
    position: absolute;
    height: 240px;
    width: 462px;
    left: 70px;
    top: 188px;
    display: flex;
    .left{
      width: 130px;
      margin-left: 45px;
      margin-top: 20px;
      display: flex;
      flex-direction: column;
    }
    .right{
      flex: 1;
      margin-left: 40px;
      margin-top: 20px;
      margin-right: 20px;
    }
  }
}
</style>
