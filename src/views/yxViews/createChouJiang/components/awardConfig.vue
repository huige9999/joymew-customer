<template>
  <div class="award-cpn">
    <div class="cpn-header">
      <div class="header-title">请设置活动奖项</div>
      <div class="sort-btn" @click="showResort"><img src="~@/assets/image/yx/resort-icon.png" alt="" />调整顺序</div>
      <div class="award-tab">
        <div class="tab-container">
          <div
            class="tab-item"
            :class="{ activeTab: index === currentTabIndex }"
            v-for="(award, index) in awardItems"
            :key="award.award_level"
            @click="changeTab(index)"
          >
            {{ wordMap[index].txt }}
          </div>
        </div>
        <div class="tab-handler">
          <div class="handler-btn" @click="deleteAward">-</div>
          <div class="handler-btn" @click="addAward">+</div>
        </div>
      </div>
    </div>
    <div class="award-config-form">
      <div class="form-title">{{ `基本选项 · ${wordMap[currentTabIndex].txt}` }}</div>
      <el-form ref="awardConfig" label-position="right" :rules="rules" label-width="130px" :model="awardItems[currentTabIndex]">
        <el-form-item label="奖项等级：" prop="award_level">
          <el-input v-model="awardItems[currentTabIndex].award_level" placeholder="输入奖项等级" disabled></el-input>
        </el-form-item>
        <el-form-item label="奖项名称：" prop="award_name">
          <el-input v-model="awardItems[currentTabIndex].award_name" placeholder="输入奖项名称"></el-input>
        </el-form-item>
        <el-form-item label="优惠内容：" required>
          <template #default>
            <el-form :inline="true" :rules="rules" ref="contentForm" :model="awardItems[currentTabIndex]" class="my-form">
              <el-form-item class="my-form-item" prop="award_condition">
                <div class="use-part">
                  满<el-input class="content-input" v-model="awardItems[currentTabIndex].award_condition"></el-input>元
                </div>
              </el-form-item>
              <el-form-item class="my-form-item" prop="award_discount">
                <div class="use-part">
                  减<el-input class="content-input" v-model="awardItems[currentTabIndex].award_discount"></el-input>元
                </div>
              </el-form-item>
            </el-form>
          </template>
        </el-form-item>
        <el-form-item label="中奖概率：" class="my-form-item" prop="award_probability">
          <el-input class="content-input" v-model="awardItems[currentTabIndex].award_probability"></el-input>%
        </el-form-item>
        <el-form-item label="奖项数量：" class="my-form-item" prop="award_count">
          <el-input class="content-input" v-model="awardItems[currentTabIndex].award_count"></el-input>个
        </el-form-item>
      </el-form>
      <div class="btn-container">
        <div class="next-btn" @click="addNextAward">添加奖项</div>
      </div>
    </div>
  </div>
</template>

