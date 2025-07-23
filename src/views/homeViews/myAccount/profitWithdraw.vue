<!--收益提现-->
<template>
  <sub-page class="profit-withdraw">
    <content-header>
      <header-icons :exists="['totalProfit', 'canWithDraw', 'withdrawal', 'profit']"/>
    </content-header>
    <main-card>
      <el-radio-group
        class="el-radio-group"
        v-model="radio"
      >
        <el-radio-button :label="true">提现申请</el-radio-button>
        <el-radio-button :label="false">提现记录</el-radio-button>
      </el-radio-group>
      <with-draw-apply v-if="radio"></with-draw-apply>
      <winning-record v-if="!radio"></winning-record>
    </main-card>
  </sub-page>
</template>

<script>
import SubPage from '@/components/subPage';
import ContentHeader from '@/layout/home/components/header/contentHeader';
import HeaderIcons from '@/layout/home/components/header/headerIcons';
import MainCard from '@/components/mainCard';
import WinningRecord from '@/views/activityViews/activityData/winningRecord';

export default {
  name: 'profitWithdraw',
  components: {
    WinningRecord, MainCard, HeaderIcons, ContentHeader, SubPage,
  },
  mounted() {},
  data() {
    return {
      radio: true,
    };
  },
};
</script>

<style lang='less' scoped>
.profit-withdraw {
  .main-card{
    padding: 11px 17px 11px;
  }
}
</style>
