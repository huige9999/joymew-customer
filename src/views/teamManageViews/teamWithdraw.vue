<template>
  <sub-page>
    <div class="team-index_container" v-loading="isLoading">
      <main-card>
        <cardTopInfoRed title="团队收益提现"></cardTopInfoRed>
        <div class="teamIncomContainer">
          <el-row type="flex" class="row-bg">
            <el-col :span="6">
              <div class="grid-content bg-purple">
                <div class="rowText">团队总收益</div>
                ￥
                <count-up element-id="team_total_income" :count="dataObj.team_total_income || 0"></count-up>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="grid-content bg-purple-light withdraw-wrap">
                <div class="left">
                  <div class="rowText">可提现</div>
                  ￥
                  <count-up element-id="balance_withdraw" :count="dataObj.balance_withdraw || 0"></count-up>
                </div>
                <el-button type="primary" size="mini" round @click="getTotalMoney">提现</el-button>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="grid-content bg-purple">
                <div class="rowText">已提现</div>
                ￥
                <count-up element-id="has_tx_income" :count="dataObj.has_tx_income || 0"></count-up>
              </div>
            </el-col>
          </el-row>
          <el-row type="flex" class="row-bg">
            <el-col :span="6">
              <div class="grid-content bg-purple">
                <div class="rowText">团队额外奖励</div>
                ￥
                <count-up element-id="team_additional_income" :count="dataObj.team_additional_income || 0"></count-up>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="grid-content bg-purple-light withdraw-wrap">
                <div class="left">
                  <div class="rowText">可提现</div>
                  ￥
                  <count-up element-id="team_additional_withdraw" :count="dataObj.team_additional_withdraw || 0"></count-up>
                </div>
                <el-button type="primary" size="mini" round @click="getMoney">提现</el-button>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="grid-content bg-purple">
                <div class="rowText">已提现</div>
                ￥
                <count-up element-id="additional_has_tx_income" :count="dataObj.additional_has_tx_income || 0"></count-up>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="grid-content bg-purple">
                <div class="rowText">
                  不可提现
                  <el-popover placement="bottom-end" width="200" trigger="hover" :content="nextStageTargetTip">
                    <i class="el-icon-question question-icon" slot="reference" style="color: red"></i>
                  </el-popover>
                </div>
                ￥
                <count-up element-id="team_additional_next_income" :count="dataObj.team_additional_next_income || 0"></count-up>
              </div>
            </el-col>
          </el-row>
        </div>
      </main-card>
      <main-card>
        <cardTopInfoRed title="团队提现记录"></cardTopInfoRed>
        <div class="table-wrap">
          <el-table style="width: 100%;" :data="withdrawalRecordList">
            <el-table-column prop="redsum" label="提现金额" width="80" align="center"></el-table-column>
            <el-table-column prop="info.context" label="提现类型" width="120" align="center"></el-table-column>
            <el-table-column prop="finish_time" label="提现时间" align="center">
              <template slot-scope="scope">
                {{ new Date(scope.row.finish_time) | formatDate }}
              </template>
            </el-table-column>
            <el-table-column prop="paytype" label="提现账户" width="120" align="center"></el-table-column>
            <el-table-column prop="result_code" label="提现状态" align="center"></el-table-column>
          </el-table>
        </div>
        <div class="pigination">
          <el-pagination
            background
            layout="prev, pager, next"
            :page-size="getInfoTotalshowCount"
            :total="getInfoTotalResult"
            :hide-on-single-page="true"
            class="my-pagination"
            @current-change="changePage1"
          />
        </div>
      </main-card>
    </div>
  </sub-page>
</template>
<script>
import { reqGetTeamBaseInfo, reqGetWithdrawRecord, reqWithdrawExtraProfit, reqWithdrawTeamIncome } from '@/api/teamManage/index';
import cardTopInfoRed from '@/components/cardTopInfoRed';
import CountUp from '@/components/countUp';
import MainCard from '@/components/mainCard';
import SubPage from '@/components/subPage';
import { formatDate } from '@/utils/format';

