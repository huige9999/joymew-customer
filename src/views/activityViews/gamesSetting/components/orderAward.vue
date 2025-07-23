<template>
  <div class="orderAward" v-loading="isLoading">
    <!-- 标题区域 -->
    <div class="title-text">
      调整奖项顺序:
      <span>(拖动奖项以调整顺序)</span>
    </div>
    <!-- 调整顺序区域 -->
    <div class="order-change">
      <draggable :list="awardListUI" class="list-group" ghost-class="ghost">
        <!-- 奖项列表 -->
        <div class="award-item" v-for="(award, index) in awardListUI" :key="award.cusaward_id">
          <span class="num">{{ index + 1 }}、</span>
          <img :src="award.piclink" />
          <span class="awardname">{{ award.awardname }}</span>
        </div>
      </draggable>
    </div>
    <!-- 按钮区域 -->
    <div class="btn-group">
      <el-button type="primary" class="save-btn" @click="saveOrder">
        &nbsp;&nbsp;保存&nbsp;&nbsp;
      </el-button>
      <el-button type="info" class="cancel-btn" @click="cancel">&nbsp;&nbsp;取消&nbsp;&nbsp;</el-button>
    </div>
  </div>
</template>
<script>
import draggable from 'vuedraggable';
import { reqOrderAward } from '@/api/setting/activitySetting/gameSetting';

// 暂存顺序调整前的奖项列表
const oldAwardList = [];
export default {
  name: 'orderAward',
  components: {
    draggable,
  },
  props: {
    awardList: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      awardListUI: [],
      isLoading: false,
    };
  },
  created() {
    this.initUIData();
    this.tempSaveAwardList();
  },
  methods: {
    async saveOrder() {
      const hasOrderChange = this.getAwardOrderIsChange();
      console.log('改变了奖项顺序？:', hasOrderChange);
      if (hasOrderChange) {
        const newlist = this.awardListUI.map((item) => item.cusaward_id);
        console.log(newlist);
        try {
          this.isLoading = true;
          await reqOrderAward(newlist);
          this.isLoading = false;
          this.$emit('onRefreshList');
          this.$message.success('顺序修改成功!');
        } catch (err) {
          console.log(err);
          this.$message.error('顺序修改失败!');
        }
      }
      this.cancel();
    },
    cancel() {
      this.$emit('onHideOrderAwardDialog');
    },
    initUIData() {
      this.awardListUI = [...this.awardList];
    },
    tempSaveAwardList() {
      oldAwardList.splice(0);
      oldAwardList.push(...this.awardList);
      console.log('顺序调整前的奖项列表：', oldAwardList);
    },
    /**
     * 判断是否调整了奖项顺序
     * @returns {boolean} true: 调整了奖项顺序; false: 未调整
     */
    getAwardOrderIsChange() {
      let flag = false;
      // 比较oldAwardList和awardListUI中的每一项
      let index = 0;
      while (oldAwardList[index] && this.awardListUI[index]) {
        if (oldAwardList[index].cusaward_id !== this.awardListUI[index].cusaward_id) {
          flag = true;
          break;
        }
        index++;
      }
      return flag;
    },
  },
};
</script>
<style lang="less" scoped>
.title-text {
  font-size: 20px;
  color: #42474e;
  margin-bottom: 40px;
  span {
    font-size: 14px;
  }
}
.order-change::v-deep {
  .ghost {
    opacity: 0.5;
    background: #c8ebfb;
  }
  .list-group {
    display: flex;
    width: 100%;
    flex-wrap: wrap;
    gap: 20px;
    .award-item {
      display: flex;
      align-items: center;
      font-size: 12px;
      color: #606266;
      img {
        width: 48px;
        height: 31px;
      }
      .awardname {
        color: rgb(255, 98, 96);
        margin-left: 5px;
        font-size: 14px;
      }
    }
  }
}
.btn-group {
  padding-left: 143px;
  margin-top: 30px;
  padding-bottom: 40px;
  .save-btn,
  .cancel-btn {
    padding: 10px 40px;
  }
  .cancel-btn {
    margin-left: 30px;
  }
}
</style>
