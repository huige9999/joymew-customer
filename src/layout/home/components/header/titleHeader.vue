<template>
  <content-header class="title-header">
    <p class="title">{{ title }}<slot name="titleTip"></slot></p>
    <slot></slot>
  </content-header>
</template>

<script>
import ContentHeader from '@/layout/home/components/header/contentHeader';

export default {
  name: 'titleHeader',
  components: { ContentHeader },
  props: {
    title: String,
  },
};
</script>

<style lang="less" scoped>
.title-header{
  padding-left: 22px;
  padding-right: 22px;
  padding-bottom: 25px;
  padding-top: 5px;
  display: flex;
  .title{
    height: 25px;
    font-size: 19px;
    font-weight: 500;
    color: rgba(0, 0, 0, 0.85);
    line-height: 25px;
  }
}
</style>