<script>
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
  name: 'awardConfig',
  props: {
    config: {
      type: Array,
    },
  },
  data() {
    return {
      wordMap,
      currentTabIndex: 0,
      awardItems: [
        {
          award_name: '优惠券',
          award_level: '一等奖',
          award_condition: '1000',
          award_discount: '100',
          award_probability: '20',
          award_count: '100',
        },
      ],
      prize_json: [],
      rules: {
        award_level: [{ required: true, message: '请输入奖项等级', trigger: 'blur' }],
        award_name: [{ required: true, message: '请选择奖项名称', trigger: 'blur' }],
        award_condition: [{ required: true, message: '请输入满足金额', trigger: 'blur' }],
        award_discount: [{ required: true, message: '请输入优惠金额', trigger: 'blur' }],
        award_probability: [{ required: true, message: '请输入该奖项中奖概率', trigger: 'blur' }],
        award_count: [{ required: true, message: '请输入该奖项数量', trigger: 'blur' }],
      },
    };
  },
  mounted() {
    if (this.$props.config && this.$props.config.length) {
      this.awardItems.splice(0);
      this.$props.config.forEach((award) => {
        this.awardItems.push(award);
      });
    }
  },
  watch: {
    config(newValue) {
      if (!newValue || !newValue.length) return;
      this.awardItems.splice(0);
      newValue.forEach((award) => {
        this.awardItems.push(award);
      });
    },
  },
  methods: {
    changeTab(index) {
      console.log('index', index);
      if (this.currentTabIndex === index) return;
      // 判断当前奖项是否填写完整，
      this.$refs.awardConfig.validate((valid) => {
        if (valid) {
          // 修改存储的数据
          this.currentTabIndex = index;
        } else {
          this.$message.error('请先完成当前奖项的设置');
        }
      });
    },
    addAward() {
      if (!this.awardItems || this.awardItems.length >= 6) {
        this.$message.error('最多只能设置6个奖项');
        return;
      }
      // 添加奖项数据
      this.awardItems.push({
        award_name: '优惠券',
        award_level: this.wordMap[this.awardItems.length].award,
        award_condition: '1000',
        award_discount: '100',
        award_probability: '20',
        award_count: '100',
      });
    },
    deleteAward() {
      if (!this.awardItems || this.awardItems.length === 1) {
        this.$message.error('奖项不能少于1个');
        return;
      }
      // 如果当前active的是最后一个标签，则修改当前索引
      if (this.currentTabIndex === this.awardItems.length - 1) {
        this.changeTab(this.awardItems.length - 2);
      }
      this.awardItems = this.awardItems.slice(0, -1);
    },
    // 调整奖项顺序
    showResort() {
      this.$emit('showResort');
    },
    // 添加下一奖项
    addNextAward() {
      this.$refs.contentForm.validate(() => {
        this.$refs.awardConfig.validate((valid) => {
          if (valid) {
            this.addAward();
            this.changeTab(this.awardItems.length - 1);
          } else {
            this.$message.error('请先完成当前奖项的设置');
          }
        });
      });
    },
  },
};
</script>

<style lang="less" scoped>
.award-cpn {
  width: 100%;
  .cpn-header {
    width: 100%;
    height: 90px;
    padding: 0 40px;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    background-color: #f6f6f6;
    position: relative;

    &::before,
    &::after {
      content: '';
      display: table;
      clear: both;
    }

    .header-title {
      width: 100%;
      margin-top: 12px;
      color: #333333;
      font-size: 14px;
      cursor: default;
    }

    .sort-btn {
      display: flex;
      align-items: center;
      position: absolute;
      top: 24px;
      right: 43px;
      font-size: 12px;
      color: #999999;
      letter-spacing: 2px;
      cursor: pointer;
      img {
        width: 16px;
        margin-right: 7px;
      }
    }
    .award-tab {
      width: 100%;
      flex: 1;
      margin-top: 20px;
      display: flex;
      align-items: center;
      justify-content: space-between;

      .tab-container {
        flex: 1;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: flex-start;

        .tab-item {
          flex: 1;
          max-width: 123px;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          letter-spacing: 2px;
        }
        .activeTab {
          border-radius: 5px 5px 0 0;
          background-color: #fff;
          color: #1e87f0;
          font-weight: bold;
        }
      }

      .tab-handler {
        display: flex;
        align-items: center;

        .handler-btn {
          width: 23px;
          height: 23px;
          margin-right: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: rgba(36, 154, 255, 0.2);
          border: 1px solid #249aff;
          box-sizing: border-box;
          color: #249aff;
          line-height: 21px;
          cursor: pointer;
        }
      }
    }
  }
  .award-config-form {
    width: 100%;
    padding: 40px;
    box-sizing: border-box;

    .form-title {
      margin-bottom: 40px;
      color: #333333;
      font-size: 18px;
      font-weight: bold;
      letter-spacing: 2px;
    }

    .my-form {
      display: flex;
      .my-form-item {
        width: 100%;
        display: flex;

        .use-part {
          width: 100%;
          display: flex;
          justify-content: space-between;
          .content-input {
            /deep/.el-input__inner {
              width: 80px;
              height: 32px;
              margin: 0 10px;
            }
          }
        }
      }
    }

    .my-form-item {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      /deep/.el-form-item__content {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        margin-left: 0 !important;
      }
    }
    .content-input {
      width: 100%;
      display: flex;
      align-items: center;
      /deep/.el-input__inner {
        width: 70px;
        height: 32px;
        margin-right: 10px;
      }
    }
  }
  .btn-container {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    .next-btn {
      width: 118px;
      height: 44px;
      margin-top: 44px;
      border-radius: 4px;
      background-color: #249aff;
      color: #ffffff;
      line-height: 44px;
      font-size: 16px;
      text-align: center;
      cursor: pointer;
    }
  }
}
</style>
