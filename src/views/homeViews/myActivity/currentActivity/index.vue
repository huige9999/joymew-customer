<template>
  <main-page :is-active="true" :activity-type="2" />
</template>

<script>
import MainPage from '@/views/homeViews/myActivity/components/activityMainPage';

export default {
  name: 'currentActivity',
  components: { MainPage },
  methods: {},
};
</script>

<style scoped lang="less">

</style>
