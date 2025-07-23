<!--红包口袋-->
<template>
  <sub-page>
    <main-card style="height: auto">
      <!-- 头部数据 -->
      <header-datas class="head-info" :sumInfo="sumInfo" :exists="['topUpNum', 'topUpAmount', 'remainAmount']"> </header-datas>
      <!-- 头部菜单 -->
      <div class="topMenu"></div>
      <!-- 表格 -->
      <my-table class="mytable" style="height: auto">
        <el-table :data="tableData" style="width: 100%" header-row-class-name="table-header">
          <el-table-column type="index" label="编号" width="300" align="center" header-align="center"> </el-table-column>
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
          <el-table-column prop="gsum" label="金额" min-width="120" align="center" header-align="center" sortable></el-table-column>
          <el-table-column label="时间" min-width="120" align="center" header-align="center" sortable>
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
import { getRedPackageListData } from '@/api/setting/activityIncome/activityIncomeData';
import { formatDate } from '@/utils/format';
import { BASEURL } from '@/utils/request';

export default {
  name: 'redpackageRain',
  components: {
    MainCard, SubPage, MyTable, ExportTable, HeaderDatas,
  },
  data() {
    return {
      tableData: [],
      sumInfo: [],
      downLoadURL: '#',
    };
  },
  created() {
    this.getRedPackageList();
    const { liveId } = this.$store.state;
    this.downLoadURL = `${BASEURL}/reportFormsHm/findReportInfo?splid=${liveId}&giftid=HBKD&sortGold=1&report_type=hbkd_report`;
  },
  methods: {
    // 红包口袋
    getRedPackageList() {
      const data = {
        // liveId: this.$store.state.liveId,
        // giftid: 'HBKD',
        // currentPage: '1',
        // showCount: '500',
        // sortTime: '2',
        // sortGold: '2',
        // income_type: 'hbkd',
        splid: this.$store.state.liveId,
        giftid: 'HBKD',
        currentPage: '1',
        showCount: '500',
        sortTime: '2',
        sortGold: '2',
        income_type: 'hbkd',
      };
      getRedPackageListData(data)
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
    // 下拉框状态改变
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
