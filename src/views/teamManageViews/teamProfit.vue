<template>
  <sub-page>
    <div class="team-index_container">
      <main-card>
        <cardTopInfoRed title="团队收益">
          <el-date-picker size="mini" class="dataPicker" v-model="queryInfo.profitDate" type="datetimerange"
            @change="selectTime" value-format="yyyy-MM-dd" start-placeholder="开始日期" end-placeholder="结束日期">
          </el-date-picker>
        </cardTopInfoRed>

        <!-- 团员收益 -->
        <div class="memberProfit">
          <div class="memberProfitLeft">
            团员收益:
          </div>
          <div class="memberProfitInfo">
            <el-row>
              <el-col :span="24">
                <header-icons :exists="['team_gift', 'team_super', 'team_hby', 'team_kbx', 'team_hbq']"
                  :dataObj="headerDatas" />
              </el-col>
            </el-row>
          </div>
        </div>
      </main-card>

      <!-- 团队收益 -->
      <main-card>
        <div class="teamMemberProfit">
          <div class="teamMemberProfitLeft">团队收益:</div>
          <div class="teamMemberProfitInfo">
            <el-row class="teamProfitOne">
              <el-col :span="24">
                <header-icons
                  :exists="['team_total_income', 'team_gift_income', 'team_super_income', 'team_hby_income']"
                  :dataObj="headerDatas" />
              </el-col>
            </el-row>
            <el-row class="teamProfitTwo">
              <div class="teamProfitTwoContainer">
                <header-icons :exists="['team_kbx_income', 'team_hbq_income']" :dataObj="headerDatas" />
                <!-- <header-icons :exists="['team_hbq_income']" :dataObj="headerDatas" /> -->
              </div>
            </el-row>
            <el-row class="teamProfitThree">
              <header-icons :exists="['team_additional_income', 'team_red_flow']"
                  :dataObj="headerLists" />
            </el-row>
          </div>
        </div>
      </main-card>
      <!-- 团队收益明细 -->
      <main-card>
        <cardTopInfoRed title="团队收益明细"></cardTopInfoRed>
        <el-table :data="teamMemberList" style="width: 100%;padding-left: 10px;">
          <el-table-column prop="emcee_name" label="主持人名称" width="100" align="center"></el-table-column>
          <el-table-column prop="phonenumber" label="手机号" width="120" align="center"></el-table-column>
          <el-table-column prop="theme" label="活动标题" width="120" align="center"></el-table-column>
          <el-table-column prop="using_date" label="使用日期" align="center"></el-table-column>
          <el-table-column prop="scenario_val" label="活动类型" align="center"></el-table-column>
          <el-table-column prop="team_total_income" label="团队总收益" align="center"></el-table-column>
          <el-table-column prop="team_gift_income" label="团队礼物收益" align="center"></el-table-column>
          <el-table-column prop="team_super_income" label="团队全屏特效收益" align="center"></el-table-column>
          <el-table-column prop="team_hby_income" label="团队红包雨收益" align="center"></el-table-column>
          <el-table-column prop="team_kbx_income" label="团队开宝箱收益" width="160" align="center"></el-table-column>
          <el-table-column prop="team_hbq_income" label="团队红包墙收益" width="160" align="center"></el-table-column>
        </el-table>
        <div class="pigination">
          <el-pagination background layout="prev, pager, next" :page-size="getInfoTotalshowCount"
            :total="getInfoTotalResult" :hide-on-single-page="true" class="my-pagination"
            @current-change="changePage1" />
        </div>
      </main-card>
    </div>
  </sub-page>
</template>
<script>
import { reqGetTeamBaseInfo, reqGetTeamIncome, reqGetTeamIncomeDetailList } from '@/api/teamManage/index';
import cardTopInfoRed from '@/components/cardTopInfoRed';
import MainCard from '@/components/mainCard';
import SubPage from '@/components/subPage';
import HeaderIcons from '@/layout/home/components/header/headerIcons';