const STAGE_MAP = {
  1000: '5万元',
  1500: '10万元',
  3000: '30万元',
  5000: '50万元',
  10000: '100万元',
};

export default {
  name: 'teamWithdraw',
  data() {
    return {
      getInfoTotalshowCount: 10,
      getInfoTotalResult: 0,
      dataObj: {
        team_total_income: 0, // 团队:团队总收益
        balance_withdraw: 0, // 团队总收益可提现
        has_tx_income: 0, // 团队收益已提现
        team_additional_income: 0, // 团队额外奖励
        team_additional_withdraw: 0, // 团队额外奖励可提现
      },
      currentPage: 1,
      showCount: 10,
      withdrawalRecordList: [
        {
          finish_time: '',
        },
      ], // 团队提现记录
      isLoading: false,
    };
  },
  filters: {
    // 时间戳
    formatDate(time) {
      return formatDate(time, 'yyyy/MM/dd hh:mm:ss');
    },
  },
  computed: {
    nextStageTargetTip() {
      if (this.dataObj?.team_additional_next_income) {
        return `您的团队红包雨流水尚未达至${STAGE_MAP[this.dataObj.team_additional_next_income]}。`;
      }
      return '';
    },
  },
  created() {
    this.reqGetWithdrawRecord(); // 收益提现记录
  },
  components: {
    SubPage,
    MainCard,
    cardTopInfoRed,
    CountUp,
  },
  methods: {
    // 团队总收益提现
    getTotalMoney() {
      const obj = {
        money: String(this.dataObj.balance_withdraw),
      };
      this.isLoading = true;
      reqWithdrawTeamIncome(obj)
        .then((res) => {
          console.log(res, '团队总收益提现');
          if (res.data.code === '200') {
            this.$message.success('提现成功');
            this.dataObj.balance_withdraw = 0;
          } else {
            this.$message.error(res.msg);
          }
          this.isLoading = false;
        })
        .catch((err) => {
          console.log(err);
          this.$message.error('网络错误!');
          this.isLoading = false;
        });
    },
    // 团队额外奖励提现
    getMoney() {
      console.log('团队额外奖励提现');
      const obj = {
        money: String(this.dataObj.team_additional_withdraw),
      };
      this.isLoading = true;
      reqWithdrawExtraProfit(obj)
        .then((res) => {
          console.log(res, '团队额外奖励提现');
          if (res.data.code === '200') {
            this.$message.success('提现成功');
            this.dataObj.team_additional_withdraw = 0;
          } else {
            this.$message.error(res.msg);
          }
          this.isLoading = false;
        })
        .catch((err) => {
          console.log(err);
          this.$message.error('网络错误!');
          this.isLoading = false;
        });
    },
    reqGetWithdrawRecord() {
      // 团队收益提现
      reqGetTeamBaseInfo().then((res) => {
        console.log(res, '团队收益明细');
        this.dataObj = res.data;
      });
      // 团队提现记录
      const obj = {
        currentPage: this.currentPage,
        showCount: this.showCount,
      };
      reqGetWithdrawRecord(obj).then((res) => {
        console.log(res, '团队提现记录列表');
        this.withdrawalRecordList = res.data.list;
        this.getInfoTotalResult = res.data.totalResult;
      });
    },
    changePage1(val) {
      // 改变当前页
      this.currentPage = val;
      // console.log(this.currentPage);
      // 请求数据
      this.reqGetWithdrawRecord(); // 获取团队收益明细
    },
  },
};
</script>
<style lang="less" scoped>
.teamIncomContainer {
  width: 80vw;
  padding-left: 20px;
  font-size: 14px;
  line-height: 2em;
  .row-bg {
    margin-bottom: 40px;
  }
  .withdraw-wrap {
    display: flex;
    align-items: flex-end;
    .left {
      margin-right: 20px;
    }
  }
}

.table-wrap {
  padding: 0 20px;
}
.pigination {
  width: 80vw;
  height: 50px;
  display: flex;
  justify-content: center;
}
</style>
