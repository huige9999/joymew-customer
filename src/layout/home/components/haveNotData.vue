<template>
  <div class="have-not-data">
      <div class="container">
        <img width="320" src="@/assets/image/icon/activity/noData.png" alt="">
        <div class="text">暂时没有数据</div>
      </div>
  </div>
</template>

<script>
export default {
  name: 'haveNotData',
};
</script>

<style lang="less" scoped>
.have-not-data{
  // position: absolute;
  width: 100%;
  height: 100%;
  // left: 0;
  // top: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  img{
    margin-left: 61px;
  }
  .text{
    text-align: center;
    font-size: 14px;
    color: #999999;
    line-height: 19px;
  }
}
</style>
