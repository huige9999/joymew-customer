<template>
    <div class="settle-record-container">
        <div class="page-title">
            结算记录
        </div>
        <div class="settle-record-table">
            <el-table v-loading="isloading" border :data="settleRecordList" :header-cell-style="{background:'#f2f3f5'}" style="width: 100%">
                <el-table-column prop="emcee_name" label="姓名" header-align="center" align="center" min-width="80">
                    <template slot-scope="scope">
                        <el-avatar :size="22" :src="scope.row.avator"></el-avatar>
                        <span style="margin-left: 5px; width: 60px; display: inline-block; text-align: center">{{
                            scope.row.emcee_name }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="phonenumber" label="手机号" header-align="center" align="center" min-width="80">
                    <template slot-scope="scope">
                        <span>{{ scope.row.phonenumber }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="month" header-align="center" align="center" label="月份">
                    <template slot-scope="scope">
                        <span>{{ scope.row.month }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="my_income" header-align="center" align="center" label="一级团队礼物总收益" min-width="130">
                    <template slot-scope="scope">
                        <span>{{ scope.row.one_income }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="two_income" header-align="center" align="center" label="二级团队礼物总收益" min-width="130">
                    <template slot-scope="scope">
                        <span>{{ scope.row.two_income }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="total_income" header-align="center" align="center" label="总收益">
                    <template slot-scope="scope">
                        <span>{{ scope.row.total_income }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="rate" header-align="center" align="center" label="分成比例">
                    <template slot-scope="scope">
                        <span>{{ scope.row.rate }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="my_income" header-align="center" align="center" label="我的分成">
                    <template slot-scope="scope">
                        <span>{{ scope.row.my_income }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="status" header-align="center" align="center" label="结算状态">
                    <template slot-scope="scope">
                        <span :class="{settled: scope.row.status === '1'}">{{ scope.row.status === "1" ? "已结算" : "未结算" }}</span>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="pagenation" v-if="total > 0">
            <el-pagination background v-show="total > 0" layout=" prev, pager, next, total" :total="total" :page.sync="currentPage"
                :limit.sync="showCount" @current-change="changePage" />
        </div>
    </div>
</template>
<script>
import {
  getSettleRecordList,
} from '@/api/partnerSystem/index';

export default {
  name: 'PartnerSettleRecord',
  data() {
    return {
      isloading: false,
      total: 0,
      showCount: 10,
      currentPage: 1,
      totalPage: 1,
      settleRecordList: [],
    };
  },
  created() {
    this.getSettleRecordList();
  },
  methods: {
    async getSettleRecordList() {
      this.isloading = true;
      const res = await getSettleRecordList({
        showCount: this.showCount,
        currentPage: this.currentPage,
      });
      console.log('结算详情列表：', res.data);
      this.isloading = false;
      this.total = res.data.totalResult;
      this.totalPage = res.data.totalPage;
      this.settleRecordList = [...res.data.list];
    },
    changePage(val) {
      // 显示加载图标
      this.isLoading = true;
      // 改变当前页
      this.currentPage = val;
      this.getSettleRecordList();
    },
  },
};
</script>
<style lang="less" scoped>
.settle-record-container {
    width: 100%;
    padding: 20px;
    box-sizing: border-box;
    background-color: #fff;
    border-radius: 6px;

    .settle-record-table {
        margin-top: 20px;
    }

    .page-title {
        font-size: 20px;
        font-weight: bold;
    }

    .settled {
        color: #C9CDD4;
    }
    .pagenation {
        width: 100%;
        padding: 20px 0 0 0;
        box-sizing: border-box;
        display: flex;
        justify-content: center;
        align-items: center;
    }
}
</style>
