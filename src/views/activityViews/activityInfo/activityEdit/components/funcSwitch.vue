<template>
  <div class="form-item">
    <span>{{ propLabel }}:</span>
    <el-switch
      v-model="funcSwitch"
      active-value="1"
      inactive-value="0"
      @change="onFuncSwitchChange"
    ></el-switch>
  </div>
</template>

<script>
const KEY_LABEL_MAP = {
  hide_gift_switch: {
    label: '关闭手机端发礼物',
  },
};

export default {
  model: {
    prop: 'funcSwitch',
    event: 'change',
  },
  props: {
    propKey: String,
    funcSwitch: {
      type: String,
      default: '0',
    },
  },
  computed: {
    propLabel() {
      return KEY_LABEL_MAP[this.propKey].label;
    },
  },
  watch: {},
  methods: {
    onFuncSwitchChange() {
      this.$emit('change', this.funcSwitch);
    },
  },
};
</script>

<style lang="less" scoped>
.form-item {
  margin-bottom: 28px;
  margin-top: 10px;
  display: flex;
  width: 100%;
  justify-content: space-between;
  font-size: 13px;
  color: #262626;
  position: relative;
}
</style>
