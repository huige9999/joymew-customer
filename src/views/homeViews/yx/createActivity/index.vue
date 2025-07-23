<template>
  <div class="create-activity">
    <div class="page-title">创建活动</div>
    <div class="type-container">
      <div class="type-item" v-for="item in activityItems" :key="item.name">
        <activity-item :activity="item"></activity-item>
      </div>
    </div>
  </div>
</template>

<script>
import activityItem from './components/activityItem.vue';

export default {
  name: 'createActivity',
  components: {
    activityItem,
  },
  data() {
    return {
      activityItems: [
        {
          type: '1',
          name: '猜灯谜',
        },
        {
          type: '2',
          name: '幸运大转盘',
        },
        {
          type: '3',
          name: '到店礼',
        },
      ],
    };
  },
  mounted() {},
  methods: {},
};
</script>

<style lang="scss" scoped>
.create-activity {
  width: 100%;
  padding: 32px 20px;
  box-sizing: border-box;

  .page-title {
    margin-bottom: 20px;
    color: #1e87f0;
    font-size: 24px;
    font-weight: 500;
  }

  .type-container {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    &::before,
    &::after {
      content: '';
      display: table;
      clear: both;
    }

    .type-item {
      margin-top: 20px;
      margin-left: 20px;

      &:nth-of-type(5n),
      &:first-of-type {
        margin-left: 0;
      }

      &:nth-of-type(-n + 4) {
        margin-top: 0;
      }
    }
  }
}
</style>
