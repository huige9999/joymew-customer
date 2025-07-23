<!--扭一扭-->
<template>
  <sub-page>
    <main-card>
      <!-- 头部数据 -->
      <header-datas class="head-info" :sumInfo="sumInfo" :exists="['paticipate', 'zyzTotalConsume', 'zyzPercent', 'zyzDivide']">
      </header-datas>
      <!-- 表格项 -->
      <my-table class="mytable" style="height: auto">
        <el-table :data="tableData" style="width: 100%" header-row-class-name="table-header">
          <el-table-column type="index" label="编号" width="120" align="center" header-align="center"> </el-table-column>
          <el-table-column label="姓名" min-width="130" header-align="center">
            <template slot-scope="scope">
              <div class="uploadImg">
                <!-- <el-avatar :size="22" :src="scope.row.headimgurl"></el-avatar>
                <span>{{ scope.row.nickname }}</span> -->
                <img width="22" height="22" :src="scope.row.avator" />
                <span class="text">{{ scope.row.wx_name }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="c01" label="中奖金额" min-width="120" align="center" header-align="center"> </el-table-column>
          <el-table-column prop="gsum" label="价格" min-width="120" align="center" header-align="center"></el-table-column>
          <!-- <el-table-column label="祝福语" min-width="120" align="center" header-align="center"></el-table-column> -->
          <el-table-column label="时间" min-width="120" align="center" header-align="center">
            <template slot-scope="scope">
              {{ new Date(scope.row.create_time) | formatDate }}
            </template>
          </el-table-column>
        </el-table>
        <!-- 导出报表 -->
        <export-table :URL="downLoadURL"> </export-table>
      </my-table>
    </main-card>
  </sub-page>
</template>

<script>
import SubPage from '@/components/subPage';
import MainCard from '@/components/mainCard';
import MyTable from '@/components/myTable';
import ExportTable from '@/components/exportTable';
import HeaderDatas from '@/views/activityViews/activityIncome/headerDatas';
import { getZyzListData } from '@/api/setting/activityIncome/activityIncomeData';
import { formatDate } from '@/utils/format';
import { BASEURL } from '@/utils/request';

export default {
  name: 'zyz',
  components: {
    SubPage, MainCard, MyTable, ExportTable, HeaderDatas,
  },
  data() {
    return {
      tableData: [],
      sumInfo: [],
      downLoadURL: '#',
    };
  },
  created() {
    this.getZyzList();
    const { liveId } = this.$store.state;
    this.downLoadURL = `${BASEURL}/reportFormsHm/findReportInfo?splid=${liveId}&giftid=DZP&sortGold=1&report_type=dzp_report`;
  },
  methods: {
    getZyzList() {
      const data = {
        // liveId: this.$store.state.liveId,
        // giftid: 'DZP',
        // currentPage: '1',
        // showCount: '500',
        // sortTime: '1',
        // sortGold: '1',
        // income_type: 'dzp',
        splid: this.$store.state.liveId,
        giftid: 'DZP',
        currentPage: '1',
        showCount: '500',
        sortTime: '1',
        sortGold: '1',
        income_type: 'dzp',
      };
      getZyzListData(data)
        .then((res) => {
          console.log('列表数据', res);
          this.tableData = res.data.list;
          this.sumInfo = res.data.info;
          console.log(this.sumInfo);
        })
        .catch((e) => {
          console.log(e);
        });
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
.head-info {
  display: flex;
}
.mytable {
  .uploadImg {
    display: flex;
    align-items: center;
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
</style>
