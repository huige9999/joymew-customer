<!--照片-->
<template>
  <sub-page>
    <main-card>
      <!-- 头部数据 -->
      <header-datas class="head-info" :sumInfo="sumInfo" :exists="['photoAmount', 'photoConsume', 'photoPercent', 'photoDivide']">
      </header-datas>
      <!-- 表格组件 -->
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
          <el-table-column label="照片" min-width="120" align="center" header-align="center">
            <template slot-scope="scope">
              <el-image style="width: 150px; height: 90px" :src="scope.row.c02"></el-image>
            </template>
          </el-table-column>
          <el-table-column prop="gift_price" label="价格" min-width="120" align="center" header-align="center"></el-table-column>
          <el-table-column prop="gift_income" label="收益" min-width="120" align="center" header-align="center"></el-table-column>
          <el-table-column prop="c01" label="祝福语" min-width="120" align="center" header-align="center"></el-table-column>
          <el-table-column label="时间" min-width="120" align="center" header-align="center">
            <template slot-scope="scope">
              {{ new Date(scope.row.create_time) | formatDate }}
            </template>
          </el-table-column>
          <el-table-column label="操作" min-width="120" align="center" header-align="center">
            <template slot-scope="scope">
              <el-button type="primary" size="small" @click="resendGift(scope.row)">重新发送</el-button>
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
import { getPhotoListData, resendGift } from '@/api/setting/activityIncome/activityIncomeData';
import { formatDate } from '@/utils/format';
import { BASEURL } from '@/utils/request';

export default {
  name: 'photo',
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
    this.getPhotoList();
    const { liveId } = this.$store.state;
    this.downLoadURL = `${BASEURL}/reportFormsHm/findReportInfo?splid=${liveId}&report_type=gift_report`;
  },
  methods: {
    getPhotoList() {
      const data = {
        splid: this.$store.state.liveId,
        preName: 'Miao_Tp%',
        currentPage: '1',
        showCount: '500',
        income_type: 'Miao_Tp',
      };
      getPhotoListData(data)
        .then((res) => {
          console.log('照片列表数据', res);
          this.tableData = res.data.list;
          this.sumInfo = res.data.info;
          console.log(this.sumInfo);
        })
        .catch((e) => {
          console.log(e);
        });
    },
    resendGift(pObj) {
      console.log(pObj);
      resendGift({
        id: pObj.id,
        splid: this.$store.state.liveId,
      })
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
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
