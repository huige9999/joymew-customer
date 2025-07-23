<!--步骤条-->
<!--样例：http://localhost/#/app/myActivity/create-->
<template>
  <div class="my-steps">
    <el-steps :active="active" finish-status="success">
      <slot></slot>
    </el-steps>
  </div>
</template>

<script>
export default {
  name: 'mySteps',
  props: {
    active: Number,
  },
};
</script>

<style lang="less" scoped>
@stepsActiveColor: #1890ff;
@stepsColor: rgba(0, 0, 0, 0.15);
@stepsHeight: 29px;

.my-steps::v-deep {
  .el-step {
    position: relative;
    overflow: hidden;
    height: @stepsHeight;
    .el-step__head {
      position: absolute;
      .vCenter();
      .el-step__icon {
        border: 1px solid;
        .el-step__icon-inner {
          font-weight: normal;
        }
      }
      &.is-wait {
        border-color: @stepsColor;
      }
      &.is-success,
      &.is-process {
        color: @stepsActiveColor;
        border-color: @stepsActiveColor;
        .el-step__icon {
          color: #ffffff;
          background-color: @stepsActiveColor;
        }
      }
      .el-step__icon {
        width: @stepsHeight;
        height: @stepsHeight;
      }
      .el-step__line {
        top: auto;
        height: 1px;
        left: 130px;
        right: 15px;
        background: #e9e9e9;
      }
    }
    .el-step__main {
      position: absolute;
      left: 37px;
      height: 100%;
      width: 999px;
      .vCenter();
      .el-step__title {
        height: 22px;
        font-size: 15px;
        font-weight: 500;
        color: rgba(0, 0, 0, 0.45);
        line-height: 22px;
        &.is-process,
        &.is-success {
          color: rgba(0, 0, 0, 0.85);
        }
      }
    }
    .el-step__description {
      margin: 0;
    }
    &:last-of-type {
      flex-shrink: 1;
      flex-basis: 23% !important;
    }
  }
}
</style>
