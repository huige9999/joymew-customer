<template>
  <main-page
      :is-active="false"
      :activity-type="1"
  />
</template>

<script>
import MainPage from '@/views/homeViews/myActivity/components/activityMainPage';

export default {
  name: 'completeActivity',
  components: { MainPage },
};
</script>

<style scoped>

</style>
