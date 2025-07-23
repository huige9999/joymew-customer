<template>
  <sub-page class="cityPartnerIndex">
    <content-header>
      <header-icons
        :exists="['giftProfit', 'inviteNumber', 'totalProfit', 'sharesNumber']"
      />
    </content-header>
    <main-card >
      <div class="header">
        <el-radio-group
          class="el-radio-group"
          v-model="radio"
        >
          <el-radio-button :label="true">月度结算</el-radio-button>
          <el-radio-button :label="false">下级列表</el-radio-button>
        </el-radio-group>
        <div class="blue-text header-tip">
          结算规则：完成50场获得收益的5%，完成100场获得收益的8%，完成200场获得收益的12%
        </div>
      </div>
      <info-bar>
        <span>合伙人：小星星</span>
        <span>电话：13312345678</span>
        <span>邀请人数：887</span>
        <span>合伙人代码：a1234</span>
        <span>加入日：2020.08.21</span>
      </info-bar>
      <my-table>
        <monthlySettlement v-if="radio"></monthlySettlement>
        <subordinateList v-if="!radio"></subordinateList>
      </my-table>
    </main-card>
  </sub-page>
</template>
<script>
// 通用组件
import SubPage from '@/components/subPage';
import MyTable from '@/components/myTable';
import MainCard from '@/components/mainCard';
import ContentHeader from '@/layout/home/components/header/contentHeader';
import HeaderIcons from '@/layout/home/components/header/headerIcons';
import InfoBar from '@/components/infoBar';

// 页面组件
import monthlySettlement from '@/views/homeViews/cityPartner/components/monthlySettlement'; // 月度结算
import subordinateList from '@/views/homeViews/cityPartner/components/subordinateList';// 下级列表

export default {
  name: 'cityPartnerIndex',
  components: {
    InfoBar, subordinateList, monthlySettlement, HeaderIcons, ContentHeader, MainCard, MyTable, SubPage,
  },
  data() {
    return {
      radio: true,
    };
  },
};
</script>

<style lang='less' scoped>
.cityPartnerIndex {
  .main-card{
    padding: 11px 18px 21px;
    .header{
      display: flex;
      margin-bottom: 15px;
      .header-tip{
        margin: auto;
        margin-right: 0;
      }
    }
    .info-bar{
      margin-bottom: 14px;
      span{
        color: rgba(0, 0, 0, 0.65);
      }
    }
    .my-table{
      margin: 0;
    }
  }

}
</style>
