<!--幸运夺宝-->
<template>
  <sub-page>
    <div class="swing-setting-container">
      <main-card>
        <card-top-info title="幸运夺宝设置"></card-top-info>
        <div class="setting-box">
          <div class="game-time">
            <div>
              <span style="margin-right: 20px">购买价格:</span>
              <el-input-number
                v-model="purchasePrice"
                controls-position="right"
                :min="1"
                :max="50"
                :precision="2"
                :step="1"
              ></el-input-number>
              <span style="margin-left: 15px">元</span>
            </div>
          </div>
          <div class="submit-btn">
            <el-button type="primary" @click="submitSetting">提交</el-button>
          </div>
        </div>
      </main-card>
    </div>
    <div></div>
  </sub-page>
</template>

<script>
import SubPage from '@/components/subPage';
import MainCard from '@/components/mainCard';
import CardTopInfo from '@/components/cardTopInfo';
import { getActivity } from '@/api/setting/activitySetting/theme';
import { editActivityMsg } from '@/api/setting/activitySetting/activity';

export default {
  name: 'xydbCustom',
  data() {
    return {
      // 购买价格
      purchasePrice: 0,
    };
  },
  created() {
    this.initData();
  },
  components: {
    SubPage,
    MainCard,
    CardTopInfo,
  },
  methods: {
    submitSetting() {
      console.log(this.purchasePrice, typeof this.purchasePrice);
      editActivityMsg({
        splid: this.$store.state.liveId,
        lucku_money_one: this.purchasePrice.toString(),
      }).then((res) => {
        console.log('提交修改', res);
        this.initData();
        this.$message({
          type: 'success',
          message: '修改成功',
        });
      });
    },
    initData() {
      getActivity({ splid: this.$store.state.liveId }).then((res) => {
        console.log('活动信息:', res.data);
        this.hasPurchase = res.data.game_nd_switch === '1';
        this.purchasePrice = res.data.lucku_money_one;
      });
    },
  },
};
</script>

<style lang="less" scoped>
.swing-setting-container {
  .setting-box {
    display: flex;
    padding-bottom: 40px;
    padding-left: 20px;
    & > div {
      font-size: 14px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: rgba(0, 0, 0, 0.85);
    }
    .game-time {
      margin-right: 40px;
    }
  }
}
</style>
