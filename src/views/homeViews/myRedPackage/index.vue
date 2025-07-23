<template>
  <sub-page class="myRedPackage">
    <content-header>
      <header-icons :exists="['canUseHb', 'hbUsed', 'overdueHb']" :dataObj="headerIconData"></header-icons>
    </content-header>
    <main-card>
      <!-- <div class="hb-status">
        <div>红包状态</div>
        <div></div>
      </div> -->
      <my-table>
        <el-table :data="tableData" style="width: 100%" highlight-current-row header-row-class-name="table-header">
          <el-table-column type="index" width="120" align="center" label="序号"></el-table-column>
          <el-table-column prop="classification" label="红包类型" align="center" min-width="120">
            <template slot-scope="scope">
              <hb-status-circle
                style="margin: 0 auto"
                :text="scope.row.classification"
                :classStyle="circleColor(scope.row.classification)"
              ></hb-status-circle>
            </template>
          </el-table-column>
          <el-table-column prop="bonus" label="红包金额" align="center" min-width="120"></el-table-column>
          <el-table-column prop="rstate" label="红包状态" align="center" min-width="120">
            <template slot-scope="scope">
              <span :style="hbStatusStyle(scope.row.rstate)">{{ hbStatus(scope.row.rstate) }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="create_time" label="领取时间" align="center" min-width="120">
            <template slot-scope="scope">
              {{ new Date(scope.row.create_time) | formatDate }}
            </template>
          </el-table-column>
          <el-table-column prop="expire_time" min-width="120" align="center" label="过期时间"></el-table-column>
          <el-table-column prop="withdraw_time" label="是否提现" align="center" min-width="120">
            <template slot-scope="scope">
              {{ isWithdraw(scope.row.withdraw_time) }}
            </template>
          </el-table-column>
          <el-table-column prop="withdraw_time" align="center" label="提现时间" min-width="120">
            <template slot-scope="scope">
              {{ withdrawTime(scope.row.withdraw_time) }}
            </template>
          </el-table-column>
        </el-table>
      </my-table>
      <div class="pagination">
        <el-pagination
          @current-change="handleCurrentChange"
          background
          layout="prev, pager, next"
          :total="totalResult"
          :page-count="totalPages"
        >
        </el-pagination>
      </div>
      <div class="bottom-tipbar">
        <my-tip-bar class="my-tip-bar" colorStyle="yellow" width="100%">
          <div class="content">
            <div class="title">类型说明：</div>
            <hb-status-circle text="新" :classStyle="circleColor('新')"></hb-status-circle>
            <div class="text">新人红包奖励</div>
            <!-- <hb-status-circle width="20" height="20" text="扭" classStyle="purple"></hb-status-circle>
            <div class="text">扭一扭奖励</div> -->
            <hb-status-circle text="流" :classStyle="circleColor('流')"></hb-status-circle>
            <div class="text">流水红包奖励</div>
            <hb-status-circle text="钻" :classStyle="circleColor('钻')"></hb-status-circle>
            <div class="text">钻石红包奖励</div>
            <hb-status-circle text="铂" :classStyle="circleColor('铂')"></hb-status-circle>
            <div class="text">铂金红包奖励</div>
            <hb-status-circle text="金" :classStyle="circleColor('金')"></hb-status-circle>
            <div class="text">黄金红包奖励</div>
            <hb-status-circle text="银" :classStyle="circleColor('银')"></hb-status-circle>
            <div class="text">白银红包奖励</div>
            <hb-status-circle text="邀" :classStyle="circleColor('邀')"></hb-status-circle>
            <div class="text">邀请红包奖励</div>
          </div>
        </my-tip-bar>
        <my-tip-bar class="my-tip-bar" colorStyle="blue">
          <div>
            您最关心的：
            <el-tooltip
              class="item"
              effect="dark"
              content="1.节假日系统不定时发放红包、2.每邀请一名好友，获得一枚邀请红包"
              placement="top-start"
            >
              <span style="color: #2f90f1">如何获取红包？</span>
            </el-tooltip>
          </div>
        </my-tip-bar>
      </div>
    </main-card>
  </sub-page>
</template>
<script>
import SubPage from '@/components/subPage';
import MyTable from '@/components/myTable';
import MainCard from '@/components/mainCard';
import ContentHeader from '@/layout/home/components/header/contentHeader';
import HeaderIcons from '@/layout/home/components/header/headerIcons';
import MyTipBar from '@/components/myTipBar';
import request from '@/utils/request';
import { formatDate } from '@/utils/format';
import hbStatusCircle from './components/hbStatusCircle';

export default {
  name: 'index',
  components: {
    SubPage,
    MyTable,
    MainCard,
    ContentHeader,
    HeaderIcons,
    MyTipBar,
    hbStatusCircle,
  },
  created() {
    this.getHbList();
  },
  computed: {
    // 判断红包类型图标颜色
    circleColor() {
      return (data) => {
        if (data === '新') {
          return 'new';
        }
        if (data === '流') {
          return 'liushui';
        }
        if (data === '钻') {
          return 'zuan';
        }
        if (data === '铂') {
          return 'bo';
        }
        if (data === '金') {
          return 'jin';
        }
        if (data === '银') {
          return 'yin';
        }
        if (data === '邀') {
          return 'invite';
        }
        return 'new';
      };
    },
    // 判断红包状态
    hbStatus() {
      return (data) => {
        data += '';
        if (data === '-1') {
          return '已过期';
        }
        if (data === '1') {
          return '未使用';
        }
        return '已使用';
      };
    },
    hbStatusStyle() {
      return (data) => {
        data += '';
        if (data === '-1') {
          return {
            color: 'rgba(0, 0, 0, 0.65)',
          };
        }
        if (data === '1') {
          return {
            color: '#2F90F1',
          };
        }
        return {
          color: '#50B72A',
        };
      };
    },
    // 判断红包是否提现
    isWithdraw() {
      return (data) => (data ? '是' : '否');
    },
    // 提现时间
    withdrawTime() {
      return (data) => {
        if (!data) {
          return '';
        }
        return formatDate(new Date(data), 'yyyy-MM-dd');
      };
    },
  },
  filters: {
    // 时间戳
    formatDate(time) {
      return formatDate(time, 'yyyy-MM-dd');
    },
  },
  data() {
    return {
      tableData: [],
      currentPage: 1,
      pageSize: 10,
      headerIconData: {},
      totalPages: 1,
      totalResult: 0,
    };
  },
  methods: {
    handleCurrentChange(value) {
      console.log(value);
      this.currentPage = value;
      this.getHbList();
    },
    getHbList() {
      request
        .post('/hb/getRedenvelopeList', {
          currentPage: this.currentPage,
          showCount: this.pageSize,
        })
        .then((res) => {
          console.log(res, 'hbAwardList-----');
          this.tableData = res.data.list;
          this.headerIconData.keYongHb = res.data.keYongHb.bonus;
          this.headerIconData.guoQiHb = res.data.guoQiHb.bonus;
          this.headerIconData.yiLingHb = res.data.yiLingHb.bonus;
          this.totalPages = res.data.totalPage;
          this.totalResult = res.data.totalResult;
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
};
</script>
<style lang="less" scoped>
.my-tip-bar {
  .content {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    padding: 10px 0;
    .text {
      font-size: 9px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: rgba(0, 0, 0, 0.65);
      margin: 0 40px 0 10px;
    }
    .title {
      margin-right: 30px;
    }
  }
}
.pagination {
  padding: 30px 0 30px 30px;
  margin: 0 auto;
}
.table-container {
  width: 100%;
  padding: 0 30px;
  padding-top: 30px;
}
</style>
