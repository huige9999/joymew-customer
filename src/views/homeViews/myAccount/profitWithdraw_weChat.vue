<!--提现记录-->
<template>
  <sub-page class="profitDetail">
    <content-header>
      <header-icons :exists="['totalProfit', 'canWithDraw', 'withdrawal', 'profit']" />
    </content-header>
    <main-card>
      <my-table style="height: 100%">
        <el-table :data="tableData" header-row-class-name="table-header" v-loading="tableLoading" style="width: 100%">
          <el-table-column prop="activityDate" label="活动时间" align="center" min-width="100"> </el-table-column>
          <el-table-column prop="type" label="类型" align="center"> </el-table-column>
          <el-table-column prop="totalWithDraw" label="提现金额" align="center"> </el-table-column>
          <el-table-column prop="getType" label="到账类型" align="center"> </el-table-column>
          <el-table-column prop="withDrawDate" label="到账时间" align="center" min-width="100"> </el-table-column>
          <el-table-column prop="status" label="发放状态" align="center"> </el-table-column>
        </el-table>
      </my-table>
      <el-pagination background layout="prev, pager, next" @current-change="changePage" :page-size="showCount"
        :total="totalCount" class="my-pagination" :hide-on-single-page="true" />
    </main-card>
  </sub-page>
</template>

<script>
import MainCard from '@/components/mainCard';
import MyTable from '@/components/myTable';
import SubPage from '@/components/subPage';
import ContentHeader from '@/layout/home/components/header/contentHeader';
import HeaderIcons from '@/layout/home/components/header/headerIcons';
import setTableData from '@/mixins/setTableData';

import messageMixin from '@/mixins/messageMixin';
import { formatDate } from '@/utils/format';

import { weChatWithDrawList } from '@/api/app/account';

export default {
  mixins: [setTableData, messageMixin],
  name: 'profitDetail',
  components: {
    HeaderIcons, ContentHeader, MainCard, MyTable, SubPage,
  },
  data() {
    return {
      tableData: [],
      tableLoading: true,
      showCount: 10,
      totalCount: 1,
      currentPage: 1,
    };
  },
  methods: {
    setTableInfo(data) {
      console.log(1);
      this.tableData.push({
        activityDate: formatDate(data.create_time),
        // withDrawDate: formatDate(data.end_time),
        withDrawDate: formatDate(data.finish_time),
        // type: this.formatType(data.lotteryId),
        type: this.formatType(data.diceid),
        getType: '微信零钱',
        // totalWithDraw: data.totalfee,
        totalWithDraw: data.redsum,
        status: this.formatStatus(data.result_code),
      });
    },
    formatData(res) {
      // this.weChatWithDrawList_axios(showCount, currentPage)
      // console.log(res)
      // console.log(res.list)
      // console.log(res.list.length)
      const { list } = res;

      for (let i = 0; i < list.length; i++) {
        // list[i].activityDate = formatDate(new Date(list[i].create_time), 'yyyy-MM-dd hh:mm:ss');
        // list[i].withDrawDate = formatDate(new Date(list[i].end_time), 'yyyy-MM-dd hh:mm:ss');
        // list[i].type = list[i].info.context;
        // list[i].getType = '微信零钱';
        // list[i].totalWithDraw = list[i].totalfee;
        // list[i].status = '已提现';
        list[i].activityDate = formatDate(new Date(list[i].create_time), 'yyyy-MM-dd hh:mm:ss');
        list[i].withDrawDate = formatDate(new Date(list[i].finish_time), 'yyyy-MM-dd hh:mm:ss');
        list[i].type = list[i].info.context;
        list[i].getType = '微信零钱';
        list[i].totalWithDraw = list[i].redsum;
        list[i].status = '已提现';
      }

      this.tableData = res.list;
      // for(let i = 0;i< res.list.length; i++){
      //   console.log(i)

      //   console.log(res.list[i])
      //   this.setTableInfo(res.list[i])
      // }
      // return res.list;
      console.log('******tableData******', this.tableData);
    },
    // 解析类型
    formatType(type) {
      switch (type) {
        case 'E1':
          return '礼物收益';
        case 'E3':
          return '邀请收益';
        case 'GA1':
          return '游戏收益';
        default:
          return '';
      }
    },
    // 解析状态
    formatStatus(status) {
      switch (status) {
        case 'SUCCESS':
          return '发放成功';
        default:
          return '发放失败';
      }
    },
    weChatWithDrawList_axios() {
      return weChatWithDrawList({
        showCount: this.showCount,
        currentPage: this.currentPage,
        request_from_page: 'app/myAccount/profitWithdraw-WeChat',
      })
        .then((response) => {
          console.table(response.data.list);
          if (response.code === 200) {
            return response.data;
          }
          throw new Error();
        })
        .catch(() => {
          this.alertError('请求错误！');
        });
    },
  },
  created() {
    // 必须设置相应函数名称
    this.init({
      getTableDataFuncName: 'weChatWithDrawList_axios', // axios函数名
      setTableDataFuncName: 'setTableInfo', // 填入表格的函数名
      tableLoadingVar: 'tableLoading', // v-loading变量名
      // firstLoadFuncName: 'firstLoad', // 首次请求回调函数名
      dataListName: 'tableData', // 表格数据名
      formatDataFuncName: 'formatData', // data -> datalist 映射函数
    });
  },
};
</script>

<style lang='less' scoped>
.profitDetail {
  .el-table::v-deep {
    .column-header {
      padding-left: 20px;
    }
  }
}
</style>
