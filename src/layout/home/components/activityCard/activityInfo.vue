<template>
  <div class="activity-info">
    <div class="name">
      <slot name="name"></slot>
    </div>
    <div class="address">
      <slot name="local"><img src="@/assets/image/icon/activity/local.png" alt=""></slot>
      <slot name="address"></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'activityInfo',
};
</script>

<style lang="less" scoped>
.activity-info {
  color: #ffffff;
  margin-right: auto;
  padding-left: 17px;
  width: 0;
  flex: 1 1 auto;
  .name {
    font-size: 14px;
    font-weight: 500;
  }
  .address {
    font-size: 11px;
    font-weight: 300;
    margin-top: 5px;
    opacity: 0.8;
  }
  .name,
  .address {
    img{
      width: 11px;
      height: 11px;
      padding-left: 2px;
    }
    // 超出显示省略号
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    word-break: break-all;
  }
}
</style>
