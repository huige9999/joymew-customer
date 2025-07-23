<template>
  <div class="content-header">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'contentHeader',
};
</script>

<style scoped>
.content-header{
  width: 100%;
  display: flex;
  background-color: #ffffff;
  box-shadow: 0 3px 9px 0 rgba(119, 119, 119, 0.1);
  border-radius: 4px;
}
</style>
