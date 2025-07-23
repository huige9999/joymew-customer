<template>
  <main-page
      :is-active="true"
      :activity-type="5"
  />
</template>

<script>
import MainPage from '@/views/homeViews/myActivity/lowerLevelActivity/components/lowerLevelActivityMainPage';

export default {
  name: 'lowerLevelActivity',
  components: { MainPage },
};
</script>

<style scoped>

</style>
