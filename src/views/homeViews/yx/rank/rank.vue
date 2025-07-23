<!--同庆楼首页-->
<template>
  <sub-page class="home">
    <main-card>
      <card-top-info title="活动数据"></card-top-info>
      <div class="tabs">
        <div class="tab" @click="changeTab(1)" :class="[{ active: currentTab === 1 }]">获奖名单</div>
        <div class="tab" @click="changeTab(0)" :class="[{ active: currentTab === 0 }]">用户排名</div>
      </div>
      <div>
        <!-- <el-button type="primary" style="margin-left: 10px;" @click="go()">返回活动列表页</el-button> -->
      </div>
      <my-table v-if="currentTab === 0" key="rank">
        <el-table :data="tableData" header-row-class-name="table-header" style="width: 100%">
          <el-table-column
            prop="order"
            label="排名"
            header-align="center"
            align="center"
            min-width="50"

          />

          <el-table-column label="用户" header-align="center" align="center" width="150">
            <template slot-scope="scope">
              <div class="user-wrap">
                <el-avatar :size="25" :src="scope.row.avator"></el-avatar>
                <div class="name">{{ scope.row.wx_name }}</div>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            prop="score"
            label="得分"
            header-align="center"
            align="center"
            min-width="50"
          />
          <el-table-column
            prop="award_grade"
            label="最佳成绩"
            header-align="center"
            align="center"
            min-width="50"
          />
          <el-table-column
            prop="award_name"
            label="奖品"
            header-align="center"
            align="center"
            min-width="50"
          />
          <el-table-column
            prop="real_name"
            label="姓名"
            header-align="center"
            align="center"
            min-width="50"
          />
          <el-table-column
            prop="phone"
            label="电话"
            header-align="center"
            align="center"
            min-width="50"
          />
          <el-table-column
            prop="end_time"
            label="参与时间"
            header-align="center"
            align="center"
            min-width="50"
          />
        </el-table>
      </my-table>
      <!-- 获奖名单 -->
      <my-table v-if="currentTab === 1"  key="sheet">
        <el-table :data="tableData" header-row-class-name="table-header" style="width: 100%">
          <!--        <el-table-column
            prop="order"
            label="排名"
            header-align="center"
            align="center"
            min-width="50"
          />-->

          <el-table-column label="中奖用户" header-align="center" align="center" width="150">
            <template slot-scope="scope">
              <div class="user-wrap">
                <el-avatar :size="25" :src="scope.row.avator"></el-avatar>
                <div class="name">{{ scope.row.wx_name }}</div>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            prop="phone"
            label="用户电话"
            header-align="center"
            align="center"
            min-width="50"
          />
          <el-table-column
            prop="award_grade"
            label="奖项等级"
            header-align="center"
            align="center"
            min-width="50"
          />
          <el-table-column
            prop="award_name"
            label="奖品"
            header-align="center"
            align="center"
            min-width="50"
          />
          <el-table-column
            prop="real_name"
            label="姓名"
            header-align="center"
            align="center"
            min-width="50"
          />

          <el-table-column
            prop="end_time"
            label="中奖时间"
            header-align="center"
            align="center"
            min-width="50"
          />
          <el-table-column label="收货地址" header-align="center" align="center" min-width="50">
            <template slot-scope="scope">{{ scope.row.location }} {{ scope.row.address }}</template>
          </el-table-column>
        </el-table>
      </my-table>
      <el-pagination
        background
        layout="prev, pager, next"
        :total="totalResult"
        :page-size="10"
        @current-change="changePage"
        class="my-pagination"
      ></el-pagination>
    </main-card>
  </sub-page>
</template>

<script>
// 首页头部信息
import SubPage from '@/components/subPage';
import MainCard from '@/components/mainCard';
import CardTopInfo from '@/components/cardTopInfo';
import messageMixin from '@/mixins/messageMixin';
import messageBoxMixin from '@/mixins/messageBoxMixin';

import MyTable from '@/components/myTable';

import { getMoreRank } from '@/api/yx/yx';

export default {
  mixins: [messageMixin, messageBoxMixin],
  name: 'yxRank',
  components: {
    CardTopInfo,
    MainCard,
    SubPage,

    MyTable,
  },
  created() {
    if (this.$route.query) {
      this.id = this.$route.params.id;
    }
    this.initData();
    // this.getTemplateList();
  },
  data() {
    return {
      currentTab: 1,
      tableData: [],
      // 总页数
      totalResult: 10,
      id: '',
      currentPage: 1,

    };
  },
  methods: {
    go() {
      // this.$router.go(-1);
      this.$router.push({
        path: '/app/yx',
      });
    },
    changePage(val) {
      this.currentPage = val;
      this.initData();
    },
    changeTab(tab) {
      if (tab === this.tab) {
        return;
      }
      this.tableData = [];
      this.totalResult = 10;
      this.currentPage = 1;
      this.currentTab = tab;
      this.initData();
    },
    initData() {
      this.getRank();
    },
    getRank() {
      getMoreRank({
        is_award_data: String(this.currentTab),
        activity_id: String(this.id),
        currentPage: String(this.currentPage),
        showCount: '10',
      }).then((res) => {
        console.log(res);
        let list = [];
        if (!res.data) {
          this.$message('暂无数据');
        } else {
          this.totalResult = res.data.totalResult;
          list = res.data.list.map((user, index) => {
            return {
              ...user,
              order: (this.currentPage - 1) * 10 + index + 1,
              name: user.wx_name,
              score: user.score,
              second: user.user_time,
              headImg: user.avator,
            };
          });
        }
        // this.tableData = this.tableData.concat(list);
        this.tableData = list;
      });
    },
    queryInfo() {
      this.initData();
    },
  },

};
</script>

<style lang="less" scoped>
.user-wrap {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding-left: 20px;
  .name {
    margin-left: 20px;
  }
}
.tabs {
  padding: 18px 36px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  .tab {
    width: 90px;
    height: 48px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 2px;
    color: #666666;
    cursor: pointer;
    &.active {
      background-color: rgba(30, 135, 240, 0.17);
      // opacity: 0.17;

      color: #1e87f0;
    }
  }
}
.home {
  .cardTopInfo::v-deep {
    .el-range-editor {
      &.el-input__inner {
        margin-right: 32px;
      }
    }
  }
  .schedule {
    &.lunch {
      color: #ebbc6b;
    }
    &.evening {
      color: #470886;
    }
  }
  .banben {
    &.wedding {
      color: #ff0148;
    }
    &.enterperise {
      color: #008dff;
    }
    &.birth {
      color: #ffb335;
    }
    &.school {
      color: #2dc8c8;
    }
    &.other {
      color: #55cf87;
    }
  }
  .benifit {
    color: #eb133c;
  }
  .searchForm {
    display: flex;
    align-items: center;
    .searchFItem {
      display: flex;
      align-items: center;
      margin-right: 24px;
    }
  }
}
</style>
