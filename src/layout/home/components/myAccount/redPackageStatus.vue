<template>
  <div class="red-package-status" :class="className">
    {{ message }}
  </div>
</template>

<script>
export default {
  name: 'redPackageStatus',
  props: {
    status: String,
  },
  data() {
    return {
      className: '',
      message: '',
    };
  },
  created() {
    if (this.status === '0') {
      this.className = 'blue';
      this.message = '未使用';
    } else if (this.status === '1') {
      this.className = 'green';
      this.message = '以使用';
    } else if (this.status === '2') {
      this.className = 'gray';
      this.message = '已过期';
    }
  },
};
</script>

<style lang="less" scoped>
@blue: #2F90F1;
@green: #50B72A;
@gray: rgba(0, 0, 0, 0.45);

.red-package-status{
  font-weight: 400;
  position: relative;
  display: inline-block;
  //左侧点
  &:before{
    content: '';
    position: absolute;
    width: 6px;
    height: 6px;
    border-radius: 3px;
    left: -11px;
    .vAbsoluteCenter();
  }
  &.blue{
    color: @blue;
    &:before{
      background-color: @blue;
    }
  }
  &.green{
    color: @green;
    &:before{
      background-color: @green;
    }
  }
  &.gray{
    color: @gray;
    &:before{
      background-color: @gray;
    }
  }
}
</style>
