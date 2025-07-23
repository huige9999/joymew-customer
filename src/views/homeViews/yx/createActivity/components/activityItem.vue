<template>
  <div class="activity-item" @click="turnToConfig(activity.type)">
    <div class="banner-img" :class="{ bg2: String(activity.type) === '2', bg3: String(activity.type) === '3' }"></div>
    <div class="item-handler">
      <div class="item-name">{{ activity.name }}</div>
      <div class="add-icon"></div>
    </div>
  </div>
</template>

<script>
import { judgeIsCreateChou } from '@/api/yx/chouJiang.js';
import { judgeIsCreateDaodian } from '@/api/yx/daodian';

export default {
  name: 'activityItem',
  props: {
    activity: {
      type: Object,
      default() {
        return {
          type: '1',
          name: '猜灯谜',
        };
      },
    },
  },
  data() {
    return {};
  },

  mounted() {},

  methods: {
    async turnToConfig(type) {
      // 判断活动类型
      if (String(type) === '1') {
        this.$router.push({
          path: '/app/yxViews/main',
        });
        return;
      }
      // 是幸运大转盘的活动，或已经创建过了对应的活动，如果已经创建了，则进行弹窗操作
      if (String(type) === '2') {
        // 已有数据，弹窗提示
        const { data: res } = await judgeIsCreateChou();
        const { code } = res;
        if (!code || String(code) !== '0') {
          console.log('存在');
          this.$msgbox({
            title: '提示',
            message: '已存在一场幸运大转盘活动，再次创建并发布后，上一场活动将停用',
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            showCancelButton: true,
          })
            .then(() => {
              this.$router.push({
                path: '/app/yxChouJiang/chouJiang',
              });
            })
            .catch(() => {
              console.log('取消了');
            });
        } else {
          this.$router.push({
            path: '/app/yxChouJiang/chouJiang',
          });
        }
        return;
      }
      // 到店礼
      if (String(type) === '3') {
        const { data: res } = await judgeIsCreateDaodian('3');
        const { code } = res;
        if (String(code) !== '0') {
          console.log('存在', code);
          this.$msgbox({
            title: '提示',
            message: '已存在到店礼活动，再次创建并发布后，之前的活动将停用',
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            showCancelButton: true,
          })
            .then(() => {
              this.$router.push({
                name: 'daodian',
              });
            })
            .catch(() => {
              console.log('取消了');
            });
        } else {
          this.$router.push({
            name: 'daodian',
          });
        }
      }
    },
  },
};
</script>

<style lang="less" scoped>
@basePath: '~@/assets/image/yx/';
@addIcon: '@{basePath}add.png';
.activity-item {
  width: 330px;
  height: 255px;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #fff;
  cursor: pointer;

  .banner-img {
    width: 100%;
    height: 202px;
    background-image: url('@{basePath}banner.png');
    background-size: 100% 100%;
  }
  .bg2 {
    background-image: url('@{basePath}chou-banner.png');
    background-size: 100% 100%;
  }
  .bg3 {
    background-image: url('@{basePath}daodianli/daodian-bg.png');
    background-size: 100% 100%;
  }
  .item-handler {
    width: 100%;
    flex: 1;
    padding: 0 20px;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .add-icon {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: url(@addIcon) no-repeat;
      background-size: 100% 100%;
      cursor: pointer;
    }
  }
}
</style>
