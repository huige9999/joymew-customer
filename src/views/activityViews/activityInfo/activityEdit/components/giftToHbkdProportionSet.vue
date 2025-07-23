<template>
  <div class="form-item">
    <span>开启"礼物进红包口袋"功能:</span>
    <el-switch
      v-model="proporSwitch"
      active-value="1"
      inactive-value="0"
      @change="onProporSwitchChange"
    ></el-switch>
    <span
      class="detailValue"
      v-show="proporSwitch === '1'"
      @click="dialogVisible = true"
    >
      "礼物进红包口袋" 比例：{{ propor }}%
    </span>
    <el-dialog
      :visible.sync="dialogVisible"
      title="礼物进入红包口袋比例"
      width="30vw"
      v-loading="isLoading"
      @close="closeDialog"
    >
      <div class="slider-wrap">
        <el-slider
          class="slider"
          v-model="propor"
          :min="50"
          :max="100"
          :format-tooltip="(val) => `${val}%`"
          show-input
        ></el-slider>
        <span class="unit">%</span>
      </div>
      <template slot="footer">
        <el-button @click="closeDialog">取 消</el-button>
        <el-button
          type="primary"
          @click="confirmPropor"
        >
          确 定
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { editActivityInfo } from '@/api/setting/activitySetting/activity';

// 礼物进红包口袋比例默认值
const DEFAULT_PROPR = 100;
// 根据礼物进红包口袋比例算出滑块值和开关状态
const computeProporAndSwitchByIsGiftToHbkd = (isGiftToHbkd) => {
  const proporSwitch = isGiftToHbkd === '0' ? '0' : '1';
  const propor = isGiftToHbkd === '0' ? DEFAULT_PROPR : isGiftToHbkd * 100;
  return {
    proporSwitch,
    propor,
  };
};
// 根据滑块值和开关状态算出红包口袋比例
const computeIsGiftToHbkdByPorporAndSwitch = (propor, proporSwitch) => {
  return proporSwitch === '0' ? '0' : String(propor / 100);
};
export default {
  data() {
    return {
      proporSwitch: '0',
      dialogVisible: false,
      propor: DEFAULT_PROPR,
      isLoading: false,
    };
  },
  props: {
    isGiftToHbkd: String,
  },
  watch: {
    isGiftToHbkd(newVal) {
      // loading状态表示更新了界面数据
      if (this.isLoading) {
        this.savePropor(newVal)
          .then(() => {
            this.isLoading = false;
            this.dialogVisible = false;
          })
          .catch((err) => {
            console.log(err);
            this.$message.error('修改失败!');
            this.dialogVisible = false;
            this.isLoading = false;
          });
      } else {
        // 否则表示初始化界面数据
        const { proporSwitch, propor } = computeProporAndSwitchByIsGiftToHbkd(newVal);
        this.updateViewData(proporSwitch, propor);
      }
    },
  },
  methods: {
    confirmPropor() {
      this.isLoading = true;
      this.notifyUpdateIsGiftToHbkd();
    },
    closeDialog() {
      // 还原界面值
      const { proporSwitch, propor } = computeProporAndSwitchByIsGiftToHbkd(this.isGiftToHbkd);
      this.updateViewData(proporSwitch, propor);
      // 关闭弹窗
      this.dialogVisible = false;
    },
    updateViewData(proporSwitch, propor) {
      if (this.proporSwitch !== proporSwitch) {
        this.proporSwitch = proporSwitch;
      }

      if (this.propor !== propor) {
        this.propor = propor;
      }
    },
    async onProporSwitchChange() {
      if (this.proporSwitch === '1') {
        this.dialogVisible = true;
      } else {
        this.isLoading = true;
        this.notifyUpdateIsGiftToHbkd();
      }
    },
    async savePropor(propor) {
      const res = await editActivityInfo({
        is_gift_to_hbkd: propor,
      });
      if (res.code === 200) {
        this.$message({
          type: 'success',
          message: '修改成功',
        });
      }
    },
    // 通知更新isGiftToHbkd
    notifyUpdateIsGiftToHbkd() {
      const tmpIsGiftToHbkd = computeIsGiftToHbkdByPorporAndSwitch(this.propor, this.proporSwitch);
      this.$emit('update:isGiftToHbkd', tmpIsGiftToHbkd);
    },
  },
};
</script>

<style lang="less" scoped>
.form-item {
  margin-bottom: 28px;
  margin-top: 10px;
  display: flex;
  width: 100%;
  justify-content: space-between;
  font-size: 13px;
  color: #262626;
  position: relative;
  .detailValue {
    color: #409eff;
    position: absolute;
    right: 100px;
    cursor: pointer;
  }
  .slider-wrap {
    display: flex;
    align-items: center;
    .slider {
      width: 20vw;
    }
    .unit {
      font-size: 0.8vw;
      font-weight: 500;
      color: #333333;
      margin-left: 0.3vw;
    }
  }
}
</style>
