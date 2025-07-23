<template>
  <div class="resort-page" @mousewheel.prevent.stop>
    <div class="resort-container">
      <div class="dialog-header">
        <div class="header-title">调整奖项顺序<span>（拖拽可调整顺序）</span></div>
        <div class="close-icon" @click="close"></div>
      </div>
      <div class="sort-container">
        <div class="left">
          <div class="sort-item" v-for="(award, index) in copyData" :key="index">
            <div class="item-left">{{ wordMap[index].txt }}</div>
            <div class="split-part">:</div>
          </div>
        </div>
        <Container @drop="onDrop">
          <Draggable v-for="(award, index) in copyData" :key="index">
            <div class="sort-item">
              <div class="item-data" :draggable="true">{{ award.award_name }}</div>
            </div>
          </Draggable>
        </Container>
      </div>
      <div class="tips">ps：活动发布后，奖项顺序将无法调整</div>
      <div class="handler">
        <div class="handler-btn" @click="changeSort">确定</div>
        <div class="handler-btn" @click="close">取消</div>
      </div>
    </div>
  </div>
</template>

<script>
import { Container, Draggable } from 'vue-smooth-dnd';

const wordMap = {
  0: {
    txt: '奖项一',
    award: '一等奖',
  },
  1: {
    txt: '奖项二',
    award: '二等奖',
  },
  2: {
    txt: '奖项三',
    award: '三等奖',
  },
  3: {
    txt: '奖项四',
    award: '四等奖',
  },
  4: {
    txt: '奖项五',
    award: '五等奖',
  },
  5: {
    txt: '奖项六',
    award: '六等奖',
  },
};
export default {
  name: 'resortCpn',
  props: {
    awardData: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  components: {
    Container,
    Draggable,
  },
  data() {
    return {
      wordMap,
      copyData: [],
    };
  },
  mounted() {
    // 拷贝父组件数据
    this.copyData = [...this.$props?.awardData];
  },
  methods: {
    close() {
      this.$emit('close');
    },
    onDrop(e) {
      this.copyData = this.applyDrag(this.copyData, e);
    },
    // 更新数据
    applyDrag(arr, { removedIndex, addedIndex }) {
      if (!removedIndex && !addedIndex) return arr;
      const result = [...arr];
      let itemToAdd;
      if (removedIndex || removedIndex === 0) {
        [itemToAdd] = result.splice(removedIndex, 1);
      }
      if (addedIndex || addedIndex === 0) {
        result.splice(addedIndex, 0, itemToAdd);
      }
      // 重新处理奖项名称
      result.map((item, index) => {
        if (item.award_level) {
          item.award_level = this.wordMap[index].award;
        }
        return item;
      });
      return result;
    },
    // 确定更新数据
    changeSort() {
      this.$emit('change', this.copyData);
      this.close();
    },
  },
};
</script>

<style lang="less" scoped>
.resort-page {
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 10;

  .resort-container {
    width: 786px;
    padding: 21px 30px 54px 30px;
    box-sizing: border-box;
    background-color: #fff;
    border-radius: 16px;
    display: flex;
    flex-direction: column;
    align-items: center;

    .dialog-header {
      width: 100%;
      margin-bottom: 48px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .header-title {
        color: rgba(0, 0, 0, 0.4);
        font-size: 28px;
        cursor: default;
        span {
          font-size: 20px;
        }
      }
      .close-icon {
        width: 24px;
        height: 24px;
        background-image: url('~@/assets/image/yx/close-icon.png');
        background-size: 100%;
        cursor: pointer;
      }
    }

    .sort-container {
      width: 100%;
      display: flex;
      // flex-direction: column;
      align-items: flex-start;
      .left {
        margin-left: 120px;
      }

      .sort-item {
        width: 100%;
        height: 52px;
        margin-bottom: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        .item-left {
          padding: 8px 23px;
          box-sizing: border-box;
          background-color: rgba(217, 217, 217, 0.3);
          border-radius: 8px;
          border: 2px solid #dee0e3;
          display: flex;
          align-items: center;
          color: #333333;
          font-size: 20px;
        }
        .split-part {
          margin: 0 16px;
        }

        .item-data {
          width: 313px;
          padding: 9px 41px 9px 16px;
          box-sizing: border-box;
          border: 2px solid #dee0e3;
          border-radius: 8px;
          color: rgba(0, 0, 0, 0.4);
          font-size: 20px;
          cursor: grab;
          overflow: hidden;
        }
      }
    }

    .tips {
      width: 100%;
      margin-bottom: 48px;
      padding-left: 120px;
      box-sizing: border-box;
      color: rgba(0, 0, 0, 0.4);
    }

    .handler {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      .handler-btn {
        width: 118px;
        height: 44px;
        color: #FFFFFF;
        border-radius: 4px;
        background-color: #64676B;
        line-height: 44px;
        text-align: center;
        cursor: pointer;
        &:first-of-type {
          background-color: #249AFF;
          margin-right: 27px;
        }
      }
    }
  }
}
</style>
