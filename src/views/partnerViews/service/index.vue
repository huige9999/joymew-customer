<template>
    <keep-alive :include="cachedTags">
        <router-view :key="key"/>
    </keep-alive>
</template>

<script>
export default {
  name: 'PartnerService',
  data() {
    return {
    };
  },
  computed: {
    key() {
      return this.$route.name;
    },
    cachedTags() {
      const { caches } = this.$store.state.partner;
      return caches.join(',');
    },

  },

};
</script>
