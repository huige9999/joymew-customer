<template>
  <div class="item">
    <img
      :src="itemInfo.cover"
      class="item-img"
      @click="previewMedia"
    />
    <el-checkbox :checked="itemInfo.checked" @change="handleChange" :key="itemInfo.checked">{{ itemInfo.answer }}</el-checkbox>
  </div>
</template>

<script>
export default {
  props: {
    itemInfo: {
      type: Object,
      default: () => ({
        id: '',
        cover: '',
        previewMedia: '',
        answer: '',
        option: '',
        checked: false,
      }),
    },
  },
  methods: {
    previewMedia() {
      this.$emit('preview', this.itemInfo);
    },
    handleChange() {
      this.$emit('update', this.itemInfo);
    },
  },
};
</script>

<style lang="less" scoped>
.item {
  width: 120px;
  cursor: pointer;
  .item-img {
    width: 100%;
    height: 60px;
    object-fit: cover;
  }
}
</style>
