<template>
    <div class="login-record-container">
        <div class="part-title">登录日志</div>
        <div class="login-record-table">
            <el-table :data="loginRecordList" :header-cell-style="{ background: '#f2f3f5' }">
                <el-table-column label="日志记录">
                    <template slot-scope="scope">
                        <span>{{ name + ' ' + scope.row.login_time + ' 登录了合伙人系统' }}</span>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagenation" v-if="total > 0">
                <el-pagination background v-show="total > 0" layout=" prev, pager, next, total" :total="total"
                    :page.sync="currentPage" :limit.sync="showCount" @current-change="changePage" />
            </div>
        </div>
    </div>
</template>
<script>
import {
  getLoginRecordList,
} from '@/api/partnerSystem/index';

export default {
  name: 'PartnerLoginRecord',
  data() {
    return {
      loginRecordList: [],
      showCount: 10,
      currentPage: 1,
      total: 0,
      totalPage: 0,
      isLoading: false,
    };
  },
  created() {
    this.getLoginRecordList();
  },
  methods: {
    async getLoginRecordList() {
      this.isLoading = true;
      const res = await getLoginRecordList({
        showCount: this.showCount,
        currentPage: this.currentPage,
      });
      this.isLoading = false;
      const target = res.data;
      this.loginRecordList = [...target.list];
      this.total = target.totalResult;
      this.totalPage = target.totalPage;
      this.name = target.name;
    },
    changePage(val) {
      this.currentPage = val;
      this.isLoading = true;
      this.getLoginRecordList();
    },
  },
};
</script>
<style lang="less" scoped>
.login-record-container {
    width: 100%;
    padding: 20px;
    box-sizing: border-box;
    background-color: #fff;
    border-radius: 6px;

    .part-title {
        color: #1D2129;
        font-size: 20px;
        font-weight: bold;
        margin-bottom: 20px;
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
