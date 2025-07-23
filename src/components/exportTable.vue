<template>
  <!-- 导出表 -->
  <div class="exportTable-container">
    <el-button type="primary" size="small" icon="el-icon-upload" @click="downLoad"> {{ text }}</el-button>
  </div>
</template>
<script>
export default {
  name: 'exportTable',
  props: {
    text: {
      type: String,
      default: '导出报表',
    },
    URL: {
      type: String,
      default: '#',
    },
  },
  methods: {
    downLoad() {
      if (this.$route.path === '/app/homeTql' && this.URL === '#') {
        this.$message.error('请选择要导出报表的数据项!');
      } else {
        window.open(this.URL);
      }
    },
  },
};
</script>
<style lang="less" scoped>
.exportTable-container {
  display: flex;
  justify-content: flex-end;
  padding: 12px 50px;
}
.simple {
  color: #fff;
  &:visited {
    color: #fff;
  }
  &:active {
    color: #fff;
  }
  &:hover {
    color: #fff;
  }
  &:focus {
    color: #fff;
  }
}
</style>
