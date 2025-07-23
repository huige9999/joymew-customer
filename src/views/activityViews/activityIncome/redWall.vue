<!--红包墙-->
<template>
  <sub-page>
    <main-card>
      <!-- 头部数据 -->
      <header-datas class="head-info" :sumInfo="sumInfo" :exists="['buyWall', 'redConsume', 'redPercent', 'redDivide']"> </header-datas>
      <!-- 轮数切换 -->
      <change-sort :totleSort="totleSort" v-if="totleSort" @sortClick="changeSort"></change-sort>
      <!-- 表格项 -->
      <my-table class="mytable" style="height: auto">
        <el-table :data="tableData" style="width: 100%" header-row-class-name="table-header">
          <el-table-column type="index" label="编号" width="200" align="center" header-align="center"> </el-table-column>
          <el-table-column label="姓名" min-width="130" header-align="center">
            <template slot-scope="scope">
              <div class="uploadImg">
                <!-- <el-avatar :size="22" :src="scope.row.avator"></el-avatar>
                <span>{{ scope.row.wx_name }}</span> -->
                <img width="22" height="22" :src="scope.row.avator" />
                <span class="text">{{ scope.row.wx_name }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="gift_price" label="红包" min-width="120" align="center" header-align="center"> </el-table-column>
          <el-table-column prop="buyamount" label="价格" min-width="120" align="center" header-align="center"></el-table-column>
          <el-table-column label="时间" min-width="120" align="center" header-align="center">
            <template slot-scope="scope">
              {{ new Date(scope.row.create_time) | formatDate }}
            </template>
          </el-table-column>
        </el-table>
        <!-- 导出报表 -->
        <export-table :URL="downLoadURL"> </export-table>
      </my-table>
      <!-- <div class="pageNation-container">
        <el-pagination
          background
          :page-size="pageSize"
          @current-change="handleCurrentChange"
          layout="prev, pager, next"
          :total="totalResult"
        >
        </el-pagination>
      </div> -->
    </main-card>
  </sub-page>
</template>

<script>
import SubPage from '@/components/subPage';
import MainCard from '@/components/mainCard';
import MyTable from '@/components/myTable';
import ExportTable from '@/components/exportTable';
import HeaderDatas from '@/views/activityViews/activityIncome/headerDatas';
import { getWallListData } from '@/api/setting/activityIncome/activityIncomeData';
import { formatDate } from '@/utils/format';
import changeSort from '@/views/activityViews/gamesSetting/commonCpn/changeSort';
import { BASEURL } from '@/utils/request';

export default {
  name: 'redWall',
  components: {
    SubPage, MainCard, MyTable, ExportTable, HeaderDatas, changeSort,
  },
  data() {
    return {
      tableData: [],
      sumInfo: [],
      totleSort: 1, // 总轮数
      currentSort: 1,
      totalResult: 1,
      currentPage: 1,
      pageSize: 30, // 人数单页最多
      downLoadURL: '#',
    };
  },
  created() {
    /* 默认加载第一轮 */
    this.getBoxList();
    const { liveId } = this.$store.state;
    this.downLoadURL = `${BASEURL}/reportFormsHm/findReportInfo?splid=${liveId}&report_type=hbq_report`;
  },
  methods: {
    handleCurrentChange(page) {
      console.log(page);
      this.currentPage = page;
      this.getBoxList();
    },

    /* 切换轮数 */
    changeSort(item) {
      this.currentSort = item;
      console.log(this.currentSort);
      this.getBoxList(item);
    },
    getBoxList() {
      const data = {
        // liveId: this.$store.state.liveId,
        // sort: `${this.currentSort}`,
        // currentPage: `${this.currentPage}`,
        // showCount: `${this.pageSize}`,
        // income_type: 'zjd',
        splid: this.$store.state.liveId,
        order_by: `${this.currentSort}`,
        currentPage: `${this.currentPage}`,
        // showCount: `${this.pageSize}`,
        showCount: '100',
        earning_type: 'hbq',
      };
      console.log(this.currentPage, '********');
      getWallListData(data).then((res) => {
        console.log('guessBox', res);
        this.tableData = res.data.list;
        this.sumInfo = res.data.info;
        this.totleSort = res.data.maxSort;
        this.totalResult = res.data.totalResult;
        this.pageSize = res.data.totalResult;
      });
      console.log(this.pageSize);
    },
  },
  filters: {
    // 时间戳
    formatDate(time) {
      return formatDate(time, 'yyyy/MM/dd hh:mm:ss');
    },
  },
};
</script>
<style lang="less" scoped>
.mytable {
  .uploadImg {
    display: flex;
    align-items: center;
    // justify-content: center;
    margin-left: 50px;
    img {
      border-radius: 50%;
      margin-right: 5px;
      vertical-align: middle;
    }
  }
  .text {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
}
.pageNation-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px 0;
}
</style>