export default {
  name: 'teamProfit',
  data() {
    return {
      currentPage: 1, // 当前页码
      showCount: 10, // 显示条数
      getInfoTotalshowCount: 10,
      getInfoTotalResult: 60,
      queryInfo: {
        profitDate: [], // 团队收益时间
      },
      headerLists: {
        team_additional_income: '', // 阶段性奖励：全部的
        team_red_flow: '', // 红包雨游戏总金额
      },
      headerDatas: {
      },
      // 团队收益明细列表
      teamMemberList: [
      ],
    };
  },
  computed: {},
  created() {
    this.reqGetTeamIncomeDetailList(); // 获取团队收益明细
    this.reqGetTeamIncome(); // 获取团员&团队收益金额
  },
  mounted() {
  },
  components: {
    SubPage,
    MainCard,
    cardTopInfoRed,
    HeaderIcons,
  },
  methods: {
    // 选择时间获取团员&团队收益金额
    selectTime() {
      const obj = {
        start_date: this.queryInfo.profitDate[0],
        end_date: this.queryInfo.profitDate[1],
      };
      // 选择时间后，获取团员收益
      reqGetTeamIncome(obj).then((res) => {
        this.headerDatas = res.data;
      });
      // 选择时间后，获取团队收益
      reqGetTeamBaseInfo(obj).then((res) => {
        this.headerLists = res.data;
      });
      // 获取团队收益明细列表
      // reqGetTeamIncomeDetailList();
    },
    // 获取团员&团队收益金额
    reqGetTeamIncome() {
      reqGetTeamIncome({
        start_date: this.queryInfo.profitDate[0],
        end_date: this.queryInfo.profitDate[1],
      }).then((res) => {
        this.headerDatas = res.data;
      });
      reqGetTeamBaseInfo().then((res) => {
        this.headerLists = res.data;
      });
    },
    // 获取团队收益明细列表
    reqGetTeamIncomeDetailList() {
      const obj = {
        currentPage: this.currentPage,
        showCount: this.showCount,
      };
      reqGetTeamIncomeDetailList(obj).then((res) => {
        this.teamMemberList = res.data.list;
        this.getInfoTotalResult = res.data.totalResult; // 总条数
      });
    },
    changePage1(val) {
      // 改变当前页
      this.currentPage = val;
      // 请求数据
      this.reqGetTeamIncomeDetailList(); // 获取团队收益明细
    },
  },
};
</script>
<style lang="less" scoped>
.dataPicker {
  width: 200px;
  margin-left: 10px;
}

// 团员收益
.memberProfit {
  width: 80vw;
  display: flex;
  padding-left: 20px;
  align-items: center;

  .memberProfitLeft {
    font-size: 20px;
    width: 100px;
  }

  .memberProfitInfo::v-deep {
    flex: 1;
    .header-icons {
      .item {
        border-right: unset;
        align-items: center;
        .right {
          white-space: nowrap;
          div {
            line-height: 2em;
          }
        }
      }
    }
  }
}

// 团队收益
.teamMemberProfit {
  width: 80vw;
  padding-left: 20px;
  display: flex;
  align-items: center;

  .teamMemberProfitLeft {
    font-size: 20px;
    width: 100px;
  }

  .teamMemberProfitInfo::v-deep {
    flex: 1;

    .teamProfitTwo {
      .teamProfitTwoContainer {
        .header-icons {
          &::before {
            content: '';
            display: block;
            width: 25%;
          }
          .item {
            width: 25%;
            flex-grow: 0;
          }
          &::after {
            content: '';
            display: block;
            width: 25%;
            order: 2;
          }
        }
      }
    }

     .header-icons {
      .item {
        border-right: unset;
        align-items: center;
        width: 25%;
        flex-grow: 0;
        .right {
          white-space: nowrap;
          div {
            line-height: 2em;
          }
        }
      }
     }

  }
}

.pigination {
  width: 85vw;
  height: 50px;
  display: flex;
  justify-content: center;
}
</style>
