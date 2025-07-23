<template>
  <sub-page class="introduction">
    <main-card>
      <card-top-info title="邀请收益">
        <el-date-picker type="month"  @change="monthChange" placeholder="选择日期" style="margin-right: calc(100% - 420px);" v-model="date"> </el-date-picker>
      </card-top-info>

      <div class="IncomeList">
        <div class="IncomeItem" >
          <div class="main-item">
            <img :src="require('@/assets/image/partner/s1.png')" alt="" />
            <div class="income-item">
              <div class="income-title" style="color:#666666;font-size:14px">礼物总收入</div>
              <div class="count" style="color:#3BCACD;font-size:28px">{{presentTotalIncome}} <span class="unit" style="color:#666666;font-size:14px">元</span></div>
            </div>
          </div>
          <div class="js">
            <div class="title" style="font-size:16px;color:#666666">我的分成<span style="color:#1E87F0">10%</span>: <span style="margin-left:6px;font-size:24px;font-weight:800;color:#333333">{{giftShare}}</span>元</div>
          </div>
        </div>
        <div class="IncomeItem" >
          <div class="main-item">
            <img :src="require('@/assets/image/partner/s2.png')" alt="" />
            <div class="income-item">
              <div class="income-title" style="color:#666666;font-size:14px">开宝箱总收入</div>
              <div class="count" style="color:#FF7873;font-size:28px">{{boxTotalIncome}} <span class="unit" style="color:#666666;font-size:14px">元</span></div>
            </div>
          </div>
          <div class="js">
        <div class="title" style="font-size:16px;color:#666666">我的分成<span style="color:#1E87F0">10%</span>: <span style="margin-left:6px;font-size:24px;font-weight:800;color:#333333">{{boxshare}}</span>元</div>
          </div>
        </div>
        <div class="IncomeItem" >
          <div class="main-item">
            <img :src="require('@/assets/image/redPackageRain/redpackage-logo.png')" alt="" />
            <div class="income-item">
              <div class="income-title" style="color:#666666;font-size:14px">邀请总收入</div>
              <div class="count" style="color:#FB466C;font-size:28px">{{inviteTotalIncome}} <span class="unit" style="color:#666666;font-size:14px">元</span></div>
            </div>
          </div>
          <!-- <div class="js">
            <div class="title" style="font-size:16px;color:#666666">我的分成<span style="color:#1E87F0">12%</span>: <span style="margin-left:6px;font-size:24px;font-weight:800;color:#333333">1821</span>元</div>
          </div> -->
        </div>
      </div>
    </main-card>
    <main-card>
      <card-top-info title="下级收益明细">
        <!-- <span class="blue-text" style="margin-right: 18px">成为合伙人，每个月完成固定场次，享受1-2级团队收益8%的合伙人奖励</span> -->
      </card-top-info>
      <my-table class="my-table" style="height: 100%">
        <el-table :data="tableData" header-row-class-name="table-header" style="width: 100%">
          <!-- <el-table-column label="编号" header-align="center" align="center" min-width="80" class-name="column-header">
            <template slot-scope="scope">
              <span>{{ scope.$index + 1 }}</span>
            </template>
          </el-table-column> -->

          <el-table-column prop="emcee_name" label="姓名" header-align="center" align="center" min-width="130">
            <template slot-scope="scope">
              <el-avatar :size="22" :src="scope.row.avator"></el-avatar>
              <span style="margin-left: 5px; width: 130px; display: inline-block; text-align: centr">{{ scope.row.emcee_name }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="phonenumber" label="手机号" header-align="center" align="center" min-width="90">
            <template slot-scope="scope">
              <span style="margin-left: 5px; width: 90px; display: inline-block; text-align: centr">{{ scope.row.phonenumber }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="theme" header-align="center" align="center" label="活动标题" min-width="140">
            <template slot-scope="scope">
              <span style="margin-left: 5px; width: 160px; display: inline-block; text-align: centr">{{ scope.row.theme }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="using_date" header-align="center" align="center" label="活动时间" min-width="130">
            <template slot-scope="scope">
              <span style="margin-left: 5px; width: 130px; display: inline-block; text-align: centr">{{ scope.row.using_date }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="scenario" header-align="center" align="center" label="活动类型" min-width="60">
            <template slot-scope="scope">
              <span style="margin-left: 5px; width: 60px; display: inline-block; text-align: centr">{{ scope.row.banben }}</span>
            </template> </el-table-column>
          <!-- <el-table-column prop="shares" header-align="center" align="center" label="持股数"> </el-table-column> -->
          <el-table-column prop="pcu" header-align="center" align="center" label="签到人数">
            <template slot-scope="scope">
              <span style="margin-left: 5px; width: 60px; display: inline-block; text-align: centr">{{ scope.row.pcu }}</span>
            </template> </el-table-column>
          <el-table-column prop="gift" header-align="center" align="center" label="礼物">
            <template slot-scope="scope">
              <span style="margin-left: 5px; width: 60px; display: inline-block; text-align: centr">{{ scope.row.gift }}</span>
            </template> </el-table-column>
          <el-table-column prop="earning_gegg" header-align="center" align="center" label="开宝箱">
            <template slot-scope="scope">
              <span style="margin-left: 5px; width: 60px; display: inline-block; text-align: centr">{{ scope.row.earning_gegg }}</span>
            </template>
          </el-table-column>
        </el-table>
      </my-table>
      <el-pagination
        background
        layout="prev, pager, next"
        :total="totalResult"
        :page-size="20"
        @current-change="changePage"
        class="my-pagination">
      </el-pagination>
      <!-- <div class="join-button blue-background" @click="openInfoBox('', windowWeChat, { center: true })">立即加入</div> -->
    </main-card>
  </sub-page>
</template>

<script>
import SubPage from '@/components/subPage';
import MainCard from '@/components/mainCard';
import CardTopInfo from '@/components/cardTopInfo';
import MyTable from '@/components/myTable';
import messageBoxMixin from '@/mixins/messageBoxMixin';
import { getHhrInfo3 } from '@/api/cityPartner/citypartnerDetail';

// import HeaderIcons from '@/layout/home/components/header/headerIcons';

export default {
  mixins: [messageBoxMixin],
  name: 'cityPartnerIntroduction',
  components: {
    MyTable, CardTopInfo, MainCard, SubPage,
  },
  methods: {
    monthChange(val) {
      if (val === null) {
        getHhrInfo3().then((res) => {
          console.log(res);
          const { data } = res;
          this.presentTotalIncome = data.earning_giftshare_all;
          this.boxTotalIncome = data.earning_gbox_all;
          this.inviteTotalIncome = data.share_income;
          this.giftShare = data.earning_giftshare;
          this.boxshare = data.earning_gbox;
          this.tableData = data.list;
          this.totalPage = res.data.totalPage;
          this.totalResult = res.data.totalResult;
        });
      } else {
        console.log(val);
        const start = new Date(val);

        console.log(start.getFullYear());
        console.log(start.getMonth() + 1);
        let month = start.getMonth() + 1;
        if (month <= 9) {
          month = `0${month}`;
        }
        this.data = `${start.getFullYear()}-${month}`;
        console.log(this.data);
        getHhrInfo3(this.data, this.showCount, this.currentPage).then((res) => {
          console.log(res);
          const { data } = res;
          this.presentTotalIncome = data.earning_giftshare_all;
          this.boxTotalIncome = data.earning_gbox_all;
          this.inviteTotalIncome = data.share_income;
          this.giftShare = data.earning_giftshare;
          this.boxshare = data.earning_gbox;
          this.tableData = data.list;
          this.totalPage = res.data.totalPage;
          this.totalResult = res.data.totalResult;
        });
      }
    },
    changePage(val) {
      console.log(val);
      this.currentPage = val;
      getHhrInfo3(this.date, this.showCount, this.currentPage).then((res) => {
        console.log(res);
        this.tableData = res.data.list;
      });
    },
  },
  data() {
    return {
      // 总页数
      currentPage: 1,
      totalPage: '',
      totalResult: 0,
      showCount: 20,
      // 礼物总收入
      presentTotalIncome: '',
      // 开宝箱总收入
      boxTotalIncome: '',
      // 邀请总收入
      inviteTotalIncome: '',
      // 礼物分成
      giftShare: '',
      // 包厢分成
      boxshare: '',
      date: '',
      tableData: [],
      headerIconData: {
        keYongHb: 10,
        guoQiHb: 10,
        yiLingHb: 10,
      },
    };
  },
  created() {
    getHhrInfo3(this.date).then((res) => {
      console.log(res);
      const { data } = res;
      this.presentTotalIncome = data.earning_giftshare_all;
      this.boxTotalIncome = data.earning_gbox_all;
      this.inviteTotalIncome = data.share_income;
      this.giftShare = data.earning_giftshare;
      this.boxshare = data.earning_gbox;
      this.tableData = data.list;
      this.totalPage = res.data.totalPage;
      this.totalResult = res.data.totalResult;
    });
  },
};
</script>

<style lang="less" scoped>
.introduction {
  .join-button {
    margin: auto;
    margin-bottom: 26px;
    width: 136px;
    height: 40px;
    border-radius: 4px;
    .hvCenter();
    font-weight: 500;
    font-size: 19px;
    cursor: pointer;
  }
  .content-header {
    padding: 20px;
    img {
      width: 100%;
    }
  }
  .main-card {
    .example {
      .hvCenter();
      margin-left: 21px;
      width: 82px;
      height: 26px;
      border-radius: 0 0 5px 5px;
      font-size: 13px;
      font-weight: 500;
      color: #ffffff;
      line-height: 19px;
    }
  }
}
.IncomeList {
  display: flex;
  width: 100%;
  .IncomeItem {
    width: 33%;
    height: 188px;
    display: flex;

    padding: 20px;
    align-items:flex-start;
    justify-content: flex-start;
    flex-direction: column;
    margin-top: 32px;
    img {
      width: 44px;
      height: 44px;
    }
    .main-item {
      display: flex;
      height: 44px;
      .income-item {
        display: flex;
        align-items: flex-start;
        flex-direction: column;
        justify-content: center;
        margin-left: 21px;
      }
    }
    .js {
      margin-top: 39px;
      display: flex;
    }
  }
}
</style>
