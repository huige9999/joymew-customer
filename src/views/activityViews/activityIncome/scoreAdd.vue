<template>
  <div class="container">
    <sub-page>
      <main-card>
        <!-- 表格项 -->
        <my-table
          class="mytable"
          style="height: auto"
        >
          <el-table
            :data="dataList"
            style="width: 100%"
            header-row-class-name="table-header"
          >
            <el-table-column
              type="index"
              label="编号"
              width="200"
              align="center"
              header-align="center"
            ></el-table-column>
            <el-table-column
              label="姓名"
              min-width="130"
              header-align="center"
            >
              <template slot-scope="scope">
                <div class="uploadImg">
                  <img
                    width="22"
                    height="22"
                    :src="scope.row.avator"
                  />
                  <span class="text">{{ scope.row.wx_name }}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              prop="miaoGiftName"
              label="礼物名称"
              min-width="120"
              align="center"
              header-align="center"
            ></el-table-column>
            <el-table-column
              prop="gift_price"
              label="价格"
              min-width="120"
              align="center"
              header-align="center"
            ></el-table-column>
            <el-table-column
              prop="gift_income"
              label="收益"
              min-width="120"
              align="center"
              header-align="center"
            ></el-table-column>
            <el-table-column
              prop="format_create_time"
              label="时间"
              min-width="120"
              align="center"
              header-align="center"
            ></el-table-column>
          </el-table>
          <!-- 导出报表 -->
          <export-table :URL="downLoadURL"></export-table>
        </my-table>
      </main-card>
    </sub-page>
  </div>
</template>

<script>
import SubPage from '@/components/subPage';
import MainCard from '@/components/mainCard';
import MyTable from '@/components/myTable';
import ExportTable from '@/components/exportTable';
import { getScoreAddListData } from '@/api/setting/activityIncome/activityIncomeData';
import { BASEURL } from '@/utils/request';

export default {
  data() {
    return {
      dataList: [],
      downLoadURL: '#',
    };
  },
  components: {
    SubPage,
    MainCard,
    MyTable,
    ExportTable,
  },
  created() {
    this.initData();
  },
  methods: {
    async initData() {
      try {
        const res = await getScoreAddListData();
        console.log(res); // res.data.list [{wx_name,avator,miaoGiftName,gift_price,gift_income,rate,format_create_time}]
        this.dataList = res.data.list;
        this.downLoadURL = `${BASEURL}/reportFormsHm/findReportInfo?splid=${this.$store.state.liveId}&report_type=score_report&type=addScore`;
      } catch (err) {
        console.log(err);
      }
    },
  },
};
</script>

<style lang="less" scoped>
.uploadImg {
  display: flex;
  align-items: center;
  img {
    border-radius: 50%;
    margin-right: 5px;
  }
}
</style>
