<template>
  <sub-page>
    <div class="getPhoneNumber-container">
      <main-card style="min-height: 700px">
        <card-top-info title="获取手机号"></card-top-info>
        <p class="tip">在这里，你可以设置是否在签到时获取用户手机号</p>
        <div class="mainContent">
          <label class="key">开关</label>
          <el-switch v-model="switchStatus" inactive-color="#eaeaea" @change="changeSwitch" active-value="1" inactive-value="0"></el-switch>
        </div>
      </main-card>
    </div>
  </sub-page>
</template>
<script>
import SubPage from '@/components/subPage';
import MainCard from '@/components/mainCard';
import CardTopInfo from '@/components/cardTopInfo';
import { phoneSwitch, getWishList } from '@/api/setting/setting';

export default {
  name: 'getPhone',
  components: {
    SubPage,
    MainCard,
    CardTopInfo,
  },
  mounted() {},
  data() {
    return {
      switchStatus: false,
    };
  },
  created() {
    this.requestStatus();
  },
  methods: {
    // 获取开启状态信息
    requestStatus() {
      getWishList({ splid: this.$store.state.liveId }).then((res) => {
        console.log(res, 'wishList-----');
        this.switchStatus = res.data.live.forcephone;
      });
    },
    // 设置状态信息
    changeSwitch(status) {
      console.log(status);
      const params = {
        // liveId: this.$store.state.liveId,
        // is_force_phone: status,
        splid: this.$store.state.liveId,
        forcephone: status,
      };
      phoneSwitch(params).then((res) => {
        console.log(res, 'phoneSwitch-----');
      });
    },
  },
};
</script>
<style lang="less" scoped>
.tip {
  font-size: 16px;
  margin-top: 5px;
  padding-left: 40px;
}
.mainContent {
  padding-top: 34px;
  padding-left: 40px;
  .key {
    font-size: 17px;
    margin-right: 6px;
  }
}
</style>
