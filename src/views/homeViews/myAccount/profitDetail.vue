<!--收益明细-->
<template>
  <sub-page class="profitDetail">
    <content-header>
      <header-icons :exists="['totalProfit', 'canWithDraw', 'withdrawal', 'profit']" />
    </content-header>
    <main-card>
      <my-table style="height: 100%">
        <el-table
          :data="tableData"
          header-row-class-name="table-header"
          v-loading="tableLoading"
          style="width: 100%"
        >
          <!--          <el-table-column-->
          <!--              prop="title"-->
          <!--              label="活动标题"-->
          <!--              header-align="left"-->
          <!--              min-width="100"-->
          <!--              class-name="column-header"-->
          <!--          >-->
          <!--          </el-table-column>-->
          <el-table-column prop="time" label="活动时间" align="center" min-width="100"></el-table-column>
          <!--          <el-table-column-->
          <!--              prop="type"-->
          <!--              label="活动类型"-->
          <!--              align="center"-->
          <!--          >-->
          <!--          </el-table-column>-->
          <el-table-column prop="totalIncome" label="总收益" align="center"></el-table-column>
          <el-table-column prop="invitationIncome" label="邀请收益" align="center"></el-table-column>
          <el-table-column prop="redPacketIncome" label="红包收益" align="center"></el-table-column>
          <el-table-column prop="presentIncome" label="礼物收益" align="center"></el-table-column>
          <!-- <el-table-column prop="zyzIncome" label="扭一扭收益" align="center"></el-table-column> -->
          <el-table-column prop="earningGhbq" label="红包墙收益" align="center"></el-table-column>
          <el-table-column prop="earningRace" label="争分夺秒收益" align="center"></el-table-column>

          <el-table-column prop="boxIncome" label="开宝箱收益" align="center"></el-table-column>
          <el-table-column prop="earningSuper" label="全屏特效" header-align="center" align="center"></el-table-column>
          <!--          <el-table-column-->
          <!--            label="操作"-->
          <!--            header-align="center"-->
          <!--            align="center"-->
          <!--          >-->
          <!--            <template>-->
          <!--              <span class="blue-text">明细</span>-->
          <!--            </template>-->
          <!--          </el-table-column>-->
        </el-table>
      </my-table>
      <el-pagination
        background
        layout="prev, pager, next"
        @current-change="changePage"
        :page-size="showCount"
        :total="totalCount"
        class="my-pagination"
        hide-on-single-page
      />
    </main-card>
  </sub-page>
</template>

<script>
import SubPage from '@/components/subPage';
import MyTable from '@/components/myTable';
import MainCard from '@/components/mainCard';
import ContentHeader from '@/layout/home/components/header/contentHeader';
import HeaderIcons from '@/layout/home/components/header/headerIcons';
import setTableData from '@/mixins/setTableData';

import { getProfitList } from '@/api/app/account';
import messageMixin from '@/mixins/messageMixin';

export default {
  mixins: [setTableData, messageMixin],
  name: 'profitDetail',
  components: {
    HeaderIcons, ContentHeader, MainCard, MyTable, SubPage,
  },
  data() {
    return {
      tableData: [],
      tableLoading: true,
      showCount: 10,
      totalCount: 1,
      currentPage: 1,
    };
  },
  methods: {
    changePage(val) {
      this.currentPage = val;
      this.getSinglePageInfo();
    },
    setTableInfo(data) {
      this.tableData.push({
        // time: data.current_day,
        // totalIncome: data.total_income,
        // invitationIncome: data.share_income,
        // redPacketIncome: data.game_kdhb_income,
        // presentIncome: data.gift_income,
        // zyzIncome: data.game_dzp_income,
        // gameIncome: data.game_profit,
        // boxIncome: data.game_zjd_income,
        time: data.update_date,
        totalIncome: data.earning_total,
        invitationIncome: data.earning_giftshare,
        redPacketIncome: data.earning_gkdhb,
        presentIncome: data.earning_gift,
        zyzIncome: data.earning_gwheel,
        gameIncome: data.gprofit,
        boxIncome: data.earning_gegg,
        earningSuper: data.earning_super,
        earningGhbq: data.earning_ghbq,
        earningRace: data.earning_race,

      });
    },
    formatData(res) {
      return res.money_details;
    },
    getProfit_axios() {
      return getProfitList({
        showCount: this.showCount,
        currentPage: this.currentPage,
        request_from_page: 'app/myAccount/profitDetail',
      })
        .then((response) => {
          if (response.code !== 200) {
            this.alertError('获取数据失败');
            console.log(response);
            return Promise.reject();
          }

          return response.data;
        })
        .catch(() => Promise.reject());
    },
  },
  created() {
    // 必须设置相应函数名称
    this.init({
      getTableDataFuncName: 'getProfit_axios', // axios函数名
      setTableDataFuncName: 'setTableInfo', // 填入表格的函数名
      tableLoadingVar: 'tableLoading', // v-loading变量名
      // firstLoadFuncName: 'firstLoad', // 首次请求回调函数名
      dataListName: 'tableData', // 表格数据名
      formatDataFuncName: 'formatData', // data -> datalist 映射函数
    });
  },
};
</script>

<style lang='less' scoped>
.profitDetail {
  .el-table::v-deep {
    .column-header {
      padding-left: 20px;
    }
  }
}
</style>
